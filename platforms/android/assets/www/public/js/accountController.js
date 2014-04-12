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
accountController.loggedIn = false;
accountController.userName = "";
accountController.requestid = 1;
accountController.showRegisterPopup = false;

accountController.getCookie = function(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}

accountController.setCookie = function(cname,cvalue,exdays)
{
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}


accountController.init = function(){
    var trylogin = function () {
        if (authController.ip_token != "auth" && authController.ip_token != "") {
            var loginTokenBase64 = accountController.getCookie("loginToken");
            var userNameBase64 = accountController.getCookie("userName");
            if (loginTokenBase64 != "" && userNameBase64 != "") {
                var token = rsaController.rsa.encrypt(Base64.decode(loginTokenBase64));
                $.ajax({
                    timeout: 30000,
                    url: preferences.serverURL + "?loginToken=" + token + "&auth=" + authController.ip_token,
                    success: function (data) {
                        if (data.auth && data.auth == "true") {
                            authController.extractToken(data.token);
                            trylogin();
                        }
                        else {
                            if (data == "ok") {
                                accountController.loggedIn = true;
                                accountController.loginToken = Base64.decode(loginTokenBase64);
                                accountController.userName = Base64.decode(userNameBase64);
                                accountController.requestid = 1;
                                $scope.safeApply();
                                uiController.styleTopButtons();
                                accountController.loadStoredData();
                            }
                        }
                    }
                })
            }
        }
        else{
           setTimeout(trylogin, 1000);
        }
    }
    setTimeout(trylogin, 1000);
}

accountController.toggleSignInRegister = function () {

    accountController.showRegisterPopup = !accountController.showRegisterPopup;
    if (accountController.showRegisterPopup) {
        $('#signintitle').html('Please Register');
        $('#signinButton').html('Register');
        $('#registerlink').html('Sign in');
        $('#useremail').show();
        $('#pwconfirm').show();
    } else {
        $('#signintitle').html('Sign in');
        $('#signinButton').html('Sign in');
        $('#registerlink').html('Register');
        $('#useremail').hide();
        $('#pwconfirm').hide();
    }
    ;
    $('#signinusername').focus();
}

accountController.logout = function () {
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        var token = rsaController.rsa.encrypt(accountController.loginToken);
        $.ajax({
            timeout: 30000,
            url: preferences.serverURL + "?logout=" + token+"&auth="+authController.ip_token,
            success: function (data) {
                if(data.auth && data.auth=="true"){
                    authController.extractToken(data.token);
                    accountController.logout();
                }
                else
                {
                    if (uiController.savePlaylist)
                        uiController.toggleSavePlaylist();
                }
            }
        })
        accountController.setCookie("loginToken",Base64.encode(""),0);
        accountController.setCookie("userName",Base64.encode(""),0);
        playlistController.loadedPlaylistSongs = new Array();
        playlistController.loadedPlaylistSongs = new Array();
        accountController.loggedIn = false;
        $('#popupLogin').popup('close');
        uiController.styleTopButtons();
        $scope.safeApply();
        uiController.styleTopButtons();
        /*setTimeout(function(){
         btn.addClass("animated");
         },500)*/
        accountController.requestid = 1;
    }
}

accountController.loadStoredData = function(){
    var playlistsReady = function(playlistdata){
        if(playlistdata){
            var playlists = new Array();
            playlists[0] = {
                name: "Youtube - playlist",
                gid: 1,
                tracks: new Array(),
                isPlaylist: true,
                id: 1
            }
            if(playlistdata.items && playlistdata.items.length > 0){

                //Copy received (stored) data to playlists-Array;
                for (var j = 0; j < playlistdata.items.length; j++) {
                    playlists[0].tracks[j] = {
                        name: playlistdata.items[j].name,
                        gid: parseInt(playlistdata.items[j].gid),
                        tracks: playlistdata.items[j].data,
                        isPlaylist: true,
                        id: parseInt(playlistdata.items[j].gid)
                    }
                }
                if (playlists) {
                    //Remove duplicate Playlists
                    if(playlistController.playlists.length){
                        for (var i = 0; i < playlistController.playlists.length; i++) {
                            for (var j = 0; j < playlists.length; j++) {
                                if (playlists[j].gid == playlistController.playlists[i].gid) {
                                    playlistController.playlists[i].splice(i, 1);
                                    i = i - 1;
                                } else if (playlists[j].name == playlistController.playlists[i].name) {
                                    playlistController.playlists[i].name = playlistController.playlists[i].name + " (2)";
                                }

                            }
                        }
                    }

                    //Find new playlistController.globalId
                    playlistController.playlists = playlistController.playlists.concat(playlists);
                    var globalId = playlistController.playlists.length
                    for (var j = 0; j < playlistController.playlists.length; j++) {
                        if(playlistController.playlists[j].gid+1 > globalId){
                            globalId = playlistController.playlists[j].gid+1;
                        }
                    }
                    playlistController.globalIdPlaylist = globalId;
                    playlistController.globalId         = globalId;



                    console.dir("User playlists: ");
                    console.dir(playlistController.playlists);


                    $scope.safeApply();
                    uiController.showPlaylists();
                    setTimeout(function(){$('#searchinput').focus();},500)
                    if (playlistController.loadedPlaylistSongs.length > 0 && playlistController.loadedPlaylistSongs[0].isPlaylist) {
                        setTimeout(function () {

                            playlistController.makePlayListSortable();
                            setTimeout(function () {
                                uiController.playListScroll.refresh();
                            }, 150)
                        }, 0)
                    }
                }
            }
        }
    }
    accountController.loadPlaylists(playlistsReady)
}


