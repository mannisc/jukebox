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


optionsMenu.beforeOpen = function () {
    $('#popupLoadingSong').popup('close');

    var searchContent = $("#searchcontent");
    if (searchContent.hasClass("isvisible"))
        searchContent.addClass("isvisiblepopup")

    var playlistInner = $("#playlistInner");
    if (playlistInner.hasClass("isvisible"))
        playlistInner.addClass("isvisiblepopup")

    uiController.checkIfListHintsNecessary();

    $("#popupOptions").bind({
        popupafterclose: function (event, ui) {
            $("#searchcontent, #playlistInner").removeClass("isvisiblepopup");
            uiController.checkIfListHintsNecessary();

        }
    });


}


optionsMenu.closePopup = function () {
    jqmAllowPopUpClosing = true;
    $("#popupOptions").popup('close');

}

//Playlist

optionsMenu.openPlaylistOptions = function (event, positionTo) {
    optionsMenu.beforeOpen();
    if (event)
        event.stopPropagation();

    optionsMenu.options = [
        {text: "Play", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                var playlist = playlistController.getLoadedPlaylist();
                if (playlist && playlist.tracks.length > 0)
                    playlistController.playSongList(playlist.tracks);
            }, 150)
        }},
        {text: "Play next", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                var playlist = playlistController.getLoadedPlaylist();
                if (playlist && playlist.tracks.length > 0)
                    playlistController.playSongListNext(playlist.tracks);
            }, 150)
        }},
        {text: "Add to Playlist", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                var playlist = playlistController.getLoadedPlaylist();
                if (playlist && playlist.tracks.length > 0)
                    playlistController.addSongListElementsToPlaylist(positionTo, playlist.tracks, "r");

            }, 150)
        }} ,
        {text: "Save as new Playlist", callback: function () {
            optionsMenu.closePopup();

            var playlist = playlistController.loadedPlaylistSongs || [];
            setTimeout(function () {
                if (playlist && playlist.length > 0)
                    playlistController.loadNewPlaylistWithSongs(playlist)
            }, 150)

        }}

    ]


    //Only one Playlist Selected
    if (!playlistController.getLoadedPlaylist().isSimilarSongs) {


        optionsMenu.options.push({text: "Rename", callback: function () {
            optionsMenu.closePopup();
            $("#popupOptions").popup({
                afterclose: function () {
                    $("#popupOptions").popup({afterclose: null});
                    setTimeout(function () {
                        $("#popupTextInput").popup('open', {positionTo: "window", transition: 'pop'});
                    }, 100)
                }
            });
            playlistController.editedPlaylistTitle = "Rename Playlist";
            playlistController.editedPlaylist = jQuery.extend(true, {}, playlistController.getLoadedPlaylist());
            $scope.safeApply();

        }});
    }

    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", "r");
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "3px").css("margin-left", "-10px");

}


optionsMenu.openQueueOptions = function (event, positionTo) {
    optionsMenu.beforeOpen();

    if (event)
        event.stopPropagation();

    optionsMenu.options = [
        {text: "Save as Playlist", callback: function () {
            optionsMenu.closePopup();

            var playlist = playlistController.loadedPlaylistSongs || [];
            setTimeout(function () {
                if (playlist && playlist.length > 0)
                    playlistController.loadNewPlaylistWithSongs(playlist)
            }, 150)

        }},
        {text: "Clear Queue", callback: function () {
            optionsMenu.closePopup();
            playlistController.clearQueue();
        }}
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
    optionsMenu.beforeOpen();

    if (event)
        event.stopPropagation();


    // var song = optionsMenu.getSongFromListEvent(event);


    optionsMenu.options = [
        {text: "Add to Current Play Queue", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                playlistController.addSelectedElementsToQueue(event)
            }, 150)
        }},
        {text: "Add to Playlist", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                playlistController.addSelectedElementsToPlaylist(positionTo);
            }, 150)
        }},
        {text: "Create new Playlist", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                playlistController.loadNewPlaylistWithSelectedSongs();
            }, 150)
        }

        }/*,
         {text: "Share with friends", callback: function () {
         optionsMenu.closePopup();


         }} */

    ]


    //Option to open playlist
    if (playlistController.selectedElements[playlistController.selectedElements.length - 1].obj.isPlaylist) {
        optionsMenu.options.unshift({text: "Open", callback: function () {
            optionsMenu.closePopup();

            searchController.playlists.showPlaylist(playlistController.selectedElements[playlistController.selectedElements.length - 1].obj);

        }})

        //Search Artist
    } else {

        if (searchController.showMode != 6 || playlistController.selectedElements[playlistController.selectedElements.length - 1].obj.artist.name != searchController.showedArtist.name) {
            optionsMenu.options.push({text: "Show Artist", callback: function () {
                optionsMenu.closePopup();
                searchController.artists.searchForArtist(playlistController.selectedElements[playlistController.selectedElements.length - 1].obj.artist);

            }})
        }

        optionsMenu.options.push({text: "Show Playlist", callback: function () {
            optionsMenu.closePopup();
            searchController.playlists.searchForPlaylist(playlistController.selectedElements[playlistController.selectedElements.length - 1].obj)

        }})
    }


    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", "l");
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "7px").css("margin-left", "15px");


}


