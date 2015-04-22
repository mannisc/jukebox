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


playbackController.lastClickedElement = null;

playbackController.dblclickedDelay = 400;
/**
 * Clicked on Element in list
 * @param event
 * @param element
 * @param onlyStyle
 */
playbackController.clickedElement = function (event, element, onlyStyle) {


    console.log("");
    console.log("");
    console.log("");
    console.log("");

    console.log("clickedElement??? "+(Date.now() - uiController.swipeTimer));

    //Swiped?
    if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 100)
        return;


    //NORMAL CLICK
    var songlist = $(event.target).parents("li");



    console.log("clickedElement!!!!");

    console.log("songlist "+songlist.length);

    if (songlist.length > 0) {

        if (element.isArtist) {
            searchController.artists.showArtist(element);
        } else {

            console.log("(event.clientX - songlist.offset().left): " + (event.clientX - songlist.offset().left))
            if (songlist.length > 0 && (event.clientX - songlist.offset().left) < 115) {
                playlistController.selection.selectElement(element)
            } else
            //Playlist?
            if (element.isPlaylist) {
                //Select Playlist
                if (element.gid) {
                    playlistController.ui.showPlaylist(element);

                    //Show playlist in search list
                } else {
                    searchController.playlists.showPlaylist(element);
                }

                //Artist
            } else if (element.isArtist) {
                searchController.artists.showArtist(element);
            }
            else {
                //Play Song
                playbackController.playSong(element, onlyStyle, false, true);
            }

        }

    }


    event.stopPropagation();



     /** DOUBLE CLICK HANDLING

    var doubleClick = function () {

        //Playlist?
        if (element.isPlaylist) {
            //Select Playlist
            if (element.gid) {
                playlistController.ui.showPlaylist(element);

                //Show playlist in search list
            } else {
                searchController.playlists.showPlaylist(element);
            }

            //Artist
        } else if (element.isArtist) {
            searchController.artists.showArtist(element);
        }
        else {
            //Play Song
            playbackController.playSong(element, onlyStyle, false, true);
        }

    }

    var normalClick = function () {


        if ($scope.isMobile) {
            doubleClick();
        } else {


            playbackController.lastClickedElement = {element: element, time: Date.now()}
            setTimeout(function () {
                if (playbackController.lastClickedElement) {

                    //NORMAL CLICK
                    var songlist = $(event.target).parents("li");
                    if (songlist.length > 0) {

                        if (element.isArtist) {
                            searchController.artists.showArtist(element);
                        } else {
                            var songlist = $(event.target).parents("li")
                            console.log("(event.clientX - songlist.offset().left): " + (event.clientX - songlist.offset().left))
                            if (songlist.length > 0 && (event.clientX - songlist.offset().left) < 115) {
                                playlistController.selection.selectElement(element)
                            } else
                                doubleClick();
                        }

                    }

                    //Clicked on Cover -> Select Song

                }
            }, playbackController.dblclickedDelay + 1)

        }

    }

    if (playbackController.lastClickedElement) {

        if (playbackController.lastClickedElement.element == element) {

            if (Date.now() - playbackController.lastClickedElement.time < playbackController.dblclickedDelay) {
                playbackController.lastClickedElement = null;
                if (!$scope.isMobile)
                    doubleClick();


            } else {
                normalClick();
            }

        } else
            normalClick();
    } else
        normalClick();

      event.stopPropagation();
    **/



}

/**
 * Double clicked on Element in list
 * @param event

 */
playbackController.doubleClickedElement = function (event) {

    //Swiped?
    //if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 100)
    //    return;

    event.stopPropagation();

}

