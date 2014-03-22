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


playlistController.playingSongInPlaylist = false;
playlistController.playingSongId = null;
playlistController.playingSongName = "";
playlistController.playingSongArtist = "";


playlistController.shuffleMode = false;

playlistController.playedSongs = [];


playlistController.playlists = [
    {gid: 0, id: 0, name: "Rock", isPlaylist: true, tracks: playlistController.loadedPlaylistSongs},
    {gid: 1, id: 1, name: "Charts4/13", isPlaylist: true, tracks: []},
    {gid: 2, id: 2, name: "Chillout", isPlaylist: true, tracks: []},
    {gid: 3, id: 3, name: "Vocals", isPlaylist: true, tracks: []},
    {gid: 4, id: 4, name: "Trance", isPlaylist: true, tracks: []},
    {gid: 5, id: 5, name: "Electro '14", isPlaylist: true, tracks: []}

];

console.dir(playlistController.playlists[0].tracks)

for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
    playlistController.loadedPlaylistSongs[i].playlistgid = 0;
}


window.localStorage.playlists = null;
/*
 var playlists = window.localStorage.playlists;
 if (playlists)
 playlistController.playlists = JSON.parse(playlists);

 */
console.log("--------------------------")
console.dir(playlistController.playlists)

playlistController.globalIdPlaylist = playlistController.playlists.length;


playlistController.loadedPlaylistSongs = playlistController.playlists;

playlistController.loadedPlaylistSongs = [];
playlistController.playlists = [];  //CLEAR_______________________________________________________________

playlistController.counterGlobalId = playlistController.loadedPlaylistSongs.length; //TODO


playlistController.disableStopControl = function (disable) {

    if (disable) {
        $(".mejs-stop-button button").css("opacity", "0.5");

    } else {
        $(".mejs-stop-button button").css("opacity", "1");
    }

    // alert( $(".mejs-stop-button button").length)

}

playlistController.disablePlayStopControls = function (disable) {


    if (disable) {
        $(".mejs-playpause-button button").css("opacity", "0.5");
        $(".mejs-stop-button button").css("opacity", "0.5");

    } else {
        $(".mejs-playpause-button button").css("opacity", "1");
        $(".mejs-stop-button button").css("opacity", "1");

    }


}


playlistController.disableControls = function (disable) {

    if (disable) {
        $(".mejs-nexttrack-button button").css("opacity", "0.5");
        $(".mejs-prevtrack-button button").css("opacity", "0.5");
        $(".mejs-shuffle-button button").css("opacity", "0.5");
    } else {
        $(".mejs-nexttrack-button button").css("opacity", "1");
        $(".mejs-prevtrack-button button").css("opacity", "1");
        if (playlistController.shuffleMode)
            $(".mejs-shuffle-button button").css("opacity", "1");
        else
            $(".mejs-shuffle-button button").css("opacity", "0.5");
    }

}


playlistController.disablePositionControls = function (disable) {

    if (disable) {
        $(".mejs-nexttrack-button button").css("opacity", "0.5");
        $(".mejs-prevtrack-button button").css("opacity", "0.5");
    } else {
        $(".mejs-nexttrack-button button").css("opacity", "1");
        $(".mejs-prevtrack-button button").css("opacity", "1");
    }

}


playlistController.resetPlayingSong = function () {

    playlistController.isLoading = false;

    $(".mejs-controls").find('.mejs-time-loaded').show();

    if ($(".mejs-controls").find('.mejs-time-buffering').css("opacity") > 0)
        $(".mejs-controls").find('.mejs-time-buffering').fadeOut();

    mediaController.playCounter = mediaController.playCounter + 1;

    $("#videoplayer").css("opacity", "0");
    $("#videoplayer").css("pointer-events", "none");

    playlistController.loadingSong = playlistController.loadingOldSong;
    playlistController.playingSongName = playlistController.playingOldSongName;
    playlistController.playingSongArtist = playlistController.playingOldSongArtist;

    if (playlistController.loadingSong) {
        playlistController.playSong(playlistController.loadingSong, true)
        playlistController.setNewTitle(playlistController.loadingSong.name, mediaController.getSongCover(playlistController.loadingSong), true);

    }
    else {
        playlistController.playingSongId = null;
        helperFunctions.clearBackground(".songlist li.loadedsong.stillloading .loadingSongImg");
        $(".songlist li").removeClass("loadedsong playing stillloading plausing");
        playlistController.disableControls(true);
        playlistController.disableStopControl(true);
        $("#videoplayer").css("opacity", "0");
        $("#videoplayer").css("pointer-events", "none");
        $(".iScrollPlayIndicator").hide();

        playlistController.setNewTitle("", "", true);
        $(".mejs-button-lyrics button").css("opacity", "0.5");
    }


}


