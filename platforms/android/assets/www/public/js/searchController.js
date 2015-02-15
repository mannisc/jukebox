/** * searchController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 03.03.14 - 13:58
 * @copyright  */





var searchController = function () {

};


searchController.lastfmapikey = "019c7bcfc5d37775d1e7f651d4c08e6f";


searchController.dragging = function () {
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

searchController.usesInput = true;


searchController.usesSearchList = true;

searchController.index = 0;

searchController.inputText = "Search Songs, Playlists and Artists";

searchController.inputTextArtist = "Search ";


searchController.currentSearchID = 0;

searchController.maxResults = 100;

searchController.displayLimit = searchController.maxResults;

searchController.searchSongsString = "";

//What content is displayed in the list
searchController.showMode = -1; //-1: nichts, 0: Alle Ergebnisse 1: songs,2:  playlists, 3: artists,4: user , 5: one playlist  , 6:one Artist


searchController.modeHistory = new function () {
    var history = [];


    this.push = function (mode, data) {
        history.push({mode: mode, searchTerm: searchController.searchTerm, showedArtist: $.extend(true, {}, searchController.showedArtist), showedPlaylist: $.extend(true, {}, searchController.showedPlaylist), songsStart: +searchController.songs.songsStart, nextSongsExists: searchController.songs.nextSongsExists})

    };
    this.pop = function () {
        return history.pop();
    };

    this.exists = function () {
        return history.length > 0;
    }

    this.modeInHistory = function (mode) {

        if (searchController.showMode == 6)
            return true;

        for (var i = 0; i < history.length; i++) {
            if (history[i].mode == mode)
                return true;
        }
        return false;
    }

    this.history = history;


}


searchController.maxPopularSongPages = 2;
searchController.maxArtistSongPages = 2;

/*Search types*/
searchController.searchTypeSongs = 0;
searchController.searchTypePlaylists = 1;
searchController.searchTypeArtists = 2;
searchController.searchTypeUsers = 3;


/*Show Range for songs*/

searchController.songs.popularStart = 0;
searchController.songs.songsStart = 0;

//Generated data

if (generatedData && generatedData.charts) {
    searchController.preloadedPopularSongs = {"track": generatedData.charts};
    setTimeout(function () {
        searchController.songs.cleanList(searchController.preloadedPopularSongs.track);
    }, 0)
}
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
        useTransition: true,
        // wheelAction: 'zoom',
        scrollbars: true,
        noHorizontalZoom: true,
        HWCompositing: false


    });

    $("#searchlist .iScrollIndicator").addClass("fadeincomplete").hide();


    /**
     * Scroll by wheel
     * @param event
     */
    $("body").on('wheel', function (event) {
            var isOnPlaylist = $(event.target).parents("#playlist");
            var isOnSearchlist = $(event.target).parents("#searchlistview");

            if (isOnPlaylist.length == 0 && isOnSearchlist.length == 0) {
                uiController.searchListScroll.handleEvent(event);
            }
        }
    )


    $("#searchlist").on('wheel', function (event) {
            viewController.fadeContentVisible(2500);

        }
    )

    uiController.searchListScroll.on('scrollEnd', function () {
        if (uiController.searchListScroll.y == 0) {
            $("#searchlist .iScrollScrollUpIndicator").hide();
        } else {
            $("#searchlist .iScrollScrollUpIndicator").show();
        }

    });


    setTimeout(function () {
        uiController.searchListScroll.refresh();
    }, 150)

    searchController.scrollUpIndicator = $('<div class="iScrollScrollUpIndicator fadeincomplete" style="display:none;"></div>');
    $("#searchlist .iScrollVerticalScrollbar").prepend(searchController.scrollUpIndicator);

    searchController.scrollUpIndicator.on("click touchend",function () {
        uiController.searchListScroll.scrollTo(0, 0, 200);
    });

    searchController.playIndicator = $('<div class="iScrollPlayIndicator fadeincomplete5s" style="display:none;"></div>');
    searchController.playIndicator.appendTo("#searchlist .iScrollVerticalScrollbar");
    searchController.playIndicator.click(function () {
        uiController.searchListScroll.scrollToElement(".loadedsong", 700);
    });

    //Avoid still scrolling when mouseup outside winow occurs
    $(document).on("mouseout", function (e) {
        e = e ? e : window.event;
        var from = e.relatedTarget || e.toElement;
        if (!from || from.nodeName == "HTML") {
            // stop your drag event here
            // for now we can just use an alert
            var coords = {
                clientX: e.clientX,
                clientY: e.clientY
            };
            $(window).simulate("mouseup", coords);
        }
    })


    //Detect swipes on searchlist
    var swipeDetectFunction = function (event) {
        var startY = event.clientY||event.originalEvent.touches[0].clientY;
        $(window).on("mousemove.swipe touchmove.swipe", function (event) {


            var actY =  event.clientY;
            var diffY = 30;
            if(!actY&&event.originalEvent.touches[0]) {
                actY =  event.originalEvent.touches[0].clientY;
                diffY = 1;
            }

            if (!actY||uiController.swiping || (startY > 0 && Math.abs(actY- startY) > diffY)) {
                uiController.swiping = true;
                uiController.swipeTimer = Date.now();
            }
        })
        $(window).on("mouseup touchend", function (event) {
            var actY =  event.clientY;
            var diffY = 30;
            if(!actY&&event.originalEvent.touches[0]) {
                actY =  event.originalEvent.touches[0].clientY;
                diffY = 1;
            }

            if (!actY||uiController.swiping || (startY > 0 && Math.abs(actY- startY) > diffY)) {

                uiController.swipeTimer = Date.now();
                uiController.swiping = false;
            }
            $(window).off("mousemove.swipe touchmove.swipe").off("mouseup touchend");

        })

    }
    $(window).off("mousedown.swipe touchstart.swipe", swipeDetectFunction);
    $(window).on("mousedown.swipe touchstart.swipe" , swipeDetectFunction)

    $("#searchlist, #playlist").on("touchstart" , function(){
        $("#searchinput").blur();
    })





}


