/** * embedPlayer.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 12.03.14 - 00:49
 * @copyright  */



var embedPlayer = function () {

};

embedPlayer.dmplayer    = null;

embedPlayer.active      = 0;
embedPlayer.dailymotion = 0;
embedPlayer.dailymotionVideoID = 0;

embedPlayer.bufferedTime = 0;
embedPlayer.duration = 0;
embedPlayer.currentTime = 0;


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
        var PARAMS = {background : 'ABE866', autoplay : 1, chromeless : 1,
            foreground : '000000', related: 0, quality: 720,
            html : 1, highlight : '857580',
            info : 1, network : 'dsl', autoplay : 0};
        embedPlayer.dmplayer = DM.player("dmplayer", {width: "100%", height: "100%", params: PARAMS});
        embedPlayer.dmplayer.addEventListener("apiready", function(e)
        {
            embedPlayer.dmplayer.load(videoid);
            $(".mejs-playpause-button").find("button").css("opacity", "1");

            $(".mejs-playpause-button button").addClass("mejs-pause");



            $(".mejs-time-buffering").hide();
            embedPlayer.dmplayer.play();
            $(".mejs-playpause-button").click();
            $("#embedplayer").show();
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





embedPlayer.updateDuration = function (){
    if(embedPlayer.active == 1){
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
   if(embedPlayer.active == 1){
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
    if(embedPlayer.active == 1){
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
    uiController.mediaElementPlayer.pause();
    $(".mejs-time-buffering").fadeOut();
    $("#dmplayer").show();
    $("#player1").hide();
    $("#videoplayer").hide();
    embedPlayer.active = 1;
    embedPlayer.bufferedTime = 0;
    embedPlayer.duration = 0;
    embedPlayer.currentTime = 0;

}

embedPlayer.disable = function () {
    embedPlayer.stop();
    $("#dmplayer").hide();
    $("#player1").show();
    $("#videoplayer").show();
    embedPlayer.active = 0;
    if(embedPlayer.dailymotion &&  embedPlayer.dmplayer){
        embedPlayer.dmplayer.removeEventListener("apiready");

        embedPlayer.dmplayer.removeEventListener("durationchange");

        embedPlayer.dmplayer.removeEventListener("timeupdate");

        embedPlayer.dmplayer.removeEventListener("progress");

    }
    embedPlayer.dmplayer = null;
    embedPlayer.dailymotion = 0;

}

embedPlayer.setLoaded = function () {

}

embedPlayer.setVolume = function (volume) {
    if(embedPlayer.dailymotion  && embedPlayer.dmplayer){
        embedPlayer.dmplayer.setVolume(volume);
    }

}

embedPlayer.setFullscreen = function (fullscreen) {
  //  embedPlayer.dmplayer.fullscreen(fullscreen);
}

embedPlayer.play = function () {
    if(embedPlayer.dailymotion  && embedPlayer.dmplayer){
        embedPlayer.dmplayer.play();
    }
    setTimeout(function () {
        $(".mejs-time-buffering").fadeOut();
    }, 300);

}
embedPlayer.pause = function () {
    if(embedPlayer.dailymotion  && embedPlayer.dmplayer){
        embedPlayer.dmplayer.pause();
    }

}

embedPlayer.stop = function () {
    if(embedPlayer.dailymotion  && embedPlayer.dmplayer){
        embedPlayer.dmplayer.pause();
        embedPlayer.dmplayer.seek(0);
    }
}

embedPlayer.seek = function (time) {
    if(embedPlayer.dailymotion  && embedPlayer.dmplayer){
        embedPlayer.dmplayer.seek(time* embedPlayer.duration);
    }

}



