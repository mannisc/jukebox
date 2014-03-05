/** * mediaController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 03.03.14 - 14:51
 * @copyright  */


var mediaController = function () {

};

mediaController.playCounter = 0;


mediaController.playStream = function (playString) {



    $(".mejs-playpause-button button").removeClass("looped");

    $("#videoplayer").css("opacity", "0");


   $(".mejs-controls").find('.mejs-time-buffering').fadeIn();
   $(".mejs-controls").find('.mejs-time-loaded').hide();



        mediaController.playCounter++;
    var streamID = mediaController.playCounter;
    var streamURL = "";
    var searchString = playString;
    var func = function (searchString,streamURL,streamID) {
        if (!uiController.swipeTimer || Date.now() - uiController.swipeTimer > 500) {
            var loadError = false;
            $.ajax({
                timeout:30000,
                url: preferences.serverURL + "?play=" + searchString,
                success: function (data) {
                    console.log("SUCCESS")

                    if(streamID == mediaController.playCounter){
                        streamURL = data;
                        if (streamURL) {

                            playlistController.playlingTitle = playlistController.playlingTitleLoading ;
                            playlistController.playlingTitleCover = playlistController.playlingTitleCoverLoading ;
                            playlistController.setNewTitle(playlistController.playlingTitle,playlistController.playlingTitleCover,true);


                            uiController.mediaElementPlayer.setSrc(streamURL);
                            uiController.mediaElementPlayer.load();
                            uiController.mediaElementPlayer.play();

                        }else
                            loadError = true;
                    }else
                     loadError = true;

                },
                error:function(){
                    loadError = true;
                },
                complete: function(){
                    console.log("COMPLETE")
                    if(loadError) {
                        if(streamID == mediaController.playCounter){
                            playlistController.playlingTitleLoading  = playlistController.playlingTitle ;
                            playlistController.playlingTitleCoverLoading = playlistController.playlingTitleCover;;
                            playlistController.setNewTitle(playlistController.playlingTitle,playlistController.playlingTitleCover);

                        }
                    }


                    setTimeout(function(){$(".mejs-controls").find('.mejs-time-buffering').fadeOut()},500);


                }
            })

        }
    }
    func(searchString,streamURL,streamID);
    //TODO

}


mediaController.getSongCover= function(song){

    var url;

    if(song.image)
      url =  song.image[0]['#text'];

    if(!url|| $.trim(url) == "")
        url ="public/img/playlist.png";

    return url;
}

mediaController.getSongArtist= function(song){

    var artist = "";

    if(song.artist.name)
        artist =  song.artist.name;
    else if(song.artist)
        artist = song.artist;
    return artist;
}
