/** * searchController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 03.03.14 - 13:58
 * @copyright  */


var searchController = function () {

};


searchController.searchResults =[];

searchController.SearchCounter = 0;

searchController.completeSearch =  function (list) {

    searchController.searchResults = list.track;

    for(var i=0;i<searchController.searchResults.length;i++){
        searchController.searchResults[i].id = i;
    }



    $scope.safeApply();
    $("#searchlistview").listview('refresh');

    uiController.searchListScroll.refresh();
    uiController.makeSearchListDraggable();
    setTimeout(function () {
        $("#searchlistview li").removeClass("fadeincompletefast");
    }, 100)
}


searchController.startSearch = function (searchString) {
    var complete = searchController.completeSearch;
    searchController.search(searchString, complete);
}


searchController.showFavorites = function () {
    searchController.topTracks(searchController.completeSearch);


}

searchController.emptySearchList = function () {
    searchController.searchResults =[];
    searchController.SearchCounter = 0;
    $scope.safeApply();
    $("#searchlistview").listview('refresh');

    uiController.searchListScroll.refresh();
    uiController.makeSearchListDraggable();
    setTimeout(function () {
        $("#searchlistview li").removeClass("fadeincompletefast");
    }, 100)

}

searchController.showSuggestions = function () {
    var index;
    var song;
    if(playlistController.loadedPlaylistSongs.length > 0 ){
        index = Math.round(Math.random()*(playlistController.loadedPlaylistSongs.length-1));

        song = playlistController.loadedPlaylistSongs[index];
    }
    else if(searchController.searchResults.length > 0 ){
        index = Math.round(Math.random()*(searchController.searchResults.length-1));
        song = searchController.searchResults[index];
    }
    if(song){
        searchController.suggestions(song.name,mediaController.getSongArtist(song),searchController.completeSearch);
    }
    else
    {
        searchController.topTracks(searchController.completeSearch);
    }


}


searchController.init = function () {

    $("#searchinput").on("input", function () {
        if( $("#searchinput").val() && $("#searchinput").val() != ""){
            searchController.lastSearchTerm = $("#searchinput").val();
            setTimeout(function () {
                if (searchController.lastSearchedTerm != searchController.lastSearchTerm) {
                    if (!searchController.autoSearchTimer || Date.now() - searchController.autoSearchTimer > 300) {
                        searchController.autoSearchTimer = Date.now();
                        searchController.lastSearchedTerm = searchController.lastSearchTerm;
                        searchController.startSearch(searchController.lastSearchTerm)
                    }
                }
            }, 300);

            if (!searchController.autoSearchTimer || Date.now() - searchController.autoSearchTimer > 300) {
                searchController.autoSearchTimer = Date.now();
                searchController.lastSearchedTerm = searchController.lastSearchTerm;
                searchController.startSearch(searchController.lastSearchTerm)
            }
        }

    })

}







searchController.search = function (searchString, callback) {

    searchController.searchSongs(searchString, "", "", callback);
}


searchController.searchSongs = function (searchString, title, artist, callbackSuccess) {

    searchController.SearchCounter++;
    var searchID = searchController.SearchCounter;

    var func = function (searchID) {
        $.ajax({
            url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + searchString + "&page=1&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
            success: function (data) {
                if (searchID == searchController.SearchCounter) {
                    if (data.results && data.results.trackmatches) {
                        if (data.results.trackmatches == "\n") {

                            console.dir("Load " + preferences.serverURL + "?searchjson=" + searchString);
                            $.ajax({
                                url: preferences.serverURL + "?searchjson=" + searchString,

                                success: function (data) {
                                    if (searchID == searchController.SearchCounter) {
                                        console.dir(data);
                                        if (callbackSuccess)
                                             callbackSuccess(data);

                                    }
                                }

                            })
                        }
                        else {
                            console.dir(data.results);
                            if (callbackSuccess)
                                callbackSuccess(data.results.trackmatches);

                        }


                    }
                }

            }
        })
    }
    func(searchID);
}

searchController.topTracks = function (callbackSuccess) {
    $.ajax({
        url: "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
        success: function (data) {
            console.dir(data);
            if (data.tracks) {
                if (data.tracks != "\n") {
                    console.dir(data);
                    if (callbackSuccess)
                        callbackSuccess(data.tracks);

                }
            }
        }
    })
}

searchController.suggestions = function (title, artist, callbackSuccess) {
    console.dir("Search Suggestions...");
    $.ajax({

        url: "http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=" + artist + "&track=" + title + "&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
        success: function (data) {
            console.dir(data);
            if (data.similartracks) {
                if (data.similartracks != "\n") {
                    console.dir(data.similartracks);
                    if (callbackSuccess)
                        callbackSuccess(data.similartracks);

                }
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