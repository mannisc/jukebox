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


uiController.responsiveWidthSmallest = 780;

uiController.responsiveWidthSmall = 1170;


uiController.responsiveWidthSmaller = 1230;

uiController.adsWidth = 0;//160;

uiController.totalTimeWidth = 0;

uiController.gridLayout = true;
uiController.gridLayoutOld = false;


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

    uiController.gridLayout = false;

    uiController.toggleGridLayout();

    uiController.disableAutoFocus();


    $("#searchbutton1").parent(".ui-btn").addClass("searchbutton1parent");

    $(".ui-icon-loading").click(function () {
        $(".ui-icon-loading").hide();
    })

    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        $("#titleHeader").show().css("opacity", "1");

        $("#iconHeader").css("opacity", "1");

    } else {
        setTimeout(function () {

            $("#titleHeader").addClass("fadeincomplete");
            $("#titleHeader").show();
            $("#iconHeader").addClass("bounce");

        }, 0);
    }

    // Add BETA Status to Title
    $("#titleHeader").append('<div style="margin-left:3px;display:inline-block;color: #a00; font-weight: 100; font-size: 16px;"><sup> BETA</sup></div>');

    //Fade in fb like

    setTimeout(function () {
        $("#iconHeader").attr("src", "public/img/logostat.png");//logo.gif");
    }, 1000);


    //Additional Control Buttons
    uiController.countCustomButtons = $(".videoControlElements-custom-button:visible").length;


    $("#playlist, .videoControlElements-controls, #controlbar div, .ui-popup").click(function (event) {
        uiController.noBodyClickTimer = Date.now();    //To avoid body clicks wich deselect songs if clicked on the specified elements
    })


    //GLobal dblclick and Click Actions aufs Video/mainscreen


    uiController.dblclickedTimer = 0;
    uiController.dblclickedDelay = 250;


    $("#header div, #header a").click(function (event) {
        uiController.swipeTimer = Date.now();
    });

    $("#header").click(function () {
        if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 500)
            return;
        playlistController.selection.deselectElements();
    });


    $("#content").click(function (event) {

        if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 500)
            return;


        //CLicked on Scrollbarareas
        if ($(event.target).closest("#searchcontent").length > 0 && event.clientX < 30)
            return;


        if ($(event.target).closest("#playlistInner").length > 0 && ($("#playlistInner").offset().left + $("#playlistInner").width() - event.clientX) < 20)
            return;


        //CLicked on Scrollbarareas
        if ($(event.target).closest("#searchcontent").length == 0 && $(event.target).closest("#playlistInner").length == 0) {
            if ($(event.target).closest("a, .ui-btn, input").length > 0)
                return;
        }

        var normalClick = function () {

            uiController.dblclickedTimer = Date.now();
            setTimeout(function () {

                if (uiController.dblclickedTimer > 0) {
                    //Normal Click
                    if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 100)
                        return;

                    if (!uiController.noBodyClickTimer || Date.now() - uiController.noBodyClickTimer > 100) {
                        if (playlistController.selectedElements && playlistController.selectedElements.length > 0) {
                            playlistController.selection.deselectElements();

                        } else if ($(event.target).closest("#searchcontent").length > 0) {
                            if (!uiController.gridLayout) {

                                if ($("#searchinput:focus").length > 0) {
                                    $("#searchinput").blur();
                                }
                                else {
                                    if ($("#playlistselectvertical input:focus").length > 0)
                                        $("#playlistselectvertical input").blur();
                                    else
                                        videoController.playPauseSong();
                                }


                            }

                        }

                    }

                }

            }, playbackController.dblclickedDelay + 1)
        }
        if (Date.now() - uiController.dblclickedTimer < playbackController.dblclickedDelay) {
            uiController.dblclickedTimer = 0;

            //Double Click

            if ($(event.target).closest("#searchcontent").length > 0) {
                if (videoController.fullscreenEnabled && videoController.videoPlayer) {
                    videoController.toggleFullscreenMode();
                }
            }


        } else
            normalClick();

    })


    /* TODO CHANGE TO RIGHT INPUT
     $('#saveplaylistinpt').keyup(function (evt) {
     if (evt.keyCode == 13) {
     $("#saveokayplaylistbtn").click();
     return false;
     }
     });
     // uiController.initMediaPlayer();

     $("#saveplaylistinpt").on("input", function () {
     if ($("#saveplaylistinpt").val()) {
     $("#saveokayplaylistbtn").removeAttr("disabled").css("opacity", "1");

     } else {

     $("#saveokayplaylistbtn").attr("disabled", "disabled").css("opacity", "0.5");

     }

     })

     */

    $(".ui-input-clear").addClass("ui-btn ui-btn-b ui-shadow ui-corner-all ui-mini");


    uiController.updateDisplay();

    setTimeout(function () {
        $("iframe").get(0).contentDocument.close();
    }, 2000);

    var style = $('<style id="inputclearhide">' +
        '.ui-input-clear {' +
        ' display:none!important;' +
        '}' +
        '</style>');
    $('html > head').append(style);

    $('body').bind('contextmenu', function (e) {
        return true;
        if (playlistController.selectedElements.length > 0)
            playlistController.selection.deselectElements(e)


        return false;
    });

    //Startup and on Resize
    var onSizeChange = function(){
        //Change Video height
        $("#videoSizeStyle").remove();
        var style =  $('<style id="videoSizeStyle">' +
            '.backgroundVideo *{' +
            'height:'+($(window).height()-46) +"px!important"+

            '}'+
            '</style>');
        console.log(style)
        $('head').append(style);



    }
    onSizeChange();


    //On Window Resize
    $(window).resize(function () {
        onSizeChange();
        //$(".ui-popup:visible").popup("close")

        if ($('.ui-panel-open').length != 0) {
            $('#rightpanel').panel('close');
        }
        if (playlistController.sortPlaylist)
            playlistController.ui.toggleSortablePlaylist();

        $("#playlistview").css("min-height", "");
        uiController.updateUI();

        //Resize Songlists/ reset indicator
        setTimeout(function () {
            uiController.searchListScroll.refresh();
            uiController.playListScroll.refresh();
            uiController.toggleGridLayoutWidth();

            setTimeout(function () {
                uiController.searchListScroll.refresh();
                uiController.playListScroll.refresh();
                uiController.toggleGridLayoutWidth();

                playbackController.positionPlayIndicator();
                setTimeout(function () {
                    uiController.searchListScroll.refresh();
                    uiController.playListScroll.refresh();
                    playbackController.positionPlayIndicator();
                    uiController.toggleGridLayoutWidth();

                    setTimeout(function () {
                        playbackController.positionPlayIndicator();
                        setTimeout(function () {
                            playbackController.positionPlayIndicator();
                            setTimeout(function () {
                                uiController.searchListScroll.refresh();
                                uiController.playListScroll.refresh();
                                playbackController.positionPlayIndicator();
                                uiController.toggleGridLayoutWidth();

                            }, 2000);
                        }, 100);
                    }, 100);
                }, 100);

            }, 100);

        }, 1000);


    });


    //Animate Sidde Panel Open Icon
    $("#rightpanel").on("panelbeforeclose", function (event, ui) {
        if (playlistController.sortPlaylist)
            playlistController.ui.toggleSortablePlaylist();
        uiController.sidePanelOpen = false;
        uiController.updateUI();


        uiController.searchListScroll.enable();
        uiController.searchListScroll.refresh();

        var transform = "translate3d(0px,0px,0px)";
        $("#openSidePanelBarIcon").css({"transition": "0.15s linear", "-transform": transform, "-ms-transform": transform, "-webkit-transform": transform});
        setTimeout(function () {
            uiController.updateUI();
        }, 500);
    });


    $("#rightpanel").on("panelbeforeopen", function (event, ui) {
        uiController.sidePanelOpen = true;
        uiController.searchListScroll.disable();

        var transform = "translate3d(10px,0px,0px)";
        $("#openSidePanelBarIcon").css({"transition": "0.15s linear", "-transform": transform, "-ms-transform": transform, "-webkit-transform": transform});
        setTimeout(function () {
            uiController.updateUI();
        }, 500);
    });


    setTimeout(function () {
        $("#inputclearhide").remove();

    }, 1000);

    document.title = $scope.appTitle;


    //Init WebGL
    if (false && window.WebGLRenderingContext) {
        try {
            // browser supports WebGL
            var canvas = document.getElementById("webglcanvas");
            if (canvas)
                try {
                    // Try to grab the standard context. If it fails, fallback to experimental.
                    var webglcontext = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                }
                catch (e) {
                }
        } catch (e) {
        }
    }
};

