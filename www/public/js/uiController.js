/**
 * uiController.js
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 01.03.14 - 11:08
 * @copyright jezz
 */


var uiController = function () {

};


uiController.responsiveWidthSmallest = 670;

uiController.responsiveWidthSmall = 850;


uiController.responsiveWidthSmaller = 1100;


uiController.totalTimeWidth = 0;

uiController.gridLayout = false;


/**
 * Init Controller
 *
 */


//uiController.initMediaPlayer = function () {
//  $("#videoplayer").css("opacity", "0");
//  $("#videoplayer").css("pointer-events", "none");

/*

 */
/*

 Hammer($("#videoplayerInner").get(0)).on("swipeup", function (event) {
 uiController.swipeTimer = Date.now();
 uiController.noVideoClickTimer = Date.now();

 if (!uiController.isMaxVideoSizeFaktor(uiController.sizeVideo)) {
 uiController.sizeVideo = uiController.sizeVideo * 1.5;
 uiController.styleVideo();

 }
 });
 Hammer($("#videoplayerInner").get(0)).on("swipedown", function (event) {

 uiController.swipeTimer = Date.now();
 uiController.noVideoClickTimer = Date.now();

 if (uiController.sizeVideo > 0.5) {
 uiController.sizeVideo = uiController.sizeVideo / 1.5;
 uiController.styleVideo();

 } else {
 $("#videoplayer").css("opacity", "0");
 $("#videoplayer").css("pointer-events", "none");


 }
 });

 Hammer($("#videoplayerInner").get(0)).on("swiperight", function (event) {
 uiController.swipeTimer = Date.now();
 uiController.noVideoClickTimer = Date.now();

 if (uiController.translateVideo <= uiController.windowWidth / 2) {
 uiController.translateVideo = uiController.translateVideo + uiController.windowWidth / 8;
 uiController.styleVideo();
 }

 });
 Hammer($("#videoplayerInner").get(0)).on("swipeleft", function (event) {
 uiController.swipeTimer = Date.now();
 uiController.noVideoClickTimer = Date.now();

 if (uiController.translateVideo >= -uiController.windowWidth / 2) {

 uiController.translateVideo = uiController.translateVideo - uiController.windowWidth / 8;
 uiController.styleVideo();
 }
 });

 */




// $("#videoplayer").css("text-align", "center")
/*
 uiController.sizeVideoRelative = 1;
 uiController.sizeVideo = 1.2;
 uiController.translateVideo = 0;

 uiController.styleVideo();


 setTimeout(function () {
 //$("#videoplayer").addClass("animate");
 uiController.sizeVideo = 1;
 uiController.translateVideo = 0;
 uiController.styleVideo();

 }, 500)*/
//}

