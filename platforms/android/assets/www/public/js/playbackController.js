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
playbackController.doubleClickedElement = function (element, onlyStyle) {
    //Swiped?
    if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 100)
        return;

    //Remove Selection
    $("#searchlist li.selected").removeClass("selected");

    //Playlist or song?
    if (element.isPlaylist) {
        //Select Playlist
        playlistController.selectPlaylist(element);
    } else {
        //Play Song
        playbackController.playSong(element, onlyStyle, false);
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
    if (playbackController.playSongTimer && Date.now() - playbackController.playSongTimer < 100)
        return;
    playbackController.playSongTimer = Date.now();

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
    var isSameSongAsLoadedSong = playbackController.playingSong && (((!playbackController.playingSong.gid && !song.gid) || playbackController.playingSong.gid == song.gid) && playbackController.playingSong.name == song.name) && (mediaController.getSongArtist(playbackController.playingSong) == mediaController.getSongArtist(song));

    //New song is already loading/playing song
    if (isSameSongAsLoadedSong) {
        //Already Loading, and not loaded yet (no pausing possible)
        if (playbackController.isLoading)
            return;
        //Toggle Playing/Pausing
        else if (playbackController.playingSong) {
            if (videoController.isPlaying) {
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
    if (!playbackController.isLoading)
        playbackController.playingOldSong = playbackController.playingSong;

    //Set loading/playing Song to selected Song
    playbackController.playingSong = song;
    console.log("PLÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄY SONG")

    //Lyrics
    if (mediaController.showLyrics)
        $("#lyricsifrm").attr("src", "http://lyrics.wikia.com/" + mediaController.getSongArtist(playbackController.playingSong) + ":" + playbackController.playingSong.name);

    videoController.disableLyricsControl(false);
    //Enable stop if there is no old song
    if (!playbackController.playingOldSong)
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
            playbackController.isLoading = true;
            $(songListElement.get(0)).addClass("stillloading");
            playbackController.startedLoadingTime = Date.now();
            if (playbackController.playingSong.streamURL)
                mediaController.playStreamURL(playbackController.playingSong.streamURL);
            else
                mediaController.playStream(mediaController.getSongArtist(playbackController.playingSong), playbackController.playingSong.name, playedAutomatic);

            playbackController.playedSongs.push(playbackController.playingSong);
            playbackController.setNewTitle(playbackController.playingSong.name, mediaController.getSongCover(playbackController.playingSong));

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

/**
 * Set New Title of Playing/Loading Song
 * @param title
 * @param coverUrl
 * @param isLoaded
 */
playbackController.setNewTitle = function (title, coverUrl, isLoaded) {
    if (!isLoaded) {
        $("#playingSongCover").removeClass("fadeincomplete")
        $("#playingSongTitle").removeClass("fadeincomplete");
        $("#playingSongTitle").hide();
        $("#playingSongTitleLoading").hide();

        $("#playingSongCover").hide();
    }
    $("#playingSongTitleLoading").removeClass("fadeincomplete").removeClass("fadeoutcomplete");


    if (title && title != "")
        document.title = $scope.appTitle + " : " + title;
    else
        document.title = $scope.appTitle;

    var searchinput = "";
    if ($("#searchinput").val()) {
        searchinput = $("#searchinput").val()
    }
    //TODO COMMEnt REMOVE
    /*
     var song = playlistController.getPlayingSong();

     if(song.name!=""&&searchinput!=""){
     window.history.pushState("",document.title, "/?search="+searchinput+"&artist=" + mediaController.getSongArtist(song) + "&title=" + song.name);
     }
     else if(song.name!=""){
     window.history.pushState("",document.title, "/?artist=" + mediaController.getSongArtist(song) + "&title=" + song.name);
     }
     else if(searchinput!=""){
     window.history.pushState("",document.title, "?search="+searchinput);
     }
     */

    //  $("#playingSongCover").attr("src", coverUrl);

    if (!isLoaded) {
        coverUrl = "public/img/loadertitle.gif";

        $("#playingSongInfoStyle").remove();
        var style = $('<style id="playingSongInfoStyle">' +
            '.playingSongInfo.ui-icon-custom:after  {' +
            ' background-image: url(' + coverUrl + ')' +
            '}' +
            '#popupArtist-popup::before{' +
            '  background-color:rgba(255,255,255,.5)!important' +
            '}' +
            '</style>');
        $('html > head').append(style);
    }
    else {
        $("#playingSongInfoStyle").remove();
        style = $('<style id="playingSongInfoStyle">' +
            '.playingSongInfo.ui-icon-custom:after  {' +
            ' background-image: url(' + coverUrl + ')' +
            '}' +
            '#popupArtist-popup::before{' +
            '  background: url(' + coverUrl + ');' +
            '  background-size:cover;!important' +
            '}' +
            '</style>');
        $('html > head').append(style);


    }

    $scope.safeApply();
    setTimeout(function () {
        if (isLoaded) {
            $("#playingSongTitleLoading").addClass("fadeoutcomplete")
            $("#playingSongTitleLoading").show();
        }
        else {
            $("#playingSongCover").addClass("fadeincomplete")
            $("#playingSongCover").show();
            $("#playingSongTitleLoading").addClass("fadeincomplete")
            $("#playingSongTitleLoading").show();
            $("#playingSongTitle").addClass("fadeincomplete")
            $("#playingSongTitle").show();
        }

    }, 50)
}


/**
 * Play next song in songlist
 */
playbackController.playNextSong = function () {

    if ( playbackController.playingSong.gid) {


        var index = playbackController.getIndexOfSong(playbackController.playingSong, playlistController.loadedPlaylistSongs);
        if (index >= 0) {
            if (!videoController.shuffleMode) {
                index = index + 1;
                if (index == playlistController.loadedPlaylistSongs.length)
                    index = 0;
            } else if (playlistController.loadedPlaylistSongs.length > 1) {
                var oIndex = index;
                do {
                    index = Math.round(Math.random() * (playlistController.loadedPlaylistSongs.length - 1))
                }
                while (index == oIndex)
            }

            playbackController.playSong(playlistController.loadedPlaylistSongs[index], false, true)
        } else if (playlistController.loadedPlaylistSongs.length > 0 && !playlistController.loadedPlaylistSongs[0].isPlaylist) {

            playbackController.playSong(playlistController.loadedPlaylistSongs[0], false, true)

        } else
            videoController.disablePositionControls(true);

    } else {

        index = playbackController.getIndexOfSong(playbackController.playingSong, searchController.searchResults);
        if (index >= 0) {
            if (!videoController.shuffleMode) {
                index = index + 1;
                if (index == searchController.searchResults.length)
                    index = 0;
            } else if (searchController.searchResults.length > 1) {
                oIndex = index;
                do {
                    index = Math.round(Math.random() * (searchController.searchResults.length - 1))
                }
                while (index == oIndex)
            }
            playbackController.playSong(searchController.searchResults[index], false, true)
        } else
            videoController.disablePositionControls(true);

    }


}


/**
 * Get Title of Playing Song
 * @returns {*}
 */
playbackController.getPlayingTitle = function () {

    if (playbackController.playingSong) {
        return mediaController.getSongDisplayName(playbackController.playingSong);
    }
    else
        return "";
}


/**
 * Get the playing Song, and emtpy String if not set
 * @returns {*}
 */

playbackController.getPlayingSong = function () {
    if (playbackController.playingSong)
        return playbackController.playingSong;
    else
        return {name: ""};
}









/**
 * Get Index of Song in List
 * @param song
 * @param list
 * @returns {number}
 */
playbackController.getIndexOfSong = function (song, list) {

    for (var index = 0; index < list.length; index++) {
        if (song.name == list[index].name && mediaController.getSongArtist(song) == mediaController.getSongArtist(list[index])) {
            return index;
        }
    }

    //alert("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

    return -1;
}






































































































