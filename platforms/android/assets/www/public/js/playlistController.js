/**
 * playlistController.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 04.03.14 - 16:05
 * @copyright munichDev UG
 */


var playlistController = function () {

};


playlistController.sortPlaylist = false;
playlistController.selectedSongs = [];
playbackController.playingSongIndex = 0;


playlistController.globalId = "";//playlistController.loadedPlaylistSongs.length;

playlistController.editedPlaylist = {name: ""};

playbackController.playedSongs = [];

playlistController.globalIdPlaylist = "";//playlistController.playlists.length;

//Playlists visible
playlistController.playlistMode = true;

playlistController.displayLimit = 0;
playlistController.currentShowID = 0;

playlistController.selectPlaylistsPlaceholder = "Search your Playlists";

playlistController.loadedPlaylistSongs = [];

playlistController.currentQueue = {gid: 0, id: 0, name: "Current Play Queue", isPlaylist: true, isCurrentQueue: true, tracks: []};

playlistController.playlists = [playlistController.currentQueue];  //CLEAR_______________________________________________________________

playlistController.playlistHelp = {playlist: "Drag and Drop your favorite Songs<br>to add them to this Playlist.", queue: "Drag and Drop your favorite Songs<br>to add them to the Play Queue."};


//Loaded Playlists

playlistController.loadedPlaylists = {};

playlistController.counterGlobalId = 0;//playlistController.loadedPlaylistSongs.length; //TODO

/*
 for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
 playlistController.loadedPlaylistSongs[i].gid = playlistController.getNewID();//;"gsid" + helperFunctions.padZeros(i, ("" + playlistController.loadedPlaylistSongs.length).length);
 playlistController.loadedPlaylistSongs[i].id = "plsid" + helperFunctions.padZeros(i, ("" + playlistController.loadedPlaylistSongs.length).length);
 //   console.log("::: "+ playlistController.loadedPlaylistSongs[i].gid)
 }
 for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
 playlistController.loadedPlaylistSongs[i].playlistgid = 0;
 }


 playlistController.playlists = [
 {gid: 0, id: 0, name: "Rock", isPlaylist: true, tracks: playlistController.loadedPlaylistSongs},
 {gid: 1, id: 1, name: "Charts4/13", isPlaylist: true, tracks: []},
 {gid: 2, id: 2, name: "Chillout", isPlaylist: true, tracks: []},
 {gid: 3, id: 3, name: "Vocals", isPlaylist: true, tracks: []},
 {gid: 4, id: 4, name: "Trance", isPlaylist: true, tracks: []},
 {gid: 5, id: 5, name: "Electro '14", isPlaylist: true, tracks: []}

 ];



 //window.localStorage.playlists = null;

 var playlists = window.localStorage.playlists;
 if (playlists)
 playlistController.playlists = JSON.parse(playlists);


 */


playlistController.init = function () {

    setTimeout(function () {
        $("#playlist").addClass("fadeincomplete").css("opacity", "");
    }, 0);


    playlistController.makePlayListScrollable();

    playlistController.chosenElement = $("#playlistselectverticalform").chosen({disable_search_threshold: 2})


    playlistController.chosenObject = $("#playlistselectverticalform").data("chosen")


    $(".chosen-choices").addClass("ui-input ui-body-a ui-corner-all ui-shadow-inset");
    $(".chosen-choices").css("min-height", "2.2em");


    $(".chosen-choices input").css("margin-top", "5px")
    $(".chosen-container").css("margin-top", "-3px")

    playlistController.chosenElement.change(function (evt, params) {
        playlistController.onLoadedPlaylistsChanged();
    });

    $("#clearChoosenPlaylists").hide();

    $scope.safeApply();
    $("#searchlistview").listview('refresh');
    uiController.updateUI();


    setTimeout(function () {
        playlistController.makePlayListSortable();
        setTimeout(function () {
            uiController.playListScroll.refresh();
            setTimeout(function () {
                uiController.playListScroll.refresh();
            }, 1000)
        }, 150)
    }, 0)


    playlistController.chosenElement.on("chosen:hiding_dropdown", function () {
        setTimeout(function () {
            $("#playlistselectvertical .chosen-drop").removeClass("visible");//CHANGED
        }, 0)
    })


    $("#playlistselectvertical .chosen-container").click(function (event) {
        if ($('#playlistselectvertical #clearChoosenPlaylists:hover, #playlistselectvertical .search-choice:hover').length == 0) {

            $("#playlistselectvertical .chosen-with-drop .chosen-drop").addClass("visible")
        }
        else
            setTimeout(function () {
                $("#playlistselectvertical .chosen-container").removeClass("chosen-with-drop");
            }, 0)
    });


    $('#playlistselectvertical #clearChoosenPlaylists').click(function (event) {


        uiController.showPlaylists();


    });


    $('.chosen-container input').blur(function () {
        setTimeout(uiController.updateUI, 100);
    });


    playlistController.makePlayListSortable();


    $(".sortable").sortable("disable");


    $("#playlistselectvertical .ui-input-clear").appendTo("#playlistselectvertical .ui-input");
    $("#playlistselectvertical .search-field input").attr("placeholder", playlistController.selectPlaylistsPlaceholder)

    $("#playlistselectvertical .search-field input").on("focus", function () {
        if ($('#playlistselectvertical #clearChoosenPlaylists:hover, #playlistselectvertical .search-choice:hover').length == 0)
            setTimeout(function () {
                $("#playlistselectvertical .chosen-with-drop .chosen-drop").addClass("visible")
                $("#playlistselectvertical .chosen-container").addClass("chosen-with-drop");
            }, 0)

    })


    $("#popupTextInput").popup({
        beforeposition: function (event, ui) {
            $.mobile.loading("hide");


        },
        afteropen: function (event, ui) {

            $('#popupTextInput input').focus();
            $('#popupTextInput input').select();
        },
        afterclose: function () {
            $("#popupTextInput input").css("background-color", "#fff").css("color", "#000");

        }
    });


    $('#popupTextInput input').keyup(function (e) {
        if (e.keyCode == 13) {
            playlistController.renamePlaylist(playlistController.editedPlaylist, $("#popupTextInput input").val());
        } else
            playlistController.validateRenamePlaylist(playlistController.editedPlaylist, $("#popupTextInput input").val());

    });


    setTimeout(function () {
        playlistController.createScrollIndicators();

    }, 150)


}


playlistController.createScrollIndicators = function () {
    uiController.playListScroll.refresh();
    setTimeout(function () {
        uiController.playListScroll.refresh();
    }, 1000)

    playlistController.scrollUpIndicator = $('<div class="iScrollScrollUpIndicator fadeincomplete" style="display:none;"></div>');
    $("#playlistInner .iScrollVerticalScrollbar").prepend(playlistController.scrollUpIndicator);

    playlistController.scrollUpIndicator.click(function () {
        uiController.playListScroll.scrollTo(0, 0, 700);
    });
    uiController.playListScroll.on('scrollEnd', function () {
        if (uiController.playListScroll.y == 0) {
            $("#playlistInner .iScrollScrollUpIndicator").hide();
        } else {
            $("#playlistInner .iScrollScrollUpIndicator").show();
        }

    });


    playlistController.playIndicator = $('<div class="iScrollPlayIndicator fadeincomplete" style="display:none;"></div>');

    playlistController.playIndicator.appendTo("#playlistInner .iScrollVerticalScrollbar");

    playlistController.playIndicator.click(function () {
        uiController.playListScroll.scrollToElement(".loadedsong", 700);
    });

    $(".iScrollIndicator").addClass("fadeincomplete");


}


playlistController.getNewID = function () {
    var timeNow = new Date();
    playlistController.counterGlobalId++;
    var id = MD5(timeNow.getTime() + "." + Math.random() + "." + playlistController.counterGlobalId);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX " + id);
    console.dir(new Error().stack)
    return "id_" + id;
}


playlistController.getDisplayLimit = function () {

    var limit;
    if (playlistController.loadedPlaylistSongs.length < playlistController.displayLimit)
        limit = playlistController.loadedPlaylistSongs.length;
    else
        limit = playlistController.displayLimit;
    console.log("LIMIT: " + limit)
    return limit;
}

