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

accountController.getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

accountController.setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}


accountController.init = function () {
    setTimeout(function () {
        $("#popupLogin input").on("input", function () {
            accountController.resetSignInData();
        })
        $("#popupRegister input").on("input", function () {
            accountController.resetRegisterData();
        })

        $('#popupLogin input').keyup(function (e) {
            if (e.keyCode == 13) {
                accountController.signIn();
            }
        });

        $('#popupLogin input').keyup(function (e) {
            if (e.keyCode == 13) {
                accountController.register();
            }
        });

    }, 500)

    $("#popupLogin").popup({
        beforeposition: function (event, ui) {
            accountController.resetSignInData();
        },
        afteropen: function (event, ui) {
            $('#signinusername').focus();
        },
        afterclose: function () {
            $("#signinpw").val("");
        }
    });
    $("#popupRegister").popup({
        beforeposition: function (event, ui) {

            accountController.resetRegisterData();

        },
        afteropen: function (event, ui) {

            $('#registerusername').focus();
        },
        afterclose: function () {
            $("#registerpw").val("");
            $("#registerpwc").val("");

        }
    });


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

                        if(authController.ensureAuthenticated(data, function(){ trylogin();} )){
                            if (data == "ok") {
                                accountController.loggedIn = true;
                                accountController.loginToken = Base64.decode(loginTokenBase64);
                                accountController.userName = Base64.decode(userNameBase64);
                                accountController.requestid = 1;
                                $scope.safeApply();
                                accountController.loadStoredData();
                            }
                        }
                    }
                })
            }
        }
        else {
            setTimeout(trylogin, 1000);
        }

    }
    setTimeout(trylogin, 1000);
    setTimeout(function () {
        $.mobile.loading("hide");
    }, 2000);
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


        var logout = function () {

            var token = rsaController.rsa.encrypt(accountController.loginToken);
            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?logout=" + token + "&auth=" + authController.ip_token,
                success: function (data) {
                    authController.ensureAuthenticated(data, function(){accountController.logout();} )

                }
            })
            accountController.setCookie("loginToken", Base64.encode(""), 0);
            accountController.setCookie("userName", Base64.encode(""), 0);
            playlistController.loadedPlaylistSongs = [];
            playlistController.playlists = [];


            $('#playlistselectverticalform option').prop('selected', false);
            $('#playlistselectverticalform').trigger('chosen:updated');
            setTimeout(function () {
                $('#playlistselectverticalform').trigger('chosen:close');
                $("#clearChoosenPlaylists").hide();
                uiController.updateUI();
            }, 0)


            accountController.loggedIn = false;
            $('#popupLogin').popup('close');
            $scope.safeApply();
            /*setTimeout(function(){
             btn.addClass("animated");
             },500)*/
            accountController.requestid = 1;
        }


        //Ask if should be cleared
        if (playlistController.unsavedSongsExists()) {
            $("#popupAccount").popup("close");

            uiController.popupConfirmLogout = {doIt: function () {
                logout()

            }}
            //$( "#popupConfirmLogout" ).popup( "option", "positionTo", "window" );
            $("#popupConfirmLogout").popup("option", "transition", "pop");
            setTimeout(function () {
                $("#popupConfirmLogout").popup("open");
            }, 500)
        } else
            logout()

    }
}