uiController.init = function () {
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        $("#titleHeader").show();
        $(" #iconHeader").css("opacity", "1");

    } else {
        setTimeout(function () {

            $("#titleHeader").addClass("fadeincomplete");
            $("#titleHeader").show();
            $("#iconHeader").addClass("bounce");

        }, 0);
    }

    // Add BETA Status to Title
    $("#titleHeader").append('<span style="position: absolute; top: 10px;left: 170px;color: #a00; font-weight: 100; font-size: 10px;">BETA</span>');

    //Fade in fb like

    setTimeout(function () {
        $("#iconHeader").attr("src", "public/img/logo.gif");
    }, 6000)


    //Additional Control Buttons
    uiController.countCustomButtons = $(".videoControlElements-custom-button:visible").length;

    if (playlistController.loadedPlaylistSongs.length == 0) {
        $("#saveplaylistbtn img").attr("src", "public/img/save.png");
    } else
        $("#saveplaylistbtn img").attr("src", "public/img/plus.png");


    $("body").dblclick(function (event) {
        playlistController.deselectSongs(event);
        if (playlistController.sortPlaylist)
            playlistController.toggleSortablePlaylist(true, true);

    })


    $('#saveplaylistinpt').keyup(function (evt) {
        if (evt.keyCode == 13) {
            $("#saveokayplaylistbtn").click();
            return false;
        }
    });

    $(".ui-input-clear").addClass("ui-btn ui-btn-b ui-shadow ui-corner-all ui-mini");


    uiController.updateDisplay();

    setTimeout(function () {
        $("iframe").get(0).contentDocument.close();
    }, 2000)

    var style = $('<style id="inputclearhide">' +
        '.ui-input-clear {' +
        ' display:none!important;' +
        '}' +
        '</style>');
    $('html > head').append(style);

    $('video').bind('contextmenu', function (e) {
        // return false;
    });

    // uiController.initMediaPlayer();

    $("#saveplaylistinpt").on("input", function () {
        if ($("#saveplaylistinpt").val()) {
            $("#saveokayplaylistbtn").removeAttr("disabled").css("opacity", "1");

        } else {

            $("#saveokayplaylistbtn").attr("disabled", "disabled").css("opacity", "0.5");

        }

    })


    $("#controlbar .ui-input-clear").click(function () {
        switch (searchController.buttonActive) {


            case 1:
                searchController.removeFilterSongs();
                break;
            case 2:
                searchController.removeFilterSongs();
                break;
            default:
                searchController.emptySearchList();
                break;
        }
    })


    uiController.playedFirst = false;


    setTimeout(function () {
        $("#playlistInner").show();
    }, 500);

    // / Use Fastclicks
    //FastClick.attach(document.body);


    //On Window Resize
    $(window).resize(function () {

        $(".ui-popup:visible").popup("close")


        if ($('.ui-panel-open').length != 0) {
            $('#rightpanel').panel('close');
        }
        if (playlistController.sortPlaylist)
            playlistController.toggleSortablePlaylist();


        //Resize Songlists/ reset indicator
        setTimeout(function () {
            uiController.updateUI();
            uiController.searchListScroll.refresh();
            uiController.playListScroll.refresh();
            setTimeout(function () {
                uiController.searchListScroll.refresh();
                uiController.playListScroll.refresh();
                playbackController.remarkSong();
                setTimeout(function () {
                    uiController.searchListScroll.refresh();
                    uiController.playListScroll.refresh();
                    playbackController.remarkSong();
                    setTimeout(function () {
                        playbackController.remarkSong();
                        setTimeout(function () {
                            playbackController.remarkSong();
                            setTimeout(function () {
                                uiController.searchListScroll.refresh();
                                uiController.playListScroll.refresh();
                                playbackController.remarkSong();
                            }, 2000)
                        }, 100)
                    }, 100)
                }, 100)
            }, 100)

        }, 1000)


    });


    playlistController.makePlayListScrollable();

    //Animate Sidde Panel Open Icon
    $("#rightpanel").on("panelbeforeclose", function (event, ui) {
        if (playlistController.sortPlaylist)
            playlistController.toggleSortablePlaylist();
        uiController.sidePanelOpen = false;
        uiController.updateUI();


        uiController.searchListScroll.enable();
        uiController.searchListScroll.refresh();

        var transform = "translate3d(0px,0px,0px)";
        $("#openSidePanelBarIcon").css({"transition": "0.15s linear", "-transform": transform, "-ms-transform": transform, "-webkit-transform": transform});
        setTimeout(function () {
            uiController.updateUI();
        }, 500)
    });


    $("#rightpanel").on("panelbeforeopen", function (event, ui) {
        uiController.sidePanelOpen = true;
        uiController.searchListScroll.disable();

        var transform = "translate3d(10px,0px,0px)";
        $("#openSidePanelBarIcon").css({"transition": "0.15s linear", "-transform": transform, "-ms-transform": transform, "-webkit-transform": transform});
        setTimeout(function () {
            uiController.updateUI();
        }, 500)
    });

    /*
     $( ".sortable" ).sortable( "disable" );



     */

    $("#playlistselectverticalform").chosen({disable_search_threshold: 2})

    $(".chosen-choices").addClass("ui-input ui-body-a ui-corner-all ui-shadow-inset");
    $(".chosen-choices").css("min-height", "2.2em");


    $(".chosen-choices input").css("margin-top", "5px")
    $(".chosen-container").css("margin-top", "-3px")


    $("#playlistselectverticalform").on('change', function (evt, params) {
        console.log(".....................")
        var playlistRemoved = function (playlistgid) {
            for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
                if (playlistController.loadedPlaylistSongs[i].playlistgid == playlistgid) {
                    playlistController.loadedPlaylistSongs.splice(i, 1);
                    i--;
                }
            }

            if (playlistController.loadedPlaylistSongs.length == 0 && $('#playlistselectvertical .search-choice').length == 0) {
                playlistController.loadedPlaylistSongs = playlistController.playlists;

                $("#playlistInner .iScrollPlayIndicator").hide();
                $("#searchlist .iScrollPlayIndicator").hide();

                $("#saveplaylistbtn img").attr("src", "public/img/plus.png");

            } else
                $("#clearChoosenPlaylists").show();


            $("#playlistview").hide();
            $scope.safeApply();
            setTimeout(function () {
                $("#playlistview").listview('refresh');
                $("#playlistview").show();
                playlistController.makePlayListSortable();
                setTimeout(function () {
                    uiController.playListScroll.refresh();
                }, 150)
            }, 0)
        }

        //on trigger, all playlists still there, after ms gone if return key pressd
        var playlistsOldLoaded = [];

        console.log("------------------------------")

        $('#playlistselectvertical .search-choice').each(function () {
            playlistsOldLoaded.push($(this).text());
            if ($(this).data('loaded') != "true") {
                var playlist = null;
                var name = $(this).text();
                for (var i = 0; i < playlistController.playlists.length; i++) {
                    if (playlistController.playlists[i].name == name)
                        playlist = playlistController.playlists[i];
                }

                if (playlist != null) {
                    $("#saveplaylistbtn img").attr("src", "public/img/save.png");
                    playlistController.loadPlaylist(playlist);

                }

            }

        })

        //Check if playlist was deleted, is gone after 50 ms in dom
        setTimeout(function () {

            for (var i = 0; i < playlistsOldLoaded.length; i++) {
                var name = playlistsOldLoaded[i];
                var selections = $('#playlistselectvertical .search-choice');
                var found = false;
                for (var j = 0; j < selections.length; j++) {
                    if ($(selections.get(j)).text() == name) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    console.log("REMOVED")
                    var playlistgid = null;
                    for (var i = 0; i < playlistController.playlists.length; i++) {
                        if (playlistController.playlists[i].name == name) {
                            playlistgid = playlistController.playlists[i].gid
                            break;
                        }
                    }

                    if (playlistgid != null) {
                        playlistRemoved(playlistgid);
                    }

                }
            }
        }, 50)


        $('#playlistselectvertical .search-choice').data('loaded', 'true')


        if ($('#playlistselectverticalform option:selected').size() > 0)
            $("#clearChoosenPlaylists").show();
        else
            $("#clearChoosenPlaylists").hide();


        uiController.updateUI();
        var closefunc = function () {
            var playlistgid = null;
            var name = $(this).parent().text();

            for (var i = 0; i < playlistController.playlists.length; i++) {
                if (playlistController.playlists[i].name == name) {
                    playlistgid = playlistController.playlists[i].gid
                    break;
                }
            }

            if (playlistgid != null) {
                playlistRemoved(playlistgid);
            }


            uiController.updateUI();
        }
        $('.search-choice-close').unbind('click', closefunc);
        $(".search-choice-close").click(closefunc)

    });


    $("#clearChoosenPlaylists").hide();
    uiController.updateUI();
    playlistController.loadedPlaylistSongs = playlistController.playlists;
    if (playlistController.loadedPlaylistSongs.length > 0)
        $("#saveplaylistbtn img").attr("src", "public/img/plus.png");


    $("#playlistview").hide();
    $scope.safeApply();
    setTimeout(function () {
        $("#playlistview").listview('refresh');
        $("#playlistview").show();
        playlistController.makePlayListSortable();
        setTimeout(function () {
            uiController.playListScroll.refresh();
        }, 150)
    }, 0)


    $('#playlistselectvertical .chosen-container').click(function (event) {
        if ($('#playlistselectvertical #clearChoosenPlaylists:hover').length == 0)
            $(".chosen-drop").addClass("visible")

    });


    $('#playlistselectvertical #clearChoosenPlaylists').click(function (event) {


        if (playlistController.unsafedSongsExists()) {
            $("#playlistselectvertical .chosen-container").removeClass("chosen-with-drop");
            $("#popupConfirm").popup("option", "positionTo", "#clearChoosenPlaylists");
            $("#popupConfirm").popup("option", "transition", "pop");

            uiController.popupConfirm = {doIt: function () {
                uiController.showPlaylists();
            }}
            setTimeout(function () {
                $("#popupConfirm").popup("open");
            }, 150)

        }
        else {
            uiController.showPlaylists();

        }

    });


    $('.chosen-container input').blur(function () {
        setTimeout(uiController.updateUI, 100);
    });


    playlistController.makePlayListSortable();

    if (!app.isCordova) {
        $(".sortable").sortable("disable");
    }


    uiController.updateUI();
    setTimeout(function () {

        uiController.updateUI();
        $("#playlist").addClass("fadeincomplete");
        // $("#playlist").css("opacity", "1");
    }, 0);


    $("#playlistselectvertical .ui-input-clear").appendTo("#playlistselectvertical .ui-input");


    setTimeout(function () {
        var playIndicator = $('<div class="iScrollPlayIndicator fadeincomplete" ' +
            'style="box-sizing: border-box; ' +
            ' position: absolute;' +
            /*' background-color: rgba(245,245,245, 0.498039);' +
             ' border: 1px solid rgba(255, 255, 255, 0.901961);' +
             ' border-top-left-radius: 3px;' +
             ' border-top-right-radius: 3px;' +
             ' border-bottom-right-radius: 3px;' +
             ' border-bottom-left-radius: 3px;' +
             ' width: 100%;' +
             ' display: block; height: 9px;' +  */
            ' -webkit-transform: translate(0px, 0px)' +
            ' -moz-transform: translate(0px, 0px)' +
            ' -ms-transform: translate(0px, 0px)' +
            ' transform: translate(0px, 0px)' +
            ' translateZ(0px);' +
            ' background-position: initial initial;' +
            ' background-repeat: initial initial;' +
            ' display:none;"></div>'

        );

        var playIndicatorPlalist = playIndicator.clone();


        playIndicator.appendTo("#searchlist .iScrollVerticalScrollbar");

        playIndicator.click(function () {
            uiController.searchListScroll.scrollToElement(".loadedsong", 700);
        });


        playIndicatorPlalist.appendTo("#playlistInner .iScrollVerticalScrollbar");
        playIndicatorPlalist.click(function () {
            uiController.playListScroll.scrollToElement(".loadedsong", 700);
        });

        $(".iScrollIndicator").addClass("fadeincomplete");


    }, 0)

    setTimeout(function () {
        $("#inputclearhide").remove();
    }, 1000);
    document.title = $scope.appTitle;


    //Init WebGL
    if (window.WebGLRenderingContext) {
        try {
            // browser supports WebGL
            var canvas = document.getElementById("webglcanvas");
            if (canvas)
                try {
                    // Try to grab the standard context. If it fails, fallback to experimental.
                    var webglcontext = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                    console.log("webgl");
                }
                catch (e) {
                }
        } catch (e) {
        }
    }


};


