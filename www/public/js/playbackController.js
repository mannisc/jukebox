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
 * @param event

 */
playbackController.doubleClickedElement = function (event) {

    event.stopPropagation();

}

playbackController.touchedElement = function (event, onlyStyle) {

    if ($(event.target).is("li"))
        var listElement = $(event.target);
    else
        listElement = $(event.target).parents("li");
    var element = listElement.data("song");

    playbackController.clickedElement(event, element, onlyStyle);

}

/**
 * Clicked on Element in list
 * @param event
 * @param element
 * @param onlyStyle
 */
playbackController.clickedElement = function (event, element, onlyStyle) {
    //Swiped?
    if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 100)
        return;

    //Clicked on Cover -> Select Song
    var songlist = $(event.target).parents("li")
    if (songlist.length > 0 && (event.clientX - songlist.offset().left) < 65) {
        playlistController.selectSong(element)
        return;
    }


    //Playlist or song?
    if (element.isPlaylist) {
        //Select Playlist

        playlistController.selectPlaylist(element);
    } else {
        //Play Song
        playbackController.playSong(element, onlyStyle, false, true);
    }

    event.stopPropagation();


}


/**
 * Play song, triggered manually or automatic
 * @param song
 * @param resetingSong
 * @param playedAutomatic
 */
playbackController.playSong = function (song, resetingSong, playedAutomatic, addSongToQueue) {
    //Dont play multiple songs within 100ms
    if (playbackController.playSongTimer && Date.now() - playbackController.playSongTimer < 100) {
        playbackController.playSongTimer = Date.now();
        return;
    } else
        playbackController.playSongTimer = Date.now();

    //Song for which version list is currently loaded set to null
    mediaController.versionListSong = null;

    var listElement = playbackController.getListElementFromSong(song);

    if (!resetingSong) {
        //Check if song already playing
        var isSameSongAsLoadedSong = listElement.hasClass("oldloadedsong") || (listElement.hasClass("loadedsong") && playbackController.playingSong && (((!song.gid) || (playbackController.playingSong.gid == song.gid)) && playbackController.playingSong.name == song.name) && (mediaController.getSongArtist(playbackController.playingSong) == mediaController.getSongArtist(song)));
        //New song is already loading/playing song
        if (isSameSongAsLoadedSong) {
            //Already Loading, and not loaded yet (no pausing possible)
            if (playbackController.isLoading) {
                playbackController.resetPlayingSong();
                return;

            }
            //Toggle Playing/Pausing
            else if (playbackController.playingSong) {


                if (!listElement.hasClass("stillloading")) {
                    setTimeout(function () {
                        videoController.playPauseSong();

                    }, 50);
                }


                return;
            }
        }
    }

    //If not already loading, save the old song to be able to reset if there is a loading error
    if (!playbackController.isLoading && playbackController.playingSong) {
        playbackController.playingOldSong = playbackController.playingSong;
    }

    //Set loading/playing Song to selected Song

    playbackController.playingSong = song;

    //Clear other loading songs
    $(".songlist li.loadedsong.stillloading").removeClass("loadedsong stillloading");

    $(".songlist li.loadedsong").addClass("oldloadedsong").removeClass("loadedsong");    //playing pausing

    listElement.addClass("loadedsong");


    // setTimeout(function () {
    // playbackController.positionPlayIndicator();
    // },0)
    // setTimeout(function () {
    //if (song.gid) {//Song from searchlist
    //     $("#searchlist li").removeClass("stillloading playing pausing");
    // }


    // Element added to current play queue, for synchronizing spinning
    var addedToQueue = false;

    if (!resetingSong) {
        if (!isSameSongAsLoadedSong) {

            if (addSongToQueue) {
                if (playbackController.playingSong.playlistgid != playlistController.currentQueue.gid) {
                    setTimeout(function () {
                        var actSong = jQuery.extend(true, {}, playbackController.playingSong);

                        actSong.playlistgid = playlistController.currentQueue.gid;
                        var actSongList = [actSong];
                        playlistController.prepareGIDsToInsertSongsIntoPlaylist(playlistController.currentQueue, actSongList)

                        playbackController.playingSong = actSongList[0];
                        playlistController.insertSongsIntoQueue(actSongList);
                    }, 0)
                    if (playlistController.loadedPlaylists["0"])
                        addedToQueue = true;

                }

                if (!playedAutomatic && playlistController.playlistMode) {
                    setTimeout(function () {
                        playlistController.animateAddedToList($(".currentqueue"));
                    }, 300)
                }
            }


            playbackController.isLoading = true;
            playbackController.playingSongTimer = null;


            playbackController.startedLoadingTime = Date.now();

            if (playbackController.playingSong.streamURL)
                mediaController.playStreamURL(playbackController.playingSong.streamURL);
            else
                mediaController.playStream(mediaController.getSongArtist(playbackController.playingSong), playbackController.playingSong.name, playedAutomatic);


            playbackController.playedSongs.push(playbackController.playingSong);

            playbackController.setNewTitle(playbackController.playingSong.name, mediaController.getSongCover(playbackController.playingSong));


            playbackController.updatePlayingSongIndex();

        }

    }


    $scope.safeApply();

    if (!addedToQueue) {
        playbackController.remarkSong();

    }


    setTimeout(function () {
        $("#playingSongInfoLink").css("opacity", "1");
        $("#buySongLink").css("opacity", "1");

    }, 500)

    setTimeout(function () {

        //Lyrics
        if (mediaController.showLyrics)
            $("#lyricsifrm").attr("src", "http://lyrics.wikia.com/" + mediaController.getSongArtist(playbackController.playingSong) + ":" + playbackController.playingSong.name);


        videoController.disableLyricsControl(false);
        //Enable stop if there is no old song
        if (!playbackController.playingOldSong)
            videoController.disableStopControl(false);


        //Enable Controls
        videoController.disableControls(false);
    }, 0)

    //   }, 50 )

}


