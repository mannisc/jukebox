/** * searchController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 03.03.14 - 13:58
 * @copyright  */





var searchController = function () {

};

searchController.maxResults = 100;


searchController.searchSongsString = "";

searchController.searchResults = [];

searchController.searchResultsComplete = [];

searchController.searchCounter = 0;

searchController.buttonActive = 0;

searchController.showMode=0;

searchController.maxPopularSongPages = 2;
searchController.maxArtistSongPages = 2;
searchController.serverSearch = false;


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

    // uiController.searchListScroll.on("scrollStart",function(){
    //})
    searchController.searchTimeout = null;

    $("#searchinput").on("input", function () {

       if(searchController.searchTimeout)
           clearTimeout(searchController.searchTimeout)

        searchController.searchTimeout = setTimeout(function(){
            searchController.searchTimeout = null;
            $("#playlistInner .iScrollPlayIndicator").hide();
            $("#searchlist .iScrollPlayIndicator").hide();
            switch (searchController.buttonActive) {
                case 0:
                    searchController.searchMusic();
                    break;
                case 1:
                    searchController.filterMusic();
                    break;
                case 2:
                    searchController.filterMusic();
                    break;
            }
        },150)



    })

    $("#controlbar .ui-input-clear").click(function () {
        switch (searchController.buttonActive) {


            case 1:
                searchController.removeFilterSongs();
                break;
            case 2:
                searchController.removeFilterSongs();
                break;
            default:
                searchController.emptySearchList();
                searchController.searchMusic();
                break;
        }
    })


    /*
     for (var i = 0; i < 4; i++) {
     // searchController.searchButtons[i] =   $("#searchbutton"+(i+1)).parent().clone(true,true);
     console.log($("#searchbutton" + (i + 1)).parent().length)
     }
     */

    searchController.activateButton(0, true);
    if (!urlParams.search || urlParams.search == "") {
        searchController.showPopulars();
    }

    setTimeout(function () {
        uiController.searchListScroll.refresh();
    }, 150)

    searchController.playIndicator = $('<div class="iScrollPlayIndicator fadeincomplete" ' +
        'style="box-sizing: border-box; ' +
        ' position: absolute;' +
        /*' background-color: rgba(245,245,245, 0.498039);' +
         ' border: 1px solid rgba(255, 255, 255, 0.901961);' +
         ' border-top-left-radius: 3px;' +
         ' border-top-right-radius: 3px;' +
         ' border-bottom-right-radius: 3px;' +
         ' border-bottom-left-radius: 3px;' +
         ' width: 100%;' +
         ' display: block; height: 9px;' +  */
        ' -webkit-transform: translate(0px, 0px)' +
        ' -moz-transform: translate(0px, 0px)' +
        ' -ms-transform: translate(0px, 0px)' +
        ' transform: translate(0px, 0px)' +
        ' translateZ(0px);' +
        ' background-position: initial initial;' +
        ' background-repeat: initial initial;' +
        ' display:none;"></div>'

    );


    searchController.playIndicator.appendTo("#searchlist .iScrollVerticalScrollbar");

    searchController.playIndicator.click(function () {
        uiController.searchListScroll.scrollToElement(".loadedsong", 700);
    });
    $(".iScrollIndicator").addClass("fadeincomplete");

}


