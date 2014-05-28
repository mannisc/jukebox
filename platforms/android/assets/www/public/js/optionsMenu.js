/**
 * optionsMenu.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 08.05.14 - 19:46
 * @copyright munichDev UG
 */


var optionsMenu = function () {

};


optionsMenu.options = [
    {text: "", callback: null}
]


//Playlist

optionsMenu.openPlaylistOptions = function (event, positionTo) {

    if (event)
        event.stopPropagation();

    optionsMenu.options = [
        {text: "Play", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                var playlist = playlistController.getLoadedPlaylist();
                if(playlist&&playlist.tracks.length>0)
                 playlistController.playSongList(playlist.tracks);
            }, 150)
        }},
        {text: "Play next", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                var playlist = playlistController.getLoadedPlaylist();
                if(playlist&&playlist.tracks.length>0)
                 playlistController.playSongListNext(playlist.tracks);
            }, 150)
        }},
        {text: "Add to Playlist", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                var playlist = playlistController.getLoadedPlaylist();
                if(playlist&&playlist.tracks.length>0)
                playlistController.addSongListElementsToPlaylist(positionTo , playlist.tracks,"r");

            }, 150)
        }},
        {text: "Rename", callback: function () {
            optionsMenu.closePopup();
            playlistController.editedPlaylistTitle = "Rename Playlist";
            playlistController.editedPlaylist = jQuery.extend(true, {}, playlistController.getLoadedPlaylist());
            $scope.safeApply();
            setTimeout(function () {
                $("#popupTextInput").popup('open', {positionTo: "window", transition: 'pop'});
            }, 510)
        }}
    ]

    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", "r");
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "3px").css("margin-left", "-10px");

}


//Queue

optionsMenu.openQueueOptions = function (event, positionTo) {

    if (event)
        event.stopPropagation();

    optionsMenu.options = [
        {text: "Save as Playlist", callback: null},
        {text: "Clear Queue", callback: null}
    ]

    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", "r");
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "3px").css("margin-left", "-10px");

}


//Selection

/*
 optionsMenu.getSongFromListEvent = function(event){
 var song = null;
 var listElement = $(event.target).parents("li");
 if(listElement.length>0){
 song = listElement[0].dataset.song;
 if(song){
 song = JSON.parse(song);
 }
 }


 return song;


 }  */

optionsMenu.openSearchListSelectionOptions = function (event, positionTo) {

    if (event)
        event.stopPropagation();


    // var song = optionsMenu.getSongFromListEvent(event);


    optionsMenu.options = [
        {text: "Play next", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                playlistController.playSelectionNext();
            }, 150)
        }},
        {text: "Create new Playlist", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                playlistController.loadNewPlaylistWithSelectedSongs();
            }, 150)
        }},

        {text: "Add to Playlist", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                playlistController.addSelectedElementsToPlaylist(positionTo);
            }, 150)
        }},
        {text: "Share with friends", callback: function () {
            optionsMenu.closePopup();


        }}

    ]

    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", "l");
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "7px").css("margin-left", "15px");


}


optionsMenu.openPlayListSelectionPlaylistOptions = function (event, positionTo) {

    if (event)
        event.stopPropagation();


    // var song = optionsMenu.getSongFromListEvent(event);


    optionsMenu.options = [
        {text: "Play next", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                playlistController.playSelectionNext();
            }, 150)
        }},

        {text: "Add to Playlist", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                playlistController.addSelectedElementsToPlaylist(positionTo);
            }, 150)
        }},
        {text: "Share with friends", callback: function () {
            optionsMenu.closePopup();


        }
        }

    ]

    //Only one Playlist Selected
    if (playlistController.selectedSongs.length == 1) {
        optionsMenu.options.push(
            {text: "Rename", callback: function () {
                console.dir(playlistController.selectedSongs[0])
                optionsMenu.closePopup();
                playlistController.editedPlaylistTitle = "Rename Playlist";

                playlistController.editedPlaylist = jQuery.extend(true, {},playlistController.selectedSongs[0].song);
                $scope.safeApply();
                setTimeout(function () {
                    $("#popupTextInput").popup('open', {positionTo: "window", transition: 'pop'});
                }, 510)
            }}
        )
    }


    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", "l");
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "7px").css("margin-left", "15px");


}


