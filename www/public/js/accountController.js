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


    setTimeout(accountController.singInAuto, 1000);


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
                    if (authController.ensureAuthenticated(data, function () {
                        accountController.logout();
                    })) {

                        accountController.loggedIn = false;


                        playlistController.playlists = [playlistController.currentQueue];

                        uiController.showPlaylists();
                        $scope.safeApply();

                        $('#popupLogin').popup('close');

                        /*setTimeout(function(){
                         btn.addClass("animated");
                         },500)*/
                        accountController.requestid = 1;

                        console.log("FB?????" + facebookHandler.loggedIn)
                        if (facebookHandler.loggedIn) {
                            facebookHandler.logout();
                        }
                    }

                },
                complete: function () {

                    accountController.setCookie("fbLogin", Base64.encode(""), 0);

                    accountController.setCookie("loginToken", Base64.encode(""), 0);
                    accountController.setCookie("userName", Base64.encode(""), 0);

                }
            })

        }


        logout()

    }
}

/**
 * Load Stored Data of user
 */
accountController.loadStoredData = function () {
    $.mobile.loading("show");

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

                console.log("!!!!!!!!!!!1")
                console.log(JSON.stringify( playlistController.playlists))

                var changeCurrentQueue = (playlistController.currentQueue.tracks.length == 0);
                var currentQueueSaved = false;
                for (var j = 0; j < playlistdata.items.length; j++) {

                    //Current Queue was saved
                    if (playlistdata.items[j].gid == 0){
                        currentQueueSaved = true;
                    }
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

                if(!currentQueueSaved)
                    changeCurrentQueue = false;

                if (playlists) {


                    //CORRUPTED PLAYLISTS HANDLING
                    //Only one current playlist
                    var tmpCounter = 0;
                    for (var j = 0; j < playlists.length; j++) {
                        if (playlists[j].gid == 0) {
                            tmpCounter ++;
                            if(tmpCounter>1) {
                                playlists.splice(j, 1);
                                j--;
                            }

                        }
                    }



                    //Remove duplicate Playlists
                    if (playlistController.playlists.length) {
                        var changed = false;
                        for (var i = 0; i < playlistController.playlists.length; i++) {

                            //Delete Current Queue an load old one if no tracks in queue
                            if (playlistController.playlists[i].gid == 0 && changeCurrentQueue) {
                                playlistController.playlists.splice(i, 1);
                                i = i - 1;
                                changed = true;
                            }
                            else {
                                for (var j = 0; j < playlists.length; j++) {
                                    console.log(i + " - " + j + "     " + playlistController.playlists.length + " :  " + playlists[j].gid + " == " + playlistController.playlists[i].gid)
                                    if (playlists[j].gid == playlistController.playlists[i].gid) {
                                        playlistController.playlists.splice(i, 1);
                                        i = i - 1;
                                        changed = true;

                                        break;
                                    }
                                    else if (playlists[j].name == playlistController.playlists[i].name) {

                                        var countSame = 1;
                                        var oldName = playlistController.playlists[i].name;
                                        do {
                                            var foundSame = false;
                                            playlistController.playlists[i].name = oldName + " #" + (countSame + 1);

                                            for (var k = 0; k < playlists.length; k++) {
                                                if (playlists[k].name == playlistController.playlists[i].name) {
                                                    foundSame = true;
                                                    break;
                                                }
                                            }

                                            countSame++;
                                        } while (foundSame)
                                        changed = true;


                                    }

                                }

                            }


                        }


                    }
                    console.log("!!!!!!!!!!!")
                    console.log(JSON.stringify( playlistController.playlists))
                    //Find new playlistController.globalId
                    playlistController.playlists = playlistController.playlists.concat(playlists);
                   console.log("......")
                    console.log(JSON.stringify( playlistController.playlists))

                    //Save Current merged Playlists
                    if (changed&&playlistController.playlists.length) {

                        for (var i = 0; i < playlistController.playlists.length; i++) {

                            if (changeCurrentQueue && playlistController.playlists[i].gid == 0) {
                                playlistController.currentQueue = playlistController.playlists[i];
                                playlistController.playlists[i].isCurrentQueue = true;
                            }
                            playlistController.playlistChanged(playlistController.playlists[i], i);
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

                    setTimeout(function () {
                        if($(":focus").length==0)
                        $('#searchinput').focus();
                    }, 500)
                }

                setTimeout(function () {
                    $.mobile.loading("hide");
                },1000);


            } else
              $.mobile.loading("hide");
        }else
          $.mobile.loading("hide");
    }
    accountController.loadPlaylists(playlistsReady)
}


/**
 * Automated Sign in at startup
 */