searchController.activateButton = function (index, noAnimation) {
    if (searchController.buttonActive == 0) {
        searchController.searchSongsString = $("#searchinput").val();
    }
    searchController.buttonActive = index;
    searchController.emptySearchList(true);

    $("#playlistInner .iScrollPlayIndicator").hide();
    $("#searchlist .iScrollPlayIndicator").hide();


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


searchController.completeSearch = function (list, appendListInFront, searchID) {

    if (searchController.searchCounter == searchID) {

        uiController.searchListScroll.scrollTo(0, 0, 1000)
        var changed = false;
        if (searchController.searchResults.length == 0) {
            changed = true;
        }
        else if (list.track) {
            if (list.track.length != searchController.searchResults.length) {
                changed = true;
            }
            else {
                for (var i = 0; i < searchController.searchResults.length; i++) {
                    if (mediaController.getSongArtist(searchController.searchResults[i]) != mediaController.getSongArtist(list.track[i])) {
                        changed = true;
                        break;
                    }
                    if (searchController.searchResults[i].name != list.track[i].name) {
                        changed = true;
                        break;
                    }
                }
            }
        }
        if (changed) {
            if (appendListInFront) {
                for (var j = 0; j < appendListInFront.length; j++) {
                    for (i = 0; i < list.track.length; i++) {
                        if (mediaController.getSongDisplayName(list.track[i]) == mediaController.getSongDisplayName(appendListInFront[j])) {
                            list.track.splice(i, 0);
                        }

                    }
                }
                searchController.searchResults = appendListInFront;
                var anzSongs = searchController.searchResults.length;

            }
            else {
                searchController.searchResults = [];
                anzSongs = 0;
            }

            $scope.safeApply();
            var num = 1;
            if (list.track.length) {
                num = Math.min(searchController.maxResults, list.track.length);

                for (i = anzSongs; i < num + anzSongs; i++) {
                    searchController.searchResults[i] = list.track[i - anzSongs];
                }
                if (appendListInFront)
                    searchController.searchResultsComplete = appendListInFront.concat(list.track);
                else
                    searchController.searchResultsComplete = list.track;


            }
            else {
                searchController.searchResults[anzSongs] = list.track;
                searchController.searchResultsComplete = [];
                searchController.searchResultsComplete[anzSongs] = list.track[0];
            }

            for (i = 0; i < searchController.searchResults.length; i++) {
                searchController.searchResults[i].id = "slsid" + helperFunctions.padZeros(i, ("" + searchController.searchResults.length).length);
            }


            $scope.safeApply();
            $("#searchlistview").listview('refresh');

            playbackController.remarkSong();


            searchController.makeSearchListDraggable();
            setTimeout(function () {
                $("#searchlistview li").removeClass("fadeincompletefast");


            }, 100)
            setTimeout(function () {
                uiController.searchListScroll.refresh();

            }, 1000)
        }
    }
}

searchController.filterMusic = function () {
    if ($("#searchinput").val() && $("#searchinput").val() != "") {
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
    }
}

searchController.removeFilterSongs = function () {
    uiController.searchListScroll.scrollTo(0, 0, 1000)
    searchController.searchResults = [];
    $scope.safeApply();
    var num = Math.min(searchController.maxResults, searchController.searchResultsComplete.length);
    for (var i = 0; i < num; i++) {
        searchController.searchResults[i] = searchController.searchResultsComplete[i];
    }

    for (var i = 0; i < searchController.searchResults.length; i++) {
        searchController.searchResults[i].id = "slsid" + helperFunctions.padZeros(i, ("" + searchController.searchResults.length).length);
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


searchController.filterSongs = function (filterTerm) {

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
                // console.dir(searchController.searchResults[icounter]);
                icounter++;
            }
        }
        if (searchController.searchResults.length != newSearchResults.length) {
            changed = true;
        }
        else {
            for (var i = 0; i < searchController.searchResults.length; i++) {
                if (mediaController.getSongArtist(searchController.searchResults[i]) != mediaController.getSongArtist(newSearchResults[i])) {
                    changed = true;
                    break;
                }
                if (searchController.searchResults[i].name != newSearchResults[i].name) {
                    changed = true;
                    break;
                }
            }
        }
    }
    if (changed) {
        searchController.searchResults = [];
        $scope.safeApply();
        var num = Math.min(searchController.maxResults, newSearchResults.length);
        for (var i = 0; i < num; i++) {
            searchController.searchResults[i] = newSearchResults[i];
        }
        for (var i = 0; i < searchController.searchResults.length; i++) {
            searchController.searchResults[i].id = "slsid" + helperFunctions.padZeros(i, ("" + searchController.searchResults.length).length);
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


searchController.showPopulars = function () {
    if (searchController.preloadedPopularSongs)
        setTimeout(function () {
            searchController.completeSearch(searchController.preloadedPopularSongs, null, searchController.searchCounter)
        }, 500)
    else {

        setTimeout(function () {

            searchController.searchCounter++;
            function search(searchID) {
                searchController.topTracks(function (list) {
                    searchController.completeSearch(list, null, searchID)
                });
            }

            search(searchController.searchCounter);


        }, 500)

    }
}

searchController.emptySearchList = function (dontInitFully) {
    searchController.searchCounter++;
    searchController.showLoading(false);
    searchController.searchResults = [];
    $scope.safeApply();

    $("#searchlistview").listview('refresh');
    $("#searchlist .iScrollPlayIndicator").hide();
    playbackController.positionPlayIndicatorAtTop(true);


    setTimeout(function () {
        uiController.searchListScroll.refresh();
    }, 0)

    if (!dontInitFully) {
        searchController.makeSearchListDraggable();
        setTimeout(function () {
            $("#searchlistview li").removeClass("fadeincompletefast");
        }, 100)
    }
}

searchController.showSearchList = function () {
    searchController.searchMusic();
}

searchController.showSuggestions = function () {
    setTimeout(function () {
        var index;
        var song;
        if (mediaController.currentvideoURL != "") {
            song = playbackController.getPlayingSong();
        }
        else {
            if (playlistController.loadedPlaylistSongs.length > 0) {
                index = Math.round(Math.random() * (playlistController.loadedPlaylistSongs.length - 1));

                song = playlistController.loadedPlaylistSongs[index];
            }
            else if (searchController.searchResults.length > 0) {
                index = Math.round(Math.random() * (searchController.searchResults.length - 1));
                song = searchController.searchResults[index];
            }
        }
        searchController.searchCounter++;
        function search(searchID) {
            if (song) {
                searchController.suggestions(song.name, mediaController.getSongArtist(song), function (list) {
                    searchController.completeSearch(list, null, searchID)
                });
            }
            else {
                searchController.topTracks(function (list) {
                    searchController.completeSearch(list, null, searchID)
                });
            }
        }

        search(searchController.searchCounter);


    }, 500)

}


searchController.showPlaylists = function () {


}


searchController.searchArtistSongs = function (artist) {
    $("#searchinput").val(artist);
    searchController.searchSongsString = artist;
    searchController.activateButton(0);
    searchController.searchCounter++;
    function search(searchID) {
        searchController.searchSongsFromArtist(artist, function (list) {
            searchController.completeSearch(list, [playbackController.playingSong], searchID)
        });
    }

    search(searchController.searchCounter);

}


searchController.searchSimilarSongs = function (song) {

    searchController.activateButton(2);

    searchController.searchCounter++;
    function search(searchID) {
        searchController.suggestions(song.name, mediaController.getSongArtist(song), function (list) {
            searchController.completeSearch(list, [playbackController.playingSong], searchID)
        });
    }

    search(searchController.searchCounter);

}


searchController.searchMusic = function () {

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
                time = 300;
        }

        setTimeout(function () {
            if (searchController.lastSearchedTerm != searchController.lastSearchTerm) {
                if (!searchController.autoSearchTimer || Date.now() - searchController.autoSearchTimer > time) {
                    searchController.autoSearchTimer = Date.now();
                    searchController.lastSearchedTerm = searchController.lastSearchTerm;
                    searchController.searchCounter++;
                    function search(searchID) {
                        searchController.searchSongs(searchController.lastSearchTerm, "", "", function (list) {
                            searchController.completeSearch(list, null, searchID)
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
                searchController.searchSongs(searchController.lastSearchTerm, "", "", function (list) {
                    searchController.completeSearch(list, null, searchID)
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


searchController.searchSongs = function (searchString, title, artist, callbackSuccess) {
    searchController.showLoading(true);

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
                /*alert(xhr.status);
                 alert(thrownError); */
                console.dir("ERROR!");
                console.dir(xhr.responseText);

                setTimeout(searchController.showLoading, 1000); //show=false

            }

        })
    }

    $.ajax({
        url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + searchString + "&page=1&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
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

    for (var i = 0; i < searchController.searchResults.length; i++) {
        if (searchController.searchResults[i].id == id) {
            return searchController.searchResults[i];
        }
    }
    return null;

}


/**
 * Set show Mode of search list ( details or all types)
 * @param showMode
 */
searchController.setShowMode    = function(showMode){

    searchController.showMode = showMode;
    $scope.safeApply();
    $("#searchlistview").listview('refresh');
    $("#searchlist .iScrollPlayIndicator").hide();
    playbackController.positionPlayIndicator();

    setTimeout(function () {
        uiController.searchListScroll.refresh();
    }, 1000)


}

/**
 * Make  Searchlist Drag and Droppable
 */
searchController.dragDraggableSongTimer = 0;
searchController.makeSearchListDraggable = function () {

    $("#searchlist li").on("mousedown",function (event) {
        $("body").on("mouseup ", function () {
            $("body").off("mouseup");
            setTimeout(function () {
                uiController.swiping = false;
                playlistController.dragDraggableSongY = 0;
            }, 50)
        })

        if ($(this).parents("#searchlist").length == 0)
            return;
        if (!searchController.dragDraggableLastSongTimer || Date.now() - searchController.dragDraggableLastSongTimer > 500) {
            searchController.dragDraggableSongX = event.clientX;
            searchController.dragDraggableSongY = event.clientY;
            searchController.dragDraggableSongTimer = Date.now();
            searchController.dragDraggableSongStartEvent = event;
            searchController.dragDraggableSongStartElement = this;
            uiController.swiping = false;

        } else
            searchController.dragDraggableSongTimer = 0;
    }).on("mouseup ",function (event) {
            if ($(this).parents("#searchlist").length == 0)
                return;
            if (uiController.swiping || (searchController.dragDraggableSongY > 0 && Math.abs(event.clientY - searchController.dragDraggableSongY) > 30)) {
                uiController.swipeTimer = Date.now();
                searchController.dragDraggableSongY = -10;
            }
            searchController.dragDraggableSongTimer = 0;
            uiController.swiping = false;
            searchController.dragDraggableSongY = 0;

        }).on("mousemove", function (event) {

            if ($(this).parents("#searchlist").length == 0)
                return;
            if (uiController.swiping || (searchController.dragDraggableSongY > 0 && Math.abs(event.clientY - searchController.dragDraggableSongY) > 30)) {
                searchController.dragDraggableSongY = -10;
                uiController.swiping = true;
                uiController.swipeTimer = Date.now();
            } else if (searchController.dragDraggableSongTimer && Date.now() - searchController.dragDraggableSongTimer < 500 && Date.now() - searchController.dragDraggableSongTimer > 1) {
                if (!uiController.draggingSong && event.clientX - searchController.dragDraggableSongX > 0 && Math.abs(event.clientY - searchController.dragDraggableSongY) < Math.abs(event.clientX - searchController.dragDraggableSongX) * 0.8) {
                    uiController.draggingSong = true;
                    searchController.dragDraggableSongY = -10;
                    searchController.dragDraggableLastSongTimer = Date.now();
                    searchController.dragDraggableSongTimer = 0;


                    //Playlists are displayed
                    if (playlistController.playlistMode) {
                        $("#searchlistview .draggableSong").draggable("option", "connectToSortable", "");
                        $("#playlistview").addClass("dragging")
                        var delay = 150;

                    }else {
                        $("#searchlistview .draggableSong").draggable("option", "connectToSortable", "#playlistview");
                        delay = 0;
                    }

                    $("#searchlistview .draggableSong").draggable("enable");

                    if (!uiController.sidePanelOpen && uiController.windowWidth < uiController.responsiveWidthSmallest) {
                        uiController.startedSortPlaylistOpenedPanel = true;
                        uiController.toggleSidePanel();
                        delay = delay + 150;

                    } else {
                        uiController.startedSortPlaylistOpenedPanel = false;
                    }

                    var coords = {
                        clientX: searchController.dragDraggableSongStartEvent.clientX,
                        clientY: searchController.dragDraggableSongStartEvent.clientY
                    };
                    $(searchController.dragDraggableSongStartElement).simulate("mouseup", coords);

                    setTimeout(function () {
                        if (!playlistController.sortPlaylist && (!playlistController.playlistMode || playlistController.playlists.length == 0)) {
                            playlistController.toggleSortablePlaylist();

                            uiController.startedSortPlaylist = true;

                        } else
                            uiController.startedSortPlaylist = false;
                        $(".sortable").sortable("enable");

                        $(searchController.dragDraggableSongStartElement).simulate("mousedown", coords);

                    }, delay)
                }
            }
        })


    if (app.isCordova)
        return;


    $('#searchlistview .draggableSong').draggable({
        tolerance: "pointer",
        dropOnEmpty: true,
        revert: false,

        //   containment: "body",
        connectToSortable: '#playlistview',

        helper: function (event, ui) {
            $("#songOptions").appendTo("body").hide();


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

            playlistController.draggedElement = ele.find("li[data-songid='" + $(this).data("songid") + "'] ");
            $(".songlist").addClass("nohover");

            ele.css("opacity", "0");

            //var marquee = $(ele).find("marquee").get(0);
            // $(marquee).replaceWith($(marquee).contents());
            setTimeout(function () {
                var eleParent = $(playlistController.draggedElements.get(0)).parent();
                eleParent.attr('style', eleParent.attr('style') + '; ' + "margin-top:" + (-(playlistController.draggedElement.offset().top - playlistController.draggedElements.offset().top)) + "px" + ' !important');
                eleParent.css("opacity", "1");
            }, 0);
            return ele;
        }, drag: function (event, ui) {
            return !uiController.stopDrag;
        },
        start: function (event) {
            playlistController.hideSongOptions();

            //setTimeout(function () {debugger}, 3000)

            uiController.draggingSong = true;
            uiController.dragSongX = event.clientX;
            uiController.dragSongY = event.clientY;
            uiController.dragSongCheckHorizontal = true;
            uiController.dragSongCheckHorizontalTimer = Date.now();


            $(".draggedsearchlistelement").off();
            $(".draggedsearchlistelement").on('mousemove', playlistController.scrollByDragCallback);
            $(".draggedsearchlistelement").on('wheel', playlistController.scrollByWheel);
            $(".draggedsearchlistelement").on('mousewheel', playlistController.scrollByWheel);
            $(".draggedsearchlistelement").on('DOMMouseScroll', playlistController.scrollByWheel);

        },
        stop: function (event, ui) {

            if (playlistController.playlistMode && playlistController.playlists.length > 0) {
                $(".draggedlistelement").remove();
                var x = event.clientX, y = event.clientY,
                    elementMouseIsOver = document.elementFromPoint(x, y);
                var listElement = $(elementMouseIsOver).parents("li")

                if (listElement && listElement.parents("#playlistInner").length > 0) {


                    if (listElement.hasClass("playlistsong")) {
                        var playlist = playlistController.getPlaylistFromId(listElement.data("songgid").substring(12))
                        var newPlaylist = false;

                    } else if (listElement.hasClass("currentqueue")) {

                        var playlist = playlistController.currentQueue;
                        var newPlaylist = false;


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

                            if ($(listElement).data("songid")) {

                                var songid = $(listElement).data("songid").substring(10)
                                var song = searchController.getSongFromId(songid)
                                if (song) {
                                    var actSong = jQuery.extend(true, {}, song);
                                    actSong.gid = playlistController.getNewID();//"plsgid" + playlistController.globalId;
                                    actSong.id = "plsid" + helperFunctions.padZeros(playlist.tracks.length, ("" + playlistController.loadedPlaylistSongs.length).length);
                                    actSong.playlistgid = playlist.gid;

                                    playlist.tracks.push(actSong)
                                }
                            }
                        })

                        var position = playlistController.getPlaylistPosition(playlist.gid);
                        if (position > -1) {
                            accountController.savePlaylist(playlist, position)
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
                    if (listElement.hasClass("playlistsong") || listElement.hasClass("currentqueue")) {
                        listElement.removeClass("hoverable")

                        listElement.addClass("addedsongs")
                        setTimeout(function () {
                            listElement.removeClass("addedsongs")
                            setTimeout(function () {
                                listElement.addClass("hoverable")
                            }, 200)
                        }, 2000)

                    }

                }


            }

            $("#playlistview").removeClass("dragging")
            $(".songlist").removeClass("nohover");

            var ele = $(playlistController.draggedElements.get(0)).parent();
            ele.attr('style', ele.attr('style') + '; ' + "margin-top:0px" + ' !important');
            ele.addClass("animatemargin");

            $("#searchlistview .draggableSong").draggable("disable").removeClass("ui-disabled ui-state-disabled");
            uiController.draggingSong = false;
            $(this).css("opacity", "1")
            setTimeout(function () {
                $("#searchlist li").simulate("mouseup");
            }, 0)
            if (uiController.startedSortPlaylistOpenedPanel)
                setTimeout(function () {
                    uiController.toggleSidePanel();
                }, 500)

            if (uiController.startedSortPlaylist) {
                playlistController.toggleSortablePlaylist();
                uiController.startedSortPlaylist = false;
            }

            uiController.swipeTimer = Date.now();
        },
        appendTo: 'body',
        zIndex: "1000000" //or greater than any other relative/absolute/fixed elements and droppables
    });

    $("#searchlistview .draggableSong").draggable("disable").removeClass("ui-disabled ui-state-disabled");

}


/*
 var func = function(){
 alert(1000);
 }

 var func2 = function(){
 alert(1000);
 }
 var func3 = function(){
 alert(1000);
 }

 setTimeout(func,0)
 setTimeout(func2,0)
 setTimeout(func3,0)



 console.log("sfdsfsdfsf")
 console.dir(this)

 */