/**
 * Called when everything is ready
 */

uiController.ready = function () {
    $("#controlselecthorizontal .ui-input-search").append($(".searchinput-drop"));

    //Enable Fade in/fade out

    $("#searchlistview, #searchlist .iScrollVerticalScrollbar, #explorearea, #listhintleft, #openlistleft").mouseenter(function () {

        $("#searchcontent").addClass("isvisible");

        uiController.checkIfListHintsNecessary();


    }).mouseleave(function () {
            setTimeout(function () {
                if ($("#searchlistview:hover, #searchlist .iScrollVerticalScrollbar:hover ,#explorearea:hover , #listhintleft:hover, #openlistleft:hover").length == 0) {
                    $("#searchcontent").removeClass("isvisible");
                    uiController.checkIfListHintsNecessary();
                }
            }, 0)

        });

    $(" #playlistInner,#listhintright").mouseenter(function () {
        $("#playlistInner").addClass("isvisible");
        uiController.checkIfListHintsNecessary();

    }).mouseleave(function () {

            $(" #playlistInner").removeClass("isvisible");
            uiController.checkIfListHintsNecessary();


        });


    $("#searchinput").focus(function () {
        $("#searchcontent").addClass("isvisibleinput");
        uiController.checkIfListHintsNecessary();
    }).blur(function () {
            $("#searchcontent").removeClass("isvisibleinput");
            uiController.checkIfListHintsNecessary();
        });

    $("#playlistselectvertical input").focus(function () {
        $("#playlistInner").addClass("isvisibleinput");
        uiController.checkIfListHintsNecessary();
    }).blur(function () {
            $("#playlistInner").removeClass("isvisibleinput");
            uiController.checkIfListHintsNecessary();
        });


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

 uiController.savePlaylistVisible = function (useSelected) {
    $("#saveplaylistbtn img").css("opacity","0")

    var gid = playlistController.savePlaylist(useSelected);

    $('#playlistselectverticalform option').prop('selected', false);
    $('#playlistselectverticalform').trigger('chosen:updated');
    $('#playlistselectverticalform option[value="' + gid + '"]').prop('selected', true);
    $('#playlistselectverticalform').trigger('chosen:updated');
    //playlistController.loadedPlaylistSongs = [];
    // $scope.safeApply();
    setTimeout(function () {
        $('#playlistselectverticalform').trigger('chosen:close');
        $("#clearChoosenPlaylists").show();

        $("#playlistselectverticalform").trigger('change');
        uiController.updateUI();
    }, 0)


    setTimeout(function () {
        $("#saveplaylistbtn").addClass("greenbackground");
        //$("#saveplaylistbtn img").attr("src", "public/img/check.png");
        $("#saveplaylistbtn img").fadeTo(300,1, function () {
            setTimeout(function () {
        $("#saveplaylistbtn img").fadeTo(300, 0.25, function () {
            $("#saveplaylistbtn img").fadeTo(300, 1, function () {

                setTimeout(function () {
                    $("#saveplaylistbtn img").fadeTo(300, 0.25, function () {
                        $("#saveplaylistbtn img").fadeTo(300, 1, function () {
                            setTimeout(function () {
                                $("#saveplaylistbtn").removeClass("greenbackground");
                                //$("#saveplaylistbtn img").attr("src", "public/img/save.png");


                            }, 600)
                        });
                    });

                }, 600)
            });
        });
            },600)
        });
    }, 250)
}
 */

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

    if (videoController.fullscreenMode == 0 && $(window).width() >= uiController.responsiveWidthSmallest)
        uiController.windowWidth = $(window).width() - uiController.adsWidth;

    else
        uiController.windowWidth = $(window).width();


    $("#page").width(uiController.windowWidth);

  //  if ($(window).height() > 710)  //TODO ad
        $("#header").width($(window).width());
  //  else
  //      $("#header").width($(window).width() - 160);

    $("#videocontrols").width(uiController.windowWidth);

}