/**
 * Something was entered in input
 */
searchController.onInput = function () {

    if (searchController.showMode == 5)
        searchController.backShowMode();

    $("#searchlist .iScrollPlayIndicator").hide();
    $("#searchlist .iScrollScrollUpIndicator").hide();


    searchController.startSearch();




}

/**
 * Input was cleared
 */
searchController.onClear = function () {
    if (searchController.showMode == 6) {
        $("#searchinput").val("");
        $("#controlselecthorizontal .ui-input-clear").addClass("ui-input-clear-hidden");

    } else {
        if (searchController.showMode > 4)
            searchController.backShowMode();
    }
    searchController.startSearch();//Show Populars


}


/**
 *  Show View
 */
searchController.showView = function () {
    uiController.searchListScroll.scrollTo(0, 0, 0);

    searchController.visible = true;

    $("#searchinput").val(searchController.searchSongsString);
    $("#searchcontent").addClass("searchlayout");

    setTimeout(function () {
        if (searchController.visible) {


            searchController.displayLimit = 0;

            searchController.applySongList(searchController.currentSearchID);


        }

    }, 350)

   uiController.updateUI();
}


/**
 * Hide View
 */
searchController.hideView = function () {

    searchController.visible = false;

    searchController.currentSearchID++;

    searchController.displayLimit = 0

    $("#searchcontent").removeClass("searchlayout");

    searchController.searchSongsString = $("#searchinput").val();
    $scope.safeApply();
    $("#searchlistview").listview('refresh');

    uiController.updateUI();

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


                        //Load Covers
                        for (var j = 0; j < data.track.length; j++) {
                            setTimeout(mediaController.loadPreview(data.track[j]), j * 300);
                        }
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
            if (data.results && !data.results.albummatches && !(data.results.trackmatches == "\n" || data.results.artistmatches == "\n")) {
                deferred.resolve({list: data, native: false});
            } // Similarity search
            else if (data.similartracks && !(data.similartracks == "\n")) {
                deferred.resolve({list: data.similartracks, native: false});
            }
            else if (data.toptracks && !(data.toptracks == "\n")) {
                deferred.resolve({list: data.toptracks, native: false});
            }
            else if (data.topalbums && data.topalbums.album && !(data.topalbums == "\n")) {
                deferred.resolve({list: data.topalbums.album, native: false});

            } else if (data.results && data.results.albummatches && data.results.albummatches.album && !(data.results.albummatches == "\n" )) {
                deferred.resolve({list: data.results.albummatches.album, native: false});

            }


            else {
                if (!dontSearchNative) {
                    searchserver();
                } else
                    deferred.resolve({list: [], native: true});

            }


        },
        error: function () {

            if (!dontSearchNative) {
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

searchController.startSearch = function (searchTerm, dontResetStartPage) {
    if (!searchTerm)
        searchTerm = $("#searchinput").val();

    viewController.showLoading(true);

    searchController.searchTerm = searchTerm;


    if (!dontResetStartPage) {
        searchController.songs.songsStart = 0;
        searchController.songs.nextSongsExists = true;
        var startPage = 1;
    } else {
        startPage = 1 + searchController.songs.songsStart / searchController.songs.pageLimit;
    }


    if (searchController.modeHistory.modeInHistory(6)) {
        searchController.currentSearchID = searchController.currentSearchID + 1;

        var search = function (searchID) {
            $.when(
                    searchController.songs.startSearchDeferred(searchController.searchTerm, searchID, startPage, searchController.showedArtist.name),
                    searchController.playlists.startSearchDeferred(searchController.searchTerm, searchController.showedArtist.name)
                ).then(function (songList, playlistList) {
                    if (searchID == searchController.currentSearchID) {
                        searchController.showedPopulars = false;
                        searchController.completedSearch(songList, playlistList);

                    }
                });
        };
        search(searchController.currentSearchID);

    }
    else {

        if (searchTerm && $.trim(searchTerm) != "") {

            searchController.currentSearchID = searchController.currentSearchID + 1;

            //Artist Displayed

            var search = function (searchID) {
                $.when(
                        searchController.songs.startSearchDeferred(searchController.searchTerm, searchID, startPage),
                        searchController.playlists.startSearchDeferred(searchController.searchTerm),
                        searchController.artists.startSearchDeferred(searchController.searchTerm)

                    ).then(function (songList, playlistList, artistsList, userList) {
                        if (searchID == searchController.currentSearchID) {
                            searchController.showedPopulars = false;
                            searchController.completedSearch(songList, playlistList, artistsList, userList);

                        }
                    });
            };


            search(searchController.currentSearchID);

        } else {

            searchController.showPopulars();
        }
    }
};


/**
 * Search was completed
 */
searchController.completedSearch = function (songList, playlistList, artistsList, userList) {
    if (songList || playlistList || artistsList || userList) {


        searchController.displayLimit = 0;

        if (searchController.showMode == -1)
            searchController.showMode = 0;
        uiController.searchListScroll.scrollTo(0, 0, 700);

        if (songList != null)//Something Changed
            searchController.songs.searchResults = songList;
        if (playlistList != null)//Something Changed
            searchController.playlists.searchResults = playlistList;
        if (artistsList != null)//Something Changed
            searchController.artists.searchResults = artistsList;
        if (userList != null)//Something Changed
            searchController.users.searchResults = userList;


        searchController.applySongList(searchController.currentSearchID);
        setTimeout(function () {
                viewController.showLoading(false);
                $.mobile.loading("hide");

            }
            , 100); //show=false

    }

};


searchController.isSongInList = function (song, list, maxPosition) {

    if (song && list) {

        if (!maxPosition)
            maxPosition = list.length;

        var displayName = mediaController.getSongDisplayName(song);
        for (var i = 0; i < maxPosition; i++) {
            if (displayName == mediaController.getSongDisplayName(list[i])) {
                return true;
            }
        }
    }
    return false;

}


searchController.showPopulars = function () {

    if (searchController.preloadedPopularSongs) {


        searchController.playlists.searchResults = [];
        searchController.artists.searchResults = [];
        searchController.users.searchResults = [];

        searchController.showedPopulars = true;
        searchController.currentSearchID = searchController.currentSearchID + 1;

        searchController.completedSearch(searchController.preloadedPopularSongs.track.slice(searchController.songs.popularStart, searchController.songs.popularStart + 1 + searchController.maxResults));

    }
}


searchController.emptySearchList = function (dontInitFully) {

    searchController.currentSearchID++;
    viewController.showLoading(false);
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
        playlistController.selection.updateDeselectedSong();
        uiController.updateUI();
        playbackController.remarkSong();

    }, 0)

    if (!dontInitFully) {
        searchController.dragging.makeSearchListDraggable();
        setTimeout(function () {
            $("#searchlistview li").removeClass("fadeincompletefast");
        }, 100)
    }
}


