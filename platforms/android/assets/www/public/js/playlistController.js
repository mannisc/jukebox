/**
 * playlistController.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 04.03.14 - 16:05
 * @copyright munichDev UG
 */


var playlistController = function () {

};


playlistController.loadedPlaylistSongs = new Array();

playlistController.loadedPlaylistSongs = new Array();

playlistController.NOINTERNETHACK = playlistController.loadedPlaylistSongs;
playlistController.loadedPlaylistSongs = [];


for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
    playlistController.loadedPlaylistSongs[i].id = "plsid" + helperFunctions.padZeros(i, ("" + playlistController.loadedPlaylistSongs.length).length);
    playlistController.loadedPlaylistSongs[i].gid = "gsid" + helperFunctions.padZeros(i, ("" + playlistController.loadedPlaylistSongs.length).length);
    //   console.log("::: "+ playlistController.loadedPlaylistSongs[i].gid)
}

playlistController.globalId = playlistController.loadedPlaylistSongs.length;


playlistController.shuffleMode = false;

playbackController.playedSongs = [];


playlistController.playlists = [
    {gid: 0, id: 0, name: "Rock", isPlaylist: true, tracks: playlistController.loadedPlaylistSongs},
    {gid: 1, id: 1, name: "Charts4/13", isPlaylist: true, tracks: []},
    {gid: 2, id: 2, name: "Chillout", isPlaylist: true, tracks: []},
    {gid: 3, id: 3, name: "Vocals", isPlaylist: true, tracks: []},
    {gid: 4, id: 4, name: "Trance", isPlaylist: true, tracks: []},
    {gid: 5, id: 5, name: "Electro '14", isPlaylist: true, tracks: []}

];


for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
    playlistController.loadedPlaylistSongs[i].playlistgid = 0;
}


window.localStorage.playlists = null;
/*
 var playlists = window.localStorage.playlists;
 if (playlists)
 playlistController.playlists = JSON.parse(playlists);

 */



playlistController.globalIdPlaylist = playlistController.playlists.length;


playlistController.loadedPlaylistSongs = playlistController.playlists;

playlistController.loadedPlaylistSongs = [];
playlistController.playlists = [];  //CLEAR_______________________________________________________________

playlistController.counterGlobalId = playlistController.loadedPlaylistSongs.length; //TODO


playlistController.resetPlayingSong = function () {

    playbackController.isLoading = false;

    $(".mejs-controls").find('.mejs-time-loaded').show();

    if ($(".mejs-controls").find('.mejs-time-buffering').css("opacity") > 0)
        $(".mejs-controls").find('.mejs-time-buffering').fadeOut();

    mediaController.playCounter = mediaController.playCounter + 1;

    $("#videoplayer").css("opacity", "0");
    $("#videoplayer").css("pointer-events", "none");

    playbackController.playingSong = playbackController.playingOldSong;

    if (playbackController.playingSong) {
        playbackController.playSong(playbackController.playingSong, true);      //TODO REMOVE PLAY SONG HERE
        playbackController.setNewTitle(playbackController.playingSong.name, mediaController.getSongCover(playbackController.playingSong), true);

    }
    else {
        //helperFunctions.clearBackground(".songlist li.loadedsong.stillloading .loadingSongImg");
        $(".songlist li.loadedsong.stillloading .loadingSongImg").hide();

        $(".songlist li").removeClass("loadedsong playing stillloading plausing");
        videoController.disableControls(true);
        videoController.disableStopControl(true);
        $("#videoplayer").css("opacity", "0");
        $("#videoplayer").css("pointer-events", "none");
        $(".iScrollPlayIndicator").hide();

        playbackController.setNewTitle("", "", true);
        $(".mejs-button-lyrics button").css("opacity", "0.5");
    }


}

playlistController.playSong = function (song, onlyStyle, playedAutomatic) {alert("PLAYLIST PLAYSONG")}



playlistController.getIsLoadingText = function (always) {
    if (playbackController.isLoading || always)
        return " ...";
    else
        return "";
}








playlistController.getPlayingSepSign = function () {
    if (playbackController.playingSong) {
        return "";
    } else
        return "";

}