accountController.loadStoredData = function () {
    var playlistsReady = function (playlistdata) {
        console.dir("PLAYLISTS:");
        console.dir(playlistdata);
        if (playlistdata) {
            var playlists = [];
            /*
             playlists[0] = {
             name: "Youtube - playlist",
             gid: 1,
             tracks: new Array(),
             isPlaylist: true,
             id: 1
             }
             */
            if (playlistdata.items && playlistdata.items.length > 0) {
                console.dir("Copy received (stored) data to playlists-Array;!!!!!!!!!!!!!!!");
                //Copy received (stored) data to playlists-Array;


                var changeCurrentQueue =  (playlistController.currentQueue.tracks.length ==0);

                for (var j = 0; j < playlistdata.items.length; j++) {

                    //Delete Queue if already new queue exists
                    if (playlistdata.items[j].gid == 0 && !changeCurrentQueue) {
                        playlistdata.items.splice(j, 1);
                        j = j - 1;
                    } else {


                        playlists[j] = {
                            name: playlistdata.items[j].name,
                            gid: playlistdata.items[j].gid,
                            tracks: playlistdata.items[j].data,
                            isPlaylist: true,
                            id: playlistdata.items[j].gid
                        }
                        console.dir("playlists[" + j + "]: ");
                        console.dir(playlists[j]);
                        console.dir("-----------------");

                    }


                }

                if (playlists) {
                    //Remove duplicate Playlists
                    if (playlistController.playlists.length) {

                        for (var i = 0; i < playlistController.playlists.length; i++) {

                            //Delete Current Queue an load old one if no tracks in queue
                            if (playlistController.playlists[i].gid == 0 && changeCurrentQueue) {
                                playlistController.playlists.splice(i, 1);
                                i = i - 1;
                            }
                            else {
                                for (var j = 0; j < playlists.length; j++) {
                                    console.log(i + " - " + j + "     " + playlistController.playlists.length + " :  " + playlists[j].gid + " == " + playlistController.playlists[i].gid)
                                    if (playlists[j].gid == playlistController.playlists[i].gid) {
                                        playlistController.playlists.splice(i, 1);
                                        i = i - 1;
                                        break;
                                    }
                                    /*else if (playlists[j].name == playlistController.playlists[i].name) {
                                     playlistController.playlists[i].name = playlistController.playlists[i].name + " (2)";
                                     }  */

                                }

                            }


                        }




                    }


                    //Find new playlistController.globalId
                    playlistController.playlists = playlistController.playlists.concat(playlists);


                    //Save Current merged Playlists
                    if (playlistController.playlists.length) {

                        for (var i = 0; i < playlistController.playlists.length; i++) {

                            if(changeCurrentQueue&&playlistController.playlists[i].gid==0){
                                playlistController.currentQueue =  playlistController.playlists[i];
                                playlistController.playlists[i].isCurrentQueue = true;
                            }

                            accountController.savePlaylist(playlistController.playlists[i], i)
                        }

                    }




                    /*
                     var globalId = playlistController.playlists.length
                     for (var j = 0; j < playlistController.playlists.length; j++) {
                     if(playlistController.playlists[j].gid+1 > globalId){
                     globalId = playlistController.playlists[j].gid+1;
                     }
                     }
                     playlistController.globalIdPlaylist = globalId;
                     playlistController.globalId         = globalId;
                     */

                    console.dir("User playlists: ");
                    console.dir(playlistController.playlists);

                    $scope.safeApply();
                    $("#playlistview").listview('refresh');

                    if (!playlistController.unsavedSongsExists()) {

                        //Avoid flashing of special button
                        $("#playlistInner .songlist").addClass("avoidhiding");

                        uiController.showPlaylists();


                        setTimeout(function () {

                            playlistController.makePlayListSortable();
                            setTimeout(function () {
                                uiController.playListScroll.refresh();
                            }, 150)
                            setTimeout(function () {
                                uiController.playListScroll.refresh();
                            }, 1000)
                        }, 0)
                    }
                    setTimeout(function () {
                        $('#searchinput').focus();
                    }, 500)
                }
            }
        }
    }
    accountController.loadPlaylists(playlistsReady)
}


accountController.signIn = function () {
    accountController.resetSignInData();
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        $.mobile.loading("show");
        var send = function (name,pw,nameEncrypted, pwEncrypted) {
            var email = "";
            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?login=" + nameEncrypted + "&email=" + email + "&pw=" + pwEncrypted + "&auth=" + authController.ip_token,
                success: function (data) {

                    if(authController.ensureAuthenticated(data, function(){send(name,pw,nameEncrypted, pwEncrypted);} )){

                        if (data != "") {
                            var md5pw = MD5($.trim(pw));
                            accountController.loggedIn = true;
                            accountController.loginToken = MD5(data + md5pw);
                            accountController.userName = name;
                            accountController.setCookie("loginToken", Base64.encode(accountController.loginToken), 1);
                            accountController.setCookie("userName", Base64.encode(accountController.userName), 1);

                            var btn = $('#header .ui-btn.animated').removeClass("animated");
                            $('#popupLogin').popup('close');
                            $scope.safeApply();
                            setTimeout(function () {
                                btn.addClass("animated");
                            }, 500)
                            accountController.requestid = 1;

                            accountController.loadStoredData();
                            $("#signinpw").val("");
                            $("#signinusername").val("");

                            $("#popupLogin").popup("close")


                        }
                        else {
                            $("#signinpw").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");
                            $("#signinusername").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");

                        }
                    }
                },
                error: function () {
                    uiController.toast("Sorry, it is not possible to login at the moment.", 1500);

                },
                complete: function () {
                    setTimeout(function () {
                        $.mobile.loading("hide");
                    }, 800);
                }
            })
        }
        var username = $("#signinusername").val();
        var pw = $("#signinpw").val();
        if (accountController.validateSignInData()) {
            send(username,pw,rsaController.rsa.encrypt(username), rsaController.rsa.encrypt(pw));
        }

    }
}