optionsMenu.openPlayListSelectionPlaylistOptions = function (event, positionTo) {
    optionsMenu.beforeOpen();

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
        {text: "Create new Playlist", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                playlistController.loadNewPlaylistWithSelectedSongs();
            }, 150)
        }}
        /*,
         {text: "Share with friends", callback: function () {
         optionsMenu.closePopup();


         }}  */

    ]


    optionsMenu.options.unshift({text: "Open", callback: function () {
        optionsMenu.closePopup();

        playlistController.ui.showPlaylist(playlistController.selectedElements[playlistController.selectedElements.length - 1].obj);

    }})


    optionsMenu.options.push(
        {text: "Rename", callback: function () {

            $("#popupOptions").popup({
                afterclose: function () {
                    $("#popupOptions").popup({afterclose: null});
                    setTimeout(function () {
                        $("#popupTextInput").popup('open', {positionTo: "window", transition: 'pop'});
                    }, 100)
                }
            });

            optionsMenu.closePopup();
            playlistController.editedPlaylistTitle = "Rename Playlist";

            playlistController.editedPlaylist = jQuery.extend(true, {}, playlistController.selectedElements[playlistController.selectedElements.length - 1].obj);
            $scope.safeApply();


        }}
    )


    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", "l");
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "7px").css("margin-left", "15px");


}


optionsMenu.openPlayListSelectionSongOptions = function (event, positionTo) {
    optionsMenu.beforeOpen();

    if (event)
        event.stopPropagation();


    // var song = optionsMenu.getSongFromListEvent(event);


    optionsMenu.options = [
        {text: "Play next", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                playlistController.playSelectionNext();
            }, 150)
        }} ,
        {text: "Add to Playlist", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                playlistController.addSelectedElementsToPlaylist(positionTo);
            }, 150)
        }},
        {text: "Create new Playlist", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                playlistController.loadNewPlaylistWithSelectedSongs();
            }, 150)
        }}


        /*,
         {text: "Share with friends", callback: function () {
         optionsMenu.closePopup();


         }} */

    ]


    optionsMenu.options.push({text: "Show Artist", callback: function () {
        optionsMenu.closePopup();
        searchController.artists.searchForArtist(playlistController.selectedElements[playlistController.selectedElements.length - 1].obj.artist);

    }})
    optionsMenu.options.push({text: "Show Playlist", callback: function () {
        optionsMenu.closePopup();
        searchController.playlists.searchForPlaylist(playlistController.selectedElements[playlistController.selectedElements.length - 1].obj)

    }})


    if (playlistController.showMode == 1)
    optionsMenu.options.unshift({text: "Open Playlist", callback: function () {
        optionsMenu.closePopup();
        playlistController.ui.showPlaylist(playlistController.getPlaylistFromId(playlistController.selectedElements[playlistController.selectedElements.length - 1].obj.playlistgid))

    }})


    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", "l");
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "7px").css("margin-left", "15px");


}


/**
 * Share Playlist - Dialog
 */

