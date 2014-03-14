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


uiController.responsiveWidthSmaller = 1080;

uiController.fullscreenMode = 0;


/**
 * Init Controller
 *
 */

uiController.initMediaPlayer = function () {
    $("#videoplayer").css("opacity", "0");
    $("#videoplayer").css("pointer-events","none");


    setTimeout(function () {

        $("#videocontrolsInner").hide();
        $("#videocontrolsInner").css("opacity", "1");
        $("#videocontrolsInner").addClass("fadeincomplete");

        $("#videocontrolsInner").show();


        $(".iScrollIndicator").addClass("fadeincomplete")


    }, 0);
    MediaElementPlayer.prototype.enterFullScreen_org = MediaElementPlayer.prototype.enterFullScreen;
    MediaElementPlayer.prototype.enterFullScreen = function () {
        // Your code here
        $(".mejs-overlay-resize").hide();

        $("#videocontrols .mejs-controls").appendTo("#videoplayer .mejs-inner");
        //   $("#videoplayer .mejs-controls").css("background", "none");

        $("#videoplayer").css("-webkit-transform", "scale(1)");
        $("#videoplayer").css("transform", "scale(1)");
        $("#videoplayer").css("-webkit-transform-origin", "50% 50%");
        $("#videoplayer").css("transform-origin", "50% 50%");
        $("#videoplayer").css("opacity", "1");
        $("#videoplayer").css("pointer-events","auto");


        this.enterFullScreen_org();
        $("#videoplayer").css("text-align", "left");


    }
    MediaElementPlayer.prototype.exitFullScreen_org = MediaElementPlayer.prototype.exitFullScreen;
    MediaElementPlayer.prototype.exitFullScreen = function () {
        //  $("#videoplayer .mejs-controls").css("background", "");

        var setHeight = function () {
            var height = $("video").outerHeight();  //
            console.log("Height: " + height);
            if (height > 0) {
                uiController.sizeVideoRelative = 400 / height;
                uiController.styleVideo();

            } else
                setTimeout(setHeight, 50);
        }
        setTimeout(setHeight, 50);


        $(".mejs-overlay-resize").show();

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


        $("#videoplayer .mejs-controls").appendTo("#videocontrolsInner");


        if(!playlistController.loadingSong) {
            $("#videoplayer").css("opacity","0");
            $("#videoplayer").css("pointer-events","none");

        }


        this.exitFullScreen_org();

    }
    MediaElementPlayer.prototype.extoptions = {scale: 1.5, displayBox: false};


    uiController.mediaElementPlayer = new MediaElementPlayer('video', {
        features: [ 'prevtrack', 'playpause', 'stop', 'nexttrack', 'shuffle', 'current', 'progress', 'duration', 'volume', 'fullscreen'],

        enableKeyboard: false,
        //poster: 'http://mediaelementjs.com/media/echo-hereweare-540x304.jpg',
        alwaysShowControls: true,
        autosizeProgress: false,

        success: function (mediaElement, domObject) {
            var resizeLayer = $(".mejs-overlay-play").clone();
            resizeLayer.removeClass("mejs-overlay-play").addClass("mejs-overlay-resize");
            resizeLayer.insertAfter(".mejs-overlay-play");
            $(".mejs-overlay-play").remove();

            $("#siteLogo").appendTo(resizeLayer)


            $('.mejs-fullscreen-button').clone().insertAfter('.mejs-fullscreen-button');
            $($('.mejs-fullscreen-button').get(0)).hide();
            $($('.mejs-fullscreen-button').get(1)).off() .click(function(){
                if(playlistController.isPlaying)
                  var isPlaying = true;
                else
                    isPlaying =false;

                uiController.fullscreenMode = uiController.fullscreenMode+1;
                if(uiController.fullscreenMode>2)
                    uiController.fullscreenMode = 0;


                if(uiController.fullscreenMode==1){ //Background
                   $("#videoplayer video").addClass("backgroundVideo").insertAfter("#backgroundImage");
                    $("#videoplayer").hide();
                    if(playlistController.loadingSong)
                     $("#backgroundImage").css("opacity","0.08");






                }else  if(uiController.fullscreenMode==2){
                    $("#backgroundImage").css("opacity","1");
                    $("#videoplayer").show();

                    $(".backgroundVideo").removeClass("backgroundVideo").appendTo(".mejs-mediaelement");

                    $($('.mejs-fullscreen-button').get(0)).click();
                } else  if(uiController.fullscreenMode==0){
                    $($('.mejs-fullscreen-button').get(0)).click();

                }
                if(isPlaying)
                    mediaElement.play();



            });

            $($('.mejs-fullscreen-button').get(1)).click();


            $(".mejs-custom-button").appendTo(".mejs-controls");
            uiController.countCustomButtons = $(".mejs-custom-button").length;


            playlistController.disablePlayStopControls(true);
            playlistController.disableControls(true);

            uiController.noVideoClickTimer = 0;
            $(".mejs-overlay-resize").click(function () {

                setTimeout(function () {
                    if (Date.now() - uiController.noVideoClickTimer > 600) {
                        $(".mejs-playpause-button").click();
                    }

                }, 500)


            })


            $(".mejs-overlay-resize").dblclick(function () {
                uiController.noVideoClickTimer = Date.now();

                if (!uiController.isMaxVideoSizeFaktor(uiController.sizeVideo))
                    uiController.sizeVideo = uiController.sizeVideo * 1.5;
                else
                    uiController.sizeVideo = 1 / 1.5;


                uiController.styleVideo();


            })


            $(".mejs-playpause-button").click(function () {
                playlistController.playButtonTimer = Date.now();
                console.dir($(this).children().context.className);
                if ($(this).children().context.className == "mejs-button mejs-playpause-button mejs-play")
                    embedPlayer.play();
                else
                    embedPlayer.pause();

            });


            $(".mejs-nexttrack-button").click(function () {
                if ($(this).find("button").css("opacity") == 1)
                    playlistController.playNextSong();
            })

            $(".mejs-prevtrack-button").click(function () {
                if ($(this).find("button").css("opacity") == 1)
                    playlistController.playPrevSong();
            })

            $(".mejs-shuffle-button").click(function () {
                playlistController.toggleShuffleSongs();
            })


            $(".mejs-stop-button").click(function () {
                playlistController.isPlaying = false;
                $(".songlist li.loadedsong").removeClass("pausing");
                $($(".songlist li.loadedsong").get(0)).addClass("playing");

                if ($(this).find("button").css("opacity") == 1) {
                    $(".mejs-stop-button button").css("opacity", "0.5");
                    $("#videoplayer").css("opacity", "0");
                    $("#videoplayer").css("pointer-events","none");

                    $(".mejs-playpause-button button").removeClass("looped");
                    $(".mejs-time-loaded").hide();
                    if (!playlistController.loadingOldSong) {
                        playlistController.resetPlayingSong();

                    }

                }
            })

            mediaElement.addEventListener("volumechange", function (e) {
                embedPlayer.setVolume(uiController.mediaElementPlayer.media.volume);
            });


            mediaElement.addEventListener('pause', function (e) {
                if (playlistController.isPlaying && !playlistController.isLoading) {
                    $($(".songlist li.loadedsong").get(0)).addClass("pausing");
                    $(".songlist li.loadedsong").removeClass("playing");

                }
                playlistController.isPlaying=false;

            });

            mediaElement.addEventListener('playing', function (e) {
                helperFunctions.clearBackground(".songlist li.loadedsong.stillloading #loadingSongImg");

                $($(".songlist li.loadedsong").get(0)).addClass("playing");
                $(".songlist li.loadedsong").removeClass("pausing");

                playlistController.isLoading = false;
                playlistController.isPlaying = true;
                playlistController.disablePlayStopControls(false);

                $(".mejs-time-loaded").show();

                $(".mejs-playpause-button button").removeClass("looped");

                if(!playlistController.loadingSong.isAudioFile){
                if ($("#videoplayer").css("opacity") < 1) {
                    var translateVideo = uiController.translateVideo;
                    $("#videoplayer").removeClass("animate");
                    // $("#videoplayer").css("opacity", "0");
                    //  $("#videoplayer").css("pointer-events","none");
                    uiController.translateVideo = uiController.translateVideo - 30;
                    uiController.styleVideo();
                    setTimeout(function () {
                        uiController.translateVideo = translateVideo;
                        $("#videoplayer").addClass("animate");
                        setTimeout(function () {
                            setTimeout(function () {
                                if (playlistController.isPlaying){
                                    $("#videoplayer").css("opacity", "1");
                                    $("#videoplayer").css("pointer-events","auto");

                                }
                            }, 200)
                            uiController.styleVideo();
                        }, 100)
                    }, 100)
                }

                    uiController.playedFirst = true;
                    uiController.updateUI(true);
                }
            });
            mediaElement.addEventListener("ended", function (e) {
                mediaController.sendRating("2");
                document.title = $scope.appTitle;

                playlistController.isPlaying = false;
                playlistController.disableStopControl(true);
                $("#videoplayer").css("opacity", "0");
                $("#videoplayer").css("pointer-events","none");

                $(".mejs-time-loaded").hide();

                $(".mejs-playpause-button button").addClass("looped");
                uiController.playedFirst = false;
                uiController.updateUI();

                if (!playlistController.isLoading)
                    playlistController.playNextSong();


            });


            mediaElement.addEventListener("error", function (e) {
                if (mediaController.currentvideoURL) {
                    mediaController.playNextVersion();
                }
            });

            mediaElement.addEventListener('loadeddata', function (e) {

                if(!playlistController.loadingSong.isAudioFile){
                    if (this.videoWidth > 0) {
                        var setHeight = function () {
                            var height = $("video").outerHeight();//.mejs-mediaelement
                            console.log("Height: " + height);
                            if (height > 0) {
                                uiController.sizeVideoRelative = 400 / height;
                                uiController.styleVideo();

                            } else
                                setTimeout(setHeight, 50);
                        }
                        setHeight();
                    } else {
                        uiController.sizeVideoRelative = 0;
                        uiController.styleVideo();

                    }
                }


            });
        },
        error: function () {
            alert("ERROR CREATE <VIDEO>");
        }


    });


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
            $("#videoplayer").css("pointer-events","none");


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


    $("#videocontrols").css("background", "none");

    $("#videoplayer .mejs-controls").appendTo("#videocontrolsInner");


    $("#videoplayer").css("text-align", "center")

    uiController.sizeVideoRelative = 1;
    uiController.sizeVideo = 1.2;
    uiController.translateVideo = 0;

    uiController.styleVideo();

    setTimeout(function () {
        $("#videoplayer").addClass("animate");
        uiController.sizeVideo = 1;
        uiController.translateVideo = 0;
        uiController.styleVideo();

    }, 500)
}