playlistController.applySongList = function () {
    playlistController.displayLimit = 0;

    var apply = function (currentShowID) {
        console.log("-------------------------------------")
        $(".specialplaylistbutton").removeClass("fadeincompletefaster");
        $("#playlistInner .iScrollIndicator").hide();

        var stepSize = 10;
        var stepDelay = 50;
        var size = playlistController.loadedPlaylistSongs.length;


        var delays = (Math.ceil(size / stepSize));
        if (delays == 0)
            delays = 1;

        console.log("SONGLIST APPLY")
        console.log(delays)
        console.log(size + "  " + stepSize)

        var songInList = playlistController.isSongInList(playbackController.playingSong);
        $("#playlistview").addClass("disablecoveranim");

        for (var i = 1; i <= delays; i++) {

            var show = function (index) {
                setTimeout(function () {
                    if (playlistController.currentShowID == currentShowID) {


                        /*  if (searchController.showMode == 0)
                         searchController.displayLimit = searchController.maxResults;
                         else*/
                        playlistController.displayLimit = size * index / delays;

                        console.log("safeapply")
                        $scope.safeApply();

                        console.dirx(JSON.parse(JSON.stringify(playlistController.loadedPlaylistSongs)));

                        $("#playlistview").listview('refresh');

                        //New Elements Applied
                        if ((songInList && $("#playlistInner .loadedsong").length == 0) || index == 1)
                            playbackController.remarkSong();


                        //First new elements applied
                        if (index == 1) {

                            uiController.updateUI();
                            if (songInList)
                                playbackController.positionPlayIndicator();


                            playlistController.updateDeselectedSong();
                            $(".specialplaylistbutton").addClass("fadeincompletefaster");
                            $("#playlistview").css("opacity", "1")

                            $("#playlistview").show();
                            $("#playlisthelp").show();

                            setTimeout(function () {
                                $("#playlistview").removeClass("disablecoveranim");
                                $("#playlistInner .iScrollIndicator").show();
                            }, 500)

                            $("#playlistInner .songlist").removeClass("hidden").removeClass("avoidhiding");

                        }
                        //All elements applied
                        if (index == delays) {

                            if (songInList)
                                playbackController.positionPlayIndicator();

                            setTimeout(function () {
                                uiController.playListScroll.refresh();

                            }, 500)
                            setTimeout(function () {
                                uiController.playListScroll.refresh();

                            }, 2000)


                            playlistController.makePlayListSortable();


                        } else if (index % 3 == 0) {
                            uiController.playListScroll.refresh();
                            if (songInList)
                                playbackController.positionPlayIndicator();


                        }


                    }
                }, stepDelay * (index - 1))

            }
            show(i)
        }

    }
    playlistController.currentShowID = playlistController.currentShowID + 1;
    apply(playlistController.currentShowID);
}

/**
 * Returns true if song in list
 * @param gid
 * @returns {*}
 */
playlistController.isSongInList = function (song) {
    if (song) {
        var displayName = mediaController.getSongDisplayName(song)
        for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
            if (displayName == mediaController.getSongDisplayName(playlistController.loadedPlaylistSongs[i])) {
                return true;
            }
        }
    }
    return false;

}

/*
 Select Playlist in dropdown menu, used to load list
 */
playlistController.showPlaylist = function (playlist) {

    if (playlistController.playlistMode) {
        $("#playlistInner .iScrollIndicator").hide();
        $("#playlistInner .iScrollScrollUpIndicator").hide();

        $("#playlistview").css("opacity", "0")

    }


    if (Object.keys(playlistController.loadedPlaylists).length != 0) {
        if (playlistController.loadedPlaylists[0])
            playlistController.playlistsQueueScrollY = uiController.playListScroll.y;
        playlistController.loadedPlaylists = {};
        playlistController.loadedPlaylistSongs = [];
        $('#playlistselectverticalform option').prop('selected', false);

    }

    //$("#playlistselectvertical .search-field input").attr("placeholder", "");
    $('#playlistselectverticalform option[value="' + playlist.gid + '"]').prop('selected', true);
    $('#playlistselectverticalform').trigger('chosen:updated');

    setTimeout(function () {
        $('#playlistselectverticalform').trigger('chosen:close');
        if ($('#playlistselectverticalform option:selected').size() > 1)
            $("#clearChoosenPlaylists").show();
        else
            $("#clearChoosenPlaylists").hide();
        playlistController.chosenElement.trigger('change');
        uiController.updateUI();
        $("#playlistselectvertical .chosen-container").removeClass("chosen-with-drop");
    }, 0)


}

//Update List of select songs
playlistController.updateDeselectedSong = function () {
    for (var i = 0; i < playlistController.selectedSongs.length; i++) {

        if (playlistController.selectedSongs[i].ele.closest("html").length == 0 || !playlistController.selectedSongs[i].ele.hasClass("selected")) {
            playlistController.selectedSongs.splice(i, 1);
            i--;
        }
    }

}


/**
 * Select songs to Drag
 * @param song
 */
playlistController.selectSong = function (song) {

    if (!uiController.swipeTimer || Date.now() - uiController.swipeTimer > 500) {

        /*if (playbackController.playSongTimer && Date.now() - playbackController.playSongTimer < 800)
         return;
         setTimeout(function(){
         if (playbackController.playSongTimer && Date.now() - playbackController.playSongTimer < 800)
         return;  */

        var listElement = null;
        if (song.gid) {

            listElement = playbackController.getListElementFromSong(song, 2)


        }
        else {
            listElement = playbackController.getListElementFromSong(song, 1)

        }

        if (listElement)
            listElement.toggleClass("selected");

        var showedOptions = false;

        if (listElement.hasClass("selected")) {
            playlistController.selectedSongs.push({ele: listElement, song: song})
            showedOptions = true;
            playlistController.hideSongOptions();
            playlistController.showSongOptions(listElement, song);

        } else if (playlistController.selectedSongs.length > 0 && playlistController.selectedSongs[ playlistController.selectedSongs.length - 1].song == song) {

            while (playlistController.selectedSongs.length > 0) {
                playlistController.selectedSongs.splice(playlistController.selectedSongs.length - 1, 1);
                if (playlistController.selectedSongs.length > 0 && playlistController.selectedSongs[ playlistController.selectedSongs.length - 1].ele.hasClass("selected")) {
                    showedOptions = true;
                    playlistController.hideSongOptions();
                    playlistController.showSongOptions(playlistController.selectedSongs[ playlistController.selectedSongs.length - 1].ele, playlistController.selectedSongs[ playlistController.selectedSongs.length - 1].song);
                    break;

                }
            }
        }

        if (playlistController.selectedSongs.length == 0 || (!showedOptions && playlistController.selectedSongs.length > 0 && playlistController.selectedSongs[ playlistController.selectedSongs.length - 1].song == song)) {
            playlistController.hideSongOptions();


        }

    }
}

/**
 * Show Songs Options
 */
playlistController.positionSongOptions = function () {
    if (playlistController.selectedSongs.length > 0 && $(".songOptions").length > 0) {
        var song = playlistController.selectedSongs[ playlistController.selectedSongs.length - 1].song
        var width = $("<h3 id='textMeasuring' style='opacity:0;z-index:10000000;top:80px;left:0;font-size: 1em;font-weight: bold;position:absolute'>" + song.name + "</h3>").appendTo("body").width()
        var widthTitle = $("<div id='textMeasuring2' style='opacity:0;z-index:10000000;top:110px;left:0;font-size: .75em;position:absolute'>" + mediaController.getSongArtist(song) + "</div>").appendTo("body").width()
        $("#textMeasuring").remove();
        $("#textMeasuring2").remove();

        if (width < widthTitle)
            width = widthTitle;
        width = width + 35;

        if (63 + width + 150 > playlistController.selectedSongs[ playlistController.selectedSongs.length - 1].ele.outerWidth() - 50)
            width = playlistController.selectedSongs[ playlistController.selectedSongs.length - 1].ele.outerWidth() - 150 - 63 - 50;

        $(".songOptions").css("left", (63 + width) + "px");
    }
}

/**
 * Show Songs Options
 */
playlistController.showSongOptions = function (listElement, song) {
    setTimeout(function () {


        if (playlistController.selectedSongs.length > 0 && playlistController.selectedSongs[ playlistController.selectedSongs.length - 1].song == song && listElement.hasClass("selected")) {
            var width = $("<h3 id='textMeasuring' style='opacity:0;z-index:10000000;top:80px;left:0;font-size: 1em;font-weight: bold;position:absolute'>" + song.name + "</h3>").appendTo("body").width()
            var widthTitle = $("<div id='textMeasuring2' style='opacity:0;z-index:10000000;top:110px;left:0;font-size: .75em;position:absolute'>" + mediaController.getSongArtist(song) + '<span ng-if ="song.playcount !== undefined && song.playcount"><span  style="font-style: normal;font-size: .83em;margin-left:2px;"> ?</span><span class="songPlayCount" style="font-style: italic;font-size: .93em;margin-left:2px;">' + song.playcount + '</span></span> </div>').appendTo("body").width()
            $("#textMeasuring").remove();
            $("#textMeasuring2").remove();

            if (width < widthTitle)
                width = widthTitle;
            width = width + 35;

            if (63 + width + 150 > listElement.outerWidth() - 50)
                width = listElement.outerWidth() - 150 - 63 - 50;

            var songOptionsId = Date.now();

            $("#songOptionsOriginal").clone(true, true).attr("id", "").addClass("songOptions songOptions" + songOptionsId).appendTo(listElement)

            var songOptions = $(".songOptions" + songOptionsId)
            songOptions.css("opacity", "0");
            songOptions.css("left", (63 + width + 20) + "px");
            songOptions.addClass("noanim").hide();

            songOptions.removeClass("noanim").show();

            setTimeout(function () {


                songOptions.css("left", (63 + width) + "px");

                songOptions.css("opacity", "0.83");

            }, 0)
        }
    }, 0)
}


