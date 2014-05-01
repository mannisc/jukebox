﻿; -:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-
;
;         JSON decoder & encoder
;                                 for PureBasic v4.51+
;
; -:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-
;
; from:  01.08.2013
; version: 0.7.2
;
; {|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}
;
;
; © 2011-2013 by PMV 
; 
;
; {|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}-{|}
;
;
; syntax:
; *jsonObj.jsonObj = JSON_decode(string.s)
;
; description:
; The return value contains the new data created from a json-string.
; If it is #False, there is an error in the given json-string.
;
; *jsonObj\type will return what type it is
; *jsonObj\o("Key") is a map, used if it is a #JSON_Type_Object
; *jsonObj\a(3)     is an array, used if it is a #JSON_Type_Array
;     *jsonObj\length contains the length of this array
;     you need to call JSON_dimArray(jsonObj, Size) to create it
; *jsonObj\s        is a string, used if it is a #JSON_Type_String
; *jsonObj\i        is an integer, used if it is a #JSON_Type_Integer
; *jsonObj\f        is an doublefloat, used if it is a #JSON_Type_Float
; special handling: #JSON_Type_Null, #JSON_Type_True, #JSON_Type_False
;     additional #False, #True, #Null are set for \i and \f
;
; ----
;
; syntax:
; string.s = JSON_encode(*jsonObj.jsonObj)
;
; description:
; returns an ready to write json-string
; hint: this function uses a threaded string-buffer to be very fast.
; You can call this function with a huge amount of data and it is
; still threadsafe. But if the string-buffer is not needed any longer,
; please use JSON_freeStringBuffer() to free this huge amount of memory.
;
;
; ----
;
; syntax:
; JSON_freeStringBuffer()
;
; description:
; The string-buffer for JSON_encode() is not freeed automatically after
; use. If you have a huge amount of data (like 100 MByte), and you know
; you will not need this again, call this function to free the string-buffer.
; hint: The string-buffer is threaded, so this function is needed to be
; called in the same thread as the JSON_encode() function!
;
;
; ----;
; syntax:
; JSON_clear(*jsonObj.jsonObj, initialize.i = #True)
;
; description:
; resets the whole json object, it will be as it was at the beginning.
;
;
; ----
;
; syntax:
; JSON_free(*jsonObj.jsonObj)
;
; description:
; frees the whole json object
;
;
; ----
;
; syntax:
; JSON_dimArray(*jsonObj.jsonObj, Size.i)
;
; description:
; To create an array in your JSON-Object, you need to call this to dim
; the array. After this call, you can use the array like normal.
;
;
; ----
;
; syntax:
; JSON_newPair(*jsonObj.jsonObj, Name.s)
;
; description:
; If you use #JSON_UseObjectPointer, you need this, to create a new
; name/value pair in your JSON-Object, After this call, you can use
; the name/ value pair like normal. If it is used on a not created
; object, it will initialize the object like JSON_newObject() would
; do. So, you can skip the call to JSON_newObject().
;
;
; ----
;
; syntax:
; JSON_newObject(*jsonObj.jsonObj)
;
; description:
; If you use #JSON_UseObjectPointer, you need this, to create a blank
; new object in your JSON-Object, After this call, you will have a
; empty object. To get name/ value pairs use JSON_newPair() and to
; get an array use JSON_dimArray().
; hint: JSON_newPair() has implemented the same functionality 
;
;
; ----
;
; syntax:
; JSON_create()
;
; description:
; This is needed, if your root object is a pointer and not a normal
; structured variable. With this, you can initialize the root element.
;
;
; ----
;
; for debugging: you can call JSON_Debug(*jsonObj.jsonObj) to print all
; elements to the debugger. This procedure is ignored if debugger
; is deactivated, so you doesn't need to uncommend it for final releases.
;
; ----
;
; special features: you can uncommend the first line of code to define
; the #JSON_UseObjectPonter constant. At default, the jsonObj structure
; containts always a whole map. So it will need much memory and the
; creation of a new object is a little bit slower as it could. If you
; create really big JSON objects, you will need this to minimize the
; memory usage and to speed up the initialization of every object.
;
; -|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-

;#JSON_UseObjectPointer = #True

#JSON_DefaultMapSlots = 10   ;-change default map-slots if needed!
#JSON_parseArraySteps = 10   ;used in internal procedure JSON_parseArray()
#JSON_StringBufferSize = 256 ;start-size of return-string from JSON_encode()

;-
; ---------------------------------------------
;- internal functions
;----------------------------------------------

Threaded *json_string_buffer
Threaded *json_string_next
Threaded json_string_space.i

Declare.i JSON_parseObject(*c, *out, nullByte.i)
Structure jsonObj
  type.i
  CompilerIf Defined(JSON_UseObjectPointer, #PB_Constant)
    Map *o.jsonObj(#JSON_DefaultMapSlots) 
  CompilerElse
    Map o.jsonObj(#JSON_DefaultMapSlots)
  CompilerEndIf
  Array *a.jsonObj(1)
  StructureUnion
    length.i   ;if it is an array
    i.i
  EndStructureUnion
  f.d
  s.s
EndStructure


Enumeration
  #JSON_Type_Undefined
  #JSON_Type_String
  #JSON_Type_Object
  #JSON_Type_Null
  #JSON_Type_True
  #JSON_Type_False
  #JSON_Type_Array
  #JSON_Type_Integer
  #JSON_Type_Float
EndEnumeration

Macro JSON_readChar(CHAR)
  Repeat
    If *c >= nullByte : ProcedureReturn #False : EndIf
    Select *c\c
      Case ' ', 9, 10, 13 ;whitespaces
        *c + SizeOf(CHARACTER)
      Case CHAR
        Break
      Default
        ProcedureReturn #False
    EndSelect
  ForEver
  *c + SizeOf(CHARACTER)
EndMacro

Macro JSON_readWhitespaces()
  While *c\c = ' ' Or *c\c = 9 Or *c\c = 10 Or *c\c = 13
    If *c >= nullByte : ProcedureReturn #False : EndIf
    *c + SizeOf(CHARACTER)
  Wend
EndMacro

Procedure.i JSON_getType(*obj.jsonObj)
  If *obj\type <> #JSON_Type_Undefined
    ProcedureReturn *obj\type
  EndIf 
  
CompilerIf Defined(JSON_UseObjectPointer, #PB_Constant)
  If *obj\s
CompilerElse
  If MapSize(*obj\o())  
    ProcedureReturn #JSON_Type_Object
  ElseIf *obj\s
CompilerEndIf
    ProcedureReturn #JSON_Type_String
  ElseIf *obj\f
    ProcedureReturn #JSON_Type_Float
  Else ;If *obj\i
    ProcedureReturn #JSON_Type_Integer
  EndIf
EndProcedure

Procedure.s JSON_parseString(*c.CHARACTER, nullByte.i, *result.INTEGER)
  Protected i.i, hexDigit.s
  Protected string.s = ""
  
  Repeat
    Select *c\c
      Case '"'
        Break
      Case '\'
        *c + SizeOf(CHARACTER)
        
        Select *c\c
          Case '"', '\', '/'
            string + PeekS(*c, 1)
          Case 'n' ; new line
            string + Chr(10)
          Case 'r' ; carriage return
            string + Chr(13)
          Case 't' ; tabulator
            string + Chr(9)
          Case 'u' ; 4 hex digits
            *c + SizeOf(CHARACTER)
            If nullByte - *c > 4 * SizeOf(CHARACTER)
              hexDigit = "$" + PeekS(*c, 4)
              *c + SizeOf(CHARACTER) * 3
              string + Chr(Val(hexDigit))
            Else
              ; unexpected end of string, returns the string up to the
              ; end, *result\i is set to #False to indicate the error state
              *result\i = #False
              ProcedureReturn string
            EndIf
          Case 'b' ; backspace
            string + Chr(8)
          Case 'f' ; formfeed
            string + Chr(14)
          Default ;not allowed! But this will tolerate a single
            ; backslash without above following char by ignoring it
            *c - SizeOf(CHARACTER)
        EndSelect
      Default
        string + PeekS(*c, 1)
    EndSelect
    *c + SizeOf(CHARACTER)
    If *c >= nullByte
      ; unexpected end of string, returns the string up to the
      ; end, *result\i is set to #False to indicate the error state
      *result\i = #False
      ProcedureReturn string
    EndIf
  ForEver
  ;Debug "String: " + string
  
  *result\i =  *c + SizeOf(CHARACTER)
  ProcedureReturn string
EndProcedure

Procedure.i JSON_parseNumber(*c.CHARACTER, *out.jsonObj, nullByte)
  Protected string.s, e.s
  Protected *first = *c

  If LCase(PeekS(*c, 4)) = "null"
    *out\f = #Null
    *out\i = #Null
    *out\type = #JSON_Type_Null
    ;Debug "Number: null"
    ProcedureReturn *c + SizeOf(CHARACTER) * 4
  ElseIf LCase(PeekS(*c, 5)) = "false"
    *out\f = #False
    *out\i = #False
    *out\type = #JSON_Type_False
    ;Debug "Number: false"
    ProcedureReturn *c + SizeOf(CHARACTER) * 5
  ElseIf LCase(PeekS(*c, 4)) = "true"
    *out\f = #True
    *out\i = #True
    *out\type = #JSON_Type_True
    ;Debug "Number: true"
    ProcedureReturn *c + SizeOf(CHARACTER) * 4
  EndIf
   
  If *c\c = '-' : *c + SizeOf(CHARACTER) : EndIf
  Repeat
    Select *c\c
      Case '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'
        
      Case 'e', 'E'
        *c\c = 'e'
        *c + SizeOf(CHARACTER)
        If *c\c <> '-' And *c\c <> '+' : *c - SizeOf(CHARACTER) : EndIf
      Case ' ', 9, 10, 13, ',', ']', '}'
        Break
      Default
        ProcedureReturn #False
    EndSelect
        
    *c + SizeOf(CHARACTER)
    If *c >= nullByte : ProcedureReturn #False : EndIf
  ForEver 
  
  string = PeekS(*first, (*c - *first) / SizeOf(CHARACTER))
  If FindString(string, ".", 1)
    *out\s = string  ; used for JSON_encode()
    *out\f = ValD(string)
    *out\i = *out\f
    *out\type = #JSON_Type_Float
    ;Debug "Float: " + StrD(*out\f)
  ElseIf FindString(string, "e", 1)
    *out\s = string  ; used for JSON_encode()
    e = StringField(string, 2, "e")
    string = StringField(string, 1, "e")
    
    *out\f = ValD(string) * Pow(10, Val(e))
    *out\i = *out\f
    *out\type = #JSON_Type_Float
    ;Debug "Float: " + StrD(*out\f)
  Else
    *out\i = Val(string)
    *out\f = *out\i
    *out\type = #JSON_Type_Integer
    ;Debug "Integer: " + Str(*out\i)
  EndIf
  
  ProcedureReturn *c
EndProcedure
  
Procedure.i JSON_parseArray(*c.CHARACTER, *out.jsonObj, nullByte.i)
  Protected string.s, i.i = 0, result.i
  Protected arrayLength.i = #JSON_parseArraySteps
  *out\type = #JSON_Type_Array
  
  JSON_readWhitespaces()
  If *c\c = ']' : ProcedureReturn *c + SizeOf(CHARACTER) : EndIf
  
  ReDim *out\a.jsonObj(arrayLength)
  Repeat
    *out\a(i) = AllocateMemory(SizeOf(jsonObj))
    
    ; read the value
    Select *c\c
      Case '{'
        InitializeStructure(*out\a(i), jsonObj)
        result = JSON_parseObject(*c + SizeOf(CHARACTER), *out\a(i), nullByte)
        
      Case '['
        InitializeStructure(*out\a(i), jsonObj)
        result = JSON_parseArray(*c + SizeOf(CHARACTER), *out\a(i), nullByte)
        
      Case '"'
        string = JSON_parseString(*c + SizeOf(CHARACTER), nullByte, @result)
        *out\a(i)\s = string
        *out\a(i)\type = #JSON_Type_String
        
      Default ;Number
        result = JSON_parseNumber(*c, *out\a(i), nullByte)
    
    EndSelect
    ; --------
    
    If Not result : ProcedureReturn #False : EndIf
    *c = result
    JSON_readWhitespaces()
    If *c\c = ','
      i + 1
      If i > arrayLength
        arrayLength + #JSON_parseArraySteps
        ReDim *out\a.jsonObj(arrayLength)
      EndIf
      *c + SizeOf(CHARACTER)
      JSON_readWhitespaces() 
    ElseIf *c\c = ']'
      Break
    EndIf 
  ForEver
  ReDim *out\a.jsonObj(i)
  *out\length = i + 1
  
  ProcedureReturn *c + SizeOf(CHARACTER)
EndProcedure

Procedure.i JSON_parseObject(*c.CHARACTER, *out.jsonObj, nullByte.i)
  Protected result.i, string.s, key.s
  *out\type = #JSON_Type_Object
  
  
  JSON_readWhitespaces()
  If *c\c = '}' : ProcedureReturn *c + SizeOf(CHARACTER) : EndIf
  
  Repeat 
    ; read the string-key at first
    If *c\c <> '"' : ProcedureReturn #False : EndIf
    *c + SizeOf(CHARACTER)
    key = JSON_parseString(*c, nullByte, @result)
    If Not result : ProcedureReturn #False : EndIf
    *c = result
    ; -----------
    
    JSON_readChar(':')
    JSON_readWhitespaces()
    
    *out\o(key) 
    CompilerIf Defined(JSON_UseObjectPointer, #PB_Constant)
      *out\o() = AllocateMemory(SizeOf(jsonObj))
    CompilerEndIf
      
    ; read the value
    Select *c\c
      Case '{'
        CompilerIf Defined(JSON_UseObjectPointer, #PB_Constant)
          InitializeStructure(*out\o(), jsonObj)
        CompilerEndIf
        result = JSON_parseObject(*c + SizeOf(CHARACTER), *out\o(), nullByte)
        
      Case '['
        CompilerIf Defined(JSON_UseObjectPointer, #PB_Constant)
          InitializeStructure(*out\o(), jsonObj)
        CompilerEndIf
        result = JSON_parseArray(*c + SizeOf(CHARACTER), *out\o(), nullByte)
        
      Case '"'
        string = JSON_parseString(*c + SizeOf(CHARACTER), nullByte, @result)
        *out\o(key)\s = string
        *out\o()\type = #JSON_Type_String
        
      Default ;Number
        result = JSON_parseNumber(*c, *out\o(), nullByte)
    
    EndSelect
    ; --------
    
    If Not result : ProcedureReturn #False : EndIf
    *c = result
    JSON_readWhitespaces()
    If *c\c = ','
      *c + SizeOf(CHARACTER)
      JSON_readWhitespaces() 
    ElseIf *c\c = '}'
      Break
    EndIf
    
    If *c\c = '}' : ProcedureReturn #False : EndIf
 ForEver
  
  ProcedureReturn *c + SizeOf(CHARACTER)
EndProcedure

Procedure JSON_addString(string.s)
  Protected size.i = StringByteLength(string)
  Protected used.i = *json_string_next - *json_string_buffer
  
  While json_string_space - used <= size
    json_string_space = json_string_space * 2
    *json_string_buffer = ReAllocateMemory(*json_string_buffer, json_string_space)
    *json_string_next = *json_string_buffer + used
  Wend
  CopyMemoryString(@string, @*json_string_next)
EndProcedure


Procedure JSON_addEscapedString(string.s)
  Protected *c.CHARACTER = @string
  Protected last.i = *c + StringByteLength(string)
  Protected *start = *c
  Protected i.i = 0
  
  While  *c < last
    If *c\c = '\' Or *c\c = '/' Or *c\c = '"' Or *c\c = 10 Or *c\c = 13 Or *c\c = 9 Or *c\c = 8 Or *c\c = 14
      ;  8 = backspace
      ;  9 = tabulator
      ; 10 = new line
      ; 13 = carriage return
      ; 14 = formfeed
      
      If i
        JSON_addString(PeekS(*start, i))
      EndIf
      Select *c\c
        Case '\', '/', '"'
          JSON_addString("\")
          JSON_addString(PeekS(*c, 1))
        Case 10 ; new line
          JSON_addString("\n")
        Case 13 ; carriage return
          JSON_addString("\r")
        Case 9 ; tabulator
          JSON_addString("\t")
        Case 8 ; backspace
          JSON_addString("\b")
        Case 14 ; formfeed
          JSON_addString("\f")
      EndSelect
      *c + SizeOf(CHARACTER)
      *start = *c
      i = 0
    Else
      *c + SizeOf(CHARACTER)
      i + 1
    EndIf
  Wend
  If i
    JSON_addString(PeekS(*start, i))
  EndIf
EndProcedure



;-
; ---------------------------------------------
;- public functions
;----------------------------------------------

Procedure JSON_freeStringBuffer()
  *json_string_buffer = FreeMemory(*json_string_buffer)
  *json_string_next = #Null
  *json_string_buffer = #Null
EndProcedure

Procedure.i JSON_decode(inpString.s)
  inpString = Trim(inpString)
  Protected *c.CHARACTER = @inpString
  Protected result.i
  
  
  Protected *out.jsonObj = AllocateMemory(SizeOf(jsonObj))
  InitializeStructure(*out, jsonObj)
  If *c\c = '{'
    *c + SizeOf(CHARACTER)
    result = JSON_parseObject(*c, *out, @inpString + StringByteLength(inpString))
  ElseIf *c\c = '['
    *c + SizeOf(CHARACTER)
    result = JSON_parseArray(*c, *out, @inpString + StringByteLength(inpString))
  EndIf
  If result
    ProcedureReturn *out
  Else  
    ProcedureReturn #False
  EndIf
EndProcedure

Procedure.s JSON_encode(*obj.jsonObj, spaces.i = 0, type.i = #JSON_Type_Undefined)
  Protected tmpString.s
  Protected i.i
  Protected size.i
  Protected returnString.i = #False
  
  If Not *json_string_next
    If Not *json_string_buffer
      json_string_space = #JSON_StringBufferSize
      *json_string_buffer = AllocateMemory(json_string_space)
    EndIf
    *json_string_next = *json_string_buffer
    returnString = #True
  EndIf
  
  
  If type = #JSON_Type_Undefined
    type = *obj\type
  EndIf
  Select type
    Case #JSON_Type_False
      JSON_addString("false")
    Case #JSON_Type_True
      JSON_addString("true")
    Case #JSON_Type_Null
      JSON_addString("null")
    Case #JSON_Type_Float
      If *obj\s
        JSON_addString(*obj\s)
      Else
        JSON_addString(StrD(*obj\f))
      EndIf
    Case #JSON_Type_Integer
      JSON_addString(Str(*obj\i))
    Case #JSON_Type_String
      JSON_addString(Chr(34))
      JSON_addEscapedString(*obj\s)
      JSON_addString(Chr(34))
    Case #JSON_Type_Array
      JSON_addString("[")
      For i = 0 To *obj\length - 1
        JSON_addString(Chr(13))
        JSON_addString(Chr(10))
        JSON_addString(Space(spaces + 2))
        JSON_addString(JSON_encode(*obj\a(i), spaces + 2))
        If i = *obj\length - 1 
          JSON_addString(Chr(13))
          JSON_addString(Chr(10))
        Else
          JSON_addString(",")
        EndIf
      Next
      JSON_addString(Space(spaces))
      JSON_addString("]")
    Case #JSON_Type_Object
      JSON_addString("{")
      ResetMap(*obj\o())
      size = MapSize(*obj\o())
      For i = 1 To size
        JSON_addString(Chr(13))
        JSON_addString(Chr(10))
        NextMapElement(*obj\o())
        JSON_addString(Space(spaces + 2))
        JSON_addString(Chr(34))
        JSON_addEscapedString(MapKey(*obj\o()))
        JSON_addString(Chr(34))
        JSON_addString(" : ")
        CompilerIf Defined(JSON_UseObjectPointer, #PB_Constant)
          JSON_addString(JSON_encode(*obj\o(), spaces + 2))
        CompilerElse
          JSON_addString(JSON_encode(@*obj\o(), spaces + 2))
        CompilerEndIf
        If i = size
          JSON_addString(Chr(13))
          JSON_addString(Chr(10))
        Else
          JSON_addString(",")
        EndIf
      Next
      JSON_addString(Space(spaces))
      JSON_addString("}")
    Case #JSON_Type_Undefined
      JSON_addString(JSON_encode(*obj, spaces, JSON_getType(*obj)))
  EndSelect 
  
  If returnString
    size = (*json_string_next - *json_string_buffer) / SizeOf(CHARACTER)
    *json_string_next = #Null
    ProcedureReturn PeekS(*json_string_buffer, size)
  EndIf
  ProcedureReturn ""
EndProcedure

Macro JSON_free(pJsonObj)
  JSON_clear(pJsonObj, #False)
  FreeMemory(pJsonObj)
EndMacro

Procedure JSON_clear(*obj.jsonObj, initialize.i = #True)
  Protected last.i = *obj\length - 1
  Protected i.i
  Protected type.i = *obj\type
  
  If type = #JSON_Type_Undefined
    type = JSON_getType(*obj)
  EndIf  
  Select type
    Case #JSON_Type_Object
      ResetMap(*obj\o())
      While NextMapElement(*obj\o())
        CompilerIf Defined(JSON_UseObjectPointer, #PB_Constant)
          JSON_free(*obj\o())  
        CompilerElse
          JSON_clear(@*obj\o(), #False)
        CompilerEndIf
      Wend
      FreeMap(*obj\o())
      
    Case #JSON_Type_Array
      For i = 0 To last
        JSON_free(*obj\a(i))
      Next
      Dim *obj\a(0)
  EndSelect
  
  ClearStructure(*obj, jsonObj)
  ;*obj\type = #JSON_Type_Undefined  ;operated by ClearStructure()
  If initialize
    InitializeStructure(*obj, jsonObj)
  EndIf
EndProcedure


CompilerIf Defined(JSON_UseObjectPointer, #PB_Constant)
  Macro JSON_create()
    AllocateMemory(SizeOf(jsonObj))
  EndMacro
  Procedure JSON_newObject(*obj.jsonObj)
    If *obj\type <> #JSON_Type_Undefined
      JSON_clear(*obj)
    ElseIf *obj\s ;only if it is a string
      ClearStructure(*obj, jsonObj)
    EndIf
    *obj\type = #JSON_Type_Object
    InitializeStructure(*obj, jsonObj)
  EndProcedure
  Macro JSON_newPair(pJsonObj, strName)
    ;JSON_newObject(pJsonObj)
    pJsonObj\o(strName) = AllocateMemory(SizeOf(jsonObj))
  EndMacro

CompilerEndIf


Procedure.i JSON_dimArray(*obj.jsonObj, Size.i)
  Protected i.i
  If *obj\type <> #JSON_Type_Undefined
    JSON_clear(*obj, #False)
  ElseIf *obj\s ;only if it is a string
    ClearStructure(*obj, jsonObj)
  EndIf    
  
  If Size > 0
    *obj\length = Size
    Size - 1
    Dim *obj\a(Size)
    For i = 0 To Size
      *obj\a(i) = AllocateMemory(SizeOf(jsonObj))
      CompilerIf Defined(JSON_UseObjectPointer, #PB_Constant) = #False
        InitializeStructure(*obj\a(i), jsonObj)
      CompilerEndIf
    Next
  Else
    *obj\length = 0
  EndIf
  *obj\type = #JSON_Type_Array
EndProcedure

CompilerIf #PB_Compiler_Debugger
Procedure JSON_Debug(*obj.jsonObj, key.s, type.i = #JSON_Type_Undefined)
  Protected i.i
  
  If type = #JSON_Type_Undefined
    type = *obj\type
  EndIf
  Select type
    Case #JSON_Type_False
      Debug key + " (false)"
    Case #JSON_Type_True
      Debug key + " (true)"
    Case #JSON_Type_Null
      Debug key + " (null)"
    Case #JSON_Type_Float
      Debug key + " (float) : " + StrD(*obj\f)
    Case #JSON_Type_Integer
      Debug key + "(int) : " + Str(*obj\i)
    Case #JSON_Type_String
      Debug key + " (string) : " + *obj\s
    Case #JSON_Type_Array
      Debug key + " (array) : ["
      For i = 0 To *obj\length - 1
        JSON_Debug(*obj\a(i), Str(i+1) + ".")
      Next
      Debug "]"
    Case #JSON_Type_Object
      Debug key + " (object) : {"
      ResetMap(*obj\o())
      While NextMapElement(*obj\o())
        JSON_Debug(*obj\o(), MapKey(*obj\o()))
      Wend
      Debug "}"
      
    Case #JSON_Type_Undefined
      JSON_Debug(*obj, key, JSON_getType(*obj))
  EndSelect   
EndProcedure
CompilerElse
Macro JSON_Debug(BLA, BLA2, BLA3=bla4)
EndMacro
CompilerEndIf


; ---------------------------------------------
;       test code
; ---------------------------------------------

CompilerIf Defined(PB_Compiler_IsMainFile, #PB_Constant) = #False
  ; new compiler constant since PB v5.10
  ; to run test with older version just set constant to #True
  #PB_Compiler_IsMainFile = #False
CompilerEndIf
CompilerIf  #PB_Compiler_IsMainFile
  Define strTest.s = ""
  strTest + "{"
    strTest + Chr(34) + "Kreditkarte" + Chr(34) + " : " + Chr(34) + "Xema" + Chr(34) + "," 
    strTest + Chr(34) + "Nummer" + Chr(34) + "      : " + Chr(34) + "1234-5678-9012-3456" + Chr(34) + ","
    strTest + Chr(34) + "Inhaber" + Chr(34) + "     : {" 
      strTest + Chr(34) + "Name" + Chr(34) + "      : " + Chr(34) + "Reich" + Chr(34) + "," 
      strTest + Chr(34) + "Vorname" + Chr(34) + "   : " + Chr(34) + "Rainer" + Chr(34) + "," 
      strTest + Chr(34) + "Geschlecht" + Chr(34) + ": " + Chr(34) + "männlich" + Chr(34) + "," 
      strTest + Chr(34) + "Vorlieben" + Chr(34) + " : [ " + Chr(34) + "Reiten" + Chr(34) + ", " + Chr(34) + "Schwimmen" + Chr(34) + ", " + Chr(34) + "Lesen" + Chr(34) + " ]," 
      strTest + Chr(34) + "Alter" + Chr(34) + "     : null,"
      strTest + Chr(34) + "Schufa" + Chr(34) + "    : {}, " 
      strTest + Chr(34) + "Verdienst" + Chr(34) + " : [5000, 10000] " 
    strTest + "}," 
    strTest + Chr(34) + "Deckung" + Chr(34) + "     : 2e+6,"
    strTest + Chr(34) + "Währung" + Chr(34) + "     : " + Chr(34) + "EURO" + Chr(34) + ", " 
    strTest + Chr(34) + "Abzüge" + Chr(34) + "      : [], "
    strTest + Chr(34) + "Online Konto" + Chr(34) + ": " + Chr(34) + "http:\/\/www.meinekreditkarte.com\/meinkonto" + Chr(34)
  strTest + "}"
  Define *out.jsonObj
  Define strResult.s
  
  
  *out = JSON_decode(strTest)
  
  Debug "direct Access:"
  Debug "Nummer: " + *out\o("Nummer")\s
  Debug "Vorname: " + *out\o("Inhaber")\o("Vorname")\s
  Debug "Vorliebe 2: " + *out\o("Inhaber")\o("Vorlieben")\a(2)\s
  Debug " "
  
  Debug "JSON content:"
  JSON_Debug(*out, "")
  JSON_free(*out)
  
  Debug ""
  Debug "myJSON content:"
  CompilerIf Defined(JSON_UseObjectPointer, #PB_Constant)
    ; this code demonstrates the use of this JSON-Object, if
    ; you have defined the #JSON_UseObjectPointer constant.
    ; It is more complexe, but then the Map is only initialized
    ; if you really need them, less memory usage per object
    ; and faster in use.
    Define *myJSON.jsonObj = JSON_create()
    JSON_newObject(*myJSON)
    JSON_newPair(*myJSON, "Name")
    *myJSON\o("Name")\s = "Müller"
    JSON_newPair(*myJSON, "Beruf")
    *myJSON\o("Beruf")\s = "Dichter"
    JSON_newPair(*myJSON, "Alter")
    *myJSON\o("Alter")\i = 49
    JSON_newPair(*myJSON, "Verheiratet")
    *myJSON\o("Verheiratet")\type = #JSON_Type_False
    JSON_newPair(*myJSON, "Kinder")
    JSON_dimArray(*myJSON\o("Kinder"), 2)
    JSON_newObject(*myJSON\o("Kinder")\a(0))
    JSON_newPair(*myJsON\o("Kinder")\a(0), "Name")
    *myJSON\o("Kinder")\a(0)\o("Name")\s = "Martin"
    JSON_newPair(*myJsON\o("Kinder")\a(0), "Alter")
    *myJSON\o("Kinder")\a(0)\o("Alter")\i = 20
    JSON_newObject(*myJSON\o("Kinder")\a(1))
    JSON_newPair(*myJsON\o("Kinder")\a(1), "Name")
    *myJSON\o("Kinder")\a(1)\o("Name")\s = "Katja"
    JSON_newPair(*myJsON\o("Kinder")\a(1), "Alter")
    *myJSON\o("Kinder")\a(1)\o("Alter")\i = 15
    JSON_newPair(*myJSON, "Erkrankungen")
    JSON_dimArray(*myJSON\o("Erkrankungen"), 0)
    JSON_newPair(*myJSON, "Empty")
    JSON_newObject(*myJSON\o("Empty"))
    JSON_newPair(*myJSON, "")
    *myJSON\o("")\s = "No Name"
    *myJSON\o("/\")\s = "Back" + Chr(34) + "Slash"
    
    JSON_Debug(*myJSON, "")
    strResult = JSON_encode(*myJSON)
  CompilerElse
    ; this code demonstrates the use of the JSON-Object, if
    ; you doesn't have defined the #JSON_UseObjectPointer
    ; constant. Now every object containts an initialized
    ; Map, but now you are able to easily create data
    Define myJSON.jsonObj
    myJSON\o("Name")\s = "Müller"
    myJSON\o("Beruf")\s = "Dichter"
    myJSON\o("Alter")\i = 49
    myJSON\o("Verheiratet")\type = #JSON_Type_False
    JSON_dimArray(@myJSON\o("Kinder"), 2)
    myJSON\o("Kinder")\a(0)\o("Name")\s = "Martin"
    myJSON\o("Kinder")\a(0)\o("Alter")\i = 20
    myJSON\o("Kinder")\a(1)\o("Name")\s = "Katja"
    myJSON\o("Kinder")\a(1)\o("Alter")\i = 15
    JSON_dimArray(@myJSON\o("Erkrankungen"), 0)
    myJSON\o("Empty")\type = #JSON_Type_Object
    myJSON\o("")\s = "No Name"
    myJSON\o("/\")\s = "Back" + Chr(34) + "Slash"
    
    JSON_Debug(@myJSON, "")
    strResult = JSON_encode(@myJSON)
  CompilerEndIf
  
  ; creates a new file in tempdir and opens it with standard-program for *.txt files!
  Define file.s =  GetTemporaryDirectory() + "json.txt"
  If CreateFile(0, file)
    WriteString(0, strResult)
    CloseFile(0)
    RunProgram(file)
  EndIf
CompilerEndIf
; IDE Options = PureBasic 5.21 LTS (Windows - x64)
; CursorPosition = 142
; FirstLine = 123
; Folding = ------
; EnableUnicode
; EnableXP