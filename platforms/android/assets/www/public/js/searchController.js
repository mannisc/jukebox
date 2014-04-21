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

searchController.SearchCounter = 0;

searchController.buttonActive = 0;

searchController.maxPopularSongPages = 2;
searchController.maxArtistSongPages = 2;
searchController.serverSearch = false;


searchController.init = function () {

    $("#searchinput").on("input", function () {
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

    })

    for (var i = 0; i < 4; i++) {
        // searchController.searchButtons[i] =   $("#searchbutton"+(i+1)).parent().clone(true,true);
        console.log($("#searchbutton" + (i + 1)).parent().length)
    }

    searchController.activateButton(0, true);
    if (!urlParams.search || urlParams.search == "") {
        searchController.showPopulars();
    }





}


searchController.activateButton = function (index, noAnimation) {
    if (searchController.buttonActive == 0) {
        searchController.searchSongsString = $("#searchinput").val();
    }
    searchController.buttonActive = index;
    searchController.emptySearchList(true);
    $("#playlistInner .iScrollPlayIndicator").hide();
    $("#searchlist .iScrollPlayIndicator").hide();

    if (index == 1 || index == 2) {
        searchController.showLoading(true);
    }
    var input = $("#searchinput").parent();
    var oIndex = input.data("button");
    if (oIndex) {
        var oButton = $("#searchbutton" + oIndex).parent();
        oButton.show();
        var width = oButton.width();
        oButton.removeClass("animated")
        oButton.css("width", input.width());

        setTimeout(function () {
            oButton.addClass("animated")
            oButton.css("width", width)

        }, 50)
    }
    input.data("button", index + 1);

    var button = $("#searchbutton" + (index + 1)).parent();

    input.removeClass("animated")
    if (!noAnimation)
        input.css("width", button.width())
    setTimeout(function () {
        if (!noAnimation)
            input.addClass("animated")

        input.css("width", "")
        setTimeout(function () {
            input.find("input").focus();
        }, 500)

        uiController.toggleSearchButton(index + 1);

    }, 60)

    switch (index) {
        case 0:
            $("#searchinput").val(searchController.searchSongsString);
            $(input).insertAfter(button).find("input").attr("placeholder", "Search Songs");
            break;
        case 1:
            $("#searchinput").val("");
            $(input).insertAfter(button).find("input").attr("placeholder", "Filter Popular Songs");
            break;
        case 2:
            $("#searchinput").val("");
            $(input).insertAfter(button).find("input").attr("placeholder", "Filter Suggestions");
            break;
        case 3:
            $("#searchinput").val("");
            $(input).insertAfter(button).find("input").attr("placeholder", "Search Playlists");
            break;
    }


    button.hide();
}


searchController.completeSearch = function (list, appendListInFront) {

    uiController.searchListScroll.scrollTo(0, 0, 1000)
    var changed = false;
    if (searchController.searchResults.length == 0) {
        changed = true;
    }
    else {
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
        if(appendListInFront) {
            for ( var j = 0; j < appendListInFront.length; j++) {
                for ( i = 0; i < list.track.length; i++) {
                   if(mediaController.getSongDisplayName(list.track[i]) == mediaController.getSongDisplayName(appendListInFront[j]) ){
                       list.track.splice(i,0);
                   }

                }
            }
            searchController.searchResults = appendListInFront;
            var anzSongs =  searchController.searchResults.length;

        }
        else{
            searchController.searchResults = [];
            anzSongs = 0;
        }

        $scope.safeApply();
        var num = 1;
        if (list.track.length) {
            num = Math.min(searchController.maxResults, list.track.length);

            for ( i = anzSongs; i < num+anzSongs; i++) {
                searchController.searchResults[i] = list.track[i-anzSongs];
            }
            if(appendListInFront)
             searchController.searchResultsComplete = appendListInFront.concat(list.track);
            else
             searchController.searchResultsComplete = list.track;


        }
        else {
            searchController.searchResults[anzSongs] = list.track;
            searchController.searchResultsComplete = [];
            searchController.searchResultsComplete[anzSongs] = list.track[0];
        }

        for ( i = 0; i < searchController.searchResults.length; i++) {
            searchController.searchResults[i].id = "slsid" + helperFunctions.padZeros(i, ("" + searchController.searchResults.length).length);
        }

        console.log("----------------------")
        console.dir(searchController.searchResults)


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

    setTimeout(function () {
        searchController.topTracks(searchController.completeSearch);
    }, 500)

}

searchController.emptySearchList = function (dontInitFully) {
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
        if (song) {
            searchController.suggestions(song.name, mediaController.getSongArtist(song), searchController.completeSearch);
        }
        else {
            searchController.topTracks(searchController.completeSearch);
        }
    }, 500)

}