uiController.init = function () {

    if (playlistController.loadedPlaylistSongs.length == 0) {
        $("#saveplaylistbtn img").attr("src", "public/img/save.png");
    } else
        $("#saveplaylistbtn img").attr("src", "public/img/plus.png");









    $('#saveplaylistinpt').keyup(function (evt) {
        if (evt.keyCode == 13) {
            $("#saveokayplaylistbtn").click();
            return false;
        }
    });

    $(".ui-input-clear").addClass("ui-btn ui-btn-b ui-shadow ui-corner-all ui-mini");


    $(document).keyup(function (evt) {
        if (evt.keyCode == 32) {
            $(".mejs-playpause-button").click();
        } else if (evt.keyCode == 38 || evt.keyCode == 37) {
            $(".mejs-prevtrack-button").click();
        } else if (evt.keyCode == 40 || evt.keyCode == 39) {
            $(".mejs-nexttrack-button").click();
        }
    })

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

    uiController.initMediaPlayer();

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
        }
    })

    setTimeout(function () {
        $("#titleHeader").addClass("fadeincomplete");
        $("#titleHeader").show();
        $("#iconHeader").addClass("bounce");
    }, 0);
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
        if (uiController.sortPlaylist)
            uiController.toggleSortablePlaylist();
        uiController.updateUI();
    });


    uiController.searchListScroll = new IScroll('#searchlist', {
        interactiveScrollbars: true,
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

    // uiController.searchListScroll.on("scrollStart",function(){
    //})


    uiController.playListScroll = new IScroll('#playlistInner', {
        interactiveScrollbars: true,

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


        $('#playlistselectvertical .search-choice').each(function () {
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
                if (playlistController.playlists[i].name == name)
                    playlistgid = playlistController.playlists[i].gid
            }
            if (playlistgid != null) {

                for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
                    if (playlistController.loadedPlaylistSongs[i].playlistgid == playlistgid) {
                        playlistController.loadedPlaylistSongs.splice(i, 1);
                        i--;
                    }
                }

                if (playlistController.loadedPlaylistSongs.length == 0 && $('#playlistselectverticalform option:selected').length == 0) {
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
                    uiController.makePlayListSortable();
                    setTimeout(function(){
                        uiController.playListScroll.refresh();
                    },150)
                }, 0)

            }


            uiController.updateUI();
        }
        $('.search-choice-close').unbind('click', closefunc);
        $(".search-choice-close").click(closefunc)


    });

    $('#clearChoosenPlaylists').click(function (e) {

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
                uiController.makePlayListSortable();
                setTimeout(function(){
                    uiController.playListScroll.refresh();
                },150)
            }, 0)

        }, 10)


    });

    $('.chosen-container input').blur(function () {
        setTimeout(uiController.updateUI, 100);
    });


    uiController.makePlayListSortable();

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

    var playIndicator = $('<div class="iScrollPlayIndicator" ' +
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

    playIndicator.click(function(){
        uiController.searchListScroll.scrollToElement(".loadedsong");
    });


    playIndicatorPlalist.appendTo("#playlistInner .iScrollVerticalScrollbar");
    playIndicatorPlalist.click(function(){
        uiController.playListScroll.scrollToElement(".loadedsong");
    });


    setTimeout(function () {
        $("#inputclearhide").remove();
    }, 1000);

    document.tite = $scope.appTitle;

};