optionsMenu.openPlayListSelectionSongOptions = function (event, positionTo) {

    if (event)
        event.stopPropagation();


    // var song = optionsMenu.getSongFromListEvent(event);


    optionsMenu.options = [
        {text: "Play next", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                playlistController.playSelectionNext();
            }, 150)
        }},
        {text: "Add to Playlist", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                playlistController.addSelectedElementsToPlaylist(positionTo);
            }, 150)
        }},
        {text: "Share with friends", callback: function () {
            optionsMenu.closePopup();


        }}

    ]

    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", "l");
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "7px").css("margin-left", "15px");


}


/**
 * Open Dialog to choose playlist
 */
optionsMenu.openChoosePlaylist = function (positionTo, listToAdd,arrowDirection) {

    if (event)
        event.stopPropagation();

    var addToList = function (playlist) {
        if (listToAdd.length > 0) {
            playlistController.addSongsToPlaylist(playlist, listToAdd);
        }
        playlistController.deselectSongs();
    }


    var add = function (index) {
        return function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                addToList(playlistController.playlists[index])
            }, 150);
        }
    };
    // var song = optionsMenu.getSongFromListEvent(event);
    optionsMenu.options = [];
    for (var i = 0; i < playlistController.playlists.length; i++) {
        if (playlistController.playlists[i].gid != playlistController.currentQueue.gid) {
            var callback = add(i);
            optionsMenu.options.push({text: playlistController.playlists[i].name, callback: callback})
        }
    }
    //Add Current Queue add end, because its most unlikely  to be choosen
    callback = add(playlistController.getPlaylistIndexFromId(playlistController.currentQueue.gid));
    optionsMenu.options.push({text: playlistController.currentQueue.name, callback: callback, currentQueue: true})


    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", arrowDirection);
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    if(arrowDirection=="r")
        $("#popupOptions-popup").css("margin-top", "3px").css("margin-left", "-10px");
    else
    $("#popupOptions-popup").css("margin-top", "").css("margin-left", "18px");

}

//Search Results

optionsMenu.openArtistResultsOptions = function (event, positionTo) {

    if (event)
        event.stopPropagation();

    optionsMenu.options = [
        {text: "Play Artists Songs", callback: null} ,
        {text: "Add Songs to Playlist", callback: null},
        {text: "Create new Playlist", callback: null}

    ]

    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", true);
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "").css("margin-left", "1px");

}


optionsMenu.openPlaylistResultsOptions = function (event, positionTo) {

    if (event)
        event.stopPropagation();

    optionsMenu.options = [
        {text: "Play Playlist Songs", callback: null} ,
        {text: "Add Playlists to Play Queue", callback: null},
        {text: "Add to own Playlist", callback: null},
        {text: "Add as new Playlist", callback: null},
        {text: "Select All", callback: null}

    ]

    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", true);
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "").css("margin-left", "1px");


}

/**
 * Menu for all Songs in Searchlist
 * @param event
 * @param positionTo
 */

optionsMenu.openSongResultsOptions = function (event, positionTo) {

    if (event)
        event.stopPropagation();

    optionsMenu.options = [

        {text: "Play Songs", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                var playlist = searchController.songs.searchResults;
                if(playlist&&playlist.length>0)
                    playlistController.playSongList(playlist.slice(0,searchController.maxResults));
            }, 150)
        }} ,
        {text: "Add Songs to Playlist", callback: function(){
            optionsMenu.closePopup();
            setTimeout(function () {
                var playlist = searchController.songs.searchResults;
                if(playlist&&playlist.length>0)
                    playlistController.addSongListElementsToPlaylist(positionTo , playlist.slice(0,searchController.maxResults),"l");

            }, 150)
        }},
        {text: "Create new Playlist", callback:  function () {
            optionsMenu.closePopup();
            var playlist = searchController.songs.searchResults||[];
            setTimeout(function () {
                if(playlist&&playlist.length>0)
                  playlistController.loadNewPlaylistWithSongs(playlist.slice(0,searchController.maxResults))
            }, 150)
        }}
        //,{text: "Select All", callback: null}


    ]

    //More Results can be displayed
    if (!searchController.isOnlyTypeDisplayed(1)) {
        optionsMenu.options.unshift({text: "Show all results", callback: null})
    }


    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", true);
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "").css("margin-left", "1px");


}


optionsMenu.openUserResultsOptions = function (event, positionTo) {

    if (event)
        event.stopPropagation();


    optionsMenu.options = [
        {text: "Show All Results", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                searchController.setShowMode(4);
            }, 150)
        }
        }
    ]

    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", true);
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "").css("margin-left", "1px");


}


optionsMenu.closePopup = function () {
    $("#popupOptions").popup('close');

}