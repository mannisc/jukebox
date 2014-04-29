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
dailymotionPlayer.dailymotionVideoID = "";
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

dailymotionPlayer.eventListener = function () {};

dailymotionPlayer.eventListener.apiready =  function(e)
{
    if(dailymotionPlayer.dmplayer){
        if(e.target.src.search(dailymotionPlayer.dailymotionVideoID)>-1){
            $(".mejs-time-buffering").hide();
            $("#dailymotionPlayer").show();
            $("#dmplayer").show();
            dailymotionPlayer.apiready = true;
            dailymotionPlayer.dmplayer.play();
            videoController.playingSong();
        }
    }
}

dailymotionPlayer.eventListener.error = function(e)
{
    if(dailymotionPlayer.dmplayer){
        dailymotionPlayer.error();
    }
}

dailymotionPlayer.eventListener.canplaythrough = function(e)
{
    if(e.target.src.search(dailymotionPlayer.dailymotionVideoID)>-1){
        if(dailymotionPlayer.dmplayer){
            dailymotionPlayer.dmplayer.play();
        }
    }
}

dailymotionPlayer.eventListener.durationchange = function(e)
{
    if(dailymotionPlayer.dmplayer){
        dailymotionPlayer.duration = e.target.duration;
        // dailymotionPlayer.updateDuration();
        videoController.setMaxTime(dailymotionPlayer.duration);
    }
}

dailymotionPlayer.eventListener.timeupdate = function(e)
{
    if(dailymotionPlayer.dmplayer){
        dailymotionPlayer.currentTime = e.target.currentTime;
        //console.log("Progress DM: "+dailymotionPlayer.currentTime)
        videoController.setProgressTime(dailymotionPlayer.currentTime);
    }
}

dailymotionPlayer.eventListener.progress = function(e)
{
    if(dailymotionPlayer.dmplayer){
        if(e.target.src.search(dailymotionPlayer.dailymotionVideoID)>-1){
            dailymotionPlayer.bufferedTime = e.target.bufferedTime;
            if(dailymotionPlayer.duration>0){

                videoController.setBufferedPercentage(dailymotionPlayer.bufferedTime/dailymotionPlayer.duration);
            }
        }
    }

}

dailymotionPlayer.eventListener.ended = function(e)
{
    if(dailymotionPlayer.dmplayer){
        if(e.target.src.search(dailymotionPlayer.dailymotionVideoID)>-1){
            dailymotionPlayer.mediaEnded();
            videoController.endedSong();
        }
    }
}


/**
 * Load Player with Url before using
 */

dailymotionPlayer.load = function (url) {
  console.dir("LOAD: "+url);

    dailymotionPlayer.active = 1;
    dailymotionPlayer.bufferedTime = 0;
    dailymotionPlayer.duration = 0;
    dailymotionPlayer.currentTime = 0;
    dailymotionPlayer.apiready = false;

    var videoid = getDailyMotionId(url);

    $("#dailymotionPlayer").hide();
    if(videoid){
        $("#dmplayer").addClass("iframeVideo").appendTo("#backgroundVideo");
        dailymotionPlayer.dailymotionVideoID = videoid;
        var PARAMS = {background : 'ABE866', autoplay : 0, chromeless : 1,
            foreground : '000000', related: 0, quality: 720,
            html : 1, highlight : '857580',
            info : 1, network : 'dsl', autoplay : 0};
        dailymotionPlayer.dmplayer = DM.player("dmplayer", {video: videoid,width: "100%", height: "100%", params: PARAMS});
        dailymotionPlayer.dmplayer.addEventListener("apiready",dailymotionPlayer.eventListener.apiready);

        dailymotionPlayer.dmplayer.addEventListener("error",dailymotionPlayer.eventListener.error );

        dailymotionPlayer.dmplayer.addEventListener("canplaythrough",dailymotionPlayer.eventListener.canplaythrough);

        dailymotionPlayer.dmplayer.addEventListener("durationchange",dailymotionPlayer.eventListener.durationchange);

        dailymotionPlayer.dmplayer.addEventListener("timeupdate",dailymotionPlayer.eventListener.timeupdate);

        dailymotionPlayer.dmplayer.addEventListener("progress",dailymotionPlayer.eventListener.progress);

        dailymotionPlayer.dmplayer.addEventListener("ended",dailymotionPlayer.eventListener.ended);

    }
};

/**
 * Unload Player after using
 */
dailymotionPlayer.unload = function () {
    console.dir("UNLOAD! ");
    dailymotionPlayer.dailymotionVideoID ="null";
    dailymotionPlayer.stop();
    dailymotionPlayer.active = 0;
    $("#dmplayer").hide();
    if(dailymotionPlayer.dmplayer){
       dailymotionPlayer.dmplayer.removeEventListener("apiready",dailymotionPlayer.eventListener.apiready);

        dailymotionPlayer.dmplayer.removeEventListener("canplaythrough",dailymotionPlayer.eventListener.canplaythrough);

        dailymotionPlayer.dmplayer.removeEventListener("durationchange",dailymotionPlayer.eventListener.durationchange);

        dailymotionPlayer.dmplayer.removeEventListener("timeupdate",dailymotionPlayer.eventListener.timeupdate);

        dailymotionPlayer.dmplayer.removeEventListener("progress",dailymotionPlayer.eventListener.progress);

       dailymotionPlayer.dmplayer.removeEventListener("ended",dailymotionPlayer.eventListener.ended);

        dailymotionPlayer.dmplayer.removeEventListener("error",dailymotionPlayer.eventListener.error);
    }
    dailymotionPlayer.apiready = false;
    delete dailymotionPlayer.dmplayer;
    dailymotionPlayer.dmplayer = null;

    $("#dmplayer").remove();
    $( "#embedplayer" ).append('<div id="dmplayer" ></div>' );
};


dailymotionPlayer.setVolume = function (volume) {
    if(dailymotionPlayer.dmplayer && dailymotionPlayer.apiready){
        dailymotionPlayer.dmplayer.setVolume(volume);
    }

}



dailymotionPlayer.play = function () {
    if(dailymotionPlayer.dmplayer && dailymotionPlayer.apiready){
        dailymotionPlayer.dmplayer.play();
        console.dir("PLAY: "+dailymotionPlayer.dailymotionVideoID);
    }

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