/**
 * Reset playing song after Loading failed
 */
playbackController.resetPlayingSong = function () {
    console.log("RESETTTTT")
    playbackController.isLoading = false;
    mediaController.playCounter = mediaController.playCounter + 1;


    $(".videoControlElements-controls").find('.videoControlElements-time-loaded').show();

    // if ($(".videoControlElements-controls").find('.videoControlElements-time-buffering').css("opacity") > 0)
    //     $(".videoControlElements-controls").find('.videoControlElements-time-buffering').fadeOut();

    videoController.showBuffering(false);


    // $("#videoplayer").css("opacity", "0");
    // $("#videoplayer").css("pointer-events", "none");

    playbackController.playingSong = playbackController.playingOldSong;
    $(".songlist li").removeClass("loadedsong playing stillloading pausing");

    if (playbackController.playingSong) {
        playbackController.playSongTimer = 0;

        playbackController.playSong(playbackController.playingSong, true);      //TODO REMOVE PLAY SONG HERE
        playbackController.setNewTitle(playbackController.playingSong.name, mediaController.getSongCover(playbackController.playingSong), true);

    }
    else {
        //helperFunctions.clearBackground(".songlist li.loadedsong.stillloading .loadingSongImg");
        $(".songlist li.loadedsong.stillloading .loadingSongImg").hide();

        videoController.disableControls(true);
        videoController.disableStopControl(true);
        // $("#videoplayer").css("opacity", "0");
        //  $("#videoplayer").css("pointer-events", "none");
        $(".iScrollPlayIndicator").hide();

        playbackController.setNewTitle("", "", true);
        $(".videoControlElements-button-lyrics button").css("opacity", "0.5");
    }


}

/**
 * Sets new index of Playing song
 */

playbackController.updatePlayingSongIndex = function () {

    playbackController.playingSongIndex = 0;


    for (var i = playlistController.currentQueue.tracks.length - 1; i >= 0; i--) {
        if (playlistController.currentQueue.tracks[i].gid == playbackController.playingSong.gid && playlistController.currentQueue.tracks[i].iid == playbackController.playingSong.iid) {
            playbackController.playingSongIndex = i;
            break;
        }
    }

};


/**
 * Set New Title of Playing/Loading Song
 * @param title
 * @param coverUrl
 * @param isLoaded
 */
