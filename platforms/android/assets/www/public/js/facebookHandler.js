/**
 * facebookHandler.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 25.04.14 - 16:15
 * @copyright munichDev UG
 */


var facebookHandler = function () {





}



facebookHandler.init = function(){

        $("#fblike").click(function(){
            alert("!!!!!")
        })

}


/**
 * Update FB Buttons
 */
facebookHandler.updateSongFBButtons = function(){


    if( playbackController.playingSong)
        $("#songfblike").html(preloadhtml.sharefb.replace("songbase.fm", "songbase.fm?play=" + playbackController.getPlayingTitle()));
    else
        $("#songfblike").html(preloadhtml.sharefb);

    try {
        FB.XFBML.parse();
    } catch (ex) {
    }
}

facebookHandler.postOnFacebook = function () {

    if (playbackController.playingSong)
    {
        mediaController.sendRating("1");
        var song = playbackController.getPlayingSong();
        var fburl =  "http://www.songbase.fm?play="+playbackController.getPlayingTitle() + "&t=" + playbackController.getPlayingTitle();
    }
    else
    {
        fburl = "http://www.songbase.fm&t=songbase.fm - All Your Music";
    }

    mywindow = window.open("http://www.facebook.com/sharer.php?u=" +fburl, "", "");
    mywindow.focus();

}