/**
 * Hide Songs Options
 */
playlistController.hideSongOptions = function () {
    var songOptions = $(".songOptions")
    if (songOptions.length > 0) {
        songOptions.css("opacity", "0");
        songOptions.css("width", "0px");
        songOptions.css("left", (parseInt($(".songOptions").css("left").replace("px", "")) - 5) + "px");
        setTimeout(function () {
            songOptions.remove();
        }, 200)
    }
}


/**
 * Get Select songs (also from playlists)
 * @returns {Array}
 */
playlistController.getSongListFromSelection = function () {
    var list = [];
    //Extract all songs from selected songs and playlists
    //for (var i = playlistController.selectedSongs.length - 1; i >= 0; i--) {
    for (var i = 0; i < playlistController.selectedSongs.length; i++) {

        var element = playlistController.selectedSongs[i].song;
        console.log("Q!!!!Q!!!!!!Q!!!!!!Q!!!!!!Q!!!!!!!!")
        console.dir(element)
        if (element.isPlaylist) {
            if (element.tracks && element.tracks.length > 0) {
                for (var j = 0; j < element.tracks.length; j++) {
                    list.push(element.tracks[j])

                }
            }
        } else
            list.push(element)
    }
    return list;
}


/**
 * Play Song List
 * @param event
 */
playlistController.playSongList = function (songlist) {

    songlist = jQuery.extend(true, [], songlist);

    if (songlist.length > 0) {

        playlistController.prepareGIDsToInsertSongsIntoPlaylist(playlistController.currentQueue, songlist);
        console.log("!!!!!!!!!!")
        console.dir(songlist)


        playlistController.insertSongsIntoQueue(songlist);

        playbackController.playSong(songlist[0], false, false, false);

        playbackController.playingSong = songlist[0];


        if (playlistController.playlistMode) {
            setTimeout(function () {
                    playlistController.animateAddedToList($(".currentqueue"));
                }, 300
            )
        }
    }
}


/**
 * Play Selection
 * @param event
 */
playlistController.playSelection = function (event) {
    event.stopPropagation();

    playlistController.playSongList(playlistController.getSongListFromSelection());


    playlistController.deselectSongs();

}


/**
 *  Prepares Songs and Playlist (GIDs) to insert songs into playlist
 * @param event
 */
playlistController.prepareGIDsToInsertSongsIntoPlaylist = function (playlist, songs) {

    for (var i = 0; i < songs.length; i++) {

        var actSong = jQuery.extend(true, {}, songs[i]);

        actSong.playlistgid = playlist.gid;


        if (!actSong.gid) {
            actSong.gid = playlistController.getNewID();
        } else {
            for (var j = 0; j < playlist.tracks.length; j++) {
                var actSong2 = playlist.tracks[j];
                if (actSong.gid == actSong2.gid) {
                    var newID = playlistController.getNewID();
                    if (playbackController.playingSong && playbackController.playingSong.gid == actSong2.gid) {
                        playbackController.playingSong.gid = newID;
                    }
                    actSong2.gid = newID;

                }
            }
        }
        songs[i] = actSong;
    }
}


/**
 * Play Song List Next
 * @param event
 */
playlistController.playSongListNext = function (songlist) {
    songlist = jQuery.extend(true, [], songlist);

    if (songlist.length > 0) {


        playlistController.prepareGIDsToInsertSongsIntoPlaylist(playlistController.currentQueue, songlist);

        playlistController.insertSongsIntoQueue(songlist);

        if (!playbackController.playingSong)
            playbackController.playSong(songlist[0], false, false, false);


        if (playlistController.playlistMode) {
            setTimeout(function () {
                    playlistController.animateAddedToList($(".currentqueue"));
                }, 300
            )
        }
    }

}


/**
 * Play Selection Next
 * @param event
 */
playlistController.playSelectionNext = function () {
    playlistController.playSongListNext(playlistController.getSongListFromSelection());
    playlistController.deselectSongs();

}


/**
 * Create playlist with selected songs and Load it
 */

playlistController.loadNewPlaylistWithSelectedSongs = function () {

    var list = playlistController.getSongListFromSelection();

    if (list.length > 0) {

        playlistController.loadNewPlaylistWithSongs(list)


    }
    playlistController.deselectSongs();

}

/*
 Animate Songs added to Queue
 */
playlistController.animateAddedToList = function (listElement) {


    listElement.addClass("addedsongs").removeClass("hoverable")
    setTimeout(function () {
        listElement.removeClass("addedsongs")
        setTimeout(function () {
            listElement.addClass("hoverable")
        }, 200)
    }, 2000)

}

/**
 Triggered whenever playlist changed
 */
playlistController.playlistChanged = function (playlist, position) {

    if (!position)
        position = playlistController.getPlaylistPosition(playlist.gid);


    if (position > -1) {
        accountController.savePlaylist(playlist, position);
    }

}


/**
 * Add selected Songs to Queue
 * @param event
 */
playlistController.showMoreSelectionOptions = function (event, that) {
    event.stopPropagation();

    if ($(that).parents("#searchlist").length > 0)
    //TODO Playlist/User/Artist USW
        optionsMenu.openSearchListSelectionOptions(event, $(event.target))

    else {
        if (playlistController.playlistMode)
            optionsMenu.openPlayListSelectionPlaylistOptions(event, $(event.target))
        else
            optionsMenu.openPlayListSelectionSongOptions(event, $(event.target))

    }

}


/**
 * Clear Queue except Playng song
 */
playlistController.clearQueue = function () {


    if (playbackController.playingSong)
        playlistController.loadedPlaylistSongs = [jQuery.extend(true, {},playbackController.playingSong)];
    else
        playlistController.loadedPlaylistSongs = [];

    playlistController.currentQueue.tracks = playlistController.loadedPlaylistSongs;

    playbackController.updatePlayingSongIndex();

//playlistController.playlistChanged(playlistController.currentQueue, 0);

    $("#playlistInner .iScrollPlayIndicator").hide();

    $("#playlistInner .songlist").addClass("hidden");

    playlistController.applySongList();


}

/**
 * Insert Elements into Queue at Current Position
 * @param event
 * @param position 0/undefinded: play position, 1 at the end
 */

playlistController.insertSongsIntoQueue = function (songs) {


    var tmp = playlistController.currentQueue.tracks.slice(0, playbackController.playingSongIndex + 1).concat(songs);

    playlistController.currentQueue.tracks = tmp.concat(playlistController.currentQueue.tracks.slice(playbackController.playingSongIndex + 1));


    if (playlistController.loadedPlaylists["0"]) {
        if (Object.keys(playlistController.loadedPlaylists).length == 1) {
            playlistController.loadedPlaylistSongs = jQuery.extend(true, [], playlistController.currentQueue.tracks);
        }
        playlistController.displayLimit = playlistController.loadedPlaylistSongs.length;

        $scope.safeApply();


        $("#playlistview").listview('refresh');

        setTimeout(function () {

            $("#playlistview").listview('refresh');

            uiController.updateUI();
            playbackController.remarkSong();

            setTimeout(function () {

                uiController.playListScroll.refresh();
                setTimeout(function () {
                    uiController.playListScroll.refresh();
                }, 1000)
            }, 150)
        }, 0)
    }

}


/**
 * Add selected Songs to Songlist
 * @param event
 */
playlistController.addSongListElementsToPlaylist = function (positionTo, songlist, arrowDirection) {

    songlist = jQuery.extend(true, [], songlist);

    //Let the user choose the playlist
    setTimeout(function () {
        optionsMenu.openChoosePlaylist(positionTo, songlist, arrowDirection);
    }, 300)


}


/**
 * Add selected Songs to Playlist
 * @param event
 */
playlistController.addSelectedElementsToPlaylist = function (positionTo) {

    playlistController.addSongListElementsToPlaylist(positionTo, playlistController.getSongListFromSelection(), "l");


}


/**
 * Add Songs to Playlist at end
 * @param playlist
 * @param songs
 */

