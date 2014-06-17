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

dailymotionPlayer.player    = null;
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
    if(dailymotionPlayer.player){
        if(e.target.src.search(dailymotionPlayer.dailymotionVideoID)>-1){
            $(".mejs-time-buffering").hide();
            $("#dailymotionembedplayer").show();
            $("#dailymotionplayer").show();
            dailymotionPlayer.apiready = true;

            dailymotionPlayer.firstplay = true;

            if(dailymotionPlayer.startplay){
                dailymotionPlayer.play()
            }

            else if(dailymotionPlayer.startpause){
                videoController.playingSong();
                dailymotionPlayer.firstplay = false;

            }

            dailymotionPlayer.startpause = false;
            dailymotionPlayer.startplay = false;


        }
    }
}

dailymotionPlayer.eventListener.error = function(e)
{
    if(dailymotionPlayer.player){
        dailymotionPlayer.error();
    }
}

dailymotionPlayer.eventListener.play = function(e)
{
    if(dailymotionPlayer.player&&dailymotionPlayer.firstplay){
        videoController.playingSong();
        dailymotionPlayer.firstplay = false;
    }
}

dailymotionPlayer.eventListener.canplaythrough = function(e)
{
    /*
    if(e.target.src.search(dailymotionPlayer.dailymotionVideoID)>-1){
        if(dailymotionPlayer.player){
            dailymotionPlayer.player.play();
        }
    } */
}

dailymotionPlayer.eventListener.durationchange = function(e)
{
    if(dailymotionPlayer.player){
        dailymotionPlayer.duration = e.target.duration;
        // dailymotionPlayer.updateDuration();
        videoController.setMaxTime(dailymotionPlayer.duration);
    }
}

dailymotionPlayer.eventListener.timeupdate = function(e)
{
    if(dailymotionPlayer.player){
        dailymotionPlayer.currentTime = e.target.currentTime;
        //console.log("Progress DM: "+dailymotionPlayer.currentTime)
        videoController.setProgressTime(dailymotionPlayer.currentTime);
    }
}

dailymotionPlayer.eventListener.progress = function(e)
{
    if(dailymotionPlayer.player){
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
    if(dailymotionPlayer.player){
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

    //$("#dailymotionPlayer").hide();
    console.dir("VideoID: "+videoid);
    if(videoid){  
        $("#dailymotionplayer").addClass("iframeVideo").appendTo("#backgroundVideo");
        dailymotionPlayer.dailymotionVideoID = videoid;
        var PARAMS = {background : 'ABE866', autoplay : 0, chromeless : 1,
            foreground : '000000', related: 0, quality: 720,
            html : 1, highlight : '857580',
            info : 1, network : 'dsl', autoplay : 0};
        dailymotionPlayer.player = DM.player("dailymotionplayer", {video: videoid,width: "100%", height: "100%", params: PARAMS});
        console.dir(dailymotionPlayer.player);
        dailymotionPlayer.player.addEventListener("error",dailymotionPlayer.eventListener.error );

        dailymotionPlayer.player.addEventListener("apiready",dailymotionPlayer.eventListener.apiready);

        //dailymotionPlayer.player.addEventListener("canplay",dailymotionPlayer.eventListener.apiready);

        dailymotionPlayer.player.addEventListener("canplaythrough",dailymotionPlayer.eventListener.canplaythrough);

        dailymotionPlayer.player.addEventListener("durationchange",dailymotionPlayer.eventListener.durationchange);

        dailymotionPlayer.player.addEventListener("timeupdate",dailymotionPlayer.eventListener.timeupdate);

        dailymotionPlayer.player.addEventListener("progress",dailymotionPlayer.eventListener.progress);

        dailymotionPlayer.player.addEventListener("ended",dailymotionPlayer.eventListener.ended);

        dailymotionPlayer.player.addEventListener("play",dailymotionPlayer.eventListener.play);

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
    $("#dailymotionplayer").hide();
    if(dailymotionPlayer.player){
       dailymotionPlayer.player.removeEventListener("apiready",dailymotionPlayer.eventListener.apiready);

        dailymotionPlayer.player.removeEventListener("canplaythrough",dailymotionPlayer.eventListener.canplaythrough);

        dailymotionPlayer.player.removeEventListener("durationchange",dailymotionPlayer.eventListener.durationchange);

        dailymotionPlayer.player.removeEventListener("timeupdate",dailymotionPlayer.eventListener.timeupdate);

        dailymotionPlayer.player.removeEventListener("progress",dailymotionPlayer.eventListener.progress);

       dailymotionPlayer.player.removeEventListener("ended",dailymotionPlayer.eventListener.ended);

        dailymotionPlayer.player.removeEventListener("error",dailymotionPlayer.eventListener.error);

        dailymotionPlayer.player.removeEventListener("play",dailymotionPlayer.eventListener.play);

    }
    dailymotionPlayer.apiready = false;
    delete dailymotionPlayer.player;
    dailymotionPlayer.player = null;

    $("#dailymotionplayer").remove();
    $( "#dailymotionembedplayer" ).append('<div id="dailymotionplayer" ></div>' );
};


dailymotionPlayer.setVolume = function (volume) {
    if(dailymotionPlayer.player && dailymotionPlayer.apiready){
        dailymotionPlayer.player.setVolume(volume);
    }

}



dailymotionPlayer.play = function () {
    if(dailymotionPlayer.player ){
        if(dailymotionPlayer.apiready){
            dailymotionPlayer.player.play();
            dailymotionPlayer.setVolume(videoController.volume);
        }
        else{
            dailymotionPlayer.startplay = true;
            dailymotionPlayer.startpause = false;

        }

        console.dir("PLAY: "+dailymotionPlayer.dailymotionVideoID);

    }

}
dailymotionPlayer.pause = function () {
    if(dailymotionPlayer.player){

        if(dailymotionPlayer.apiready)
            dailymotionPlayer.player.pause();
        else{
            dailymotionPlayer.startplay = false;
            dailymotionPlayer.startpause = true;

        }

        console.dir("PAUSE: "+dailymotionPlayer.dailymotionVideoID);

    }

}

dailymotionPlayer.stop = function () {
    if(dailymotionPlayer.player && dailymotionPlayer.apiready){
        dailymotionPlayer.player.pause();
        dailymotionPlayer.player.seek(0);
    }
}




dailymotionPlayer.setProgressPercentage = function(percentage){
    if(dailymotionPlayer.player && dailymotionPlayer.apiready){
        dailymotionPlayer.player.seek(percentage* dailymotionPlayer.duration);
    }

}


dailymotionPlayer.mediaEnded = function(){
    videoController.endedSong();
    mediaController.mediaEnded();
}


dailymotionPlayer.error= function (){
    if(dailymotionPlayer.active == 1){
        mediaController.PlayingSongError();
    }

}