uiController.isMaxVideoSizeFaktor = function (sizeVideo) {
    if ($("#videoplayer").height() * 0.5 * sizeVideo * uiController.sizeVideoRelative + 82 + 30 > $(window).height()) {
        return true
    }
    return false;
}

/*
 uiController.styleVideo = function (overtakeSize) {

 if (uiController.isMaxVideoSizeFaktor(uiController.sizeVideo))
 var sizeVideo = ( $(window).height() - (82 + 30) ) / ( $("#videoplayer").height() * 0.5 * uiController.sizeVideoRelative);
 else
 sizeVideo = uiController.sizeVideo;

 $("#videoplayer").css("-webkit-transform", "translate(" + uiController.translateVideo + "px,0px) scale(" + 0.5 * sizeVideo * uiController.sizeVideoRelative + ")");
 $("#videoplayer").css("transform", "translate(" + uiController.translateVideo + "px,0px) scale(" + 0.5 * sizeVideo * uiController.sizeVideoRelative + ")");
 $("#videoplayer").css("-webkit-transform-origin", "50% 100%");
 $("#videoplayer").css("transform-origin", "50% 100%");


 $("#siteLogo").css("-webkit-transform", "scale(" + 1 / uiController.sizeVideoRelative + ")").css("transform", "scale(" + 1 / uiController.sizeVideoRelative + ")");


 if (overtakeSize)
 uiController.sizeVideo = sizeVideo;
 }
 */

