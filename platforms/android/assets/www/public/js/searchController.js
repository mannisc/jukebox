/** * searchController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 03.03.14 - 13:58
 * @copyright  */





var searchController = function () {

};


searchController.songs = function () {
};

searchController.playlists = function () {
};

searchController.artists = function () {
};

searchController.users = function () {
};


searchController.songs.searchResults = [];

searchController.playlists.searchResults = [];

searchController.artists.searchResults = [];

searchController.users.searchResults = [];


searchController.currentSearchID = 0;

searchController.maxResults = 100;

searchController.displayLimit = searchController.maxResults;

searchController.searchSongsString = "";


searchController.searchResultsComplete = [];

searchController.searchCounter = 0;

searchController.buttonActive = -1;

searchController.showMode = -1; //-1: nichts, 0: Alle Ergebnisse 1: songs,2:  playlists, 3: artists,4: user

searchController.maxPopularSongPages = 2;
searchController.maxArtistSongPages = 2;
searchController.serverSearch = false;


/*Search types*/
searchController.searchTypeSongs = 0;
searchController.searchTypePlaylists = 1;
searchController.searchTypeArtists = 2;
searchController.searchTypeUsers = 3;


//Generated data
if (generatedData && generatedData.charts)
    searchController.preloadedPopularSongs = {"track": generatedData.charts};
else
    searchController.preloadedPopularSongs = {"track": []}


searchController.init = function () {


    uiController.searchListScroll = new IScroll('#searchlist', {
        interactiveScrollbars: true,
        zoom: true,
        scrollX: false,
        scrollY: true,
        mouseWheel: true,
        zoomMin: 0.2,
        zoomMax: 1,
        startZoom: 1,
        // wheelAction: 'zoom',
        scrollbars: true,
        noHorizontalZoom: true,
        HWCompositing: false


    });

    uiController.searchListScroll.on('scrollEnd', function () {
        if (uiController.searchListScroll.y == 0) {
            $("#searchlist .iScrollScrollUpIndicator").hide();
        } else {
            $("#searchlist .iScrollScrollUpIndicator").show();
        }

    });

    // uiController.searchListScroll.on("scrollStart",function(){
    //})


    $("#searchinput").focus(function () {
        var that = $(this);
        window.setTimeout(function () {
            if($(".ui-popup-active, .ui-popup-container.pop.in").length==0)
           that.select();
        }, 100);
    });

    $("#searchinput").on("input", function () {

        $("#searchlist .iScrollPlayIndicator").hide();
        $("#searchlist .iScrollScrollUpIndicator").hide();

        switch (searchController.buttonActive) {
            case 0:
                searchController.startSearch();
                break;
            case 1:
                searchController.filterMusic();
                break;
            case 2:
                searchController.filterMusic();
                break;
        }
    })

    $("#controlbar .ui-input-clear").click(function () {

        switch (searchController.buttonActive) {
            case 0://Search
                searchController.startSearch("");//Show Populars
            case 1://Suggestions
                searchController.removeFilterSongs();
                break;
            case 2://Explore

                break;
            default:

                break;
        }
    })


    searchController.activateButton(0, true);

    if (!urlParams.search || urlParams.search == "") {
        setTimeout(function () {
            searchController.startSearch()
        }, 500)

    }

    setTimeout(function () {
        uiController.searchListScroll.refresh();
    }, 150)

    searchController.scrollUpIndicator = $('<div class="iScrollScrollUpIndicator fadeincomplete" style="display:none;"></div>');
    $("#searchlist .iScrollVerticalScrollbar").prepend(searchController.scrollUpIndicator);

    searchController.scrollUpIndicator.click(function () {
        uiController.searchListScroll.scrollTo(0, 0, 700);
    });


    searchController.playIndicator = $('<div class="iScrollPlayIndicator fadeincomplete" style="display:none;"></div>');


    searchController.playIndicator.appendTo("#searchlist .iScrollVerticalScrollbar");
    searchController.playIndicator.click(function () {
        uiController.searchListScroll.scrollToElement(".loadedsong", 700);
    });


    $(".iScrollIndicator").addClass("fadeincomplete");

}


searchController.activateButton = function (index, noAnimation) {
    if( searchController.buttonActive == index)
     return;

    //Unload actions for views
    if (searchController.buttonActive == 0) {
        searchController.searchSongsString = $("#searchinput").val();
    }
    if(searchController.buttonActive == 2&&index!=2){
        $("#explorearea").hide();
    }



    searchController.buttonActive = index;
    searchController.emptySearchList(true);

    $("#searchlist .iScrollPlayIndicator").hide();
    $("#searchlist .iScrollScrollUpIndicator").hide();


    var input = $("#searchinput").parent();
    var oIndex = input.data("button");
    if (oIndex) {
        var oButton = $("#searchbutton" + oIndex).parent();
        oButton.show();
        var width = oButton.width();
        oButton.removeClass("animated");
        oButton.css("width", input.width());

        setTimeout(function () {
            oButton.addClass("animated");
            oButton.css("width", width)

        }, 50)
    }
    input.data("button", index + 1);

    var button = $("#searchbutton" + (index + 1)).parent();

    input.removeClass("animated");
    if (!noAnimation)
        input.css("width", button.width());
    setTimeout(function () {
        if (!noAnimation)
            input.addClass("animated");

        input.css("width", "");
        setTimeout(function () {
            input.find("input").focus();
        }, 500)

        uiController.toggleSearchButton(index + 1);

    }, 60)

    switch (index) {
        case 0:
            $("#searchinput").val(searchController.searchSongsString);
            $(input).insertAfter(button).find("input").attr("placeholder", "Search Songs, Playlists, Users...");
            break;
        /*case 1:
         $("#searchinput").val("");
         $(input).insertAfter(button).find("input").attr("placeholder", "Filter Popular Songs");
         break; */
        case 1:
            $("#searchinput").val("");
            $(input).insertAfter(button).find("input").attr("placeholder", "Filter Suggestions");
            break;
        case 2:
            $("#searchinput").val("");
            $(input).insertAfter(button).find("input").attr("placeholder", "Search Content");
            break;
        case 3:
            $("#searchinput").val("");
            $(input).insertAfter(button).find("input").attr("placeholder", "Search Playlists");
            break;
    }


    button.hide();
}


searchController.basicLocalSearchDeferred = function (searchTerm, searchTypeNative) {
    var deferred = $.Deferred();
    setTimeout(function () {
        var data = [];
        deferred.resolve(data);
    }, 0)
    return deferred.promise();

}