playlistController.addSongsToPlaylist = function (playlist, songs) {

    playlistController.prepareGIDsToInsertSongsIntoPlaylist(playlist, songs);
    playlist.tracks = playlist.tracks.concat(songs);

    setTimeout(function () {
        playlistController.playlistChanged(playlist)
    }, 0);
    $scope.safeApply();
    if (playlistController.playlistMode) {
        if (playlist.gid == playlistController.currentQueue.gid)
            playlistController.animateAddedToList($(".currentqueue"));
        else
            playlistController.animateAddedToList(playbackController.getListElementFromSong(playlist));

    } else if (playlistController.getLoadedPlaylist().gid == playlist.gid) {
        if (Object.keys(playlistController.loadedPlaylists).length == 1) {

            playlistController.loadedPlaylistSongs = jQuery.extend(true, [], playlist.tracks);
        }
        playlistController.displayLimit = playlistController.loadedPlaylistSongs.length;


        $scope.safeApply();

        playbackController.remarkSong();
        $("#playlistview").listview('refresh');

        setTimeout(function () {
            $("#playlistview").listview('refresh');

            uiController.updateUI();
            setTimeout(function () {
                playbackController.remarkSong();
                uiController.playListScroll.refresh();
                setTimeout(function () {
                    uiController.playListScroll.refresh();
                }, 1000)
            }, 150)
        }, 0)
    }


}


/**
 * Add selected Songs to Playlist
 * @param event
 */
playlistController.addSelectedElementsToQueue = function (event) {
    event.stopPropagation();


    var list = playlistController.getSongListFromSelection();


    playlistController.addSongsToPlaylist(playlistController.currentQueue, list);


    playlistController.deselectSongs();

}


/**
 * Remove selected Songs to Playlist
 * @param event
 */
playlistController.removeSelectedElementsFromPlaylist = function (event) {
    event.stopPropagation();

    var list = [];
    //Extract all songs from selected songs and playlists
    //for (var i = playlistController.selectedSongs.length - 1; i >= 0; i--) {
    for (var i = 0; i < playlistController.selectedSongs.length; i++) {

        var element = playlistController.selectedSongs[i].song;
        if (element.isPlaylist) {
        } else {
            var playlist = playlistController.getLoadedPlaylist();
            for (var j = 0; j < playlistController.playlist.tracks.length; j++) {
                if (playlistController.playlist.tracks[j].gid == playlistController.selectedSongs.gid) {
                    alert("DELETE")
                }
            }


        }
    }
    $scope.safeApply();

    playlistController.deselectSongs();

}

/**
 * Share selected Elements
 * @param event
 */
playlistController.shareSelectedElements = function (event) {
    event.stopPropagation();

    //playlistController.selectedSongs


}

/**
 * Return the GID of the playlist of the choosen element //TODO uses inner Structure of Chosen.js BAD
 * @param element
 */
playlistController.getPlaylistGIDFromChosenElement = function (element) {
    var item = playlistController.chosenObject.results_data[element.find("a").attr("data-option-array-index")];
    var option = playlistController.chosenObject.form_field.options[item.options_index]
    if (option)
        return option.value;
    else
        return undefined;

}


/**
 * Triggered if chosen seleccted elements changes
 */



playlistController.onLoadedPlaylistsChanged = function () {


    var closefunc = function () {

        setTimeout(function () {
            $("#playlistselectvertical .chosen-container").removeClass("chosen-with-drop");
            uiController.updateUI();
        }, 0)


        if (Object.keys(playlistController.loadedPlaylists).length != 0) {
            //Save Queue Scroll Position
            playlistController.chosenClose();

            $(".search-field input").css("opacity", "0")

            if (playlistController.loadedPlaylists[0])
                playlistController.playlistsQueueScrollY = uiController.playListScroll.y;

            playlistController.loadedPlaylists = {};
            playlistController.loadedPlaylistSongs = [];
            $('#playlistselectverticalform option').prop('selected', false);
            $('#playlistselectverticalform').trigger('chosen:updated');

            playlistController.loadedPlaylistSongs = playlistController.playlists;
            //  $("#playlistselectvertical .search-field input").attr("placeholder", playlistController.selectPlaylistsPlaceholder)
            playlistController.loadedPlaylists = {};
            playlistController.playlistMode = true;
            $("#playlistInner .iScrollIndicator").hide();

            $("#playlistInner .iScrollPlayIndicator").hide();
            $("#playlistInner .iScrollScrollUpIndicator").hide();

            $("#clearChoosenPlaylists").hide();

            $("#playlistview").hide();

            $scope.safeApply();
            $('#playlistselectverticalform').trigger('chosen:updated');
            playlistController.updateDeselectedSong();

            uiController.updateUI();

            setTimeout(function () {


                $("#playlistview").listview('refresh');
                uiController.playListScroll.scrollTo(0, playlistController.playlistsScrollY, 0);

                $("#playlistview").show();

                playlistController.makePlayListSortable();
                setTimeout(function () {
                    uiController.playListScroll.refresh();
                    if (playlistController.playlistsScrollY)
                        uiController.playListScroll.scrollTo(0, playlistController.playlistsScrollY, 0);


                }, 150)
                setTimeout(function () {
                    uiController.playListScroll.refresh();

                }, 1000)
            }, 0)


        }

        /* var playlistgid = null;
         var name = $(this).parent().text();

         for (var i = 0; i < playlistController.playlists.length; i++) {
         if (playlistController.playlists[i].name == name) {
         playlistgid = playlistController.playlists[i].gid
         break;
         }
         }

         if (playlistgid != null) {
         playlistController.removeLoadedPlaylist(playlistgid);
         }

         */


    }
    //on trigger, all playlists still there, after ms gone if return key pressd
    var playlistsOldLoaded = [];

    var searchChoices = $('#playlistselectvertical .search-choice')

    if (searchChoices.length > 0) {
        //$("#playlistselectvertical .search-field input").attr("placeholder", "");
        for (var i = 0; i < searchChoices.length; i++) {
            var searchChoice = $(searchChoices.get(i));

            var actName = searchChoice.find("span").text();
            playlistsOldLoaded.push(actName);

            var gid = playlistController.getPlaylistGIDFromChosenElement(searchChoice);

            if (!playlistController.loadedPlaylists[gid])
                var name = searchChoice.find("span").text();
            else {
                searchChoice.remove();
            }


        }
        if (name) {
            console.log("NEWWWWWWWWW" + name)

            //    var searchChoice = searchChoices.get(searchChoices.length - 1);
            searchChoice.find(".search-choice-close").attr("title", "Close")
            var playlist = null;

            for (var i = 0; i < playlistController.playlists.length; i++) {
                if (playlistController.playlists[i].name == name)
                    playlist = playlistController.playlists[i];
            }

            console.log("LOAD----???" + name + "   " + playlistController.loadedPlaylists[playlist.gid] + "   " + playlist.gid)

            if (playlist != null && !playlistController.loadedPlaylists[playlist.gid]) {
                console.log("LOAD------------------------------------------------------------------------------ " + name)

                //Menus
                if (playlist.gid == playlistController.currentQueue.gid) {
                    $(searchChoice).on("click", function () {
                        optionsMenu.openQueueOptions(event, $(this))
                    })
                } else {
                    $(searchChoice).on("click", function () {
                        optionsMenu.openPlaylistOptions(event, $(this))
                    })
                }

                playlistController.hideHelp = true;
                $("#playlistview").css("opacity", "0")

                if (Object.keys(playlistController.loadedPlaylists).length != 0) {
                    if (playlistController.loadedPlaylists[0])
                        playlistController.playlistsQueueScrollY = uiController.playListScroll.y;
                    playlistController.loadedPlaylists = {};
                    playlistController.loadedPlaylistSongs = [];
                    $('#playlistselectverticalform option').prop('selected', false);
                    $('#playlistselectverticalform option[value="' + playlist.gid + '"]').prop('selected', true);
                    $('#playlistselectverticalform').trigger('chosen:updated');
                }

                playlistController.loadPlaylist(playlist);
            }
        } else if (Object.keys(playlistController.loadedPlaylists).length != 0) //No new means one deleted
            closefunc();

    } else if (Object.keys(playlistController.loadedPlaylists).length != 0) // deleted
        closefunc();

    /*
     //Check if playlist was deleted, is gone after 50 ms in dom
     setTimeout(function () {
     console.log("DO REMOVE PLAYLIST ???" + playlistsOldLoaded.length)

     for (var i = 0; i < playlistsOldLoaded.length; i++) {
     var name = playlistsOldLoaded[i];
     var selections = $('#playlistselectvertical .search-choice');
     var found = false;
     for (var j = 0; j < selections.length; j++) {
     if ($(selections.get(j)).text() == name) {
     console.log(name+" was FOUND")
     found = true;
     break;
     }
     }
     console.log("DO REMOVE PLAYLIST ???" + name+"   "+found)

     if (!found) {
     var playlistgid = null;
     for (var j = 0; j < playlistController.playlists.length; j++) {
     if (playlistController.playlists[j].name == name) {
     playlistgid = playlistController.playlists[j].gid
     break;
     }
     }

     if (playlistgid != null) {
     console.log("REMOVE PLAYLIST ######" + name)

     playlistController.removeLoadedPlaylist(playlistgid);
     }

     }
     }
     }, 50)
     */

    $('#playlistselectvertical .search-choice').data('loaded', 'true')

    if ($('#playlistselectverticalform option:selected').size() > 1)
        $("#clearChoosenPlaylists").show();
    else
        $("#clearChoosenPlaylists").hide();


    uiController.updateUI();

    $('.search-choice-close').unbind('click', closefunc);
    $(".search-choice-close").click(closefunc)


}


