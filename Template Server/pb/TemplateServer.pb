InitNetwork()


IncludeFile "JSON.pbi"

Declare.s concattrackpages(page,pages)

#LoadedPages = 3


If OpenFTP(0, "songbase.net", "u76604889", "songbasetwinners")
  
  
  ;DOWNLOAD NEW TRACKS 
  trackssize = 0;size of tracks
  For page = 1 To #LoadedPages 
    If ReceiveHTTPFile("http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&page="+page+"&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json","tracks"+page+".data") = 0
      End 
      
    EndIf 
    
    trackssize  = trackssize + FileSize("tracks"+page+".data")
  Next
  
  
  
  If SetFTPDirectory(0, "test/public/js")=1;TODO Remove for deployent
    
    DeleteFile("index.template.php")
    
    If ReceiveFTPFile(0, "searchController.template.js", "searchController.template.js")=1
      
      DeleteFile("searchController.js")
      
      If OpenFile(0,"searchController.template.js")
        If OpenFile(1,"searchController.js")
          
          tracksJSON.s = ""
          For page = 1 To #LoadedPages 
            If OpenFile(2,"tracks"+page+".data")
              Buffer_PreloadedPopularSongs = AllocateMemory(Lof(2))
              
              ReadData(2,Buffer_PreloadedPopularSongs+actpos,Lof(2))
              
              
              tracksJSON.s = tracksJSON + "var tmp_page"+page+"= "+PeekS(Buffer_PreloadedPopularSongs,Lof(2))+";tmp_page"+page+" = tmp_page"+page+".tracks.track;"
              
              CloseFile(2) 
              
              
            Else  
              End 
            EndIf 
            
          Next
          
          
          
          
          trackHTML.s = "searchController.preloadedPopularSongs = {track:"+concattrackpages(1,#LoadedPages)+"}"
          
          
          Debug trackHTML
          End 
          
          While(Eof(0)=0)
            String.s = ReadString(0)
            
            
            
            If FindString(String,"TS_INSERT:PreloadedPopularSongs")
              
              WriteString(1,"searchController.preloadedPopularSongs = ")
              
              WriteData(1,Buffer_PreloadedPopularSongs,trackssize)
              WriteStringN(1,";")
              ;WriteStringN(1,"searchController.preloadedPopularSongs = searchController.preloadedPopularSongs.tracks;")
              
            Else
              WriteStringN(1,String)
            EndIf 
            
          Wend 
          
          
          CloseFile(1)
          CloseFile(0)
          
          DeleteFTPFile(0,"searchController.js");
          
          
          Result = SendFTPFile(0,  "searchController.js", "searchController.js", 1)
          Debug Result
          Repeat
            Debug FTPProgress(0)
            Delay(300)
          Until FTPProgress(0) = -3 Or FTPProgress(0) = -2
          
        EndIf 
      EndIf 
    EndIf 
  EndIf
EndIf



Procedure.s concattrackpages(page,pages)
  
  If page<pages
    
    ProcedureReturn "tmp_page"+Str(page)+".concat("+concattrackpages(page+1,pages)+")"
    
  Else  
    ProcedureReturn "tmp_page"+Str(page)
    
  EndIf
  
EndProcedure

; IDE Options = PureBasic 5.21 LTS (Windows - x64)
; CursorPosition = 8
; Folding = -
; EnableXP