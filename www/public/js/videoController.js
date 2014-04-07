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

    $(".videoControlElements-prevtrack-button").click(function () {
        if(videoController.prevEnabled)
            alert("prev")
    })

    $(".videoControlElements-playpause-button").click(function () {
        if(videoController.playpauseEnabled&&videoController.videoPlayer)
            videoController.videoPlayer.playpause();

    })

    $(".videoControlElements-stop-button").click(function () {
        if(videoController.stopEnabled&&videoController.videoPlayer)
            videoController.videoPlayer.stop();
    })


    $(".videoControlElements-nexttrack-button").click(function () {
        if(videoController.nextEnabled)
            alert("next")

    })


    $(".videoControlElements-shuffle-button").click(function () {
        if(videoController.shuffleEnabled)
         alert("shuffle")
    })

    $(".videoControlElements-time-rail").click(function () {
        if(videoController.timerailEnabled)
         alert("time-rail")
    })


    $(".videoControlElements-volume-button").click(function () {
        if(videoController.volumeEnabled&&videoController.videoPlayer)
            videoController.videoPlayer.mute();
    })

    $(".videoControlElements-volume-button").mouseover(function () {
        if(videoController.volumeEnabled)
          $(".videoControlElements-volume-slider").show();
    })

    $(".videoControlElements-volume-button").mouseout(function () {
        $(".videoControlElements-volume-slider").hide();
    })


    $(".videoControlElements-fullscreen-button").click(function () {
        if(videoController.fullscreenEnabled&&videoController.videoPlayer)
            videoController.videoPlayer.fullscreen();
    })


    $(".videoControlElements-button-choose-version").click(function () {
        if(videoController.versionsEnabled)
        mediaController.getVersions();
    })

    $(".videoControlElements-button-lyrics").click(function () {
        if(videoController.lyricsEnabled)

            mediaController.toggleLyrics();
    })

    $(".videoControlElements-button-facebook").click(function () {
        if(videoController.sharesocialEnabled)

            mediaController.postOnFacebook();
    })

}