playlistController.deselectSongs = function (event) {
//Remove Selection

    if (event)
        event.stopPropagation();

    $(".songlist li.selected").removeClass("selected");
    playlistController.selectedSongs = [];

    playlistController.hideSongOptions();
}

/*
 playlistController.removeLoadedPlaylist = function (playlistgid) {
 playlistController.chosenClose();
 $("#playlistInner .iScrollIndicator").hide();


 $(".search-field input").css("opacity", "0")
 playlistController.loadedPlaylists[playlistgid] = {};
 delete  playlistController.loadedPlaylists[playlistgid];

 for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
 if (playlistController.loadedPlaylistSongs[i].playlistgid == playlistgid) {
 playlistController.loadedPlaylistSongs.splice(i, 1);
 i--;
 }
 }
 for (var j = playlistController.playlists.length - 1; j >= 0; j--) {
 if (playlistController.playlists[j].gid == playlistgid) {
 if (!playlistController.playlists[j].tracks || (playlistController.playlists[j].tracks.length == 0 && playlistController.playlists[j].isUnnamedPlaylist)) {
 playlistController.playlists.splice(i, 1);
 break;
 }
 }
 }

 //Last Playlist Removed
 if (playlistController.loadedPlaylistSongs.length == 0 && $('#playlistselectvertical .search-choice').length == 0) {
 //Save Queue Scroll Position
 if (playlistgid == 0)
 playlistController.playlistsQueueScrollY = uiController.playListScroll.y;

 playlistController.loadedPlaylistSongs = playlistController.playlists;
 $("#playlistselectvertical .search-field input").attr("placeholder", playlistController.selectPlaylistsPlaceholder)
 playlistController.loadedPlaylists = {};
 playlistController.playlistMode = true;
 $("#playlistInner .iScrollPlayIndicator").hide();
 $("#clearChoosenPlaylists").hide();


 } else {
 if ($('#playlistselectverticalform option:selected').size() > 1)
 $("#clearChoosenPlaylists").show();
 else
 $("#clearChoosenPlaylists").hide();

 }


 $("#playlistview").hide();

 if (Object.keys(playlistController.loadedPlaylists).length != 0) {
 if (Object.keys(playlistController.loadedPlaylists).length > 1 || !playlistController.loadedPlaylists["0"]) {
 $("#playlisthelp").html(playlistController.playlistHelp.playlist)
 } else {
 $("#playlisthelp").html(playlistController.playlistHelp.queue)
 }
 }


 $scope.safeApply();
 $('#playlistselectverticalform').trigger('chosen:updated');
 playlistController.updateDeselectedSong();

 uiController.updateUI();

 setTimeout(function () {


 $("#playlistview").listview('refresh');
 uiController.playListScroll.scrollTo(0, playlistController.playlistsScrollY, 0);

 $("#playlistview").show();

 playlistController.makePlayListSortable();
 setTimeout(function () {
 uiController.playListScroll.refresh();

 if (playlistController.playlistMode && playlistController.playlistsScrollY)
 uiController.playListScroll.scrollTo(0, playlistController.playlistsScrollY, 0);


 }, 150)
 setTimeout(function () {
 uiController.playListScroll.refresh();

 }, 1000)
 }, 0)


 }   */

playlistController.chosenClose = function () {
    $("#playlistselectvertical .chosen-container").removeClass("chosen-with-drop");
    $("#playlistselectvertical .chosen-drop").removeClass("visible");
    $("#playlistselectvertical chosen-container-active").removeClass("chosen-container-active");


    playlistController.chosenObject.container.removeClass("chosen-container-active");
    playlistController.chosenObject.clear_backstroke();
    playlistController.chosenObject.show_search_field_default();
    playlistController.chosenObject.search_field_scale();
    playlistController.chosenObject.result_clear_highlight();

    playlistController.chosenObject.active_field = false;
    playlistController.chosenObject.results_showing = false

}


/**
 * Open Loaded playlist Menu
 * @param playlist
 */
playlistController.openLoadedPlaylistMenu = function (event, that) {
    if (playlistController.getLoadedPlaylist().gid == playlistController.currentQueue.gid) {

        optionsMenu.openQueueOptions(event, $(that).find(".optionsPlaylist"))

    } else {
        optionsMenu.openPlaylistOptions(event, $(that).find(".optionsPlaylist"))

    }
}

playlistController.validateRenamePlaylist = function (playlist, name) {
    var samePlaylistName = false;
    if (!name || $.trim(name) == "")
        var samePlaylistName = true
    else {
        for (var i = 0; i < playlistController.playlists.length; i++) {

            if (playlistController.editedPlaylist.gid != playlistController.playlists[i].gid && $.trim(name) == $.trim(playlistController.playlists[i].name)) {
                samePlaylistName = true;

            }
        }
    }


    if (samePlaylistName) {
        $("#popupTextInput input").css("background-color", "rgb(111, 0, 0)").css("color", "#fff");
    } else {
        $("#popupTextInput input").css("background-color", "#fff").css("color", "#000");
    }

    return!samePlaylistName

}

/**
 * Rename Playlist
 * @param playlist
 * @param name
 */
playlistController.renamePlaylist = function (playlist, name) {
    if (playlistController.validateRenamePlaylist(playlist, name)) {

        $("#popupTextInput").popup("close");

        setTimeout(function () {
            playlist = playlistController.getPlaylistFromId(playlist.gid)
            if (playlist) {
                playlist.name = name;
                delete playlist.isUnnamedPlaylist
                $scope.safeApply();
            }


        }, 150)
    }

}


playlistController.importPlaylistPopup = function () {

    $("#popupImportInput").popup("open");

}


playlistController.loadPlaylist = function (playlist) {

    //$("#playlistselectvertical .search-field input").attr("placeholder", "")
    $("#playlistInner .iScrollIndicator").hide();
    $("#playlistInner .iScrollScrollUpIndicator").hide();


    playlistController.loadedPlaylists[playlist.gid] = playlist;

    if (playlistController.playlistMode) {
        //  playlistController.loadedPlaylistSongs.length > 0 && playlistController.loadedPlaylistSongs[0].isPlaylist)
        playlistController.loadedPlaylistSongs = [];
        playlistController.playlistMode = false;
        playlistController.playlistsScrollY = uiController.playListScroll.y;
    }

    if (playlist.gid == playlistController.currentQueue.gid && playlistController.playlistsQueueScrollY)
        uiController.playListScroll.scrollTo(0, playlistController.playlistsQueueScrollY, 0);
    else
        uiController.playListScroll.scrollTo(0, 0, 0);

    playlistController.loadedPlaylistSongs = playlist.tracks.concat(playlistController.loadedPlaylistSongs)
    for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
        playlistController.loadedPlaylistSongs[i].id = "plsid" + helperFunctions.padZeros(i, ("" + playlistController.loadedPlaylistSongs.length).length);
        //   console.log("::: "+ playlistController.loadedPlaylistSongs[i].gid)
    }

    if (Object.keys(playlistController.loadedPlaylists).length > 1 || !playlistController.loadedPlaylists["0"]) {
        $("#playlisthelp").html(playlistController.playlistHelp.playlist)
    } else {
        $("#playlisthelp").html(playlistController.playlistHelp.queue)
    }


    // $("#playlistview").hide();
    /* $scope.safeApply();
     playbackController.remarkSong();
     playlistController.updateDeselectedSong();
     */
    playlistController.hideHelp = false;
    playlistController.applySongList();


    //List was loaded first time after creation, so ask ro rename it
    if (playlistController.renameLoadedPlaylist) {
        playlistController.renameLoadedPlaylist = false;
        setTimeout(function () {
            playlistController.editedPlaylist = jQuery.extend(true, {}, playlist);
            playlistController.editedPlaylistTitle = "Rename Playlist";
            $scope.safeApply();

            $("#popupTextInput").popup('open', {positionTo: "window", transition: 'pop'});

        }, 0)
    }
}

uiController.stopPlaylistScrollingOnClick = function (event) {
    var myEvent = jQuery.extend({}, event);
    myEvent.type = "mouseup";
    myEvent.preventDefault = function () {
    };
    setTimeout(function () {
        uiController.playListScroll.handleEvent(myEvent);
    }, 10)
    setTimeout(function () {
        uiController.playListScroll.handleEvent(myEvent);
    }, 100)
}


/**
 *

 playlistController.multiplePlaylistLoaded = function(){
    return $("#playlistselectvertical  .chosen-choices .search-choice").length>1;
}
 */

/**
 *
 */
playlistController.getSongPlaylistName = function (song) {


    if (song.playlistgid === 0) {
        return  "";//"?";
    }
    else if (song.playlistgid && playlistController.loadedPlaylists[song.playlistgid]) {
        return playlistController.loadedPlaylists[song.playlistgid].name;
    }

    return "";
}