accountController.signIn = function () {
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        var send = function (name, pw) {
            var md5pw = MD5($.trim(pw));
            pw = rsaController.rsa.encrypt(pw);
            name  = rsaController.rsa.encrypt(name);
            var email = "";
            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?login=" + name+ "&email=" + email+ "&pw=" + pw+"&auth="+authController.ip_token,
                success: function (data) {
                    if(data.auth && data.auth=="true"){
                        authController.extractToken(data.token);
                        send(name, pw);
                    }
                    else
                    {
                        if (data != "") {
                            accountController.loggedIn = true;
                            accountController.loginToken = MD5(data + md5pw);
                            accountController.userName = username;
                            accountController.setCookie("loginToken",Base64.encode(accountController.loginToken),1);
                            accountController.setCookie("userName",Base64.encode(accountController.userName),1);

                            var btn = $('#header .ui-btn.animated').removeClass("animated");
                            $('#popupLogin').popup('close');
                            uiController.styleTopButtons();
                            $scope.safeApply();
                            uiController.styleTopButtons();
                            setTimeout(function () {
                                btn.addClass("animated");
                            }, 500)
                            accountController.requestid = 1;

                            accountController.loadStoredData();


                        }
                        else {
                            uiController.toast("Error: Please check your login data.", 1500);
                        }
                    }
                },
                error: function () {
                    uiController.toast("Sorry, it is not possible to login at the moment.", 1500);

                }
            })
        }
        var username = $("#signinusername").val();//TODO USERNAME anstatt email
        var pw = $("#signinpw").val();
        if (username.length > 3 && pw.length > 3) {
            send(username, pw);
        }
        else {
            uiController.toast("Error: Please check your login data.", 1500);
        }
    }
}

accountController.debugData = function (data) {
    console.dir("DATA:");
    console.dir(data);
}

accountController.register = function () {
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        var send = function (name,email, pw) {
            var md5pw = MD5($.trim(pw));
            name  = rsaController.rsa.encrypt(name);
            email = rsaController.rsa.encrypt(email);
            pw = rsaController.rsa.encrypt(pw);
            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?register=" + name + "&email=" + email+ "&pw=" + pw+"&auth="+authController.ip_token,
                success: function (data) {
                    if(data.auth && data.auth=="true"){
                        authController.extractToken(data.token);
                        send(name,email, pw);
                    }
                    else
                    {
                        if (data != "") {
                            accountController.loggedIn = true;
                            accountController.loginToken = MD5(data + md5pw);
                            accountController.userName = username;
                            var btn = $('#header .ui-btn.animated').removeClass("animated");
                            $('#registerLogin').popup('close');
                            uiController.styleTopButtons();
                            $scope.safeApply();
                            uiController.styleTopButtons();
                            setTimeout(function () {
                                btn.addClass("animated");
                            }, 500)
                            accountController.requestid = 1;
                        }
                        else {
                            uiController.toast("Error: Please check your data.", 1500);
                        }
                    }
                },
                error: function () {
                    uiController.toast("Sorry, it is not possible to register at the moment.", 1500);
                }
            })
        }
        var username = $("#registerusername").val();
        var email = $("#registeruser").val();
        var pw = $("#registerpw").val();
        var pwc = $("#registerpwc").val();
        if (pw == pwc && email.length > 5 && pw.length > 3 && username.length > 3) {
            send(username,email, pw);
        }
        else {
            uiController.toast("Error: Please check your data.", 1500);
        }
    }

}


accountController.savePlaylist = function (gid, name, pos, playlistdata) {
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        if (accountController.loggedIn) {
            var savename = escape(name);
            var savedata = escape(playlistdata);
            accountController.requestid = accountController.requestid + 1;
            var nonce = accountController.requestid;
            var savetoken = rsaController.rsa.encrypt(accountController.loginToken + nonce);
            var send = function (savename, savedata, savetoken) {
                $.ajax({
                    type: "POST",
                    data: {auth:authController.ip_token,storage: savetoken, gid: gid, pos: pos, n: nonce, type: "playlist", name: savename, data: savedata},
                    timeout: 30000,
                    url: preferences.serverURL,// + "?storage=" +savetoken+"&gid="+gid+"&pos="+pos+"&n="+nonce+"&type=playlist&name="+savename+"&data=savedata",
                    success: function (data) {
                        if(data.auth && data.auth=="true"){
                            authController.extractToken(data.token);
                            send(savename, savedata, savetoken);
                        }
                    }
                })
            }
            send(savename, savedata, savetoken);
        }
    }
}

