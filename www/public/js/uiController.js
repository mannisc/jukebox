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


uiController.responsiveWidthSmaller = 1115;

/**
 * Init Controller
 */
uiController.init = function () {

    uiController.playedFirst = false;
    $("#videoplayer").css("opacity", "0");


    // / Use Fastclicks
    //FastClick.attach(document.body);


    //On Window Resize
    $(window).resize(function () {
        if ($('.ui-panel-open').length != 0) {
            $('#rightpanel').panel('close');
        }
        if (uiController.sortPlaylist)
            uiController.toggleSortablePlaylist();
        uiController.updateUI();
    });


    MediaElementPlayer.prototype.enterFullScreen_org = MediaElementPlayer.prototype.enterFullScreen;
    MediaElementPlayer.prototype.enterFullScreen = function () {
        // Your code here
        $("#videocontrols .mejs-controls").appendTo("#videoplayer .mejs-inner");
        $("#videoplayer").css("-webkit-transform", "scale(1)");
        $("#videoplayer").css("transform", "scale(1)");
        $("#videoplayer").css("-webkit-transform-origin", "50% 50%");
        $("#videoplayer").css("transform-origin", "50% 50%");
        $("#videoplayer").css("opacity", "1");

        this.enterFullScreen_org();
        $("#videoplayer").css("text-align", "left");


    }
    MediaElementPlayer.prototype.exitFullScreen_org = MediaElementPlayer.prototype.exitFullScreen;
    MediaElementPlayer.prototype.exitFullScreen = function () {

        //uiController.translateVideo=0;
        $("#videoplayer").removeClass("animate")

        uiController.updateUI();

        var oSizeVideo = uiController.sizeVideo;
        uiController.sizeVideo = uiController.sizeVideo * 1.5;
        uiController.styleVideo();
        setTimeout(function () {
            uiController.sizeVideo = oSizeVideo
            $("#videoplayer").addClass("animate")
            uiController.styleVideo();

        }, 100)
        $("#videoplayer").css("text-align", "center")


        $("#videoplayer .mejs-controls").appendTo("#videocontrols");

        this.exitFullScreen_org();

    }
    MediaElementPlayer.prototype.extoptions = {scale: 1.5, displayBox: false};


    uiController.mediaElementPlayer = new MediaElementPlayer('video,audio', {
        features: ['playpause', 'current', 'progress', 'duration', 'volume', 'fullscreen'],
        //poster: 'http://mediaelementjs.com/media/echo-hereweare-540x304.jpg',
        alwaysShowControls: true,
        autosizeProgress: false,
        success: function (mediaElement, domObject) {

            mediaElement.addEventListener('playing', function (e) {
                uiController.playedFirst = true;
                uiController.updateUI();

            });
            mediaElement.addEventListener('ended', function (e) {
                uiController.playedFirst = false;
                uiController.updateUI();

            });


        }});


    var hammertime = Hammer($("#videoplayerInner").get(0)).on("swipeup", function (event) {
        uiController.swipeTimer = Date.now();

        if (uiController.sizeVideo < 4) {
            uiController.sizeVideo = uiController.sizeVideo * 1.5;
            uiController.styleVideo();

        }
    });
    var hammertime = Hammer($("#videoplayerInner").get(0)).on("swipedown", function (event) {

        uiController.swipeTimer = Date.now();

        if (uiController.sizeVideo > 0.5) {
            uiController.sizeVideo = uiController.sizeVideo / 1.5;
            uiController.styleVideo();

        }
    });

    var hammertime = Hammer($("#videoplayerInner").get(0)).on("swiperight", function (event) {
        uiController.swipeTimer = Date.now();

        if (uiController.translateVideo <= $(window).width() / 2) {
            uiController.translateVideo = uiController.translateVideo + $(window).width() / 8;
            uiController.styleVideo();
        }

    });
    var hammertime = Hammer($("#videoplayerInner").get(0)).on("swipeleft", function (event) {
        uiController.swipeTimer = Date.now();

        if (uiController.translateVideo >= -$(window).width() / 2) {

            uiController.translateVideo = uiController.translateVideo - $(window).width() / 8;
            uiController.styleVideo();
        }
    });

    /*OPTIONS: {
     // if the <video width> is not specified, this is the default
     defaultVideoWidth: 480,
     // if the <video height> is not specified, this is the default
     defaultVideoHeight: 270,
     // if set, overrides <video width>
     videoWidth: -1,
     // if set, overrides <video height>
     videoHeight: -1,
     // width of audio player
     audioWidth: 400,
     // height of audio player
     audioHeight: 30,
     // initial volume when the player starts
     startVolume: 0.8,
     // useful for <audio> player loops
     loop: false,
     // enables Flash and Silverlight to resize to content size
     enableAutosize: true,
     // the order of controls you want on the control bar (and other plugins below)
     features: ['playpause','progress','current','duration','tracks','volume','fullscreen'],
     // Hide controls when playing and mouse is not over the video
     alwaysShowControls: false,
     // force iPad's native controls
     iPadUseNativeControls: false,
     // force iPhone's native controls
     iPhoneUseNativeControls: false,
     // force Android's native controls
     AndroidUseNativeControls: false,
     // forces the hour marker (##:00:00)
     alwaysShowHours: false,
     // show framecount in timecode (##:00:00:00)
     showTimecodeFrameCount: false,
     // used when showTimecodeFrameCount is set to true
     framesPerSecond: 25,
     // turns keyboard support on and off for this instance
     enableKeyboard: true,
     // when this player starts, it will pause other players
     pauseOtherPlayers: true,
     // array of keyboard commands
     keyActions: []
     }*/


    $("#videoplayer .mejs-controls").css("background", "none");
    $("#videoplayer .mejs-controls").css("background", "none");
    $("#videocontrols").css("background", "none");

    $("#videoplayer .mejs-controls").appendTo("#videocontrols");

    $("#videoplayer").css("text-align", "center")


    uiController.sizeVideo = 1.2;
    uiController.translateVideo = 0;

    uiController.styleVideo();

    setTimeout(function () {
        $("#videoplayer").addClass("animate");
        uiController.sizeVideo = 1;
        uiController.translateVideo = 0;
        uiController.styleVideo();

    }, 500)


    uiController.searchListScroll = new IScroll('#searchlist', {
        zoom: true,
        scrollX: false,
        scrollY: true,
        mouseWheel: true,
        zoomMin: 0.2,
        zoomMax: 1,
        startZoom: 1,
        // wheelAction: 'zoom',
        scrollbars: true,
        noHorizontalZoom: true
    });


    uiController.playListScroll = new IScroll('#playlistInner', {
        zoom: true,
        scrollX: false,
        scrollY: true,
        mouseWheel: true,
        zoomMin: 0.2,
        zoomMax: 1,
        startZoom: 1,
        // shrinkScrollbars: "scale",
        // wheelAction: 'zoom',
        scrollbars: true,
        noHorizontalZoom: true
    });


    //Animate Sidde Panel Open Icon
    $("#rightpanel").on("panelbeforeclose", function (event, ui) {
        if (uiController.sortPlaylist)
            uiController.toggleSortablePlaylist();
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
        uiController.updateUI();
        $(".search-choice-close").click(function () {
            uiController.updateUI();
        })
    });


    $('.chosen-container input').blur(function () {
        setTimeout(uiController.updateUI, 100);
    });


    var oldMouseStart = $.ui.draggable.prototype._mouseStart;
    var oldMouseStartEventArray, oldMouseStartEventObject;
    $.ui.draggable.prototype._mouseStart = function (event, overrideHandle, noActivation) {
        console.log("STARTD")

        uiController.dragSongX = event.clientX;
        uiController.dragSongY = event.clientY;
        uiController.dragSongCheckScrolling = true;
        uiController.checkSwipeTimer = Date.now();
        uiController.stopDrag = false;
        oldMouseStartEventArray = [event, overrideHandle, noActivation]
    };

    var oldMouseDrag = $.ui.draggable.prototype._mouseDrag;
    $.ui.draggable.prototype._mouseDrag = function (event, overrideHandle, noActivation) {
        if (Math.abs(event.clientX - uiController.dragSongX) > 10|| Math.abs(event.clientX - uiController.dragSongX) > 10) {
            if (uiController.dragSongCheckScrolling) {
                uiController.dragSongCheckScrolling = false;
                console.log(Math.abs(event.clientX - uiController.dragSongX) + "   " + Math.abs(event.clientY - uiController.dragSongY))

                if (uiController.sidePanelOpen || $("#searchlistview").height() <= $("#searchlist").height() || Math.abs(event.clientY - uiController.dragSongY) < Math.abs(event.clientX - uiController.dragSongX)/2) {
                    this._trigger("beforeStart", event, this._uiHash());
                    oldMouseStart.apply(this, oldMouseStartEventArray);
                    console.log("!!!!!!!!!!!!!!")
                }
                else {
                    uiController.stopDrag = true;
                    //oldMouseStart.apply(this, oldMouseStartEventArray);
                    // this._mouseUp({});

                    if ($.ui.ddmanager) {
                        $.ui.ddmanager.dragStop(this, event);
                    }
                    $(document)
                        .unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
                        .unbind("mouseup." + this.widgetName, this._mouseUpDelegate);

                    if (this._mouseStarted) {
                        this._mouseStarted = false;

                        if (event.target === this._mouseDownEvent.target) {
                            $.data(event.target, this.widgetName + ".preventClickEvent", true);
                        }

                        // this._mouseStop(event);
                    }

                }


            }

            if (!uiController.stopDrag) {
                oldMouseDrag.apply(this, [event, overrideHandle, noActivation]);
            }

            if (uiController.checkSwipeTimer) {
                if (Math.abs(event.clientY - uiController.dragSongY) > 30) {
                    uiController.swipeTimer = Date.now();
                }

            }


        }
    }


    var oldMouseUp = $.ui.draggable.prototype._mouseUp;
    $.ui.draggable.prototype._mouseUp = function (event, overrideHandle, noActivation) {
        console.log("STOPED")

        if (!uiController.stopDrag) {
            console.log("??????????????")

            oldMouseUp.apply(this, [event, overrideHandle, noActivation]);
        }
    };


    /*
     var oldSMouseStart = $.ui.sortable.prototype._mouseStart;
     var oldSMouseStartEventArray, oldSMouseStartEventObject;
     $.ui.sortable.prototype._mouseStart = function (event, overrideHandle, noActivation) {
     console.log("START")
     oldSMouseStartEventObject = this;
     oldSMouseStartEventArray = [event, overrideHandle, noActivation];
     console.dir(event)
     if (uiController.draggingSong) {
     oldSMouseStart.apply(oldSMouseStartEventObject, oldSMouseStartEventArray);
     console.log("___________________________")
     } else {
     uiController.dragSongX = event.clientX;
     uiController.dragSongY = event.clientY;
     uiController.dragSongCheckSortableScrolling = true;
     uiController.checkSwipeTimer = Date.now();
     }
     };


     var oldSMouseMove = $.ui.sortable.prototype._mouseMove;
     $.ui.sortable.prototype._mouseMove = function (event, overrideHandle, noActivation) {
     console.log("MOVE")
     console.dir(event)

     if (uiController.dragSongCheckSortableScrolling) {
     uiController.dragSongCheckSortableScrolling = false;
     if (uiController.sidePanelOpen) {
     oldSMouseStartEventObject._trigger("beforeStart", oldSMouseStartEventArray[0], oldSMouseStartEventObject._uiHash());
     console.log("___________________________")
     oldSMouseStart.apply(oldSMouseStartEventObject, oldSMouseStartEventArray);
     } else {

     $.ui.sortable.prototype._mouseStarted = false;
     }
     }

     if (uiController.checkSwipeTimer) {
     if (Math.abs(event.clientY - uiController.dragSongY) > 30) {
     uiController.swipeTimer = Date.now();
     }

     }
     oldSMouseMove.apply(this, [event, overrideHandle, noActivation]);
     };


     var oldSMouseUp = $.ui.sortable.prototype._mouseUp;
     $.ui.sortable.prototype._mouseUp = function (event, overrideHandle, noActivation) {
     console.log("STOP");
     oldSMouseUp.apply(this, [event, overrideHandle, noActivation]);
     uiController.stopScrollingOnClick(event);

     };

     */
    uiController.makePlayListSortable();

    $(".sortable").sortable("disable");

    $("#sortplaylisttext").hide();


    uiController.updateUI();
    setTimeout(function () {
        uiController.updateUI();

        $("#playlist").hide();
        $("#playlist").css("opacity", "1");
        $("#playlist").fadeIn();
    }, 0);


};