/**
 *
 */
playlistController.hasTrendStyle = function (trend, song) {
    return (song.trend === trend);
}


/**
 *
 */
playlistController.getTrendTitleClass = function (song) {
    if (song.trend == 0 || song.trend == 1 || song.trend == 2 || song.trend == 3) {
        return "songTitleMargin";
    }
    return "";

}


/**
 *
 */


/**
 *
 * @param event
 */
playlistController.scrollByWheel = function (event) {
    uiController.playListScroll.handleEvent(event);
}

/**
 * Called wenn mousemove
 * @param event
 */
playlistController.scrollByDragCallback = function (event) {

    if (uiController.draggingSortableSong || uiController.draggingSong) {

        var dragEle = $(".draggedsortablelistelement, .draggedsearchlistelement");

        if ($("#playlistview").height() > $("#playlistInner").height()) {
            //console.log('X:' + (event.clientX-110) + ' Y: '+(event.clientY-30) );
            var doScroll = false;
            if ($("#playlistInner").offset().top - dragEle.offset().top > 10 && Math.abs($("#playlistInner").offset().left - dragEle.offset().left) < 50) {
                if (!uiController.playListScrollTimer || Date.now() - uiController.playListScrollTimer > 500) {
                    console.log(uiController.playListScroll.scrollY)
                    uiController.playListScrollTimer = Date.now()
                    uiController.playListScroll.enable();
                    uiController.playListScroll.refresh();
                    doScroll = true;
                    var scrollY = uiController.playListScroll.y + $("#playlistInner").height() / 2


                }

            } else if ($("#playlistInner").offset().top + $("#playlistInner").height() - dragEle.offset().top - dragEle.height() < -10 && Math.abs($("#playlistInner").offset().left - dragEle.offset().left) < 50) {
                if (!uiController.playListScrollTimer || Date.now() - uiController.playListScrollTimer > 500) {
                    console.log(uiController.playListScroll.scrollY)
                    uiController.playListScrollTimer = Date.now()
                    uiController.playListScroll.enable();
                    uiController.playListScroll.refresh();

                    doScroll = true;
                    scrollY = uiController.playListScroll.y - $("#playlistInner").height() / 2

                }

            }

            if (scrollY > 0)
                scrollY = 0;
            else if (scrollY < uiController.playListScroll.maxScrollY)
                scrollY = uiController.playListScroll.maxScrollY;

            uiController.playListScroll.refresh();


            if (doScroll)
                uiController.playListScroll.scrollTo(0, scrollY, 1000)


        }

    }
}


/**
 * Get Loaded Playlist
 * @returns {*}
 */
playlistController.getLoadedPlaylist = function () {

    for (var playlist in playlistController.loadedPlaylists) {
        if (playlistController.loadedPlaylists.hasOwnProperty(playlist)) {
            return playlistController.loadedPlaylists[playlist]
        }
    }
    return {};
}


/**
 * Get Playlist with GID
 * @param gid
 * @returns {*}
 */
playlistController.getPlaylistFromId = function (gid) {

    for (var i = 0; i < playlistController.playlists.length; i++) {
        if (playlistController.playlists[i].gid == gid) {
            return playlistController.playlists[i];
        }
    }
    return null;

}


/**
 * Get Playlist index in list with GID
 * @param gid
 * @returns {*}
 */
playlistController.getPlaylistIndexFromId = function (gid) {

    for (var i = 0; i < playlistController.playlists.length; i++) {
        if (playlistController.playlists[i].gid == gid) {
            return  i;
        }
    }
    return null;

}


/**
 * Get Playlist Position
 * @param gid
 * @returns {*}
 */
playlistController.getPlaylistPosition = function (gid) {

    for (var i = 0; i < playlistController.playlists.length; i++) {
        if (playlistController.playlists[i].gid == gid) {
            return  i;
        }
    }
    return -1;

}


/**
 * Create empty Playlist Funktion and Load it
 */

playlistController.createEmptyPlaylist = function (addAtBottom) {

    var name = "Playlist";
    var id = playlistController.getNewID();

    var countUnnamed = 0;
    for (var i = 0; i < playlistController.playlists.length; i++) {
        if (playlistController.playlists[i].name.substring(0, name.length) == name) {
            var number = playlistController.playlists[i].name.substring(name.length + 2)

            //   number = number.substring(0, number.length - 1)

            if (parseInt(number) && countUnnamed <= parseInt(number)) {
                countUnnamed = parseInt(number);
            } else if (!parseInt(number) && (playlistController.playlists[i].name != name || countUnnamed == 0))
                countUnnamed = countUnnamed + 1;

        }
    }
    if (countUnnamed > 0) {
        name = name + " #" + (countUnnamed + 1);
    }

    var playlist = {gid: id, id: id, name: name, isUnnamedPlaylist: true, isPlaylist: true, tracks: []};

    if (addAtBottom)
        playlistController.playlists.push(playlist);
    else
        playlistController.playlists.unshift(playlist);

    return playlist;

}


/**
 ** Load Current Queue
 */

playlistController.loadCurrentQueue = function () {
    if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 100)
        return;

    var playlist = playlistController.currentQueue;
    $scope.safeApply();

    setTimeout(function () {
        playlistController.showPlaylist(playlist);
        setTimeout(function () {
            $scope.safeApply();
        }, 50)
    }, 0)

    event.stopPropagation();

}


/**
 * Create playlist with songs and Load it
 */

playlistController.loadNewPlaylistWithSongs = function (songs) {
    songs = jQuery.extend(true, [], songs);

    $.mobile.loading("show");

    var playlist = playlistController.createEmptyPlaylist();

    for (var i = 0; i < songs.length; i++) {
        var song = jQuery.extend(true, {}, songs[i]);
        if(song.playlistgid!=playlistController.currentQueue.gid||!song.gid)
         song.gid = playlistController.getNewID()

        song.playlistgid = playlist.gid;
        song.id = "plsid" + helperFunctions.padZeros(song, ("" + playlistController.loadedPlaylistSongs.length).length);
        songs[i] = song;

    }


    playlist.tracks = songs;
    setTimeout(function () {
        playlistController.playlistChanged(playlist)
    }, 0)
    $("#playlistview").hide();
    $("#playlisthelp").hide();

    playlistController.renameLoadedPlaylist = true;

    $scope.safeApply();
    setTimeout(function () {
        playlistController.showPlaylist(playlist);

    }, 0)

}


/**
 * Add empty Playlist Funktion and Load it
 */

playlistController.loadNewEmptyPlaylist = function () {
    if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 100)
        return;

    var playlist = playlistController.createEmptyPlaylist();

    playlistController.editedPlaylist = jQuery.extend(true, {}, playlist);
    ;
    playlistController.editedPlaylistTitle = "Rename Playlist";

    $scope.safeApply();

    setTimeout(function () {
        playlistController.showPlaylist(playlist);


    }, 0)
    setTimeout(function () {
        $("#popupTextInput").popup('open', {positionTo: "window", transition: 'pop'});
    }, 150)
    event.stopPropagation();

}


/**
 * Toggle Save Playlist Funktion
 * @param savePlaylist  //TODO REMOVE

 playlistController.toggleSavePlaylist = function (savePlaylist) {


    if (!accountController.loggedIn) {
        $('#popupRegister').popup('open', {positionTo: '#registerLink', transition: "pop"});
        setTimeout(function () {
            $('#signinusername').focus();
        }, 500)

        return;
    }


    uiController.savePlaylist = !uiController.savePlaylist;


    if (uiController.savePlaylist) {

        if ($('#playlistselectvertical .search-choice').length == 1) {
            $("#saveplaylistinpt").val($('#playlistselectvertical .search-choice').text());
            $("#saveokayplaylistbtn").removeAttr("disabled").css("opacity", "1");

        }
        else {
            $("#saveplaylistinpt").val("");
            $("#saveokayplaylistbtn").attr("disabled", "disabled").css("opacity", "0.5");

        }

        //Add new Playlist
        if (playlistController.playlistMode) {
            playlistController.playlistMode = false;
            playlistController.loadedPlaylistSongs = [];
            $("#clearChoosenPlaylists").show();
            $scope.safeApply();
        }


        if (playlistController.sortPlaylist) {
            playlistController.toggleSortablePlaylist();
        }
        // $("#saveplaylistbtn").addClass("redbackground");
        $("#saveplaylistbtn img").attr("src", "public/img/crosswhite.png");

        $("#sortplaylistbtn").hide();
        $("#playlistselectvertical").hide();
        $("#saveplaylistinput").show();
        $("#saveokayplaylistbutton").show();


        $("#saveplaylistinpt").focus();

    } else {


        //  $("#saveplaylistbtn").removeClass("redbackground");
        $("#saveplaylistbtn img").attr("src", "public/img/save.png");

        $("#saveplaylistinput").hide();
        $("#saveokayplaylistbutton").hide();
        $("#sortplaylistbtn").show();
        $("#playlistselectvertical").show();

        if (savePlaylist) {

            uiController.savePlaylistVisible();

        }


    }
    uiController.updateUI();

}
 */