/**
 * Shows a toast
 * @param msg
 */
uiController.toast = function (msg, time, touchFunc) {
    $("#toastId").remove();
    var toastclass = 'ui-loader ui-overlay-shadow ui-bar-e ui-corner-all';
    $("<div id='toastTest' 'class= '" + toastclass + "'>" + msg + "</div>")
        .css({ display: "inline-block", visibility: "visisble"})
        .appendTo($.mobile.pageContainer)
    $("<div class='" + toastclass + "' id = 'toastId'>" + msg + "</div>")
        .css({ display: "block",

            opacity: 0,
            position: "fixed",
            padding: "7px",
            "text-align": "center",
            width: $("#toastTest").width() + 10,
            left: (uiController.windowWidth - $("#toastTest").width() - 10) / 2,
            top: $(window).height() / 2 - $("#toastTest").height() / 2})
        .click(function () {
            $("#toastId").hide();
            touchFunc();
        })
        .appendTo($.mobile.pageContainer)
        .fadeTo(400, 0.8)
        .delay(time)
        .fadeOut(400, function () {
            $(this).remove();
        });
    $("#toastTest").remove();


}


uiController.toggleSearchButton = function (button) {
    $('#searchbutton' + button).buttonMarkup({theme: 'a'});
    $('#searchbutton' + button).parent().buttonMarkup({theme: 'a'});
    for (var i = 0; i < 5; i++) {
        if (i + 1 != button) {
            $('#searchbutton' + (i + 1)).buttonMarkup({theme: 'b'});
            $('#searchbutton' + (i + 1)).parent().buttonMarkup({theme: 'b'});
        }
    }

}

