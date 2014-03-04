/** * searchController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 03.03.14 - 13:58
 * @copyright  */


var searchController = function () {

};

searchController.startSearch = function (searchString) {


    var complete = function (list) {

        console.log(JSON.stringify(list))
        console.dir(list.track)

        //$("#searchlistview").hide();
        $scope.searchResults = list.track;


        $scope.safeApply();
        $("#searchlistview").listview('refresh');

        //  $("#searchlistview").show();
        uiController.searchListScroll.refresh();
        uiController.makeSearchListDraggable();
        setTimeout(function () {
            $("#searchlistview li").removeClass("fadeincompletefast");
        }, 100)

    }

    searchController.search(searchString, complete);
}

searchController.init = function () {

    $("#searchinput").on("input", function () {
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

    })

}

searchController.initSearch = function () {


    searchController.search($("#searchinput").val());


}


searchController.search = function (searchString, callback) {

    searchController.searchSongs(searchString, "", "", callback);
}


searchController.searchSongs = function (searchString, title, artist, callbackSuccess) {

    var list = [];

    //list.push({a:"b"})


    list.unshift();


    $.ajax({
        url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + searchString + "&page=1&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&format=json",
        success: function (data) {

            if (data.results && data.results.trackmatches) {
                if (data.results.trackmatches == "\n") {

                    console.dir("Load " + preferences.serverURL + "?searchjson=" + searchString);
                    $.ajax({
                        url: preferences.serverURL + "?searchjson=" + searchString,

                        success: function (data) {
                            console.dir(data);
                            if (data.results && data.results) {
                                console.dir(data.results);
                                if (callbackSuccess)
                                    callbackSuccess(data.results);

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