optionsMenu.openSharePlaylistOptions = function (positionTo) {
    optionsMenu.beforeOpen();

    if (event)
        event.stopPropagation();

    var share = function (index) {
        return function () {
            jqmAllowPopUpClosing = true;
            $("#popupSharePlaylistOptions").popup('close');
            setTimeout(function () {
                mediaController.shareSelectedPlaylist(playlistController.playlists[index]);
            }, 150);
        }
    };
    // var song = optionsMenu.getSongFromListEvent(event);
    optionsMenu.options = [];
    for (var i = 0; i < playlistController.playlists.length; i++) {
        if (!playlistController.playlists[i].isCurrentQueue && !playlistController.playlists[i].isSimilarSongs) {
            var callback = share(i);
            optionsMenu.options.push({text: playlistController.playlists[i].name, callback: callback})
        }
    }

    $scope.safeApply();
    $("#popupSharePlaylistOptionsList").listview("refresh");
    $('#popupSharePlaylistOptions').popup('open', {positionTo: positionTo});

}


/**
 * Open Dialog to choose playlist
 */
optionsMenu.openChoosePlaylist = function (positionTo, listToAdd, arrowDirection) {
    optionsMenu.beforeOpen();

    if (event)
        event.stopPropagation();

    var add = function (index) {
        return function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                playlistController.addSongsToPlaylist(playlistController.playlists[index], listToAdd)
                playlistController.selection.deselectElements();
            }, 150);
        }
    };
    // var song = optionsMenu.getSongFromListEvent(event);
    optionsMenu.options = [];
    for (var i = 0; i < playlistController.playlists.length; i++) {
        if (!playlistController.playlists[i].isCurrentQueue && !playlistController.playlists[i].isSimilarSongs) {
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
    if (arrowDirection == "r")
        $("#popupOptions-popup").css("margin-top", "3px").css("margin-left", "-10px");
    else if (arrowDirection == "t")
        $("#popupOptions-popup").css("margin-top", "18px").css("margin-left", "");
    else
        $("#popupOptions-popup").css("margin-top", "").css("margin-left", "18px");
}

//Search Results

optionsMenu.openArtistResultsOptions = function (event, positionTo) {
    optionsMenu.beforeOpen();

    //No options for opened list yet
    if (searchController.isOnlyTypeDisplayed(3))
        return;


    if (event)
        event.stopPropagation();

    optionsMenu.options = [
    ]


    //More Results can be displayed
    if (!searchController.isOnlyTypeDisplayed(3)) {
        optionsMenu.options.unshift({text: "Show all results", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                searchController.setShowMode(null, 3)
            }, 150)
        }})
    }


    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", true);
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "").css("margin-left", "1px");

}


/**
 * Options for all Searched Playlist
 * @param event
 * @param positionTo
 */
