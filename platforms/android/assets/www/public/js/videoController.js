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
videoController.videoPlayer = mediaelementPlayer;



//Video is playing
videoController.isPlaying = false;

//Progress Time- use setter
videoController.progressTime = 0;
//Max Time - use setter
videoController.maxTime = 0;

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
videoController.init = function(){

    videoController.controls =  $(".videoControlElements-controls");

    //Play Previous Song
    videoController.controls.find(".videoControlElements-prevtrack-button").click(function () {
        if(videoController.prevEnabled)
            playlistController.playPrevSong();
    })

    //Play Pause Song
    videoController.controls.find(".videoControlElements-playpause-button").click(function () {
        if(videoController.playpauseEnabled&&videoController.videoPlayer){
            if(videoController.isPlaying){
                videoController.controls.find(".videoControlElements-pause").removeClass("videoControlElements-pause").addClass("videoControlElements-play");
                videoController.videoPlayer.pause();
            }
            else{
                videoController.controls.find(".videoControlElements-play").removeClass("videoControlElements-play").addClass("videoControlElements-pause");
                videoController.videoPlayer.play();
            }

            videoController.isPlaying = !videoController.isPlaying;
        }

    })

    //Stop Song
    videoController.controls.find(".videoControlElements-stop-button").click(function () {
        if(videoController.stopEnabled&&videoController.videoPlayer)
            videoController.videoPlayer.stop();
    })

    //Play Next Song

    videoController.controls.find(".videoControlElements-nexttrack-button").click(function () {
        if(videoController.nextEnabled)
            playlistController.playNextSong();
    })


    //Shuffle Songs
    videoController.controls.find(".videoControlElements-shuffle-button").click(function () {
        if(videoController.shuffleEnabled)
            playlistController.toggleShuffleSongs();
    })

    //Time Rail
    videoController.controls.find(".videoControlElements-time-rail").click(function (event) {
        if(videoController.timerailEnabled) {
            var total =  videoController.controls.find('.videoControlElements-time-total'),
                //loaded  = controls.find('.videoControlElements-time-loaded'),
                //current  = controls.find('.videoControlElements-time-current'),
                //handle  = controls.find('.videoControlElements-time-handle'),
                x = event.pageX,
                offset = total.offset(),
                width = total.outerWidth(true)*MediaElementPlayer.prototype.extoptions.scale/1.023,
                pos,
                percentage;

            if (x < offset.left) {
                x = offset.left;
            } else if (x > width + offset.left) {
                x = width + offset.left;
            }

            pos = x - offset.left;
            percentage = (pos / width);
            videoController.videoPlayer.setCurrentTime(percentage)
        }
    })

    //Volume
    videoController.controls.find(".videoControlElements-volume-button").click(function () {
        if(videoController.volumeEnabled&&videoController.videoPlayer)
            videoController.videoPlayer.mute();
    })

    videoController.controls.find(".videoControlElements-volume-button").mouseover(function () {
        if(videoController.volumeEnabled)
            videoController.controls.find(".videoControlElements-volume-slider").show();
    })

    videoController.controls.find(".videoControlElements-volume-button").mouseout(function () {
        videoController.controls.find(".videoControlElements-volume-slider").hide();
    })


    //Fullscreen
    videoController.controls.find(".videoControlElements-fullscreen-button").click(function () {
        if(videoController.fullscreenEnabled&&videoController.videoPlayer)
            videoController.videoPlayer.fullscreen();
    })


    //Choose Version
    videoController.controls.find(".videoControlElements-button-choose-version").click(function () {
        if(videoController.versionsEnabled)
        mediaController.getVersions();
    })

    //Show Lyrics
    videoController.controls.find(".videoControlElements-button-lyrics").click(function () {
        if(videoController.lyricsEnabled)

            mediaController.toggleLyrics();
    })

    //Share Social
    videoController.controls.find(".videoControlElements-button-facebook").click(function () {
        if(videoController.sharesocialEnabled)

            mediaController.postOnFacebook();
    })


    //TODO Remove
    videoController.setMaxTime(341);
    videoController.setProgressTime(78);
    videoController.setBufferedPercentage(0.6);
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
        $(".videoControlElements-shuffle-button button").css("opacity", "0.5");

        videoController.shuffleEnabled = false;
    } else {
        $(".videoControlElements-nexttrack-button button").css("opacity", "1");
        $(".videoControlElements-prevtrack-button button").css("opacity", "1");
        if (playlistController.shuffleMode){
           videoController.shuffleEnabled = true;
          $(".videoControlElements-shuffle-button button").css("opacity", "1");
        } else{
           videoController.shuffleEnabled = false;
           $(".videoControlElements-shuffle-button button").css("opacity", "0.5");

        }
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
 * Set Progress in percentage
 */
videoController.setProgressPercentage = function(percentage){

    var total =  videoController.controls.find('.videoControlElements-time-total');
    if(percentage<0)
        percentage = 0;
    else if(percentage>1)
        percentage = 1;
    videoController.controls.find(".videoControlElements-time-current").css("width",total.width()*percentage)

}


/**
 * Set Buffered in percentage
 */
videoController.setBufferedPercentage = function(percentage){

    var total =  videoController.controls.find('.videoControlElements-time-total');
    if(percentage<0)
        percentage = 0;
    else if(percentage>1)
        percentage = 1;
    videoController.controls.find(".videoControlElements-time-loaded").css("width",total.width()*percentage)

}



/**
 * Set Progress in seconds
 */
videoController.setProgressTime = function(time){
    videoController.progressTime = time;
    videoController.controls.find(".videoControlElements-currenttime").text(videoController.secondsToTimeCode(time,false,false,false));

    if(videoController.maxTime&&videoController.maxTime>0)
       videoController.setProgressPercentage(videoController.progressTime/videoController.maxTime)

}

/**
 * Set Song length in seconds
 */
videoController.setMaxTime = function(time){
    videoController.maxTime = time;
    videoController.controls.find(".videoControlElements-duration").text(videoController.secondsToTimeCode(time,false,false,false));

    if(videoController.maxTime&&videoController.maxTime>0)
        videoController.setProgressPercentage(videoController.progressTime/videoController.maxTime)

}


/**
 * Called by Videoplayer when video ended
 */
videoController.videoEnded = function(){



}





 //Helper Functions

/**
 * Converts seconds to 00:00 format
 * @param time
 * @param forceHours
 * @param showFrameCount
 * @param fps
 * @returns {string}
 */
videoController.secondsToTimeCode = function(time, forceHours, showFrameCount, fps) {
    //add framecount
    if (typeof showFrameCount == 'undefined') {
        showFrameCount=false;
    } else if(typeof fps == 'undefined') {
        fps = 25;
    }

    var hours = Math.floor(time / 3600) % 24,
        minutes = Math.floor(time / 60) % 60,
        seconds = Math.floor(time % 60),
        frames = Math.floor(((time % 1)*fps).toFixed(3)),
        result =
            ( (forceHours || hours > 0) ? (hours < 10 ? '0' + hours : hours) + ':' : '')
                + (minutes < 10 ? '0' + minutes : minutes) + ':'
                + (seconds < 10 ? '0' + seconds : seconds)
                + ((showFrameCount) ? ':' + (frames < 10 ? '0' + frames : frames) : '');

    return result;
}





