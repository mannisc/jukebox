/**
 * videoController.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 07.04.14 - 09:12
 * @copyright munichDev UG
 */


var videoController = function () {
};

//Currently used Video Player

videoController.videoPlayerList = [
    []
];

videoController.videoPlayerList[0] = [];
videoController.videoPlayerList[1] = [];
videoController.videoPlayerList[2] = [];

videoController.videoPlayerList[0][0] = new mediaelementPlayer("#mediaemelemtjsPlayer1");

videoController.videoPlayerList[1][0] = dailymotionPlayer;

videoController.videoPlayerList[2][0] = vimeoPlayer;


videoController.videoPlayer = videoController.videoPlayerList[0][0];////embeddedPlayer;//

videoController.videoOpactiy = 0.5;

videoController.isEmbedded = false;


//Video is playing
videoController.isPlaying = false;

//Scale Factor (touch)
videoController.scaleFactor = 1.5;


//Video Position Mode 0:   Background ,1: Fullscreen
videoController.fullscreenMode = 0;


//Progress Time- use setter
videoController.progressTime = 0;
//Max Time - use setter
videoController.maxTime = 0;

//Changing Volume at the moment
videoController.changingVolume = false;
videoController.isMuted = false;
videoController.beforeMutedVolume = null;
videoController.volume = 0.5;

//Shuffle Yes/No
videoController.shuffleMode = false;

//Start state of Buttons
videoController.prevEnabled = true;
videoController.playpauseEnabled = true;
videoController.stopEnabled = true;
videoController.nextEnabled = true;
videoController.shuffleEnabled = true;
videoController.timerailEnabled = true;
videoController.volumeEnabled = true;
videoController.fullscreenEnabled = false;
videoController.versionsEnabled = true;
videoController.lyricsEnabled = false;
videoController.sharesocialEnabled = false;
videoController.externalSiteEnabled = false;


/**
 * Init the videoController, bind events to Buttons
 */