playbackController.setNewTitle = function (title, coverUrl, isLoaded) {
    setTimeout(function () {


        if (!isLoaded) {

            facebookHandler.updateSongFBButtons();

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
    }, 150)
}


/**
 * Play next song in songlist
 */

playbackController.playPrevSong = function () {


    if (playlistController.currentQueue.tracks.length == 1) {
        videoController.setProgressPercentage(0);
        videoController.setProgressTime(0);
        videoController.videoPlayer.setProgressPercentage(0);
        setTimeout(function(){
            videoController.playSong();
        },0)


    } else {

        var emptyList = false;
        var index = playbackController.getIndexOfSong(playbackController.playingSong, playlistController.currentQueue.tracks);
        if (index == -1) {
            if (playbackController.playedSongs.length == 0) {
                index = 1;
            }
            emptyList = true;
        }

        if (playbackController.playedSongs.length > 0) {

            var song = playbackController.playedSongs[playbackController.playedSongs.length - 1];
            playbackController.playedSongs.splice(playbackController.playedSongs.length - 1, 1);

            var alreadyInList = ((!song.gid || (song.gid == playbackController.playingSong.gid)) && song.name == playbackController.playingSong.name && mediaController.getSongArtist(song) == mediaController.getSongArtist(playbackController.playingSong));


            if (alreadyInList) {
                if (playbackController.playedSongs.length >= 1) {
                    song = playbackController.playedSongs[playbackController.playedSongs.length - 1];
                    playbackController.playedSongs.splice(playbackController.playedSongs.length - 1, 1);
                }
                else
                    song = null;
            }
        }

        if (!song) {

            if (emptyList) {

                if (playlistController.currentQueue.tracks.length == 0) {
                    videoController.disablePositionControls(true);
                    return;
                }
                else
                    index = 0;


            }
            else
                index = index - 1;


            // alert("PLAYING " + index)


            if (index <= -1)
                index = playlistController.currentQueue.tracks.length - 1;


            playbackController.playSong(playlistController.currentQueue.tracks[index])

            /*else {
             if (index <= -1)
             index = searchController.searchResults.length - 1;
             playbackController.playSong(searchController.searchResults[index])
             }*/

        } else {

            playbackController.playSong(song)

        }

    }
}

/**
 * Play next song in songlist
 */
playbackController.playNextSong = function () {
    if (playlistController.currentQueue.tracks.length == 1) {
        videoController.setProgressPercentage(0);
        videoController.setProgressTime(0);
        videoController.videoPlayer.setProgressPercentage(0);
        setTimeout(function(){
            videoController.playSong();
        },0)


    } else {

        var index = playbackController.getIndexOfSong(playbackController.playingSong, playlistController.currentQueue.tracks);
        if (index >= 0) {
            if (!videoController.shuffleMode) {
                index = index + 1;
                if (index == playlistController.currentQueue.tracks.length)
                    index = 0;
            } else if (playlistController.currentQueue.tracks.length > 1) {
                var oIndex = index;
                do {
                    index = Math.round(Math.random() * ( playlistController.currentQueue.tracks.length - 1))
                }
                while (index == oIndex)
            }

            playbackController.playSong(playlistController.currentQueue.tracks[index], false, true)
        } else if (playlistController.currentQueue.tracks.length > 0) {


            playbackController.playSong(playlistController.currentQueue.tracks[0], false, true)

        } else
            videoController.disablePositionControls(true);
    }

}


/**
 * Position the Play Indicator
 */
playbackController.positionPlayIndicator = function () {


    var listElement = playbackController.getListElementFromSong(playbackController.playingSong);

    if (!listElement || listElement.length == 0) {
        $("#searchlist .iScrollPlayIndicator").hide();
        $("#playlistInner .iScrollPlayIndicator").hide();
    } else {


//Set playing Indicator position


        if (listElement.parents("#playlistInner").length > 0) {

            var listElementPlaylist = listElement.filter(':noparents(#playlistInner)');

            var position = listElementPlaylist.get(0).dataset.index;

            var y = parseInt(position) / (playlistController.loadedPlaylistSongs.length - 1) * ($("#playlistInner .iScrollVerticalScrollbar").outerHeight() - 18);

            $("#playlistInner .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px)').css('-moz-transform', 'translate(0px, ' + y + 'px)').css('-ms-transform', 'translate(0px, ' + y + 'px)').css('transform', 'translate(0px, ' + y + 'px)')
            $("#playlistInner .iScrollPlayIndicator").show();

        } else
            $("#playlistInner .iScrollPlayIndicator").hide();

        if (listElement.parents("#searchlist").length > 0) {

            var scrollHeight = $("#searchlist").outerHeight() - 18;


            var listElementSearchlist = listElement.filter(':noparents(#searchlist)');

            var otherTopHeight = $(".othertopheight.searchlisttitlebutton").length * 10;
            var otherTopElements = $(".othertopheight");

            for (var i = 0; i < otherTopElements.length; i++) {
                otherTopHeight = otherTopHeight + $(otherTopElements.get(i)).height();
            }


            otherTopHeight = otherTopHeight / ($("#searchlist ul").outerHeight() - 65) * scrollHeight;
            var otherBottomHeight = $(".otherbottomheight.searchlisttitlebutton").length * 10;
            var otherBottomElements = $(".otherbottomheight");
            for (i = 0; i < otherBottomElements.length; i++) {
                otherBottomHeight = otherBottomHeight + $(otherBottomElements.get(i)).height();

            }

            otherBottomHeight = otherBottomHeight / ($("#searchlist ul").outerHeight() - 65) * scrollHeight;


            position = listElementSearchlist.get(0).dataset.index;

            y = parseInt(position) / ( Math.min(searchController.getShowModeLimit(1), searchController.songs.searchResults.length) - 1) * (scrollHeight - otherTopHeight - otherBottomHeight) + otherTopHeight;

            $("#searchlist .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px)').css('-moz-transform', 'translate(0px, ' + y + 'px)').css('-ms-transform', 'translate(0px, ' + y + 'px)').css('transform', 'translate(0px, ' + y + 'px)')
            $("#searchlist .iScrollPlayIndicator").show();

        } else
            $("#searchlist .iScrollPlayIndicator").hide();

    }
}


/**
 * Position the Play Indicator at the Top
 */
playbackController.positionPlayIndicatorAtTop = function (searchlist) {
    var y = 0;
//Set playing Indicator position
    if (playbackController.playingSong) {
        if (playbackController.playingSong.gid && !searchlist) {
            $("#playlistInner .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px)').css('-moz-transform', 'translate(0px, ' + y + 'px)').css('-ms-transform', 'translate(0px, ' + y + 'px)').css('transform', 'translate(0px, ' + y + 'px)')
        }
        else {
            $("#searchlist .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px)').css('-moz-transform', 'translate(0px, ' + y + 'px)').css('-ms-transform', 'translate(0px, ' + y + 'px)').css('transform', 'translate(0px, ' + y + 'px)')
        }
    }


}


/**
 * Get Songlist element from song
 * @param song
 * @param onlyList 1:searchlist, 2:playlist

 */
playbackController.getListElementFromSong = function (song, onlyList) {
    if (!song)
        return $([]);

    var playlistElements = [], searchListElements = [];

    if (!onlyList || onlyList == 1)
        searchListElements = $("#searchlist li[data-songtitle='" + song.name + "-" + mediaController.getSongArtist(song) + "'] ");

    if (!onlyList || onlyList == 2)
        playlistElements = $("#playlistInner li[data-songgid='playlistsong" + song.gid + "']");


    return $(searchListElements).add(playlistElements);

}


/**
 * Checks if song is Playing song
 * @param song
 * @returns {boolean}
 */
playbackController.isPlayingSong = function (song) {
    if (playbackController.playingSong && song)
        return  song.gid == playbackController.playingSong.gid || (mediaController.getSongDisplayName(song) == mediaController.getSongDisplayName(playbackController.playingSong))
    else
        return false;


}


/**
 * Checks if song is Playing and loading song
 * @param song
 * @returns {boolean}
 */
playbackController.isLoadingSong = function (song) {

    return playbackController.isPlayingSong(song) && playbackController.isLoading;


}


/**
 * Remark song if list after list reload
 */
playbackController.remarkSong = function () {
    var listElement;


    $(".songlist .loadedsong").removeClass("loadedsong");
    var safe = $(".songlist .oldloadedsong.playing")
    $(".songlist .playing").removeClass("playing");
    safe.addClass("playing")

    safe = $(".songlist .oldloadedsong.pausing")
    $(".songlist .pausing").removeClass("pausing");
    safe.addClass("pausing")

    $(".songlist .stillloading").removeClass("stillloading");

    if (playbackController.playingSong) {
        listElement = playbackController.getListElementFromSong(playbackController.playingSong);
        if (listElement.length > 0) {


            playbackController.positionPlayIndicator();

            listElement.addClass("loadedsong");

            if (playbackController.isLoading) {
                listElement.addClass("stillloading");
                //listElement.find(".loadingSongImg").show();

            } else if (videoController.isPlaying) {
                listElement.addClass("playing");
                listElement.removeClass("pausing");
            }
            else {
                listElement.addClass("pausing");
                listElement.removeClass("playing");
            }
        }
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
        if ((!song.gid || (song.gid == list[index].gid)) && song.name == list[index].name && mediaController.getSongArtist(song) == mediaController.getSongArtist(list[index])) {
            return index;
        }
    }

    //alert("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

    return -1;
}































































