playlistController.playSong = function (song, onlyStyle, playedAutomatic) {

    if (!playedAutomatic)
        $("#searchlist li.selected").removeClass("selected");


    //Is Playlist
    if (song.isPlaylist) {
        playlistController.selectPlaylist(song)
        return;
    }


    console.log((Date.now() - playlistController.playSongTimer) + "   " + (Date.now() - uiController.swipeTimer))
    if (playlistController.playSongTimer && Date.now() - playlistController.playSongTimer < 100)
        return;
    if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 100)
        return;
    mediaController.versionListSong = null;
    // Used Variables
    var Id = song.id;
    var globalId = song.gid;
    if (globalId)
        var isPlaylistSong = true;
    else
        isPlaylistSong = false;
    var playArtist = mediaController.getSongArtist(song);
    var playTitle = song.name;

    if (isPlaylistSong) {

        var listElement = $("#playlistInner li[data-songid='playlistsong" + Id + "'] ");
        var newId = globalId
    }
    else {
        //  listElement = $("#searchlist li[data-songid='searchsong" + Id + "'] ");

        listElement = $("#searchlist li[data-songtitle='" + song.name + "-" + mediaController.getSongArtist(song) + "'] ");


        newId = Id
    }


    playlistController.playingSongInPlaylist = isPlaylistSong;

    playlistController.playSongTimer = Date.now();


    var isSameSong = (playlistController.playingSongId == newId) && (playlistController.playingSongName == song.name) && (playlistController.playingSongArtist == mediaController.getSongArtist(song));


    //Already Loading
    if (playlistController.isLoading && isSameSong)
        return;


    if (!playlistController.isLoading) {
        playlistController.loadingOldSong = playlistController.loadingSong;
        playlistController.playingOldSongName = playlistController.playingSongName;
        playlistController.playingOldSongArtist = playlistController.playingSongArtist;
    }

    playlistController.loadingSong = song;
    playlistController.playingSongName = song.name;
    playlistController.playingSongArtist = mediaController.getSongArtist(song);


    if (mediaController.showLyrics)
        $("#lyricsifrm").attr("src", "http://lyrics.wikia.com/" + mediaController.getSongArtist(playlistController.loadingSong) + ":" + playlistController.loadingSong.name);
    $(".mejs-button-lyrics button").css("opacity", "1");

    if (!playlistController.loadingOldSong) {
        playlistController.disableStopControl(false);
    }

    if (isPlaylistSong) {

        var y = 22 + parseInt(Id.substring(5)) / (playlistController.loadedPlaylistSongs.length - 1) * ($("#playlistInner").height() - 11 - 49);
        $("#playlistInner .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px)').css('-moz-transform', 'translate(0px, ' + y + 'px)').css('-ms-transform', 'translate(0px, ' + y + 'px)').css('transform', 'translate(0px, ' + y + 'px)')

        $("#playlistInner .iScrollPlayIndicator").fadeIn();
        $("#searchlist .iScrollPlayIndicator").hide();

    }
    else {
        var y = 22 + parseInt(Id.substring(5)) / (searchController.searchResults.length - 1) * ($("#searchlist").height() - 11 - 49);
        $("#searchlist .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px)').css('-moz-transform', 'translate(0px, ' + y + 'px)').css('-ms-transform', 'translate(0px, ' + y + 'px)').css('transform', 'translate(0px, ' + y + 'px)')
        $("#searchlist .iScrollPlayIndicator").fadeIn();
        $("#playlistInner .iScrollPlayIndicator").hide();

    }


    playlistController.disableControls(false);

    helperFunctions.clearBackground(".songlist li.loadedsong.stillloading .loadingSongImg");

    $(".songlist li").removeClass("loadedsong playing plausing stillloading");

    //Clicked first Time, loading song?
    var loadedSong = false;

    if (!playlistController.isLoading && playlistController.playingSongId) {
        if (playlistController.isPlaying) {
            if (isSameSong)
                $(listElement.get(0)).addClass("playing");
            listElement.removeClass("stillloading");
        }
        else
            $(listElement.get(0)).addClass("pausing");
    }

    if (!onlyStyle) {
        if (!isSameSong) {

            playlistController.isLoading = true;
            loadedSong = true;
            $(listElement.get(0)).addClass("stillloading");
            listElement.removeClass("pausing");

            if (playlistController.loadingSong.streamURL)
                mediaController.playStreamURL(playlistController.loadingSong.streamURL);
            else
                mediaController.playStream(playArtist, playTitle, playedAutomatic);

            console.log("LOAD STREAM")
            playlistController.playedSongs.push(playlistController.loadingSong);

        }
    }
    playlistController.playingSongId = newId;


    $(listElement.get(0)).addClass("loadedsong")

    helperFunctions.animateBackground(".songlist li.loadedsong.stillloading .loadingSongImg", "public/img/loader/sprites.png", 46, 46, 18, 46, 4);


    if (!onlyStyle) {
        if (!loadedSong) {
            setTimeout(function () {
                $(".mejs-playpause-button").click();
            }, 50);
        }
        else
            playlistController.setNewTitle(playlistController.loadingSong.name, mediaController.getSongCover(playlistController.loadingSong));
    }


    $scope.safeApply();
    uiController.styleTopButtons();


    setTimeout(function () {
        $("#playingSongInfoLink").css("opacity", "1");
        $("#buySongLink").css("opacity", "1");
    }, 500)

}


playlistController.setNewTitle = function (title, coverUrl, isLoaded) {

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
        var style = $('<style id="playingSongInfoStyle">' +
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

playlistController.getIsLoadingText = function (always) {
    if (playlistController.isLoading || always)
        return " ...";
    else
        return "";
}


playlistController.getPlayingTitle = function () {

    if (playlistController.loadingSong) {
        return mediaController.getSongDisplayName(playlistController.loadingSong);
    }
    else
        return "";
}


playlistController.getPlayingSong = function () {
    if (playlistController.loadingSong)
        return playlistController.loadingSong;
    else
        return {name: ""};
}


playlistController.getPlayingSepSign = function () {
    if (playlistController.loadingSong) {
        return "";
    } else
        return "";

}


playlistController.playNextSong = function () {

    if (playlistController.playingSongInPlaylist) {


        var index = playlistController.getIndexOfSong(playlistController.loadingSong, playlistController.loadedPlaylistSongs);
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

            playlistController.playSong(playlistController.loadedPlaylistSongs[index], false, true)
        } else if (playlistController.loadedPlaylistSongs.length > 0 && !playlistController.loadedPlaylistSongs[0].isPlaylist) {

            playlistController.playSong(playlistController.loadedPlaylistSongs[0], false, true)

        } else
            playlistController.disablePositionControls(true);

    } else {

        index = playlistController.getIndexOfSong(playlistController.loadingSong, searchController.searchResults);
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
            playlistController.playSong(searchController.searchResults[index], false, true)
        } else
            playlistController.disablePositionControls(true);

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
    if (playlistController.playingSongInPlaylist) {
        var index = playlistController.getIndexOfSong(playlistController.loadingSong, playlistController.loadedPlaylistSongs);
        if (index == -1) {
            if (playlistController.playedSongs.length == 0) {
                index = 1;
            }
            emptyList = true;
        }

    } else {
        index = playlistController.getIndexOfSong(playlistController.loadingSong, searchController.searchResults);
        if (index == -1) {
            if (playlistController.playedSongs.length == 0) {
                index = 1;
            }
            emptyList = true;

        }
    }

    //  index wo in sichtbarem bereich

    // alert("actuel Index " + index + " ANZAHL:::: " + playlistController.playedSongs.length)


    if (playlistController.playedSongs.length > 0) {

        var song = playlistController.playedSongs[playlistController.playedSongs.length - 1];
        playlistController.playedSongs.splice(playlistController.playedSongs.length - 1, 1);

        //     alert("prev Song "+song)


        var alreadyInList = (song == playlistController.loadingSong);

        /*if (playlistController.playingSongInPlaylist) {
         alreadyInList = (index >= 0 && song == playlistController.loadedPlaylistSongs[index]);
         } else {
         alreadyInList = (index >= 0 && song == searchController.searchResults[index]);
         } */

        if (alreadyInList) {
            if (playlistController.playedSongs.length >= 1) {
                song = playlistController.playedSongs[playlistController.playedSongs.length - 1];
                playlistController.playedSongs.splice(playlistController.playedSongs.length - 1, 1);
            }
            else
                song = null;
        }
    }

    // alert("alreadyInList " + alreadyInList + "   prev song " + song + "   " + playlistController.playedSongs.length)
    if (!song) {

        if (emptyList) {

            if (playlistController.playingSongInPlaylist) {
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


        if (playlistController.playingSongInPlaylist) {
            if (index <= -1)
                index = playlistController.loadedPlaylistSongs.length - 1;
            playlistController.playSong(playlistController.loadedPlaylistSongs[index])
        } else {
            if (index <= -1)
                index = searchController.searchResults.length - 1;
            playlistController.playSong(searchController.searchResults[index])
        }

    } else
        playlistController.playSong(song)


}


playlistController.remarkSong = function () {
    var y, listElement;

    if (playlistController.loadingSong) {
        if (playlistController.playingSongInPlaylist) {
            y = 22 + parseInt(playlistController.loadingSong.id.substring(5)) / (playlistController.loadedPlaylistSongs.length - 1) * ($("#playlistInner").height() - 11 - 49);
            $("#playlistInner .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px)').css('-moz-transform', 'translate(0px, ' + y + 'px)').css('-ms-transform', 'translate(0px, ' + y + 'px)').css('transform', 'translate(0px, ' + y + 'px)')


            $("#playlistInner .iScrollPlayIndicator").fadeIn();
            $("#searchlist .iScrollPlayIndicator").hide();

            listElement = $("#playlistInner li[data-songgid='playlistsong" + playlistController.loadingSong.gid + "'] ");


            listElement.addClass("loadedsong");

            if (playlistController.isPlaying) {
                $($(".songlist li.loadedsong").get(0)).addClass("playing");
                $(".songlist li.loadedsong").removeClass("pausing");
            } else {
                $($(".songlist li.loadedsong").get(0)).addClass("pausing");
                $(".songlist li.loadedsong").removeClass("playing");

            }

        } else {
            y = 22 + parseInt(playlistController.loadingSong.id.substring(5)) / (searchController.searchResults.length - 1) * ($("#searchlist").height() - 11 - 49);
            $("#searchlist .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px)').css('-moz-transform', 'translate(0px, ' + y + 'px)').css('-ms-transform', 'translate(0px, ' + y + 'px)').css('transform', 'translate(0px, ' + y + 'px)')
            $("#searchlist .iScrollPlayIndicator").fadeIn();
            $("#playlistInner .iScrollPlayIndicator").hide();

            listElement = $("#searchlist li[data-songtitle='" + playlistController.loadingSong.name + "-" + mediaController.getSongArtist(playlistController.loadingSong) + "'] ");
            listElement.addClass("loadedsong");
            if (playlistController.isPlaying) {
                $($(".songlist li.loadedsong").get(0)).addClass("playing");
                $(".songlist li.loadedsong").removeClass("pausing");
            } else {
                $($(".songlist li.loadedsong").get(0)).addClass("pausing");
                $(".songlist li.loadedsong").removeClass("playing");
            }


        }
    }
}


playlistController.selectSong = function (song) {
    console.log("!!!!!!!!!!!!dfdfdfgdfjdffgj")
    if (!uiController.swipeTimer || Date.now() - uiController.swipeTimer > 500) {
        var Id = song.id;
        console.log("!!!!!!----ö " + Id+"     "+song.gid)
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

    }
}


playlistController.toggleShuffleSongs = function () {

    if (playlistController.loadingSong) {
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