searchController.searchArtistSongs = function (artist) {
    $("#searchinput").val(artist);
    searchController.searchSongsString = artist;
    searchController.activateButton(0);
    searchController.searchSongsFromArtist(artist, function(list){
        searchController.completeSearch(list,[playbackController.playingSong])
    });

}

searchController.searchSimilarSongs = function (song) {

    searchController.activateButton(2);

    searchController.suggestions(song.name, mediaController.getSongArtist(song),function(list){
        searchController.completeSearch(list,[playbackController.playingSong])
    });
}


searchController.searchMusic = function () {
    if ($("#searchinput").val() && $("#searchinput").val() != "") {
        searchController.lastSearchTerm = $("#searchinput").val();
        var song = playbackController.getPlayingSong();
        if (song.name != "" && $("#searchinput").val() != "") {
            window.history.pushState("", document.title, "/?search=" + searchController.lastSearchTerm + "&artist=" + mediaController.getSongArtist(song) + "&title=" + song.name);
        }
        else {
            window.history.pushState("", document.title, "?search=" + searchController.lastSearchTerm);
        }
        if (searchController.serverSearch) {
            var time = 1500;
        }
        else {
            if (app.isCordova)
                var time = 1000;
            else
                time = 300;
        }

        setTimeout(function () {
            if (searchController.lastSearchedTerm != searchController.lastSearchTerm) {
                if (!searchController.autoSearchTimer || Date.now() - searchController.autoSearchTimer > time) {
                    searchController.autoSearchTimer = Date.now();
                    searchController.lastSearchedTerm = searchController.lastSearchTerm;
                    searchController.searchSongs(searchController.lastSearchTerm, "", "", searchController.completeSearch);
                }
            }
        }, time);

        if (!searchController.autoSearchTimer || Date.now() - searchController.autoSearchTimer > time) {
            searchController.autoSearchTimer = Date.now();
            searchController.lastSearchedTerm = searchController.lastSearchTerm;
            searchController.searchSongs(searchController.lastSearchTerm, "", "", searchController.completeSearch);
        }
    }
    else {
        searchController.emptySearchList();
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
    searchController.SearchCounter++;
    var searchID = searchController.SearchCounter;

    var searchserver = function (searchID) {
        console.dir(preferences.serverURL + "?searchjson=" + searchString + "&auth=" + authController.ip_token);
        $.ajax({
            url: preferences.serverURL + "?searchjson=" + searchString + "&auth=" + authController.ip_token,
            success: function (data) {
                console.dir("searchjson!!!!!!!!!!");
                console.dir(data);
                if (data.auth && data.auth == "true") {
                    authController.extractToken(data.token);
                    searchserver(searchID);
                }
                else {

                    if (searchID == searchController.SearchCounter) {
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
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
                console.dir("ERROR!");
                console.dir(xhr.responseText);
                if (searchID == searchController.SearchCounter) {
                    setTimeout(searchController.showLoading, 1000); //show=false
                }
            }

        })
    }
    var func = function (searchID) {
        $.ajax({
            url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + searchString + "&page=1&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
            success: function (data) {
                if (searchID == searchController.SearchCounter) {
                    if (data.results && data.results.trackmatches) {
                        if (data.results.trackmatches == "\n") {
                            searchController.serverSearch = true;
                            searchserver(searchID);
                        }
                        else {
                            searchController.serverSearch = false;
                            if (searchID == searchController.SearchCounter) {
                                setTimeout(searchController.showLoading, 1000);
                                if (callbackSuccess)
                                    callbackSuccess(data.results.trackmatches);
                            }

                        }
                    }
                    else {
                        searchController.serverSearch = true;
                        searchserver(searchID);
                    }
                }

            },
            error: function () {
                if (searchID == searchController.SearchCounter) {
                    searchController.serverSearch = true;
                    searchserver(searchID);
                }
            }
        })
    }
    func(searchID);
}


searchController.searchSongsFromArtist = function (artist, callbackSuccess) {
    searchController.showLoading(true);
    searchController.SearchCounter++;
    var searchString = artist;
    var searchID = searchController.SearchCounter;

    var searchserver = function (searchID) {
        $.ajax({
            url: preferences.serverURL + "?searchjson=" + searchString + "&auth=" + authController.ip_token,
            success: function (data) {
                if (data.auth && data.auth == "true") {
                    authController.extractToken(data.token);
                    searchserver(searchID);
                }
                else {
                    if (searchID == searchController.SearchCounter) {
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
                }
            },
            error: function () {
                if (searchID == searchController.SearchCounter) {
                    setTimeout(searchController.showLoading, 1000); //show=false
                }
            }

        })
    }
    var func = function (searchID, page, topresults) {
        $.ajax({

            url: "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + searchString + "&page=" + page + "&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
            success: function (data) {
                if (searchID == searchController.SearchCounter) {
                    var dataOK = false;
                    if (data.toptracks) {
                        if (data.toptracks == "\n" && page == 1) {
                            searchserver(searchID);
                        }
                        else {
                            dataOK = true;
                            if (page == 1) {
                                func(searchID, page + 1, data.toptracks.track);
                            }
                            else if (page < searchController.maxArtistSongPages) {
                                topresults = topresults.concat(data.toptracks.track);
                                func(searchID, page + 1, topresults);

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
                }
            },
            error: function () {
                if (searchID == searchController.SearchCounter) {
                    searchserver(searchID);
                }
            }
        })
    }
    func(searchID, 1, null);
}

searchController.topTracks = function (callbackSuccess) {


    //TODO TEEEMMMMMMPPPPPP for no Internet
    /* if (callbackSuccess)
     callbackSuccess( {track:   playlistController.NOINTERNETHACK});
     return;
     */


    searchController.SearchCounter++;
    var searchID = searchController.SearchCounter;
    var func = function (searchID, page, topresults) {
        searchController.showLoading(true);
        $.ajax({
            url: "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&page=" + page + "&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
            success: function (data) {
                if (searchID == searchController.SearchCounter) {
                    var dataOK = false;
                    if (data.tracks) {
                        if (data.tracks != "\n") {
                            dataOK = true;
                            if (page == 1) {

                                func(searchID, page + 1, data.tracks.track);
                            }
                            else if (page < searchController.maxPopularSongPages) {
                                topresults = topresults.concat(data.tracks.track);
                                func(searchID, page + 1, topresults);
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
                }
            }, complete: function () {
                setTimeout(searchController.showLoading, 1000);
            }
        })
    }
    func(searchID, 1, null);
}

searchController.suggestions = function (title, artist, callbackSuccess) {
    searchController.showLoading(true);
    searchController.SearchCounter++;
    var searchID = searchController.SearchCounter;
    var func = function (searchID) {
        $.ajax({

            url: "http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=" + artist + "&track=" + title + "&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
            success: function (data) {
                if (data.similartracks) {
                    if (data.similartracks != "\n") {
                        if (searchID == searchController.SearchCounter) {
                            if (callbackSuccess)
                                callbackSuccess(data.similartracks);
                        }

                    }
                }
            }, complete: function () {
                setTimeout(searchController.showLoading, 1000);
            }
        })
    }
    func(searchID);
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
 * Make  Searchlist Drag and Droppable
 */
searchController.dragDraggableSongTimer = 0;
searchController.makeSearchListDraggable = function () {

    $("#searchlist li").on("mousedown",function (event) {

        if ($(this).parents("#searchlist").length == 0)
            return;
        if (!searchController.dragDraggableLastSongTimer || Date.now() - searchController.dragDraggableLastSongTimer > 500) {
            searchController.dragDraggableSongX = event.clientX;
            searchController.dragDraggableSongY = event.clientY;
            searchController.dragDraggableSongTimer = Date.now();
            searchController.dragDraggableSongStartEvent = event;
        } else
            searchController.dragDraggableSongTimer = 0;
    }).on("mouseup ",function (event) {
            if ($(this).parents("#searchlist").length == 0)
                return;
            if (Math.abs(event.clientY - searchController.dragDraggableSongY) > 30) {
                uiController.swipeTimer = Date.now();
                searchController.dragDraggableSongY = -10;
            }
            searchController.dragDraggableSongTimer = 0;

        }).on("mousemove", function (event) {

            if ($(this).parents("#searchlist").length == 0)
                return;
            if (Math.abs(event.clientY - searchController.dragDraggableSongY) > 8)
                searchController.dragDraggableSongY = -10;
            if (searchController.dragDraggableSongY > 0 && Math.abs(event.clientY - searchController.dragDraggableSongY) > 30) {
                uiController.swipeTimer = Date.now();
            } else if (searchController.dragDraggableSongTimer && Date.now() - searchController.dragDraggableSongTimer < 500) {
                if (!uiController.draggingSong && event.clientX - searchController.dragDraggableSongX > 2 && Math.abs(event.clientY - searchController.dragDraggableSongY) < Math.abs(event.clientX - searchController.dragDraggableSongX) * 0.8) {
                    searchController.dragDraggableSongY = -10;
                    searchController.dragDraggableLastSongTimer = Date.now();
                    searchController.dragDraggableSongTimer = 0;

                    if (playlistController.loadedPlaylistSongs.length > 0 && playlistController.loadedPlaylistSongs[0].isPlaylist) {
                        $("#saveplaylistinpt").val("");
                        $("#saveokayplaylistbtn").attr("disabled", "disabled").css("opacity", "0.5");
                        playlistController.loadedPlaylistSongs = [];
                        $("#saveplaylistbtn img").attr("src", "public/img/save.png");
                        $scope.safeApply();
                        $("#clearChoosenPlaylists").show();
                    }

                    $("#searchlistview .draggableSong").draggable("enable");

                    if (!uiController.sidePanelOpen && uiController.windowWidth < uiController.responsiveWidthSmallest) {
                        uiController.startedSortPlaylistOpenedPanel = true;
                        uiController.toggleSidePanel();
                        var delay = 150;

                    } else {
                        uiController.startedSortPlaylistOpenedPanel = false;
                        delay = 0;
                    }

                    var that = this;
                    console.log(uiController.startedSortPlaylistOpenedPanel)
                    var coords = {
                        clientX: searchController.dragDraggableSongStartEvent.clientX,
                        clientY: searchController.dragDraggableSongStartEvent.clientY
                    };
                    $(that).simulate("mouseup", coords);

                    setTimeout(function () {

                        if (!uiController.sortPlaylist) {
                            uiController.toggleSortablePlaylist(true);
                            uiController.startedSortPlaylist = true;
                        } else
                            uiController.startedSortPlaylist = false;

                        $(that).simulate("mousedown", coords);

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
            $(this).addClass("selected");

            var $helper = $('<ul></ul>').addClass('songlist draggedlistelement draggedsearchlistelement');

            var elements = $("#searchlist li.selected").removeClass("selected").clone().removeClass("loadedsong playing pausing stillLoading");

            if (elements.length == 0) {
                elements = $(this).removeClass("selected").clone().removeClass("loadedsong playing pausing stillLoading");
                elements.removeClass("fadeslideincompletefast");
                elements.addClass("margintop");

            } else {
                elements.removeClass("fadeslideincompletefast");
                $(elements.get(0)).addClass("margintop");

            }

            var ele = $helper.append(elements)

            playlistController.draggedElements = elements;

            playlistController.draggedElement = ele.find("li[data-songid='" + $(this).data("songid") + "'] ");
            ele.css("opacity","0");


            //var marquee = $(ele).find("marquee").get(0);
            // $(marquee).replaceWith($(marquee).contents());

            return ele;
        }, drag: function (event, ui) {
            return !uiController.stopDrag;
        },
        start: function (event) {


          //  setTimeout(function () {debugger}, 3000)
            uiController.draggingSong = true;
            uiController.dragSongX = event.clientX;
            uiController.dragSongY = event.clientY;
            uiController.dragSongCheckHorizontal = true;
            uiController.dragSongCheckHorizontalTimer = Date.now();
            var ele = $(playlistController.draggedElements.get(0)).parent();
            setTimeout(function(){
                ele.attr('style', ele.attr('style') + '; ' + "margin-top:"+(-(playlistController.draggedElement.offset().top-playlistController.draggedElements.offset().top))+"px"+' !important');
                ele.css("opacity","1");
            },0)



            $(".draggedsearchlistelement").on('mousemove', function (event) {
                if (uiController.draggingSong) {

                    //console.log('X:' + (event.clientX-110) + ' Y: '+(event.clientY-30) );

                    if ($("#playlistInner").offset().top - $(".draggedsearchlistelement").offset().top > 10 && Math.abs($("#playlistInner").offset().left - $(".draggedsearchlistelement").offset().left) < 50) {
                        if (!uiController.playListScrollTimer || Date.now() - uiController.playListScrollTimer > 500) {
                            console.log(uiController.playListScroll.scrollY)
                            uiController.playListScrollTimer = Date.now()
                            uiController.playListScroll.enable();
                            uiController.playListScroll.refresh();
                            uiController.playListScroll.scrollBy(0, 100, 1000)

                        }

                    } else if ($("#playlistInner").offset().top + $("#playlistInner").height() - $(".draggedsearchlistelement").offset().top - $(".draggedsearchlistelement").height() < -10 && Math.abs($("#playlistInner").offset().left - $(".draggedsearchlistelement").offset().left) < 50) {
                        if (!uiController.playListScrollTimer || Date.now() - uiController.playListScrollTimer > 500) {
                            console.log(uiController.playListScroll.scrollY)
                            uiController.playListScrollTimer = Date.now()
                            uiController.playListScroll.enable();
                            uiController.playListScroll.refresh();
                            uiController.playListScroll.scrollBy(0, -100, 1000)
                        }

                    }

                }
            });


        },
        stop: function (event, ui) {
            var ele = $(playlistController.draggedElements.get(0)).parent();
            ele.attr('style', ele.attr('style') + '; ' + "margin-top:0px"+' !important');
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
                uiController.toggleSortablePlaylist();
                uiController.startedSortPlaylist = false;
            }


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