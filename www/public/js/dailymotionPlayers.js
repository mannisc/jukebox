/**
 * dailymotionPlayer.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 07.04.14 - 09:25
 * @copyright munichDev UG
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


/**
 * Init Player
 */
dailymotionPlayer.init = function () {


};



/**
 * Load Player with Url before using
 */
dailymotionPlayer.load = function (url) {


};

/**
 * Unload Player after using
 */
dailymotionPlayer.unload = function () {


};


dailymotionPlayer.setVolume = function (volume) {
      console.log(volume);
};


dailymotionPlayer.play = function () {
    embedPlayer.play();

    alert("play")


};

dailymotionPlayer.pause = function () {
    embedPlayer.pause();

    alert("pause")

};

dailymotionPlayer.stop = function () {
    embedPlayer.stop();

    alert("stop")

};

/**
 * Set Progress in percentage
 */
dailymotionPlayer.setProgressPercentage = function(percentage){

    //Set progress in videoController
    videoController.setProgressPercentage(percentage)

}



dailymotionPlayer.mute = function () {
    alert("mute")


};

/**
 * Set Fullscreen Mode
 * @param mode  0: Window ,1: Background ,2: Fullscreen
 */
dailymotionPlayer.setFullscreenMode = function (mode) {
    alert("fullscreen")
};










var embedPlayer = function () {

};




window.dmAsyncInit = function()
{

}




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


embedPlayer.loadDailymotion = function (url) {
    embedPlayer.dailymotion = 1;
    var videoid = getDailyMotionId(url);

    //  $("#dmplayer").addClass("backgroundVideo").insertAfter("#backgroundImage");
    $("#embedplayer").hide();
    if(videoid){
        $("#dmplayer").addClass("iframeVideo").insertAfter("#backgroundImage");
        embedPlayer.dailymotionVideoID = videoid;
        var PARAMS = {background : 'ABE866', autoplay : 0, chromeless : 1,
            foreground : '000000', related: 0, quality: 720,
            html : 1, highlight : '857580',
            info : 1, network : 'dsl', autoplay : 0};
        embedPlayer.dmplayer = DM.player("dmplayer", {video: videoid,width: "100%", height: "100%", params: PARAMS});
        embedPlayer.dmplayer.addEventListener("apiready", function(e)
        {
            $(".mejs-time-buffering").hide();
            $("#embedplayer").show();
            $("#dmplayer").show();
            embedPlayer.apiready = true;
            embedPlayer.dmplayer.play();
        });

        embedPlayer.dmplayer.addEventListener("error", function(e)
        {
            embedPlayer.error();
        });

        embedPlayer.dmplayer.addEventListener("canplaythrough", function(e)
        {
            $(".mejs-playpause-button").click();
            //embedPlayer.dmplayer.play();
        });

        embedPlayer.dmplayer.addEventListener("durationchange", function(e)
        {
            embedPlayer.duration = e.target.duration;
            embedPlayer.updateDuration();


        });
        embedPlayer.dmplayer.addEventListener("timeupdate", function(e)
        {
            embedPlayer.currentTime = e.target.currentTime;
            embedPlayer.updateCurrentTime();
        });
        embedPlayer.dmplayer.addEventListener("progress", function(e)
        {
            embedPlayer.bufferedTime = e.target.bufferedTime;
            embedPlayer.updateProgress();
        });

        embedPlayer.dmplayer.addEventListener("ended", function(e)
        {
            embedPlayer.mediaEnded();
        });


    }

}

embedPlayer.loadYouTube = function (id) {

}


embedPlayer.error= function (){
    if(embedPlayer.active == 1){
        //TODO FEEDBACK AN SERVER!
        //mediaController.playNextVersion();
    }

}

embedPlayer.isEmbedVideo= function(videoURL){
    if(videoURL.search("dailymotion.com") > -1 ){
        return true;
    }
    return false;
}

embedPlayer.setSrc = function (url) {
    if(url.search("dailymotion.com") > -1 ){
        embedPlayer.loadDailymotion(url);
    }
}

embedPlayer.close = function () {
    if(embedPlayer.dailymotion  && embedPlayer.dmplayer && embedPlayer.apiready){
        embedPlayer.dmplayer.load("");
    }
}