/**
 *
 * @param name
 * @param email
 * @param userid
 * @param extacc 1:facebook
 * @param access_token
 */
accountController.socialSignIn = function (username, email,userid,extacc, access_token) {

    $.mobile.loading("show");

    var send = function (name,pw,nameEncrypted, pwEncrypted) {

        $.ajax({
            timeout: 30000,
            url: preferences.serverURL + "?login=" + nameEncrypted + "&email=" + email + "&pw=" + pwEncrypted + "&userid="+userid+"&auth=" + authController.ip_token+"&extacc="+extacc,
            success: function (data) {
                if(authController.ensureAuthenticated(data, function(){send(name,pw,nameEncrypted, pwEncrypted);} )){

                        if (data != "") {
                        var md5pw = MD5($.trim(pw));

                        accountController.loggedIn = true;
                        accountController.loginToken = MD5(data + md5pw);
                        accountController.userName = name;
                        accountController.setCookie("loginToken", Base64.encode(accountController.loginToken), 1);
                        accountController.setCookie("userName", Base64.encode(accountController.userName), 1);

                        var btn = $('#header .ui-btn.animated').removeClass("animated");
                        $('#popupLogin').popup('close');
                        $scope.safeApply();
                        setTimeout(function () {
                            btn.addClass("animated");
                        }, 500)
                        accountController.requestid = 1;

                        accountController.loadStoredData();
                        $("#signinpw").val("");
                        $("#signinusername").val("");

                        $("#popupLogin").popup("close")


                    }
                    else {
                        $("#signinpw").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");
                        $("#signinusername").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");

                    }
                }
            },
            error: function () {
                uiController.toast("Sorry, it is not possible to login at the moment.", 1500);

            },
            complete: function () {
                setTimeout(function () {
                    $.mobile.loading("hide");
                }, 800);
            }
        })
    }
    send(username,access_token,rsaController.rsa.encrypt(username), rsaController.rsa.encrypt(access_token));

}











accountController.resetSignInData = function () {
    $("#signinusername").css("background-color", "").css("color", "");
    $("#signinpw").css("background-color", "").css("color", "");

}

accountController.validateSignInData = function () {
    var failed = false;
    var username = $("#signinusername").val();
    var pw = $("#signinpw").val();

    if (pw.length < 1) {
        failed = true;
        $("#signinpw").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");

    }

    if (username.length < 1) {
        failed = true;
        $("#signinusername").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");
    }

    return !failed;
}

accountController.debugData = function (data) {
    console.dir("DATA:");
    console.dir(data);
}