/*Songs -------------------------------------------------------------------------------------------------------------------------------------*/

/**
 * Encapsules all song operations
 */

searchController.songs.pageLimit = 30;
searchController.songs.maxPagesAtOnce = 2;


/**
 *
 * @param searchTerm
 * @param searchID
 * @param startPage
 * @param artist Optional
 * @returns {*}
 */
searchController.songs.startSearchDeferred = function (searchTerm, searchID, startPage, artist) {
    var deferred = $.Deferred();


    var loadPage = function (page, loadedSongList) {


        if (searchTerm && $.trim(searchTerm) != "") {
            var onlineSearchURL = "http://ws.audioscrobbler.com/2.0/?method=track.search&track=%searchTerm&limit=" + searchController.songs.pageLimit + "&page=" + page + "&api_key=" + searchController.lastfmapikey + "&format=json";
            if (artist) {
                searchTerm = artist + " " + searchTerm;
            }
        }

        else {
            onlineSearchURL = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&limit=" + searchController.songs.pageLimit + "&api_key=" + searchController.lastfmapikey + "&page=" + page + "&format=json"


            if (artist)
                onlineSearchURL = onlineSearchURL + "&artist=" + artist;
        }


        $.when(
                searchController.basicLocalSearchDeferred(searchTerm, searchController.searchTypeSongs, (artist != null)),
                searchController.basicOnlineSearchDeferred(onlineSearchURL, searchTerm, searchController.searchTypeSongs)
            ).then(function (localList, onlineList) {
                if (!searchID || searchID == searchController.currentSearchID) {

                    var songList = searchController.songs.completeSearch(localList, onlineList);

                    songList = loadedSongList.concat(songList);


                    if (page - startPage + 1 < searchController.songs.maxPagesAtOnce) {
                        page++;
                        loadPage(page, songList);
                    }
                    else
                        deferred.resolve(songList);


                } else
                    deferred.resolve(songList);

            });
    }
    loadPage(startPage, []);

    return deferred.promise();

}


searchController.formatNumber = function (x) {
    if (x.indexOf(".") == -1)
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    else
        return x
}

