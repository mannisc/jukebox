/**
 * exploreController.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 05.06.14 - 00:09
 * @copyright munichDev UG
 */



var exploreController = function () {

};


exploreController.songs = function () {
};


exploreController.songs.searchResults = [];


exploreController.usesSearchList = true;

exploreController.index = 1;

exploreController.inputText = "Filter Results";

exploreController.currentSearchID = 0;


exploreController.maxResults = 100;

exploreController.displayLimit = exploreController.maxResults;

/**
 * Something was entered in input
 */
exploreController.onInput = function () {
    exploreController.filterMusic();
}


/**
 * Input was cleared
 */
exploreController.onClear = function () {

    exploreController.removeFilterSongs();

}


/**
 *  Show View
 */
exploreController.showView = function (showFunction) {
    uiController.searchListScroll.scrollTo(0, 0, 0);

    exploreController.visible = true;
    $("#searchinput").val("");

    setTimeout(function () {
        if (exploreController.visible) {
            searchController.displayLimit = searchController.maxResults;
            $scope.safeApply();
            $("#searchlistview").listview('refresh');
            if (showFunction)
                showFunction();

        }
    }, 350)
}


/**
 * Hide View
 */
exploreController.hideView = function () {

    exploreController.currentSearchID++;

    exploreController.visible = false;
    exploreController.displayLimit = 0;
    $scope.safeApply();
    $("#searchlistview").listview('refresh');

}


/**
 * Remove Filter
 */

exploreController.removeFilterSongs = function () {
    uiController.searchListScroll.scrollTo(0, 0, 1000);

    //TODO
    alert("REMOVE FILTER")

    $scope.safeApply();
    playbackController.remarkSong();

    $("#searchlistview").listview('refresh');

    setTimeout(function () {
        uiController.searchListScroll.refresh();
    }, 1000)
    searchController.makeSearchListDraggable();
    setTimeout(function () {
        $("#searchlistview li").removeClass("fadeincompletefast");
    }, 100)
}


exploreController.showSuggestions = function () {  //Todo find songs the user really liked, means played very often for example


    exploreController.currentSearchID = exploreController.currentSearchID + 1;


    var index;
    var song;
    if (playbackController.playingSong) {
        song = playbackController.playingSong;
    }
    else {
        if (playlistController.currentQueue.length > 0) {     //CurrentQueue
            index = Math.round(Math.random() * (playlistController.currentQueue.length - 1));

            song = playlistController.currentQueue[index];
        }
        else if (!playlistController.playlistMode && playlistController.loadedPlaylistSongs.length > 0) { //Loaded Songs
            index = Math.round(Math.random() * (playlistController.loadedPlaylistSongs.length - 1));

            song = playlistController.loadedPlaylistSongs[index];
        }
        else if (searchController.playlists.length > 0) {  //Playlist
            index = Math.round(Math.random() * (searchController.songs.playlists.length - 1));
            if (searchController.playlists[index].tracks.length > 0) {
                var index2 = Math.round(Math.random() * (searchController.playlists[index].tracks.length - 1));
                song = searchController.playlists[index].tracks[index2];
            }
        } else if (searchController.songs.searchResults.length > 0) {    //SearchResult
            index = Math.round(Math.random() * (searchController.songs.searchResults.length - 1));
            song = searchController.songs.searchResults[index];
        }


    }

    if (!song && generatedData.charts && generatedData.charts.length > 0) {
        song = generatedData.charts[0]
    }
    if (song) {
        exploreController.searchSimilarSongs(song);
    }
    else {

        searchController.startSearch("");
    }


}

exploreController.showSimilarSongs = function (event) {
    event.stopPropagation();

    var list = playlistController.getSongListFromSelection();

    var index = Math.round(Math.random() * (list.length - 1));
    var song = list[index];

    playlistController.deselectSongs();

    exploreController.searchSimilarSongs(song);


}