/**
 * Toggle Sortable playlist
 * @param dontShowTrash
 * @param manuell
 */
playlistController.toggleSortablePlaylist = function (manuell) {
    if (manuell && playlistController.sortPlaylistTimer && Date.now() - playlistController.sortPlaylistTimer < 500) {
        return;
    }


    if (manuell) {
        uiController.startedSortPlaylist = false;
    }

    playlistController.sortPlaylist = !playlistController.sortPlaylist;
    if (playlistController.sortPlaylist) {
        $(".sortable").sortable("enable");

        $("#sortplaylistbtn").addClass("greenbackground");

        $("#playlistInner").css("background-color", "rgba(255,255,255,0.1)");


        $('#playlistInner').css({backgroundColor: 'rgba(255,255,255,0)'})

        $('#playlistInner').animate({
            backgroundColor: 'rgba(255,255,255,0.1)'
        }, 100);


        $("#playlistsortstyle").remove();
        var style = $('<style id="playlistsortstyle">' +
            '#playlistInner ul li a{' +
            'opacity:0.9!important;' +
            'margin-bottom:-1px;' +
            'border-bottom: 1px solid rgba(255,255,255,0.45);' +
            '}' +
            '</style>');
        $('html > head').append(style);

        // $("#playlistInner .iScrollVerticalScrollbar").hide();


    } else {
        playlistController.deselectSongs();
        playlistController.sortPlaylistTimer = Date.now();

        if (manuell) {
            var delay = 0;
        }
        else
            delay = 1500;
        // $("#playlistInner").css("background-color", "");
        setTimeout(function () {
            if (!playlistController.sortPlaylist) {
                $('#playlistInner').animate({
                    backgroundColor: 'rgba(255,255,255,0)'
                }, 200);
            }
        }, delay)


        $("#sortplaylistbtn").removeClass("greenbackground");

        setTimeout(function () {
            $(".sortable").sortable("disable");

        }, 100)

        uiController.playListScroll.enable();
        $("#playlistsortstyle").remove();

        /*$("#playlistInner .iScrollVerticalScrollbar").css("opacity","0")
         $("#playlistInner .iScrollVerticalScrollbar").show();

         setTimeout(function(){
         if($("#playlistInner .iScrollVerticalScrollbar:visible").length>0){
         $("#playlistInner .iScrollVerticalScrollbar").hide();

         $("#playlistInner .iScrollVerticalScrollbar").css("opacity","1")
         setTimeout( function(){
         $("#playlistInner .iScrollVerticalScrollbar").show()
         },0)
         }



         },1000)
         */
    }


    setTimeout(uiController.updateUI, 0);
}


playlistController.getHelpStyleClass = function () {

    if (!playlistController.playlistMode && playlistController.loadedPlaylistSongs.length == 0 && !playlistController.hideHelp) {
        return "";
    } else {
        return "invisible";

    }
}


/**
 * Make Playlist Scrollable
 */
playlistController.makePlayListScrollable = function () {

    uiController.playListScroll = new IScroll('#playlistInner', {
        interactiveScrollbars: true,

        zoom: true,
        scrollX: false,
        scrollY: true,
        mouseWheel: true,
        zoomMin: 0.2,
        zoomMax: 1,
        startZoom: 1,
        // shrinkScrollbars: "scale",
        // wheelAction: 'zoom',
        scrollbars: true,
        noHorizontalZoom: true
    });
    $(".iScrollIndicator").addClass("fadeincomplete").hide();

}


/**
 * Make Playlist Drag and Droppable
 */