searchController.songs.cleanList = function (songList) {
    for (var i = 0; i < songList.length; i++) {
        var song = songList[i];
        if (!song.name || song.name == "") {
            songList.splice(i, 1);
            i--;
        } else {

            if (song.playcount)
                song.playcount = searchController.formatNumber(song.playcount);

            if (song.artist) {
                if (!song.artist.name) {
                    if (song.artist)
                        song.artist = {name: song.artist};
                }
            } else
                song.artist = {name: mediaController.unknownData};

            song.artist.name = $.trim(song.artist.name);
            song.name = $.trim(song.name);
            if (song.mbid) {
                delete song.mbid
            }
            if (song.streamable) {
                delete song.streamable
            }
            if (song.url) {
                delete song.url
            }
        }
    }
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

    // console.dir("completeSearch##############################################################################");
    // console.dir(songList);
    //Set Artist of song and remove songs without name
    searchController.songs.cleanList(songList)


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


searchController.songs.previousSongsExists = function () {
    return searchController.songs.songsStart > 0
}

searchController.songs.previousSongs = function () {
    searchController.songs.songsStart = searchController.songs.songsStart - searchController.songs.pageLimit * searchController.songs.maxPagesAtOnce;
    searchController.songs.loadCurrentPage();
}


searchController.songs.nextSongs = function () {
    var oldStart = searchController.songs.songsStart;

    searchController.songs.songsStart = searchController.songs.songsStart + searchController.songs.pageLimit * searchController.songs.maxPagesAtOnce;
    searchController.songs.loadCurrentPage(oldStart);

}

searchController.songs.loadCurrentPage = function (oldStart) {
    $("#searchlist .iScrollPlayIndicator").hide();
    $("#searchlist .iScrollScrollUpIndicator").hide();
    viewController.showLoading(true);
    $.mobile.loading("show");
    searchController.currentSearchID = searchController.currentSearchID + 1;
    var search = function (searchID) {

        if (searchController.modeHistory.modeInHistory(6))
            var artist = searchController.showedArtist.name;
        else
            artist = null;

        $.when(
                searchController.songs.startSearchDeferred(searchController.searchTerm, searchID, 1 + searchController.songs.songsStart / searchController.songs.pageLimit, artist)
            ).then(function (songList) {

                if (searchID == searchController.currentSearchID) {
                    searchController.showedPopulars = false;

                    var arraysIdentical = function (a, b) {
                        var i = a.length;
                        if (i != b.length) return false;
                        while (i--) {
                            if (mediaController.getSongDisplayName(a[i]) !== mediaController.getSongDisplayName(b[i])) return false;
                        }
                        return true;
                    };

                    if (arraysIdentical(searchController.songs.searchResults, songList)) {
                        searchController.songs.nextSongsExists = false;
                        searchController.songs.songsStart = oldStart;

                    }
                    searchController.completedSearch(songList);


                }
                $.mobile.loading("hide");

            });
    };
    search(searchController.currentSearchID);
}


searchController.songs.previousPopularSongsExists = function () {
    return searchController.songs.popularStart > 0
}

searchController.songs.previousPopularSongs = function () {
    searchController.songs.popularStart = searchController.songs.popularStart - searchController.maxResults;
    $("#searchlist .iScrollPlayIndicator").hide();
    $("#searchlist .iScrollScrollUpIndicator").hide();
    searchController.showPopulars();
}

searchController.songs.nextPopularSongsExists = function () {
    return searchController.preloadedPopularSongs.track.length - (searchController.songs.popularStart + searchController.maxResults) > 0
}

searchController.songs.nextPopularSongs = function () {
    searchController.songs.popularStart = searchController.songs.popularStart + searchController.maxResults;
    $("#searchlist .iScrollPlayIndicator").hide();
    $("#searchlist .iScrollScrollUpIndicator").hide();
    searchController.showPopulars();
}


/*Playlists -------------------------------------------------------------------------------------------------------------------------------------*/

/**
 * Encapsules all playlist operations
 */
searchController.playlists.pageLimit = 30;

searchController.playlists.startSearchDeferred = function (searchTerm, artist) {
    var deferred = $.Deferred();

    if (searchTerm && $.trim(searchTerm) != "") {
        var onlineSearchURL = "http://ws.audioscrobbler.com/2.0/?method=album.search&album=%searchTerm&limit=" + searchController.playlists.pageLimit + "&api_key=" + searchController.lastfmapikey + "&format=json";
        if (artist) {
            searchTerm = artist + " " + searchTerm;
        }
    }
    else
        onlineSearchURL = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&limit=" + searchController.playlists.pageLimit + "&artist=" + artist + "&api_key=" + searchController.lastfmapikey + "&format=json";

    $.when(
            searchController.basicLocalSearchDeferred(searchTerm, searchController.searchTypePlaylists),
            searchController.basicOnlineSearchDeferred(onlineSearchURL, searchTerm, searchController.searchTypePlaylists, true)
        ).then(function (localList, onlineList) {
            var playlistList = searchController.playlists.completeSearch(localList, onlineList);
            deferred.resolve(playlistList);

        });
    return deferred.promise();
}


searchController.playlists.completeSearch = function (localList, onlineList) {


    //Is from last fm or native server -> so convert and extract songlist accordingly

    onlineList = onlineList.list;


    var playlistList = localList.concat(onlineList)

    // remove without name
    for (var i = 0; i < playlistList.length; i++) {
        var playlist = playlistList[i];
        if (!playlist.name || playlist.name == "") {
            playlistList.splice(i, 1);
            i--;
        } else {
            playlistList[i].isPlaylist = true;

            if (playlist.artist) {
                if (!playlist.artist.name) {
                    if (playlist.artist)
                        playlist.artist = {name: playlist.artist};
                }
            } else
                playlist.artist = {name: mediaController.unknownData};

            playlist.artist.name = $.trim(playlist.artist.name);

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


/**
 * Show one Playlist in search list
 */
searchController.playlists.showPlaylist = function (playlist, dontPushNewMode) {

    if (searchController.showMode == 5 && searchController.showedPlaylist.mbid == playlist.mbid)
        return;

    viewController.activateView(searchController);

    $.mobile.loading("show");

    playlist.tracks = [];

    if (!dontPushNewMode)
        searchController.modeHistory.push(searchController.showMode);

    searchController.showMode = 5;
    searchController.showedPlaylist = playlist;

    $("#searchlistview").hide();
    $("#searchlist .iScrollIndicator").hide();
    $("#searchlist .iScrollScrollUpIndicator").hide();
    $("#searchlist .iScrollPlayIndicator").hide();

    playlistController.selection.deselectElements();

    var callbackComplete = function () {


        $scope.safeApply();
        viewController.fadeContentVisible();
        setTimeout(function () {
            $("#searchlistview").listview('refresh');
            searchController.dragging.makeSearchListDraggable();
            $("#searchlistview").show();
            uiController.searchListScroll.scrollTo(0, 0, 0);
            $.mobile.loading("hide");


        }, 150);
        setTimeout(function () {
            uiController.searchListScroll.refresh();


        }, 150)
        setTimeout(function () {
            uiController.searchListScroll.refresh();

        }, 1000)


    }

    setTimeout(function () {
        searchController.playlists.loadPlaylistTracks(playlist, callbackComplete, true);
    }, 0);

}


/**
 * Plays all displayed Playlists
 */
searchController.playlists.playAllPlaylists = function () {
    if (searchController.playlists.searchResults && searchController.playlists.searchResults.length > 0) {
        uiController.disableUI(true);

        setTimeout(function () {
            var playlists = searchController.playlists.searchResults.concat();
            var addPlaylist = function (playlists, index, playlistLength) {
                if (index > 0 && playlists[index - 1] && playlists[index - 1].tracks && playlists[index - 1].tracks.length) {
                    playlistLength = playlistLength + playlists[index - 1].tracks.length;
                    if (playlistLength > 0) {
                        if (index == 1)
                            playlistController.playSongList(playlists[index - 1].tracks.concat());
                        else
                            playlistController.addSongsToPlaylist(playlistController.currentQueue, playlists[index - 1].tracks.concat());
                    }
                }
                if (index < playlists.length && playlistLength < searchController.maxResults) {
                    searchController.playlists.loadPlaylistTracks(playlists[index], function () {
                        addPlaylist(playlists, index + 1, playlistLength);
                    }, false)
                } else {
                    uiController.disableUI(false);

                }
            }
            addPlaylist(playlists, 0, 0)
        }, 150)
    }

}


/**
 * Load Tracks of Playlist from last.fm
 */
searchController.playlists.loadPlaylistTracks = function (playlist, completeCallback, loadPreviews) {


    var url = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=" + searchController.lastfmapikey + "&artist=" + playlist.artist.name + "&album=" + playlist.name + "&format=json";

    $.ajax({
        url: url,
        async: false,
        success: function (data) {
            if (data.album && data.album.tracks && data.album.tracks.track) {
                console.log("...----")
                console.dir(data)
                console.log(data.album.tracks.track)
                searchController.songs.cleanList(data.album.tracks.track);

                playlist.tracks = data.album.tracks.track;
                //If only one track in playlist, stored as  object not list >:(
                if (playlist.tracks.name) {
                    var track = playlist.tracks;
                    playlist.tracks = null;
                    playlist.tracks = [track];
                }
                //Load covers
                if (playlist.tracks.length && loadPreviews) {
                    for (var j = 0; j < playlist.tracks.length; j++) {

                        if (!playlist.tracks[j].image) {
                            setTimeout(mediaController.loadPreview(playlist.tracks[j]), j * 300);
                        }

                    }
                }


                console.dir(playlist);
            }


        },
        error: function () {


        },
        complete: function () {
            if (completeCallback)
                completeCallback();


        }

    })

}


/**
 * Search for Playlists and open it
 * @param song
 */
searchController.playlists.searchForPlaylist = function (song) {

    var url = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + searchController.lastfmapikey + "&artist=" + song.artist.name + "&track=" + song.name + "&format=json";
    $.mobile.loading("show");

    $.ajax({
        url: url,
        success: function (data) {
            console.dir(data);
            if (data && data.track && data.track.album) {

                var album = data.track.album;

                var playlist = {artist: album.artist, name: album.title};

                if (playlist.artist) {
                    if (!playlist.artist.name) {
                        if (playlist.artist)
                            playlist.artist = {name: playlist.artist};
                    }
                }
                searchController.playlists.showPlaylist(playlist);

            } else {
                uiController.toast("No Playlist was found...", 1500);
            }
        },
        complete: function () {
            $.mobile.loading("hide");

        }
    });

}

/*Artists -------------------------------------------------------------------------------------------------------------------------------------*/

/**
 * Encapsules all artists operations
 */


searchController.artists.startSearchDeferred = function (searchTerm) {
    var deferred = $.Deferred();


    var onlineSearchURL = "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=%searchTerm&api_key=" + searchController.lastfmapikey + "&format=json";

    $.when(
            searchController.basicLocalSearchDeferred(searchTerm, searchController.searchTypeArtists),
            searchController.basicOnlineSearchDeferred(onlineSearchURL, searchTerm, searchController.searchTypeArtists, true)
        ).then(function (localList, onlineList) {


            var artistList = searchController.artists.completeSearch(localList, onlineList);
            deferred.resolve(artistList);

        });
    return deferred.promise();
}


searchController.artists.completeSearch = function (localList, onlineList) {
    if (!onlineList)
        onlineList = [];

    //Is from last fm or native server -> so convert and extract songlist accordingly
    if (onlineList.native) {
        onlineList = onlineList.list;
    } else if (onlineList.list)
        onlineList = onlineList.list.results.artistmatches.artist;
    else
        onlineList = [];

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


/**
 * Show one Playlist in search list
 */
searchController.artists.showArtist = function (artist, dontPushNewMode) {

    //Already Loaded
    if (searchController.showMode == 6 && searchController.showedArtist.mbid == artist.mbid)
        return;


    viewController.activateView(searchController);


    $.mobile.loading("show");


    if (!dontPushNewMode)
        searchController.modeHistory.push(searchController.showMode);

    if (artist.bio && artist.bio.summary && artist.bio.summary != "")
        var bioLoaded = true;
    else {
        artist.bio = {content: "", summary: ""};
        bioLoaded = false;
    }

    searchController.showedArtist = artist;

    searchController.showMode = 6;

    $("#controlselecthorizontal .ui-input-clear").addClass("ui-input-clear-hidden");
    $("#searchinput").val("");
    $("#searchinput").attr("placeholder", searchController.inputTextArtist + artist.name);


    $("#searchlistview").hide();
    $("#searchlist .iScrollIndicator").hide();
    $("#searchlist .iScrollScrollUpIndicator").hide();

    playlistController.selection.deselectElements();

    var callbackComplete = function (artist) {
        searchController.showedArtist = artist;
        $scope.safeApply();
        //$("#searchlist li.artistinfo .artistbio").html()
        viewController.fadeContentVisible();
        setTimeout(function () {
            $("#searchlistview").listview('refresh');
            searchController.dragging.makeSearchListDraggable();

            uiController.searchListScroll.scrollTo(0, 0, 0);
            searchController.startSearch("", true);


        }, 150);
        setTimeout(function () {
            uiController.searchListScroll.refresh();


        }, 150)
        setTimeout(function () {
            uiController.searchListScroll.refresh();

        }, 1000)
    }

    if (!bioLoaded) {
        searchController.artists.loadArtist(artist, callbackComplete)
    }
    else

        callbackComplete(searchController.showedArtist);
}


/**
 * Search for Artist and open it
 * @param song
 */
searchController.artists.searchForArtist = function (artist) {

    searchController.artists.loadArtist(artist, function (artist) {
        searchController.artists.showArtist(artist)
    })

}


/**
 * Search for Artist and open it
 * @param artist
 * @param callbackComplete callback retrieves loaded artist data
 */
searchController.artists.loadArtist = function (artist, callbackComplete) {

    $.mobile.loading("show");

    //Load biographie
    var url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artist.name + "&api_key=" + searchController.lastfmapikey + "&format=json";

    $.ajax({
            url: url,
            success: function (data) {
                if (data.artist && data.artist.bio && data.artist.bio.summary) {
                    data.artist.bio.summary = data.artist.bio.summary.replace(/<a href/g, "<a target='_blank' href");
                    artist = data.artist;
                }
            },
            complete: function () {

                callbackComplete(artist);
            }
        }
    )


}

/*Others -------------------------------------------------------------------------------------------------------------------------------------*/


/**
 * Get Song from From Index
 * @param index
 */
searchController.getSongFromIndex = function (index) {

    if (searchController.showMode == 5)
        return searchController.showedPlaylist.tracks[index];
    else
        return searchController.songs.searchResults[index];


}


/**
 * Applies search List so that song does not stop all the time
 * @param currentSearchID
 */

searchController.applySongList = function (currentSearchID) {

    // console.log("-------------------------------------")
    $(".specialplaylistbutton").removeClass("fadeincompletefaster");
    $("#searchlist .iScrollIndicator").hide();


    if (!playbackController.playingSong)
        var stepSize = searchController.maxResults / 2;
    else

        stepSize = 10;

    var stepDelay = 50;


    if (searchController.showMode == 0) {
        var size = searchController.maxResults;
    }
    else {
        if (searchController.showed)
            size = Math.min(searchController.showed.searchResults.length, searchController.maxResults);
        else
            size = searchController.maxResults;
    }

    var delays = (Math.ceil(size / stepSize));


    //console.log(delays)
    //console.log(size + "  " + stepSize)

    viewController.applySongList(currentSearchID, size, delays, stepSize, stepDelay);

}


/**
 *  Back to last show Mode
 */
searchController.backShowMode = function () {

    if (searchController.modeHistory.exists()) {

        var oldModeInfo = searchController.modeHistory.pop();
        //Restore olf Mode states
        var actOldMode = searchController.showMode;

        searchController.searchTerm = oldModeInfo.searchTerm;
        $("#searchinput").val(searchController.searchTerm);
        if (searchController.searchTerm != "")
            $("#controlselecthorizontal .ui-input-clear").removeClass("ui-input-clear-hidden");
        else
            $("#controlselecthorizontal .ui-input-clear").addClass("ui-input-clear-hidden");
        searchController.songs.songsStart = oldModeInfo.songsStart;
        searchController.songs.nextSongsExists = oldModeInfo.nextSongsExists;

        if (actOldMode == 6)
            $("#searchinput").attr("placeholder", searchController.inputText);


        if (oldModeInfo.mode == 5)
            searchController.playlists.showPlaylist(oldModeInfo.showedPlaylist, true);
        else if (oldModeInfo.mode == 6)
            searchController.artists.showArtist(oldModeInfo.showedArtist, true);
        else
            searchController.setShowMode(null, oldModeInfo.mode, true, true);

        if (actOldMode == 6) {
            searchController.startSearch(searchController.searchTerm, true);


        } else
            setTimeout(function () {
                $("#searchlistview").show();
            }, 150);


    }

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

    //Artist Page

    if (searchController.showMode == 6) {

        if (showMode == 1 || showMode == 2) {
            return true;

        }
    }

    return searchController.showMode != -1 && (showMode == searchController.showMode || searchController.showMode == 0);

}

/**
 * Set show Mode of search list ( details or all types)
 * @param showMode
 */
searchController.setShowMode = function (event, showMode, dontShowList, dontPushNewMode) {

    if (event) {

        if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 250)
            return;
        uiController.swipeTimer = Date.now();
        event.stopPropagation();

    }


    if (showMode == searchController.showMode)
        return;

    //Only songs founds so they are displayed fully

    if (searchController.isOnlyTypeDisplayed(showMode))
        return;


    $("#searchlistview").hide();
    $("#searchlist .iScrollIndicator").hide();
    $("#searchlist .iScrollScrollUpIndicator").hide();
    $("#searchlist .iScrollPlayIndicator").hide();

    if (searchController.showMode == 0)
        playlistController.searchListScrollY = uiController.searchListScroll.y;


    if (!dontPushNewMode)
        searchController.modeHistory.push(searchController.showMode);

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
            searchController.showed = searchController.users;
            break;

    }


    setTimeout(function () {
        if (searchController.showMode == 0 && playlistController.searchListScrollY)
            uiController.searchListScroll.scrollTo(0, playlistController.searchListScrollY, 0);
        else
            uiController.searchListScroll.scrollTo(0, 0, 0);
    }, 0);


    //$(".songlisttitlebutton").css("opacity", "0").removeClass("fadeincompletefast")

    searchController.applySongList(searchController.currentSearchID);

    if (!dontShowList)
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

    return false;
}


searchController.getShowModeLimit = function (type) {

    //Only one type is displaced or only one type is found
    if (searchController.isOnlyTypeDisplayed(type)) {
        var limit = searchController.displayLimit;
    } else {
        switch (type) {
            case 1:   //songs

                if (uiController.gridLayout)
                    limit = Math.ceil(searchController.displayLimit / 3 / uiController.gridLayoutCols) * uiController.gridLayoutCols;
                else
                    limit = searchController.displayLimit / 3;
                break;


                break;

            case 2:  //playlists

                if (uiController.gridLayout)
                    limit = uiController.gridLayoutCols;
                else
                    limit = 1;//TODO Change when other results available
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

            case 6:
        }

    }


    return limit
}


/**
 * Make  Searchlist Drag and Droppable
 */
searchController.dragDraggableSongTimer = 0;
searchController.dragging.makeSearchListDraggable = function () {


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


            $(window).on("mouseup ", function (event) {
                $(window).off("mousemove").off("mouseup");

                if (uiController.swiping || (searchController.dragDraggableSongY > 0 && Math.abs(event.clientY - searchController.dragDraggableSongY) > 30)) {
                    uiController.swipeTimer = Date.now();
                }

                setTimeout(function () {
                    $("#playlistview, #playlistButtons").removeClass("dragging");
                    $(".songlist").removeClass("nohover");

                    uiController.swiping = false;
                    searchController.dragDraggableSongY = 0;
                    searchController.dragDraggableSongTimer = 0;
                }, 50)


            })


            $(window).on("mousemove ", function (event) {


                if (uiController.swiping || (searchController.dragDraggableSongY > 0 && Math.abs(event.clientY - searchController.dragDraggableSongY) > 30)) {
                    searchController.dragDraggableSongY = -10;
                    uiController.swiping = true;
                    uiController.swipeTimer = Date.now();

                } else if (searchController.dragDraggableSongTimer && Date.now() - searchController.dragDraggableSongTimer < 500) {
                    if (!uiController.draggingSong && event.clientX - searchController.dragDraggableSongX > 0 && Math.abs(event.clientY - searchController.dragDraggableSongY) < Math.abs(event.clientX - searchController.dragDraggableSongX) * 0.8) {

                        $(window).off("mousemove").off("mouseup");


                        searchController.dragDraggableSongY = -10;
                        searchController.dragDraggableLastSongTimer = Date.now();
                        searchController.dragDraggableSongTimer = 0;

                        searchController.mainDraggedElement = $(searchController.dragDraggableSongStartEvent.target)
                        if (!searchController.mainDraggedElement.hasClass("draggableSong"))
                            searchController.mainDraggedElement = $(searchController.dragDraggableSongStartEvent.target).parents("li")

                        if (searchController.mainDraggedElement.length == 0)
                            return;


                        var delay = 0;

                        //Playlists are displayed
                        if (playlistController.playlistMode) {
                            $("#searchlistview .draggableSong").draggable("option", "connectToSortable", "");
                            if (playlistController.sortPlaylist)
                                playlistController.ui.toggleSortablePlaylist();


                        } else {
                            $(".sortable").sortable("enable");
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
                        $(window).on("mouseup ", function (event) {
                            $(window).off("mouseup");
                            uiController.mouseUp = true;//MouseUp was pressed
                            if (searchController.mainDraggedElement) {
                                searchController.mainDraggedElement.draggable("disable").removeClass("ui-disabled ui-state-disabled");
                                searchController.mainDraggedElement = null;
                            }
                        })

                        //  uiController.updateUI();

                        setTimeout(function () {

                            if (!uiController.mouseUp) {
                                if (!playlistController.sortPlaylist && !playlistController.playlistMode) {
                                    playlistController.ui.toggleSortablePlaylist();
                                    uiController.startedSortPlaylist = true;

                                } else
                                    uiController.startedSortPlaylist = false;


                                //console.log("! " + uiController.startedSortPlaylist + "   " + playlistController.playlistMode)
                                $(searchController.dragDraggableSongStartElement).simulate("mousedown", coords);

                                uiController.updateUI();
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
            return searchController.dragging.prepareDragging(event, ui, this);

        },

        start: function (event) {
            return  searchController.dragging.startDragging(event);

        },
        stop: function (event, ui) {

            return searchController.dragging.stopDragging(event, ui, this);

        },
        appendTo: 'body',
        zIndex: "1000000" //or greater than any other relative/absolute/fixed elements and droppables
    });

    $("#searchlistview .draggableSong").draggable("disable").removeClass("ui-disabled ui-state-disabled");

}


/**
 * Called when dragging is prepared (helper)
 * @param event
 * @param ui
 * @param that
 */
searchController.dragging.prepareDragging = function (event, ui, that) {

    $("#songOptions").appendTo("body").hide();


    $("#playlistInner li.selected").removeClass("selected")
    if (!$(that).hasClass("selected")) {
        $("#searchlist li.selected").removeClass("selected")
        $(that).addClass("selected");
    }

    var $helper = $('<ul></ul>').addClass('songlist draggedlistelement draggedsearchlistelement');
    var elements = $("#searchlist li.selected").removeClass("selected").clone().removeClass("loadedsong playing pausing stillLoading");

    elements.find(".songPlayCount, .songTrend, .loadingSongImg").remove();
    elements.find("h3").removeClass("songTitleMargin");

    if (elements.length == 0) {
        elements = $(that).removeClass("selected").clone().removeClass("loadedsong playing pausing stillLoading");
        elements.removeClass("fadeslideincompletefast");
        elements.addClass("margintop");

    } else {
        elements.removeClass("fadeslideincompletefast");
        $(elements.get(0)).addClass("margintop");

    }

    $("#playlistplaceholder").remove();

    var eleHeight = (113 * elements.length);
    if (eleHeight > 113 * 4) {
        eleHeight = 113 * 4;

    }
    if (eleHeight < 113)
        eleHeight = 113;

    $("<style type='text/css' id='playlistplaceholder'> #playlistInner ul .ui-sortable-placeholder{ height:" + eleHeight + "px !important} </style>").appendTo("head");

    var ele = $helper.append(elements)

    playlistController.draggedElements = elements;

    playlistController.draggedElement = ele.find("li[data-index='" + $(that).data("index") + "'] ");
    $(".songlist").addClass("nohover");

    ele.css("opacity", "1");

    //var marquee = $(ele).find("marquee").get(0);
    // $(marquee).replaceWith($(marquee).contents());


    return ele;
}

/**
 * Called when dragging starts
 * @param event
 * @param ui
 */
searchController.dragging.startDragging = function (event) {
    $(".importplaylist").hide();


    // setTimeout(function(){ debugger; },1000)

    var eleParent = $(playlistController.draggedElements.get(0)).parent();
    eleParent.attr('style', eleParent.attr('style') + '; ' + "margin-top:" + (-(playlistController.draggedElement.offset().top - playlistController.draggedElements.offset().top)) + "px" + ' !important');
    eleParent.css("opacity", "1");
    playlistController.options.hideSongOptions();

    //setTimeout(function () {debugger}, 3000)
    uiController.draggingSortableSong = false;
    uiController.draggingSong = true;
    uiController.lastDraggingSongFromSearchlist = true;


    uiController.dragSongX = event.clientX;
    uiController.dragSongY = event.clientY;
    uiController.dragSongCheckHorizontal = true;
    uiController.dragSongCheckHorizontalTimer = Date.now();


    $(".draggedsearchlistelement").off();
    $(".draggedsearchlistelement").on('mousemove', playlistController.ui.scrollByDragCallback);
    $(".draggedsearchlistelement").on('wheel', playlistController.ui.scrollByWheel);
    $(".draggedsearchlistelement").on('mousewheel', playlistController.ui.scrollByWheel);
    $(".draggedsearchlistelement").on('DOMMouseScroll', playlistController.ui.scrollByWheel);

    $("#playlistInner").addClass("isvisibledragging")
    uiController.checkIfListHintsNecessary();
    //Playlists are displayed
    if (playlistController.playlistMode) {
        $("#playlistview, #playlistButtons").addClass("dragging")
    }

}


/**
 * Called when dragging stops
 * @param event
 * @param ui
 *  * @param that

 */
searchController.dragging.stopDragging = function (event, ui, that) {


    if (playlistController.playlistMode && playlistController.playlists.length > 0) {
        $(".draggedlistelement").remove();



        var x = event.clientX, y = event.clientY,
            elementMouseIsOver = document.elementFromPoint(x, y);

        var listElement = $(elementMouseIsOver).parents("li");
        if (listElement.length == 0)
            listElement = $(elementMouseIsOver).parents("ul");
        if (listElement.length == 0)
            listElement = $(elementMouseIsOver)


        setTimeout(function () {


            if (listElement && ( listElement.parents("#playlistInner").length > 0) || listElement.attr("id") == "playlistInner") {

                var newPlaylistAtTop = false;
                if (listElement.hasClass("playlistsong")) {
                    var playlist = playlistController.getPlaylistFromId(listElement.data("songgid").substring(12))
                    var newPlaylist = false;

                } else if (listElement.hasClass("currentqueue")) {

                    playlist = playlistController.currentQueue;
                    newPlaylist = false;


                } else {  //if (listElement.hasClass("createplaylist"))

                    //Create Playlist Button was used to add at Top
                    if (listElement.hasClass("createplaylist"))
                        newPlaylistAtTop = true;

                    playlist = playlistController.createEmptyPlaylist(!newPlaylistAtTop);
                    playlistController.editedPlaylist = jQuery.extend(true, {}, playlist);
                    playlistController.editedPlaylistTitle = "New Playlist";

                    setTimeout(function () {
                        $("#popupTextInput").popup('open', {positionTo: "window", transition: 'pop'});
                    }, 500)

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

                    setTimeout(function () {

                        accountController.savePlaylist(playlist.gid, playlist.name, playlist.tracks);
                        accountController.savePlaylistsPosition();
                    }, 0);

                    //Dropped on Create new playlist
                    if (newPlaylist) {
                        if (playlistController.loadedPlaylistSongs.indexOf(playlist) == -1) {
                            if (newPlaylistAtTop)
                                playlistController.loadedPlaylistSongs.unshift(playlist);
                            else
                                playlistController.loadedPlaylistSongs.push(playlist);

                        }
                        playlistController.displayLimit = playlistController.loadedPlaylistSongs.length;

                        var scrollY = uiController.playListScroll.y;

                        $scope.safeApply();
                        $("#playlistview").listview('refresh');

                        playlistController.chosenElement.trigger('chosen:updated');

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
            playlistController.ui.animateAddedToList(listElement);
        }
    } else {
        setTimeout(function () {
            if (!playlistController.playlistMode && playlistController.loadedPlaylistSongs.length == 0)
                $(".importplaylist").show();

        }, 1000)
    }

    $("#playlistInner").removeClass("isvisibledragging")
    uiController.checkIfListHintsNecessary();
    $("#playlistview, #playlistButtons").removeClass("dragging")
    $(".songlist").removeClass("nohover");

    var ele = $(playlistController.draggedElements.get(0)).parent();
    ele.attr('style', ele.attr('style') + '; ' + "margin-top:0px" + ' !important');
    ele.addClass("animatemargin");

    if (searchController.mainDraggedElement) {
        searchController.mainDraggedElement.draggable("disable").removeClass("ui-disabled ui-state-disabled");
        searchController.mainDraggedElement = null;
    }


    $(that).css("opacity", "1")
    setTimeout(function () {
        $("#searchlist li").simulate("mouseup");
    }, 0)
    if (uiController.startedSortPlaylistOpenedPanel)
        setTimeout(function () {
            uiController.toggleSidePanel();
        }, 1000)

    if (uiController.startedSortPlaylist) {
        playlistController.sortPlaylist = true;
        playlistController.ui.toggleSortablePlaylist();
        uiController.startedSortPlaylist = false;
    }
    uiController.draggingSong = false;
    playlistController.selection.updateDeselectedSong();

    uiController.swipeTimer = Date.now();

}