/**
 * savePlaylist and show green marker
 * @param useSelected use the only seleted playlist
 */
uiController.savePlaylistVisible = function (useSelected) {

    var gid = playlistController.savePlaylist(useSelected);

    $('#playlistselectverticalform option').prop('selected', false);
    $('#playlistselectverticalform').trigger('chosen:updated');
    $('#playlistselectverticalform option[value="' + gid + '"]').prop('selected', true);
    $('#playlistselectverticalform').trigger('chosen:updated');
    playlistController.loadedPlaylistSongs = [];
    // $scope.safeApply();
    setTimeout(function () {
        $('#playlistselectverticalform').trigger('chosen:close');
        $("#clearChoosenPlaylists").show();

        $("#playlistselectverticalform").trigger('change');
        uiController.updateUI();
    }, 0)


    setTimeout(function () {
        $("#saveplaylistbtn").addClass("greenbackground");
        $("#saveplaylistbtn img").attr("src", "public/img/check.png");
        $("#saveplaylistbtn img").fadeTo(300, 0.35, function () {
            $("#saveplaylistbtn img").fadeTo(300, 1, function () {
                setTimeout(function () {
                    $("#saveplaylistbtn img").fadeTo(300, 0.35, function () {
                        $("#saveplaylistbtn img").fadeTo(300, 1, function () {
                            setTimeout(function () {
                                $("#saveplaylistbtn").removeClass("greenbackground");
                                $("#saveplaylistbtn img").attr("src", "public/img/save.png");
                                ;

                            }, 1000)
                        });
                    });

                }, 1000)
            });
        });

    }, 250)
}


uiController.stopScrollingOnClick = function (event) {
    var myEvent = jQuery.extend({}, event);
    myEvent.type = "mouseup";
    myEvent.preventDefault = function () {
    };
    setTimeout(function () {
        uiController.searchListScroll.handleEvent(myEvent);
    }, 10)
    setTimeout(function () {
        uiController.searchListScroll.handleEvent(myEvent);
    }, 100)
}


uiController.updateDisplay = function () {

    uiController.windowWidth = $(window).width();

    $("#page").width(uiController.windowWidth);
    $("#header").width(uiController.windowWidth);

}


/**
 * Update UI
 */