/**
 * Update UI
 */
uiController.updateUI = function () {
    uiController.updateDisplay();

    //Addjust Controllbar width
   $("#controlbar").css("width", $("#searchcontent").width()) ;

    //Additional Control Buttons
    uiController.countCustomButtons = $(".videoControlElements-custom-button:visible").length;

    $(".sideinfo").css("line-height", ($(window).height() - 5 - 44 - 10) + "px");


    $("#lyricsifrm").css("height", $(window).height() - 8 - 44 - 44 - 44)

    var myIframe = document.getElementById('lyricsifrm');
    setTimeout(function () {
        myIframe.contentWindow.scrollTo(0, 100);
    }, 2000)


    setTimeout(function () {
        $("#playlistview").css("min-height", $("#playlistScroll").height() - 18);
    }, 500)
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

    if (65 * 2 - 30 + $(window).height() / 2 - 60 > 65)
        $("#playlisthelp").css("top", 75 - 30 + $(window).height() / 2 - 60)
    else
        $("#playlisthelp").css("top", 75 - 30 + 65)


    if ($(window).width() < uiController.responsiveWidthSmall)

        $("#controlbar").append($("#searchlayoutbutton"));

    else

        $("#controlbar").prepend($("#searchlayoutbutton"));


    //Smallest Size
    if ($(window).width() < uiController.responsiveWidthSmallest) {


        $("#searchcontent, #playlistInner").addClass("isvisiblesmallscreen");
        uiController.checkIfListHintsNecessary();
        $("#rightpanel").css("height", $(window).height() - 91);

        $("#searchlist a").css("text-overflow", "clip");

        if ($("#playlist").parents("#rightpanel").length == 0)
            $("#playlist").appendTo("#rightpanel");

        $("#playlist").css("max-height", $(window).height() - 44 - 34 - 3+2);

        setTimeout(function () {
            console.log("----------123123---")

            if ($("#playlistselectvertical .chosen-container").height() > 0) {
                $("#playlistInner").css("max-height", $(window).height() - 3 - 35 - (100 + $("#playlistselectvertical .chosen-container").height() - 30)+2);
                $("#playlistScroll").css("max-height", $(window).height() - 3 - 35  - (100 + $("#playlistselectvertical .chosen-container").height() - 30 - $("#playlistButtons").height() * 102 / 93) - 2 - $("#marginplaylistsearchresults").height());
            }
            else {
                $("#playlistInner").css("max-height", $(window).height() - 3 - 40 - 5+2);
                $("#playlistScroll").css("max-height", $(window).height() - 3 - 40 - 5 - $("#playlistButtons").height() * 102 / 93 - 2 - $("#marginplaylistsearchresults").height() );

            }
        }, 100)

        if (uiController.sidePanelOpen) {

            if (uiController.windowWidth - $("#rightpanel").width() - 10 < 100) {
                //$("#searchlist li a").wrap('<marquee behavior="alternate"></marquee>');
                $("#searchlist li").css("max-height", "113px");
                $("#searchlist li.songlisttitlebutton").css("max-height", "44px");


            }

        }
        $("#searchcontent").css("width", uiController.windowWidth - 20);

        $("#controlselecthorizontal").css("width", uiController.windowWidth - 20);



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
        $("#searchcontent, #playlistInner").removeClass("isvisiblesmallscreen");
        uiController.checkIfListHintsNecessary();

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
            if ($(window).width() < uiController.responsiveWidthSmaller && $(window).width() > uiController.responsiveWidthSmall) {
                $("#playlist").css("max-height", $(window).height() - 110 - 44+2);
                $("#playlistInner").css("max-height", $(window).height() - 110 - 100 - topDifference+2);
                $("#playlistScroll").css("max-height", $(window).height() - 110 - 100 - topDifference - 2 - $("#marginplaylistsearchresults").height() - $("#playlistButtons").height() * 102 / 93);


            } else {
                $("#playlist").css("max-height", $(window).height() - 50 - 44+2);
                $("#playlistInner").css("max-height", $(window).height() - 50 - 100 - topDifference+2);
                $("#playlistScroll").css("max-height", $(window).height() - 50 - 100 - topDifference - 2 - $("#marginplaylistsearchresults").height() - $("#playlistButtons").height() * 102 / 93);


            }
        }, 100)


        $("#searchcontent").css("max-height", $(window).height() - 44 - 120 + 6 + 5);


        var playlistWidth = Math.min(uiController.windowWidth / 3, parseInt(($("#playlist").css("max-width"))));


        $("#playlist").css("width", playlistWidth);

        $("#playlistInner li").css("width", playlistWidth);


        if ($(window).width() < uiController.responsiveWidthSmall)
            $("#searchcontent").css("width", uiController.windowWidth - playlistWidth - 30 - 33);
        else
            $("#searchcontent").css("width", uiController.windowWidth - playlistWidth - 30);


        $("#playlistselectvertical .chosen-container").css("width", playlistWidth - 7);
        $("#playlistselectvertical .chosen-container").css("max-width", playlistWidth - 7);


        $("#playlistselectvertical input").css("width", 110);

    }

    uiController.totalTimeWidth = uiController.windowWidth / 1.5 - 160 - 105 - 5;

    videoController.resizeVideo();

    $("#playingSongInfoLink").css("right", "").css("max-width", "");


    //Small Size
    if ($(window).width() < uiController.responsiveWidthSmall) {






        if(playbackController.playingSong)
         $("#titleHeader").hide();
        else
         $("#titleHeader").show();


        var otherButtonsWidth=    ($("#buySongLink:visible").outerWidth()+ $("#signinLink:visible").outerWidth()+ $("#registerLink:visible").outerWidth()+ $("#linkAccount:visible").outerWidth()+7);

        $("#playingSongInfoLink").css("right", otherButtonsWidth).css("max-width", $(window).width()-otherButtonsWidth-125);


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

        if (searchController.visible)
            $("#searchcontent").css("max-height", $(window).height() - 44 - 130 - 40 + 12 + 5);
        else
            $("#searchcontent").css("max-height", $(window).height() - 44 - 130 - 40 + 12 + 5 + 50);

        $("#content").css({"width": uiController.windowWidth - 16, "height": $(window).height() - 44 - 4 - 8});


    }
    //Big Size
    else {

        $("#titleHeader").show();
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
        $("#controlbar .ui-input-search").css("max-width", 320);
        $("#controlbar .ui-select").css("max-width", 340);

    }

    // alert($("#playlistselectvertical .chosen-container").height() )
    setTimeout(function () {
        if ($("#playlistselectvertical .chosen-container").height() > 0)
            $("#playlistInner").css("top", 90 + $("#playlistselectvertical .chosen-container").height() - 30 - 30);
        else
            $("#playlistInner").css("top", 90 + 8 - 30);

    }, 100)


    setTimeout(function () {


        var oldDraggelementId = "draggelement" + Date.now() + "" + Math.random();

        $("#draggelement").attr("id", oldDraggelementId);
        var style = $('<style id="draggelement">' +
            '.draggedlistelement li { ' +
            '        width: ' + ($("#playlistInner ul").width() - 18) + 'px !important;' +
            '        max-width: ' + ($("#playlistInner ul").width() - 18) + 'px !important;' +
            '        min-width: ' + ($("#playlistInner ul").width() - 18) + 'px !important;' +
            '}' +
            '.draggedlistelement li a { ' +
            '        width: ' + ($("#playlistInner ul li").width() - 90 - 18) + 'px !important;' +
            '        max-width: ' + ($("#playlistInner ul li").width() - 90 - 18) + 'px !important;' +
            '        min-width: ' + ($("#playlistInner ul li").width() - 90 - 18) + 'px !important;' +
            '}' +
            '</style>');
        $('html > head').append(style);
        setTimeout(function () {
            $("#" + oldDraggelementId).remove();
        }, 0)

        $("#videocontrolsInner").css("opacity", 0);

        /*
         var positionControls = function () {

         // $("#videocontrolsInner").css("width", parseInt( $("#videocontrolsInner .videoControlElements-controls").css("width"))*1.5+"px");

         /* if (Math.abs($("#videocontrolsInner .videoControlElements-controls").css("padding-left").replace("px", "") - ( (uiController.windowWidth - $(".videoControlElements-controls").width() * 1.5) / 2 / 1.5)) > 1)
         $("#videocontrolsInner .videoControlElements-controls").css("padding-left", (uiController.windowWidth - $(".videoControlElements-controls").width() * 1.5) / 2 / 1.5).css("padding-right", (uiController.windowWidth - $(".videoControlElements-controls").width() * 1.5) / 2 / 1.5);


         }
         positionControls();
         setTimeout(positionControls, 50)
         */
    }, 0)


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
uiController.showPlaylists = function (event) {

    playlistController.showMode = 0;
    $("#marginplaylistsearchresults").css('cssText', 'height: 0px !important');


    if (playlistController.sortPlaylist)
        playlistController.ui.toggleSortablePlaylist(true);

    if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 450)
        return;
    uiController.swipeTimer = Date.now();

    if (event)
        event.stopPropagation();