uiController.styleTopButtons = function () {
    if (!accountController.loggedIn) {
        $("#playingSongInfoLink").css("right", "2px");
        $("#buySongLink").css("right", "2px");
    } else {

        $("#playingSongInfoLink").css("right", "2px");
        $("#buySongLink").css("right", "2px");
    }

}


uiController.makePlayListSortable = function () {
    if (app.isCordova)
        return;
    $("#playlistInner li").on("mousedown",function (event) {
        console.log("MDOWN");
        if (!uiController.playlistMouseDown) {
            uiController.playlistMouseDown = true;

            var that = this;
            if (!uiController.sortPlaylist) {

                uiController.dragSortableSongY = event.clientY;
                var $this = $(this);
                $(this).data("checkdown", setTimeout(function () {
                    uiController.playlistMouseDown = false;
                    // Add your code to run
                    uiController.stopPlaylistScrollingOnClick(event);
                    setTimeout(function () {
                        if (!uiController.sortPlaylist) {
                            console.log("DRAGGGGIT!")

                            uiController.toggleSortablePlaylist(true);

                            var dragHandle = $(that);

                            var coords = {
                                clientX: event.clientX,
                                clientY: event.clientY
                            };

                            // this actually triggers the drag start event
                            uiController.startedSortPlaylist = true;
                            dragHandle.simulate("mousedown", coords);
                        }
                    }, 100)
                }, 350));
            }
        }
    }).on("mouseup",function (event) {
            console.log("MUP");


            if (Math.abs(event.clientY - uiController.dragSortableSongY) > 30) {
                uiController.swipeTimer = Date.now();
            }

            uiController.playlistMouseDown = false;

            clearTimeout($(this).data("checkdown"));
            $(this).data("checkdown", null);

        }).on("mouseout",function (event) {
            console.log("MOUT");

            if (uiController.dragSortableSongY > 0 && Math.abs(event.clientY - uiController.dragSortableSongY) > 30)
                uiController.swipeTimer = Date.now();

            uiController.playlistMouseDown = false;

            clearTimeout($(this).data("checkdown"));
            $(this).data("checkdown", null);

        }).on("mousemove", function (event) {
            // console.log("MOVE " + Math.abs(event.clientY - uiController.dragSortableSongY))
            if (Math.abs(event.clientY - uiController.dragSortableSongY) > 8) {
                console.log("MMOVE");

                if ($(this).data("checkdown")) {
                    clearTimeout($(this).data("checkdown"));
                }
            }

            if (uiController.dragSortableSongY > 0 && Math.abs(event.clientY - uiController.dragSortableSongY) > 30)
                uiController.swipeTimer = Date.now();


        })


    $("#playlistview").sortable({
        tolerance: "pointer",
        dropOnEmpty: true,
        revert: true,
        opacity: 0.9,
        //  containment: "body",
        receive: function (event, ui) {

        },
        start: function (event, ui) {
            uiController.draggingSortableSong = true;
            $("#playlistInner").removeClass("animate");

            $("#playlistInner li").removeClass("fadeslideincompletefast");

            setTimeout(function () {
                //debugger;
            }, 3000)

            $(".draggedsortablelistelement").on('mousemove', function (event) {
                if (uiController.draggingSortableSong) {

                    //console.log('X:' + (event.clientX-110) + ' Y: '+(event.clientY-30) );

                    if ($("#playlistInner").offset().top - $(".draggedsortablelistelement").offset().top > 10 && Math.abs($("#playlistInner").offset().left - $(".draggedsortablelistelement").offset().left) < 50) {
                        if (!uiController.playListScrollTimer || Date.now() - uiController.playListScrollTimer > 500) {
                            console.log(uiController.playListScroll.scrollY)
                            uiController.playListScrollTimer = Date.now()
                            uiController.playListScroll.enable();
                            uiController.playListScroll.refresh();
                            uiController.playListScroll.scrollBy(0, 100, 1000)
                        }

                    } else if ($("#playlistInner").offset().top + $("#playlistInner").height() - $(".draggedsortablelistelement").offset().top - $(".draggedsortablelistelement").height() < -10 && Math.abs($("#playlistInner").offset().left - $(".draggedsortablelistelement").offset().left) < 50) {
                        if (!uiController.playListScrollTimer || Date.now() - uiController.playListScrollTimer > 500) {
                            console.log(uiController.playListScroll.scrollY)
                            uiController.playListScrollTimer = Date.now()
                            uiController.playListScroll.enable();
                            uiController.playListScroll.refresh();
                            uiController.playListScroll.scrollBy(0, -100, 1000)
                        }

                    }

                }
            });
        },
        stop: function (event, ui) {
            $("#playlistInner li").removeClass("fadeslideincompletefast");

            if (uiController.startedSortPlaylist) {
                uiController.toggleSortablePlaylist();
                uiController.startedSortPlaylist = false;

            }

            if (uiController.startedSortPlaylist)
                uiController.playListScroll.disable();


            uiController.draggingSortableSong = false;
            /*do {
             var marquee = $("#playlistInner li marquee").get(0);
             $(marquee).replaceWith($(marquee).contents());
             } while (marquee)*/

            $(ui.item).css("opacity", "1");

            if ( uiController.draggedElements) {
                ui.item.replaceWith( uiController.draggedElements);
                uiController.draggedElements = null;
            }




            console.dir("!!!!!")
            console.dir(ui.item)
            var newLoadedPlaylistSongs = [];


            $("#playlistview").find("li").each(function (index) {
                $(this).removeClass("fadeslideincompletefast");

                if ($(this).hasClass("playlistsong")) {
                    id = this.dataset.songid.substring(12);
                    actSong = playlistController.loadedPlaylistSongs[parseInt(id.substring(5))];
                    actSong = jQuery.extend(true, {}, actSong);

                } else {
                    var id = this.dataset.songid.substring(10);
                    var actSong = searchController.searchResults[parseInt(id.substring(5))];
                    actSong = jQuery.extend(true, {}, actSong);

                    //  alert(index)
                    $(this).remove();
                    actSong.gid = "plsgid" + playlistController.globalId;
                    playlistController.globalId = playlistController.globalId + 1;
                }
                console.log(id + "  " + id.substring(5) + "    " + this.dataset.songid)
                actSong.id = "plsid" + helperFunctions.padZeros(index, ("" + playlistController.loadedPlaylistSongs.length).length);

                newLoadedPlaylistSongs.push(actSong);
            })

            playlistController.loadedPlaylistSongs = newLoadedPlaylistSongs;

            if (playlistController.loadedPlaylistSongs.length > 0)
                $("#clearChoosenPlaylists").show();


            console.log("DROPPED------------------------------")
            console.log($("#playlistview").get(0))
            console.log("------------------------------")
            console.dir(playlistController.loadedPlaylistSongs)
            console.log("------------------------------")

            $scope.safeApply();

            console.log($("#playlistview").get(0))
            console.log("------------------------------")

            $("#playlistview").listview('refresh');

            $("#playlistInner li").removeClass("fadeslideincompletefast");
            uiController.makePlayListSortable();

            setTimeout(function(){
                playlistController.remarkSong();
                uiController.playListScroll.refresh();
            },150)

            if ($('#playlistselectvertical .search-choice').length == 1) {
                setTimeout(function () {
                    uiController.savePlaylistVisible(true);

                }, 250)
            }

        },
        helper: function (event, $item) {
            var $helper = $('<ul class="songlist"></ul>').addClass('draggedlistelement draggedsortablelistelement');

            var item = $item.clone();
            var ele = $helper.append($item.clone())


            //var marquee = $(ele).find("marquee").get(0);
            //$(marquee).replaceWith($(marquee).contents());

            return ele;
        },
        appendTo: 'body',
        zIndex: "1000000" //or greater than any other relative/absolute/fixed elements and droppables
    }).disableSelection();

}

