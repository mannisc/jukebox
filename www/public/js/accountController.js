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
    setTimeout(function(){
        btn.addClass("animated");
    },500)
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



accountController.savePlaylist = function(name,playlistdata){
    if(accountController.loggedIn){
        var savename = encodeURIComponent(name);
        var savedata = encodeURIComponent(playlistdata);
        var savetoken =  rsaController.rsa.encrypt(accountController.loginToken);
        var send = function (savename, savedata, savetoken) {
            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?storage=" +savetoken+"&type=playlist&name="+savename+"&data="+savedata,
                success: function (returndata) {
                }
            })
        }
        send(savename, savedata, savetoken);
    }
}

accountController.loadPlaylist = function(name,callbackSuccess){
    if(accountController.loggedIn){
        var savename = encodeURIComponent(name);
        var savetoken =  rsaController.rsa.encrypt(accountController.loginToken);
        var send = function (savename, savetoken) {
            name = encodeURIComponent(name);
            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?getdata=" +savetoken+"&type=playlist&name="+savename,
                success: function (playlistdata) {
                    if (callbackSuccess)
                        callbackSuccess(playlistdata);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.dir(xhr.responseText);
                }
            })
        }
        send(savename, savetoken);
    }
}

accountController.loadPlaylists = function(callbackSuccess){
    if(accountController.loggedIn){
        var savetoken =  rsaController.rsa.encrypt(accountController.loginToken);
        var send = function (savetoken) {
            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?getdatalist=" +savetoken+"&type=playlist",
                success: function (playlistdataitems) {
                    if (callbackSuccess)
                        callbackSuccess(playlistdataitems);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.dir(xhr.responseText);
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
        var savetoken =  rsaController.rsa.encrypt(accountController.loginToken);
        var send = function (savename,savetype ,savedata, savetoken) {
            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?storage=" +savetoken+"&type="+savetype+"&name="+savename+"&data="+savedata,
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
        var savetoken =  rsaController.rsa.encrypt(accountController.loginToken);
        var send = function (savename,savetype ,savedata, savetoken) {
            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?getdata=" +savetoken+"&type="+savetype+"&name="+savename,
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
        var savetoken =  rsaController.rsa.encrypt(accountController.loginToken);
        var send = function (savename,savetype ,savedata, savetoken) {
            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?getdatalist=" +savetoken+"&type="+savetype,
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