// $("#playlistselectvertical .search-field input").attr("placeholder", playlistController.selectPlaylistsPlaceholder)

    $('#playlistselectverticalform option').prop('selected', false);
    $('#playlistselectverticalform').trigger('chosen:updated');
    setTimeout(function () {
        $('#playlistselectverticalform').trigger('chosen:close');
    }, 0)
    //setTimeout(function () {


    //Remove empty unnamed Playlists
    for (var playlist in playlistController.loadedPlaylists) {
        if (playlistController.loadedPlaylists.hasOwnProperty(playlist)) {
            if (!playlistController.loadedPlaylists[playlist].tracks || (playlistController.loadedPlaylists[playlist].tracks.length == 0 && playlistController.loadedPlaylists[playlist].isUnnamedPlaylist)) {
                for (var j = playlistController.playlists.length - 1; j >= 0; j--) {
                    if (playlistController.playlists[j].gid == playlistController.loadedPlaylists[playlist].gid) {
                        playlistController.playlists.splice(j, 1);
                    }
                }
            }
        }
    }

    playlistController.loadedPlaylists = {};
    playlistController.loadedPlaylistSongs = [];

    playlistController.playlistMode = true;

    $("#clearChoosenPlaylists").hide();
    uiController.updateUI();
    playlistController.loadedPlaylistSongs = playlistController.playlists;

    $("#playlistInner .iScrollPlayIndicator").hide();
    $("#playlistInner .iScrollIndicator").hide();

    //  $("#searchlist .iScrollPlayIndicator").hide();

    // $("#playlistview").hide();

    $("#playlistInner .songlist").addClass("hidden");

    playlistController.ui.applySongList();

    if (playlistController.playlistsScrollY)
        uiController.playListScroll.scrollTo(0, playlistController.playlistsScrollY, 0);

    /*
     $scope.safeApply();
     setTimeout(function () {
     uiController.updateUI();
     $("#playlistview").listview('refresh');
     $("#playlistInner .songlist").removeClass("hidden").removeClass("avoidhiding");

     //  $("#playlistview").show();
     playlistController.dragging.makePlayListSortable();
     setTimeout(function () {
     uiController.playListScroll.refresh();
     }, 150)
     }, 0)

     */
    //}, 10)
}