uiController.makeSearchListDraggable = function () {

    $("#searchlist li").on("mousedown",function (event) {
        console.log("DOWN")
        uiController.dragDraggableSongX = event.clientX;
        uiController.dragDraggableSongY = event.clientY;
        uiController.dragDraggableSongTimer = Date.now();
        uiController.dragDraggableSongStartEvent = event;
    }).on("mouseout",function (event) {
            uiController.dragDraggableSongY = -10;
        }).on("mouseup ",function (event) {
            console.log("UP")
            if (Math.abs(event.clientY - uiController.dragDraggableSongY) > 8) {
                if (Math.abs(event.clientY - uiController.dragDraggableSongY) > 30) {
                    uiController.swipeTimer = Date.now();
                }
            }
            uiController.dragDraggableSongY = -10;

        }).on("mousemove", function (event) {
            if (Math.abs(event.clientY - uiController.dragDraggableSongY) > 8)
                uiController.dragDraggableSongY = -10;
            if (uiController.dragDraggableSongY > 0 && Math.abs(event.clientY - uiController.dragDraggableSongY) > 30) {
                uiController.swipeTimer = Date.now();
            } else if (uiController.dragDraggableSongTimer && Date.now() - uiController.dragDraggableSongTimer < 500) {

                if (event.clientX - uiController.dragDraggableSongX > 2 && Math.abs(event.clientY - uiController.dragDraggableSongY) < Math.abs(event.clientX - uiController.dragDraggableSongX) * 0.8) {
                    console.log("DRAGNDROP    " + (event.clientX - uiController.dragDraggableSongX))

                    if (playlistController.loadedPlaylistSongs.length > 0 && playlistController.loadedPlaylistSongs[0].isPlaylist) {
                        $("#saveplaylistinpt").val("");
                        $("#saveokayplaylistbtn").attr("disabled", "disabled").css("opacity", "0.5");
                        playlistController.loadedPlaylistSongs = [];
                        $("#saveplaylistbtn img").attr("src", "public/img/save.png");
                        $scope.safeApply();
                        $("#clearChoosenPlaylists").show();
                    }

                    $("#searchlistview .draggableSong").draggable("enable");


                    if (!uiController.sidePanelOpen && uiController.windowWidth < uiController.responsiveWidthSmallest)
                        uiController.toggleSidePanel();
                    var that = this;
                    setTimeout(function () {
                        if (!uiController.sortPlaylist) {
                            uiController.toggleSortablePlaylist(true);
                            uiController.startedSortPlaylist = true;
                        }
                        var coords = {
                            clientX: uiController.dragDraggableSongStartEvent.clientX,
                            clientY: uiController.dragDraggableSongStartEvent.clientY
                        };
                        $(that).simulate("mousedown", coords);

                    }, 0)


                }

            }

        })


    if (app.isCordova)
        return;


    $('#searchlistview .draggableSong').draggable({
        tolerance: "pointer",
        dropOnEmpty: true,
        revert: false,
        opacity: 0.9,
        //   containment: "body",
        connectToSortable: '#playlistview',

        helper: function (event, ui) {


            var $helper = $('<ul class="songlist"></ul>').addClass('draggedlistelement draggedsearchlistelement');


            var elements = $("#searchlist li.selected").removeClass("selected").clone(true,true).removeClass("loadedsong playing pausing stillLoading");

            if(elements.length==0)
               elements = $(this).removeClass("selected").clone().removeClass("loadedsong playing pausing stillLoading");

            var ele = $helper.append(elements)

            uiController.draggedElements = elements;

            $(this).css("opacity", "0.5")

            //var marquee = $(ele).find("marquee").get(0);
            // $(marquee).replaceWith($(marquee).contents());

            return ele;
        }, drag: function (event, ui) {
            return !uiController.stopDrag;
        },
        start: function (event) {
            setTimeout(function () {
                //debugger;
            }, 3000)
            uiController.draggingSong = true;
            uiController.dragSongX = event.clientX;
            uiController.dragSongY = event.clientY;
            uiController.dragSongCheckHorizontal = true;
            uiController.dragSongCheckHorizontalTimer = Date.now();


            $(".draggedsearchlistelement").on('mousemove', function (event) {
                if (uiController.draggingSong) {

                    //console.log('X:' + (event.clientX-110) + ' Y: '+(event.clientY-30) );

                    if ($("#playlistInner").offset().top - $(".draggedsearchlistelement").offset().top > 10 && Math.abs($("#playlistInner").offset().left - $(".draggedsearchlistelement").offset().left) < 50) {
                        if (!uiController.playListScrollTimer || Date.now() - uiController.playListScrollTimer > 500) {
                            console.log(uiController.playListScroll.scrollY)
                            uiController.playListScrollTimer = Date.now()
                            uiController.playListScroll.enable();
                            uiController.playListScroll.refresh();
                            uiController.playListScroll.scrollBy(0, 100, 1000)

                        }

                    } else if ($("#playlistInner").offset().top + $("#playlistInner").height() - $(".draggedsearchlistelement").offset().top - $(".draggedsearchlistelement").height() < -10 && Math.abs($("#playlistInner").offset().left - $(".draggedsearchlistelement").offset().left) < 50) {
                        if (!uiController.playListScrollTimer || Date.now() - uiController.playListScrollTimer > 500) {
                            console.log(uiController.playListScroll.scrollY)
                            uiController.playListScrollTimer = Date.now()
                            uiController.playListScroll.enable();
                            uiController.playListScroll.refresh();
                            uiController.playListScroll.scrollBy(0, -100, 1000)
                        }

                    }

                }
            });



        },
        stop: function (event, ui) {
            $("#searchlistview .draggableSong").draggable("disable").removeClass("ui-disabled ui-state-disabled");
            uiController.draggingSong = false;
            $(this).css("opacity", "1")
            if (uiController.startedSortPlaylist) {
                uiController.toggleSortablePlaylist();
                uiController.startedSortPlaylist = false;
            }


        },
        appendTo: 'body',
        zIndex: "1000000" //or greater than any other relative/absolute/fixed elements and droppables
    });

    $("#searchlistview .draggableSong").draggable("disable").removeClass("ui-disabled ui-state-disabled");

}