playbackController.touchedElement = function (event, onlyStyle) {

    console.log("SWIPE?? " + uiController.swipeTimer + "  " + (Date.now() - uiController.swipeTimer))

    if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 250)
        return;


    if ($(event.target).is("li"))
        var listElement = $(event.target);
    else
        listElement = $(event.target).parents("li");


    var element = listElement.data("genre");

    if (element) {
        console.dir(element);
        mediaController.loadGenre(element);
    } else {

        element = listElement.data("song") || listElement.data("artist") || listElement.data("playlist");
        if (element)
            playbackController.clickedElement(event, element, onlyStyle);
    }


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

    console.log("PLAYSONG")

    console.log("TESTESTEST")


    //Song for which version list is currently loaded set to null
    mediaController.versionListSong = null;


    var listElement = playbackController.getListElementFromElement(song);


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

    if (!playbackController.playingSong) {//&&!uiController.isTouchSupported()) {
        $("#searchcontent, #playlistInner").removeClass("isvisiblestart");
        uiController.checkIfListHintsNecessary();
    }


    //Set loading/playing Song to selected Song
    playbackController.updatePlayingSongIndex();
    playbackController.playingSong = jQuery.extend(true, {}, song);
    // if(playlistController.getLoadedPlaylist().isSimilarSongs)  //Always load Similar Songs
    playlistController.getSimilarSongs(playbackController.playingSong);

    //Google analytics
    ga('send', 'song', 'media', 'play', mediaController.getSongDisplayName(playbackController.playingSong));


    //Clear other loading songs
    $(".songlist li.loadedsong.stillloading").removeClass("loadedsong stillloading");

    $(".songlist li.loadedsong").addClass("oldloadedsong").removeClass("loadedsong");    //playing pausing

    listElement.removeClass("playing pausing oldloadedsong");

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
            playbackController.setNewTitle(playbackController.playingSong.name, mediaController.getSongCover(playbackController.playingSong));


            if (addSongToQueue) {
                if (playbackController.playingSong.playlistgid != playlistController.currentQueue.gid) {

                    var actSong = jQuery.extend(true, {}, song);

                    actSong.playlistgid = playlistController.currentQueue.gid;
                    var actSongList = [actSong];
                    playlistController.prepareGIDsToInsertSongsIntoPlaylist(playlistController.currentQueue, actSongList)
                    //alert(actSong.gid)
                    playbackController.playingSong.gid = actSong.gid;  //neccessary if gid was changed because same music title was played
                    playbackController.playingSong = actSongList[0];

                    setTimeout(function () {
                        playlistController.insertSongsIntoQueue(actSongList);
                        playbackController.updatePlayingSongIndex();
                    }, 0);
                    if (playlistController.loadedPlaylists["0"])
                        addedToQueue = true;

                } else
                    playbackController.updatePlayingSongIndex();

                if (!playedAutomatic && playlistController.playlistMode) {
                    setTimeout(function () {
                        playlistController.ui.animateAddedToList($(".currentqueue"));
                    }, 300)
                }
            } else
                playbackController.updatePlayingSongIndex();

            playbackController.isLoading = true;
            playbackController.playingSongTimer = null;


            playbackController.startedLoadingTime = Date.now();


            if (playbackController.playingSong.streamURL)
                mediaController.playStreamURL(playbackController.playingSong.streamURL);
            else
                mediaController.playStream(mediaController.getSongArtist(playbackController.playingSong), playbackController.playingSong.name, playedAutomatic, 1);


            playbackController.playedSongs.push(playbackController.playingSong);


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
        videoController.disableShareSocialControl(false);

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

    if (playbackController.playingSong) {
        for (var i = playlistController.currentQueue.tracks.length - 1; i >= 0; i--) {

            if (playlistController.currentQueue.tracks[i].gid == playbackController.playingSong.gid) {
                playbackController.playingSongIndex = i;
                break;
            }
        }

    } else if (playlistController.currentQueue.tracks && playlistController.currentQueue.tracks.length > 0) {
        playbackController.playingSongIndex = playlistController.currentQueue.tracks.length - 1;
    }

};


/**
 * Set New Title of Playing/Loading Song
 * @param title
 * @param coverUrl
 * @param isLoaded
 */