/* Toggel List Hint if necessary*/
uiController.checkIfListHintsNecessary = function () {

    var searchContent = $("#searchcontent");


    if (searchContent.hasClass("gridlayout") || searchContent.hasClass("isvisible") || searchContent.hasClass("isvisibleviewchanged") || searchContent.hasClass("isvisiblestart") || searchContent.hasClass("isvisibledragging") || searchContent.hasClass("isvisibleinput") || searchContent.hasClass("isvisiblesmallscreen") || searchContent.hasClass("isvisiblepopup")) {
        $("#listhintleft").css("opacity", "0");
    } else {
        $("#listhintleft").css("opacity", "0.75");

    }
    var playlistInner = $("#playlistInner");

    if (playlistInner.hasClass("gridlayout") || playlistInner.hasClass("isvisible") || playlistInner.hasClass("isvisibleviewchanged") || playlistInner.hasClass("isvisiblestart") || playlistInner.hasClass("isvisibledragging") || playlistInner.hasClass("isvisibleinput") || playlistInner.hasClass("isvisiblesmallscreen") || playlistInner.hasClass("isvisiblepopup")) {
        $("#listhintright").css("opacity", "0");
    } else {
        $("#listhintright").css("opacity", "0.75");
    }


}

uiController.gridWidth = 300;
uiController.toggleGridLayoutWidth = function () {
    uiController.gridLayoutCols = Math.floor(($("#searchlist ul").width() - 35) / uiController.gridWidth);

    $("#gridlayoutwidth").remove();

    if (($("#searchlist ul").width() / uiController.gridLayoutCols - 35) > uiController.gridWidth) {
        var style = $('<style id="gridlayoutwidth">' +
            '#searchlist ul.gridlayout li { width:' + (($("#searchlist ul").width() / uiController.gridLayoutCols - 35)) + 'px!important;} ' +
            '</style>');
        $('html > head').append(style);

    }
}


