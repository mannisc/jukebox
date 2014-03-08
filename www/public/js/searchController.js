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

searchController.init = function () {

    $("#searchinput").on("input", function () {
        switch(searchController.buttonActive){
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

    searchController.activateButton(0,true);
    searchController.showPopulars();

}


searchController.activateButton = function (index,noAnimation) {
    if(searchController.buttonActive ==0){
        searchController.searchSongsString = $("#searchinput").val();
    }
    searchController.buttonActive= index;
    searchController.emptySearchList(true);

    if(index==1||index==2){
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
    if(!noAnimation)
        input.css("width", button.width())
    setTimeout(function () {
        if(!noAnimation)
          input.addClass("animated")

        input.css("width", "")
        setTimeout(function () {
        input.find("input").focus();
        }, 500)

        uiController.toggleSearchButton(index+1);

    }, 60)

    switch(index){
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


searchController.completeSearch = function (list) {

    uiController.searchListScroll.scrollTo(0, 0, 1000)
    var changed = false;
    if (searchController.searchResults.length == 0) {
        changed = true;
    }
    else {
        if(list.track.length!=searchController.searchResults.length){
            changed = true;
        }
        else{
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
        searchController.searchResults = [];
        $scope.safeApply();
        var num = Math.min(searchController.maxResults,list.track.length);

        for (var i = 0; i < num; i++) {
              searchController.searchResults[i] = list.track[i];
        }
        searchController.searchResultsComplete = list.track;
        for (var i = 0; i < searchController.searchResults.length; i++) {
            searchController.searchResults[i].id = "slsid" + helperFunctions.padZeros(i, ("" + searchController.searchResults.length).length);
        }


        $scope.safeApply();
        $("#searchlistview").listview('refresh');

        uiController.searchListScroll.refresh();
        uiController.makeSearchListDraggable();
        setTimeout(function () {
            $("#searchlistview li").removeClass("fadeincompletefast");
        }, 100)
    }
}

searchController.filterMusic = function(){
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

searchController.removeFilterSongs  = function (filterTerm){
    uiController.searchListScroll.scrollTo(0, 0, 1000)
    searchController.searchResults = [];
    $scope.safeApply();
    var num = Math.min(searchController.maxResults,searchController.searchResultsComplete.length);
    for (var i = 0; i < num; i++) {
        searchController.searchResults[i] = searchController.searchResultsComplete[i];
    }

    for (var i = 0; i < searchController.searchResults.length; i++) {
        searchController.searchResults[i].id = "slsid" + helperFunctions.padZeros(i, ("" + searchController.searchResults.length).length);
    }
    $scope.safeApply();
    $("#searchlistview").listview('refresh');

    uiController.searchListScroll.refresh();
    uiController.makeSearchListDraggable();
    setTimeout(function () {
        $("#searchlistview li").removeClass("fadeincompletefast");
    }, 100)
}


searchController.filterSongs  = function (filterTerm){

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
            title  = searchController.searchResultsComplete[i].name;
            artist = artist.toLowerCase();
            title  = title.toLowerCase();

            if (title.search(filterTerm) > -1 || artist.search(filterTerm) > -1){
                newSearchResults[icounter] = searchController.searchResultsComplete[i];
                console.dir(searchController.searchResults[icounter]);
                icounter++;
            }
        }
        console.dir("LENGTH: "+searchController.searchResults.length);
        if(searchController.searchResults.length != newSearchResults.length){
            changed = true;
        }
        else{
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
        var num = Math.min(searchController.maxResults,newSearchResults.length);
        for (var i = 0; i < num; i++) {
            searchController.searchResults[i] = newSearchResults[i];
        }
        for (var i = 0; i < searchController.searchResults.length; i++) {
            searchController.searchResults[i].id = "slsid" + helperFunctions.padZeros(i, ("" + searchController.searchResults.length).length);
        }
        $scope.safeApply();
        $("#searchlistview").listview('refresh');

        uiController.searchListScroll.refresh();
        uiController.makeSearchListDraggable();
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
    uiController.searchListScroll.refresh();

    if(!dontInitFully){
        uiController.makeSearchListDraggable();
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
        if (playlistController.loadedPlaylistSongs.length > 0) {
            index = Math.round(Math.random() * (playlistController.loadedPlaylistSongs.length - 1));

            song = playlistController.loadedPlaylistSongs[index];
        }
        else if (searchController.searchResults.length > 0) {
            index = Math.round(Math.random() * (searchController.searchResults.length - 1));
            song = searchController.searchResults[index];
        }
        if (song) {
            searchController.suggestions(song.name, mediaController.getSongArtist(song), searchController.completeSearch);
        }
        else {
            searchController.topTracks(searchController.completeSearch);
        }
    }, 500)

}


searchController.searchMusic = function () {
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
        $.ajax({
            url: preferences.serverURL + "?searchjson=" + searchString,

            success: function (data) {
                if (searchID == searchController.SearchCounter) {
                    console.dir("Server Search Results:");
                    console.dir(data);
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
                    if (callbackSuccess)
                        callbackSuccess(data);
                }
            },
            complete: function () {
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
                            console.dir("Load: " + preferences.serverURL + "?searchjson=" + searchString);
                            searchserver(searchID);
                        }
                        else {
                            console.dir(data.results);
                            if (searchID == searchController.SearchCounter) {
                                setTimeout(searchController.showLoading, 1000);
                                if (callbackSuccess)
                                    callbackSuccess(data.results.trackmatches);
                            }

                        }


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
    func(searchID);
}

searchController.topTracks = function (callbackSuccess) {
    searchController.SearchCounter++;
    var searchID = searchController.SearchCounter;
    var func = function (searchID) {
        searchController.showLoading(true);
        $.ajax({
            url: "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
            success: function (data) {
                console.dir(data);
                if (data.tracks) {
                    if (data.tracks != "\n") {
                        if (searchID == searchController.SearchCounter) {
                            console.dir(data);
                            if (callbackSuccess)
                                callbackSuccess(data.tracks);
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

searchController.suggestions = function (title, artist, callbackSuccess) {
    searchController.showLoading(true);
    searchController.SearchCounter++;
    var searchID = searchController.SearchCounter;
    var func = function (searchID) {
        $.ajax({

            url: "http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=" + artist + "&track=" + title + "&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
            success: function (data) {
                console.dir(data);
                if (data.similartracks) {
                    if (data.similartracks != "\n") {
                        if (searchID == searchController.SearchCounter) {
                            console.dir(data.similartracks);
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