searchController.basicOnlineSearchDeferred = function (searchURL, searchTerm, searchTypeNative, dontSearchNative, nativeSearchTerm) {
    var deferred = $.Deferred();

    searchURL = searchURL.replace("%searchTerm", searchTerm);


    var searchserver = function () {
        if (!nativeSearchTerm)
            var url = preferences.serverURL + "?searchjson=" + searchTerm + "&type=" + searchTypeNative + "&auth=" + authController.ip_token;
        else
            url = preferences.serverURL + "?searchjson=" + nativeSearchTerm + "&type=" + searchTypeNative + "&auth=" + authController.ip_token;

        $.ajax({
            url: url,
            success: function (data) {
                if (data.auth && data.auth == "true") {
                    authController.extractToken(data.token);
                    searchserver();
                }
                else {
                    var list = [];

                    if (data.track) {

                        //TODO neccessary  for every search
                        for (var i = 0; i < data.track.length; i++) {
                            try {
                                data.track[i].artist = decodeURIComponent(data.track[i].artist);
                            }
                            catch (e) {
                                data.track[i].artist = unescape(data.track[i].artist);
                            }
                            try {
                                data.track[i].name = decodeURIComponent(data.track[i].name);
                            }
                            catch (e) {
                                data.track[i].name = unescape(data.track[i].name);
                            }
                        }
                        list = data.track;
                    }

                    deferred.resolve({list: list, native: true});

                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.dir("JUKE SERVER ERROR!");
                console.dir(xhr);
                deferred.resolve({list: [], native: true});
            }

        })
    }
    $.ajax({
        url: searchURL,
        success: function (data) {
            if (!data)
                data = {};
            //Search Results
            if (data.results && !(data.results.trackmatches == "\n" || data.results.albummatches == "\n" || data.results.artistmatches == "\n")) {
                searchController.serverSearch = false;
                deferred.resolve({list: data, native: false});
            } // Similarity search
            else if (data.similartracks && !(data.similartracks == "\n")) {
                searchController.serverSearch = false;
                deferred.resolve({list: data.similartracks, native: false});
            } else {
                if (!dontSearchNative) {
                    searchController.serverSearch = true;
                    searchserver();
                } else
                    deferred.resolve({list: [], native: true});

            }


        },
        error: function () {

            if (!dontSearchNative) {
                searchController.serverSearch = true;
                searchserver();
            } else
                deferred.resolve({list: [], native: true});

        }
    })

    return deferred.promise();
}

/**
 * Search was started
 */

searchController.startSearch = function (searchTerm) {
    if (!searchTerm)
        searchTerm = $("#searchinput").val();
    searchController.showLoading(true);

    if (searchTerm && searchTerm != "") {
        searchController.showedPopulars = false;

        searchController.currentSearchID = searchController.currentSearchID + 1;
        var search = function (searchID) {
            $.when(
                    searchController.songs.startSearchDeferred(searchTerm),
                    searchController.playlists.startSearchDeferred(searchTerm),
                    searchController.artists.startSearchDeferred(searchTerm)

                ).then(function (songList, playlistList, artistsList, userList) {
                    if (searchID == searchController.currentSearchID) {
                        searchController.completedSearch(songList, playlistList, artistsList, userList);

                    }
                });
        };

        search(searchController.currentSearchID);

    } else {
        searchController.showPopulars();
    }

};


searchController.searchSimilarSongs = function (song) {
    searchController.activateButton(1);


    searchController.showLoading(true);

    searchController.showedPopulars = false;

    searchController.currentSearchID = searchController.currentSearchID + 1;

    var search = function (searchID) {
        $.when(
                searchController.songs.startSuggestionsSearchDeferred(mediaController.getSongArtist(song), song.name)

            ).then(function (songList) {
                if (searchID == searchController.currentSearchID) {

                    if (song) {

                        for (var i = 0; i < songList.length; i++) {

                            if (mediaController.getSongDisplayName(songList[i]).toLowerCase() == mediaController.getSongDisplayName(song).toLowerCase()) {
                                songList.splice(i, 1);

                                i--;
                            }
                        }

                        songList = [song].concat(songList);


                    }

                    searchController.completedSearch(songList, null, null, null);

                }
            });
    };

    search(searchController.currentSearchID);

}


/**
 * Search was completed
 */
searchController.completedSearch = function (songList, playlistList, artistsList, userList) {
    if (songList || playlistList || artistsList || userList) {

        searchController.displayLimit = 0;

        if (searchController.showMode == -1)
            searchController.showMode = 0;
        uiController.searchListScroll.scrollTo(0, 0, 1000)

        if (songList != null)//Something Changed
            searchController.songs.searchResults = songList;
        if (playlistList != null)//Something Changed
            searchController.playlists.searchResults = playlistList;
        if (artistsList != null)//Something Changed
            searchController.artists.searchResults = artistsList;
        if (userList != null)//Something Changed
            searchController.users.searchResults = userList;


        searchController.applySongList(searchController.currentSearchID);
        setTimeout(searchController.showLoading, 100); //show=false

    }

};


searchController.showPopulars = function () {

    if (searchController.preloadedPopularSongs) {

        searchController.playlists.searchResults = [];
        searchController.artists.searchResults = [];
        searchController.users.searchResults = [];

        searchController.showedPopulars = true;
        searchController.currentSearchID = searchController.currentSearchID + 1;

        searchController.completedSearch(searchController.preloadedPopularSongs.track);

    }
}


searchController.emptySearchList = function (dontInitFully) {
    searchController.searchCounter++;
    searchController.showLoading(false);
    searchController.songs.searchResults = [];
    searchController.playlists.searchResults = [];
    searchController.artists.searchResults = [];
    searchController.users.searchResults = [];
    searchController.displayLimit = 0;

    $scope.safeApply();

    $("#searchlistview").listview('refresh');
    $("#searchlist .iScrollIndicator").hide();
    $("#searchlist .iScrollPlayIndicator").hide();
    $("#searchlist .iScrollScrollUpIndicator").hide();

    playbackController.positionPlayIndicatorAtTop(true);


    setTimeout(function () {
        uiController.searchListScroll.refresh();
        playlistController.updateDeselectedSong();
        uiController.updateUI();
        playbackController.remarkSong();

    }, 0)

    if (!dontInitFully) {
        searchController.makeSearchListDraggable();
        setTimeout(function () {
            $("#searchlistview li").removeClass("fadeincompletefast");
        }, 100)
    }
}


searchController.filterMusic = function (filterTerm) {
    if (!filterTerm)
        filterTerm = $("#searchinput").val();
    searchController.showLoading(true);
    uiController.searchListScroll.scrollTo(0, 0, 1000)

    filterTerm = filterTerm.toLowerCase();
    var title = "";
    var artist = "";

    var icounter = 0;
    for (var i = 0; i < searchController.songs.searchResults.length; i++) {
        artist = mediaController.getSongArtist(searchController.songs.searchResults[i]);
        title = searchController.songs.searchResults[i].name;
        artist = artist.toLowerCase();
        title = title.toLowerCase();

        if (title.search(filterTerm) > -1 || artist.search(filterTerm) > -1) {

            searchController.songs.searchResults[i].tmpHide = false;

            // console.dir(searchController.songs.searchResults[icounter]);
            icounter++;
        }
        else {
            searchController.songs.searchResults[i].tmpHide = true;

        }
    }

    $scope.safeApply();

    $("#searchlistview").listview('refresh');

    setTimeout(function () {
        uiController.searchListScroll.refresh();
        searchController.showLoading(false);
    }, 1000)
    searchController.makeSearchListDraggable();
    setTimeout(function () {
        $("#searchlistview li").removeClass("fadeincompletefast");
    }, 100)

}


/*Songs -------------------------------------------------------------------------------------------------------------------------------------*/

/**
 * Encapsules all song operations
 */



searchController.songs.startSearchDeferred = function (searchTerm) {
    var deferred = $.Deferred();

    var onlineSearchURL = "http://ws.audioscrobbler.com/2.0/?method=track.search&track=%searchTerm&limit=100&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json";

    $.when(
            searchController.basicLocalSearchDeferred(searchTerm, searchController.searchTypeSongs),
            searchController.basicOnlineSearchDeferred(onlineSearchURL, searchTerm, searchController.searchTypeSongs)
        ).then(function (localList, onlineList) {
            var songList = searchController.songs.completeSearch(localList, onlineList)
            deferred.resolve(songList);

        });
    return deferred.promise();

}


searchController.songs.startSuggestionsSearchDeferred = function (artist, title) {
    var deferred = $.Deferred();

    var onlineSearchURL = "http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&%searchTerm&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json"

    $.when(

            searchController.basicOnlineSearchDeferred(onlineSearchURL, "artist=" + artist + "&track=" + title, searchController.searchTypeSongs, false, artist)

        ).then(function (onlineList) {
            var songList = searchController.songs.completeSearch([], onlineList);
            console.log("FFFOUNDDDD")
            console.dir(JSON.stringify(songList))
            deferred.resolve(songList);

        });
    return deferred.promise();

}


searchController.songs.completeSearch = function (localList, onlineList) {


    //Is from last fm or native server -> so convert and extract songlist accordingly
    if (onlineList.native) {
        onlineList = onlineList.list;
    } else {
        if (onlineList.list.results && onlineList.list.results.trackmatches)
            onlineList = onlineList.list.results.trackmatches.track;
        else if (onlineList.list)
            onlineList = onlineList.list.track;

    }
    if (!onlineList)
        onlineList = [];

    var songList = localList.concat(onlineList)


    //Set Artist of song and remove songs without name
    for (var i = 0; i < songList.length; i++) {
        var song = songList[i];
        if (!song.name || song.name == "") {
            songList.splice(i, 1);
            i--;
        } else {

            if (song.artist) {
                if (!song.artist.name) {
                    if (song.artist)
                        song.artist = {name: song.artist};
                }
            } else
                song.artist = {name: mediaController.unknownData};

            song.artist.name = $.trim(song.artist.name);
            song.name = $.trim(song.name);

        }
    }

    //Check if something changed
    var changedResults = false;
    if (songList.length && searchController.songs.searchResults.length == songList.length) {
        for (var i = 0; i < searchController.songs.searchResults.length; i++) {

            if ($.trim(searchController.songs.searchResults[i].artist.name) != $.trim(songList[i].artist.name)) {
                changedResults = true;
                break;
            }
            if ($.trim(searchController.songs.searchResults[i].name) != $.trim(songList[i].name)) {
                changedResults = true;
                break;
            }
        }
    } else
        changedResults = true;

    //Nothing changed since last searchterm, so dont reload list
    if (!changedResults) {
        songList = null;
    }

    return songList;
}


searchController.searchSongsOOOOOLLLLLLDDDDD = function (searchString, title, artist, callbackSuccess) {
    searchController.showLoading(true);
    searchController.showedPopulars = false;
    var searchserver = function () {
        console.dir(preferences.serverURL + "?searchjson=" + searchString + "&auth=" + authController.ip_token);
        $.ajax({
            url: preferences.serverURL + "?searchjson=" + searchString + "&auth=" + authController.ip_token,
            success: function (data) {
                console.dir("searchjson!!!!!!!!!!");
                console.dir(data);
                if (data.auth && data.auth == "true") {
                    authController.extractToken(data.token);
                    searchserver();
                }
                else {

                    for (var i = 0; i < data.track.length; i++) {
                        try {
                            data.track[i].artist = decodeURIComponent(data.track[i].artist);
                        }
                        catch (e) {
                            data.track[i].artist = unescape(data.track[i].artist);
                        }
                        try {
                            data.track[i].name = decodeURIComponent(data.track[i].name);
                        }
                        catch (e) {
                            data.track[i].name = unescape(data.track[i].name);
                        }
                    }
                    setTimeout(searchController.showLoading, 1000); //show=false

                    if (callbackSuccess)
                        callbackSuccess(data);

                }
            },
            error: function (xhr, ajaxOptions, thrownError) {

                console.dir("ERROR!");
                console.dir(xhr.responseText);

                setTimeout(searchController.showLoading, 1000); //show=false

            }

        })
    }

    $.ajax({
        url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + searchString + "&page=1&limit=100&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
        success: function (data) {
            if (data.results && data.results.trackmatches) {
                if (data.results.trackmatches == "\n") {
                    searchController.serverSearch = true;
                    searchserver();
                }
                else {
                    searchController.serverSearch = false;

                    setTimeout(searchController.showLoading, 1000);
                    if (callbackSuccess)
                        callbackSuccess(data.results.trackmatches);


                }
            }
            else {
                searchController.serverSearch = true;
                searchserver();
            }


        },
        error: function () {

            searchController.serverSearch = true;
            searchserver();

        }
    })

}


/*Playlists -------------------------------------------------------------------------------------------------------------------------------------*/

/**
 * Encapsules all playlist operations
 */


searchController.playlists.startSearchDeferred = function (searchTerm) {
    var deferred = $.Deferred();


    var onlineSearchURL = "http://ws.audioscrobbler.com/2.0/?method=album.search&album=%searchTerm&limit=100&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json";

    $.when(
            searchController.basicLocalSearchDeferred(searchTerm, searchController.searchTypePlaylists),
            searchController.basicOnlineSearchDeferred(onlineSearchURL, searchTerm, searchController.searchTypePlaylists, true)
        ).then(function (localList, onlineList) {

            var playlistList = searchController.playlists.completeSearch(localList, onlineList)
            deferred.resolve(playlistList);

        });
    return deferred.promise();
}


searchController.playlists.completeSearch = function (localList, onlineList) {


    //Is from last fm or native server -> so convert and extract songlist accordingly
    if (onlineList.native) {
        onlineList = onlineList.list;
    } else
        onlineList = onlineList.list.results.albummatches.album;

    var playlistList = localList.concat(onlineList)

    // remove without name
    for (var i = 0; i < playlistList.length; i++) {
        var playlist = playlistList[i];
        if (!playlist.name || playlist.name == "") {
            playlistList.splice(i, 1);
            i--;
        } else {
            playlistList[i].isPlaylist = true;
            playlist.name = $.trim(playlist.name);

        }
    }

    //Check if something changed
    var changedResults = false;
    if (searchController.playlists.searchResults.length == playlistList.length) {
        for (var i = 0; i < searchController.playlists.searchResults.length; i++) {

            if ($.trim(searchController.playlists.searchResults[i].name) != $.trim(playlistList[i].name)) {
                changedResults = true;
                break;
            }
        }
    } else
        changedResults = true;

    //Nothing changed since last searchterm, so dont reload list
    if (!changedResults) {
        playlistList = null;
    }

    return playlistList;
}


/*Artists -------------------------------------------------------------------------------------------------------------------------------------*/

/**
 * Encapsules all artists operations
 */


searchController.artists.startSearchDeferred = function (searchTerm) {
    var deferred = $.Deferred();


    var onlineSearchURL = "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=%searchTerm&limit=100&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json";

    $.when(
            searchController.basicLocalSearchDeferred(searchTerm, searchController.searchTypeArtists),
            searchController.basicOnlineSearchDeferred(onlineSearchURL, searchTerm, searchController.searchTypeArtists, true)
        ).then(function (localList, onlineList) {

            var artistList = searchController.artists.completeSearch(localList, onlineList)
            deferred.resolve(artistList);

        });
    return deferred.promise();
}


searchController.artists.completeSearch = function (localList, onlineList) {

    //Is from last fm or native server -> so convert and extract songlist accordingly
    if (onlineList.native) {
        onlineList = onlineList.list;
    } else
        onlineList = onlineList.list.results.artistmatches.artist;

    var artistList = localList.concat(onlineList)

    // remove songs name
    for (var i = 0; i < artistList.length; i++) {
        var artist = artistList[i];
        if (!artist.name || artist.name == "") {
            artistList.splice(i, 1);
            i--;
        } else {
            artistList[i].isArtist = true;
            artist.name = $.trim(artist.name);


        }
    }

    //Check if something changed
    var changedResults = false;
    if (searchController.artists.searchResults.length == artistList.length) {
        for (var i = 0; i < searchController.artists.searchResults.length; i++) {

            if ($.trim(searchController.artists.searchResults[i].name) != $.trim(artistList[i].name)) {
                changedResults = true;
                break;
            }
        }
    } else
        changedResults = true;

    //Nothing changed since last searchterm, so dont reload list
    if (!changedResults) {
        artistList = null;
    }

    return artistList;
}

/*Others -------------------------------------------------------------------------------------------------------------------------------------*/


searchController.completeSearchOOOLLDDDD = function (list, appendListInFront, searchID) {

    if (searchController.searchCounter == searchID) {

        if (searchController.showMode == -1)
            searchController.showMode = 0;

        uiController.searchListScroll.scrollTo(0, 0, 1000)
        var changed = false;
        if (searchController.songs.searchResults.length == 0) {
            changed = true;
        }
        else if (list.track) {
            if (list.track.length != searchController.songs.searchResults.length) {
                changed = true;
            }
            else {
                for (var i = 0; i < searchController.songs.searchResults.length; i++) {
                    if (mediaController.getSongArtist(searchController.songs.searchResults[i]) != mediaController.getSongArtist(list.track[i])) {
                        changed = true;
                        break;
                    }
                    if (searchController.songs.searchResults[i].name != list.track[i].name) {
                        changed = true;
                        break;
                    }
                }
            }
        }
        if (changed) {


            for (i = 0; i < list.track.length; i++) {
                if (!list.track[i].name || list.track[i].name == "") {
                    list.track.splice(i, 1);
                    i--;
                }

            }

            if (appendListInFront) {
                for (var j = 0; j < appendListInFront.length; j++) {
                    for (i = 0; i < list.track.length; i++) {
                        if (mediaController.getSongDisplayName(list.track[i]) == mediaController.getSongDisplayName(appendListInFront[j])) {
                            list.track.splice(i, 1);
                            i--;
                        }

                    }
                }
                searchController.songs.searchResults = appendListInFront;
                var anzSongs = searchController.songs.searchResults.length;

            }
            else {
                searchController.songs.searchResults = [];
                anzSongs = 0;
            }


            var num = 1;
            if (list.track.length > 0) {
                num = Math.min(searchController.maxResults, list.track.length);

                for (i = anzSongs; i < num + anzSongs; i++) {
                    searchController.songs.searchResults[i] = list.track[i - anzSongs];
                }
                if (appendListInFront)
                    searchController.searchResultsComplete = appendListInFront.concat(list.track);
                else
                    searchController.searchResultsComplete = list.track;


            }
            else {

                if (searchController.buttonActive != 0) {
                    searchController.songs.searchResults[anzSongs] = list.track;
                    searchController.searchResultsComplete = [];
                    searchController.searchResultsComplete[anzSongs] = list.track[0];
                } else
                    searchController.searchResultsComplete = [];

            }

            for (i = 0; i < searchController.songs.searchResults.length; i++) {
                searchController.songs.searchResults[i].id = "slsid" + helperFunctions.padZeros(i, ("" + searchController.songs.searchResults.length).length);
            }

            searchController.applySongList(searchController.currentSearchID);

        }
    }
}

searchController.applySongList = function (currentSearchID) {

    console.log("-------------------------------------")
    $(".specialplaylistbutton").removeClass("fadeincompletefaster");
    $("#searchlist .iScrollIndicator").hide();

    var stepSize = 10;
    var stepDelay = 50;
    if (searchController.showMode == 0) {
        var size = searchController.maxResults;
    }
    else {
        size = Math.min(searchController.showed.searchResults.length, searchController.maxResults)
    }

    var delays = (Math.ceil(size / stepSize));
    console.log(delays)
    console.log(size + "  " + stepSize)

    var songInList = searchController.isSongInList(playbackController.playingSong);
    $("#searchlist .loadedsong").removeClass("loadedsong playing pausing stillloading");
    $("#searchlist .oldloadedsong").removeClass("loadedsong");

    for (var i = 1; i <= delays; i++) {

        var show = function (index) {
            setTimeout(function () {

                if (searchController.currentSearchID == currentSearchID) {


                    /*  if (searchController.showMode == 0)
                     searchController.displayLimit = searchController.maxResults;
                     else*/
                    searchController.displayLimit = size * index / delays;
                    console.log("safeapply")
                    $scope.safeApply();
                    $("#searchlistview").listview('refresh');

                    //New Elements Applied
                    if ((songInList && $("#searchlist .loadedsong").length == 0) || index == 1)
                        playbackController.remarkSong();


                    //First new elements applied
                    if (index == 1) {
                        if (songInList)
                            playbackController.positionPlayIndicator();

                        playlistController.updateDeselectedSong();
                        $(".specialplaylistbutton").addClass("fadeincompletefaster");
                    }
                    //All elements applied
                    if (index == delays) {
                        if (songInList)
                            playbackController.positionPlayIndicator();

                        searchController.makeSearchListDraggable();
                        setTimeout(function () {
                            uiController.searchListScroll.refresh();
                            $("#searchlistview li").removeClass("fadeincompletefast fadeincompletefaster");


                        }, 500)
                        setTimeout(function () {
                            uiController.searchListScroll.refresh();

                        }, 2000)
                    } else if (index % 3 == 0) {
                        uiController.searchListScroll.refresh();
                        if (songInList)
                            playbackController.positionPlayIndicator();
                    }


                }
            }, stepDelay * (index - 1))

        }
        show(i)
    }

}


searchController.filterMusicOOOLLLDDDDDDD = function () {
    /*if ($("#searchinput").val() && $("#searchinput").val() != "") {
     searchController.lastSearchTerm = $("#searchinput").val();
     if (app.isCordova)
     var time = 1000;
     else
     time = 300;

     setTimeout(function () {
     if (searchController.lastSearchedTerm != searchController.lastSearchTerm) {
     if (!searchController.autoSearchTimer || Date.now() - searchController.autoSearchTimer > time) {
     searchController.autoSearchTimer = Date.now();
     searchController.lastSearchedTerm = searchController.lastSearchTerm;
     searchController.filterSongs(searchController.lastSearchTerm);
     }
     }
     }, time);

     if (!searchController.autoSearchTimer || Date.now() - searchController.autoSearchTimer > time) {
     searchController.autoSearchTimer = Date.now();
     searchController.lastSearchedTerm = searchController.lastSearchTerm;
     searchController.filterSongs(searchController.lastSearchTerm);
     }
     }
     else {
     searchController.removeFilterSongs();
     }  */
}

searchController.removeFilterSongs = function () {
    uiController.searchListScroll.scrollTo(0, 0, 1000)
    searchController.songs.searchResults = [];
    $scope.safeApply();
    var num = Math.min(searchController.maxResults, searchController.searchResultsComplete.length);
    for (var i = 0; i < num; i++) {
        searchController.songs.searchResults[i] = searchController.searchResultsComplete[i];
    }

    for (var i = 0; i < searchController.songs.searchResults.length; i++) {
        searchController.songs.searchResults[i].id = "slsid" + helperFunctions.padZeros(i, ("" + searchController.songs.searchResults.length).length);
    }
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


searchController.filterSongsOOOLLLLDDDD = function (filterTerm) {

    uiController.searchListScroll.scrollTo(0, 0, 1000)

    filterTerm = filterTerm.toLowerCase();
    var changed = false;
    var title = "";
    var artist = "";
    var newSearchResults = [];
    if (searchController.searchResultsComplete == 0) {
        changed = true;
    }
    else {
        var icounter = 0;
        for (var i = 0; i < searchController.searchResultsComplete.length; i++) {
            artist = mediaController.getSongArtist(searchController.searchResultsComplete[i]);
            title = searchController.searchResultsComplete[i].name;
            artist = artist.toLowerCase();
            title = title.toLowerCase();

            if (title.search(filterTerm) > -1 || artist.search(filterTerm) > -1) {
                newSearchResults[icounter] = searchController.searchResultsComplete[i];
                // console.dir(searchController.songs.searchResults[icounter]);
                icounter++;
            }
        }
        if (searchController.songs.searchResults.length != newSearchResults.length) {
            changed = true;
        }
        else {
            for (var i = 0; i < searchController.songs.searchResults.length; i++) {
                if (mediaController.getSongArtist(searchController.songs.searchResults[i]) != mediaController.getSongArtist(newSearchResults[i])) {
                    changed = true;
                    break;
                }
                if (searchController.songs.searchResults[i].name != newSearchResults[i].name) {
                    changed = true;
                    break;
                }
            }
        }
    }
    if (changed) {
        searchController.songs.searchResults = [];
        $scope.safeApply();
        var num = Math.min(searchController.maxResults, newSearchResults.length);
        for (var i = 0; i < num; i++) {
            searchController.songs.searchResults[i] = newSearchResults[i];
        }
        for (var i = 0; i < searchController.songs.searchResults.length; i++) {
            searchController.songs.searchResults[i].id = "slsid" + helperFunctions.padZeros(i, ("" + searchController.songs.searchResults.length).length);
        }
        $scope.safeApply();
        $("#searchlistview").listview('refresh');

        setTimeout(function () {
            uiController.searchListScroll.refresh();
        }, 1000)
        searchController.makeSearchListDraggable();
        setTimeout(function () {
            $("#searchlistview li").removeClass("fadeincompletefast");
        }, 100)
    }
}


searchController.showPopularsOOOOLLLLDDDDDD = function () {
    if (searchController.preloadedPopularSongs) {

        searchController.showedPopulars = true;

        setTimeout(function () {
            searchController.completeSearchOOOLLDDDD(searchController.preloadedPopularSongs, null, searchController.searchCounter)
        }, 500)

    }
    else {

        setTimeout(function () {

            searchController.searchCounter++;
            function search(searchID) {
                searchController.topTracks(function (list) {
                    searchController.completeSearchOOOLLDDDD(list, null, searchID)
                });
            }

            search(searchController.searchCounter);


        }, 500)

    }
}

searchController.emptySearchListOOOOLLLLLLDDD = function (dontInitFully) {
    searchController.searchCounter++;
    searchController.showLoading(false);
    searchController.songs.searchResults = [];
    $scope.safeApply();

    $("#searchlistview").listview('refresh');
    $("#searchlist .iScrollIndicator").hide();
    $("#searchlist .iScrollPlayIndicator").hide();
    $("#searchlist .iScrollScrollUpIndicator").hide();

    playbackController.positionPlayIndicatorAtTop(true);


    setTimeout(function () {
        uiController.searchListScroll.refresh();
        playlistController.updateDeselectedSong();

    }, 0)

    if (!dontInitFully) {
        searchController.makeSearchListDraggable();
        setTimeout(function () {
            $("#searchlistview li").removeClass("fadeincompletefast");
        }, 100)
    }
}


searchController.showSuggestions = function () {  //Todo find songs the user really liked, means played very often for example
    searchController.currentSearchID = searchController.currentSearchID + 1;

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
        else if (!playlistController.playlistMode&& playlistController.loadedPlaylistSongs.length > 0) { //Loaded Songs
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
        searchController.searchSimilarSongs(song);
    }
    else {

        searchController.startSearch("");
    }


}


searchController.showExplore = function(){
     $("#explorearea").show();





    searchController.emptySearchList()

}







searchController.searchArtistSongs = function (artist) {
    $("#searchinput").val(artist);
    searchController.searchSongsString = artist;
    searchController.activateButton(0);
    searchController.searchCounter++;
    function search(searchID) {
        searchController.searchSongsFromArtist(artist, function (list) {
            searchController.completeSearchOOOLLDDDD(list, [playbackController.playingSong], searchID)
        });
    }

    search(searchController.searchCounter);

}


searchController.searchSimilarSongsOOOOLLLLLDD = function (song) {

    searchController.activateButton(1);

    searchController.searchCounter++;
    function search(searchID) {
        searchController.suggestions(song.name, mediaController.getSongArtist(song), function (list) {
            searchController.completeSearchOOOLLDDDD(list, [playbackController.playingSong], searchID)
        });
    }

    search(searchController.searchCounter);

}


searchController.searchMusicOOOLLDDDD = function () {
    if ($("#searchinput").val() && $("#searchinput").val() != "") {
        searchController.lastSearchTerm = $("#searchinput").val();
        var song = playbackController.getPlayingSong();
        if (song.name != "" && $("#searchinput").val() != "") {
            window.history.pushState("", document.title, location.protocol + '//' + location.host + location.pathname + "?search=" + searchController.lastSearchTerm + "&artist=" + mediaController.getSongArtist(song) + "&title=" + song.name);
        }
        else {
            window.history.pushState("", document.title, location.protocol + '//' + location.host + location.pathname + "?search=" + searchController.lastSearchTerm);
        }
        if (searchController.serverSearch) {
            var time = 1500;
        }
        else {
            if (app.isCordova)
                time = 1000;
            else
                time = 100;
        }

        setTimeout(function () {
            if (searchController.lastSearchedTerm != searchController.lastSearchTerm) {
                if (!searchController.autoSearchTimer || Date.now() - searchController.autoSearchTimer > time) {
                    searchController.autoSearchTimer = Date.now();
                    searchController.lastSearchedTerm = searchController.lastSearchTerm;
                    searchController.searchCounter++;
                    function search(searchID) {
                        searchController.songs.startSearchDeferred(searchController.lastSearchTerm, function (list) {
                            searchController.completeSearchOOOLLDDDD(list, null, searchID)
                        });
                    }

                    search(searchController.searchCounter);
                }
            }
        }, time);

        if (!searchController.autoSearchTimer || Date.now() - searchController.autoSearchTimer > time) {
            searchController.autoSearchTimer = Date.now();
            searchController.lastSearchedTerm = searchController.lastSearchTerm;
            searchController.searchCounter++;
            function search(searchID) {
                searchController.songs.startSearchDeferred(searchController.lastSearchTerm, function (list) {
                    searchController.completeSearchOOOLLDDDD(list, null, searchID)
                });
            }

            search(searchController.searchCounter);
        }
    }
    else {
        searchController.showPopulars();
    }
}


searchController.showLoading = function (show) {

    if (show)
        $(".ui-alt-icon.ui-icon-search, .ui-alt-icon .ui-icon-search, .ui-input-search").addClass("loading");
    else
        $(".ui-alt-icon.ui-icon-search, .ui-alt-icon .ui-icon-search, .ui-input-search").removeClass("loading");

}


searchController.searchSongsFromArtist = function (artist, callbackSuccess) {
    searchController.showLoading(true);

    var searchString = artist;

    var searchserver = function () {
        $.ajax({
            url: preferences.serverURL + "?searchjson=" + searchString + "&auth=" + authController.ip_token,
            success: function (data) {
                if (data.auth && data.auth == "true") {
                    authController.extractToken(data.token);
                    searchserver();
                }
                else {
                    for (var i = 0; i < data.track.length; i++) {
                        try {
                            data.track[i].artist = decodeURIComponent(data.track[i].artist);
                        }
                        catch (e) {
                            data.track[i].artist = unescape(data.track[i].artist);
                        }
                        try {
                            data.track[i].name = decodeURIComponent(data.track[i].name);
                        }
                        catch (e) {
                            data.track[i].name = unescape(data.track[i].name);
                        }
                    }
                    setTimeout(searchController.showLoading, 1000); //show=false
                    if (callbackSuccess)
                        callbackSuccess(data);

                }
            },
            error: function () {
                setTimeout(searchController.showLoading, 1000); //show=false

            }

        })
    }
    var func = function (page, topresults) {
        $.ajax({

            url: "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + searchString + "&page=" + page + "&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
            success: function (data) {
                var dataOK = false;
                if (data.toptracks) {
                    if (data.toptracks == "\n" && page == 1) {
                        searchserver();
                    }
                    else {
                        dataOK = true;
                        if (page == 1) {
                            func(page + 1, data.toptracks.track);
                        }
                        else if (page < searchController.maxArtistSongPages) {
                            topresults = topresults.concat(data.toptracks.track);
                            func(page + 1, topresults);

                        }
                        else if (page >= searchController.maxArtistSongPages) {
                            topresults = topresults.concat(data.toptracks.track);
                            topresults.track = topresults;
                            if (callbackSuccess)
                                callbackSuccess(topresults);
                            setTimeout(searchController.showLoading, 1000);
                        }
                    }
                }
                if (dataOK == false && page > 1 && topresults) {
                    topresults.track = topresults;
                    if (callbackSuccess)
                        callbackSuccess(topresults);
                }

            },
            error: function () {
                searchserver(searchID);

            }
        })
    }
    func(1, null);
}

searchController.topTracks = function (callbackSuccess) {

    searchController.showLoading(true);
    searchController.showedPopulars = true;

    //TODO TEEEMMMMMMPPPPPP for no Internet
    /* if (callbackSuccess)
     callbackSuccess( {track:   playlistController.NOINTERNETHACK});
     return;
     */

    var func = function (page, topresults) {
        $.ajax({
            url: "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&page=" + page + "&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
            success: function (data) {
                var dataOK = false;
                if (data.tracks) {
                    if (data.tracks != "\n") {
                        dataOK = true;
                        if (page == 1) {

                            func(page + 1, data.tracks.track);
                        }
                        else if (page < searchController.maxPopularSongPages) {
                            topresults = topresults.concat(data.tracks.track);
                            func(page + 1, topresults);
                        }
                        else if (page >= searchController.maxPopularSongPages) {
                            topresults = topresults.concat(data.tracks.track);
                            topresults.track = topresults;
                            if (callbackSuccess)
                                callbackSuccess(topresults);
                            setTimeout(searchController.showLoading, 1000);
                        }
                    }
                }
                if (dataOK == false && page > 1 && topresults) {
                    if (callbackSuccess)
                        callbackSuccess(topresults);
                }

            }, error: function () {
                setTimeout(searchController.showLoading, 1000);
            }
        })
    }
    func(1, null);
}

searchController.suggestions = function (title, artist, callbackSuccess) {
    searchController.showLoading(true);
    searchController.showedPopulars = false;

    $.ajax({

        url: "http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=" + artist + "&track=" + title + "&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
        success: function (data) {
            if (data.similartracks) {
                if (data.similartracks != "\n") {
                    if (callbackSuccess)
                        callbackSuccess(data.similartracks);


                }
            }
        }, complete: function () {
            setTimeout(searchController.showLoading, 1000);
        }
    })

}


searchController.getArtistInfo = function () {

    $.ajax({

        url: "&search=",
        success: function (data) {

            if (data) {


            }
        }
    })


}


/**
 * Get Playlist with GID
 * @param gid
 * @returns {*}
 */
searchController.getSongFromId = function (id) {

    for (var i = 0; i < searchController.songs.searchResults.length; i++) {
        if (searchController.songs.searchResults[i].id == id) {
            return searchController.songs.searchResults[i];
        }
    }
    return null;

}


/**
 * Returns true if song in list
 * @param gid
 * @returns {*}
 */
searchController.isSongInList = function (song) {
    if (song) {
        var displayName = mediaController.getSongDisplayName(song)
        for (var i = 0; i < searchController.songs.searchResults.length; i++) {
            if (displayName == mediaController.getSongDisplayName(searchController.songs.searchResults[i])) {
                return true;
            }
        }
    }
    return false;

}


searchController.isVisisbleInShowMode = function (showMode) {
    return searchController.showMode != -1 && (showMode == searchController.showMode || searchController.showMode == 0);
}

/**
 * Set show Mode of search list ( details or all types)
 * @param showMode
 */
searchController.setShowMode = function (showMode) {
    if (showMode == searchController.showMode)
        return;

    //Only songs founds so they are displayed fully

    if (searchController.isOnlyTypeDisplayed(showMode))
        return;

    $("#searchlistview").hide();
    $("#searchlist .iScrollIndicator").hide();
    $("#searchlist .iScrollScrollUpIndicator").hide();

    if (searchController.showMode == 0)
        playlistController.searchListScrollY = uiController.searchListScroll.y;


    searchController.showMode = showMode;

    switch (showMode) {
        case 0:  //all
            searchController.showed = null;
            searchController.displayLimit = 0;
            $scope.safeApply();
            $("#searchlistview").listview('refresh');
            setTimeout(function () {
                playbackController.remarkSong();
            }, 0)

            break;
        case 1:   //songs
            searchController.showed = searchController.songs;
            break;

        case 2:  //playlists
            searchController.showed = searchController.playlists;

            break;

        case 3: //artists
            searchController.showed = searchController.artists;

            break;

        case 4: //user
            searchController.showed = searchController.user;
            break;

    }


    setTimeout(function () {
        if (searchController.showMode == 0 && playlistController.searchListScrollY)
            uiController.searchListScroll.scrollTo(0, playlistController.searchListScrollY, 0);
        else
            uiController.searchListScroll.scrollTo(0, 0, 0);
    }, 0);


    //$(".searchlisttitlebutton").css("opacity", "0").removeClass("fadeincompletefast")

    searchController.applySongList(searchController.currentSearchID);
    setTimeout(function () {
        $("#searchlistview").show();
    }, 150);


}

/**
 * Check if Type is only type displayed because
 *  1: selected
 *  2: only type found
 * @param type
 */
searchController.isOnlyTypeDisplayed = function (type) {
    return searchController.showMode == type || searchController.isOnlyResultType(type);
}


/**
 * Check if otype is only Result type found
 * @param type
 * @returns {boolean}
 */
searchController.isOnlyResultType = function (type) {
    switch (type) {
        case 1:   //songs

            if (searchController.playlists.searchResults.length == 0 && searchController.artists.searchResults.length == 0 && searchController.users.searchResults.length == 0)
                return true;


            break;

        case 2:  //playlists

            if (searchController.songs.searchResults.length == 0 && searchController.artists.searchResults.length == 0 && searchController.users.searchResults.length == 0)
                return true;

            break;

        case 3: //artists
            if (searchController.playlists.searchResults.length == 0 && searchController.songs.searchResults.length == 0 && searchController.users.searchResults.length == 0)
                return true;

            break;
        case 4: //user
            if (searchController.playlists.searchResults.length == 0 && searchController.songs.searchResults.length == 0 && searchController.artists.searchResults.length == 0)
                return true;
            break;

    }
}


searchController.getShowModeLimit = function (type) {

    //Only one type is displaced or only one type is found
    if (searchController.isOnlyTypeDisplayed(type)) {
        var limit = searchController.displayLimit;
    } else {
        switch (type) {
            case 1:   //songs

                if (uiController.gridLayout)
                    limit = Math.ceil(10 / uiController.gridLayoutCols) * uiController.gridLayoutCols;
                else
                    limit = 10;
                break;


                break;

            case 2:  //playlists

                if (uiController.gridLayout)
                    limit = uiController.gridLayoutCols;
                else
                    limit = 1;
                break;
            case 3: //artists

                if (uiController.gridLayout)
                    limit = uiController.gridLayoutCols;
                else
                    limit = 1;
                break;


            case 4: //user

                if (uiController.gridLayout)
                    limit = uiController.gridLayoutCols;
                else
                    limit = 3;
                break;

        }

    }


    return limit
}

/**
 * Make  Searchlist Drag and Droppable
 */
searchController.dragDraggableSongTimer = 0;
searchController.makeSearchListDraggable = function () {

    var startDragFunction = function (event) {

        if ($(this).parents("#searchlist").length == 0)
            return;

        if (!searchController.dragDraggableLastSongTimer || Date.now() - searchController.dragDraggableLastSongTimer > 500) {
            searchController.dragDraggableSongX = event.clientX;
            searchController.dragDraggableSongY = event.clientY;
            searchController.dragDraggableSongTimer = Date.now();
            TIMER = Date.now()
            searchController.dragDraggableSongStartEvent = event;
            searchController.dragDraggableSongStartElement = this;
            uiController.swiping = false;


            $("body").on("mouseup ", function (event) {
                $("body").off("mousemove").off("mouseup");

                if (uiController.swiping || (searchController.dragDraggableSongY > 0 && Math.abs(event.clientY - searchController.dragDraggableSongY) > 30)) {
                    uiController.swipeTimer = Date.now();
                }

                setTimeout(function () {
                    $("#playlistview").removeClass("dragging");
                    $(".songlist").removeClass("nohover");

                    uiController.swiping = false;
                    searchController.dragDraggableSongY = 0;
                    searchController.dragDraggableSongTimer = 0;
                }, 50)


            })


            $("body").on("mousemove ", function (event) {

                console.log('MOUSEMOVE SEARCH  ' + Math.abs(event.clientY - searchController.dragDraggableSongY) + "    " + (Date.now() - searchController.dragDraggableSongTimer))


                if (uiController.swiping || (searchController.dragDraggableSongY > 0 && Math.abs(event.clientY - searchController.dragDraggableSongY) > 30)) {
                    searchController.dragDraggableSongY = -10;
                    uiController.swiping = true;
                    uiController.swipeTimer = Date.now();
                    console.log('SWIPING SEARCH ' + Math.abs(event.clientY - searchController.dragDraggableSongY) + "    " + (Date.now() - searchController.dragDraggableSongTimer))

                } else if (searchController.dragDraggableSongTimer && Date.now() - searchController.dragDraggableSongTimer < 500) {
                    if (!uiController.draggingSong && event.clientX - searchController.dragDraggableSongX > 0 && Math.abs(event.clientY - searchController.dragDraggableSongY) < Math.abs(event.clientX - searchController.dragDraggableSongX) * 0.8) {
                        console.log('DRAGGING')

                        $("body").off("mousemove").off("mouseup");


                        searchController.dragDraggableSongY = -10;
                        searchController.dragDraggableLastSongTimer = Date.now();
                        searchController.dragDraggableSongTimer = 0;

                        searchController.mainDraggedElement = $(searchController.dragDraggableSongStartEvent.target)
                        if (!searchController.mainDraggedElement.hasClass("draggableSong"))
                            searchController.mainDraggedElement = $(searchController.dragDraggableSongStartEvent.target).parents("li")

                        if (searchController.mainDraggedElement.length==0)
                            return;


                        var delay = 0;

                        //Playlists are displayed
                        if (playlistController.playlistMode) {
                            $("#searchlistview .draggableSong").draggable("option", "connectToSortable", "");
                            if(playlistController.sortPlaylist)
                                playlistController.toggleSortablePlaylist();
                        } else {
                            $("#searchlistview .draggableSong").draggable("option", "connectToSortable", "#playlistview");
                        }

                       //   $("#searchlistview .draggableSong")

                        searchController.mainDraggedElement.draggable("enable");

                        if (!uiController.sidePanelOpen && $(window).width() < uiController.responsiveWidthSmallest) {
                            uiController.startedSortPlaylistOpenedPanel = true;
                            uiController.toggleSidePanel();
                            delay = delay + 250;


                        } else {
                            uiController.startedSortPlaylistOpenedPanel = false;

                        }

                        var coords = {
                            clientX: searchController.dragDraggableSongStartEvent.clientX,
                            clientY: searchController.dragDraggableSongStartEvent.clientY
                        };

                        $(searchController.dragDraggableSongStartElement).simulate("mouseup", coords);
                        uiController.mouseUp = false;
                        $("body").on("mouseup ", function (event) {
                            $("body").off("mouseup");
                            uiController.mouseUp = true;
                            if(searchController.mainDraggedElement){
                                searchController.mainDraggedElement.draggable("disable").removeClass("ui-disabled ui-state-disabled");
                                searchController.mainDraggedElement=null;
                            }
                        })

                        //  uiController.updateUI();

                        setTimeout(function () {
                            if (!uiController.mouseUp) {
                                if (!playlistController.sortPlaylist && !playlistController.playlistMode) {
                                    playlistController.toggleSortablePlaylist();

                                    uiController.startedSortPlaylist = true;

                                } else
                                    uiController.startedSortPlaylist = false;


                               console.log("! "+uiController.startedSortPlaylist+"   "+playlistController.playlistMode)
                                $(searchController.dragDraggableSongStartElement).simulate("mousedown", coords);
                            }
                        }, delay)
                    }
                }
            })


        } else
            searchController.dragDraggableSongTimer = 0;


    }


    $("#searchlist li").off("mousedown", startDragFunction);
    $("#searchlist li").on("mousedown", startDragFunction)

    $('#searchlistview .draggableSong').draggable({
        tolerance: "pointer",
        dropOnEmpty: true,
        revert: false,

        //   containment: "body",
        connectToSortable: '#playlistview',

        helper: function (event, ui) {

            $("#songOptions").appendTo("body").hide();


            $("#playlistInner li.selected").removeClass("selected")
            if (!$(this).hasClass("selected")) {
                $("#searchlist li.selected").removeClass("selected")
                $(this).addClass("selected");
            }

            var $helper = $('<ul></ul>').addClass('songlist draggedlistelement draggedsearchlistelement');
            var elements = $("#searchlist li.selected").removeClass("selected").clone().removeClass("loadedsong playing pausing stillLoading");

            elements.find(".songPlayCount, .songTrend, .loadingSongImg").remove();
            elements.find("h3").removeClass("songTitleMargin");

            if (elements.length == 0) {
                elements = $(this).removeClass("selected").clone().removeClass("loadedsong playing pausing stillLoading");
                elements.removeClass("fadeslideincompletefast");
                elements.addClass("margintop");

            } else {
                elements.removeClass("fadeslideincompletefast");
                $(elements.get(0)).addClass("margintop");

            }

            $("#playlistplaceholder").remove();

            var eleHeight = (65 * elements.length);
            if (eleHeight > 65 * 4) {
                eleHeight = 65 * 4;

            }
            if (eleHeight < 65)
                eleHeight = 65;

            $("<style type='text/css' id='playlistplaceholder'> #playlistInner ul .ui-sortable-placeholder{ height:" + eleHeight + "px !important} </style>").appendTo("head");

            var ele = $helper.append(elements)

            playlistController.draggedElements = elements;

            playlistController.draggedElement = ele.find("li[data-index='" + $(this).data("index") + "'] ");
            $(".songlist").addClass("nohover");

            ele.css("opacity", "1");

            //var marquee = $(ele).find("marquee").get(0);
            // $(marquee).replaceWith($(marquee).contents());


            return ele;
        },
        start: function (event) {
            var eleParent = $(playlistController.draggedElements.get(0)).parent();
            eleParent.attr('style', eleParent.attr('style') + '; ' + "margin-top:" + (-(playlistController.draggedElement.offset().top - playlistController.draggedElements.offset().top)) + "px" + ' !important');
            eleParent.css("opacity", "1");
            playlistController.hideSongOptions();

            //setTimeout(function () {debugger}, 3000)
            uiController.draggingSortableSong = false;
            uiController.draggingSong = true;
            uiController.lastDraggingSongFromSearchlist = true;


            uiController.dragSongX = event.clientX;
            uiController.dragSongY = event.clientY;
            uiController.dragSongCheckHorizontal = true;
            uiController.dragSongCheckHorizontalTimer = Date.now();


            $(".draggedsearchlistelement").off();
            $(".draggedsearchlistelement").on('mousemove', playlistController.scrollByDragCallback);
            $(".draggedsearchlistelement").on('wheel', playlistController.scrollByWheel);
            $(".draggedsearchlistelement").on('mousewheel', playlistController.scrollByWheel);
            $(".draggedsearchlistelement").on('DOMMouseScroll', playlistController.scrollByWheel);


            //Playlists are displayed
            if (playlistController.playlistMode) {
                $("#playlistview").addClass("dragging")
            }

        },
        stop: function (event, ui) {

            if (playlistController.playlistMode && playlistController.playlists.length > 0) {
                $(".draggedlistelement").remove();

                var x = event.clientX, y = event.clientY,
                    elementMouseIsOver = document.elementFromPoint(x, y);
                var listElement = $(elementMouseIsOver).parents("li")

                setTimeout(function () {


                    if (listElement && listElement.parents("#playlistInner").length > 0) {


                        if (listElement.hasClass("playlistsong")) {
                            var playlist = playlistController.getPlaylistFromId(listElement.data("songgid").substring(12))
                            var newPlaylist = false;
                            var newPlaylist = false;

                        } else if (listElement.hasClass("currentqueue")) {

                            playlist = playlistController.currentQueue;
                            newPlaylist = false;


                        } else if (listElement.hasClass("createplaylist")) {
                            playlist = playlistController.createEmptyPlaylist();
                            delete playlist.isUnnamedPlaylist;
                            // playlistController.loadedPlaylistSongs.unshift(playlist);

                            newPlaylist = true;
                        }

                        if (playlist) {
                            if (!playlist.tracks)
                                playlist.tracks = [];

                            playlistController.draggedElements.each(function (index, listElement) {

                                if ($(listElement).data("song")) {

                                    var actSong = $(listElement).data("song");
                                    if (actSong) {
                                        actSong = jQuery.extend(true, {}, actSong);
                                        actSong.gid = playlistController.getNewID();
                                        actSong.playlistgid = playlist.gid;

                                        playlist.tracks.push(actSong)
                                    }
                                }
                            })

                            var position = playlistController.getPlaylistPosition(playlist.gid);
                            if (position > -1) {
                                playlistController.playlistChanged(playlist, position)
                            }


                            if (newPlaylist) {

                                if (playlistController.loadedPlaylistSongs.indexOf(playlist) == -1)
                                    playlistController.loadedPlaylistSongs.unshift(playlist);

                                $scope.safeApply();
                                playlistController.chosenElement.trigger('chosen:updated');

                                $("#playlistview").listview('refresh');
                                uiController.playListScroll.scrollTo(0, scrollY);
                                uiController.updateUI();
                                setTimeout(function () {
                                    uiController.playListScroll.refresh();
                                }, 150)
                                setTimeout(function () {
                                    uiController.playListScroll.refresh();
                                }, 1000)


                            } else
                                $scope.safeApply();


                        }
                    }
                }, 0)

                if (listElement.hasClass("playlistsong") || listElement.hasClass("currentqueue")) {
                    playlistController.animateAddedToList(listElement);
                }
            } else{
                $(".importplaylist").hide();
            }

            $("#playlistview").removeClass("dragging")
            $(".songlist").removeClass("nohover");

            var ele = $(playlistController.draggedElements.get(0)).parent();
            ele.attr('style', ele.attr('style') + '; ' + "margin-top:0px" + ' !important');
            ele.addClass("animatemargin");

            if(searchController.mainDraggedElement){
                searchController.mainDraggedElement.draggable("disable").removeClass("ui-disabled ui-state-disabled");
                searchController.mainDraggedElement=null;
            }


            $(this).css("opacity", "1")
            setTimeout(function () {
                $("#searchlist li").simulate("mouseup");
            }, 0)
            if (uiController.startedSortPlaylistOpenedPanel)
                setTimeout(function () {
                    uiController.toggleSidePanel();
                }, 1000)

            if (uiController.startedSortPlaylist) {
                playlistController.sortPlaylist = true;
                playlistController.toggleSortablePlaylist();
                uiController.startedSortPlaylist = false;
            }
            uiController.draggingSong = false;


            playlistController.updateDeselectedSong();

            uiController.swipeTimer = Date.now();


        },
        appendTo: 'body',
        zIndex: "1000000" //or greater than any other relative/absolute/fixed elements and droppables
    });

    $("#searchlistview .draggableSong").draggable("disable").removeClass("ui-disabled ui-state-disabled");

}