/* Toggel Grid Layout*/
uiController.toggleGridLayout = function () {
    //   viewController.fadeContentVisible(dontFadeContentTime);

    uiController.gridLayout = !uiController.gridLayout;
    if (uiController.gridLayout)
        $("#searchlayoutbutton img").attr("src", "public/img/grid.png");
    else
        $("#searchlayoutbutton img").attr("src", "public/img/list.png");

    setTimeout(function () {

        var scrollY = uiController.searchListScroll.y;

        // $("#searchlist").hide();


        if (uiController.gridLayout) {
            if (videoController.videoOpactiy == videoController.startVideoOpactiyVisisble)
                videoController.videoOpactiy = videoController.startVideoOpactiyBackground;
            else {
                videoController.videoOpactiy = videoController.videoOpactiy / 1.1;
                if (videoController.videoOpactiy < 0)
                    videoController.videoOpactiy = 0;
            }
            videoController.setVideoOpacity(videoController.videoOpactiy);

            $("#searchlist ul").addClass("gridlayout")

        }


        setTimeout(function () {

            if (uiController.gridLayout) {
                $("#searchcontent").removeClass("forceenotvisible");
                if (!uiController.gridLayoutOld) {


                    uiController.toggleGridLayoutWidth();


                    scrollY = scrollY / uiController.gridLayoutCols;
                    if (uiController.searchListScroll.toggelLayoutOldY != uiController.searchListScroll.y)
                        scrollY = scrollY + 64;

                    $scope.safeApply();
                    $("#searchlistview").listview('refresh');


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


                } else
                    uiController.searchListScroll.refresh();
            }

            $("#searchlistview").listview('refresh');

            $("#searchcontent, #playlistInner, #playlist").toggleClass("gridlayout")
            uiController.checkIfListHintsNecessary();

            //$("#searchlist").css("opacity", "0");
            //$("#searchlist").show();
            //

        }, 0);


        if (uiController.toggleGridLayoutTimer)
            clearTimeout(uiController.toggleGridLayoutTimer);


        if (playbackController.playingSong)
            var fadeOutTime = 1500;
        else
            fadeOutTime = 0;


        if (!uiController.gridLayout) {
            $("#searchcontent").addClass("forceenotvisible");
        }


        uiController.toggleGridLayoutTimer = setTimeout(function () {
            uiController.toggleGridLayoutTimer = null;

            // console.log("BBBBBBBBBBBBBBBBBBBBBBBBB "+cols)

            if (!uiController.gridLayout)
                $("#searchlist ul").removeClass("gridlayout");

            $("#searchcontent").removeClass("forceenotvisible");


            $scope.safeApply();
            $("#searchlistview").listview('refresh');

            setTimeout(function () {
                if (!uiController.gridLayout) {

                    if (videoController.videoOpactiy = videoController.startVideoOpactiyBackground)
                        videoController.videoOpactiy = videoController.startVideoOpactiyVisisble;
                    else {
                        videoController.videoOpactiy = videoController.videoOpactiy * 1.1;
                        if (videoController.videoOpactiy > 1)
                            videoController.videoOpactiy = 1;
                    }


                    scrollY = (scrollY) * uiController.gridLayoutCols;


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
                }
                videoController.setVideoOpacity(videoController.videoOpactiy);
                setTimeout(function () {
                    playlistController.options.positionSongOptions();
                }, 0)

                /*  $("#searchlist").hide();
                 $("#searchlist").css("opacity", "1");
                 $("#searchlist").addClass("fadeincomplete");
                 $("#searchlist").show();
                 setTimeout(function () {
                 $("#searchlist").removeClass("fadeincomplete");
                 }, 500)
                 */
                $("#searchlistview").listview('refresh');
                uiController.searchListScroll.refresh();

                uiController.searchListScroll.toggelLayoutOldY = scrollY;
                uiController.gridLayoutOld = uiController.gridLayout;

            }, 0);
        }, fadeOutTime)
    }, 0);
}