playbackController.setNewTitle = function (title, coverUrl, isLoaded) {
    if (!isLoaded) {

        facebookHandler.updateSongFBButtons();

        $("#playingSongCover").removeClass("fadeincomplete")
        $("#playingSongTitle").removeClass("fadeincomplete");
        $("#playingSongTitle").hide();
        $("#playingSongTitleLoading").hide();

        $("#playingSongCover").hide();
    }

    setTimeout(function () {


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

        var song = playbackController.getPlayingSong();

        if (song.name != "" && searchinput != "") {
            window.history.replaceState("", document.title, "/?search=" + searchinput + "&artist=" + mediaController.getSongArtist(song) + "&title=" + song.name);
        }
        else if (song.name != "") {
            window.history.replaceState("", document.title, "/?artist=" + mediaController.getSongArtist(song) + "&title=" + song.name);
        }
        else if (searchinput != "") {
            window.history.replaceState("", document.title, "/?search=" + searchinput);
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
        setTimeout(function () {
            videoController.playSong();
        }, 0)


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
        setTimeout(function () {
            videoController.playSong();
        }, 0)


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

    var listElement = playbackController.getListElementFromElement(playbackController.playingSong);

    if (!listElement || listElement.length == 0) {
        $("#searchlist .iScrollPlayIndicator").hide();
        $("#playlistInner .iScrollPlayIndicator").hide();
    } else {


//Set playing Indicator position

        if (listElement.parents("#playlistInner").length > 0) {

            var scrollHeight = $("#playlistScroll .iScrollVerticalScrollbar").height() - 2;

            var listElementPlaylist = listElement.filter(':noparents(#playlistInner)');


            var otherTopHeight = $("#playlistScroll .othertopheight.songlisttitlebutton:visible").length * 10;
            var otherTopElements = $("#playlistScroll .othertopheight:visible");

            for (var i = 0; i < otherTopElements.length; i++) {
                otherTopHeight = otherTopHeight + $(otherTopElements.get(i)).height();
            }


            otherTopHeight = otherTopHeight / ($("#playlistScroll ul").outerHeight() - 65) * scrollHeight;

            var otherBottomHeight = $("#playlistScroll .otherbottomheight.songlisttitlebutton:visible").length * 10;
            var otherBottomElements = $("#playlistScroll .otherbottomheight:visible");
            for (i = 0; i < otherBottomElements.length; i++) {
                otherBottomHeight = otherBottomHeight + $(otherBottomElements.get(i)).height();
            }

            otherBottomHeight = otherBottomHeight / ($("#playlistScroll ul").outerHeight() - 65) * scrollHeight;


            var position = listElementPlaylist.get(0).dataset.index;


            if (playlistController.loadedPlaylistSongs.length == 1)
                var y = 0;
            else
                y = 5 + parseInt(position) / ( Math.min(playlistController.ui.getDisplayLimit(), playlistController.loadedPlaylistSongs.length) - 1) * (scrollHeight - otherTopHeight - otherBottomHeight) + otherTopHeight;

            if (y > scrollHeight)
                y = scrollHeight;


            if (y || y == 0) {
                $("#playlistScroll .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px)  scale(1.4)').css('-moz-transform', 'translate(0px, ' + y + 'px)  scale(1.4)').css('-ms-transform', 'translate(0px, ' + y + 'px)  scale(1.4)').css('transform', 'translate(0px, ' + y + 'px)  scale(1.4)')
                $("#playlistScroll .iScrollPlayIndicator").show();
            } else
                $("#playlistScroll .iScrollPlayIndicator").hide();

        } else
            $("#playlistScroll .iScrollPlayIndicator").hide();

        if (listElement.parents("#searchlist").length > 0) {

            scrollHeight = $("#searchlist .iScrollVerticalScrollbar").height();


            var listElementSearchlist = listElement.filter(':noparents(#searchlist)');

            otherTopHeight = $("#searchlist .othertopheight.songlisttitlebutton:visible").length * 10 + $("#searchlist .othertopheightbig:visible").length * 113;


            otherTopElements = $("#searchlist .othertopheight:visible");

            for (var i = 0; i < otherTopElements.length; i++) {
                otherTopHeight = otherTopHeight + $(otherTopElements.get(i)).height();
            }


            otherTopHeight = otherTopHeight / ($("#searchlist ul").outerHeight() - 65) * scrollHeight;

            otherBottomHeight = $("#searchlist .otherbottomheight.songlisttitlebutton:visible").length * 10 + $("#searchlist .otherbottomheight:visible").length * 113;

            otherBottomElements = $("#searchlist .otherbottomheight:visible");
            for (i = 0; i < otherBottomElements.length; i++) {
                otherBottomHeight = otherBottomHeight + $(otherBottomElements.get(i)).height();
            }

            otherBottomHeight = otherBottomHeight / ($("#searchlist ul").outerHeight() - 65) * scrollHeight;


            position = listElementSearchlist.get(0).dataset.index;

            if (searchController.songs.searchResults.length == 1)
                y = 0;
            else
                y = 5 + parseInt(position) / ( Math.min(searchController.getShowModeLimit(1), searchController.songs.searchResults.length) - 1) * (scrollHeight - otherTopHeight - otherBottomHeight) + otherTopHeight;

            if (y > scrollHeight)
                y = scrollHeight;

            if (!y)
                y = 0;
            $("#searchlist .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px) scale(1.4)').css('-moz-transform', 'translate(0px, ' + y + 'px) scale(1.4)').css('-ms-transform', 'translate(0px, ' + y + 'px) scale(1.4)').css('transform', 'translate(0px, ' + y + 'px) scale(1.4)')
            if ($("#searchlist .iScrollPlayIndicator:visible").length == 0) {
                $("#searchlist .iScrollPlayIndicator").show();
            }


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
            $("#playlistInner .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px) scale(1.4)').css('-moz-transform', 'translate(0px, ' + y + 'px) scale(1.4)').css('-ms-transform', 'translate(0px, ' + y + 'px) scale(1.4)').css('transform', 'translate(0px, ' + y + 'px) scale(1.4)')
        }
        else {
            $("#searchlist .iScrollPlayIndicator").css('-webkit-transform', 'translate(0px,' + y + 'px) scale(1.4)').css('-moz-transform', 'translate(0px, ' + y + 'px) scale(1.4)').css('-ms-transform', 'translate(0px, ' + y + 'px) scale(1.4)').css('transform', 'translate(0px, ' + y + 'px) scale(1.4)')
        }
    }


}


/**
 * Get Dom List Element from element
 * @param element
 * @param onlyList 1:searchlist, 2:playlist

 */
playbackController.getListElementFromElement = function (element, onlyList, alsoPlaylist) {
    if (!element)
        return $([]);

    var playlistElements = [], searchListElements = [];

    if (!onlyList || onlyList == 1)
        searchListElements = $("#searchlist li[data-elementtitle='" + mediaController.getElementTitle(element) + "'] ");

    if ((!playlistController.playlistMode || alsoPlaylist) && (!onlyList || onlyList == 2))
        playlistElements = $("#playlistInner li[data-songgid='playlistsong" + element.gid + "']");


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

    if (uiController.dontRemark) {
        setTimeout(function () {
            playbackController.remarkSong();
        }, 150)
    }
    else {
        var listElement;

        listElement = playbackController.getListElementFromElement(playbackController.playingSong);

        $(".songlist .loadedsong").not(listElement).removeClass("loadedsong");
        var safe = $(".songlist .oldloadedsong.playing")
        $(".songlist .playing").not(listElement).removeClass("playing");

        safe.addClass("playing")

        safe = $(".songlist .oldloadedsong.pausing")
        $(".songlist .pausing").removeClass("pausing");
        safe.addClass("pausing")

        $(".songlist .stillloading").not(listElement).removeClass("stillloading");

        if (playbackController.playingSong) {
            if (listElement.length > 0) {


                listElement.addClass("loadedsong");

                if (playbackController.isLoading) {
                    listElement.addClass("stillloading");
                    //listElement.find(".loadingSongImg").show();

                } else if (videoController.isPlaying) {

                    listElement.addClass("playing").removeClass("stillloading");
                    listElement.removeClass("pausing");
                }
                else {
                    listElement.addClass("pausing").removeClass("stillloading");
                    listElement.removeClass("playing");
                }
                playbackController.positionPlayIndicator();

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































































































