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

exploreController.songs.mixedResults = [];


exploreController.usesSearchList = true;

exploreController.index = 1;

exploreController.inputText = "Filter Results";

exploreController.currentSearchID = 0;

exploreController.showMixedResultID = 0;

exploreController.maxResults = 100;

exploreController.displayLimit = exploreController.maxResults;

/**
 * Something was entered in input
 */
exploreController.onInput = function () {
    $("#searchlist .iScrollPlayIndicator").hide();
    $("#searchlist .iScrollScrollUpIndicator").hide();
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
exploreController.showView = function (showFunction, listName) {
    exploreController.listName = listName || "Songs";

    uiController.searchListScroll.scrollTo(0, 0, 0);

    exploreController.visible = true;
    $("#searchinput").val("");

    setTimeout(function () {
        if (exploreController.visible) {

            if (showFunction) {
                exploreController.displayLimit = 0;
                $scope.safeApply();
                $("#searchlistview").listview('refresh');
                showFunction(listName);
            }
            else {

                exploreController.applySongList(exploreController.currentSearchID);

                setTimeout(function () {
                    if (exploreController.visible)
                        viewController.showLoading(false);

                }, 500);
            }


        }
    }, 350);
    viewController.showLoading(true);

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

    exploreController.showSuggestions(true);

}


exploreController.filterMusic = function (filterTerm) {
    if (!filterTerm)
        filterTerm = $("#searchinput").val();
    viewController.showLoading(true);
    uiController.searchListScroll.scrollTo(0, 0, 1000)

    filterTerm = filterTerm.toLowerCase();
    var title = "";
    var artist = "";

    var icounter = 0;
    for (var i = 0; i < exploreController.songs.searchResults.length; i++) {
        artist = mediaController.getSongArtist(exploreController.songs.searchResults[i]);
        title = exploreController.songs.searchResults[i].name;
        artist = artist.toLowerCase();
        title = title.toLowerCase();

        if (title.search(filterTerm) > -1 || artist.search(filterTerm) > -1) {
            if (exploreController.songs.searchResults[i].tmpHide)

                delete exploreController.songs.searchResults[i].tmpHide;

            // console.dir(searchController.songs.searchResults[icounter]);
            icounter++;
        }
        else {
            exploreController.songs.searchResults[i].tmpHide = true;

        }
    }

    $scope.safeApply();
    playbackController.remarkSong();

    $("#searchlistview").listview('refresh');

    setTimeout(function () {
        uiController.searchListScroll.refresh();
        viewController.showLoading(false);
    }, 1000)
    searchController.dragging.makeSearchListDraggable();
    setTimeout(function () {
        $("#searchlistview li").removeClass("fadeincompletefast");
    }, 100)

}

/**
 * Remove Filter
 */

exploreController.removeFilterSongs = function () {
    uiController.searchListScroll.scrollTo(0, 0, 1000);

    //TODO
    for (var i = 0; i < exploreController.songs.searchResults.length; i++) {
        if (exploreController.songs.searchResults[i].tmpHide)
            delete exploreController.songs.searchResults[i].tmpHide;
    }

    $scope.safeApply();
    playbackController.remarkSong();

    $("#searchlistview").listview('refresh');

    setTimeout(function () {
        uiController.searchListScroll.refresh();
    }, 1000)
    searchController.dragging.makeSearchListDraggable();
    setTimeout(function () {
        $("#searchlistview li").removeClass("fadeincompletefast");
    }, 100)
}


exploreController.searchArtistsSongs = function (artist) {
    $("#searchlist .iScrollPlayIndicator").hide();
    $("#searchlist .iScrollScrollUpIndicator").hide();
    $("#searchlist .iScrollIndicator").hide();

    var searchArtistsSongs = function (artist) {

        viewController.showLoading(true);

        exploreController.currentSearchID = exploreController.currentSearchID + 1;

        var search = function (searchID) {
            $.when(
                    exploreController.songs.startArtistSearchDeferred(artist)

                ).then(function (songList) {
                    if (searchID == exploreController.currentSearchID) {


                        exploreController.completedSearch(songList);

                    }
                });
        };

        search(exploreController.currentSearchID);
    }


    //If view is alrady active search, otherwise activate view first
    if (viewController.isActiveView(exploreController)) {

        exploreController.listName = artist;

        uiController.searchListScroll.scrollTo(0, 0, 1000)
        exploreController.currentSearchID++;
        exploreController.displayLimit = 0;
        $scope.safeApply();
        $("#searchlistview").listview('refresh');
        searchArtistsSongs(artist);

    }
    else
        viewController.activateView(exploreController, false, function () {
            searchArtistsSongs(artist);
        }, artist);


}


exploreController.searchGenreSongs = function (genre, autoplay) {
    $("#searchlist .iScrollPlayIndicator").hide();
    $("#searchlist .iScrollScrollUpIndicator").hide();
    $("#searchlist .iScrollIndicator").hide();

    var searchGenreSongs = function (genre) {

        viewController.showLoading(true);

        exploreController.currentSearchID = exploreController.currentSearchID + 1;

        var search = function (searchID) {
            $.when(
                    exploreController.songs.startGenreSearchDeferred(genre)

                ).then(function (songList) {
                    if (searchID == exploreController.currentSearchID) {

                        songList = exploreController.shuffle(songList);

                        exploreController.completedSearch(songList);
                        if (autoplay) {
                            setTimeout(function () {
                                var playlist = exploreController.songs.searchResults;
                                if (playlist && playlist.length > 0)
                                    playlistController.playSongList(playlist.slice(0, searchController.maxResults));
                            }, 150)
                        }

                    }
                });
        };

        search(exploreController.currentSearchID);
    }


    //If view is alrady active search, otherwise activate view first
    if (viewController.isActiveView(exploreController)) {
        uiController.searchListScroll.scrollTo(0, 0, 1000)
        exploreController.currentSearchID++;
        exploreController.displayLimit = 0;
        $scope.safeApply();
        $("#searchlistview").listview('refresh');
        searchGenreSongs(genre);

    }
    else
        viewController.activateView(exploreController,false,function () {
            searchGenreSongs(genre);
        },genre);



}


exploreController.inArray = function (arr, obj) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == obj) return true;
    }
    return false;
}


