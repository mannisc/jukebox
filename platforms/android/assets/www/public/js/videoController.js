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

videoController.videoPlayerList[0][0] = new mediaelementPlayer("#mediaemelemtjsPlayer1");

videoController.videoPlayerList[1][0] = dailymotionPlayer;

videoController.videoPlayer = videoController.videoPlayerList[0][0];////embeddedPlayer;//

videoController.isEmbedded = false;


//Video is playing
videoController.isPlaying = false;

//Scale Factor (touch)
videoController.scaleFactor = 1.5;


//Video Position Mode 0: Window ,1: Background ,2: Fullscreen
videoController.fullscreenMode = 1;


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
videoController.fullscreenEnabled = true;
videoController.versionsEnabled = true;
videoController.lyricsEnabled = true;
videoController.sharesocialEnabled = true;


/**
 * Init the videoController, bind events to Buttons
 */
videoController.init = function () {


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
        if (videoController.timerailEnabled&&playbackController.playingSong) {
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
            videoController.videoPlayer.setVolume(videoController.volume);
            videoController.positionVolumeHandle(videoController.volume);
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
            videoController.positionVolumeHandle(videoController.volume);
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
            videoController.positionVolumeHandle(videoController.volume);

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
    videoController.controls.find(".videoControlElements-fullscreen-button").click(function () {
        if (videoController.fullscreenEnabled && videoController.videoPlayer){

            //  videoController.fullscreenMode = videoController.fullscreenMode + 1;
            //  if (uiController.fullscreenMode > 2)
            //    uiController.fullscreenMode = 0;

            videoController.updateFullscreenMode();

        }
    });


    //Choose Version
    videoController.controls.find(".videoControlElements-button-choose-version").click(function () {
        if (videoController.versionsEnabled)
            mediaController.getVersions();
    });

    //Show Lyrics
    videoController.controls.find(".videoControlElements-button-lyrics").click(function () {
        if (videoController.lyricsEnabled)

            mediaController.toggleLyrics();
    });

    //Share Social
    videoController.controls.find(".videoControlElements-button-facebook").click(function () {
        if (videoController.sharesocialEnabled)

            mediaController.postOnFacebook();
    });


    //Initial Settings

    videoController.positionVolumeHandle(videoController.volume);
    videoController.disablePlayStopControls(true);
    videoController.disableControls(true);

    uiController.noVideoClickTimer = 0;




    //TODO Remove
    videoController.setMaxTime(341);
    videoController.setProgressTime(78);
    videoController.setBufferedPercentage(0.6);
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

videoController.isEmbedVideo= function(videoURL){
    if(videoURL.search("dailymotion.com") > -1 ){
        return videoController.videoPlayerList[1][0];
    }
    return null;
}

/**
 * Load Song, decide which Player to use
 * @type {*}
 */
videoController.loadSongInSuitablePlayer = function (streamURL, videoURL) {
    videoController.setMaxTime(0);
    videoController.setProgressPercentage(0);
    videoController.setBufferedPercentage(0);

    if(videoController.videoPlayer&& videoController.videoPlayer.unload())
        videoController.videoPlayer.unload();

    //TODO Select embedded Player
    var player = videoController.isEmbedVideo(videoURL);
    if (player != null) {
        videoController.isEmbedded = true;
        /* embedPlayer.enable();
         uiController.mediaElementPlayer.setSrc("http://0.0.0.0");
         uiController.mediaElementPlayer.load();
         uiController.mediaElementPlayer.play();
         embedPlayer.loadDailymotion(videoURL);
         */
        videoController.videoPlayer = player;
        videoController.videoPlayer.load(videoURL);
    }
    //Mediaelement
    else {
        videoController.isEmbedded = false;
        /*embedPlayer.disable();
         uiController.mediaElementPlayer.setSrc(streamURL);
         uiController.mediaElementPlayer.load();
         uiController.mediaElementPlayer.play();
         */

        videoController.videoPlayer = videoController.videoPlayerList[0][0];
        videoController.videoPlayer.load(streamURL);

    }

    videoController.updateFullscreenMode();


}


/**
 * Play Song
 * @type {*}
 */
videoController.playSong = function () {
    if (!videoController.isPlaying) {
        videoController.controls.find(".videoControlElements-play").removeClass("videoControlElements-play").addClass("videoControlElements-pause");
        videoController.videoPlayer.play();
        videoController.isPlaying = true;

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

        if (videoController.isPlaying && !playbackController.isLoading) {
            $($(".songlist li.loadedsong").get(0)).addClass("pausing");
            $(".songlist li.loadedsong").removeClass("playing");

        }
        videoController.isPlaying = false;
    }
}



/**
 * Stop Song
 * @type {*}
 */
videoController.stopSong = function () {
    if (videoController.isPlaying) {
    videoController.pauseSong();
    videoController.videoPlayer.stop();

    videoController.setProgressPercentage(0);

    videoController.isPlaying = false;

    $(".songlist li.loadedsong").removeClass("pausing");
    $($(".songlist li.loadedsong").get(0)).addClass("playing");

    if ($(this).find("button").css("opacity") == 1) {

        videoController.disableStopControl(true);

        $(".videoControlElements-playpause-button button").removeClass("looped");

        $("#videoplayer").css("opacity", "0");
        $("#videoplayer").css("pointer-events", "none");

        $(".mejs-time-loaded").hide();
        if (!playbackController.playingOldSong) {
            playbackController.resetPlayingSong();

        }
    }
   }
}





/**
 * Set Fullscreen Mode
 * @type {*}
 */
videoController.updateFullscreenMode = function () {

    uiController.setScreenMode();
    videoController.videoPlayer.setFullscreenMode(videoController.fullscreenMode);
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

    if(updateVideo&&videoController.videoPlayer&&playbackController.playingSong&&!playbackController.isLoading)
       videoController.videoPlayer.setProgressPercentage(percentage);
}


/**
 * Set Progress in seconds
 */
videoController.setProgressTime = function (time,updateVideo) {
    videoController.progressTime = time;
    videoController.controls.find(".videoControlElements-currenttime").text(videoController.secondsToTimeCode(time, false, false, false));

    if (videoController.maxTime && videoController.maxTime > 0)
        videoController.setProgressPercentage(videoController.progressTime / videoController.maxTime,updateVideo)

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
videoController.positionVolumeHandle = function (volume, secondTry) {
    var volumeSlider = videoController.controls.find('.videoControlElements-volume-slider'),
        volumeTotal = videoController.controls.find('.videoControlElements-volume-total'),
        volumeCurrent = videoController.controls.find('.videoControlElements-volume-current'),
        volumeHandle = videoController.controls.find('.videoControlElements-volume-handle'),
        mute = $(".videoControlElements-volume-button");
    if (!volumeSlider.is(':visible') && typeof secondTry == 'undefined') {
        volumeSlider.show();
        videoController.positionVolumeHandle(volume, true);
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
}


/**
 * Callback for "Ended" Video Event
 */
videoController.endedSong = function () {

    mediaController.sendRating("2");
    document.title = $scope.appTitle;
    videoController.isPlaying = false;
    videoController.disableStopControl(true);
    $("#videoplayer").css("opacity", "0");
    $("#videoplayer").css("pointer-events", "none");

    $(".mejs-time-loaded").hide();

    $(".mejs-playpause-button button").addClass("looped");
    uiController.playedFirst = false;
    uiController.updateUI();

    if (!playbackController.isLoading)
        playbackController.playNextSong();

    mediaController.mediaEnded();
}






/**
 * Callback for "Playing" Video Event
 * @type {*}
 */
videoController.playingSong = function () {

    if (playbackController.playingSong) {

        //   helperFunctions.clearBackground(".songlist li.loadedsong.stillloading #loadingSongImg");
        $(".songlist li.loadedsong.stillloading .loadingSongImg").hide();

        $($(".songlist li.loadedsong").get(0)).addClass("playing");
        $(".songlist li.loadedsong").removeClass("pausing");

        playbackController.isLoading = false;
        videoController.isPlaying = true;

        videoController.disablePlayStopControls(false);

        $(".videoControlElements-time-loaded").show();

        $(".videoControlElements-playpause-button button").removeClass("looped");

        if (!playbackController.playingSong.isAudioFile) {

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

                            if (videoController.isPlaying) {
                                $("#videoplayer").css("opacity", "1");
                                $("#videoplayer").css("pointer-events", "auto");

                            }
                        }, 200)
                        uiController.styleVideo();
                    }, 100)
                }, 100)
            }

            uiController.playedFirst = true;
            uiController.updateUI(true);
        }
    }

}


/**
 * Resize Video to normalized Size
 * @param videoSelector   Selector of the Video Element
 */
videoController.normalizeVideoSize = function(videoSelector){

    if (!playbackController.playingSong.isAudioFile) {
        if (this.videoWidth > 0) {
            var setHeight = function () {
                var height = $(videoSelector).outerHeight();//.mejs-mediaelement
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





