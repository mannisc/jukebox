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
    var controls =  $(".videoControlElements-controls");

    controls.find(".videoControlElements-prevtrack-button").click(function () {
        if(videoController.prevEnabled)
            alert("prev")
    })

    controls.find(".videoControlElements-playpause-button").click(function () {
        if(videoController.playpauseEnabled&&videoController.videoPlayer)
            videoController.videoPlayer.playpause();

    })

    controls.find(".videoControlElements-stop-button").click(function () {
        if(videoController.stopEnabled&&videoController.videoPlayer)
            videoController.videoPlayer.stop();
    })


    controls.find(".videoControlElements-nexttrack-button").click(function () {
        if(videoController.nextEnabled)
            alert("next")

    })


    controls.find(".videoControlElements-shuffle-button").click(function () {
        if(videoController.shuffleEnabled)
         alert("shuffle")
    })

    controls.find(".videoControlElements-time-rail").click(function (event) {
        if(videoController.timerailEnabled) {
            var total = controls.find('.videoControlElements-time-total'),
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


    controls.find(".videoControlElements-volume-button").click(function () {
        if(videoController.volumeEnabled&&videoController.videoPlayer)
            videoController.videoPlayer.mute();
    })

    controls.find(".videoControlElements-volume-button").mouseover(function () {
        if(videoController.volumeEnabled)
          controls.find(".videoControlElements-volume-slider").show();
    })

    controls.find(".videoControlElements-volume-button").mouseout(function () {
        controls.find(".videoControlElements-volume-slider").hide();
    })


    controls.find(".videoControlElements-fullscreen-button").click(function () {
        if(videoController.fullscreenEnabled&&videoController.videoPlayer)
            videoController.videoPlayer.fullscreen();
    })


    controls.find(".videoControlElements-button-choose-version").click(function () {
        if(videoController.versionsEnabled)
        mediaController.getVersions();
    })

    controls.find(".videoControlElements-button-lyrics").click(function () {
        if(videoController.lyricsEnabled)

            mediaController.toggleLyrics();
    })

    controls.find(".videoControlElements-button-facebook").click(function () {
        if(videoController.sharesocialEnabled)

            mediaController.postOnFacebook();
    })

}