accountController.loadPlaylist = function (name, callbackSuccess) {
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        if (accountController.loggedIn) {
            var savename = encodeURIComponent(name);
            accountController.requestid = accountController.requestid + 1;
            var nonce = accountController.requestid;
            var savetoken = rsaController.rsa.encrypt(accountController.loginToken + nonce);
            var send = function (savename, savetoken) {
                name = encodeURIComponent(name);
                $.ajax({
                    timeout: 30000,
                    url: preferences.serverURL + "?getdata=" + savetoken + "&n=" + nonce + "&type=playlist&name=" + savename+"&auth="+authController.ip_token,
                    success: function (data) {
                        if(data.auth && data.auth=="true"){
                            authController.extractToken(data.token);
                            send(savename, savetoken);
                        }
                        else{
                            if (callbackSuccess)
                                callbackSuccess(data);
                        }
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
}

accountController.loadPlaylists = function (callbackSuccess) {
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        if (accountController.loggedIn) {
            accountController.requestid = accountController.requestid + 1;
            var nonce = accountController.requestid;
            var savetoken = rsaController.rsa.encrypt(accountController.loginToken + nonce);
            var send = function (savetoken) {
                $.ajax({
                    timeout: 30000,
                    url: preferences.serverURL + "?getdatalist=" + savetoken + "&n=" + nonce + "&type=playlist&auth="+authController.ip_token,
                    success: function (data) {
                        if(data.auth && data.auth=="true"){
                            authController.extractToken(data.token);
                            send(savetoken);
                        }
                        else
                        {
                            if (callbackSuccess)
                                callbackSuccess(data);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(xhr.status);
                        alert(thrownError);
                        if (callbackSuccess)
                            callbackSuccess(xhr.responseText);
                    }
                })
            }
            send(savetoken);
        }
    }
}


accountController.saveUserData = function (type, name, userdata) {
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        if (accountController.loggedIn) {
            var savename = encodeURIComponent(name);
            var savetype = encodeURIComponent(type);
            var savedata = encodeURIComponent(userdata);
            accountController.requestid = accountController.requestid + 1;
            var nonce = accountController.requestid;
            var savetoken = rsaController.rsa.encrypt(accountController.loginToken + nonce);
            var send = function (savename, savetype, savedata, savetoken) {
                $.ajax({
                    type: "POST",
                    data: {auth:authController.ip_token,storage:savetoken,gid:gid,pos:pos,n:nonce,type:savetype,name:savename,data:savedata},
                    timeout: 30000,

                    url: preferences.serverURL, // "?storage=" +savetoken+"&n="+nonce+"&type="+savetype+"&name="+savename+"&data="+savedata,
                    success: function (data) {
                        if(data.auth && data.auth=="true"){
                            authController.extractToken(data.token);
                            send(savename, savetype, savedata, savetoken);
                        }
                    }
                })
            }
            send(savename, savetype, savedata, savetoken);
        }
    }
}

accountController.loadUserData = function (type, name, callbackSuccess) {
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        if (accountController.loggedIn) {
            var savename = encodeURIComponent(name);
            var savetype = encodeURIComponent(type);
            accountController.requestid = accountController.requestid + 1;
            var nonce = accountController.requestid;
            var savetoken = rsaController.rsa.encrypt(accountController.loginToken + nonce);
            var send = function (savename, savetype, savedata, savetoken) {
                $.ajax({
                    timeout: 30000,
                    url: preferences.serverURL + "?getdata=" + savetoken + "&n=" + nonce + "&type=" + savetype + "&name=" + savename+"&auth="+authController.ip_token,
                    success: function (data) {
                        if(data.auth && data.auth=="true"){
                            authController.extractToken(data.token);
                            send(savename, savetype, savedata, savetoken);
                        }
                        else
                        {
                            if (callbackSuccess)
                                callbackSuccess(data);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.dir(JSON.parse(xhr.responseText));
                    }
                })
            }
            send(savename, savetype, savedata, savetoken);
        }
    }
}

accountController.loadUserDataItems = function (type, callbackSuccess) {
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        if (accountController.loggedIn) {
            var savename = encodeURIComponent(name);
            var savetype = encodeURIComponent(type);
            accountController.requestid = accountController.requestid + 1;
            var nonce = accountController.requestid;
            var savetoken = rsaController.rsa.encrypt(accountController.loginToken + nonce);
            var send = function (savename, savetype, savedata, savetoken) {
                $.ajax({
                    timeout: 30000,
                    url: preferences.serverURL + "?getdatalist=" + savetoken + "&n=" + nonce + "&type=" + savetype+"&auth="+authController.ip_token,
                    success: function (data) {
                        if(data.auth && data.auth=="true"){
                            authController.extractToken(data.token);
                            send(savename, savetype, savedata, savetoken);
                        }
                        else
                        {
                            if (callbackSuccess)
                                callbackSuccess(data);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.dir(JSON.parse(xhr.responseText));
                    }
                })
            }
            send(savename, savetype, savedata, savetoken);
        }
    }
}
