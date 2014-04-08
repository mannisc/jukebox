/**
 * dailymotionPlayer.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 07.04.14 - 09:25
 */

var dailymotionPlayer = function () {
};

dailymotionPlayer.dmplayer    = null;
dailymotionPlayer.active      = 0;
dailymotionPlayer.dailymotion = 0;
dailymotionPlayer.dailymotionVideoID = 0;
dailymotionPlayer.bufferedTime = 0;
dailymotionPlayer.duration = 0;
dailymotionPlayer.currentTime = 0;
dailymotionPlayer.apiready = false;


window.dmAsyncInit = function()
{

}

/**
 * Get VideoID of Dailymotion-Video
 */

function getDailyMotionId(url) {
    var m = url.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/);
    if (m !== null) {
        if(m[4] !== undefined) {
            return m[4];
        }
        return m[2];
    }
    return null;
}



/**
 * Init Player
 */
dailymotionPlayer.init = function () {


};

/**
 * Set Progress in percentage
 */
dailymotionPlayer.setProgressPercentage = function(percentage){

    //Set progress in videoController
    videoController.setProgressPercentage(percentage)

}



/**
 * Load Player with Url before using
 */

dailymotionPlayer.load = function (url) {


    dailymotionPlayer.active = 1;
    dailymotionPlayer.bufferedTime = 0;
    dailymotionPlayer.duration = 0;
    dailymotionPlayer.currentTime = 0;
    dailymotionPlayer.apiready = false;

    var videoid = getDailyMotionId(url);

    //  $("#dmplayer").addClass("backgroundVideo").insertAfter("#backgroundImage");
    $("#dailymotionPlayer").hide();
    if(videoid){
        $("#dmplayer").addClass("iframeVideo").insertAfter("#backgroundImage");
        dailymotionPlayer.dailymotionVideoID = videoid;
        var PARAMS = {background : 'ABE866', autoplay : 0, chromeless : 1,
            foreground : '000000', related: 0, quality: 720,
            html : 1, highlight : '857580',
            info : 1, network : 'dsl', autoplay : 0};
        dailymotionPlayer.dmplayer = DM.player("dmplayer", {video: videoid,width: "100%", height: "100%", params: PARAMS});
        dailymotionPlayer.dmplayer.addEventListener("apiready", function(e)
        {
            $(".mejs-time-buffering").hide();
            $("#dailymotionPlayer").show();
            $("#dmplayer").show();
            dailymotionPlayer.apiready = true;
            dailymotionPlayer.dmplayer.play();
            videoController.playingSong();
        });

        dailymotionPlayer.dmplayer.addEventListener("error", function(e)
        {
            dailymotionPlayer.error();
        });

        dailymotionPlayer.dmplayer.addEventListener("canplaythrough", function(e)
        {
            dailymotionPlayer.dmplayer.play();
        });

        dailymotionPlayer.dmplayer.addEventListener("durationchange", function(e)
        {
            dailymotionPlayer.duration = e.target.duration;
           // dailymotionPlayer.updateDuration();
            videoController.setMaxTime(dailymotionPlayer.duration);


        });
        dailymotionPlayer.dmplayer.addEventListener("timeupdate", function(e)
        {
            dailymotionPlayer.currentTime = e.target.currentTime;
            videoController.setProgressTime(dailymotionPlayer.currentTime);
        });
        dailymotionPlayer.dmplayer.addEventListener("progress", function(e)
        {
            dailymotionPlayer.bufferedTime = e.target.bufferedTime;
            if(dailymotionPlayer.duration>0){
              videoController.setBufferedPercentage(dailymotionPlayer.bufferedTime/dailymotionPlayer.duration);
            }
        });

        dailymotionPlayer.dmplayer.addEventListener("ended", function(e)
        {
            dailymotionPlayer.mediaEnded();
            videoController.endedSong();
        });

    }
};

/**
 * Unload Player after using
 */
dailymotionPlayer.unload = function () {
    dailymotionPlayer.active = 0;
    dailymotionPlayer.stop();
    dailymotionPlayer.close();
    $("#dmplayer").hide();
    if(dailymotionPlayer.dailymotion &&  dailymotionPlayer.dmplayer){
        dailymotionPlayer.dmplayer.removeEventListener("apiready");

        dailymotionPlayer.dmplayer.removeEventListener("durationchange");

        dailymotionPlayer.dmplayer.removeEventListener("timeupdate");

        dailymotionPlayer.dmplayer.removeEventListener("progress");

    }
    dailymotionPlayer.dmplayer = null;
    dailymotionPlayer.dailymotion = 0;
    dailymotionPlayer.apiready = false;

};


dailymotionPlayer.setVolume = function (volume) {
    if(dailymotionPlayer.dmplayer && dailymotionPlayer.apiready){
        dailymotionPlayer.dmplayer.setVolume(volume);
    }

}

/**
 * Set Fullscreen Mode
 * @param mode  0: Window ,1: Background ,2: Fullscreen
 */
dailymotionPlayer.setFullscreen = function (fullscreen) {
    //  dailymotionPlayer.dmplayer.fullscreen(fullscreen);
}

dailymotionPlayer.play = function () {
    if(dailymotionPlayer.dmplayer && dailymotionPlayer.apiready){
        dailymotionPlayer.dmplayer.play();
    }
    setTimeout(function () {
        $(".mejs-time-buffering").fadeOut();
    }, 300);

}
dailymotionPlayer.pause = function () {
    if(dailymotionPlayer.dmplayer && dailymotionPlayer.apiready){
        dailymotionPlayer.dmplayer.pause();
    }

}

dailymotionPlayer.stop = function () {
    if(dailymotionPlayer.dmplayer && dailymotionPlayer.apiready){
        dailymotionPlayer.dmplayer.pause();
        dailymotionPlayer.dmplayer.seek(0);
    }
}

dailymotionPlayer.setCurrentTime = function(percentage){
    if(dailymotionPlayer.dmplayer && dailymotionPlayer.apiready){
        dailymotionPlayer.dmplayer.seek(percentage* dailymotionPlayer.duration);
    }

}


dailymotionPlayer.mediaEnded = function(){
    videoController.endedSong();
    mediaController.mediaEnded();
}


dailymotionPlayer.error= function (){
    if(dailymotionPlayer.active == 1){
        //TODO FEEDBACK AN SERVER!
        //mediaController.playNextVersion();
    }

}