videoController.init = function () {


    //Detect Fullscreen Close
    var changeHandler = function () {
        setTimeout(function () {
            if (!videoController.isBrowserFullscreen()) {
                if (videoController.fullscreenMode != 0) {
                    videoController.fullscreenMode = 0;
                    videoController.updateFullscreenMode();
                }
            }
        }, 500)

    }
    document.addEventListener("fullscreenchange", changeHandler, false);
    document.addEventListener("webkitfullscreenchange", changeHandler, false);
    document.addEventListener("mozfullscreenchange", changeHandler, false);



    $(document).keyup(function (evt) {
        if ($('input:focus, textarea:focus').length == 0) {
            if (evt.keyCode == 32) {
                videoController.playPauseSong();
            } else if (evt.keyCode == 38 || evt.keyCode == 37) {
                videoController.playPrevSong();
            } else if (evt.keyCode == 40 || evt.keyCode == 39) {
                playbackController.playNextSong();
            }
        }
    })

    for (var i = 0; i <= 1; i++) {
        for (var j = 0; i <= 1; i++) {
            if (videoController.videoPlayerList[i][j])
                videoController.videoPlayerList[i][j].init();
        }
    }


    videoController.controls = $(".videoControlElements-controls");

    //Play Previous Song
    videoController.controls.find(".videoControlElements-prevtrack-button").click(function () {
        videoController.playPrevSong();

    });

    //Play Pause Song
    videoController.controls.find(".videoControlElements-playpause-button").click(function () {
        if (videoController.playpauseEnabled && videoController.videoPlayer) {
            videoController.playPauseSong();
        }

    });

    //Stop Song
    videoController.controls.find(".videoControlElements-stop-button").click(function () {
        if (videoController.stopEnabled && videoController.videoPlayer)
            videoController.stopSong();
    });

    //Play Next Song
    videoController.controls.find(".videoControlElements-nexttrack-button").click(function () {
        videoController.playNextSong();
    });


    //Shuffle Songs
    videoController.controls.find(".videoControlElements-shuffle-button").click(function () {
        if (videoController.shuffleEnabled)
            videoController.toggleShuffleSongs();
    });

    //Time Rail
    videoController.controls.find(".videoControlElements-time-rail").click(function (event) {
        if (videoController.timerailEnabled && playbackController.playingSong) {
            var total = videoController.controls.find('.videoControlElements-time-total'),
            //loaded  = controls.find('.videoControlElements-time-loaded'),
            //current  = controls.find('.videoControlElements-time-current'),
            //handle  = controls.find('.videoControlElements-time-handle'),
                x = event.pageX,
                offset = total.offset(),
                width = total.outerWidth(true) * videoController.scaleFactor / 1.023,
                pos,
                percentage;

            if (x < offset.left) {
                x = offset.left;
            } else if (x > width + offset.left) {
                x = width + offset.left;
            }

            pos = x - offset.left;
            percentage = (pos / width);
            videoController.videoPlayer.setProgressPercentage(percentage);
        }
    });

    //Volume
    videoController.controls.find(".videoControlElements-volume-button button").click(function () {
        if (videoController.volumeEnabled && videoController.videoPlayer) {
            videoController.isMuted = !videoController.isMuted;
            if (videoController.isMuted) {
                videoController.beforeMutedVolume = videoController.volume;
                videoController.volume = 0;
            } else {
                videoController.volume = videoController.beforeMutedVolume;
            }
            videoController.setVolume(videoController.volume);
        }

    });

    videoController.controls.find(".videoControlElements-volume-button").mouseover(function () {
        if (videoController.volumeEnabled)
            videoController.controls.find(".videoControlElements-volume-slider").show();
    });


    videoController.controls.find(".videoControlElements-volume-button").mouseout(function () {
        if (!videoController.changingVolume)
            videoController.controls.find(".videoControlElements-volume-slider").hide();
    });


    videoController.controls.find(".videoControlElements-volume-slider").click(function (event) {

        if (!videoController.changingVolume) {
            var total = videoController.controls.find('.videoControlElements-volume-slider'),
                y = event.pageY - 20,
                offset = total.offset(),
                height = total.outerHeight(true) * videoController.scaleFactor / 1.023 - 20,
                pos,
                percentage;

            if (y < offset.top) {
                y = offset.top;
            } else if (y > height + offset.top) {
                y = height + offset.top;
            }

            pos = y - offset.top;
            percentage = (pos / height);
            videoController.volume = (1 - percentage);
            // position the slider and handle
            videoController.setVolume(videoController.volume);
        }
    });



    videoController.controls.find(".videoControlElements-volume-handle").bind('mousedown', function (e) {

        var volumeSlider = videoController.controls.find('.videoControlElements-volume-slider'),
            volumeTotal = videoController.controls.find('.videoControlElements-volume-total'),
            volumeCurrent = videoController.controls.find('.videoControlElements-volume-current'),
            volumeHandle = videoController.controls.find('.videoControlElements-volume-handle'),
            mute = $(".videoControlElements-volume-button");

        var changeVolumeHandler = function (e) {
            videoController.changingVolume = true;
            var volume,
                totalOffset = volumeTotal.offset();

            // calculate the new volume based on the moust position
            var
                railHeight = volumeTotal.height() * videoController.scaleFactor / 1.023,//CHANGED!!!!!
                totalTop = parseInt(volumeTotal.css('top').replace(/px/, ''), 10),
                newY = e.pageY - totalOffset.top;

            volume = (railHeight - newY) / railHeight;

            // the controls just hide themselves (usually when mouse moves too far up)
            if (totalOffset.top == 0 || totalOffset.left == 0)
                return;

            // ensure the volume isn't outside 0-1
            volume = Math.max(0, volume);
            volume = Math.min(volume, 1);
            videoController.volume = volume;

            // position the slider and handle
            videoController.setVolume(videoController.volume);

            // set the media object (this will trigger the volumechanged event)

            videoController.videoPlayer.setVolume(videoController.volume);

        }

        $(document).bind('mousemove.videoVolume', changeVolumeHandler)

        $(document).bind('mouseup.videoVolume', function (e) {

            if (videoController.controls.find(".videoControlElements-volume-slider:hover").length == 0)
                videoController.controls.find(".videoControlElements-volume-slider").hide();
            setTimeout(function () {
                videoController.changingVolume = false;
            }, 50)
            $(document).unbind(".videoVolume");
        })




    });






    //Fullscreen
    videoController.controls.find(".videoControlElements-fullscreen-button button").click(function () {

        if (videoController.fullscreenEnabled && videoController.videoPlayer) {
            videoController.toggleFullscreenMode();
        }
    });

    videoController.controls.find(".videoControlElements-fullscreen-button").mouseover(function () {
        if (videoController.fullscreenMode == 0)
        // if (videoController.fullscreenEnabled && videoController.videoPlayer)
            videoController.controls.find(".videoControlElements-fullscreen-slider").show();
    });



    videoController.controls.find(".videoControlElements-fullscreen-button").mouseout(function () {
        // if (videoController.fullscreenEnabled && videoController.videoPlayer)
        videoController.controls.find(".videoControlElements-fullscreen-slider").hide();
    });

    videoController.controls.find(".videoControlElements-fullscreen-slider").mouseover(function () {
        $(".videoControlElements-fullscreen-button button").css("background-image","url(public/img/brightness.png)")


    });



    videoController.controls.find(".videoControlElements-fullscreen-slider").mouseout(function () {
        $(".videoControlElements-fullscreen-button button").css("background","")

    });




    videoController.controls.find(".videoControlElements-fullscreen-slider").click(function (event) {

        if (!videoController.changingVideoOpactiy) {
            var total = videoController.controls.find('.videoControlElements-fullscreen-slider'),
                y = event.pageY - 20,
                offset = total.offset(),
                height = total.outerHeight(true) * videoController.scaleFactor / 1.023 - 20,
                pos,
                percentage;

            if (y < offset.top) {
                y = offset.top;
            } else if (y > height + offset.top) {
                y = height + offset.top;
            }

            pos = y - offset.top;
            percentage = (pos / height);
            videoController.videoOpactiy = (1 - percentage);
            // position the slider and handle
            videoController.setVideoOpacity(videoController.videoOpactiy);
        }
    });

    videoController.controls.find(".videoControlElements-fullscreen-handle").bind('mousedown', function (e) {

        var videoOpactiySlider = videoController.controls.find('.videoControlElements-fullscreen-slider'),
            videoOpactiyTotal = videoController.controls.find('.videoControlElements-fullscreen-total'),
            videoOpactiyCurrent = videoController.controls.find('.videoControlElements-fullscreen-current'),
            videoOpactiyHandle = videoController.controls.find('.videoControlElements-fullscreen-handle'),
            mute = $(".videoControlElements-fullscreen-button");

        var changevideoOpactiyHandler = function (e) {
            videoController.changingVideoOpactiy = true;
            var videoOpactiy,
                totalOffset = videoOpactiyTotal.offset();

            // calculate the new videoOpactiy based on the moust position
            var
                railHeight = videoOpactiyTotal.height() * videoController.scaleFactor / 1.023,//CHANGED!!!!!
                totalTop = parseInt(videoOpactiyTotal.css('top').replace(/px/, ''), 10),
                newY = e.pageY - totalOffset.top;

            videoOpactiy = (railHeight - newY) / railHeight;

            // the controls just hide themselves (usually when mouse moves too far up)
            if (totalOffset.top == 0 || totalOffset.left == 0)
                return;

            // ensure the videoOpactiy isn't outside 0-1
            videoOpactiy = Math.max(0, videoOpactiy);
            videoOpactiy = Math.min(videoOpactiy, 1);
            videoController.videoOpactiy = videoOpactiy;

            // position the slider and handle
            videoController.setVideoOpacity(videoController.videoOpactiy);



        }

        $(document).bind('mousemove.videoOpacity', changevideoOpactiyHandler)

        $(document).bind('mouseup.videoOpacity', function (e) {

            if (videoController.controls.find(".videoControlElements-fullscreen-slider:hover").length == 0)
                videoController.controls.find(".videoControlElements-fullscreen-slider").hide();
            setTimeout(function () {
                videoController.changingVideoOpactiy = false;
            }, 50)
            $(document).unbind(".videoOpacity");
        })




    });


    //Choose Version
    videoController.controls.find(".videoControlElements-button-choose-version").click(function () {
        if (videoController.versionsEnabled)
            var song = playbackController.getPlayingSong();
        var artistString = encodeURIComponent(mediaController.getSongArtist(song));
        var titleString = encodeURIComponent(song.name);
        mediaController.getVersions(artistString,titleString);
    });

    //Share
    videoController.controls.find(".videoControlElements-button-share").click(function () {
        mediaController.shareMedia();

    });

    //Show Lyrics
    videoController.controls.find(".videoControlElements-button-lyrics").click(function () {
        if (videoController.lyricsEnabled)

            mediaController.toggleLyrics();
    });

    //Share Social
    videoController.controls.find(".videoControlElements-button-facebook").click(function () {
        if (videoController.sharesocialEnabled){
            $("#popupSocial").popup('open', {positionTo: "window", transition: 'slideup'});

        }




        //  facebookHandler.postOnFacebook();

    });

    //Open external site
    videoController.controls.find(".videoControlElements-button-external").click(function () {

        if (videoController.externalSiteEnabled) {
            var mywindow = window.open(mediaController.currentvideoURL, "", "");
            mywindow.focus();
        }
    });

    //Fade in controls
    setTimeout(function () {
        $("#videocontrolsInner").hide();
        $("#videocontrolsInner").css("opacity", "1");
        $("#videocontrolsInner").addClass("fadeincomplete");
        $("#videocontrolsInner").show();
    }, 1000);
    $("#videocontrols").css("background", "none");


    //Initial Settings

    videoController.setVolume(videoController.volume);
    videoController.disablePlayStopControls(true);
    videoController.disableControls(true);

    uiController.noVideoClickTimer = 0;

    videoController.setVideoOpacity(videoController.videoOpactiy);

    //TODO Remove
    /*videoController.setMaxTime(341);
     videoController.setProgressTime(78);
     videoController.setBufferedPercentage(0.6);
     */
}