uiController.makePlayListSortable = function () {

    $("#playlistview").sortable({
        tolerance: "pointer",
        dropOnEmpty: true,
        revert: true,
        opacity: 0.9,
        //  containment: "body",
        receive: function (event, ui) {

        },
        start: function (event, ui) {
            setTimeout(function () {
                //  debugger;
            }, 3000)
        },
        stop: function (event, ui) {
            do {
                var marquee = $("#playlistInner li marquee").get(0);
                $(marquee).replaceWith($(marquee).contents());
            } while (marquee)

            $(ui.item).css("opacity", "1");
            var newLoadedPlaylistSongs = []
            $("#playlistview").find("li").each(function (index) {
                if (!$(this).hasClass("playlistsong")) {
                    var id = this.dataset.songid.substring(10)
                    var draggedSong = searchController.searchResults[id];
                    draggedSong.id = playlistController.loadedPlaylistSongs.length;

                    playlistController.loadedPlaylistSongs.splice(index, 0, draggedSong);
                    $(this).remove();
                }
            })
            $("#playlistInner").removeClass("animate")
            $scope.safeApply();
            $("#playlistview").listview('refresh');
            $("#playlistInner").addClass("animate")

        },
        helper: function (event, $item) {
            var $helper = $('<ul></ul>').addClass('draggedlistelement');

                        var item = $item.clone();
            var ele = $helper.append($item.clone())


            var marquee = $(ele).find("marquee").get(0);
            $(marquee).replaceWith($(marquee).contents());

            return ele;
        },
        appendTo: 'body',
        zIndex: "1000000" //or greater than any other relative/absolute/fixed elements and droppables
    }).disableSelection();

}

