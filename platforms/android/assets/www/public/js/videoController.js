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

/* Currently used Videoplayer */

videoController.videoPlayer = mediaelementPlayer;

//Progress Time- use setter
videoController.progressTime = 0;
//Max Time - use setter
videoController.maxTime = 0;

/*Enabled Buttons*/
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
 * Init the videoControlls, bind events
 */
videoController.init = function(){

    videoController.controls =  $(".videoControlElements-controls");

    videoController.controls.find(".videoControlElements-prevtrack-button").click(function () {
        if(videoController.prevEnabled)
            alert("prev")
    })

    videoController.controls.find(".videoControlElements-playpause-button").click(function () {
        if(videoController.playpauseEnabled&&videoController.videoPlayer)
            videoController.videoPlayer.playpause();

    })

    videoController.controls.find(".videoControlElements-stop-button").click(function () {
        if(videoController.stopEnabled&&videoController.videoPlayer)
            videoController.videoPlayer.stop();
    })


    videoController.controls.find(".videoControlElements-nexttrack-button").click(function () {
        if(videoController.nextEnabled)
            alert("next")

    })


    videoController.controls.find(".videoControlElements-shuffle-button").click(function () {
        if(videoController.shuffleEnabled)
         alert("shuffle")
    })

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


    videoController.controls.find(".videoControlElements-fullscreen-button").click(function () {
        if(videoController.fullscreenEnabled&&videoController.videoPlayer)
            videoController.videoPlayer.fullscreen();
    })


    videoController.controls.find(".videoControlElements-button-choose-version").click(function () {
        if(videoController.versionsEnabled)
        mediaController.getVersions();
    })

    videoController.controls.find(".videoControlElements-button-lyrics").click(function () {
        if(videoController.lyricsEnabled)

            mediaController.toggleLyrics();
    })

    videoController.controls.find(".videoControlElements-button-facebook").click(function () {
        if(videoController.sharesocialEnabled)

            mediaController.postOnFacebook();
    })


    videoController.setMaxTime(341);
    videoController.setProgressTime(78);
    videoController.setBufferedPercentage(0.6);
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