uiController.updateUI = function () {
    uiController.updateDisplay();

    //Additional Control Buttons
    uiController.countCustomButtons = $(".videoControlElements-custom-button:visible").length;


    $("#lyricsiframeresizebar").css("top", -10);//$(window).height() / 2 - 30 - 44);
    $("#lyricsiframeresizebar").css("right", -2);

    var myIframe = document.getElementById('lyricsifrm');
    setTimeout(function () {
        myIframe.contentWindow.scrollTo(0, 100);
    }, 2000)


    /*
     if (!dontChangeVideOpacity) {
     if (uiController.windowWidth < uiController.responsiveWidthSmall || $(window).height() < 350) {

     if ($("#videoplayer").css("opacity") != 0) {
     $("#videoplayer").css("opacity", "0");
     $("#videoplayer").css("pointer-events", "none");

     }
     } else {

     if ($("#videoplayer").css("opacity") != 1 && uiController.playedFirst) {
     $("#videoplayer").css("opacity", "1");
     $("#videoplayer").css("pointer-events", "auto");

     }

     }
     } */

    $(".ui-panel").css("height", $(window).height() - 44 - 3);
    $("#page").css("height", $(window).height() - 44 - 3);

    // $("#videoplayer").css("width", uiController.windowWidth);

    if ($(window).height() / 2 - 60 > 65)
        $("#playlisthelp").css("top", $(window).height() / 2 - 60)
    else
        $("#playlisthelp").css("top", 65)


    //Smallest Size
    if (uiController.windowWidth < uiController.responsiveWidthSmallest) {

        $("#rightpanel").css("height", $(window).height() - 88);

        $("#searchlist a").css("text-overflow", "clip");

        if ($("#playlist").parents("#rightpanel").length == 0)
            $("#playlist").appendTo("#rightpanel");

        $("#playlist").css("max-height", $(window).height() - 44 - 44 - 3);

        setTimeout(function () {
            if ($("#playlistselectvertical .chosen-container").height() > 0)
                $("#playlistInner").css("max-height", $(window).height() - 3 - 45 - (100 + $("#playlistselectvertical .chosen-container").height() - 30));
            else
                $("#playlistInner").css("max-height", $(window).height() - 3 - 45 - 5);
        }, 100)

        if (uiController.sidePanelOpen) {

            if (uiController.windowWidth - $("#rightpanel").width() - 10 < 100) {
                //$("#searchlist li a").wrap('<marquee behavior="alternate"></marquee>');
                $("#searchlist li").css("max-height", "65px");

            }

        }
        $("#searchlist").css("width", uiController.windowWidth - 20);


        $("#playlist").css("width", $("#rightpanel").width() - 20 - 10);


        $("#playlistInner li").css("width", $("#rightpanel").width() - 20);


        $("#playlistselectvertical .chosen-container").css("width", "");
        $("#playlistselectvertical .chosen-container").css("max-width", "");


        $("#saveplaylistinput").css("width", "");
        $("#saveplaylistinput").css("max-width", "");


        $("#playlistselectvertical input").css("width", 110);
        // $("#playlistselectvertical input").css("max-width", 50);


    }
    else { //Bigger then Smallest size

        $("#searchlist a").css("text-overflow", "ellipsis");

        if ($("#playlist").parents("#rightpanel").length != 0) {
            $("#playlist").hide().appendTo("#content");
            setTimeout(function () {
                $("#playlist").fadeIn()
            }, 150)
        }

        setTimeout(function () {
            var topDifference;

            if ($("#playlistselectvertical .chosen-container").height() > 0)
                topDifference = $("#playlistselectvertical .chosen-container").height() - 30;
            else
                topDifference = 5;

            //Smaller Size
            if (uiController.windowWidth < uiController.responsiveWidthSmaller && uiController.windowWidth > uiController.responsiveWidthSmall) {
                $("#playlist").css("max-height", $(window).height() - 110 - 44);
                $("#playlistInner").css("max-height", $(window).height() - 110 - 100 - topDifference);

            } else {
                $("#playlist").css("max-height", $(window).height() - 50 - 44);
                $("#playlistInner").css("max-height", $(window).height() - 50 - 100 - topDifference);

            }
        }, 100)


        $("#searchlist").css("max-height", $(window).height() - 44 - 120 + 6);

        var setSelectSize = function () {
            $("#playlistselectvertical .chosen-container").css("width", $("#playlist").width() - 50 - 40);
            $("#playlistselectvertical .chosen-container").css("max-width", $("#playlist").width() - 50 - 40);
            $("#saveplaylistinput").css("width", $("#playlist").width() - 50 - 40);
            $("#saveplaylistinput").css("max-width", $("#playlist").width() - 50 - 40);

            $("#playlistselectvertical input").css("width", 110);
            // $("#playlistselectvertical input").css("max-width", 50);
        }
        setSelectSize();
        $("#playlist").css("width", uiController.windowWidth / 3);
        $("#playlistInner li").css("width", uiController.windowWidth / 3);

        $("#searchlist").css("width", uiController.windowWidth - uiController.windowWidth / 3 - 30);

        setSelectSize();


    }

    uiController.totalTimeWidth = uiController.windowWidth / 1.5 - 160 - 105 - 5;

    videoController.resizeVideo();


    //Small Size
    if (uiController.windowWidth < uiController.responsiveWidthSmall) {

        uiController.totalTimeWidth = (uiController.windowWidth / 1.5 - 160);

        if ((uiController.windowWidth) / 1.5 - 160 - 105 + 10 < 323 - 105 - uiController.countCustomButtons * 26) {
            if (((uiController.windowWidth) / 1.5 - 160 - 105 - uiController.countCustomButtons * 26) + 10 < 0) {
                $("#videocontrols .videoControlElements-time-total").css("width", "0px");
                $("#videocontrols .videoControlElements-time-rail").css("width", "0px");

                // console.log("!nnn" + (((uiController.windowWidth) / 1.5 - 160 - 105 - uiController.countCustomButtons * 26) + 10))
            }
            else {
                $("#videocontrols .videoControlElements-time-total").css("width", ((uiController.windowWidth) / 1.5 - 160 - 105 - uiController.countCustomButtons * 26));
                $("#videocontrols .videoControlElements-time-rail").css("width", ((uiController.windowWidth) / 1.5 - 160 - 105 - uiController.countCustomButtons * 26) + 10);
            }
        }
        else {
            $("#videocontrols .videoControlElements-time-total").css("width", 323 - 105 - uiController.countCustomButtons * 26 - 10);
            $("#videocontrols .videoControlElements-time-rail").css("width", 323 - 105 - uiController.countCustomButtons * 26);


        }

        $("#searchlist").css("max-height", $(window).height() - 44 - 130 - 40 + 12);

        $("#content").css({"width": uiController.windowWidth - 16, "height": $(window).height() - 44 - 4 - 8 });


    }
    //Big Size
    else {

        /*do {
         var marquee = $("#searchlist li marquee").get(0);
         $(marquee).replaceWith($(marquee).contents());
         } while (marquee)*/


        uiController.totalTimeWidth = (uiController.windowWidth / 1.5 - 160) / 1.3 - 105 - uiController.countCustomButtons * 26;
        $("#videocontrols .videoControlElements-time-total").css("width", (uiController.windowWidth / 1.5 - 160) / 1.3 - 105 - uiController.countCustomButtons * 26);
        $("#videocontrols .videoControlElements-time-rail").css("width", (uiController.windowWidth / 1.5 - 160) / 1.3 + 10 - 105 - uiController.countCustomButtons * 26);

        $("#content").css({"width": uiController.windowWidth - 32, "height": $(window).height() - 44 - 4 - 32 });

    }

    if (uiController.windowWidth < 365) {

        $("#controlbar .ui-input-search").css("max-width", uiController.windowWidth - 65);
        $("#controlbar .ui-select").css("max-width", uiController.windowWidth - 25);


    } else {
        $("#controlbar .ui-input-search").css("max-width", 300);
        $("#controlbar .ui-select").css("max-width", 340);

    }

    // alert($("#playlistselectvertical .chosen-container").height() )
    setTimeout(function () {
        if ($("#playlistselectvertical .chosen-container").height() > 0)
            $("#playlistInner").css("top", 90 + $("#playlistselectvertical .chosen-container").height() - 30 - 30);
        else
            $("#playlistInner").css("top", 90 + 8 - 30);

    }, 100)


    $("#draggelement").remove()
    var style = $('<style id="draggelement">' +
        '.draggedlistelement { ' +
        '        width: ' + $("#playlistInner ul").width() + 'px !important;' +
        '}' +
        '.draggedlistelement li a { ' +
        '        width: ' + ($("#playlistInner ul").width() - 70) + 'px !important;' +
        '}' +
        '</style>');
    $('html > head').append(style);


    setTimeout(function () {

        if (Math.abs($("#videocontrolsInner .videoControlElements-controls").css("padding-left").replace("px", "") - ( (uiController.windowWidth - $(".videoControlElements-controls").width() * 1.5) / 2 / 1.5)) > 1)
            $("#videocontrolsInner .videoControlElements-controls").css("padding-left", (uiController.windowWidth - $(".videoControlElements-controls").width() * 1.5) / 2 / 1.5).css("padding-right", (uiController.windowWidth - $(".videoControlElements-controls").width() * 1.5) / 2 / 1.5);
        setTimeout(function () {
            if (Math.abs($("#videocontrolsInner .videoControlElements-controls").css("padding-left").replace("px", "") - ( (uiController.windowWidth - $(".videoControlElements-controls").width() * 1.5) / 2 / 1.5)) > 1)
                $("#videocontrolsInner .videoControlElements-controls").css("padding-left", (uiController.windowWidth - $(".videoControlElements-controls").width() * 1.5) / 2 / 1.5).css("padding-right", (uiController.windowWidth - $(".videoControlElements-controls").width() * 1.5) / 2 / 1.5);
        }, 50)
    }, 0)


    setTimeout(function () {
        uiController.searchListScroll.refresh();
        uiController.playListScroll.refresh();
    }, 150)
};