optionsMenu.openPlaylistResultsOptions = function (event, positionTo) {
    optionsMenu.beforeOpen();

    if (event)
        event.stopPropagation();

    optionsMenu.options = [
        {text: "Play", callback: function () {
            optionsMenu.closePopup();
            searchController.playlists.playAllPlaylists();

        }} ,
        {text: "Play next", callback: function () {
            optionsMenu.closePopup();
            if (searchController.playlists.searchResults && searchController.playlists.searchResults.length > 0) {
                setTimeout(function () {
                    uiController.disableUI(true);
                    var playlists = searchController.playlists.searchResults.concat();
                    var addPlaylist = function (playlists, index, playlistLength) {
                        if (index > 0 && playlists[index - 1] && playlists[index - 1].tracks && playlists[index - 1].tracks.length) {
                            playlistLength = playlistLength + playlists[index - 1].tracks.length;
                            if (playlistLength > 0) {
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

        }}
        ,
        {text: "Create new Playlist", callback: function () {
            optionsMenu.closePopup();
            if (searchController.playlists.searchResults && searchController.playlists.searchResults.length > 0) {
                setTimeout(function () {
                    uiController.disableUI(true);
                    var playlists = searchController.playlists.searchResults.concat();
                    var addPlaylist = function (playlists, index, playlistLength) {
                        if (index > 0 && playlists[index - 1] && playlists[index - 1].tracks && playlists[index - 1].tracks.length) {
                            playlistLength = playlistLength + playlists[index - 1].tracks.length;
                        }
                        if (index < playlists.length && playlistLength < searchController.maxResults) {
                            searchController.playlists.loadPlaylistTracks(playlists[index], function () {
                                addPlaylist(playlists, index + 1, playlistLength);
                            }, false)
                        } else {
                            if (playlistLength > 0) {
                                var playlist = [];
                                for (var i = 0; i < playlists.length; i++) {
                                    playlist = playlist.concat(playlists[i].tracks);
                                }
                                if (playlist && playlist.length > 0)
                                    playlistController.loadNewPlaylistWithSongs(playlist)

                            }
                            uiController.disableUI(false);

                        }
                    }
                    addPlaylist(playlists, 0, 0)
                }, 150)
            }

        }},
        {text: "Add to Playlist", callback: function () {
            optionsMenu.closePopup();
            if (searchController.playlists.searchResults && searchController.playlists.searchResults.length > 0) {
                setTimeout(function () {
                    var playlists = searchController.playlists.searchResults.concat();
                    playlistController.addSongListElementsToPlaylist(positionTo, playlists, "l");
                }, 150)
            }


        }}
    ]


    //More Results can be displayed
    if (!searchController.isOnlyTypeDisplayed(2)) {
        optionsMenu.options.unshift({text: "Show all results", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                searchController.setShowMode(null, 2)
            }, 150)
        }})
    }

    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", true);
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "").css("margin-left", "1px");


}


/**
 * Options for Single Searched Playlist
 * @param event
 * @param positionTo
 */
optionsMenu.openPlaylistSingleResultsOptions = function (event, positionTo) {
    optionsMenu.beforeOpen();

    if (searchController.showedPlaylist && searchController.showedPlaylist.tracks) {
        var playlist = searchController.showedPlaylist.tracks;
        var playlistName = searchController.showedPlaylist.name;
    }

    else {
        playlist = [];
        playlistName = null;
    }

    optionsMenu.openSongListOptions(event, playlist, positionTo, true, playlistName)

}

/**
 * Menu for all Songs in Song List
 * @param event
 * @param positionTo
 */

optionsMenu.openSongListOptions = function (event, songList, positionTo, isNotSearchList, playlistName) {
    optionsMenu.beforeOpen();

    if (event)
        event.stopPropagation();

    optionsMenu.options = [

        {text: "Play", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                var playlist = songList;
                if (playlist && playlist.length > 0)
                    playlistController.playSongList(playlist.slice(0, searchController.maxResults));
            }, 150)
        }} ,
        {text: "Play next", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                var playlist = songList;
                if (playlist && playlist.length > 0)
                    playlistController.playSongListNext(playlist.slice(0, searchController.maxResults));
            }, 150)
        }},
        {text: "Add to Playlist", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                var playlist = songList;
                if (playlist && playlist.length > 0)
                    playlistController.addSongListElementsToPlaylist(positionTo, playlist.slice(0, searchController.maxResults), "l");

            }, 150)
        }},
        {text: "Create new Playlist", callback: function () {
            optionsMenu.closePopup();
            var playlist = songList || [];
            setTimeout(function () {
                if (playlist && playlist.length > 0)
                    playlistController.loadNewPlaylistWithSongs(playlist.slice(0, searchController.maxResults), playlistName)
            }, 150)
        }}
        //,{text: "Select All", callback: null}


    ]

    if (!isNotSearchList) {
        //More Results can be displayed
        if (!searchController.isOnlyTypeDisplayed(1)) {
            optionsMenu.options.unshift({text: "Show all results", callback: function () {
                optionsMenu.closePopup();
                setTimeout(function () {
                    searchController.setShowMode(null, 1)
                }, 150)
            }})
        }
    }


    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions").popup("option", "arrow", true);
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top", "").css("margin-left", "1px");


}


/**
 * Menu for all Songs in Explore List
 * @param event
 * @param positionTo
 */

optionsMenu.openSongExploreOptions = function (event, positionTo) {

    optionsMenu.openSongListOptions(event, exploreController.songs.searchResults, positionTo, true)
}


/**
 * Menu for all Songs in Searchlist
 * @param event
 * @param positionTo
 */

optionsMenu.openSongResultsOptions = function (event, positionTo) {
    optionsMenu.openSongListOptions(event, searchController.songs.searchResults, positionTo)
}


optionsMenu.openUserResultsOptions = function (event, positionTo) {
    optionsMenu.beforeOpen();

    if (event)
        event.stopPropagation();


    optionsMenu.options = [
        {text: "Show All Results", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                searchController.setShowMode(null, 4);
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