accountController.singInAuto = function () {

    if (authController.ip_token != "auth" && authController.ip_token != "") {

        var fbLogin = accountController.getCookie("fbLogin");

        var socialAutoLogin = (fbLogin && Base64.decode(fbLogin) == "true");

        if (!socialAutoLogin) {

            var loginTokenBase64 = accountController.getCookie("loginToken");
            var userNameBase64 = accountController.getCookie("userName");
            if (loginTokenBase64 != "" && userNameBase64 != "") {

                var token = rsaController.rsa.encrypt(Base64.decode(loginTokenBase64));
                $.ajax({
                    timeout: 30000,
                    url: preferences.serverURL + "?loginToken=" + token + "&auth=" + authController.ip_token,
                    success: function (data) {


                        $.mobile.loading("hide");
                        if (authController.ensureAuthenticated(data, function () {
                            accountController.singInAuto();
                        })) {
                            if (data == "ok") {
                                $.mobile.loading("show");
                                accountController.loggedIn = true;
                                accountController.loginToken = Base64.decode(loginTokenBase64);
                                accountController.userName = Base64.decode(userNameBase64);
                                accountController.requestid = 1;


                              setTimeout(function () {
                                    $("#popupLogin").popup("close");
                                    $("#popupRegister").popup("close");
                                    $(".ui-popup-screen.in").click();





                                    setTimeout(function () {
                                        $(".ui-popup-screen.in").click();
                                        alert("TODO AUTOLOGIn POPUP HIDE")
                                    },500);

                                },500);

                                accountController.loadStoredData();
                            }else{
                                accountController.setCookie("loginToken", Base64.encode(accountController.loginToken), 1);
                                accountController.setCookie("userName", Base64.encode(accountController.userName), 1);
                            }
                        }
                    },
                    error:function(){
                        $.mobile.loading("hide");
                    }
                })
            }
        }
    }
    else {
        setTimeout(accountController.singInAuto, 1000);
    }

}


/**
 *
 * @param name
 * @param pw
 * @param nameEncrypted
 * @param emailEncrypted
 * @param useridEncrypted
 * @param pwEncrypted
 */
accountController.singInBase = function (name, pw, nameEncrypted, emailEncrypted, pwEncrypted, useridEncrypted, externalAccountIdentifier) {

    //alert(preferences.serverURL + "?login=" + nameEncrypted + "&email=" + emailEncrypted + "&pw=" + pwEncrypted + "&userid=" + useridEncrypted + "&auth=" + authController.ip_token + "&extacc=" + externalAccountIdentifier)

    $.ajax({
        timeout: 30000,
        url: preferences.serverURL + "?login=" + nameEncrypted + "&email=" + emailEncrypted + "&pw=" + pwEncrypted + "&userid=" + useridEncrypted + "&auth=" + authController.ip_token + "&extacc=" + externalAccountIdentifier,
        success: function (data) {
            if (authController.ensureAuthenticated(data, function () {
                accountController.singInBase(name, pw, nameEncrypted, emailEncrypted, pwEncrypted, useridEncrypted, externalAccountIdentifier);
            })) {
                if (data != "") {
                    if (externalAccountIdentifier == 1) {
                        accountController.setCookie("fbLogin", Base64.encode("true"), 1);
                        facebookHandler.loggedIn = true;

                    }

                    console.log("LOGIN!!!!! " + externalAccountIdentifier + "   " + accountController.loggedIn)

                    if (pw != "" && pw.length < 100) {
                        var md5pw = MD5($.trim(pw));
                    }
                    else {
                        var md5pw = "";
                    }

                    if (!accountController.loggedIn) {
                        accountController.loggedIn = true;
                        accountController.loginToken = MD5(data + md5pw);
                        accountController.userName = name;
                        accountController.setCookie("loginToken", Base64.encode(accountController.loginToken), 1);
                        accountController.setCookie("userName", Base64.encode(accountController.userName), 1);

                        accountController.loadStoredData();
                    }



                    accountController.requestid = 1;




                    $("#popupLogin").popup("close");
                    $("#popupRegister").popup("close");
                    $(".ui-popup-screen.in").click();


                    setTimeout(function () {
                        $("#signinpw").val("");
                        $("#signinusername").val("");
                        var btn = $('#header .ui-btn.animated').removeClass("animated");

                        setTimeout(function () {
                            btn.addClass("animated");
                        }, 500)
                    },500)

                }
                else {
                    $("#signinpw").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");
                    $("#signinusername").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");
                    setTimeout(function () {
                        $.mobile.loading("hide");
                    }, 800);
                }
            }
        },
        error: function () {
            uiController.toast("Sorry, it is not possible to login at the moment.", 1500);
            if (facebookHandler.loggedIn) {
                facebookHandler.logout();
            }
            setTimeout(function () {
                $.mobile.loading("hide");
            }, 800);
        }

    })

}