/**
 * Toggle Side Panel
 */
uiController.toggleSidePanel = function () {

    if (!this.toggleSidePanelTimer || Date.now() - this.toggleSidePanelTimer > 200) {
        if ($('.ui-panel-open').length == 0) {

            $('#rightpanel').panel('open')

        } else {

            $('#rightpanel').panel('close')

        }
    }
    this.toggleSidePanelTimer = Date.now();
}


/**
 * Show Playlists
 */
uiController.showPlaylists = function () {
    $('#playlistselectverticalform option').prop('selected', false);
    $('#playlistselectverticalform').trigger('chosen:updated');
    setTimeout(function () {
        $('#playlistselectverticalform').trigger('chosen:close');
    }, 0)
    setTimeout(function () {

        $("#clearChoosenPlaylists").hide();
        uiController.updateUI();
        playlistController.loadedPlaylistSongs = playlistController.playlists;
        $("#saveplaylistbtn img").attr("src", "public/img/plus.png");

        $("#playlistInner .iScrollPlayIndicator").hide();
        $("#searchlist .iScrollPlayIndicator").hide();

        $("#playlistview").hide();
        $scope.safeApply();
        setTimeout(function () {
            $("#playlistview").listview('refresh');
            $("#playlistview").show();
            playlistController.makePlayListSortable();
            setTimeout(function () {
                uiController.playListScroll.refresh();
            }, 150)
        }, 0)

    }, 10)
}


