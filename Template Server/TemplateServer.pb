InitNetwork()



If OpenFTP(0, "songbase.net", "u76604889", "songbasetwinners")
  
  SetFTPDirectory(0, "test/");TODO Remove for deployent
    Debug Result

  Result = ReceiveFTPFile(0, "index.template.html", "index.template.html")

  Debug Result


  Result = SendFTPFile(0, OpenFileRequester("Choose a file to send", "", "*.*", 0), "index.html", 1)
  Debug Result
  Repeat
    Debug FTPProgress(0)
    Delay(300)
  Until FTPProgress(0) = -3 Or FTPProgress(0) = -2

  Debug "finished"
  
Else
  MessageRequester("Error", "Can't connect to the FTP server")
EndIf

; IDE Options = PureBasic 5.21 LTS (Windows - x64)
; CursorPosition = 8
; EnableUnicode
; EnableXP