uiController.isMaxVideoSizeFaktor = function (sizeVideo) {
    if ($("#videoplayer").height() * 0.5 * sizeVideo * uiController.sizeVideoRelative + 82 + 30 > $(window).height()) {
        return true
    }
    return false;
}


uiController.styleVideo = function (overtakeSize) {

    if (uiController.isMaxVideoSizeFaktor(uiController.sizeVideo))
        var sizeVideo = ( $(window).height() - (82 + 30) ) / ( $("#videoplayer").height() * 0.5 * uiController.sizeVideoRelative);
    else
        sizeVideo = uiController.sizeVideo;

    $("#videoplayer").css("-webkit-transform", "translate(" + uiController.translateVideo + "px,0px) scale(" + 0.5 * sizeVideo * uiController.sizeVideoRelative + ")");
    $("#videoplayer").css("transform", "translate(" + uiController.translateVideo + "px,0px) scale(" + 0.5 * sizeVideo * uiController.sizeVideoRelative + ")");
    $("#videoplayer").css("-webkit-transform-origin", "50% 100%");
    $("#videoplayer").css("transform-origin", "50% 100%");


    $("#siteLogo").css("-webkit-transform","scale("+1/uiController.sizeVideoRelative+")").css("transform","scale("+1/uiController.sizeVideoRelative+")");


    if (overtakeSize)
        uiController.sizeVideo = sizeVideo;
}


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
                                $("#saveplaylistbtn img").attr("src", "public/img/save.png");;

                            }, 1000)
                        });
                    });

                }, 1000)
            });
        });

    }, 250)
}