/**
 * Play/Pause Video
 */
videoController.playPauseSong = function () {

    if (videoController.isPlaying)
        videoController.pauseSong();
    else
        videoController.playSong();
}


/**
 * Window was resized
 */
videoController.resizeVideo = function () {
    if (videoController.videoPlayer.resize)
        videoController.videoPlayer.resize();
    //$("#videoplayer .videoControlElements-time-total").css("width", uiController.totalTimeWidth);
    //$("#videoplayer .videoControlElements-time-rail").css("width",  uiController.totalTimeWidth+10);

}


/**
 * Next Song
 * @type {*}
 */
videoController.playNextSong = function () {
    if (videoController.prevEnabled)
        playbackController.playNextSong();
}


/**
 * Previous Song
 * @type {*}
 */
videoController.playPrevSong = function () {
    if (videoController.prevEnabled)
        playbackController.playPrevSong();
}


/**
 * Check if video is embedded
 * @type {*}
 */

videoController.isEmbedVideo = function (videoURL) {
    if (videoURL.search("dailymotion.com") > -1) {
        return videoController.videoPlayerList[1][0];
    }

    //if (videoURL.search("vimeo.com") > -1) {
    ////    return videoController.videoPlayerList[2][0];
    ////}
    return null;
}

/**
 * Load Song, decide which Player to use
 * @type {*}
 */