uiController.makeSearchListDraggable = function () {

    $('#searchlistview .draggableSong').draggable({
        tolerance: "pointer",
        dropOnEmpty: true,
        revert: false,
        opacity: 0.9,
        //   containment: "body",
        connectToSortable: '#playlistview',
        helper: function (event, ui) {


            var $helper = $('<ul></ul>').addClass('draggedlistelement');
            var ele = $helper.append($(this).clone())
            $(this).css("opacity", "0.5")

            var marquee = $(ele).find("marquee").get(0);
            $(marquee).replaceWith($(marquee).contents());

            return ele;
        }, drag: function (event, ui) {
            return !uiController.stopDrag;
        },
        beforeStart: function () {
            if (!uiController.sortPlaylist) {
                uiController.toggleSortablePlaylist();
                uiController.startedSortPlaylist = true;
            }

        },
        start: function (event) {
            uiController.draggingSong = true;
            uiController.dragSongX = event.clientX;
            uiController.dragSongY = event.clientY;
            uiController.dragSongCheckHorizontal = true;
            uiController.dragSongCheckHorizontalTimer = Date.now();

        },
        stop: function (event, ui) {
            uiController.draggingSong = false;
            $(this).css("opacity", "1")
            if (uiController.startedSortPlaylist) {
                uiController.toggleSortablePlaylist();
                uiController.startedSortPlaylist = false;
            }

        },
        appendTo: 'body',
        zIndex: "1000000" //or greater than any other relative/absolute/fixed elements and droppables
    }).disableSelection();


}