uiController.toggleSavePlaylist = function (savePlaylist) {


    if(!accountController.loggedIn){
        if (!accountController.showRegisterPopup)
        accountController.toggleSignInRegister();

        $('#popupLogin').popup('open', {positionTo: '#signinLink', transition:"pop"});

        setTimeout(function(){
            $('#signinusername').focus();
        },500)

        return;
    }



    uiController.savePlaylist = !uiController.savePlaylist;


    if (uiController.savePlaylist) {

        if ($('#playlistselectvertical .search-choice').length == 1) {
            $("#saveplaylistinpt").val($('#playlistselectvertical .search-choice').text());
            $("#saveokayplaylistbtn").removeAttr("disabled").css("opacity", "1");

        }
        else {
            $("#saveplaylistinpt").val("");
            $("#saveokayplaylistbtn").attr("disabled", "disabled").css("opacity", "0.5");

        }



        if (playlistController.loadedPlaylistSongs.length > 0 && playlistController.loadedPlaylistSongs[0].isPlaylist) {
            playlistController.loadedPlaylistSongs = [];
            $("#saveplaylistbtn img").attr("src", "public/img/save.png");
            $("#clearChoosenPlaylists").show();
            $scope.safeApply();
        }


        if (uiController.sortPlaylist) {
            uiController.toggleSortablePlaylist();
        }
        // $("#saveplaylistbtn").addClass("redbackground");
        $("#saveplaylistbtn img").attr("src", "public/img/crosswhite.png");

        $("#sortplaylistbtn").hide();
        $("#playlistselectvertical").hide();
        $("#saveplaylistinput").show();
        $("#saveokayplaylistbutton").show();


        $("#saveplaylistinpt").focus();

    } else {


        //  $("#saveplaylistbtn").removeClass("redbackground");
        $("#saveplaylistbtn img").attr("src", "public/img/save.png");

        $("#saveplaylistinput").hide();
        $("#saveokayplaylistbutton").hide();
        $("#sortplaylistbtn").show();
        $("#playlistselectvertical").show();

        if (savePlaylist) {

            uiController.savePlaylistVisible();

        }


    }
    uiController.updateUI();

}