videoController.loadSongInSuitablePlayer = function (streamURL, videoURL) {
    videoController.isPlaying = false;
    videoController.isLoading = false;
    playbackController.isLoading = false;

    $("#backgroundVideo").css("opacity","0");
    $("#backgroundVideo").removeClass("animated")
    $("#backgroundVideo").hide();
    $("#siteLogo").hide();

    videoController.setMaxTime(0);
    videoController.setProgressPercentage(0);
    videoController.setProgressTime(0);
    videoController.setBufferedPercentage(0);

    if (videoController.videoPlayer && videoController.videoPlayer.unload) {
        videoController.videoPlayer.unload();
    }


    //TODO Select embedded Player
    var player = videoController.isEmbedVideo(videoURL);
    if (player != null) {
        videoController.isEmbedded = true;
        videoController.videoPlayer = player;
        videoController.videoPlayer.load(videoURL);
    }
    //Mediaelement
    else {
        videoController.isEmbedded = false;
        videoController.videoPlayer = videoController.videoPlayerList[0][0];
        console.dir("PLAY STREAM!!!: "+streamURL);
        videoController.videoPlayer.load(streamURL);
    }

    $("#backgroundVideo").show();

    videoController.updateFullscreenMode();

    if (!playbackController.firstPlayedSongAlready) {
        playbackController.firstPlayedSongAlready = true;
        $("#backgroundImage").addClass("fadeoutcomplete");
        setTimeout(function () {
            $("#backgroundImage").hide();
        }, 1000)
    }

}


/**
 * Play Song
 * @type {*}
 */
videoController.playSong = function () {
    if (!videoController.isPlaying && playbackController.playingSong) {
        videoController.controls.find(".videoControlElements-play").removeClass("videoControlElements-play").addClass("videoControlElements-pause");
        videoController.videoPlayer.play();
        videoController.isPlaying = true;

        videoController.disablePlayStopControls(false);

        if (!playbackController.isLoading && !$(".songlist li.loadedsong").hasClass("firstplay")) {
            $(".songlist li.loadedsong.stillloading .loadingSongImg").hide();
            $(".songlist li.loadedsong").addClass("playing");
            $(".songlist li.loadedsong").removeClass("pausing");
        }


    }
}

/**
 * Pause Song
 * @type {*}
 */
videoController.pauseSong = function () {

    if (videoController.isPlaying) {
        videoController.controls.find(".videoControlElements-pause").removeClass("videoControlElements-pause").addClass("videoControlElements-play");
        videoController.videoPlayer.pause();
        videoController.isPlaying = false;
        if (!playbackController.isLoading) {
            $(".songlist li.loadedsong.stillloading .loadingSongImg").hide();
            $(".songlist li.loadedsong").addClass("pausing");
            $(".songlist li.loadedsong").removeClass("playing");
        }


    }
}


/**
 * Stop Song
 * @type {*}
 */
videoController.stopSong = function () {

    if (playbackController.playingSong) {
        if (videoController.isPlaying) {
            videoController.pauseSong();
            videoController.isPlaying = false;
        }

        videoController.videoPlayer.stop();

        videoController.setProgressPercentage(0);

        $(".songlist li.loadedsong").removeClass("pausing");
        $(".songlist li.loadedsong").addClass("playing");

        if (videoController.stopEnabled == true) {

            videoController.disableStopControl(true);

            $(".videoControlElements-playpause-button button").removeClass("looped");

            //$("#videoplayer").css("opacity", "0");
            //$("#videoplayer").css("pointer-events", "none");

            $(".videoControlElements-time-loaded").hide();
            if (!playbackController.playingOldSong) {
                playbackController.resetPlayingSong();

            }
        }
    }
}