/* Toggel Grid Layout*/
uiController.toggleGridLayout = function () {
    uiController.gridLayout = !uiController.gridLayout;
    $("#searchlist  .iScrollIndicator").hide();
    var scrollY = uiController.searchListScroll.y;

    $("#searchlist").hide();


    setTimeout(function () {
        $("#searchlist ul").toggleClass("gridlayout")
        $("#searchlist").css("opacity", "0");
        $("#searchlist").show();
        $("#searchlistview").listview('refresh');

    }, 0);

    setTimeout(function () {


        // console.log("BBBBBBBBBBBBBBBBBBBBBBBBB "+cols)

        if (uiController.gridLayout) {
            uiController.gridLayoutCols = Math.floor($("#searchlist ul").width() / 250);

            scrollY = scrollY / uiController.gridLayoutCols;
            if (uiController.searchListScroll.toggelLayoutOldY != uiController.searchListScroll.y)
                scrollY = scrollY + 64;


            $("#searchlayoutbutton img").attr("src", "public/img/list.png");
        }
        else {
            scrollY = (scrollY) * uiController.gridLayoutCols;


            $("#searchlayoutbutton img").attr("src", "public/img/grid.png");
            setTimeout(function () {
                playlistController.positionSongOptions();
            }, 0)
        }


        uiController.searchListScroll.refresh();

        if ($("#searchlist ul").height() > $("#searchlist").height())
            $("#searchlist .iScrollIndicator").show();
        if (!$("#searchlist ul").height() > $("#searchlist").height())
            scrollY = 0;
        else if (scrollY > 0)
            scrollY = 0;
        else if (scrollY < uiController.searchListScroll.maxScrollY)
            scrollY = uiController.searchListScroll.maxScrollY;

        uiController.searchListScroll.scrollTo(0, scrollY);

        $("#searchlist").hide();
        $("#searchlist").css("opacity", "1");
        $("#searchlist").addClass("fadeincomplete");
        $("#searchlist").show();
        setTimeout(function () {
            $("#searchlist").removeClass("fadeincomplete");
        }, 500)

        uiController.searchListScroll.toggelLayoutOldY = scrollY;

    }, 800)
}








