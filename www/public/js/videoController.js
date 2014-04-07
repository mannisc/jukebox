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

}


/**
 * Set Progress in percentage
 */
videoController.setProgressPercentage = function(percentage){

    var total =  videoController.controls.find('.videoControlElements-time-total');

    videoController.controls.find(".videoControlElements-time-current").css("width",total.width()*percentage)

}

/**
 * Set Progress in seconds
 */
videoController.setProgressTime = function(){


}

/**
 * Set song length in seconds
 */
videoController.setMaxTime = function(){

}