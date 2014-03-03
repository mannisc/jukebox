;
; ------------------------------------------------------------
;
;   PureBasic - Network (Server) example file
;
;    (c) 2003 - Fantaisie Software
;
; ------------------------------------------------------------
;
Global startime = GetTickCount_()
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

Structure Client
  id.l
  thread.l
  inputbuffersize.l
  outputbuffersize.l
  headersize.l
  inputbuffer.l
  outputlen.l
  outputbuffer.l
  availableinput.l
  readmem.l
  writemem.l
  kill.l
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

Structure request
  type.l
  thread.l
  params.s
  result.s
  ready.l
  outputbuffer.l
  *Client.Client
EndStructure

Structure ClipUrl
  url.s
  type.s
EndStructure

Global EOL.s = Chr(13)+Chr(10)
Global EOLAscii .s = Space(10)
PokeS(@EOLAscii,EOL,-1,#PB_Ascii)
EOLAscii = Trim(EOLAscii)
Global NewList clients.Client()
Global PluginsFile.s = "plugins.dat"
Global NewList vsides.VideoSide()
Global Dim *vsidedim.VideoSide(100)
Global vsidesLoadedNum = 0
Global egadget

Global RequestCounter.l
Global HTMLBody.s = "<!DOCTYPE HTML PUBLIC "+Chr(34)+"-//W3C//DTD HTML 4.01//EN"+Chr(34)+Chr(10)+"       "+Chr(34)+"http://www.w3.org/TR/html4/strict.dtd"+Chr(34)+">"+Chr(10)+"<HTML>"+Chr(10)+"<head>"+Chr(10)+"<title>#title#</title>"+Chr(10)+"</head>"+Chr(10)+"<body>"+Chr(10)+"#body#"+Chr(10)+"</body>"+Chr(10)+"</HTML>"
Global HTMLLink.s = "<a href="+Chr(34)+"#url#"+Chr(34)+">#text#</a>"
Global HTMLEmbed.s= "<object width="+Chr(34)+"425"+Chr(34)+" height="+Chr(34)+"344"+Chr(34)+"><param name="+Chr(34)+"movie"+Chr(34)+" value="+Chr(34)+"#swfurl#"+Chr(34)+"></param><param name="+Chr(34)+"allowFullScreen"+Chr(34)+" value="+Chr(34)+"true"+Chr(34)+"></param><param name="+Chr(34)+"allowscriptaccess"+Chr(34)+" value="+Chr(34)+"always"+Chr(34)+"></param><embed src="+Chr(34)+"#swfurl#"+Chr(34)+" type="+Chr(34)+"application/x-shockwave-flash"+Chr(34)+" allowscriptaccess="+Chr(34)+"always"+Chr(34)+" allowfullscreen="+Chr(34)+"true"+Chr(34)+" width="+Chr(34)+"425"+Chr(34)+" height="+Chr(34)+"344"+Chr(34)+"></embed></object>"

htmlfile.s = ""
htmlfile=  "HTTP/1.1 200 OK"+EOL
htmlfile+  "Date: Wed, 07 Aug 1996 11:15:43 GMT"+EOL
htmlfile+  "Server: Atomic Web Server 0.2b"+EOL
htmlfile+  "Content-Type: text/html; charset=UTF-16"+EOL
htmlfile+  "Content-Length: #len#"+EOL
Global HTMLHeaderText.s = htmlfile
htmlfile.s = ""
htmlfile=  "HTTP/1.1 200 OK"+EOL
htmlfile+  "Date: Wed, 07 Aug 1996 11:15:43 GMT"+EOL
htmlfile+  "Server: Atomic Web Server 0.2b"+EOL
htmlfile+  "Content-Type: application/octet-stream"+EOL
htmlfile+  "Content-Length: #len#"+EOL
Global HTMLHeaderData.s = htmlfile
htmlfile.s = ""
htmlfile=  "HTTP/1.1 301 Moved Permanently"+EOL
htmlfile+  "Date: Wed, 07 Aug 1996 11:15:43 GMT"+EOL
htmlfile+  "Server: Atomic Web Server 0.2b"+EOL
htmlfile+  "Content-Type: application/octet-stream"+EOL
htmlfile+  "Content-Length: 0"+EOL
htmlfile+  "Location: #location#"+EOL
Global HTMLHeaderMoved.s = htmlfile


Global Dim portals.s(100)
portals(0) = "muzu.dll"
portals(1) = "dailymotion.dll"
portals(2) = "metacafe.dll"
portals(3) = "googlevideo.dll"
portals(4) = "youtube.dll"
Global NumVSides = 4

Global SWFPlayer.s =  "http://freenet-homepage.de/videoplayer/SWF-Player/player_flv_maxi.swf?flv=#file#&showstop=1&showvolume=1&showtime=1&showfullscreen=1&autoplay=1"

Procedure CreateVideoSides()
  Repeat
    sidefile = ReadFile(#PB_Any,"Plugins\"+PluginsFile.s)
  Until sidefile <> 0
  Repeat
    vside.s = ReadString(sidefile)
    If Val(StringField(vside,3,";"))
      openside = 1
    Else
      openside = 0
    EndIf
    If Trim(vside) <> ""
      filename.s = StringField(vside,2,";")
      If FileSize("plugins\"+filename) > 0
        AddElement(vsides())
        *vsidedim(ListIndex(vsides())) = vsides()
        vsides()\name.s    = StringField(vside,1,";")
        vsides()\dllName   = filename
        vsides()\dllVersion= ValF(StringField(vside,3,";"))
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
          ;*VideoSide\_isURLVideoExtern= GetFunction(*VideoSide\dllID,"IsURLVideoExtern")
          *VideoSide\_GetMovieFLV     = GetFunction(*VideoSide\dllID,"GetMovieFLV")
          ;*VideoSide\testerror        = GetFunction(*VideoSide\dllID,"TestError")
          *VideoSide\searchthread     = 0
          *VideoSide\searched         = 0
          *VideoSide\showstate        = 0
          *VideoSide\VideoID          = currentVideoID
          *VideoSide\updateVideos     = 0
          *VideoSide\pauseThread      = 0
          *VideoSide\dllVersion = Version
          CallFunction(*VideoSide\dllID,"initSide",DLhINet) 
        Else
          DeleteElement(vsides())
        EndIf
      EndIf
    EndIf
  Until Eof(sidefile)
  vsidesLoadedNum = ListSize(vsides())
  CloseFile(sidefile)

EndProcedure

Procedure GetSidePointerbyURL( VideoURL.s) 
  sidepointer =*vsidedim(0)
  For s = 0 To vsidesLoadedNum-1
    If *vsidedim(s)\_IsURLVideo
      Debug *vsidedim(s)\dllName
      If CallFunctionFast(*vsidedim(s)\_IsURLVideo,@VideoURL)
        sidepointer =*vsidedim(s)
        Break
      EndIf 
    EndIf
  Next
  Debug VideoURL+" "+vsides()\name
  ProcedureReturn sidepointer
EndProcedure

Procedure GetPageSearch(*element)
  *VideoSide.VideoSide             =  *element
  ReturnValue.l = 0 
  searchID = Random(100000)
  Debug *VideoSide\_GetPageSearch
  *VideoSide\currentsearchthreadID = searchID
  CallFunctionFast(*VideoSide\_GetPageSearch,*VideoSide,searchID,@ReturnValue.l)
EndProcedure

Procedure CreateRequest(*Request.request)
  RequestCounter+1
  Debug "--> *Request\type = " +Str(*Request\type)
  If *Request\type =1
    Debug *Request\params
    Dim urls.ClipUrl(0) 
    url.s = *Request\params
    title.s = ""
    If Trim(url)
      Debug url
      *VideoSide.VideoSide = GetSidePointerbyURL(url)
      Debug "Videoside: "+*VideoSide\dllName
      If *VideoSide
        title = *VideoSide\name
        name.s = ""
        purl.s = ""
        Repeat
          *ReturnString = AllocateMemory(5002)
        Until *ReturnString
        PokeS(*ReturnString,"extended")
        CallFunctionFast(*VideoSide\_GetMovieFLV,@url,@purl,@name.s,*ReturnString)
      EndIf
      ReturnValue.s = Trim(PeekS(*ReturnString))
      Debug ReturnValue 
      FreeMemory(*ReturnString)
      bodystring.s = ""
      If ReturnValue
        videoanz = 1
        If Left(ReturnValue,9) <> "extended"+Chr(1)
          urls(0)\url      = Trim(StringField(ReturnValue,1,Chr(10)))
          urls(0)\type     = "FLV"
        Else
          videopart.s = Trim(StringField(ReturnValue,1,Chr(10)))
          videoanz = CountString(videopart,Chr(1))-1
          ReDim urls(videoanz)
          For s = 1 To videoanz
            videoinfo.s = StringField(videopart,s+1,Chr(1))
           
            videoquality     = Val(StringField(videoinfo,2,Chr(2)))
            urls(s-1)\url      = StringField(videoinfo,4,Chr(2))
            urls(s-1)\type     = StringField(videoinfo,1,Chr(2))
            
           ; MessageRequester("",StringField(videoinfo,1,Chr(2))+Chr(10)+Chr(10)+StringField(videoinfo,2,Chr(2))+Chr(10)+Chr(10)+StringField(videoinfo,3,Chr(2))+Chr(10)+Chr(10)+StringField(videoinfo,4,Chr(2)))
            
          Next
        EndIf
        name.s    = Trim(StringField(ReturnValue,2,Chr(10)))
        bodystring = "";title+"<br>"+Chr(10)+url+"<br><br>"+Chr(10)
        Debug videoanz
        For s = 1 To videoanz
          If urls(s-1)\url  And urls(s-1)\url <> "locked"
            filename.s = name+"."+LCase(urls(s-1)\type)
            newURL.s =  urls(s-1)\url
            linkstring.s = ReplaceString(HTMLLink,"#url#",newURL)
            linkstring.s = ReplaceString(linkstring,"#text#",filename)
            bodystring = bodystring+linkstring+"<br>"+Chr(10)
            Debug newURL
          EndIf
        Next
      EndIf
    Else
      bodystring = ""
    EndIf
    *Request\result = HTMLBody
    *Request\result = ReplaceString(*Request\result,"#title#","JukeBox PlaylistCommander - Server")
    *Request\result = ReplaceString(*Request\result,"#body#",bodystring.s)
    Size = StringByteLength(*Request\result,#PB_Unicode)
    Header.s = ReplaceString(HTMLHeaderText,"#len#",Str(Size))+EOL
    headersize.l = StringByteLength(Header,#PB_Ascii)
    PokeS(*Request\outputbuffer,Header,-1,#PB_Ascii)
    PokeS(*Request\outputbuffer+headersize,*Request\result)
    *Request\client\headersize = headersize
    *Request\client\outputlen  = headersize+Size
  ElseIf *Request\type =2  
    Debug "*Request\type =2"
    searchword.s = *Request\params
    *VideoSide.VideoSide = *vsidedim(s)
    For vsideindex = 0 To NumVSides
      For s = 0 To vsidesLoadedNum-1
        If *vsidedim(s)\dllName = portals(vsideindex)
          *VideoSide.VideoSide = *vsidedim(s)
          Break
        EndIf 
      Next 
      Debug  *VideoSide\dllName
      *VideoSide\updateVideos = 0
      PokeS(*VideoSide\suchen,searchword,10000)
      PokeS(*VideoSide\message, "")
      *VideoSide\messageReady = 1
      *VideoSide\searched = 1
      Debug "Start search!"
      searchthread = CreateThread(@GetPageSearch(), *VideoSide)
      Debug "REPEAT"
      Repeat 
        If *VideoSide\messageReady = 0
          message.s = PeekS(*VideoSide\message,-1,#PB_Unicode)
          If  message <> "" 
            Debug "-----------"
            Debug message
            Debug "messege received!"
            Break
          EndIf
        EndIf 
        If IsThread(searchthread ) = 0
          Debug "thread ende!"
          Break 
        EndIf
        Delay(1)
      ForEver 
      Debug "END SEARCH"
      If message <> ""
        Break 
      EndIf
    Next 
    message = RemoveString(message,"Neuer Film"+Chr(10))
    searchID +1
    SetGadgetText(egadget,GetGadgetText(egadget)+"Client stellt Suchanfrage: "+*Request\params+Chr(10))
    *Request\result = HTMLBody
    *Request\result = ReplaceString(*Request\result,"#title#","JukeBox PlaylistCommander - Server")
    *Request\result = ReplaceString(*Request\result,"#body#",message.s)
    Size = StringByteLength(*Request\result,#PB_Unicode)
    Header.s = ReplaceString(HTMLHeaderText,"#len#",Str(Size))+EOL
    headersize.l = StringByteLength(Header,#PB_Ascii)
    PokeS(*Request\outputbuffer,Header,-1,#PB_Ascii)
    PokeS(*Request\outputbuffer+headersize,*Request\result)
    *Request\client\headersize = headersize
    *Request\client\outputlen  = headersize+Size
  EndIf 
  Debug bodystring
  *Request\ready=1
EndProcedure

Procedure ClientThread(*Client.Client)
  Debug *Client
  Global NewList requests.request()
  Repeat
    If *Client\availableinput
      Debug "INPUT!!!"
      *Client\readmem = 1
      inputstring.s = PeekS(*Client\inputbuffer,-1,#PB_Ascii)
      Debug inputstring
      *Client\availableinput = 0
      *Client\readmem       = 0
      If StringField(inputstring,1," ") = "GET"
        params.s = StringField(inputstring,1,Chr(10))
        pos = FindString(params,"?",1)
        params.s = Mid(params,pos+1,Len(inputstring))
        params.s = StringField(params,1," ")
        params.s = params.s+"&"
        url.s = GetString(params,"url=","&")
        If url 
          url = Trim(URLDecoder(url))
          AddElement(requests())
          requests()\type=1
          requests()\params = url
          requests()\result = ""
          requests()\ready = 0
          requests()\client = *Client
          requests()\outputbuffer = *Client\outputbuffer
          requests()\thread = CreateThread(@CreateRequest(),requests())
        Else
          search.s = GetString(params,"search=","&")
          If search 
            
            search = Trim(URLDecoder(search))
            AddElement(requests())
            requests()\type=2
            requests()\params = search
            
            requests()\result = ""
            requests()\ready = 0
            requests()\client = *Client
            requests()\outputbuffer = *Client\outputbuffer
            requests()\thread = CreateThread(@CreateRequest(),requests())
            Debug "SEARCH!!!!!!!!!! "+search
          EndIf 
          ;RunProgram("clientserver.exe",Str( requests()\type)+" "+Chr(34)+requests()\params+Chr(34),"")
        EndIf
      EndIf
    EndIf
    If *Client\writemem = 0
      
      ForEach requests()
        If ListSize(requests())
          If requests()\ready And IsThread(requests()\thread) = 0
            *Client\writemem = 1
            DeleteElement(requests())
            Break
          EndIf
        Else
          Break 
        EndIf 
      Next
    EndIf 
    Delay(1)
  Until *Client\kill = 1 
  *Client\kill = 1
EndProcedure

CreateVideoSides()

Port = 80
BufferLen = 100000
*Buffer = AllocateMemory(BufferLen-1)


If CreateNetworkServer(0, Port)
  Debug "!!!"
  Mwindow = OpenWindow(#PB_Any,0,0,600,600,"Server", #PB_Window_ScreenCentered|#PB_Window_MinimizeGadget)
  egadget = EditorGadget(#PB_Any,0,0,600,600,#PB_Editor_ReadOnly)
  Repeat
    Wevent =  WindowEvent()
    If Wevent = #PB_Event_CloseWindow
      Quit = 1
      Break
    EndIf
    
    ForEach clients()
      ;TODO
      If  clients()\writemem
        Debug "SEND: "+PeekS(clients()\outputbuffer+ clients()\headersize)
        SendNetworkData(clients()\id,clients()\outputbuffer,clients()\outputlen)
        clients()\writemem = 0
      EndIf
      If clients()\kill=2
        DeleteElement(clients())
      EndIf
    Next
    
    SEvent = NetworkServerEvent()
    If SEvent
      *Client.Client = 0
      ClientID = EventClient()
      ForEach clients()
        If clients()\id = ClientID
          *Client = clients()
          Break
        EndIf
      Next
      Select SEvent
        Case 1
          AddElement(clients())
          *Client = clients()
          *Client\id = ClientID
          *Client\inputbuffersize  = 100000
          *Client\outputbuffersize = 1000000
          *Client\outputlen        = 0
          *Client\inputbuffer.l    = AllocateMemory(*Client\inputbuffersize-1)
          *Client\outputbuffer     = AllocateMemory(*Client\outputbuffersize-1)
          *Client\availableinput   = 0
          *Client\readmem          = 0
          *Client\writemem         = 0
          *Client\thread = CreateThread(@ClientThread(),*Client)
          SetGadgetText(egadget,GetGadgetText(egadget)+"Neuer Client..."+Chr(10))
        Case 2
          While *Client\availableinput:Delay(1):Wend
          rpos =0
          readpartlen = 5000
          Repeat
            rbytes= ReceiveNetworkData(ClientID, *Buffer+rpos, readpartlen) 
            If rbytes = 0
              rpos+readpartlen
              Break
            Else 
              rpos + rbytes
              If BufferLen < rpos +readpartlen
                BufferLen = rpos +readpartlen
                *Buffer = AllocateMemory(rpos+readpartlen)
              EndIf
              If sbytes < readpartlen
                Break
              EndIf
            EndIf
          ForEver
          If rpos > *Client\inputbuffersize
            *Client\inputbuffersize=rpos+2
            *Client\inputbuffer.l    = AllocateMemory(*Client\inputbuffersize-1)
          EndIf
          CopyMemory(*Buffer,*Client\inputbuffer,rpos)
          *Client\availableinput = 1
          SetGadgetText(egadget,GetGadgetText(egadget)+"Neue Anfrage..."+Chr(10))
        Case 3
        ;  ReceiveNetworkFile(ClientID, "received_"+Str(ClientID))
        Case 4
          *Client\kill = 1
      EndSelect
    EndIf
    
  Until Quit = 1 
  ForEach clients()
    clients()\kill=1
  Next
  CloseNetworkServer(0)
Else
  MessageRequester("Error", "Can't create the server (port in use?).", 0)
EndIf

  
End   


; IDE Options = PureBasic 5.21 LTS (Windows - x64)
; CursorPosition = 506
; FirstLine = 478
; Folding = --