accountController.register = function () {
    accountController.resetRegisterData();
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        var send = function (name,pw,nameEncrypted, emailEncrypted, pwEncrypted) {

            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?register=" + nameEncrypted + "&email=" + emailEncrypted + "&pw=" + pwEncrypted + "&auth=" + authController.ip_token,
                success: function (data) {
                    if(authController.ensureAuthenticated(data, function(){send(name,pw,nameEncrypted, emailEncrypted, pwEncrypted);} )){

                        if (data != "") {
                            accountController.loggedIn = true;
                            var md5pw = MD5($.trim(pw));
                            accountController.loginToken = MD5(data + md5pw);
                            accountController.userName = name;
                            accountController.setCookie("loginToken", Base64.encode(accountController.loginToken), 1);
                            accountController.setCookie("userName", Base64.encode(accountController.userName), 1);
                            var btn = $('#header .ui-btn.animated').removeClass("animated");
                            $('#registerLogin').popup('close');
                            $scope.safeApply();
                            setTimeout(function () {
                                btn.addClass("animated");
                            }, 500)
                            accountController.requestid = 1;

                            $("#registerpw").val("");
                            $("#registerpwc").val("");
                            $("#registeruser").val("");
                            $("#registerusername").val("");
                            $("#popupRegister").popup("close")
                        }
                        else {
                            $("#registerpw").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");
                            $("#registerpwc").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");
                            $("#registeruser").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");
                            $("#registerusername").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");

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

        if (accountController.validateRegisterData()) {;
            send(username,pw,rsaController.rsa.encrypt(username), rsaController.rsa.encrypt(email), rsaController.rsa.encrypt(pw));
        }

    }


}


accountController.validateEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

accountController.resetRegisterData = function () {
    $("#registerpw").css("background-color", "").css("color", "");
    $("#registerpwc").css("background-color", "").css("color", "");
    $("#registeruser").css("background-color", "").css("color", "");
    $("#registerusername").css("background-color", "").css("color", "");
}
accountController.validateRegisterData = function () {
    var failed = false;
    var username = $("#registerusername").val();
    var email = $("#registeruser").val();
    var pw = $("#registerpw").val();
    var pwc = $("#registerpwc").val();

    if (pw.length < 1) {
        failed = true;
        $("#registerpw").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");
        $("#registerpwc").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");

    }

    if (pw != pwc) {
        failed = true;
        $("#registerpwc").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");
    }


    if (!accountController.validateEmail(email) || email.length <= 5) {
        failed = true;
        $("#registeruser").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");
    }

    if (username.length < 1) {
        failed = true;
        $("#registerusername").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");
    }

    return !failed;
}


accountController.savePlaylist = function (playlist, pos) {

    if (playlist) {

        var gid = playlist.gid,
            name = playlist.name,
            playlistdata = JSON.stringify(playlist.tracks)

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
                        data: {auth: authController.ip_token, storage: savetoken, gid: gid, pos: pos, n: nonce, type: "playlist", name: savename, data: savedata},
                        timeout: 30000,
                        url: preferences.serverURL,// + "?storage=" +savetoken+"&gid="+gid+"&pos="+pos+"&n="+nonce+"&type=playlist&name="+savename+"&data=savedata",
                        success: function (data) {
                            authController.ensureAuthenticated(data, function(){send(savename, savedata, savetoken);} )
                        }

                    })
                }
                send(savename, savedata, savetoken);
            }
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
                    url: preferences.serverURL + "?getdata=" + savetoken + "&n=" + nonce + "&type=playlist&name=" + savename + "&auth=" + authController.ip_token,
                    success: function (data) {
                        if(authController.ensureAuthenticated(data, function(){send(savename, savetoken);} ) ){
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
                    url: preferences.serverURL + "?getdatalist=" + savetoken + "&n=" + nonce + "&type=playlist&auth=" + authController.ip_token,
                    success: function (data) {
                        if(authController.ensureAuthenticated(data, function(){send(savetoken)} ) ){
                            if (callbackSuccess)
                                callbackSuccess(data);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {

                        alert("!!!!!!!!")
                        alert(xhr.status);
                        alert(thrownError);
                        console.log("------------------------")
                        console.dir(ajaxOptions)
                        console.dir(thrownError)
                        console.dir(xhr)

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
                    data: {auth: authController.ip_token, storage: savetoken, gid: gid, pos: pos, n: nonce, type: savetype, name: savename, data: savedata},
                    timeout: 30000,

                    url: preferences.serverURL, // "?storage=" +savetoken+"&n="+nonce+"&type="+savetype+"&name="+savename+"&data="+savedata,
                    success: function (data) {
                        authController.ensureAuthenticated(data, function(){ send(savename, savetype, savedata, savetoken); } )
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
                    url: preferences.serverURL + "?getdata=" + savetoken + "&n=" + nonce + "&type=" + savetype + "&name=" + savename + "&auth=" + authController.ip_token,
                    success: function (data) {

                       if(authController.ensureAuthenticated(data, function(){ send(savename, savetype, savedata, savetoken); } )) {
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
                    url: preferences.serverURL + "?getdatalist=" + savetoken + "&n=" + nonce + "&type=" + savetype + "&auth=" + authController.ip_token,
                    success: function (data) {

                        if(authController.ensureAuthenticated(data, function(){send(savename, savetype, savedata, savetoken); } )) {

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


