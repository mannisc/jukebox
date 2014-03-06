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

mediaController.versionList = [];


mediaController.getVersions = function () {
    var currentsong = playlistController.getPlayingSong();
    if(currentsong.name!=""){
        mediaController.versionList = [];
        $scope.safeApply();
        $("#searchviewVersions").listview('refresh');
        $('#popupVideoSettings').popup('open', {positionTo: 'window'});
        $('#loadversionimg').fadeIn();
        var getsongversions = function (counter) {
            if(counter < 120){
                var song = currentsong;
                console.dir("SEARCH OTHER VERSIONS! "+counter+"  - "+mediaController.getSongArtist(song)+" - "+song.name);
                $.ajax({
                    url: preferences.serverURL + "?getversions=8&artist="+mediaController.getSongArtist(song)+"&title="+song.name,
                    success: function (data) {
                        console.dir("loaded "+counter);
                        console.dir(data);
                        if(data.track){
                            console.dir("SUCCESS VERSIONS! "+counter+"  - "+mediaController.getSongArtist(song)+" - "+song.name);
                            if(playlistController.getPlayingSong()==song){
                                console.dir(data.track);
                                for(var i=0;i<data.track.length;i++){
                                    try {
                                      data.track[i].title = decodeURIComponent(data.track[i].title);
                                    }
                                    catch (e) {
                                        data.track[i].title = unescape(data.track[i].title);
                                    }
                                    try {
                                        data.track[i].url = decodeURIComponent(data.track[i].url);
                                    }
                                    catch (e) {
                                        data.track[i].url = unescape(data.track[i].url);
                                    }
                                }
                                mediaController.versionList = data.track;

                                $scope.safeApply();
                                $('#loadversionimg').hide();
                                $("#searchviewVersions").listview('refresh');
                                $('#popupVideoSettings').popup("reposition", {positionTo: 'window'} );
                                $('#popupVideoSettings').popup('open', {positionTo: 'window'});
                            }
                        }
                        else
                        {
                            if(playlistController.getPlayingSong()==song){
                                setTimeout(function(){getsongversions(counter+1)},1500);
                            }
                        }
                    },
                    error:function(xhr, ajaxOptions, thrownError){
                        if(playlistController.getPlayingSong()==song){
                         setTimeout(function(){getsongversions(counter+2)},5000);
                        }
                    }

                })
            }
        }
        getsongversions(0);
    }
}

mediaController.playVersion = function (songversion){
    $('#loadversionimg').fadeIn();
    $(".mejs-time-buffering").fadeIn();
    if($(".mejs-time-loaded").width()>$(".mejs-time-total").width()*0.7)
        $(".mejs-time-loaded").hide();

    $(".mejs-playpause-button button").removeClass("looped");
    mediaController.playCounter++;
    var streamID = mediaController.playCounter;
    var videoURL = songversion.url
    var play = function (streamID, videoURL) {
        console.dir(preferences.serverURL + "?playurl=" + videoURL);
        $.ajax({
            timeout: 30000,
            url: preferences.serverURL + "?playurl=" + videoURL,
            success: function (data) {
                 if (streamID == mediaController.playCounter) {
                    streamURL = data;
                     console.dir(data);
                    if (streamURL) {
                        $("#videoplayer").removeClass("animate").addClass("animatefast");
                        $("#videoplayer").css("opacity", "0");
                        setTimeout(function () {
                         $("#videoplayer").removeClass("animatefast").addClass("animate");
                            uiController.mediaElementPlayer.setSrc(streamURL);
                            uiController.mediaElementPlayer.load();
                            uiController.mediaElementPlayer.play();
                        }, 200)

                    } else
                        loadError = true;
                } else
                    loadError = true;
            },
            error: function () {
                loadError = true;
            },
            complete: function () {
                //TODO
                $('#loadversionimg').hide();
                setTimeout(function(){$(".mejs-controls").find('.mejs-time-buffering').hide()},500);
            }
        })

    }
    play(streamID,videoURL);

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