/**
 * Browser Fullscreen
 */
videoController.isBrowserFullscreen = function () {

    return (document.fullscreen||document.mozFullScreen||document.webkitIsFullScreen||document.msFullscreenElement||window.fullScreen) ||
        (window.innerWidth == screen.width && window.innerHeight == screen.height);
}

/**
 * Toggle Fullscreen Mode
 * @type {*}
 */
videoController.toggleFullscreenMode = function () {
    videoController.fullscreenMode = videoController.fullscreenMode + 1;
    if (videoController.fullscreenMode > 1)
        videoController.fullscreenMode = 0;

    videoController.updateFullscreenMode();
}


videoController.toggleBrowserFullScreen = function () {

    var element = document.getElementById("page");



    console.dir("FULLSCREEEN!!!!");
    console.dir(document.webkitIsFullScreen);
    console.dir( element.webkitRequestFullScreen);
    console.dir();



    if (element.requestFullScreen) {

        if (!document.fullScreen) {
            element.requestFullscreen();
        } else {
            document.exitFullScreen();
        }

    }
    if (element.mozRequestFullScreen) {
        if (!document.mozFullScreen) {
            element.mozRequestFullScreen();
        } else {
            document.mozCancelFullScreen();
        }

    } else if (element.webkitRequestFullScreen) {



        if (!document.webkitIsFullScreen) {
            element.webkitRequestFullScreen();
        } else {
            document.webkitCancelFullScreen();
        }

    }


}


/**
 * Set Fullscreen Mode
 * @type {*}
 */
videoController.updateFullscreenMode = function () {


    var hideControlsTimer = null;
    var hideControlsPointerX = null;
    var hideControlsPointerY = null;

    var hideControls= function(event){

        if(!hideControlsPointerX||!event|| (Math.abs(hideControlsPointerX-event.clientX)>20&&Math.abs(hideControlsPointerY-event.clientY )>20)){
            if(event){
                hideControlsPointerX = event.clientX;
                hideControlsPointerY = event.clientY;
            }

            if(hideControlsTimer){
                clearTimeout(hideControlsTimer)
                $("#videocontrols").css("opacity","");
                $("#siteLogo img").css("bottom","");
            }



            hideControlsTimer = setTimeout(function(){
                if (videoController.fullscreenMode == 1){
                    $("#videocontrols").css("opacity","0");
                    $("#siteLogo img").css("bottom","15px");

                }
            },3500)

        }

    }


    if (videoController.fullscreenMode == 0) { //Background
        $("#songbaseLogoImage").hide();
        if(hideControlsTimer){
            clearTimeout(hideControlsTimer);
            $("#videocontrols").removeClass("fadeoutcomplete");
        }
        $("body").off("mousemove mouseup",hideControls);

        $("#header").css("opacity", "1").css("pointer-events","auto");

        $("#controlbar").css("opacity", "1").css("pointer-events","auto");
        $("#searchlist").css("opacity", "1").css("pointer-events","auto");
        $("#playlist").css("opacity", "1").addClass("fadeincomplete").css("pointer-events","auto");
        $("#controlbarplaylist").css("opacity", "1").css("pointer-events","auto");
        $(".videoControlElements-custom-button").show();

        $(".backgroundVideo,  #backgroundVideo").addClass("background");


        $(".fb-recommendations-bar-container").show();
        $(".sideinfo").show();

        $("#page, #content, .backgroundVideo, #backgroundVideo").removeClass("fullscreen");

        uiController.updateUI();
        if (videoController.isBrowserFullscreen())
            videoController.toggleBrowserFullScreen();
        setTimeout(function () {

            uiController.playListScroll.refresh();
            setTimeout(function () {
                uiController.updateUI();
                uiController.playListScroll.refresh();
                setTimeout(function () {
                    uiController.updateUI();
                    uiController.playListScroll.refresh();
                    setTimeout(function () {
                        uiController.updateUI();
                        uiController.playListScroll.refresh();
                        setTimeout(function () {
                            uiController.updateUI();
                            uiController.playListScroll.refresh();

                        }, 1000)

                    }, 1000)
                }, 1000)
            }, 1000)
        }, 150)
    }

    else if (videoController.fullscreenMode == 1) { //Fullscreen
        setTimeout(function(){
            hideControls();
            $("body").on("mousemove mouseup", hideControls);
        },2000);

        $("#songbaseLogoImage").show();

        $(".videoControlElements-custom-button").hide();
        $("#header").css("opacity", "0").css("pointer-events","none");
        $("#controlbar").css("opacity", "0").css("pointer-events","none");
        $("#searchlist").css("opacity", "0").css("pointer-events","none");
        $("#playlist").css("opacity", "0").removeClass("fadeincomplete").css("pointer-events","none");
        $("#controlbarplaylist").css("opacity", "0").css("pointer-events","none");

        $(".backgroundVideo,  #backgroundVideo").removeClass("background");

        $("#page, #content, .backgroundVideo,  #backgroundVideo").addClass("fullscreen");

        $(".fb-recommendations-bar-container").hide();
        $(".sideinfo").hide();

        uiController.updateUI();

        if (!videoController.isBrowserFullscreen()) {
            $("#videocontrols").css("opacity", "0");

            setTimeout(function () {
                $("#videocontrols").hide();
                $("#videocontrols").css("opacity", "1");
                $("#videocontrols").addClass("fadeincomplete")
                uiController.updateUI();

                $("#videocontrols").show();

                setTimeout(function () {
                    $("#videocontrols").removeClass("fadeincomplete");
                }, 2000)
            }, 1000)

            videoController.toggleBrowserFullScreen();

        }

    }


}