accountController.signIn = function () {
    accountController.resetSignInData();
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        $.mobile.loading("show");
        var username = $("#signinusername").val();
        if (accountController.validateEmail(username)) {
            var email = username;
            username = "";
        } else
         email ="";
        var pw = $("#signinpw").val();

        if (accountController.validateSignInData())
            accountController.singInBase(username, pw, rsaController.rsa.encrypt(username), rsaController.rsa.encrypt(email), rsaController.rsa.encrypt(pw), null, 0);
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
accountController.socialSignIn = function (username, email, userid, externalAccountIdentifier, access_token) {
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        $.mobile.loading("show");
        accountController.singInBase(username, access_token, rsaController.rsa.encrypt(username), rsaController.rsa.encrypt(email), rsaController.rsa.encryptUnlimited(access_token), rsaController.rsa.encrypt(userid), externalAccountIdentifier);
    } else {
        $.mobile.loading("hide");

        if (externalAccountIdentifier == 1) {
            facebookHandler.logout();
        }

    }

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

        var send = function (name, pw, nameEncrypted, emailEncrypted, pwEncrypted) {

            $.ajax({
                timeout: 30000,
                url: preferences.serverURL + "?register=" + nameEncrypted + "&email=" + emailEncrypted + "&pw=" + pwEncrypted + "&auth=" + authController.ip_token,
                success: function (data) {
                    if (authController.ensureAuthenticated(data, function () {
                        send(name, pw, nameEncrypted, emailEncrypted, pwEncrypted);
                    })) {

                        if (data != "") {
                            accountController.loggedIn = true;
                            var md5pw = MD5($.trim(pw));
                            accountController.loginToken = MD5(data + md5pw);
                            accountController.userName = name;
                            accountController.setCookie("loginToken", Base64.encode(accountController.loginToken), 1);
                            accountController.setCookie("userName", Base64.encode(accountController.userName), 1);




                            for (var i = 0; i < playlistController.playlists.length; i++) {
                                playlistController.playlistChanged(playlistController.playlists[i], i);
                            }

                            accountController.requestid = 1;


                            $("#popupRegister").popup("close");
                            $(".ui-popup-screen.in").click();

                            setTimeout(function () {
                                $("#registerpw").val("");
                                $("#registerpwc").val("");
                                $("#registeruser").val("");
                                $("#registerusername").val("");
                                var btn = $('#header .ui-btn.animated').removeClass("animated");


                                setTimeout(function () {
                                    btn.addClass("animated");
                                }, 500)
                            }, 500)




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
                },complete: function(){
                    $.mobile.loading("hide");
                }

            })
        }

        var username = $("#registerusername").val();
        var email = $("#registeruser").val();
        var pw = $("#registerpw").val();

        if (accountController.validateRegisterData()) {
            $.mobile.loading("show");

            send(username, pw, rsaController.rsa.encrypt(username), rsaController.rsa.encrypt(email), rsaController.rsa.encrypt(pw));
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

    if (pw.length < 1 && pw.length > 64) {
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


accountController.saveProfile = function () {

    alert("TODO")

    //VALIDATE
    $("#popupEditAccount").popup("close");
}



accountController.savePlaylist = function (playlist, pos) {
    if (accountController.loggedIn) {
        if (playlist) {
            var gid = playlist.gid,
                name = playlist.name,
                playlistdata = JSON.stringify(playlist.tracks)

            if (authController.ip_token != "auth" && authController.ip_token != "") {



                var savename = escape(name);
                var savedata = escape(playlistdata);
                accountController.requestid = accountController.requestid + 1;
                var nonce = accountController.requestid;
                var savetoken = rsaController.rsa.encrypt(accountController.loginToken + nonce);



                var send = function (savename, savedata, savetoken) {
                    var postData = {auth: authController.ip_token, storage: savetoken, gid: gid, pos: pos, n: nonce, type: "playlist", name: savename, data: savedata};
                    if(pos!=undefined&&pos!=null&&pos!=false&&pos>-1)
                        postData.pos = pos;

                    $.ajax({
                        type: "POST",
                        data:postData,
                        timeout: 30000,
                        url: preferences.serverURL,// + "?storage=" +savetoken+"&gid="+gid+"&pos="+pos+"&n="+nonce+"&type=playlist&name="+savename+"&data=savedata",
                        success: function (data) {
                            authController.ensureAuthenticated(data, function () {
                                send(savename, savedata, savetoken);
                            })
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
                        if (authController.ensureAuthenticated(data, function () {
                            send(savename, savetoken);
                        })) {
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

/**
 * Load Playlists
 * @param callbackSuccess
 */
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
                        if (authController.ensureAuthenticated(data, function () {
                            send(savetoken)
                        })) {
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
                        console.dir("xhr.responseText");
                        console.dir(xhr.responseText);


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
                        authController.ensureAuthenticated(data, function () {
                            send(savename, savetype, savedata, savetoken);
                        })
                    }
                })
            }
            send(savename, savetype, savedata, savetoken);
        }
    }
}

//TODO USED??????
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

                        if (authController.ensureAuthenticated(data, function () {
                            send(savename, savetype, savedata, savetoken);
                        })) {
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

//TODO USED??????

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

                        if (authController.ensureAuthenticated(data, function () {
                            send(savename, savetype, savedata, savetoken);
                        })) {

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