uiController.styleVideo = function () {

    $("#videoplayer").css("-webkit-transform", "translate(" + uiController.translateVideo + "px,0px) scale(" + 0.5 * uiController.sizeVideo + ")");
    $("#videoplayer").css("transform", "translate(" + uiController.translateVideo + "px,0px) scale(" + 0.5 * uiController.sizeVideo + ")");
    $("#videoplayer").css("-webkit-transform-origin", "50% 100%");
    $("#videoplayer").css("transform-origin", "50% 100%");
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


uiController.toggleSavePlaylist = function () {
    uiController.savePlaylist = !uiController.savePlaylist;
    if (uiController.savePlaylist) {

        if (uiController.sortPlaylist) {
            uiController.toggleSortablePlaylist();
        }
        // $("#saveplaylistbtn").addClass("redbackground");
        $("#sortplaylistbtn").hide();
        $("#playlistselectvertical").hide();
        $("#saveplaylistinput").show();
        $("#saveokayplaylistbutton").show();


        $("#saveplaylistbtn img").attr("src", "public/img/crosswhite.png");


        $("#saveplaylistinpt").focus();

    } else {
        //  $("#saveplaylistbtn").removeClass("redbackground");
        $("#saveplaylistinput").hide();
        $("#saveokayplaylistbutton").hide();

        $("#sortplaylistbtn").show();

        $("#playlistselectvertical").show();
        $("#saveplaylistbtn img").attr("src", "public/img/save.png");

    }
}


uiController.toggleSortablePlaylist = function () {
    uiController.sortPlaylist = !uiController.sortPlaylist
    if (uiController.sortPlaylist) {


        $("#playlistselectvertical").addClass("fadeincompletefast");

        $("#playlistInner  .removesong").show();
        $("#playlistInner  .ui-btn-icon-right").css("margin-right", "0px");

        $("#playlistInner  .ui-btn-icon-right").css("padding-right", "40px");

        $("#sortplaylistbtn").addClass("redbackground");

        /*$("#playlist").css("overflow","visible");
         $("#playlistInner").css("overflow","visible");
         */

        //$(".sortable").disableSelection();
        uiController.playListScroll.disable();
        var style = $('<style id="playlistsortstyle">' +
            '#playlistInner ul li {' +
            'opacity:0.9!important;' +
            'margin-bottom:-1px;' +
            'border-bottom: 1px solid #fff;' +
            '}' +
            '</style>');
        $('html > head').append(style);

        $("#playlistInner .iScrollVerticalScrollbar").hide();
        $("#playlistselectvertical").hide();
        $("#sortplaylisttext").show();

        $(".sortable").sortable("enable");


    } else {

        setTimeout(function () {
            $("#playlistselectvertical").removeClass("fadeincompletefast");
        }, 500)


        $("#playlistInner  .removesong").hide();
        $("#playlistInner  .ui-btn-icon-right").css("padding-right", "");
        $("#playlistInner  .ui-btn-icon-right").css("margin-right", "");

        $("#sortplaylistbtn").removeClass("redbackground");

        $("#playlistInner .iScrollVerticalScrollbar").show();
        $("#playlistselectvertical").show();
        $("#sortplaylisttext").hide();

        $(".sortable").sortable("disable");
        $(".sortable").enableSelection();

        uiController.playListScroll.enable();
        $("#playlistsortstyle").remove();
    }


    setTimeout(uiController.updateUI, 0);
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

/**
 * Update UI
 */
uiController.updateUI = function () {

    if ($(window).width() < uiController.responsiveWidthSmall || $(window).height() < 350) {

        if ($("#videoplayer").css("opacity") != 0) {
            $("#videoplayer").css("opacity", "0");
        }
    } else {

        if ($("#videoplayer").css("opacity") != 1 && uiController.playedFirst) {
            $("#videoplayer").css("opacity", "1");
        }

    }


    $(".ui-panel").css("height", $(window).height() - 44 - 3);
    $("#page").css("height", $(window).height() - 44 - 3);

    $("#videoplayer").css("width", $(window).width());


    //Smallest Size
    if ($(window).width() < uiController.responsiveWidthSmallest) {


        $("#searchlist a").css("text-overflow", "clip");


        if ($("#playlist").parents("#rightpanel").length == 0)
            $("#playlist").appendTo("#rightpanel");


        $("#playlist").css("max-height", $(window).height() - 44 - 3);

        setTimeout(function () {
            if ($("#playlistselectvertical .chosen-container").height() > 0)
                $("#playlistInner").css("max-height", $(window).height() - 44 - 3 - (100 + $("#playlistselectvertical .chosen-container").height() - 30));
            else
                $("#playlistInner").css("max-height", $(window).height() - 44 - 3 - 5);
        }, 100)

        if (uiController.sidePanelOpen) {

            $("#searchlist").css("width", $(window).width() - $("#rightpanel").width() - 10);

            if ($(window).width() - $("#rightpanel").width() - 10 < 100) {
                $("#searchlist li a").wrap('<marquee behavior="alternate"></marquee>');
                $("#searchlist li").css("max-height", "44px");

            }


        }
        else {
            $("#searchlist").css("width", $(window).width() - 20);

            do {
                var marquee = $("#searchlist li marquee").get(0);
                $(marquee).replaceWith($(marquee).contents());
            } while (marquee)
        }


        $("#playlist").css("width", $("#rightpanel").width() - 20);

        $("#playlistInner li").css("width", $("#rightpanel").width() - 20);


        $("#playlistselectvertical .chosen-container").css("width", "");
        $("#playlistselectvertical .chosen-container").css("max-width", "");
        $("#sortplaylisttext").css("width", "");
        $("#sortplaylisttext").css("max-width", "");

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
                $("#playlist").css("max-height", $(window).height() - 44 - 110);
                $("#playlistInner").css("max-height", $(window).height() - 44 - 110 - 100 - topDifference);

            } else {
                $("#playlist").css("max-height", $(window).height() - 44 - 50);
                $("#playlistInner").css("max-height", $(window).height() - 44 - 50 - 100 - topDifference);

            }
        }, 100)


        $("#searchlist").css("max-height", $(window).height() - 44 - 120);

        var setSelectSize = function () {
            $("#searchlist").css("width", "");
            $("#playlistselectvertical .chosen-container").css("width", $("#playlist").width() - 50 - 40);
            $("#playlistselectvertical .chosen-container").css("max-width", $("#playlist").width() - 50 - 40);
            $("#sortplaylisttext").css("width", $("#playlist").width() - 50 - 40 - 10);
            $("#sortplaylisttext").css("max-width", $("#playlist").width() - 50 - 40 - 10);
            $("#saveplaylistinput").css("width", $("#playlist").width() - 50 - 40);
            $("#saveplaylistinput").css("max-width", $("#playlist").width() - 50 - 40);

            $("#playlistselectvertical input").css("width", 110);
            // $("#playlistselectvertical input").css("max-width", 50);
        }
        setSelectSize();
        $("#playlist").css("width", $(window).width() / 4);
        $("#playlistInner li").css("width", $(window).width() / 4);

        setSelectSize();


    }


    //Small Size
    if ($(window).width() < uiController.responsiveWidthSmall) {

        $("#videoplayer .mejs-time-total").css("width", $(window).width() / 1.5 - 160);
        $("#videoplayer .mejs-time-rail").css("width", $(window).width() / 1.5 - 160 + 10);
        $("#videocontrols .mejs-time-total").css("width", ($(window).width() / 1.5 - 160));


        if (($(window).width() / 1.5 - 160) + 10 < 323)
            $("#videocontrols .mejs-time-rail").css("width", ($(window).width() / 1.5 - 160) + 10);
        else
            $("#videocontrols .mejs-time-rail").css("width", 323);


        $("#searchlist").css("max-height", $(window).height() - 44 - 130 - 40);

        $("#content").css({"width": $(window).width() - 16, "height": $(window).height() - 44 - 4 - 8 - 6});


    }
    //Big Size
    else {

        do {
            var marquee = $("#searchlist li marquee").get(0);
            $(marquee).replaceWith($(marquee).contents());
        } while (marquee)

        $("#videoplayer .mejs-time-total").css("width", $(window).width() / 1.5 - 160);
        $("#videoplayer .mejs-time-rail").css("width", $(window).width() / 1.5 - 160 + 10);
        $("#videocontrols .mejs-time-total").css("width", ($(window).width() / 1.5 - 160) / 1.3);
        $("#videocontrols .mejs-time-rail").css("width", ($(window).width() / 1.5 - 160) / 1.3 + 10);


        $("#content").css({"width": $(window).width() - 32, "height": $(window).height() - 44 - 4 - 32 - 6});

    }

    if ($(window).width() < 365) {

        $("#controlbar .ui-input-search").css("max-width", $(window).width() - 65);
        $("#controlbar .ui-select").css("max-width", $(window).width() - 25);


    } else {
        $("#controlbar .ui-input-search").css("max-width", 300);
        $("#controlbar .ui-select").css("max-width", 340);

    }

    // alert($("#playlistselectvertical .chosen-container").height() )
    setTimeout(function () {
        if ($("#playlistselectvertical .chosen-container").height() > 0)
            $("#playlistInner").css("top", 90 + $("#playlistselectvertical .chosen-container").height() - 30);
        else
            $("#playlistInner").css("top", 90 + 5);

    }, 100)

    setTimeout(function () {
        uiController.mediaElementPlayer.setControlsSize();
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