exploreController.showSuggestions = function (dontForceForeground) {  //Todo find songs the user really liked, means played very often for example


    exploreController.currentSearchID = exploreController.currentSearchID + 1;

    var index;
    var song;
    var songs = [];
    /*if (playbackController.playingSong) {
     song = playbackController.playingSong;
     }
     else {   */
    exploreController.songs.mixedResults = [];
    exploreController.songs.searchResults = [];
    exploreController.songs.mixCounter = 0;
    for (var i = 1; i <= exploreController.similarBaseSongs; i++) {
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

        // }

        if (!song && generatedData.charts && generatedData.charts.length > 0) {
            song = generatedData.charts[0];
            break
        }
        if (song) {
            if (exploreController.inArray(songs, song) == false) {
                songs = songs.concat(song);
                exploreController.songs.mixCounter++;
                exploreController.searchSimilarSongs(song, true, dontForceForeground);
            }

        }

    }

}

//Amount of songs used to find similar songs
exploreController.similarBaseSongs = 2;


exploreController.showSimilarSongs = function (event) {
    exploreController.currentSearchID = exploreController.currentSearchID + 1;

    event.stopPropagation();

    var songListCallback = function (list) {

        playlistController.selection.deselectElements();
        var oldsong = null;
        var song;
        var index;
        var songs = [];
        exploreController.songs.mixCounter = 0;
        exploreController.songs.mixedResults = [];
        exploreController.songs.searchResults = [];
        if (list.length > exploreController.similarBaseSongs) {
            for (var i = 1; i <= exploreController.similarBaseSongs; i++) {
                index = Math.round(Math.random() * (list.length - 1));
                song = list[index];
                if (song) {
                    if (exploreController.inArray(songs, song) == false) {
                        songs = songs.concat(song);
                        exploreController.songs.mixCounter++;
                        exploreController.searchSimilarSongs(song);
                    }

                }
            }
        }
        else {
            for (var i = 1; i <= list.length; i++) {
                song = list[i - 1];
                if (song) {
                    exploreController.songs.mixCounter++;
                    exploreController.searchSimilarSongs(song);
                }
            }
        }
    }

    playlistController.getSongListFromSelection(songListCallback);


}