embedPlayer.updateDuration = function (){
    if(embedPlayer.active == 1 &&  embedPlayer.apiready){
        if(embedPlayer.duration > 0){
            var t  = uiController.mediaElementPlayer;
            t.durationD.html(mejs.Utility.secondsToTimeCode(t.options.duration > 0 ? t.options.duration : embedPlayer.duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond || 25));
        }
    }
}

embedPlayer.mediaEnded = function(){
    mediaController.mediaEnded();
}

embedPlayer.updateCurrentTime = function (){
    if(embedPlayer.active == 1  &&  embedPlayer.apiready){
        if(embedPlayer.duration > 0){
            var t  = uiController.mediaElementPlayer;
            var newWidth = Math.round(t.total.width() * embedPlayer.currentTime / embedPlayer.duration),
                handlePos = newWidth - Math.round(t.handle.outerWidth(true) / 2);
            t.current.width(newWidth);
            t.handle.css('left', handlePos);

            t.currenttime.html(mejs.Utility.secondsToTimeCode(embedPlayer.currentTime, t.options.alwaysShowHours || embedPlayer.duration > 3600, t.options.showTimecodeFrameCount,  t.options.framesPerSecond || 25));

        }
    }
}

embedPlayer.updateProgress = function (){
    if(embedPlayer.active == 1  &&  embedPlayer.apiready){
        if(embedPlayer.duration > 0){
            var t  = uiController.mediaElementPlayer;
            var percent =  embedPlayer.bufferedTime/embedPlayer.duration;
            percent = Math.min(1, Math.max(0, percent));
            // update loaded bar
            if (t.loaded && t.total) {
                t.loaded.width(t.total.width() * percent);
            }
        }
    }
}

embedPlayer.enable = function () {
    $(".mejs-time-buffering").fadeOut();
    $("#player1").hide();
    $("#videoplayer").hide();
    embedPlayer.active = 1;
    embedPlayer.bufferedTime = 0;
    embedPlayer.duration = 0;
    embedPlayer.currentTime = 0;
    embedPlayer.apiready = false;

}

embedPlayer.disable = function () {
    embedPlayer.active = 0;
    embedPlayer.stop();
    embedPlayer.close();
    $("#dmplayer").hide();
    $("#player1").show();
    $("#videoplayer").show();
    if(embedPlayer.dailymotion &&  embedPlayer.dmplayer){
        embedPlayer.dmplayer.removeEventListener("apiready");

        embedPlayer.dmplayer.removeEventListener("durationchange");

        embedPlayer.dmplayer.removeEventListener("timeupdate");

        embedPlayer.dmplayer.removeEventListener("progress");

    }
    embedPlayer.dmplayer = null;
    embedPlayer.dailymotion = 0;
    embedPlayer.apiready = false;

}

embedPlayer.setLoaded = function () {

}

embedPlayer.setVolume = function (volume) {
    if(embedPlayer.dailymotion  && embedPlayer.dmplayer && embedPlayer.apiready){
        embedPlayer.dmplayer.setVolume(volume);
    }

}

embedPlayer.setFullscreen = function (fullscreen) {
    //  embedPlayer.dmplayer.fullscreen(fullscreen);
}

embedPlayer.play = function () {
    if(embedPlayer.dailymotion  && embedPlayer.dmplayer && embedPlayer.apiready){
        embedPlayer.dmplayer.play();
        alert("PLAY DM")
    }
    setTimeout(function () {
        $(".mejs-time-buffering").fadeOut();
    }, 300);

}
embedPlayer.pause = function () {
    if(embedPlayer.dailymotion  && embedPlayer.dmplayer && embedPlayer.apiready){
        embedPlayer.dmplayer.pause();
    }

}

embedPlayer.stop = function () {
    if(embedPlayer.dailymotion  && embedPlayer.dmplayer && embedPlayer.apiready){
        embedPlayer.dmplayer.pause();
        embedPlayer.dmplayer.seek(0);
    }
}

embedPlayer.seek = function (time) {
    if(embedPlayer.dailymotion  && embedPlayer.dmplayer && embedPlayer.apiready){
        embedPlayer.dmplayer.seek(time* embedPlayer.duration);
    }

}

