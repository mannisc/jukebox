InitNetwork()

If ReceiveHTTPFile("http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&page=1&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json","tracks.data")
  
  
  If OpenFTP(0, "songbase.net", "u76604889", "songbasetwinners")
    
    If SetFTPDirectory(0, "test/public/js")=1;TODO Remove for deployent
      
      DeleteFile("index.template.php")
      
      If ReceiveFTPFile(0, "searchController.template.js", "searchController.template.js")=1
        
        DeleteFile("searchController.js")

        If OpenFile(0,"searchController.template.js")
          If OpenFile(1,"searchController.js")
            If OpenFile(2,"tracks.data")
              
              
              Buffer_PreloadedPopularSongs = AllocateMemory(Lof(2))
              ReadData(2,Buffer_PreloadedPopularSongs,Lof(2))
              
              
            While(Eof(0)=0)
              String.s = ReadString(0)
              
              
              
              If FindString(String,"TS_INSERT:PreloadedPopularSongs")
                
                WriteString(1,"searchController.preloadedPopularSongs = ")
                
                WriteData(1,Buffer_PreloadedPopularSongs,Lof(2))
                WriteStringN(1,";")
                ;WriteStringN(1,"searchController.preloadedPopularSongs = searchController.preloadedPopularSongs.tracks;")

              Else
               WriteStringN(1,String)
              EndIf 
              
            Wend 
            
             CloseFile(2)
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
  Else
  EndIf
EndIf

; IDE Options = PureBasic 5.21 LTS (Windows - x64)
; CursorPosition = 35
; EnableUnicode
; EnableXP