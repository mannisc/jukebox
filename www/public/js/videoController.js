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

videoController.videoPlayer = null;


videoController.init = function(){

    $(".videoControlElements-prevtrack-button").click(function () {

        alert("prev")

        if(videoController.videoPlayer)
            videoController.videoPlayer.prev();

    })

    $(".videoControlElements-playpause-button").click(function () {

        alert("playpause")

        if(videoController.videoPlayer)
            videoController.videoPlayer.playpause();

    })

    $(".videoControlElements-stop-button").click(function () {

        alert("stop")
        if(videoController.videoPlayer)
            videoController.videoPlayer.stop();
    })


    $(".videoControlElements-nexttrack-button").click(function () {

        alert("next")
        if(videoController.videoPlayer)
            videoController.videoPlayer.next();
    })


    $(".videoControlElements-shuffle-button").click(function () {

        alert("shuffle")

    })

    $(".videoControlElements-time-rail").click(function () {

        alert("time-rail")

    })



    $(".videoControlElements-volume-button").click(function () {
        alert("mute")
        if(videoController.videoPlayer)
            videoController.videoPlayer.mute();
    })

    $(".videoControlElements-volume-button").mouseover(function () {
      $(".videoControlElements-volume-slider").show();
    })

    $(".videoControlElements-volume-button").mouseout(function () {
        $(".videoControlElements-volume-slider").hide();
    })


    $(".videoControlElements-fullscreen-button").click(function () {
        alert("fullscreen")
        if(videoController.videoPlayer)
            videoController.videoPlayer.fullscreen();
    })


    $(".videoControlElements-button-choose-version").click(function () {
        alert("version")
        mediaController.getVersions();
    })

    $(".videoControlElements-button-lyrics").click(function () {
        alert("lyrics")
        mediaController.toggleLyrics();
    })

    $(".videoControlElements-button-facebook").click(function () {
        alert("fb")
        mediaController.postOnFacebook();
    })

}