/**
 * Disable/Enable Stop Control
 * @param disable
 */
videoController.disableStopControl = function (disable) {
    videoController.stopEnabled = !disable;
    if (disable) {
        $(".videoControlElements-stop-button button").css("opacity", "0.5");

    } else {
        $(".videoControlElements-stop-button button").css("opacity", "1");
    }
}

/**
 * Disable/Enable Stop Control
 * @param disable
 */
videoController.disablePlayStopControls = function (disable) {
    videoController.stopEnabled = !disable;
    videoController.playpauseEnabled = !disable;

    if (disable) {

        $(".videoControlElements-playpause-button button").css("opacity", "0.5");
        $(".videoControlElements-stop-button button").css("opacity", "0.5");

    } else {
        $(".videoControlElements-playpause-button button").css("opacity", "1");
        $(".videoControlElements-stop-button button").css("opacity", "1");

    }

}

/**
 * Disable/Enable Controls
 * @param disable
 */
videoController.disableControls = function (disable) {

    videoController.prevEnabled = !disable;
    videoController.nextEnabled = !disable;

    if (disable) {
        $(".videoControlElements-nexttrack-button button").css("opacity", "0.5");
        $(".videoControlElements-prevtrack-button button").css("opacity", "0.5");

    } else {
        $(".videoControlElements-nexttrack-button button").css("opacity", "1");
        $(".videoControlElements-prevtrack-button button").css("opacity", "1");

    }

}


/**
 * Disable/Enable Position Control
 * @param disable
 */
videoController.disablePositionControls = function (disable) {
    videoController.prevEnabled = !disable;
    videoController.nextEnabled = !disable;
    if (disable) {
        $(".videoControlElements-nexttrack-button button").css("opacity", "0.5");
        $(".videoControlElements-prevtrack-button button").css("opacity", "0.5");
    } else {
        $(".videoControlElements-nexttrack-button button").css("opacity", "1");
        $(".videoControlElements-prevtrack-button button").css("opacity", "1");
    }

}


/**
 * Disable/Enable Version Control
 * @param disable
 */
videoController.disableVersionControl = function (disable) {
    videoController.versionsEnabled = !disable;
    if (disable) {
        $(".videoControlElements-button-choose-version button").css("opacity", "0.5");

    } else {
        $(".videoControlElements-button-choose-version button").css("opacity", "1");
    }
}


/**
 * Disable/Enable Lyrics Control
 * @param disable
 */
videoController.disableLyricsControl = function (disable) {
    videoController.lyricsEnabled = !disable;
    if (disable) {
        $(".videoControlElements-button-lyrics button").css("opacity", "0.5");

    } else {
        $(".videoControlElements-button-lyrics button").css("opacity", "1");
    }
}



/**
 * Disable/Enable Fullscreen Control
 * @param disable
 */
videoController.disableFullscreenControl = function (disable) {
    videoController.fullscreenEnabled = !disable;
    if (disable) {
        $(".videoControlElements-fullscreen-button button").css("opacity", "0.5");

    } else {
        $(".videoControlElements-fullscreen-button button").css("opacity", "1");
    }
}


/**
 * Disable/Enable External Site Control
 * @param disable
 */
videoController.disableExternalSiteControl = function (disable) {
    videoController.externalSiteEnabled = !disable;
    if (disable) {
        $(".videoControlElements-button-external button").css("opacity", "0.5");

    } else {
        $(".videoControlElements-button-external button").css("opacity", "1");
    }
}

/**
 * Disable/Enable ShareSocial Control
 * @param disable
 */
videoController.disableShareSocialControl = function (disable) {
    videoController.sharesocialEnabled = !disable;
    if (disable) {
        $(".videoControlElements-button-facebook button").css("opacity", "0.5");

    } else {
        $(".videoControlElements-button-facebook button").css("opacity", "1");
    }
}


/**
 * Toggle Shuffle Songs
 */
