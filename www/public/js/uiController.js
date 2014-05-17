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

uiController.responsiveWidthSmall = 850;


uiController.responsiveWidthSmaller = 1165;

uiController.adsWidth  =160;

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

    uiController.disableAutoFocus();


    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        $("#titleHeader").show();
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
        $("#iconHeader").attr("src", "public/img/logo.gif");
    }, 15000)


    //Additional Control Buttons
    uiController.countCustomButtons = $(".videoControlElements-custom-button:visible").length;


    $("body").dblclick(function (event) {
        playlistController.deselectSongs(event);
        if (playlistController.sortPlaylist)
            playlistController.toggleSortablePlaylist(true);

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
    }, 2000)

    var style = $('<style id="inputclearhide">' +
        '.ui-input-clear {' +
        ' display:none!important;' +
        '}' +
        '</style>');
    $('html > head').append(style);

    $('video').bind('contextmenu', function (e) {
        //return false;
    });





    //On Window Resize
    $(window).resize(function () {

        //$(".ui-popup:visible").popup("close")


        if ($('.ui-panel-open').length != 0) {
            $('#rightpanel').panel('close');
        }
        if (playlistController.sortPlaylist)
            playlistController.toggleSortablePlaylist();

         uiController.updateUI();

        //Resize Songlists/ reset indicator
        setTimeout(function () {
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

    if( videoController.fullscreenMode == 0&&$(window).width()>=uiController.responsiveWidthSmallest)
        uiController.windowWidth = $(window).width()- uiController.adsWidth;

    else
        uiController.windowWidth = $(window).width();


    $("#page").width(uiController.windowWidth);

    $("#header").width($(window).width());
    $("#videocontrols").width(uiController.windowWidth);

}


/**
 * Update UI
 */
uiController.updateUI = function () {
    uiController.updateDisplay();

    //Additional Control Buttons
    uiController.countCustomButtons = $(".videoControlElements-custom-button:visible").length;

    $(".sideinfo").css("line-height",($(window).height()-5-44)+"px");


    $("#lyricsifrm").css("height",$(window).height()-8-44-44-44)

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
    if ($(window).width() < uiController.responsiveWidthSmallest) {

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
            if ($(window).width() < uiController.responsiveWidthSmaller && $(window).width() > uiController.responsiveWidthSmall) {
                $("#playlist").css("max-height", $(window).height() - 110 - 44);
                $("#playlistInner").css("max-height", $(window).height() - 110 - 100 - topDifference);

            } else {
                $("#playlist").css("max-height", $(window).height() - 50 - 44);
                $("#playlistInner").css("max-height", $(window).height() - 50 - 100 - topDifference);

            }
        }, 100)



        $("#searchlist").css("max-height", $(window).height() - 44 - 120 + 6);

        var setSelectSize = function () {
            $("#playlistselectvertical .chosen-container").css("width", $("#playlist").width() - 45);
            $("#playlistselectvertical .chosen-container").css("max-width", $("#playlist").width() - 45);
            $("#saveplaylistinput").css("width", $("#playlist").width() - 45);
            $("#saveplaylistinput").css("max-width", $("#playlist").width() - 45);

            $("#playlistselectvertical input").css("width", 110);
            // $("#playlistselectvertical input").css("max-width", 50);
        }
        setSelectSize();
        $("#playlist").css("width", uiController.windowWidth / 3);

        $("#playlistInner li").css("width", uiController.windowWidth / 3);

        if($(window).width() < uiController.responsiveWidthSmall)
            $("#searchlist").css("width", uiController.windowWidth - uiController.windowWidth / 3 - 30-33);
        else
        $("#searchlist").css("width", uiController.windowWidth - uiController.windowWidth / 3 - 30);


        setSelectSize();


    }

    uiController.totalTimeWidth = uiController.windowWidth / 1.5 - 160 - 105 - 5;

    videoController.resizeVideo();


    //Small Size
    if ($(window).width() < uiController.responsiveWidthSmall) {

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

        $("#content").css({"width": uiController.windowWidth - 16, "height": $(window).height() - 44 - 4 - 8});


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


        $("#draggelement").remove();
        var style = $('<style id="draggelement">' +
            '.draggedlistelement li { ' +
            '        width: ' + $("#playlistInner ul li").width() + 'px !important;' +
            '        max-width: ' + $("#playlistInner ul li").width() + 'px !important;' +
            '        min-width: ' + $("#playlistInner ul li").width() + 'px !important;' +
            '}' +
            '.draggedlistelement li a { ' +
            '        width: ' + ($("#playlistInner ul li a").width()) + 'px !important;' +
            '        max-width: ' + $("#playlistInner ul li a").width() + 'px !important;' +
            '        min-width: ' + $("#playlistInner ul li a").width() + 'px !important;' +
            '}' +
            '</style>');
        $('html > head').append(style);

        $("#videocontrolsInner").css("opacity",0);
        var positionControls = function(){

            if (Math.abs($("#videocontrolsInner .videoControlElements-controls").css("padding-left").replace("px", "") - ( (uiController.windowWidth - $(".videoControlElements-controls").width() * 1.5) / 2 / 1.5)) > 1)
                $("#videocontrolsInner .videoControlElements-controls").css("padding-left", (uiController.windowWidth - $(".videoControlElements-controls").width() * 1.5) / 2 / 1.5).css("padding-right", (uiController.windowWidth - $(".videoControlElements-controls").width() * 1.5) / 2 / 1.5);


        }
        positionControls();
        setTimeout(positionControls,50)
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
uiController.showPlaylists = function () {
    $("#playlistselectvertical .search-field input").attr("placeholder", playlistController.selectPlaylistsPlaceholder)

    $('#playlistselectverticalform option').prop('selected', false);
    $('#playlistselectverticalform').trigger('chosen:updated');
    setTimeout(function () {
        $('#playlistselectverticalform').trigger('chosen:close');
    }, 0)
    setTimeout(function () {


        //Remove empty unnamed Playlists
        for (var playlist in playlistController.loadedPlaylists) {
            if (playlistController.loadedPlaylists.hasOwnProperty(playlist)) {
                if (!playlistController.loadedPlaylists[playlist].tracks || (playlistController.loadedPlaylists[playlist].tracks.length == 0 && playlistController.loadedPlaylists[playlist].isUnnamedPlaylist)) {
                    for (var j = playlistController.playlists.length - 1; j >= 0; j--) {
                        if (playlistController.playlists[j].gid == playlistController.loadedPlaylists[playlist].gid) {
                            playlistController.playlists.splice(i, 1);
                        }
                    }
                }
            }
        }

        playlistController.loadedPlaylists = {};
        playlistController.loadedPlaylistSongs = []

        playlistController.playlistMode = true;
        $("#clearChoosenPlaylists").hide();
        uiController.updateUI();
        playlistController.loadedPlaylistSongs = playlistController.playlists;

        $("#playlistInner .iScrollPlayIndicator").hide();
        $("#searchlist .iScrollPlayIndicator").hide();

        // $("#playlistview").hide();

        $("#playlistInner .songlist").addClass("hidden");

        $scope.safeApply();
        setTimeout(function () {
            uiController.updateUI();
            $("#playlistview").listview('refresh');
            $("#playlistInner .songlist").removeClass("hidden").removeClass("avoidhiding");

            //  $("#playlistview").show();
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
    if (uiController.gridLayout)
        $("#searchlayoutbutton img").attr("src", "public/img/list.png");
    else
        $("#searchlayoutbutton img").attr("src", "public/img/grid.png");
    setTimeout(function () {
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

            uiController.gridLayoutCols = Math.floor(($("#searchlist ul").width()-15) / 250);

            if(($("#searchlist ul").width()/uiController.gridLayoutCols-35)>250){
                $("#gridlayoutwidth").remove();
                var style = $('<style id="gridlayoutwidth">' +
                    '#searchlist ul.gridlayout li { width:' + (($("#searchlist ul").width()/uiController.gridLayoutCols-35)) +'px!important;} '+
                    '</style>');
                $('html > head').append(style);

            }


            scrollY = scrollY / uiController.gridLayoutCols;
            if (uiController.searchListScroll.toggelLayoutOldY != uiController.searchListScroll.y)
                scrollY = scrollY + 64;


        }
        else {

            scrollY = (scrollY) * uiController.gridLayoutCols;


            setTimeout(function () {
                playlistController.positionSongOptions();
            }, 0)
        }

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

        $("#searchlist").hide();
        $("#searchlist").css("opacity", "1");
        $("#searchlist").addClass("fadeincomplete");
        $("#searchlist").show();
        setTimeout(function () {
            $("#searchlist").removeClass("fadeincomplete");
        }, 500)

        uiController.searchListScroll.toggelLayoutOldY = scrollY;



    }, 800)
    }, 0);
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
