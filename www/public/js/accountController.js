/**
 * accountController.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 07.03.14 - 02:11
 */


var accountController = function () {

};
accountController.loginToken = "";
accountController.loggedIn   = false;
accountController.userName   = "";
accountController.showregisterpopup = false;
accountController.requestid = 1;

accountController.logout = function(){
    var token =  rsaController.rsa.encrypt(accountController.loginToken);
    $.ajax({
        timeout: 30000,
        url: preferences.serverURL + "?logout=" +token,
        success: function (data) {
        }
    })
    accountController.loggedIn   = false;
    $('#popupLogin').popup('close');
    uiController.styleTopButtons();
    $scope.safeApply();
    uiController.styleTopButtons();
    /*setTimeout(function(){
        btn.addClass("animated");
    },500)*/
    accountController.requestid = 1;
}

accountController.signIn = function(){
    var send = function (email, pw) {
        var md5pw = MD5($.trim(pw));
        pw        = rsaController.rsa.encrypt(pw);
        var username = email;
        email = rsaController.rsa.encrypt(email);
        $.ajax({
            timeout: 30000,
            url: preferences.serverURL + "?login=" + email + "&pw=" +pw,
            success: function (data) {
                if(data!=""){
                    accountController.loggedIn=true;
                    accountController.loginToken = MD5(data+md5pw);
                    accountController.userName =username;
                    var btn = $('#header .ui-btn.animated').removeClass("animated");
                    $('#popupLogin').popup('close');
                    uiController.styleTopButtons();
                    $scope.safeApply();
                    uiController.styleTopButtons();
                    setTimeout(function(){
                        btn.addClass("animated");
                    },500)
                    accountController.requestid = 1;

                // accountController.savePlaylist(1,"TEST",0,"TESTDATEN");

                    var loadPlaylists = function(playlists){
                        if(playlists){
                            alert(playlists)
                            playlists = JSON.parse(playlists);
                            if(playlists&&playlists.length>0){
                                //Remove duplicate Playlists
                                for (var i = 0; i <  playlistController.playlists.length; i++) {
                                    for (var j = 0; j <  playlists.length; j++) {
                                          if(playlists[j].gid==playlistController.playlists[i].gid){
                                              playlistController.playlists[i].splice(i,1);
                                              i = i -1;
                                          } else  if(playlists[j].name==playlistController.playlists[i].name){
                                              playlistController.playlists[i].name = playlistController.playlists[i].name+" (2)";
                                          }

                                    }
                                }
                                playlistController.playlists = playlistController.playlists.concat(playlists)
                                if (playlistController.loadedPlaylistSongs.length > 0 && playlistController.loadedPlaylistSongs[0].isPlaylist) {
                                    $scope.safeApply();
                                    setTimeout(function () {
                                        $("#playlistview").listview('refresh');
                                        $("#playlistview").show();
                                        uiController.makePlayListSortable();
                                        setTimeout(function(){
                                            uiController.playListScroll.refresh();
                                        },150)
                                    }, 0)
                                }
                            }
                        }
                    }
                    accountController.loadPlaylists(loadPlaylists)



                }
                else
                {
                    uiController.toast("Error: Please check your login data.", 1500);
                }
            },
            error: function () {
                uiController.toast("Sorry, it is not possible to login at the moment.", 1500);

            }
        })
    }
    var email =  $("#signinuser").val();
    var pw    =  $("#signinpw").val();
    if(email.length>5 && pw.length > 3){
        send(email,pw);
    }
    else
    {
        uiController.toast("Error: Please check your login data.", 1500);
    }
}

accountController.debugData = function(data){
    console.dir("DATA:");
    console.dir(data);
}

accountController.register = function(){
    var send = function (email, pw) {
        var md5pw = MD5($.trim(pw));
        pw    = rsaController.rsa.encrypt(pw);
        var username = email;
        email = rsaController.rsa.encrypt(email);
        $.ajax({
            timeout: 30000,
            url: preferences.serverURL + "?register=" + email + "&pw=" +pw,
            success: function (data) {
                if(data!=""){
                    accountController.loggedIn=true;
                    accountController.loginToken = MD5(data+md5pw);
                    accountController.userName =username;
                    var btn = $('#header .ui-btn.animated').removeClass("animated");
                    $('#popupLogin').popup('close');
                    uiController.styleTopButtons();
                    $scope.safeApply();
                    uiController.styleTopButtons();
                    setTimeout(function(){
                     btn.addClass("animated");
                    },500)
                    accountController.requestid = 1;
                  }
                else
                {
                    uiController.toast("Error: Please check your data.", 1500);
                }
            } ,
            error: function () {
                uiController.toast("Sorry, it is not possible to register at the moment.", 1500);
            }
        })
    }
    var email =  $("#signinuser").val();
    var pw    =  $("#signinpw").val();
    var pwc   =  $("#signinpwc").val();
    if(pw==pwc && email.length>5 && pw.length > 3){
         send(email,pw);
    }
    else
    {
        uiController.toast("Error: Please check your data.", 1500);
    }


}