videoController.toggleShuffleSongs = function () {

    videoController.shuffleMode = !videoController.shuffleMode;
    if (videoController.shuffleMode)
        $(".videoControlElements-shuffle-button button").css("opacity", "1");
    else {
        $(".videoControlElements-shuffle-button button").css("opacity", "0.5");
    }

}

/**
 * Set Play Button to Loop  Button
 */
videoController.setLoopButton = function (loop) {

    if (loop) {
        $(".videoControlElements-playpause-button button").addClass("looped");

    } else {
        $(".videoControlElements-playpause-button button").removeClass("looped");
    }

}

/**
 * Set Progress in percentage
 */
videoController.setProgressPercentage = function (percentage, updateVideo) {

    if (percentage < 0)
        percentage = 0;
    else if (percentage > 1)
        percentage = 1;
    videoController.controls.find(".videoControlElements-time-current").css("width", percentage * 100 + "%")
    if (videoController.maxTime && videoController.maxTime > 0) {
        videoController.progressTime = videoController.maxTime * percentage;
        videoController.controls.find(".videoControlElements-currenttime").text(videoController.secondsToTimeCode(videoController.progressTime, false, false, false));
    }

    if (updateVideo && videoController.videoPlayer && playbackController.playingSong && !playbackController.isLoading)
        videoController.videoPlayer.setProgressPercentage(percentage);
}


/**
 * Set Progress in seconds
 */
videoController.setProgressTime = function (time, updateVideo) {
    videoController.progressTime = time;
    videoController.controls.find(".videoControlElements-currenttime").text(videoController.secondsToTimeCode(time, false, false, false));

    if (videoController.maxTime && videoController.maxTime > 0)
        videoController.setProgressPercentage(videoController.progressTime / videoController.maxTime, updateVideo)

}

/**
 * Set Buffered in percentage
 */
videoController.setBufferedPercentage = function (percentage) {
    videoController.buffered = percentage;
    if (percentage < 0)
        percentage = 0;
    else if (percentage > 1)
        percentage = 1;
    videoController.controls.find(".videoControlElements-time-loaded").css("width", percentage * 100 + "%")


}

/**
 * Show Buffered
 */
videoController.showBuffered = function (show) {
    if (show)
        videoController.controls.find(".videoControlElements-time-loaded").fadeIn()
    else
        videoController.controls.find(".videoControlElements-time-loaded").fadeOut()


}




/**
 * Set Song length in seconds
 */
videoController.setMaxTime = function (time) {
    videoController.maxTime = time;
    videoController.controls.find(".videoControlElements-duration").text(videoController.secondsToTimeCode(time, false, false, false));


}


/**
 * Show Buffering strippes in time rail
 */
videoController.showBuffering = function (show) {
    if (show)
        videoController.controls.find(".videoControlElements-time-buffering").fadeIn();
    else
        videoController.controls.find(".videoControlElements-time-buffering").hide();

}


/**
 * Position Volume Handle and show muted/unmuted Icon
 * @param volume
 * @param secondTry
 */
videoController.setVolume = function (volume, secondTry) {


    var volumeSlider = videoController.controls.find('.videoControlElements-volume-slider'),
        volumeTotal = videoController.controls.find('.videoControlElements-volume-total'),
        volumeCurrent = videoController.controls.find('.videoControlElements-volume-current'),
        volumeHandle = videoController.controls.find('.videoControlElements-volume-handle'),
        mute = $(".videoControlElements-volume-button");
    if (!volumeSlider.is(':visible') && typeof secondTry == 'undefined') {
        volumeSlider.show();
        videoController.setVolume(volume, true);
        volumeSlider.hide()
        return;
    }

    // correct to 0-1
    volume = Math.max(0, volume);
    volume = Math.min(volume, 1);

    // ajust mute button style
    if (volume == 0) {
        mute.removeClass('videoControlElements-mute').addClass('videoControlElements-unmute');
    } else {
        mute.removeClass('videoControlElements-unmute').addClass('videoControlElements-mute');
    }

    // position slider

    // height of the full size volume slider background
    var totalHeight = volumeTotal.height(),

    // top/left of full size volume slider background
        totalPosition = volumeTotal.position(),

    // the new top position based on the current volume
    // 70% volume on 100px height == top:30px
        newTop = totalHeight - (totalHeight * volume);

    // handle
    volumeHandle.css('top', Math.round(totalPosition.top + newTop - (volumeHandle.height() / 2)));

    // show the current visibility
    volumeCurrent.height(totalHeight - newTop);
    volumeCurrent.css('top', totalPosition.top + newTop);

    videoController.volume = volume;
    videoController.videoPlayer.setVolume(videoController.volume);

}


/**
 * Position Opacity Handle
 * @param volume
 * @param secondTry
 */