uiController.toggleSortablePlaylist = function (dontShowTrash, manuell) {
    if (manuell) {
        uiController.startedSortPlaylist = false;
    }

    uiController.sortPlaylist = !uiController.sortPlaylist
    if (uiController.sortPlaylist) {
        if (!dontShowTrash) {
            $("#sortplaylistbtn img").attr("src", "public/img/check.png");

        }
        $("#sortplaylistbtn").addClass("greenbackground");

        $("#playlistInner").css("background-color", "rgba(255,255,255,0.1)");


        $('#playlistInner').css({backgroundColor: 'rgba(255,255,255,0)'})

        $('#playlistInner').animate({
            backgroundColor: 'rgba(255,255,255,0.1)'
        }, 100);


        if (!dontShowTrash)
            $("#playlistInner  .removesong").show();

        $("#playlistInner  .ui-btn-icon-right").css("margin-right", "0px");

        $("#playlistInner  .ui-btn-icon-right").css("padding-right", "40px");


        uiController.playListScroll.disable();
        $("#playlistsortstyle").remove();
        var style = $('<style id="playlistsortstyle">' +
            '#playlistInner ul li {' +
            'opacity:0.9!important;' +
            'margin-bottom:-1px;' +
            'border-bottom: 1px solid rgba(255,255,255,0.5);' +
            '}' +
            '</style>');
        $('html > head').append(style);

        $("#playlistInner .iScrollVerticalScrollbar").hide();
        if (!app.isCordova)
            $(".sortable").sortable("enable");


    } else {

        if (manuell)
            var delay = 0;
        else
            delay = 1500;
        // $("#playlistInner").css("background-color", "");
        setTimeout(function () {
            $('#playlistInner').animate({
                backgroundColor: 'rgba(255,255,255,0)'
            }, 200);
        }, delay)


        $("#playlistInner  .removesong").hide();
        $("#playlistInner  .ui-btn-icon-right").css("padding-right", "");
        $("#playlistInner  .ui-btn-icon-right").css("margin-right", "");
        if (!dontShowTrash)
            $("#sortplaylistbtn img").attr("src", "public/img/edit.png");

        $("#sortplaylistbtn").removeClass("greenbackground");

        $("#playlistInner .iScrollVerticalScrollbar").show();
        if (!app.isCordova)
            $(".sortable").sortable("disable");
        // $(".sortable").enableSelection();

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


uiController.stopPlaylistScrollingOnClick = function (event) {
    var myEvent = jQuery.extend({}, event);
    myEvent.type = "mouseup";
    myEvent.preventDefault = function () {
    };
    setTimeout(function () {
        uiController.playListScroll.handleEvent(myEvent);
    }, 10)
    setTimeout(function () {
        uiController.playListScroll.handleEvent(myEvent);
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
uiController.updateUI = function (dontChangeVideOpacity) {
    uiController.updateDisplay();


    $("#lyricsiframeresizebar").css("top", $(window).height() / 2 - 30 - 44);

    var myIframe = document.getElementById('lyricsifrm');
    setTimeout(function () {
        myIframe.contentWindow.scrollTo(0, 100);

    }, 2000)


    if (!dontChangeVideOpacity) {
        if (uiController.windowWidth < uiController.responsiveWidthSmall || $(window).height() < 350) {

            if ($("#videoplayer").css("opacity") != 0) {
                $("#videoplayer").css("opacity", "0");
                $("#videoplayer").css("pointer-events","none");

            }
        } else {

            if ($("#videoplayer").css("opacity") != 1 && uiController.playedFirst) {
                $("#videoplayer").css("opacity", "1");
                $("#videoplayer").css("pointer-events","auto");

            }

        }
    }

    $(".ui-panel").css("height", $(window).height() - 44 - 3);
    $("#page").css("height", $(window).height() - 44 - 3);

    $("#videoplayer").css("width", uiController.windowWidth);

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
                $("#playlistInner").css("max-height", $(window).height() - 3 - (100 + $("#playlistselectvertical .chosen-container").height() - 30));
            else
                $("#playlistInner").css("max-height", $(window).height() - 3 - 5);
        }, 100)

        if (uiController.sidePanelOpen) {

            // $("#searchlist").css("width", uiController.windowWidth - $("#rightpanel").width() - 10);

            if (uiController.windowWidth - $("#rightpanel").width() - 10 < 100) {
                //$("#searchlist li a").wrap('<marquee behavior="alternate"></marquee>');
                $("#searchlist li").css("max-height", "44px");

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
            $("#searchlist").css("width", "");
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

        setSelectSize();


    }

    $("#videoplayer .mejs-time-total").css("width", uiController.windowWidth / 1.5 - 160 - 105);
    $("#videoplayer .mejs-time-rail").css("width", uiController.windowWidth / 1.5 - 160 + 10 - 105);

    //Small Size
    if (uiController.windowWidth < uiController.responsiveWidthSmall) {


        $("#videocontrols .mejs-time-total").css("width", (uiController.windowWidth / 1.5 - 160));

        if ((uiController.windowWidth) / 1.5 - 160 - 105 + 10 < 323 - 105 - uiController.countCustomButtons * 26) {
            if (((uiController.windowWidth) / 1.5 - 160 - 105 - uiController.countCustomButtons * 26) + 10 < 0) {
                $("#videocontrols .mejs-time-rail").css("width", "0px");
                console.log("!nnn" + (((uiController.windowWidth) / 1.5 - 160 - 105 - uiController.countCustomButtons * 26) + 10))

            }
            else
                $("#videocontrols .mejs-time-rail").css("width", ((uiController.windowWidth) / 1.5 - 160 - 105 - uiController.countCustomButtons * 26) + 10);
        }
        else
            $("#videocontrols .mejs-time-rail").css("width", 323 - 105 - uiController.countCustomButtons * 26);

        $("#searchlist").css("max-height", $(window).height() - 44 - 130 - 40 + 12);

        $("#content").css({"width": uiController.windowWidth - 16, "height": $(window).height() - 44 - 4 - 8 });


    }
    //Big Size
    else {

        /*do {
         var marquee = $("#searchlist li marquee").get(0);
         $(marquee).replaceWith($(marquee).contents());
         } while (marquee)*/


        $("#videocontrols .mejs-time-total").css("width", (uiController.windowWidth / 1.5 - 160) / 1.3 - 105 - uiController.countCustomButtons * 26);
        $("#videocontrols .mejs-time-rail").css("width", (uiController.windowWidth / 1.5 - 160) / 1.3 + 10 - 105 - uiController.countCustomButtons * 26);

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

        if (Math.abs($("#videocontrolsInner .mejs-controls").css("padding-left").replace("px", "") - ( (uiController.windowWidth - $(".mejs-controls").width() * 1.5) / 2 / 1.5)) > 1)
            $("#videocontrolsInner .mejs-controls").css("padding-left", (uiController.windowWidth - $(".mejs-controls").width() * 1.5) / 2 / 1.5).css("padding-right", (uiController.windowWidth - $(".mejs-controls").width() * 1.5) / 2 / 1.5);
        setTimeout(function () {
            if (Math.abs($("#videocontrolsInner .mejs-controls").css("padding-left").replace("px", "") - ( (uiController.windowWidth - $(".mejs-controls").width() * 1.5) / 2 / 1.5)) > 1)
                $("#videocontrolsInner .mejs-controls").css("padding-left", (uiController.windowWidth - $(".mejs-controls").width() * 1.5) / 2 / 1.5).css("padding-right", (uiController.windowWidth - $(".mejs-controls").width() * 1.5) / 2 / 1.5);
        }, 50)
    }, 0)


    setTimeout(function () {
        uiController.mediaElementPlayer.setControlsSize();

        uiController.searchListScroll.refresh();
        uiController.playListScroll.refresh();
        uiController.styleVideo(true);
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


