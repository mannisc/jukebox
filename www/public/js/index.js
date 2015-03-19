

var preferences = {

    //serverURL: "http://localhost:3001/"
    //serverURL: "http://info.jukebox.selfhost.eu:3001/"

    serverURL: "http://h2406563.stratoserver.net:3001/",
    serviceServerURL: "http://h2406563.stratoserver.net:3005/"

}


$.support.cors = true;

lyricscallback = function (test) {
    alert(text)
}
lyricsvisible = false;


if (navigator.appName == "Microsoft Internet Explorer")
    window.attachEvent("onmessage", receiveMessage);
else
    window.addEventListener("message", receiveMessage, false);


function receiveMessage(e) {

    if (e.data == "back") {
        playbackController.playPrevSong();

    } else if (e.data == "forward") {
        playbackController.playNextSong();

    }

}

var urlParams;
var loadUrlParams = function () {
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) {
            return decodeURIComponent(s.replace(pl, " "));
        },
        query = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);

}

window.onbeforeunload = function (event) {

    if (typeof event == 'undefined') {
        event = window.event;
    }

    if (event && playlistController.playlists.length > 2 && !accountController.loggedIn) {
        var message = 'Without your own free Songbase account your unsaved playlists will be lost!';
        event.returnValue = message;
    }
    return message;
}

jqmAllowPopUpClosing = false;

var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete" && $scope && $scope.loaded) {
        clearInterval(readyStateCheckInterval);

        setTimeout(function () {
            jqmAllowPopUpClosing = true;
        }, 0)

    }
}, 100);


IScrollinitTimer = 0;

$(document).ready(function () {




    //FEEDBACK
    feedback.initFeedback();

    //Enable smooth scrolling after this time
    setTimeout(function () {
        IScrollinitTimer = Date.now()//CHANGED
    }, 0)

    //setTimeout(function(){ $.mobile.loading( "show"); },15000)
     /*setTimeout(function(){ $.mobile.loading( "show", {
     text: "Login",
     textVisible: true,
     textonly: false,
     html: ""
     }); },15000)*/
    // FastClick.attach(document.body);

    // $.mobile.loading("show");
    var initPage = function () {
        if ($scope.loaded) {

            $.mobile.popup.prototype.options.history = false;

            /*
             $(function() {
             $( document ).tooltip();
             });
             */

            //setTimeout(function () {$("#dmplayer").addClass("iframeVideo").appendTo("#backgroundVideo")},2000);
            loadUrlParams();
            facebookHandler.init();
            mediaController.init();
            authController.init();

            uiController.init();

            viewController.init();

            playlistController.init();
            accountController.init();
            videoController.init();


            if (infosController)
                infosController.init();

            setTimeout(function () {
                if ($(":focus").length == 0)
                    $("#searchinput").focus();
            }, 500);


            //setInterval(function(){googletag.pubads().refresh([slot1]);}, 30000);

            setTimeout(function () {
                if (urlParams.downloadApp && urlParams.downloadApp != "") {
                    $("#popupDownloadApp").popup('open');

                }
            }, 1000)

            setTimeout(function () {
                if (urlParams.playlistid && urlParams.playlistid != "") {
                    playlistController.loadSharedPlaylist(urlParams.playlistid);
                }
            }, 1000)





            //Show loaded page
            $scope.safeApply();
            $("#page").css("opacity", "1");


            //Prevent Search Functionality
            window.addEventListener("keydown",function (e) {
                if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70) || (e.ctrlKey && e.keyCode === 114)) {
                    e.preventDefault();
                }
            })


            var updatePage = function () {
                if ($("#playlistInner ul").length > 0) //Check if angular loaded
                    setTimeout(uiController.updateUI, 0);
                else
                    setTimeout(updatePage, 200);
            }
            setTimeout(updatePage, 500);

            // setTimeout(function() {
            //     $("img.lazy").lazyload()
            // },1000)
            uiController.ready();



            setTimeout(function () {

                if (urlParams.search && urlParams.search != "") {

                    $("#searchinput").val(urlParams.search);

                    $("#searchinput").trigger("input");


                    /*
                     function search(searchID) {
                     searchController.songs.startSearchDeferred(urlParams.search, function (list) {
                     searchController.completeSearch(list, null, searchController.searchCounter)
                     });
                     }

                     search(searchController.searchCounter);
                     searchController.searchCounter++;  */


                }
                if (urlParams.artist && urlParams.artist != "") {
                    if (urlParams.title && urlParams.title != "") {
                        var song = {
                            artist: {name: urlParams.artist},
                            name: urlParams.title,
                            id: "slsid" + helperFunctions.padZeros(1, 2)
                        }


                       var songInList = searchController.isSongInList(song,searchController.preloadedPopularSongs.track,searchController.maxResults);

                        var playSongFromURL = function () {
                            //Wait for List to be loaded to Remark Song
                            if (!songInList||viewController.listWasCompletelyLoadedFirstTime ) {

                                if (!playbackController.playingSong){
                                    playbackController.playSong(song, false, false, true);
                                }


                            } else
                                setTimeout(  playSongFromURL, 250);
                        }
                        playSongFromURL();


                    }
                }
            }, 1000);

            uiController.isTouchSupported();

        } else
            setTimeout(initPage, 50);
    }
    initPage();

    //http://localhost:3001/?play=alesso%20under%20control
});

showregisterpopup = false;

//JQ Erweiterungen


jQuery.fn.outerHTML = function (s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

jQuery.expr[':'].noparents = function (a, i, m) {

    return jQuery(a).parents(m[3]).length > 0;
};


if (!Object.keys) {
    Object.keys = function (obj) {
        var keys = [],
            k;
        for (k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}


//Log Snapshot
window.console.dirx = function (obj) {
    console.dir(JSON.parse(JSON.stringify(obj)));
}


//FEEDBACK
var feedback = function () {
};

feedback.initFeedback = function () {
    setTimeout(function () {
        $("#feedbackButton").show();
    }, 2000)

    $("#popupFeedback").popup({
        beforeposition: function (event, ui) {
            $('#popupFeedback textarea').val("")
        },
        afteropen: function (event, ui) {
            $('#popupFeedback textarea').focus();

        }
    });
}

feedback.sendFeedback = function () {

    if ($.trim($('#popupFeedback textarea').val()) != "") {
        var feedback = escape($('#popupFeedback textarea').val() + "\n\n" + "Browser: " + navigator.userAgent);
        $("#popupFeedback").popup("close");

        feedback = rsaController.rsa.encryptUnlimited(feedback);
        $.ajax({
            type: "POST",
            data: {feedback: feedback, auth: authController.ip_token},
            url: preferences.serverURL
        });
    }


}