videoController.setVideoOpacity = function (videoOpactiy, secondTry) {


    var videoOpactiySlider = videoController.controls.find('.videoControlElements-fullscreen-slider'),
        videoOpactiyTotal = videoController.controls.find('.videoControlElements-fullscreen-total'),
        videoOpactiyCurrent = videoController.controls.find('.videoControlElements-fullscreen-current'),
        videoOpactiyHandle = videoController.controls.find('.videoControlElements-fullscreen-handle'),
        mute = $(".videoControlElements-fullscreen-button");
    if (!videoOpactiySlider.is(':visible') && typeof secondTry == 'undefined') {
        videoOpactiySlider.show();
        videoController.setVideoOpacity(videoOpactiy, true);
        videoOpactiySlider.hide()
        return;
    }

    // correct to 0-1
    videoOpactiy = Math.max(0, videoOpactiy);
    videoOpactiy = Math.min(videoOpactiy, 1);


    var totalHeight = videoOpactiyTotal.height(),

        totalPosition = videoOpactiyTotal.position(),


        newTop = totalHeight - (totalHeight * videoOpactiy);

    // handle
    videoOpactiyHandle.css('top', Math.round(totalPosition.top + newTop - (videoOpactiyHandle.height() / 2)));

    // show the current visibility
    videoOpactiyCurrent.height(totalHeight - newTop);
    videoOpactiyCurrent.css('top', totalPosition.top + newTop);

    videoController.videoOpactiy = videoOpactiy;
    $("#backgroundVideo").css("opacity", videoController.videoOpactiy);
    if(videoController.videoOpactiy==0){
        $("#backgroundVideo").hide();
    }else
        $("#backgroundVideo").show();



}






/**
 * Callback for "Ended" Video Event
 */
videoController.endedSong = function () {
    videoController.stopSong();

    /*
     videoController.isPlaying = false;
     videoController.disableStopControl(true);
     //$("#videoplayer").css("opacity", "0");
     //$("#videoplayer").css("pointer-events", "none");

     $(".videoControlElements-time-loaded").hide();

     // $(".videoControlElements-playpause-button button").addClass("looped");
     uiController.playedFirst = false;
     uiController.updateUI();

     if (!playbackController.isLoading)
     playbackController.playNextSong();
     */
    mediaController.mediaEnded();

}


/**
 * Callback for "Playing" Video Event
 * @type {*}
 */
videoController.playingSong = function () {

    if (playbackController.playingSong) {
        playbackController.playingSongTimer = Date.now();
        $("#backgroundVideo").addClass("animated")

        $("#backgroundVideo").css("opacity", videoController.videoOpactiy);


        $("#siteLogoImage").attr("src", "public/img/sites/" + mediaController.getSiteLogo());
        $("#siteLogo").show();

        videoController.disableExternalSiteControl(false);
        videoController.disableFullscreenControl(false);

        // console.log("PLAYINGGGGGGG")
        //playbackController.isLoading = false;



        $(".videoControlElements-time-loaded").show();

        $(".videoControlElements-playpause-button button").removeClass("looped");

        if (!playbackController.playingSong.isAudioFile) {

            /* if ($("#videoplayer").css("opacity") < 1) {
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

             if (videoController.isPlaying) {
             $("#videoplayer").css("opacity", "1");
             $("#videoplayer").css("pointer-events", "auto");

             }
             }, 200)
             uiController.styleVideo();
             }, 100)
             }, 100)
             } */

            uiController.updateUI(true);
        }
    }

}


/**
 * Resize Video to normalized Size
 * @param videoSelector   Selector of the Video Element

 videoController.normalizeVideoSize = function (videoSelector) {

    if (!playbackController.playingSong.isAudioFile) {
        if (this.videoWidth > 0) {
            var setHeight = function () {
                var height = $(videoSelector).outerHeight();//.videoControlElements-mediaelement
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

};
 */

//Helper Functions

/**
 * Converts seconds to 00:00 format
 * @param time
 * @param forceHours
 * @param showFrameCount
 * @param fps
 * @returns {string}
 */
videoController.secondsToTimeCode = function (time, forceHours, showFrameCount, fps) {
    //add framecount
    if (typeof showFrameCount == 'undefined') {
        showFrameCount = false;
    } else if (typeof fps == 'undefined') {
        fps = 25;
    }

    var hours = Math.floor(time / 3600) % 24,
        minutes = Math.floor(time / 60) % 60,
        seconds = Math.floor(time % 60),
        frames = Math.floor(((time % 1) * fps).toFixed(3)),
        result =
            ( (forceHours || hours > 0) ? (hours < 10 ? '0' + hours : hours) + ':' : '')
                + (minutes < 10 ? '0' + minutes : minutes) + ':'
                + (seconds < 10 ? '0' + seconds : seconds)
                + ((showFrameCount) ? ':' + (frames < 10 ? '0' + frames : frames) : '');

    return result;
}





