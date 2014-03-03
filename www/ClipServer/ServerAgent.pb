Procedure ErrorHandler()
  
  ErrorMessage$ = "A program error was detected:" + Chr(13) 
  ErrorMessage$ + Chr(13)
  ErrorMessage$ + "Error Message:   " + ErrorMessage()      + Chr(13)
  ErrorMessage$ + "Error Code:      " + Str(ErrorCode())    + Chr(13)  
  ErrorMessage$ + "Code Address:    " + Str(ErrorAddress()) + Chr(13)
  
  If ErrorCode() = #PB_OnError_InvalidMemory   
    ErrorMessage$ + "Target Address:  " + Str(ErrorTargetAddress()) + Chr(13)
  EndIf
  
  If ErrorLine() = -1
    ErrorMessage$ + "Sourcecode line: Enable OnError lines support to get code line information." + Chr(13)
  Else
    ErrorMessage$ + "Sourcecode line: " + Str(ErrorLine()) + Chr(13)
    ErrorMessage$ + "Sourcecode file: " + ErrorFile() + Chr(13)
  EndIf
  
  ErrorMessage$ + Chr(13)
  ErrorMessage$ + "Register content:" + Chr(13)
  
  CompilerSelect #PB_Compiler_Processor 
    CompilerCase #PB_Processor_x86
      ErrorMessage$ + "EAX = " + Str(ErrorRegister(#PB_OnError_EAX)) + Chr(13)
      ErrorMessage$ + "EBX = " + Str(ErrorRegister(#PB_OnError_EBX)) + Chr(13)
      ErrorMessage$ + "ECX = " + Str(ErrorRegister(#PB_OnError_ECX)) + Chr(13)
      ErrorMessage$ + "EDX = " + Str(ErrorRegister(#PB_OnError_EDX)) + Chr(13)
      ErrorMessage$ + "EBP = " + Str(ErrorRegister(#PB_OnError_EBP)) + Chr(13)
      ErrorMessage$ + "ESI = " + Str(ErrorRegister(#PB_OnError_ESI)) + Chr(13)
      ErrorMessage$ + "EDI = " + Str(ErrorRegister(#PB_OnError_EDI)) + Chr(13)
      ErrorMessage$ + "ESP = " + Str(ErrorRegister(#PB_OnError_ESP)) + Chr(13)
      
    CompilerCase #PB_Processor_x64
      ErrorMessage$ + "RAX = " + Str(ErrorRegister(#PB_OnError_RAX)) + Chr(13)
      ErrorMessage$ + "RBX = " + Str(ErrorRegister(#PB_OnError_RBX)) + Chr(13)
      ErrorMessage$ + "RCX = " + Str(ErrorRegister(#PB_OnError_RCX)) + Chr(13)
      ErrorMessage$ + "RDX = " + Str(ErrorRegister(#PB_OnError_RDX)) + Chr(13)
      ErrorMessage$ + "RBP = " + Str(ErrorRegister(#PB_OnError_RBP)) + Chr(13)
      ErrorMessage$ + "RSI = " + Str(ErrorRegister(#PB_OnError_RSI)) + Chr(13)
      ErrorMessage$ + "RDI = " + Str(ErrorRegister(#PB_OnError_RDI)) + Chr(13)
      ErrorMessage$ + "RSP = " + Str(ErrorRegister(#PB_OnError_RSP)) + Chr(13)
      ErrorMessage$ + "Display of registers R8-R15 skipped."         + Chr(13)
      
    CompilerCase #PB_Processor_PowerPC
      ErrorMessage$ + "r0 = " + Str(ErrorRegister(#PB_OnError_r0)) + Chr(13)
      ErrorMessage$ + "r1 = " + Str(ErrorRegister(#PB_OnError_r1)) + Chr(13)
      ErrorMessage$ + "r2 = " + Str(ErrorRegister(#PB_OnError_r2)) + Chr(13)
      ErrorMessage$ + "r3 = " + Str(ErrorRegister(#PB_OnError_r3)) + Chr(13)
      ErrorMessage$ + "r4 = " + Str(ErrorRegister(#PB_OnError_r4)) + Chr(13)
      ErrorMessage$ + "r5 = " + Str(ErrorRegister(#PB_OnError_r5)) + Chr(13)
      ErrorMessage$ + "r6 = " + Str(ErrorRegister(#PB_OnError_r6)) + Chr(13)
      ErrorMessage$ + "r7 = " + Str(ErrorRegister(#PB_OnError_r7)) + Chr(13)
      ErrorMessage$ + "Display of registers r8-R31 skipped."       + Chr(13)
      
  CompilerEndSelect
  
  MessageRequester("OnError example", ErrorMessage$)
  End
  
EndProcedure
 
; Setup the error handler.
;
OnErrorCall(@ErrorHandler())


#FilterResults = 1

Global startime = gettickcount_()

Global RequestType.s   = ProgramParameter(0)
Global RequestString.s = ProgramParameter(1)
Global RequestTime.s   = ProgramParameter(2)



Global HTMLBody.s = "<!DOCTYPE HTML PUBLIC "+Chr(34)+"-//W3C//DTD HTML 4.01//EN"+Chr(34)+Chr(10)+"       "+Chr(34)+"http://www.w3.org/TR/html4/strict.dtd"+Chr(34)+">"+Chr(10)+"<HTML>"+Chr(10)+"<head>"+Chr(10)+"<title>#title#</title>"+Chr(10)+"</head>"+Chr(10)+"<body>"+Chr(10)+"#body#"+Chr(10)+"</body>"+Chr(10)+"</HTML>"
Global HTMLLink.s = "<a href="+Chr(34)+"#url#"+Chr(34)+">#text#</a>"
Global HTMLEmbed.s= "<object width="+Chr(34)+"425"+Chr(34)+" height="+Chr(34)+"344"+Chr(34)+"><param name="+Chr(34)+"movie"+Chr(34)+" value="+Chr(34)+"#swfurl#"+Chr(34)+"></param><param name="+Chr(34)+"allowFullScreen"+Chr(34)+" value="+Chr(34)+"true"+Chr(34)+"></param><param name="+Chr(34)+"allowscriptaccess"+Chr(34)+" value="+Chr(34)+"always"+Chr(34)+"></param><embed src="+Chr(34)+"#swfurl#"+Chr(34)+" type="+Chr(34)+"application/x-shockwave-flash"+Chr(34)+" allowscriptaccess="+Chr(34)+"always"+Chr(34)+" allowfullscreen="+Chr(34)+"true"+Chr(34)+" width="+Chr(34)+"425"+Chr(34)+" height="+Chr(34)+"344"+Chr(34)+"></embed></object>"



Structure PluginFiles
  file.s
  name.s
EndStructure

Structure VideoSideInfo
  use.l
  tside.l
  tindex.l
  vside.l
EndStructure

Structure alphaimg
  img.l
  Alpha.l
EndStructure 

Structure VideoSide
  message.l
  messageReady.l
  kill.l
  newkill.l
  showstate.l
  ypos.f
  nypos.f
  oypos.f
  nHeight.f
  Height.f
  oHeight.f
  dllName.s
  dllID.l
  dllVersion.l
  name.s
  suchen.l
  suchenEX.l
  VideosContainer.l
  VideosText.l
  VideosSuchenT.l
  VideosSuchen.l
  VideosSuchenB.l
  VideosSuchenExB.l
  VideosAvailable.l
  ShowVideos.l
  ShowVideosImg.l
  logoImg.alphaimg
  logoImgPath.s
  VideoID.l
  searchthread.l
  searchthreadID.l
  updateVideos.l
  NumVideos.l
  scrollLeft.l
  scrollRight.l
  scrollDir.l
  currentVideo.l
  videoPointer.l[1001]
  nvideos.l
  mouseX.l
  mouseY.l
  selected.l
  pauseThread.l
  SideOpen.l
  SideMax.l
  SideStatus.l
  searched.l
  _GetMovieInfo.l
  _GetPageSearch.l
  _DownloadVideo.l
  _GetPageSearchEx.l
  _IsURLVideo.l
  portalChanged.l
  VideosBackground.l
  VideosBackgroundContainer.l
  VideosTitle.l
  ShowVideosBackground.l
  visible.l
  backEnabled.l
  nextEnabled.l
  logoImgSmall.l
  currentsearchthreadID.l
  ShowNoInternetConnection.l
  ShowLoadingVideo.l
  ShowNoVideosFound.l
  VideoSideInfo.VideoSideInfo 
  user.s
  Password.s
  StartSearching.l
  _GetMovieFLV.l
EndStructure


Structure ClipUrl
  url.s
  type.s
EndStructure

Structure sresult
  title.s
  text.s
  rating.l
  portal.l
  duration.l
  diff1.l
  diff2.l
  words.l
  wpercent.f
  musicURL.s
EndStructure

Structure VideoFormat
  url.s
  quality.l
  output.s 
  duration.l
EndStructure

;{ browser-agent
agentid = Random(5)
agent_videu.s = "Mozilla/4.0 (compatible; ST)"
If agentid < 5
  net_clr.s = ".NET CLR 3.5.30729"
  applewebkit.s = "AppleWebKit/525.19 (KHTML, like Gecko)"
  agent.s = "Mozilla/"+Str(3+Random(2))+".0"
  If agentid = 0
    agent.s = agent+" (Windows; U; Windows NT 5.1; en; rv:1.9.0.3) Gecko/2008092417 Firefox/3.0.3 ("+net_clr+")"
  ElseIf agentid = 1
    agent.s =  agent+" (Windows; U; Windows NT 5.1; en-US) "+applewebkit+" Version/3.1.2 Safari/525.21"
  ElseIf agentid =2
    agent.s = agent+" (compatible; MSIE "+Str(6+Random(1))+".0; Windows NT 5.1; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; "+net_clr+"; FDM)"
  ElseIf agentid = 3
    agent.s =  "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) "+applewebkit+" Chrome/0.3.154.9 Safari/525.19"
  Else
    agent.s = agent+ "(Windows; U; Windows NT 5.1; en-US; rv:1.9.0.3) Gecko/2008092417 Firefox/3.0.3"
  EndIf
Else
  agent.s = "Opera/9."+Str(55+Random(6))+" (Windows NT 5.1; U; de) Presto/2.1.1"
EndIf 
Proxy.s = "...."
Global DLhINet.l       = InternetOpen_ (agent,0,0,0,0)
If DLhINet = 0
  DLhINet.l = InternetOpen_ (agent,1,0,0,0)
  If DLhINet = 0
    DLhINet.l = InternetOpen_ (agent,3,Proxy,0,0)
  EndIf
EndIf
Global DLhINet_videu.l = InternetOpen_ (agent_videu,0,0,0,0)
If DLhINet_videu = 0
  DLhINet_videu.l = InternetOpen_ (agent_videu,1,0,0,0)
  If DLhINet_videu = 0
    DLhINet_videu.l = InternetOpen_ (agent_videu,3,Proxy,0,0)
  EndIf
EndIf
;}
OpenConsole()
InitNetwork() 
ProcedureDLL.s GetString(string.s,s1.s,s2.s,startpos = 0)
  pos1 = FindString(string,s1,startpos)+Len(s1)
  If pos1 <> Len(s1)
    pos2 = FindString(string,s2,pos1)
    If pos2 <> 0 
      ProcedureReturn Mid(string,pos1,pos2-pos1)
    EndIf
  EndIf
  ProcedureReturn ""
EndProcedure


Global NextIndex = -1
Procedure ni()
  NextIndex+1
  ProcedureReturn NextIndex
EndProcedure
Procedure gi()
  ProcedureReturn NextIndex
EndProcedure

Global NewList vsides.VideoSide()
Global Dim *vsidedim.VideoSide(20)
Global Dim Pluginfiles.PluginFiles(20)
Global PluginfilesNum

IncludeFile "ServerPlugins.pb"




;;;1;
;veoh.com;veoh.dll;1;
;photobucket.com;photobucket.dll;1;
;sevenload.de;sevenload.dll;1;

;;;1;

Procedure CreateVideoSides()
  For s = 0 To PluginfilesNum
    filename.s = Pluginfiles(s)\file
    If FileSize("plugins\"+filename) > 0
      AddElement(vsides())
      *vsidedim(ListIndex(vsides())) = vsides()
      vsides()\name.s    = Pluginfiles(s)\name
      vsides()\dllName   = filename
      *VideoSide.VideoSide          = @vsides()
      Repeat
        *VideoSide\dllID              = OpenLibrary(#PB_Any,"Plugins\"+*VideoSide\dllName)
      Until *VideoSide\dllID <> 0
      If *VideoSide\dllID
        *VideoSide\message          = AllocateMemory(100002)
        *VideoSide\messageReady     = 1
        *VideoSide\kill             = AllocateMemory(1000002)
        *VideoSide\suchen           = AllocateMemory(10002)
        *VideoSide\suchenEX         = AllocateMemory(10002)
        *VideoSide\_GetPageSearch   = GetFunction(*VideoSide\dllID,"GetPageSearch")
        *VideoSide\_GetPageSearchEx = GetFunction(*VideoSide\dllID,"GetPageSearchEx")
        *VideoSide\_IsURLVideo      = GetFunction(*VideoSide\dllID,"IsURLVideo")
        *VideoSide\_GetMovieFLV     = GetFunction(*VideoSide\dllID,"GetMovieFLV")
        *VideoSide\searchthread     = 0
        *VideoSide\searched         = 0
        *VideoSide\showstate        = 0
        *VideoSide\VideoID          = 0
        *VideoSide\updateVideos     = 0
        *VideoSide\pauseThread      = 0
        *VideoSide\dllVersion = Version
        CallFunction(*VideoSide\dllID,"initSide",DLhINet) 
      Else
        DeleteElement(vsides())
      EndIf
    EndIf
  Next 
  PluginfilesNum = ListSize(vsides())-1
EndProcedure
Procedure GetSidePointerbyURL( VideoURL.s) 
  sidepointer =0
  For s = 0 To PluginfilesNum
    If *vsidedim(s)
      If *vsidedim(s)\_IsURLVideo
        If CallFunctionFast(*vsidedim(s)\_IsURLVideo,@VideoURL)
          sidepointer =*vsidedim(s)
          Break
        EndIf 
      EndIf
    EndIf 
  Next
  ProcedureReturn sidepointer
EndProcedure

Procedure GetPageSearch(*element)
  *VideoSide.VideoSide             =  *element
  ReturnValue.l = 0 
  Protected searchID = Random(100000)
  *VideoSide\currentsearchthreadID = searchID
  CallFunctionFast(*VideoSide\_GetPageSearch,*VideoSide,searchID,@ReturnValue.l)
  Debug "GETPAGESEARCH ENDE!"
EndProcedure


Procedure GetVideoInformation(*format.VideoFormat)
  params.s = "-i "+Chr(34)+*format\url+Chr(34)
  Debug params
  ffmpegProgram = RunProgram("plugins\converter.exe",params,"",#PB_Program_Open|#PB_Program_Read|#PB_Program_Error) 
  If ffmpegProgram
    output = 0
    Delay(10)
    convertinfo.s = ""
    Repeat 
      infostring.s = ReadProgramError(ffmpegProgram)
      Delay(10)
      dwBytes = StringByteLength(infostring)
      If  dwBytes >0  
        convertinfo.s = convertinfo+PeekS(@infostring,-1,#PB_Ascii)
        convertinfo+Chr(10)
        output +1
      EndIf 
    Until ProgramRunning(ffmpegProgram) = 0 And output > 0 
    If IsProgram(ffmpegProgram)
      CloseProgram(ffmpegProgram)
    EndIf 
  EndIf 
  If FindString(convertinfo,": Video: vp6f,",1)
    convertinfo = ""
  EndIf
  *format\output = convertinfo
EndProcedure 



Procedure.s ParseURLResult(ReturnValue.s,oname.s="",*duration = 0)
  Dim urls.ClipUrl(0) 
  bodystring.s = ""
  videoanz = 1
  If Left(ReturnValue,9) <> "extended"+Chr(1)
    urls(0)\url      = Trim(StringField(ReturnValue,1,Chr(10)))
    urls(0)\type     = "FLV"
  Else
    videopart.s = Trim(StringField(ReturnValue,1,Chr(10)))
    videoanz = CountString(videopart,Chr(1))-1
    Redim urls(videoanz)
    For s = 1 To videoanz
      videoinfo.s = StringField(videopart,s+1,Chr(1))
      videoquality     = Val(StringField(videoinfo,2,Chr(2)))
      urls(s-1)\url      = StringField(videoinfo,4,Chr(2))
      urls(s-1)\type     = StringField(videoinfo,1,Chr(2))
    Next
  EndIf
  name.s    = Trim(StringField(ReturnValue,2,Chr(10)))
  If name = ""
    name = oname
  EndIf
  bodystring = "";title+"<br>"+Chr(10)+url+"<br><br>"+Chr(10)
  Debug videoanz
  duration.s = ""
  For s = 1 To videoanz
    If urls(s-1)\url  And urls(s-1)\url <> "locked"
      filename.s = name+"."+LCase(urls(s-1)\type)
      newURL.s =  urls(s-1)\url
      vinfo.VideoFormat
      vinfo\url = newURL
      ;MessageRequester("",newURL)
      If duration = ""
        GetVideoInformation(vinfo)
        
        duration.s = GetString(vinfo\output,"Duration: ",",")
      EndIf 
      
      linkstring.s = ReplaceString(HTMLLink,"#url#",newURL)
      linkstring.s = ReplaceString(linkstring,"#text#",filename)
      
      
      If urls(s-1)\type  = "MP4" Or videoanz = 1
        bodystring = bodystring+linkstring+"<br>"+Chr(10)
      EndIf 
      Debug newURL
    EndIf
  Next  
  If duration
    songtime = ParseDate("%hh:%ii:%ss",StringField(duration+".",1,"."));00:03:07.64
    If songtime > 120 And songtime < 600
      bodystring = bodystring+"Duration:  "+Str(songtime)+" sec<br>"+Chr(10)+"<br>"+Chr(10)
      If *duration
        PokeL(*duration,songtime)
      EndIf
    Else
      bodystring = ""
    EndIf 
  Else
    bodystring = ""
  EndIf
  
  ProcedureReturn bodystring
EndProcedure


Procedure FindStringOK(text1.s,text2.s,search.s)
  If FindString(text2,search,1)
    ProcedureReturn 0
  ElseIf FindString(text1,search,1)
    ProcedureReturn 1
  EndIf
EndProcedure


Procedure musicTitleOK(title.s,search.s) ;Blacklist

  title = LCase(title)
  search = LCase(search);HOME VIDEO Unplugged Rock am Ring)
  For year = 1950 To Val(FormatDate("%yyyy",Date()))+1
    If FindStringOK(title,search,Str(year))
      ProcedureReturn 0
    EndIf
  Next
  If FindStringOK(title,search,": ")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"fabrice bluy joue")
    ProcedureReturn 
  EndIf
  If FindStringOK(title,search,"festival")
    ProcedureReturn 
  EndIf
  If FindStringOK(title,search,"konzert")
    ProcedureReturn 
  EndIf
  If FindStringOK(title,search,"concert")
    ProcedureReturn 
  EndIf
  If FindStringOK(title,search,"angebote")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"text")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"eigen")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"own")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"acoustic")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"beat")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"hellfest")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"around the blues a.t.b.")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"choir")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"sings")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"parodie")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"parody")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"parodi")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"sings")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"rock im park")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"rock am ring") 
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"remake") 
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"trailer")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"live")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"unplugged")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"interview")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"session")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"home video")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"singing")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"wiwi égratigne") 
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"karaoke")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"cover")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"live")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"@")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"full")
    ProcedureReturn 0
  EndIf
  If FindStringOK(title,search,"mix")
    ProcedureReturn 0
  EndIf
  ProcedureReturn 1
EndProcedure

Procedure.s RemoveSpecialCharacters(text.s)
  Protected remove
  For s = 0 To 255
    remove = 0
    If s <= 47 And s <> 32
      remove = 1
    ElseIf s >= 58 And s <= 64
      remove = 1
    ElseIf s>= 91 And s <= 96
      remove = 1
    ElseIf s>= 123
      remove = 1
    EndIf
    If remove
      text = RemoveString(text,Chr(s))
    EndIf
  Next
  ProcedureReturn text
EndProcedure

Procedure CheckSearchWords(found.s,search.s)
  search = LCase(search)+" "
  found  = LCase(found)
  search = RemoveSpecialCharacters(search)
  found  = RemoveSpecialCharacters(found)
  wcount = CountString(search," ")
  ok = 1
  For s = 1 To wcount+1
    wpart.s = StringField(search,s," ")
    If wpart
      If FindString(found,wpart,1) = 0
        ok = 0
      EndIf
    EndIf
  Next
  ProcedureReturn ok
EndProcedure

Procedure.f CheckSearchWordPercent(found.s,search.s)
  search = LCase(search)+" "
  found  = LCase(found)
  search = RemoveSpecialCharacters(search)
  found  = RemoveSpecialCharacters(found)
  wcount.f = CountString(search," ")
  wcounter.f = 0
  For s = 1 To wcount+1
    wpart.s = StringField(search,s," ")
    If wpart
      If FindString(found,wpart,1)
        wcounter +1
      EndIf
    EndIf
  Next
  ProcedureReturn wcounter/wcount
EndProcedure ;

Procedure.s MD5(text.s)
  *Buffer = AllocateMemory(100000)  
  MD5.s = ""
  If *Buffer
    len = StringByteLength(text,#PB_Ascii)
    PokeS(*Buffer,text,len,#PB_Ascii)
    MD5.s = MD5Fingerprint(*Buffer,len)
    FreeMemory(*Buffer)  ; würde am Programmende auch automatisch erledigt werden
  EndIf
  ProcedureReturn MD5
EndProcedure

info.s = " "
CreateVideoSides()
Select RequestType
  Case "1"
    url.s = RequestString
    For retry = 0 To 1
      title.s = ""
      If Trim(url)
        *VideoSide.VideoSide = GetSidePointerbyURL(url)
        If *VideoSide
          title = *VideoSide\name
          name.s = ""
          purl.s = ""
          Repeat
            *ReturnString = AllocateMemory(5002)
          Until *ReturnString
          PokeS(*ReturnString,"extended")
          purl.s = ""
          CallFunctionFast(*VideoSide\_GetMovieFLV,@url,@purl,@name.s,*ReturnString)
          ReturnValue.s = Trim(PeekS(*ReturnString))
          Debug ReturnValue 
          FreeMemory(*ReturnString)
          bodystring.s = ""
          If ReturnValue
            bodystring.s = ParseURLResult(ReturnValue)
          EndIf
        Else
          Break
        EndIf 
      Else
        bodystring = ""
      EndIf
      If bodystring
        Break
      EndIf
    Next 
    If bodystring
      info = bodystring
    Else
      info.s = ""
    EndIf 
  Case "6"
    searchword.s = RequestString
    ForEach vsides()
      PokeS(vsides()\suchen,searchword,10000)
      PokeS(vsides()\message, "")
      vsides()\messageReady = 1
      vsides()\searched = 1
      vsides()\searchthread = CreateThread(@GetPageSearch(), vsides())
    Next
    startsearchtime = GetTickCount_()
    NewList sresults.sresult()
    muzufound = 0
    Repeat 
      ForEach vsides()
        If vsides()\messageReady = 0
          message.s = PeekS(vsides()\message,-1,#PB_Unicode)
          If message 
            musicTitle.s       = Trim(StringField(message,5,Chr(10)))
            mpercent.f = CheckSearchWordPercent(musicTitle,searchword)
            If musicTitleOK(musicTitle,searchword) And  mpercent > 0.6
              musicURL.s         = Trim(StringField(message,3,Chr(10)))
              previewURL.s       = Trim(StringField(message,4,Chr(10)))
              
              Repeat
                *ReturnString = AllocateMemory(5002)
              Until *ReturnString
              PokeS(*ReturnString,"extended")
              CallFunctionFast(vsides()\_GetMovieFLV,@musicURL,@previewURL,@musicTitle.s,*ReturnString)
              ReturnValue.s = Trim(PeekS(*ReturnString))
              Debug ReturnValue 
              FreeMemory(*ReturnString)
              bodystring.s = ""
              vduration = 0
              If ReturnValue
                bodystring.s = ParseURLResult(ReturnValue,musicTitle,@vduration)
              EndIf
              If bodystring
                AddElement(sresults())  
                diffduration = Abs(vduration -searchduration)
                sresults()\musicURL = musicURL
                sresults()\title    = musicTitle
                sresults()\text     = vsides()\name+"<br>"+musicTitle+" <br>  "+bodystring;"<a href="+Chr(34)+musicURL+Chr(34)+">"+musicTitle+"</a>"
                sresults()\diff1    = diffduration
                sresults()\duration = vduration
                sresults()\words    = CheckSearchWords(musicTitle,searchword)
                sresults()\wpercent = mpercent
                If FindStringOK(LCase(musicTitle),LCase(searchword),"audio")
                  sresults()\rating = 50
                EndIf
                If FindStringOK(LCase(musicTitle),LCase(searchword),"official")
                  sresults()\rating = 50
                EndIf
                If FindStringOK(LCase(musicTitle),LCase(searchword),"lyrics")
                  sresults()\rating = 50
                EndIf
                If FindStringOK(LCase(musicTitle),LCase(searchword),"original")
                  sresults()\rating = 50
                EndIf
                If vsides()\name = "muzu.tv" 
                  sresults()\rating = 100
                EndIf
              EndIf
            EndIf 
            vsides()\messageReady = 1
            PokeS(vsides()\message, "")
            
          EndIf
          
        EndIf
      Next 
      Delay(100)
      If GetTickCount_()-startsearchtime > 1500  
        If ListSize(sresults()) >= 20 
          Break 
        EndIf
      EndIf
      If GetTickCount_()-startsearchtime > 6000 
        If ListSize(sresults()) >= 3 Or GetTickCount_()-startsearchtime > 10000 
          Break
        EndIf 
      EndIf
    Until ListSize(sresults()) > 30

    info.s = "<?xml version="+Chr(34)+"1.0"+Chr(34)+" encoding="+Chr(34)+"utf-8"+Chr(34)+"?>"+Chr(10)+Chr(13)
    info.s = "<tracks>"+Chr(10)+Chr(13)
    ForEach sresults()
      info.s = info.s+"<track>"+sresults()\title+"</track>"+Chr(10)+Chr(13)
    Next
    info.s = info.s+"</tracks>"+Chr(10)+Chr(13)
  Case "5"
    url = StringField(RequestString,1,Chr(1))
    For retry = 0 To 1
      title.s = ""
      If Trim(url)
        *VideoSide.VideoSide = GetSidePointerbyURL(url)
        If *VideoSide 
          title = *VideoSide\name
          name.s = ""
          purl.s = ""
          Repeat
            *ReturnString = AllocateMemory(5002)
          Until *ReturnString
          PokeS(*ReturnString,"extended")
          purl.s = ""
          CallFunctionFast(*VideoSide\_GetMovieFLV,@url,@purl,@name.s,*ReturnString)
          ReturnValue.s = Trim(PeekS(*ReturnString))
          Debug ReturnValue 
          FreeMemory(*ReturnString)
          bodystring.s = ""
          If ReturnValue
            bodystring.s = ParseURLResult(ReturnValue)
          EndIf
        Else
          Break
        EndIf 
      Else
        bodystring = ""
      EndIf
      If bodystring
        Break
      EndIf
    Next 

    info = bodystring

   info =  GetString(info,"<a href="+Chr(34),Chr(34))+Chr(10)+url+Chr(10)
    

Case "2", "3", "7"
    RequestString = RequestString+Chr(1)
    searchword.s = StringField(RequestString,1,Chr(1))
    forceword1.s  = StringField(RequestString,2,Chr(1))
    forceword2.s  = StringField(RequestString,3,Chr(1))
    searchduration = Val(StringField(RequestString,4,Chr(1)))
    CheckDuration = Val(StringField(RequestString,5,Chr(1)))
    BlackListURL.s = LCase(StringField(RequestString,6,Chr(1)))
    
    
    forceword1 = Trim(LCase(forceword1))
    forceword2 = Trim(LCase(forceword2))
    ForEach vsides()
      PokeS(vsides()\suchen,searchword,10000)
      PokeS(vsides()\message, "")
      vsides()\messageReady = 1
      vsides()\searched = 1
      vsides()\searchthread = CreateThread(@GetPageSearch(), vsides())
    Next
    startsearchtime = GetTickCount_()
    NewList sresults.sresult()
    muzufound = 0
    Repeat 
      ForEach vsides()
        If vsides()\messageReady = 0
          message.s = PeekS(vsides()\message,-1,#PB_Unicode)
          If message 
            musicTitle.s       = Trim(StringField(message,5,Chr(10)))
            mpercent.f = CheckSearchWordPercent(musicTitle,searchword)
            If musicTitleOK(musicTitle,searchword) And  mpercent > 0.6
              musicURL.s         = Trim(StringField(message,3,Chr(10)))
              musicURLOK = 1
              If BlackListURL
                MusicUrlMD5.s = MD5(LCase(musicURL))
                If FindString(BlackListURL,MusicUrlMD5)
                  musicURLOK = 0
                EndIf
              EndIf 
              If musicURLOK 
                previewURL.s       = Trim(StringField(message,4,Chr(10)))
                
                Repeat
                  *ReturnString = AllocateMemory(5002)
                Until *ReturnString
                PokeS(*ReturnString,"extended")
                CallFunctionFast(vsides()\_GetMovieFLV,@musicURL,@previewURL,@musicTitle.s,*ReturnString)
                ReturnValue.s = Trim(PeekS(*ReturnString))
                Debug ReturnValue 
                FreeMemory(*ReturnString)
                bodystring.s = ""
                vduration = 0
                If ReturnValue
                  bodystring.s = ParseURLResult(ReturnValue,musicTitle,@vduration)
                EndIf
                If bodystring
                  AddElement(sresults())  
                  diffduration = Abs(vduration -searchduration)
                  sresults()\musicURL = musicURL
                  sresults()\title    = musicTitle
                  sresults()\text     = vsides()\name+"<br>"+musicTitle+" <br>  "+bodystring;"<a href="+Chr(34)+musicURL+Chr(34)+">"+musicTitle+"</a>"
                  sresults()\diff1    = diffduration
                  sresults()\duration = vduration
                  sresults()\words    = CheckSearchWords(musicTitle,searchword)
                  sresults()\wpercent = mpercent
                  If FindStringOK(LCase(musicTitle),LCase(searchword),"audio")
                    sresults()\rating = 50
                  EndIf
                  If FindStringOK(LCase(musicTitle),LCase(searchword),"official")
                    sresults()\rating = 50
                  EndIf
                  If FindStringOK(LCase(musicTitle),LCase(searchword),"lyrics")
                    sresults()\rating = 50
                  EndIf
                  If FindStringOK(LCase(musicTitle),LCase(searchword),"original")
                    sresults()\rating = 50
                  EndIf
                  If vsides()\name = "muzu.tv" 
                    sresults()\rating = 100
                  EndIf
                EndIf 
              EndIf
            EndIf 
            vsides()\messageReady = 1
            PokeS(vsides()\message, "")
            
          EndIf
          
        EndIf
      Next 
      Delay(100)
      If GetTickCount_()-startsearchtime > 1500  
        If ListSize(sresults()) >= 3 
          Break 
        EndIf
      EndIf
      If GetTickCount_()-startsearchtime > 6000 
        If ListSize(sresults()) >= 6 Or GetTickCount_()-startsearchtime > 10000 
          Break
        EndIf 
      EndIf
    Until ListSize(sresults()) > 30
    
    
    If ListSize(sresults())
      
      info.s = "";Str(ListSize(sresults()))+Chr(10)+"<br><br>"+Chr(10)+Chr(10)+"<br><br>"+Chr(10)
      SortStructuredList(sresults(),#PB_Sort_Descending,OffsetOf(sresult\rating), #PB_Long) 
      SortStructuredList(sresults(),#PB_Sort_Ascending,OffsetOf(sresult\diff1), #PB_Long) 
      
      ;   MessageRequester("forcewords",forceword1+Chr(10)+forceword2)
      If #FilterResults
        forcecount= 0
        ForEach sresults()
          If sresults()\words = 1
            forcecount +1
            Break
          EndIf
        Next 
        If forcecount > 0
          ForEach sresults()
            If sresults()\words = 0
              DeleteElement(sresults())
            EndIf 
          Next 
        EndIf
        
        If forceword1 <> "" 
          forcecount= 0
          ForEach sresults()
            mtitle.s   = LCase( sresults()\title)
            If FindString(mtitle,forceword1,1)
              forcecount +1
              Break
            EndIf
          Next 
          
          If forcecount > 0
            ForEach sresults()
              mtitle.s   = LCase( sresults()\title)
              If FindString(mtitle,forceword1,1) = 0
                DeleteElement(sresults())
              EndIf 
            Next 
          EndIf
        EndIf 
        If forceword2 <> "" 
          forcecount= 0
          ForEach sresults()
            mtitle.s   = LCase( sresults()\title)
            If FindString(mtitle,forceword2,1)
              forcecount +1
              Break
            EndIf 
          Next 
          If forcecount > 0
            ForEach sresults()
              mtitle.s   = LCase( sresults()\title)
              If FindString(mtitle,forceword2,1) = 0
                DeleteElement(sresults())
              EndIf 
            Next 
          EndIf
        EndIf 
        
        
        While ListSize(sresults()) >= 2
          
          If CheckDuration = 0 And ListSize(sresults()) >= 2
            avduration.f = 0
            ForEach sresults()
              avduration = avduration+sresults()\duration
            Next
            avduration = avduration/ListSize(sresults())
            ForEach sresults()
              sresults()\diff2 = Abs(sresults()\duration -avduration)
            Next
            SortStructuredList(sresults(),#PB_Sort_Ascending,OffsetOf(sresult\diff2), #PB_Long) 
          Else
            If CheckDuration
              SortStructuredList(sresults(),#PB_Sort_Ascending,OffsetOf(sresult\diff1), #PB_Long)
            Else
              SortStructuredList(sresults(),#PB_Sort_Descending,OffsetOf(sresult\rating), #PB_Long) 
            EndIf 
          EndIf
          
          LastElement(sresults())
          DeleteElement(sresults())
        Wend 
      EndIf  
      ForEach sresults()
        info.s = info.s+"<h1>"+sresults()\musicURL+"</h1><br>"+sresults()\text+Chr(10)+" percent: "+StrF(sresults()\wpercent*100,1)+"<br><br>"+Chr(10)
      Next
      
      
      
    Else
      info.s = "Search Music"+Chr(10)+RequestString+Chr(10)+Str(Gettickcount_()-Val(RequestTime))
    EndIf
    If RequestType = "7"
       info = GetString(info,"<a href="+Chr(34),Chr(34))+Chr(10)+GetString(info,"<h1>","</h1>")
    EndIf
    
    If RequestType = "3"
      info = GetString(info,"<a href="+Chr(34),Chr(34))+Chr(10)+GetString(info,"<h1>","</h1>")
      
      
    EndIf
    
EndSelect




WriteConsoleData(@info,StringByteLength(info))
 
; jaPBe Version=3.13.4.880
; FoldLines=0000003C0058005D005F0062006400AB00AE00B100B300BE00C000C500C700EB
; FoldLines=00EE00F701140138013901460148014F0152016C017001AF01B201B801BB0231
; FoldLines=023302450247025702590269026B0275
; Build=277
; Language=0x0000 Language Neutral
; FirstLine=288
; CursorPosition=950
; EnableThread
; EnableUnicode
; EnableXP
; EnableOnError
; ExecutableFormat=Console
; Executable=ServerAgent.exe
; DontSaveDeclare
; EOF