accountController.savePlaylist = function(gid,name,pos,playlistdata){
    if(accountController.loggedIn){
        var savename = name;
        var savedata = playlistdata;
        accountController.requestid = accountController.requestid +1;
        var nonce    = accountController.requestid;
        var savetoken =  rsaController.rsa.encrypt(accountController.loginToken+nonce);
        var send = function (savename, savedata, savetoken) {
            $.ajax({
                type: "POST",
                data: {storage:savetoken,gid:gid,pos:pos,n:nonce,type:"playlist",name:savename,data:savedata},
                timeout: 30000,
                url: preferences.serverURL ,// + "?storage=" +savetoken+"&gid="+gid+"&pos="+pos+"&n="+nonce+"&type=playlist&name="+savename+"&data=savedata",
                success: function (returndata) {
                    alert("ERFOLGREICH GESPEICHERT")
                }
            })
        }
        send(savename, savedata, savetoken);
    }
}

accountController.loadPlaylist = function(name,callbackSuccess){
    if(accountController.loggedIn){
        var savename = encodeURIComponent(name);
        accountController.requestid = accountController.requestid +1;
        var nonce    = accountController.requestid;
        var savetoken =  rsaController.rsa.encrypt(accountController.loginToken+nonce);
        var send = function (savename, savetoken) {
            name = encodeURIComponent(name);
            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?getdata=" +savetoken+"&n="+nonce+"&type=playlist&name="+savename,
                success: function (playlistdata) {
                    if (callbackSuccess)
                        callbackSuccess(playlistdata);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (callbackSuccess)
                        callbackSuccess(xhr.responseText);
                }
            })
        }
        send(savename, savetoken);
    }
}

accountController.loadPlaylists = function(callbackSuccess){
    if(accountController.loggedIn){
        accountController.requestid = accountController.requestid +1;
        var nonce    = accountController.requestid;
        var savetoken =  rsaController.rsa.encrypt(accountController.loginToken+nonce);
        var send = function (savetoken) {
            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?getdatalist=" +savetoken+"&n="+nonce+"&type=playlist",
                success: function (data) {
                    if (callbackSuccess)
                        callbackSuccess(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (callbackSuccess)
                        callbackSuccess(xhr.responseText);
                }
            })
        }
        send(savetoken);
    }
}


accountController.saveUserData = function(type,name,userdata){
    if(accountController.loggedIn){
        var savename = encodeURIComponent(name);
        var savetype = encodeURIComponent(type);
        var savedata = encodeURIComponent(userdata);
        accountController.requestid = accountController.requestid +1;
        var nonce    = accountController.requestid;
        var savetoken =  rsaController.rsa.encrypt(accountController.loginToken+nonce);
        var send = function (savename,savetype ,savedata, savetoken) {
            $.ajax({
                type: "POST",
                data: {storage:savetoken,gid:gid,pos:pos,n:nonce,type:savetype,name:savename,data:savedata},
                timeout: 30000,
                url: preferences.serverURL, // "?storage=" +savetoken+"&n="+nonce+"&type="+savetype+"&name="+savename+"&data="+savedata,
                success: function (returndata) {
                }
            })
        }
        send(savename,savetype,savedata, savetoken);
    }
}

accountController.loadUserData = function(type,name,callbackSuccess){
    if(accountController.loggedIn){
        var savename = encodeURIComponent(name);
        var savetype = encodeURIComponent(type);
        accountController.requestid = accountController.requestid +1;
        var nonce    = accountController.requestid;
        var savetoken =  rsaController.rsa.encrypt(accountController.loginToken+nonce);
        var send = function (savename,savetype ,savedata, savetoken) {
            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?getdata=" +savetoken+"&n="+nonce+"&type="+savetype+"&name="+savename,
                success: function (data) {
                    if (callbackSuccess)
                        callbackSuccess(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.dir(xhr.responseText);
                }
            })
        }
        send(savename,savetype,savedata, savetoken);
    }
}

accountController.loadUserDataItems = function(type,callbackSuccess){
    if(accountController.loggedIn){
        var savename = encodeURIComponent(name);
        var savetype = encodeURIComponent(type);
        accountController.requestid = accountController.requestid +1;
        var nonce    = accountController.requestid;
        var savetoken =  rsaController.rsa.encrypt(accountController.loginToken+nonce);
        var send = function (savename,savetype ,savedata, savetoken) {
            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?getdatalist=" +savetoken+"&n="+nonce+"&type="+savetype,
                success: function (data) {
                    if (callbackSuccess)
                        callbackSuccess(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.dir(xhr.responseText);
                }
            })
        }
        send(savename,savetype,savedata, savetoken);
    }
}