exploreController.searchSimilarSongs = function (song) {


    var searchSimilarSongs = function (song) {

        viewController.showLoading(true);

        exploreController.currentSearchID = exploreController.currentSearchID + 1;

        var search = function (searchID) {
            $.when(
                    exploreController.songs.startSuggestionsSearchDeferred(mediaController.getSongArtist(song), song.name)

                ).then(function (songList) {
                    if (searchID == exploreController.currentSearchID) {

                        //If no suggestions show popular songs
                        if (songList.length == 0) {
                            songList = searchController.preloadedPopularSongs.track;
                        }


                        if (song) {

                            for (var i = 0; i < songList.length; i++) {

                                if (mediaController.getSongDisplayName(songList[i]).toLowerCase() == mediaController.getSongDisplayName(song).toLowerCase()) {
                                    songList.splice(i, 1);

                                    i--;
                                }
                            }

                            song = jQuery.extend(true, {}, song);
                            delete song.gid;
                            delete song.playlistgid;

                            songList = [song].concat(songList);


                        }


                        exploreController.completedSearch(songList);

                    }
                });
        };

        search(exploreController.currentSearchID);
    }


    //If view is alrady active search, otherwise activate view first
    if (viewController.isActiveView(exploreController))   {
        uiController.searchListScroll.scrollTo(0, 0, 1000)
        exploreController.currentSearchID++;
        exploreController.displayLimit = 0;
        $scope.safeApply();
        $("#searchlistview").listview('refresh');
        searchSimilarSongs(song);

    }
    else
        viewController.activateView(exploreController, false, function () {
            searchSimilarSongs(song);
        });


}


exploreController.songs.startSuggestionsSearchDeferred = function (artist, title) {
    var deferred = $.Deferred();

    var onlineSearchURL = "http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&%searchTerm&api_key=" + searchController.lastfmapikey + "&format=json"
    $.when(

            exploreController.basicOnlineSearchDeferred(onlineSearchURL, "artist=" + artist + "&track=" + title, searchController.searchTypeSongs, false, artist)

        ).then(function (onlineList) {
            console.log("FFFOUNDDDD")
            console.dir(JSON.stringify(songList))
            var songList = exploreController.songs.completeSearch([], onlineList);
            console.log("FFFOUNDDDD")
            console.dir(JSON.stringify(songList))
            deferred.resolve(songList);

        });
    return deferred.promise();

}

/**
 * Returned List is processed the same in both views
 */
exploreController.songs.completeSearch = searchController.songs.completeSearch;

/**
 * Basic online Search
 */
exploreController.basicOnlineSearchDeferred = searchController.basicOnlineSearchDeferred;


/**
 * Search was completed
 */
exploreController.completedSearch = function (songList) {
    if (songList) {

        exploreController.displayLimit = 0;

        uiController.searchListScroll.scrollTo(0, 0, 1000)

        if (songList != null)//Something Changed
            exploreController.songs.searchResults = songList;

        console.dir("songList!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.dir(songList);

        exploreController.applySongList(exploreController.currentSearchID);

        /*$scope.safeApply();
         $("#searchlistview").listview('refresh');  */

        setTimeout(viewController.showLoading, 100); //show=false

    }

};


/**
 * Returns true if song in list
 * @param gid
 * @returns {*}
 */
exploreController.isSongInList = function (song) {
    if (song) {
        var displayName = mediaController.getSongDisplayName(song)
        for (var i = 0; i < exploreController.songs.searchResults.length; i++) {
            if (displayName == mediaController.getSongDisplayName(exploreController.songs.searchResults[i])) {
                return true;
            }
        }
    }
    return false;

}


/**
 * Applies search List so that song does not stop all the time
 * @param currentSearchID
 */

exploreController.applySongList = function (currentSearchID) {

    console.log("-------------------------------------")
    $(".specialplaylistbutton").removeClass("fadeincompletefaster");
    $("#searchlist .iScrollIndicator").hide();

    var stepSize = 10;
    var stepDelay = 50;

    var size = exploreController.maxResults;

    var delays = (Math.ceil(size / stepSize));


    viewController.applySongList(currentSearchID, size, delays, stepSize, stepDelay);

}