uiController.disableUI = function (disable) {
    if (disable) {
        $(".fullscreendisable").show()
        $.mobile.loading("show");

    } else {
        $(".fullscreendisable").hide()
        $.mobile.loading("hide");

    }


}


//TODO no usage yet, remove uU
uiController.showBackgroundImage = function (show) {
    if (!show) {
        uiController.showBackgroundImageWasVisible = ( $("#backgroundImage:visible").length > 0);
        $("#backgroundImage").removeClass("fadeoutcomplete").addClass("fadeincompleteslow")
        $("<style type='text/css' id='hidevideobackground'> #backgroundVideo{ opacity:0!important} #backgroundImage{ display:block!important;}  </style>").appendTo("head");

    } else {

        $("#hidevideobackground").remove();
        if (!uiController.showBackgroundImageWasVisible) {
            $("#backgroundImage").removeClass("fadeincompleteslow").addClass("fadeoutcomplete")
        }
    }
}


// ==UserScript==
// @name           Disable auto-focussing
// @author         ComFreek <comfreek at the following domain 'outlook' with the TLD 'com'>
// @description    Disable auto-focussing
// @include *
// @version        1.0
// ==/UserScript==

uiController.disableAutoFocus = function () {


    function is_touch_device() {

        return !!window.ontouchstart // works on most browsers
            || !!window.onmsgesturechange; // works on ie10
    };

    if (is_touch_device()) {
        var maxTime = 3000;
        var timeoutInterval = 5;

        var usedTime = 0;
        var isManualFocus = false;

        function check() {
            if (!isManualFocus && document.activeElement.tagName.toLowerCase() == "input") {
                console.log("BLURRED");
                document.activeElement.blur();
            }
            usedTime += timeoutInterval;
            if (usedTime < maxTime) {
                window.setTimeout(check, timeoutInterval);
            }
        }

        check();


        document.body.addEventListener("click", function (evt) {
            if (evt.target.tagName == "INPUT") {
                console.log("MANUAL CLICK");
                isManualFocus = true;
            }
        });

        document.body.addEventListener("keydown", function (evt) {
            isManualFocus = true;
        });
    }
}


uiController.isTouchSupported = function () {

    var test = function () {
        uiController.isTouchNotSupportedOnDevice = true;
    }
    $(window).off("mouseover", test);

    $(window).on("mouseover", test);

    return uiController.isTouchNotSupportedOnDevice;
//OLD
    /*
     var msTouchEnabled = window.navigator.msMaxTouchPoints;
     var generalTouchEnabled = "ontouchstart" in document.createElement("div");

     if (msTouchEnabled || generalTouchEnabled) {
     return true;
     }
     return false;
     */
}
