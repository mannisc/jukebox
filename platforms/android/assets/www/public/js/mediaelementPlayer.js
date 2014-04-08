/**
 * mediaelementPlayer.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 07.04.14 - 12:00
 * @copyright munichDev UG
 */


var mediaelementPlayer = function () {
};


/**
 * Init Player
 */
mediaelementPlayer.init = function () {


    mediaelementPlayer.mediaElementPlayer = new MediaElementPlayer('#mediaemelemtjsPlayer', {
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

            //TODO ENABLE CLICK ON VIDEO CPLAY/PAUSE FOR ALL PLAYERS In videoController -----------
            $(".mejs-overlay-resize").click(function () {
                setTimeout(function () {
                    if (Date.now() - uiController.noVideoClickTimer > 600) {
                        videoController.playPauseSong();
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
            //TODO END -----------------------------------------------------------------------------------

            mediaElement.addEventListener("playing", function (e) {
                videoController.playingSong();
            });

            mediaElement.addEventListener("ended", function (e) {
                videoController.endedSong();
            });

            mediaElement.addEventListener("error", function (e) { //TODO VideoController Handling nötig wenn versionen embedded fähig???
                if (mediaController.currentvideoURL && embedPlayer.active == 0) {
                    mediaController.playNextVersion();
                }
            });

            mediaElement.addEventListener('loadeddata', function (e) {
                videoController.normalizeVideoSize("#mediaemelemtjsPlayerVideo");
            });
        },
        error: function () {
            console.log("Error creating mediaelementjs!");
        }
    });

};


/**
 * Load Player with Url before using
 */
mediaelementPlayer.load = function (url) {

    mediaelementPlayer.mediaElementPlayer.setSrc(url);
    mediaelementPlayer.mediaElementPlayer.load();

}

mediaelementPlayer.play = function () {
    mediaelementPlayer.mediaElementPlayer.play();
};

mediaelementPlayer.pause = function () {
    mediaelementPlayer.mediaElementPlayer.pause();


};

mediaelementPlayer.stop = function () {
    mediaelementPlayer.mediaElementPlayer.pause();

};


mediaelementPlayer.setVolume = function (volume) {
    console.log(volume);
};

/**
 * Set Fullscreen Mode
 * @param mode  0: Window ,1: Background ,2: Fullscreen
 */
mediaelementPlayer.setFullscreenMode = function (mode) {

    if (videoController.isPlaying)
        var isPlaying = true;
    else
        isPlaying = false;

    if (mode == 0) {
        $($('.mejs-fullscreen-button').get(0)).click();

    } else if (mode == 1) { //Background

        $("#mediaemelemtjsPlayer").addClass("backgroundVideo").insertAfter("#backgroundImage");

        $("#videoplayer").hide();
        if (playbackController.playingSong)
            $("#backgroundImage").hide();
        else
            $("#backgroundImage").show();

    } else if (mode == 2) {
        $("#backgroundImage").show();
        $("#videoplayer").show();

        $(".backgroundVideo").removeClass("backgroundVideo").appendTo(".mejs-mediaelement");

        $($('.mejs-fullscreen-button').get(0)).click();

    }

    if (isPlaying)
        mediaelementPlayer.play();


};


mediaelementPlayer.setCurrentTime = function (percentage) {

    //Set progress in videoController
    videoController.setProgressPercentage(percentage)


    /*
     newTime = (percentage <= 0.02) ? 0 : percentage * media.duration;

     // seek to where the mouse is
     if (mouseIsDown && newTime !== media.currentTime) {
     media.setCurrentTime(newTime);
     }
     */

}