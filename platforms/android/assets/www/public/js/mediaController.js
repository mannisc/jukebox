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


mediaController.getVersions = function () {
    var play = function () {
        $.ajax({
            url: preferences.serverURL + "?getVersions=5&artist="+artistString+"&title="+titleString,
            success: function (data) {

            }
        })
    }
}


mediaController.playStream = function (artist,title) {
        $(".mejs-time-buffering").fadeIn();

        if($(".mejs-time-loaded").width()>$(".mejs-time-total").width()*0.7)
          $(".mejs-time-loaded").hide();


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
                        $(".mejs-time-buffering").show();
                        var duration = 200000;
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

                                           // playlistController.playingTitle = playlistController.playlingTitleLoading ;
                                           // playlistController.playlingTitleCover = playlistController.playlingTitleCoverLoading ;

                                            playlistController.loadingOldSong =  playlistController.loadingSong;

                                            playlistController.setNewTitle(playlistController.loadingSong.name, playlistController.loadingSong.coverURL, true);

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
                                loadError = true;
                            },
                            complete: function(){
                                console.log("COMPLETED")
                                playlistController.isLoading = false;
                                if(loadError) {
                                    console.log("ERROR")
                                    if(streamID == mediaController.playCounter){
                                        setTimeout(function(){$(".mejs-controls").find('.mejs-time-buffering').hide()},500);
                                        uiController.toast("Sorry, this Song is not available as Video at the moment.",1500)
                                        playlistController.resetPlayingSong();

                                    }
                                }
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