playlistController.makePlayListSortable = function () {


    var startDragFunction = function (event) {
        playlistController.dragDraggableSongY = event.clientY;
        playlistController.dragDraggableSongX = event.clientX;

        if (playlistController.sortPlaylist) {
            if ($(this).parents("#playlistInner").length == 0)
                return;
            if (!playlistController.dragDraggableLastSongTimer || Date.now() - playlistController.dragDraggableLastSongTimer > 500) {
                playlistController.dragDraggableSongTimer = Date.now();
                playlistController.dragDraggableSongStartEvent = event;
                playlistController.dragDraggableSongStartElement = this;
                uiController.swiping = false;

            } else
                playlistController.dragDraggableSongTimer = 0;


        }
        $("body").on("mouseup ", function (event) {
            $("body").off("mouseup");
            $("body").off("mousemove");

            playlistController.dragDraggableSongY = -10;

            if (uiController.swiping || (playlistController.dragDraggableSongY > 0 && Math.abs(event.clientY - playlistController.dragDraggableSongY) > 30)) {
                uiController.swipeTimer = Date.now();
            }
            playlistController.dragDraggableSongTimer = 0;
            uiController.swiping = false;

        })
        $("body").on("mousemove ", function (event) {

            if (uiController.swiping || (playlistController.dragDraggableSongY > 0 && Math.abs(event.clientY - playlistController.dragDraggableSongY) > 30)) {
                uiController.swipeTimer = Date.now();
                uiController.swiping = true;

            }

            if (playlistController.sortPlaylist) {


                if (playlistController.dragDraggableSongTimer && Date.now() - playlistController.dragDraggableSongTimer < 500 && Date.now() - playlistController.dragDraggableSongTimer > 50) {

                    uiController.stopPlaylistScrollingOnClick(event);
                    uiController.updateUI();
                    $("body").off("mousemove").off("mouseup");

                    playlistController.dragDraggableLastSongTimer = Date.now();
                    playlistController.dragDraggableSongTimer = 0;

                    $(".sortable").sortable("enable");

                    var coords = {
                        clientX: playlistController.dragDraggableSongStartEvent.clientX,
                        clientY: playlistController.dragDraggableSongStartEvent.clientY
                    };
                    $(playlistController.dragDraggableSongStartElement).simulate("mouseup", coords);
                    var coords = {
                        clientX: event.clientX,
                        clientY: event.clientY
                    };
                    $(playlistController.dragDraggableSongStartElement).simulate("mouseup", coords);
                    uiController.mouseUp = false;

                    // this actually triggers the drag start event
                    $(playlistController.dragDraggableSongStartElement).simulate("mousedown", coords);

                }
            }

        })


    }


    $("#playlistInner li").off("mousedown", startDragFunction);

    $("#playlistInner li").on("mousedown", startDragFunction)


    $("#playlistview").sortable({
        tolerance: "pointer",
        dropOnEmpty: true,
        revert: true,
        opacity: 0.9,
        items: ".playlistsong",
        helper: function (event, $item) {
            $(".songOptions").appendTo("body").hide();

            $("#searchlist li.selected").removeClass("selected")
            if (!$($item).hasClass("selected")) {
                $("#playlistInner li.selected").removeClass("selected")
                $($item).addClass("selected");
            }


            /*var $helper = $('<ul class="songlist"></ul>').addClass('draggedlistelement draggedsortablelistelement');

             var item = $item.clone();


             var ele = $helper.append($item.clone())
             */

            var $helper = $('<ul></ul>').addClass('songlist draggedlistelement draggedsortablelistelement');

            var elements = $("#playlistInner li.selected").removeClass("selected").removeClass("loadedsong playing pausing stillLoading");

            elements.find(".loadingSongImg").remove();

            if (elements.length == 0) {
                var oneItem = true;
                elements = $($item).removeClass("selected").removeClass("loadedsong playing pausing stillLoading");
                elements.removeClass("fadeslideincompletefast");

            } else {
                elements.removeClass("fadeslideincompletefast");
                $(elements.get(0));

                oneItem = false;


            }

            /* setTimeout(function(){
             var placeholder = $(".ui-sortable-placeholder");
             placeholder.attr('style', placeholder.attr('style') + '; ' + 'height: '+(65*elements.length)+'px !important');
             },0) */
            $("#playlistplaceholder").remove();
            $("<style type='text/css' id='playlistplaceholder'> #playlistInner ul .ui-sortable-placeholder{ height:" + (65 * elements.length) + "px !important} </style>").appendTo("head");


            var ele = $helper.append(elements.clone());

            if (!oneItem) {
                for (var i = 0; i < elements.length; i++) {
                    if ($item[0] != elements.get(i)) {
                        $(elements.get(i)).hide();
                    }
                }
                playlistController.draggedElements = elements;

            } else
                playlistController.draggedElements = null;

            return ele;
        },
        //  containment: "body",
        receive: function (event, ui) {
            console.log(".......................")
            console.dir(ui)
            //  ui.position = 0;
            // console.dir( ui.data('draggable'))


        },
        start: function (event, ui) {
            if (!uiController.draggingSong) {


                console.log("STARTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
                // setTimeout(function(){ debugger; },1000)
                playlistController.hideSongOptions();

                $("#playlistInner").offset().top

                uiController.lastDraggingSongFromSearchlist = false;

                uiController.draggingSortableSong = true;
                $("#playlistInner").removeClass("animate");

                $("#playlistInner li").removeClass("fadeslideincompletefast");

                setTimeout(function () {
                    // debugger;
                }, 3000)

                $(".draggedsortablelistelement").off();

                $(".draggedsortablelistelement").on('mousemove', playlistController.scrollByDragCallback);

                $(".draggedsortablelistelement").on('wheel', playlistController.scrollByWheel);
                $(".draggedsortablelistelement").on('mousewheel', playlistController.scrollByWheel);
                $(".draggedsortablelistelement").on('DOMMouseScroll', playlistController.scrollByWheel);


                uiController.playListScroll.enable();
            }

        }, beforeStop: function () {
            //debugger;
        },

        stop: function (event, ui) {


            playlistController.dragDraggableSongY = 0;
            uiController.swiping = false;
            var newLoadedPlaylistSongs = [];
            if (playlistController.draggedElements) {
                playlistController.draggedElements.css("opacity", "");
                playlistController.draggedElements.show();
            }
            var actPlsid = 0;
            $("#playlistview").find("li").each(function (index) {
                $(this).removeClass("margintop fadeslideincompletefast");

                if ($(this).hasClass("specialplaylistbutton"))
                    return;

                if ($(this).hasClass("playlistsong")) {


                    id = this.dataset.index;

                    var isDraggedElement = false;
                    var isDraggedElementButNotFirst = false;

                    if (playlistController.draggedElements && !uiController.lastDraggingSongFromSearchlist) {

                        if (this.dataset.songgid && ui.item[0].dataset.index == this.dataset.index)
                            isDraggedElement = true;
                        else {
                            playlistController.draggedElements.each(function (index) {
                                var dragid = playlistController.draggedElements[index].dataset.index;

                                if (dragid == id)
                                    isDraggedElementButNotFirst = true;
                            })

                        }

                    }
                    console.dir("Playlist " + $(this).find("h3").text() + "   " + isDraggedElement + "   " + isDraggedElementButNotFirst)

                    if (isDraggedElement) {//Was Dragged

                        playlistController.draggedElements.each(function (index) {
                            id = playlistController.draggedElements[index].dataset.index;
                            if (playlistController.playlistMode)
                                actSong = playlistController.playlists[parseInt(id)];
                            else {
                                actSong = playlistController.loadedPlaylistSongs[parseInt(id)];
                                actSong.id = "plsid" + helperFunctions.padZeros(actPlsid, ("" + playlistController.loadedPlaylistSongs.length).length);
                            }

                            actSong = jQuery.extend(true, {}, actSong);

                            newLoadedPlaylistSongs.push(actSong);

                            actPlsid = actPlsid + 1

                        });
                    }
                    else if (!isDraggedElementButNotFirst) {

                        if (playlistController.playlistMode)
                            actSong = playlistController.playlists[parseInt(id)];
                        else {
                            actSong = playlistController.loadedPlaylistSongs[parseInt(id)];
                            actSong.id = "plsid" + helperFunctions.padZeros(actPlsid, ("" + playlistController.loadedPlaylistSongs.length).length);

                        }

                        actSong = jQuery.extend(true, {}, actSong);

                        newLoadedPlaylistSongs.push(actSong);
                        actPlsid = actPlsid + 1


                    }
                } else {  //From Searchlist
                    console.dir("Searchlist " + $(this).find("h3").text())

                    var id = this.dataset.index;
                    isDraggedElement = false;
                    if (playlistController.draggedElements && uiController.lastDraggingSongFromSearchlist) {

                        if (!this.dataset.songgid && ui.item[0].dataset.index == this.dataset.index)
                            isDraggedElement = true;

                    }
                    if (isDraggedElement) {//Was Dragged

                        playlistController.draggedElements.each(function (index) {
                            var id = playlistController.draggedElements[index].dataset.index;

                            var actSong = searchController.songs.searchResults[parseInt(id)];

                            actSong = jQuery.extend(true, {}, actSong);

                            actSong.gid = playlistController.getNewID();//"plsgid" + playlistController.globalId;
                            //playlistController.globalId = playlistController.globalId + 1;


                            actSong.id = "plsid" + helperFunctions.padZeros(actPlsid, ("" + playlistController.loadedPlaylistSongs.length).length);


                            var playlistCount = Object.keys(playlistController.loadedPlaylists).length;

                            for (var playlist in playlistController.loadedPlaylists) {
                                if (playlistController.loadedPlaylists.hasOwnProperty(playlist)) {
                                    if (playlistController.loadedPlaylists[playlist].isUnnamedPlaylist || playlistCount == 1) {
                                        actSong.playlistgid = playlistController.loadedPlaylists[playlist].gid;
                                    }
                                }
                            }


                            newLoadedPlaylistSongs.push(actSong);
                            actPlsid = actPlsid + 1;


                        })
                    }
                    else {

                        var actSong = searchController.songs.searchResults[parseInt(id)];

                        actSong = jQuery.extend(true, {}, actSong);

                        actSong.gid = playlistController.getNewID();//"plsgid" + playlistController.globalId;


                        actSong.id = "plsid" + helperFunctions.padZeros(actPlsid, ("" + playlistController.loadedPlaylistSongs.length).length);


                        newLoadedPlaylistSongs.push(actSong);
                        actPlsid = actPlsid + 1

                    }
                    //  alert(index)
                    $(this).remove();
                }


            })


            var playlistCount = Object.keys(playlistController.loadedPlaylists).length; //Should be 1

            playlistController.loadedPlaylistSongs = newLoadedPlaylistSongs;
            playlistController.displayLimit = playlistController.loadedPlaylistSongs.length;

            if (playlistController.playlistMode)
                playlistController.playlists = playlistController.loadedPlaylistSongs;
            else {
                if ($('#playlistselectverticalform option:selected').size() > 1)
                    $("#clearChoosenPlaylists").show();
                else
                    $("#clearChoosenPlaylists").hide();

                for (var playlist in playlistController.loadedPlaylists) {
                    if (playlistController.loadedPlaylists.hasOwnProperty(playlist)) {
                        if (playlistController.loadedPlaylists[playlist].isUnnamedPlaylist || playlistCount == 1) {
                            playlistController.loadedPlaylists[playlist].tracks = jQuery.extend(true, [], playlistController.loadedPlaylistSongs);


                        }
                    }
                }


            }

            //Save


            setTimeout(function () {
                for (var playlist in playlistController.loadedPlaylists) {
                    if (playlistController.loadedPlaylists.hasOwnProperty(playlist)) {
                        if (playlistController.loadedPlaylists[playlist].isUnnamedPlaylist || playlistCount == 1) {
                            if (playlistController.loadedPlaylists[playlist].tracks.length > 0) {
                                var position = playlistController.getPlaylistPosition(playlistController.loadedPlaylists[playlist].gid);
                                if (position > -1) {
                                    playlistController.playlistChanged(playlistController.loadedPlaylists[playlist], position)


                                }

                            }
                        }
                    }
                }
            }, 1000)


            /*
             console.log("DROPPED------------------------------")
             console.log($("#playlistview").get(0))
             console.log("------------------------------")
             console.dir(playlistController.loadedPlaylistSongs)
             console.log("------------------------------")
             */
            var scrollY = uiController.playListScroll.y;

            $("#playlistInner").hide();
            $("#playlistInner").html(
                window.$compile(
                    preloadhtml.playlisthtml
                )($scope));
            $scope.safeApply();
            playbackController.remarkSong();
            $("#playlistview").addClass("disablecoveranim");
            setTimeout(function () {
                $("#playlistview").removeClass("disablecoveranim");

            }, 300)
            $("#playlistview li").removeClass("fadeslideincompletefast").removeClass("fadeincomplete");
            $("#playlistview").listview();
            playlistController.makePlayListScrollable();


            $("#playlistview").listview('refresh');
            uiController.playListScroll.scrollTo(0, scrollY);


            $("#playlistInner").show();
            uiController.updateUI();


            setTimeout(function () {
                playlistController.createScrollIndicators();
                playbackController.positionPlayIndicator();
                uiController.playListScroll.refresh();
                setTimeout(function () {
                    uiController.playListScroll.refresh();
                }, 1000)

            }, 150)

            if (uiController.startedSortPlaylist) {
                playlistController.toggleSortablePlaylist();
                uiController.startedSortPlaylist = false;
            }
            setTimeout(function () {
                playlistController.makePlayListSortable();

            }, 0)
            uiController.swipeTimer = Date.now();
            uiController.draggingSortableSong = false;


        },
        appendTo: 'body',
        zIndex: "1000000" //or greater than any other relative/absolute/fixed elements and droppables
    }).disableSelection();
    $(".sortable").sortable("disable");
}