playlistController.playNextSong = function () {

    if ( playbackController.playingSong.gid) {


        var index = playlistController.getIndexOfSong(playbackController.playingSong, playlistController.loadedPlaylistSongs);
        if (index >= 0) {
            if (!playlistController.shuffleMode) {
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

        index = playlistController.getIndexOfSong(playbackController.playingSong, searchController.searchResults);
        if (index >= 0) {
            if (!playlistController.shuffleMode) {
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


playlistController.getIndexOfSong = function (song, list) {

    for (var index = 0; index < list.length; index++) {
        if (song.name == list[index].name && mediaController.getSongArtist(song) == mediaController.getSongArtist(list[index])) {
            return index;
        }
    }

    //alert("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

    return -1;
}


playlistController.playPrevSong = function () {

    var emptyList = false;
    if ( playbackController.playingSong.gid) {
        var index = playlistController.getIndexOfSong(playbackController.playingSong, playlistController.loadedPlaylistSongs);
        if (index == -1) {
            if (playbackController.playedSongs.length == 0) {
                index = 1;
            }
            emptyList = true;
        }

    } else {
        index = playlistController.getIndexOfSong(playbackController.playingSong, searchController.searchResults);
        if (index == -1) {
            if (playbackController.playedSongs.length == 0) {
                index = 1;
            }
            emptyList = true;

        }
    }

    //  index wo in sichtbarem bereich

    // alert("actuel Index " + index + " ANZAHL:::: " + playbackController.playedSongs.length)


    if (playbackController.playedSongs.length > 0) {

        var song = playbackController.playedSongs[playbackController.playedSongs.length - 1];
        playbackController.playedSongs.splice(playbackController.playedSongs.length - 1, 1);

        //     alert("prev Song "+song)


        var alreadyInList = (song == playbackController.playingSong);

        /*if (playbackController.playingSongInPlaylist) {
         alreadyInList = (index >= 0 && song == playlistController.loadedPlaylistSongs[index]);
         } else {
         alreadyInList = (index >= 0 && song == searchController.searchResults[index]);
         } */

        if (alreadyInList) {
            if (playbackController.playedSongs.length >= 1) {
                song = playbackController.playedSongs[playbackController.playedSongs.length - 1];
                playbackController.playedSongs.splice(playbackController.playedSongs.length - 1, 1);
            }
            else
                song = null;
        }
    }

    // alert("alreadyInList " + alreadyInList + "   prev song " + song + "   " + playbackController.playedSongs.length)
    if (!song) {

        if (emptyList) {

            if ( playbackController.playingSong.gid) {
                if (playlistController.loadedPlaylistSongs.length == 0)
                    return;
                else
                    index = 0;
            } else {
                if (searchController.searchResults == 0)
                    return;
                else
                    index = 0;

            }

        }
        else
            index = index - 1;


        // alert("PLAYING " + index)


        if ( playbackController.playingSong.gid) {
            if (index <= -1)
                index = playlistController.loadedPlaylistSongs.length - 1;
            playbackController.playbackController(playlistController.loadedPlaylistSongs[index])
        } else {
            if (index <= -1)
                index = searchController.searchResults.length - 1;
            playbackController.playSong(searchController.searchResults[index])
        }

    } else
        playbackController.playSong(song)


}


playlistController.remarkSong = function () {
    var y, listElement;

    if (playbackController.playingSong) {
        if ( playbackController.playingSong.gid) {
            y = 22 + parseInt(playbackController.playingSong.id.substring(5)) / (playlistController.loadedPlaylistSongs.length - 1) * ($("#playlistInner").height() - 11 - 49);
            $("#playlistInner .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px)').css('-moz-transform', 'translate(0px, ' + y + 'px)').css('-ms-transform', 'translate(0px, ' + y + 'px)').css('transform', 'translate(0px, ' + y + 'px)')


            $("#playlistInner .iScrollPlayIndicator").fadeIn();
            $("#searchlist .iScrollPlayIndicator").hide();

            listElement = $("#playlistInner li[data-songgid='playlistsong" + playbackController.playingSong.gid + "'] ");


            listElement.addClass("loadedsong");

        } else {
            y = 22 + parseInt(playbackController.playingSong.id.substring(5)) / (searchController.searchResults.length - 1) * ($("#searchlist").height() - 11 - 49);
            $("#searchlist .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px)').css('-moz-transform', 'translate(0px, ' + y + 'px)').css('-ms-transform', 'translate(0px, ' + y + 'px)').css('transform', 'translate(0px, ' + y + 'px)')
            $("#searchlist .iScrollPlayIndicator").fadeIn();
            $("#playlistInner .iScrollPlayIndicator").hide();

            listElement = $("#searchlist li[data-songtitle='" + playbackController.playingSong.name + "-" + mediaController.getSongArtist(playbackController.playingSong) + "'] ");
            listElement.addClass("loadedsong");


        }

        if (videoController.isPlaying) {
            listElement.addClass("playing");
            listElement.removeClass("pausing");
        } else if (playbackController.isLoading)  {

            listElement.addClass("stillloading");
            listElement.find(".loadingSongImg").show();


        } else {
            listElement.addClass("pausing");
            listElement.removeClass("playing");
        }

    }
}


playlistController.selectSong = function (song) {



    if (!uiController.swipeTimer || Date.now() - uiController.swipeTimer > 500) {
        if (playbackController.playSongTimer && Date.now() - playbackController.playSongTimer < 800)
            return;
        setTimeout(function(){
            if (playbackController.playSongTimer && Date.now() - playbackController.playSongTimer < 800)
                return;
            var Id = song.id;
            var listElement = null;
            if (song.gid) {
                if (uiController.sortPlaylist)


                    listElement    = $("#playlistInner li[data-songid='playlistsong" + Id + "'] ");
            }
            else {
                //  listElement = $("#searchlist li[data-songid='searchsong" + Id + "'] ");

                listElement = $("#searchlist li[data-songtitle='" + song.name + "-" + mediaController.getSongArtist(song) + "'] ");

            }

            if(listElement)
                listElement.toggleClass("selected");

        },250)

    }
}


playlistController.toggleShuffleSongs = function () {

    if (playbackController.playingSong) {
        playlistController.shuffleMode = !playlistController.shuffleMode;
        if (playlistController.shuffleMode)
            $(".mejs-shuffle-button button").css("opacity", "1");
        else {
            $(".mejs-shuffle-button button").css("opacity", "0.5");
        }
    }

}


playlistController.savePlaylist = function (useSelected) {

    if (!useSelected)
        var playlistTitle = $("#saveplaylistinpt").val();
    else
        playlistTitle = $('#playlistselectvertical .search-choice').text();

    if (playlistTitle) {


        var playlists = window.localStorage.playlists;

        if (!playlists || playlists == "null" || playlists == "undefined" || playlists == "false")
            playlists = playlistController.playlists;
        else
            playlists = JSON.parse(playlists);


        var exists = false;
        for (var i = 0; i < playlists.length; i++) {
            if (playlists[i].name == playlistTitle) {
                exists = true;
                for (var j = 0; j < playlistController.loadedPlaylistSongs.length; j++) {
                    playlistController.loadedPlaylistSongs[j].playlistgid = playlists[i].gid;
                }
                playlists[i].tracks = playlistController.loadedPlaylistSongs;
                var playlist = playlists[i];
                // playlists.splice(i,1);
                break;
            }
        }
        if (!exists) {
            for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
                playlistController.loadedPlaylistSongs[i].playlistgid = playlistController.globalIdPlaylist;
            }
            playlist = {gid: playlistController.globalIdPlaylist, id: playlistController.globalIdPlaylist, name: playlistTitle, isPlaylist: true, tracks: playlistController.loadedPlaylistSongs}
            playlists.push(playlist);

        }


        playlistController.globalIdPlaylist++;
        playlistController.playlists = playlists;



       // window.localStorage.playlists = JSON.stringify(playlists);
        // alert("SAVE!!");
        console.dir("SAVE");
        console.dir(playlistController.playlists);
        console.dir("----");
        for (var i = 0; i <  playlistController.playlists.length; i++) {
           accountController.savePlaylist( playlistController.playlists[i].gid, playlistController.playlists[i].name,i,JSON.stringify( playlistController.playlists[i].tracks))
        }


        $scope.safeApply();
        $('#playlistselectverticalform').trigger('chosen:updated');
        return   playlist.gid;
    }


}


playlistController.selectPlaylist = function (playlist) {

    $('#playlistselectverticalform option[value="' + playlist.gid + '"]').prop('selected', true);
    $('#playlistselectverticalform').trigger('chosen:updated');

    setTimeout(function () {
        $('#playlistselectverticalform').trigger('chosen:close');
        $("#clearChoosenPlaylists").show();
        $("#playlistselectverticalform").trigger('change');
        uiController.updateUI();
    }, 0)


}


playlistController.loadPlaylist = function (playlist) {

    if (playlistController.loadedPlaylistSongs.length > 0 && playlistController.loadedPlaylistSongs[0].isPlaylist)
        playlistController.loadedPlaylistSongs = [];


    playlistController.loadedPlaylistSongs = playlist.tracks.concat(playlistController.loadedPlaylistSongs)


    // $("#playlistview").hide();
    $scope.safeApply();
    $("#playlistview").listview('refresh');
    playlistController.remarkSong();

    uiController.makePlayListSortable();

    setTimeout(function () {
        uiController.playListScroll.refresh();
    }, 150)


}


