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

mediaController.playStream = function (artist,title) {



    if (!uiController.swipeTimer || Date.now() - uiController.swipeTimer > 500) {
        $(".mejs-controls").find('.mejs-time-buffering').fadeIn();
        $(".mejs-controls").find('.mejs-time-loaded').hide();

        $(".mejs-playpause-button button").removeClass("looped");

        mediaController.playCounter++;
        var streamID = mediaController.playCounter;
        var artistString = artist;
        var titleString = title;


        artistString = artistString.replace("?","");
        titleString  = titleString.replace("?","");

        var searchString = ""
        if (artist != "")
            searchString = artist + " - " + title;
        else
            searchString = title;

        var streamURL = "";

        var play = function (streamID, searchString, artistString, titleString, streamURL) {


            $.ajax({
                url: "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&artist=" + artistString + "&track=" + titleString + "&format=json",
                success: function (data) {
                    if (streamID == mediaController.playCounter) {
                        $(".mejs-controls").find('.mejs-time-buffering').show();
                        var duration = 200000;
                        console.dir("http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&artist=" + artistString + "&track=" + titleString + "&format=json");
                        console.dir(data);
                        if (data.track) {
                            if (data.track.duration) {
                                duration = data.track.duration;
                            }
                        }
                        var loadError = false;
                        $.ajax({
                            timeout:30000,
                            url: preferences.serverURL + "?play=" + searchString+"&force1="+artistString+"&force2="+titleString+"&duration="+duration,
                            success: function (data) {
                                console.dir( preferences.serverURL + "?play=" + searchString+"&force1="+artistString+"&force2="+titleString+"&duration="+duration);

                                if(streamID == mediaController.playCounter){
                                    streamURL = data;
                                    if (streamURL) {

                                        $("#videoplayer").removeClass("animate").addClass("animatefast");

                                        $("#videoplayer").css("opacity", "0");

                                        setTimeout(function(){
                                            $("#videoplayer").removeClass("animatefast").addClass("animate");
                                            playlistController.playlingTitle = playlistController.playlingTitleLoading ;
                                            playlistController.playlingTitleCover = playlistController.playlingTitleCoverLoading ;
                                            playlistController.setNewTitle(playlistController.playlingTitle,playlistController.playlingTitleCover,true);

                                            uiController.mediaElementPlayer.setSrc(streamURL);
                                            uiController.mediaElementPlayer.load();
                                            uiController.mediaElementPlayer.play();

                                        },200)

                                    }else
                                        loadError = true;
                                }else
                                    loadError = true;
                            },
                            error:function(){
                                $(".mejs-controls").find('.mejs-time-buffering').hide();
                                loadError = true;
                            },
                            complete: function(){
                                if(loadError) {
                                    if(streamID == mediaController.playCounter){

                                        playlistController.resetPlayingSong();

                                    }
                                }
                                setTimeout(function(){$(".mejs-controls").find('.mejs-time-buffering').hide()},500);
                            }
                        })



                    }

                },
                error: function () {
                    $(".mejs-controls").find('.mejs-time-buffering').hide();
                }

            })
        }


        play(streamID, searchString, artistString, titleString, streamURL);
    }


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
    if(song.artist){
        if(song.artist.name)
            artist =  song.artist.name;
        else if(song.artist)
            artist = song.artist;
    }
    return artist;
}