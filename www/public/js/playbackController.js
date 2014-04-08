/**
 * playbackController.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 06.04.14 - 12:25
 * @copyright munichDev UG
 */


var playbackController = function () {
};


/**
 * Double clicked on Element in list
 * @param element
 * @param onlyStyle
 */
playbackController.doubleClickedElement = function(element, onlyStyle){
    //Swiped?
    if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 100)
        return;

    //Remove Selection
    $("#searchlist li.selected").removeClass("selected");

    //Playlist or song?
    if (element.isPlaylist) {
        //Select Playlist
        playlistController.selectPlaylist(element);
    }else {
        //Play Song
        playbackController.playSong(element, onlyStyle,false);
    }

}


/**
 * Play song, triggered manually or automatic
 * @param song
 * @param onlyStyle
 * @param playedAutomatic
 */
playbackController.playSong = function (song, onlyStyle, playedAutomatic) {
    //Dont play multiple songs within 100ms
    if (playlistController.playSongTimer && Date.now() - playlistController.playSongTimer < 100)
        return;
    playlistController.playSongTimer = Date.now();

    //Song for which version list is currently loaded set to null
    mediaController.versionListSong = null;

    //Get Variables of song
    var songId = song.id;
    var songGlobalId = song.gid;
    if (songGlobalId)
        var isPlaylistSong = true;
    else
        isPlaylistSong = false;

    if (isPlaylistSong)
        var songListElement = $("#playlistInner li[data-songid='playlistsong" + songId + "'] ");
    else
        songListElement = $("#searchlist li[data-songtitle='" + song.name + "-" + mediaController.getSongArtist(song) + "'] ");


    //Check if song already playing
    var isSameSongAsLoadedSong = playlistController.playingSong&&(playlistController.playingSong.name == song.name) && (mediaController.getSongArtist(playlistController.playingSong) == mediaController.getSongArtist(song));

    //New song is already loading/playing song
    if (isSameSongAsLoadedSong) {
        //Already Loading, and not loaded yet (no pausing possible)
        if(playlistController.isLoading)
         return;
        //Toggle Playing/Pausing
        else if (playlistController.playingSong) {
            if (playlistController.isPlaying) {
              $(songListElement.get(0)).addClass("playing");
            }
            else
              $(songListElement.get(0)).addClass("pausing");

            setTimeout(function () {

                $(".mejs-playpause-button").click();//TODO CHANGE TO VIDEOCONTROLLER

            }, 50);
        }
    }


    //If not already loading, save the old song to be able to reset if there is a loading error
    if (!playlistController.isLoading)
        playlistController.playingOldSong = playlistController.playingSong;

    //Set loading/playing Song to selected Song
    playlistController.playingSong = song;
    console.log("PLÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄY SONG")

    //Lyrics
    if (mediaController.showLyrics)
        $("#lyricsifrm").attr("src", "http://lyrics.wikia.com/" + mediaController.getSongArtist(playlistController.playingSong) + ":" + playlistController.playingSong.name);

    videoController.disableLyricsControl(false);
    //Enable stop if there is no old song
    if (!playlistController.playingOldSong)
        videoController.disableStopControl(false);

    //Set playing Indicator position
    if (isPlaylistSong) {
        var y = 22 + parseInt(songId.substring(5)) / (playlistController.loadedPlaylistSongs.length - 1) * ($("#playlistInner").height() - 11 - 49);
        $("#playlistInner .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px)').css('-moz-transform', 'translate(0px, ' + y + 'px)').css('-ms-transform', 'translate(0px, ' + y + 'px)').css('transform', 'translate(0px, ' + y + 'px)')
        $("#playlistInner .iScrollPlayIndicator").fadeIn();
        $("#searchlist .iScrollPlayIndicator").hide();
    }
    else {
        y = 22 + parseInt(songId.substring(5)) / (searchController.searchResults.length - 1) * ($("#searchlist").height() - 11 - 49);
        $("#searchlist .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px)').css('-moz-transform', 'translate(0px, ' + y + 'px)').css('-ms-transform', 'translate(0px, ' + y + 'px)').css('transform', 'translate(0px, ' + y + 'px)')
        $("#searchlist .iScrollPlayIndicator").fadeIn();
        $("#playlistInner .iScrollPlayIndicator").hide();
    }

    //Enable Controls
    videoController.disableControls(false);

    //Clear other cover loading circles
    //helperFunctions.clearBackground(".songlist li.loadedsong.stillloading .loadingSongImg");
    $(".songlist li.loadedsong.stillloading .loadingSongImg").hide();

    //Clear other loading songs
    $(".songlist li").removeClass("loadedsong playing plausing stillloading");


    if (!onlyStyle) {
        if (!isSameSongAsLoadedSong) {
            playlistController.isLoading = true;
            $(songListElement.get(0)).addClass("stillloading");
            songListElement.removeClass("pausing");
            playbackController.startedLoadingTime = Date.now();
            if (playlistController.playingSong.streamURL)
                mediaController.playStreamURL(playlistController.playingSong.streamURL);
            else
                mediaController.playStream(mediaController.getSongArtist(playlistController.playingSong), playlistController.playingSong.name, playedAutomatic);

            playlistController.playedSongs.push(playlistController.playingSong);
            playlistController.setNewTitle(playlistController.playingSong.name, mediaController.getSongCover(playlistController.playingSong));

        }

    }

    $(songListElement.get(0)).addClass("loadedsong")

    //helperFunctions.animateBackground(".songlist li.loadedsong.stillloading .loadingSongImg", "public/img/loader/sprites.png", 46, 46, 18, 46,4.8);
    $(".songlist li.loadedsong.stillloading .loadingSongImg").show();

    $scope.safeApply();
    uiController.styleTopButtons();


    setTimeout(function () {
        $("#playingSongInfoLink").css("opacity", "1");
        $("#buySongLink").css("opacity", "1");
    }, 500)

}