exploreController.searchSimilarSongs = function (song, dontChangeTitle, dontForceForeground) {
    if (exploreController.visible) {
        $("#searchlist .iScrollPlayIndicator").hide();
        $("#searchlist .iScrollScrollUpIndicator").hide();
        $("#searchlist .iScrollIndicator").hide();
    }

    var searchSimilarSongs = function (song) {

        if (exploreController.visible)
            viewController.showLoading(true);


        var search = function (searchID) {
            $.when(
                    exploreController.songs.startSuggestionsSearchDeferred(mediaController.getSongArtist(song), song.name)

                ).then(function (songList) {

                    if (searchID == exploreController.currentSearchID) {

                        //If no suggestions show popular songs
                        if (songList.length == 0) {
                            songList = jQuery.extend(true, [], searchController.preloadedPopularSongs.track);
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


                        exploreController.completedMixSearch(songList);

                    }
                });
        };

        search(exploreController.currentSearchID);
    }
    var id = exploreController.similarSongID;
    //If view is alrady active search, otherwise activate view first
    if (viewController.isActiveView(exploreController)) {
        if (!dontChangeTitle)
            exploreController.listName = "Similar Songs";
        uiController.searchListScroll.scrollTo(0, 0, 1000)
        exploreController.displayLimit = 0;
        $scope.safeApply();
        $("#searchlistview").listview('refresh');
        searchSimilarSongs(song);

    }
    else if (!dontForceForeground) {
        viewController.activateView(exploreController, false, function () {
            searchSimilarSongs(song);
        }, !dontChangeTitle ? "Similar Songs" : null);
    } else
        searchSimilarSongs(song);


}

exploreController.songs.startGenreSearchDeferred = function (genre) {
    var deferred = $.Deferred();
    var page = Math.floor((Math.random() * 5))
    var randomlimit = 150 + Math.floor((Math.random() * 10))
    var onlineSearchURL = "http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=%searchTerm&page=" + page + "&limit=" + randomlimit + "&api_key=" + searchController.lastfmapikey + "&format=json"
    console.dir(onlineSearchURL);
    $.when(

            exploreController.basicOnlineSearchDeferred(onlineSearchURL, escape(genre), searchController.searchTypeSongs, true, "")

        ).then(function (onlineList) {
            // console.log("FFFOUNDDDD")
            // console.dir(JSON.stringify(songList))
            var songList = exploreController.songs.completeSearch([], onlineList);
            // console.log("FFFOUNDDDD: "+)
            //  console.dir(JSON.stringify(songList))
            deferred.resolve(songList);

        });
    return deferred.promise();

}


exploreController.songs.startSuggestionsSearchDeferred = function (artist, title) {
    var deferred = $.Deferred();

    var onlineSearchURL = "http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&%searchTerm&api_key=" + searchController.lastfmapikey + "&format=json"
    $.when(

            exploreController.basicOnlineSearchDeferred(onlineSearchURL, "artist=" + artist + "&track=" + title, searchController.searchTypeSongs, false, artist)

        ).then(function (onlineList) {
            // console.log("FFFOUNDDDD")
            // console.dir(JSON.stringify(songList))
            var songList = exploreController.songs.completeSearch([], onlineList);
            console.log("FFFOUNDDDD similar " + artist + " - " + title);
            //console.dir(JSON.stringify(songList))
            deferred.resolve(songList);

        });
    return deferred.promise();

}


exploreController.songs.startArtistSearchDeferred = function (artist) {
    var deferred = $.Deferred();

    var onlineSearchURL = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&%searchTerm&api_key=" + searchController.lastfmapikey + "&format=json";
    $.when(

            exploreController.basicOnlineSearchDeferred(onlineSearchURL, "artist=" + artist, searchController.searchTypeSongs, false, artist)

        ).then(function (onlineList) {
            // console.log("FFFOUNDDDD")
            // console.dir(JSON.stringify(songList))
            var songList = exploreController.songs.completeSearch([], onlineList);
            // console.log("FFFOUNDDDD")
            // console.dir(JSON.stringify(songList))
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


        if (songList != null)//Something Changed
            exploreController.songs.searchResults = songList;

        console.dir("songList!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.dir(songList);

        if (exploreController.visible) {
            exploreController.displayLimit = 0;

            uiController.searchListScroll.scrollTo(0, 0, 1000)

            exploreController.applySongList(exploreController.currentSearchID);

            /*$scope.safeApply();
             $("#searchlistview").listview('refresh');  */

            setTimeout(viewController.showLoading, 100); //show=false
        }

    }

};


exploreController.shuffle = function (array) {
    var currentIndex = array.length
        , temporaryValue
        , randomIndex
        ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

exploreController.uniqueArray = function (origArr) {
    var newArr = [],
        origLen = origArr.length,
        found,
        x, y;

    for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < newArr.length; y++) {
            if (origArr[x] === newArr[y]) {
                found = true;
                break;
            }
        }
        if (!found) newArr.push(origArr[x]);
    }
    return newArr;
}


exploreController.showMixedResult = function (id) {
    if (exploreController.showMixedResultID - id == 0) {
        if (exploreController.songs.mixedResults != null) {
            if (exploreController.songs.mixedResults.length > 400)
                exploreController.songs.mixedResults.length = 400;



            //Something Changed
            exploreController.songs.searchResults = exploreController.songs.mixedResults;

            if (exploreController.visible) {
                exploreController.displayLimit = 0;
                uiController.searchListScroll.scrollTo(0, 0, 1000)

                exploreController.applySongList(exploreController.currentSearchID);

                setTimeout(viewController.showLoading, 100); //show=false
            }

        }

    }
}


exploreController.completedMixSearch = function (songList) {
    exploreController.songs.mixCounter--;
    if (songList) {

        if (songList != null) {
            if (exploreController.songs.mixedResults.length && exploreController.songs.mixedResults.length > 0) {
                console.dir("mixed result:")

                console.dir(songList);
                console.dir(exploreController.songs.mixedResults);
                exploreController.songs.mixedResults = exploreController.songs.mixedResults.concat(songList);
                console.dir(exploreController.songs.mixedResults);

                exploreController.songs.mixedResults = exploreController.uniqueArray(exploreController.songs.mixedResults);
                exploreController.songs.mixedResults = exploreController.shuffle(exploreController.songs.mixedResults);
                console.dir(songList);
                console.dir(exploreController.songs.mixedResults);

            }
            else {
                exploreController.songs.mixedResults = songList;
                console.dir(exploreController.songs.mixedResults);
            }
        }


    }
    if (exploreController.songs.mixCounter <= 0) {
        exploreController.showMixedResultID++;
        exploreController.showMixedResult(exploreController.showMixedResultID);
    }
    else {
        exploreController.showMixedResultID++;
        var id = exploreController.showMixedResultID * 1.0;
        setTimeout(function () {
            exploreController.showMixedResult(id)
        }, 2000);
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


/**
 * Get Song from From Index
 * @param index
 */
exploreController.getSongFromIndex = function (index) {


    return exploreController.songs.searchResults[index];


}