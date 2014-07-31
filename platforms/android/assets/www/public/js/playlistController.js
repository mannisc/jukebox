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
playlistController.selectedElements = [];
playbackController.playingSongIndex = 0;

playlistController.similarSongsMaxResults = 100;

//Max song in Current Play Queue, Rest gets sliced
playlistController.maxPlayQueueSongs = 500;


playlistController.globalId = "";//playlistController.loadedPlaylistSongs.length;

playlistController.editedPlaylist = {name: ""};

playbackController.playedSongs = [];

playlistController.globalIdPlaylist = "";//playlistController.playlists.length;

//Playlists visible
playlistController.playlistMode = true;

playlistController.displayLimit = 0;
playlistController.currentShowID = 0;

playlistController.selectPlaylistsPlaceholder = "Search your Playlists";


playlistController.currentQueue = {gid: 0, id: 0, name: "Current Play Queue", isPlaylist: true, isCurrentQueue: true, tracks: []};
playlistController.similarSongs = {gid: 1, id: 1, name: "Similar Songs", isPlaylist: true, isSimilarSongs: true, tracks: [], song: {}};

playlistController.playlists = [playlistController.currentQueue, playlistController.similarSongs];  //CLEAR_______________________________________________________________
playlistController.loadedPlaylistSongs = playlistController.playlists;

playlistController.playlistHelp = {playlist: "Drag and Drop your favorite Songs<br>to add them to this Playlist.", queue: "Drag and Drop your favorite Songs<br>to add them to the Play Queue."};


//Loaded Playlists

playlistController.loadedPlaylists = {};

playlistController.counterGlobalId = 0;//playlistController.loadedPlaylistSongs.length; //TODO


playlistController.init = function () {

    setTimeout(function () {
        $("#playlist").addClass("fadeincomplete").css("opacity", "");
    }, 0);


    playlistController.ui.makePlayListScrollable();



    $("#playlistInner .iScrollIndicator").hide();




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
        playlistController.dragging.makePlayListSortable();
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


    playlistController.dragging.makePlayListSortable();


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
        playlistController.ui.createScrollIndicators();

    }, 150)

    //Load suggestions into similar songs on startup
    setTimeout(function () {
        if (!playlistController.similarSongs.song.name && searchController.songs.searchResults && searchController.songs.searchResults.length > 0) {
            var index = Math.round(Math.random() * (searchController.songs.searchResults.length - 1));
            var song = searchController.songs.searchResults[index];
            playlistController.getSimilarSongs(song);
        }
    }, 1000)


}


playlistController.ui = function () {

};


playlistController.options = function () {

};

playlistController.selection = function () {

};


playlistController.dragging = function () {

};


/**
 * Create Scrollbar indicators
 */
playlistController.ui.createScrollIndicators = function () {

    uiController.playListScroll.refresh();
    setTimeout(function () {
        uiController.playListScroll.refresh();
    }, 1000)

    playlistController.scrollUpIndicator = $('<div class="iScrollScrollUpIndicator fadeincomplete" style="display:none;"></div>');
    $("#playlistInner .iScrollVerticalScrollbar").prepend(playlistController.scrollUpIndicator);

    playlistController.scrollUpIndicator.click(function () {
        uiController.playListScroll.scrollTo(0, 0, 200);
    });
    uiController.playListScroll.on('scrollEnd', function () {
        if (uiController.playListScroll.y == 0) {
            $("#playlistInner .iScrollScrollUpIndicator").hide();
        } else {
            $("#playlistInner .iScrollScrollUpIndicator").show();
        }

    });


    playlistController.playIndicator = $('<div class="iScrollPlayIndicator fadeincomplete5s" style="display:none;"></div>');

    playlistController.playIndicator.appendTo("#playlistInner .iScrollVerticalScrollbar");

    playlistController.playIndicator.click(function () {
        uiController.playListScroll.scrollToElement(".loadedsong", 700);
    });

    $("#playlistInner .iScrollIndicator").addClass("fadeincomplete");


}


/**
 * Get the max number of displayed elements in playlist
 * @returns {*}
 */
playlistController.ui.getDisplayLimit = function () {

    var limit;
    if (playlistController.loadedPlaylistSongs.length < playlistController.displayLimit)
        limit = playlistController.loadedPlaylistSongs.length;
    else
        limit = playlistController.displayLimit;
    //console.log("LIMIT: " + limit)
    return limit;
}

playlistController.ui.applySongList = function () {
    playlistController.displayLimit = 0;

    var apply = function (currentShowID) {

        $(".specialplaylistbutton").removeClass("fadeincompletefaster");
        $("#playlistInner .iScrollIndicator").hide();

        var stepSize = 10;
        var stepDelay = 50;
        var size = playlistController.loadedPlaylistSongs.length;


        var delays = (Math.ceil(size / stepSize));
        if (delays == 0)
            delays = 1;

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

                        $scope.safeApply();

                        $("#playlistview").listview('refresh');

                        //New Elements Applied
                        if ((songInList && $("#playlistInner .loadedsong").length == 0) || index == 1)
                            playbackController.remarkSong();


                        //First new elements applied
                        if (index == 1) {

                            uiController.updateUI();
                            if (songInList)
                                playbackController.positionPlayIndicator();


                            playlistController.selection.updateDeselectedSong();
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


                            playlistController.dragging.makePlayListSortable();


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


/*
 Select Playlist in dropdown menu, used to load list
 */
playlistController.ui.showPlaylist = function (playlist) {

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

/*
 Animate Songs added to Queue
 */
playlistController.ui.animateAddedToList = function (listElement) {


    listElement.addClass("addedsongs").removeClass("hoverable")
    setTimeout(function () {
        listElement.removeClass("addedsongs")
        setTimeout(function () {
            listElement.addClass("hoverable")
        }, 200)
    }, 2000)

}


/**
 * Close Chosen Dropdown
 */
playlistController.ui.chosenClose = function () {
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
 *  Song has specified trend
 */
playlistController.ui.hasTrendStyle = function (trend, song) {
    return (song.trend === trend);
}


/**
 *  Get Class for Trend
 */
playlistController.ui.getTrendTitleClass = function (song) {
    if (song.trend == 0 || song.trend == 1 || song.trend == 2 || song.trend == 3) {
        return "songTitleMargin";
    }
    return "";

}


/**
 * Scroll by wheel
 * @param event
 */
playlistController.ui.scrollByWheel = function (event) {
    uiController.playListScroll.handleEvent(event);
}

/**
 * Called wenn mousemove
 * @param event
 */
playlistController.ui.scrollByDragCallback = function (event) {

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
 * Toggle Sortable playlist
 * @param dontShowTrash
 * @param manuell
 */
playlistController.ui.toggleSortablePlaylist = function (manuell) {
    if (manuell && playlistController.sortPlaylistTimer && Date.now() - playlistController.sortPlaylistTimer < 500) {
        return;
    }

    if (manuell) {
        uiController.startedSortPlaylist = false;
    }

    playlistController.sortPlaylist = !playlistController.sortPlaylist;
    if (playlistController.sortPlaylist) {

        uiController.playListScroll.disable();

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
        playlistController.selection.deselectElements();
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


playlistController.ui.getHelpStyleClass = function () {


    if (!playlistController.getLoadedPlaylist().isSimilarSongs && !playlistController.playlistMode && playlistController.loadedPlaylistSongs.length == 0 && !playlistController.hideHelp) {
        return "";
    } else {
        return "invisible";

    }
}


/**
 * Make Playlist Scrollable
 */
playlistController.ui.makePlayListScrollable = function () {

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
    $("#playlistInner .iScrollIndicator").addClass("fadeincomplete").hide();

    $(".draggedsearchlistelement").on('wheel', playlistController.ui.scrollByWheel);



}


/**
 * Show Songs Options
 */
playlistController.options.positionSongOptions = function () {
    if (playlistController.selectedElements.length > 0 && $(".songOptions").length > 0) {
        var song = playlistController.selectedElements[ playlistController.selectedElements.length - 1].obj
        var width = $("<h3 id='textMeasuring' style='opacity:0;z-index:10000000;top:80px;left:0;font-size: 1em;font-weight: bold;position:absolute'>" + song.name + "</h3>").appendTo("body").width()
        var widthTitle = $("<div id='textMeasuring2' style='opacity:0;z-index:10000000;top:110px;left:0;font-size: .75em;position:absolute'>" + mediaController.getSongArtist(song) + "</div>").appendTo("body").width()
        $("#textMeasuring").remove();
        $("#textMeasuring2").remove();

        if (width < widthTitle)
            width = widthTitle;
        width = width + 35;

        if (63 + width + 150 > playlistController.selectedElements[ playlistController.selectedElements.length - 1].ele.outerWidth() - 50)
            width = playlistController.selectedElements[ playlistController.selectedElements.length - 1].ele.outerWidth() - 150 - 63 - 50;

        $(".songOptions").css("left", (63 + width) + "px");
    }
}

/**
 * Show Songs Options
 */
playlistController.options.showSongOptions = function (listElement, song) {
    setTimeout(function () {

        if (playlistController.selectedElements.length > 0 && playlistController.selectedElements[playlistController.selectedElements.length - 1].obj == song && listElement.hasClass("selected")) {
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

            $("#songOptionsTemplate").clone(true, true).attr("id", "").addClass("songOptions songOptions" + songOptionsId).appendTo(listElement)

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
playlistController.options.hideSongOptions = function () {
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
 * Add selected Songs to Queue
 * @param event
 */
playlistController.options.showMoreSelectionOptions = function (event) {
    event.stopPropagation();

    if ($(event.target).parents("#searchlist").length > 0)
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
 * Select songs to drag/ show Options
 * @param element
 */
playlistController.selection.selectElement = function (element) {

    if (!uiController.swipeTimer || Date.now() - uiController.swipeTimer > 500) {

        /*if (playbackController.playSongTimer && Date.now() - playbackController.playSongTimer < 800)
         return;
         setTimeout(function(){
         if (playbackController.playSongTimer && Date.now() - playbackController.playSongTimer < 800)
         return;  */

        var listElement = null;
        if (element.gid) {

            listElement = playbackController.getListElementFromElement(element, 2)


        }
        else {
            listElement = playbackController.getListElementFromElement(element, 1)

        }

        if (listElement)
            listElement.toggleClass("selected");

        var showedOptions = false;

        if (listElement.hasClass("selected")) {
            playlistController.selectedElements.push({ele: listElement, obj: element})
            showedOptions = true;
            playlistController.options.hideSongOptions();
            playlistController.options.showSongOptions(listElement, element);

        } else if (playlistController.selectedElements.length > 0 && playlistController.selectedElements[ playlistController.selectedElements.length - 1].obj == element) {

            while (playlistController.selectedElements.length > 0) {
                playlistController.selectedElements.splice(playlistController.selectedElements.length - 1, 1);
                if (playlistController.selectedElements.length > 0 && playlistController.selectedElements[ playlistController.selectedElements.length - 1].ele.hasClass("selected")) {
                    showedOptions = true;
                    playlistController.options.hideSongOptions();
                    playlistController.options.showSongOptions(playlistController.selectedElements[ playlistController.selectedElements.length - 1].ele, playlistController.selectedElements[ playlistController.selectedElements.length - 1].obj);
                    break;

                }
            }
        }

        if (playlistController.selectedElements.length == 0 || (!showedOptions && playlistController.selectedElements.length > 0 && playlistController.selectedElements[ playlistController.selectedElements.length - 1].obj == element)) {
            playlistController.options.hideSongOptions();


        }

    }
}

/**
 * Deselect Songs etc
 */
playlistController.selection.deselectElements = function (event) {
//Remove Selection
    if (event)
        event.stopPropagation();

    $(".songlist li.selected").removeClass("selected");
    playlistController.selectedElements = [];

    playlistController.options.hideSongOptions();
}

//Update List of select songs, if songs are deselected by ui change(element removed wich was selected)
playlistController.selection.updateDeselectedSong = function () {
    for (var i = 0; i < playlistController.selectedElements.length; i++) {

        if (playlistController.selectedElements[i].ele.closest("html").length == 0 || !playlistController.selectedElements[i].ele.hasClass("selected")) {
            playlistController.selectedElements.splice(i, 1);
            i--;
        }
    }

}


/**
 * Make Playlist Drag and Droppable
 */

playlistController.dragging.makePlayListSortable = function () {


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
        $(window).on("mouseup ", function (event) {
            console.log("MOUSEUPPPPPPPPPPPPPPPPPPPP")
            console.log(" ")


            $(window).off("mouseup");
            $(window).off("mousemove");

            playlistController.dragDraggableSongY = -10;

            if (uiController.swiping || (playlistController.dragDraggableSongY > 0 && Math.abs(event.clientY - playlistController.dragDraggableSongY) > 30)) {
                uiController.swipeTimer = Date.now();
            }
            playlistController.dragDraggableSongTimer = 0;
            uiController.swiping = false;

        })

        $(window).on("mousemove ", function (event) {

            console.log("MOUSEMMMOOOVEEEEEEEEE")
            console.log(" ")

            if (uiController.swiping || (playlistController.dragDraggableSongY > 0 && Math.abs(event.clientY - playlistController.dragDraggableSongY) > 30)) {
                uiController.swipeTimer = Date.now();
                uiController.swiping = true;

            }

            if (playlistController.sortPlaylist) {

                if (playlistController.dragDraggableSongTimer && Date.now() - playlistController.dragDraggableSongTimer < 500 && Date.now() - playlistController.dragDraggableSongTimer > 0) {
                    //Wait for Mouseups?
                    setTimeout(function () {
                        if (playlistController.dragDraggableSongTimer) {
                            uiController.stopPlaylistScrollingOnClick(event);
                            uiController.updateUI();
                            $(window).off("mousemove").off("mouseup");

                            playlistController.dragDraggableLastSongTimer = Date.now();
                            playlistController.dragDraggableSongTimer = 0;

                            $(".sortable").sortable("enable");

                            //STARTDRAG ERROR
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
                            // uiController.mouseUp = false;

                            // this actually triggers the drag start event
                            $(playlistController.dragDraggableSongStartElement).simulate("mousedown", coords);
                        }
                    }, 0)

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
            return playlistController.dragging.prepareDragging(event, $item);
        },
        start: function (event, ui) {
            return playlistController.dragging.startDragging(event, ui);

        },
        stop: function (event, ui) {
            return playlistController.dragging.stopDragging(event, ui);
        },
        appendTo: 'body',
        zIndex: "1000000" //or greater than any other relative/absolute/fixed elements and droppables
    }).disableSelection();
    $(".sortable").sortable("disable");
}

/**
 * Called when dragging is prepared (helper)
 * @param event
 * @param $item
 */
playlistController.dragging.prepareDragging = function (event, $item) {

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

}

/**
 * Called when dragging starts
 * @param event
 * @param ui
 */
playlistController.dragging.startDragging = function (event, ui) {

    if (!uiController.draggingSong) {


        // setTimeout(function(){ debugger; },1000)
        playlistController.options.hideSongOptions();

        $("#playlistInner").offset().top

        uiController.lastDraggingSongFromSearchlist = false;

        uiController.draggingSortableSong = true;
        $("#playlistInner").removeClass("animate");

        $("#playlistInner li").removeClass("fadeslideincompletefast");

        setTimeout(function () {
            // debugger;
        }, 3000)

        $(".draggedsortablelistelement").off();
        $(".draggedsortablelistelement").on('mousemove', playlistController.ui.scrollByDragCallback);
        $(".draggedsortablelistelement").on('wheel', playlistController.ui.scrollByWheel);
        $(".draggedsortablelistelement").on('mousewheel', playlistController.ui.scrollByWheel);
        $(".draggedsortablelistelement").on('DOMMouseScroll', playlistController.ui.scrollByWheel);

        uiController.playListScroll.enable();
    }


}

/**
 * Called when dragging stops
 * @param event
 * @param ui
 */
playlistController.dragging.stopDragging = function (event, ui) {

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

        if ($(this).hasClass("playlistsong")) { //From Playlist


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
            //console.dir("Playlist " + $(this).find("h3").text() + "   " + isDraggedElement + "   " + isDraggedElementButNotFirst);

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

            var id = this.dataset.index;
            isDraggedElement = false;
            if (playlistController.draggedElements && uiController.lastDraggingSongFromSearchlist) {

                if (!this.dataset.songgid && ui.item[0].dataset.index == this.dataset.index)
                    isDraggedElement = true;

            }
            if (isDraggedElement) {//Was Dragged

                playlistController.draggedElements.each(function (index) {
                    var id = playlistController.draggedElements[index].dataset.index;


                    var actSong = viewController.getSongFromIndex(parseInt(id));


                    actSong = jQuery.extend(true, {}, actSong);

                    if (actSong.tmpHide)
                        delete actSong.tmpHide;

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

                var actSong = viewController.getSongFromIndex(parseInt(id));

                actSong = jQuery.extend(true, {}, actSong);
                if (actSong.tmpHide)
                    delete actSong.tmpHide;
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

    if (playlistController.playlistMode) {

        playlistController.loadedPlaylistSongs.unshift(playlistController.similarSongs);
        playlistController.loadedPlaylistSongs.unshift(playlistController.currentQueue);
        playlistController.displayLimit = playlistController.loadedPlaylistSongs.length;

        playlistController.playlists = playlistController.loadedPlaylistSongs;


        setTimeout(function () {
            accountController.savePlaylistsPosition();
        }, 0)
    }
    else {
        if ($('#playlistselectverticalform option:selected').size() > 1)
            $("#clearChoosenPlaylists").show();
        else
            $("#clearChoosenPlaylists").hide();

        for (var playlist in playlistController.loadedPlaylists) {
            if (playlistController.loadedPlaylists.hasOwnProperty(playlist)) {
                if (playlistController.loadedPlaylists[playlist].isUnnamedPlaylist || playlistCount == 1) {
                    playlistController.loadedPlaylists[playlist].tracks = playlistController.loadedPlaylistSongs;


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
                            var savePlaylist = playlistController.loadedPlaylists[playlist];
                            accountController.savePlaylist(savePlaylist.gid, savePlaylist.name, savePlaylist.tracks);
                        }

                    }
                }
            }
        }
    }, 1000);


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
    playlistController.ui.makePlayListScrollable();


    $("#playlistview").listview('refresh');
    uiController.playListScroll.scrollTo(0, scrollY);

    if (playlistController.playlistMode) //Update Choosen List if Playlist changed uU
        $('#playlistselectverticalform').trigger('chosen:updated');

    $("#playlistInner").show();
    uiController.updateUI();


    setTimeout(function () {
        playlistController.ui.createScrollIndicators();
        playbackController.positionPlayIndicator();
        uiController.playListScroll.refresh();
        setTimeout(function () {
            uiController.playListScroll.refresh();
        }, 1000)

    }, 150)

    if (uiController.startedSortPlaylist) {
        playlistController.ui.toggleSortablePlaylist();
        uiController.startedSortPlaylist = false;
    }
    setTimeout(function () {
        playlistController.dragging.makePlayListSortable();
    }, 0)
    uiController.swipeTimer = Date.now();
    uiController.draggingSortableSong = false;

}


/**
 * Get new ID for Playlist
 * @returns {string}
 */
playlistController.getNewID = function () {
    var timeNow = new Date();
    playlistController.counterGlobalId++;
    var id = MD5(timeNow.getTime() + "." + Math.random() + "." + playlistController.counterGlobalId);

    return "id_" + id;
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


/**
 * Get Select songs (also from playlists)
 * @returns {Array}
 */
playlistController.getSongListFromSelection = function (callback) {
    var list = [];
    //Extract all songs from selected songs and playlists
    //for (var i = playlistController.selectedElements.length - 1; i >= 0; i--) {

    var loadOnline = false;

    var getSongsFromElement = function (list,elements, index) {
        if (playlistController.selectedElements.length <= index){
            if (loadOnline)
                uiController.disableUI(false);
            if(callback) {
                callback(list);
            }
            return;
        }

        var element = elements[index].obj;
        if (element.isPlaylist) {
            if (element.tracks && element.tracks.length > 0) {
                for (var j = 0; j < element.tracks.length; j++) {
                    list.push(element.tracks[j])
                }
            } else {
                //Get songs from online playlist
                if (element.tracks == undefined) {
                    loadOnline = true;
                    uiController.disableUI(true);

                    searchController.loadPlaylistTracks(element, function () {
                        if (element.tracks && element.tracks.length > 0) {

                            for (var j = 0; j < element.tracks.length; j++) {
                                list.push(element.tracks[j])
                            }
                        }
                        getSongsFromElement(list,elements, index+1) ;

                    })
                     return;
                }

            }

        } else
            list.push(element);

        getSongsFromElement(list,elements, index+1) ;
    }


    getSongsFromElement(list, jQuery.extend(true,[],playlistController.selectedElements), 0);

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
                    playlistController.ui.animateAddedToList($(".currentqueue"));
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


    var songListCallback = function(list){
        playlistController.playSongList(list);
        playlistController.selection.deselectElements();

    }
    playlistController.getSongListFromSelection(songListCallback);


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
                    playlistController.ui.animateAddedToList($(".currentqueue"));
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


    var songListCallback = function(list){
        playlistController.playSongListNext(list);

        playlistController.selection.deselectElements();
    }
    playlistController.getSongListFromSelection(songListCallback);




}


/**
 * Create playlist with selected songs and Load it
 */

playlistController.loadNewPlaylistWithSelectedSongs = function () {


    var songListCallback = function(list){
        if (list.length > 0) {

            playlistController.loadNewPlaylistWithSongs(list)
        }
        playlistController.selection.deselectElements();

    }
    playlistController.getSongListFromSelection(songListCallback);




}


/**
 * Clear Queue except Playng song
 */
playlistController.clearQueue = function () {


    if (playbackController.playingSong)
        playlistController.loadedPlaylistSongs = [jQuery.extend(true, {}, playbackController.playingSong)];
    else
        playlistController.loadedPlaylistSongs = [];

    playlistController.currentQueue.tracks = playlistController.loadedPlaylistSongs;

    playbackController.updatePlayingSongIndex();

    accountController.savePlaylist(playlistController.currentQueue.gid, null, playlistController.currentQueue.tracks);


    $("#playlistInner .iScrollPlayIndicator").hide();

    $("#playlistInner .songlist").addClass("hidden");

    playlistController.ui.applySongList();


}

/**
 * Insert Elements into Queue at Current Position
 * @param event
 * @param position 0/undefinded: play position, 1 at the end
 */

playlistController.insertSongsIntoQueue = function (songs) {


    //Maximum size of current Played Queue
    if(playlistController.currentQueue.tracks.length+songs.length>playlistController.maxPlayQueueSongs){
        var countToManySongs = (playlistController.currentQueue.tracks.length+songs.length)-playlistController.maxPlayQueueSongs;
        if(playlistController.currentQueue.tracks.length>countToManySongs){
            playlistController.currentQueue.tracks = playlistController.currentQueue.tracks.slice(countToManySongs);
            if(playbackController.playingSongIndex < countToManySongs ){
                playbackController.playingSongIndex = playlistController.currentQueue.tracks.length-1;
            }
        }

    }

    var tmp = playlistController.currentQueue.tracks.slice(0, playbackController.playingSongIndex + 1).concat(songs);

    playlistController.currentQueue.tracks = tmp.concat(playlistController.currentQueue.tracks.slice(playbackController.playingSongIndex + 1));


    for (var j = playbackController.playingSongIndex; j < playbackController.playingSongIndex + songs.length && j < playlistController.currentQueue.tracks.length; j++) {
        if (!playlistController.currentQueue.tracks[j].image) {
            setTimeout(mediaController.loadPreview(playlistController.currentQueue.tracks[j]), j * 300);
        }
    }

    if (playlistController.loadedPlaylists["0"]) {
        if (Object.keys(playlistController.loadedPlaylists).length == 1) {
            playlistController.loadedPlaylistSongs = playlistController.currentQueue.tracks;
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
 * @param positionTo
 * @param listToAdd   list of songs AND playlists
 * @param arrowDirection
 */
playlistController.addSongListElementsToPlaylist = function (positionTo, listToAdd, arrowDirection) {

    listToAdd = jQuery.extend(true, [], listToAdd);

    //Let the user choose the playlist
    setTimeout(function () {
        optionsMenu.openChoosePlaylist(positionTo, listToAdd, arrowDirection);
    }, 300)


}

/**
 * Load Shared Playlist from Server
 * @param playlist-hash
 */
playlistController.loadSharedPlaylist = function (hash) {
    $.mobile.loading("show");
    $.ajax({
        timeout: 30000,
        url: preferences.serverURL + "?loadplaylist=" + hash + "&auth=" + authController.ip_token,
        success: function (data) {
            if (authController.ensureAuthenticated(data, function () {
                playlistController.loadSharedPlaylist(hash);
            })) {
                if (data.data) {
                    var songlist = data.data;

                    playlistController.prepareGIDsToInsertSongsIntoPlaylist(playlistController.currentQueue, songlist);
                    playlistController.insertSongsIntoQueue(songlist);
                    if (playlistController.currentQueue.tracks && playlistController.currentQueue.tracks[0]) {
                        playbackController.playSong(playlistController.currentQueue.tracks[0]);
                    }
                    setTimeout(function () {
                        playlistController.loadCurrentQueue();
                    }, 4500);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.dir(xhr.responseText);
        },
        complete: function () {
            $.mobile.loading("hide");
        }
    })
}


/**
 * Add selected Songs to Playlist
 * @param event
 */
playlistController.addSelectedElementsToPlaylist = function (positionTo) {

    var songListCallback = function(list){

        playlistController.addSongListElementsToPlaylist(positionTo, list, "l");

    }
    playlistController.getSongListFromSelection(songListCallback);
}



/**
 * Add playing Songs to Playlist
 * @param event
 */
playlistController.addPlayingSongToPlaylist = function () {

        playlistController.addSongListElementsToPlaylist("#playingSongInfoLink", [playbackController.playingSong], "t");


}



/**
 * Add Songs to Playlist at end
 * @param playlist
 * @param songs
 */

playlistController.addSongsToPlaylist = function (playlist, listToAdd) {

    //Now Songs to load for playlists
    var addSongsToPlaylist = function (playlist, songs) {

        playlistController.prepareGIDsToInsertSongsIntoPlaylist(playlist, songs);
        var oldLength = playlist.tracks.length;
        playlist.tracks = playlist.tracks.concat(songs);


        for (var j = oldLength; j < playlist.tracks.length; j++) {
            if (!playlist.tracks[j].image) {
                setTimeout(mediaController.loadPreview(playlist.tracks[j]), j * 300);
            }
        }


        setTimeout(function () {
            accountController.savePlaylist(playlist.gid, playlist.name, playlist.tracks);
        }, 0);
        $scope.safeApply();
        if (playlistController.playlistMode) {
            if (playlist.gid == playlistController.currentQueue.gid)
                playlistController.ui.animateAddedToList($(".currentqueue"));
            else
                playlistController.ui.animateAddedToList(playbackController.getListElementFromElement(playlist));

        } else if (playlistController.getLoadedPlaylist().gid == playlist.gid) {
            if (Object.keys(playlistController.loadedPlaylists).length == 1) {

                playlistController.loadedPlaylistSongs = playlist.tracks;
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

    var addToList = function (playlist, listToAdd) {

        var addSongsToList = function (listToAdd) {
            if (listToAdd.length > 0) {
                addSongsToPlaylist(playlist, listToAdd);
            }

        }

        uiController.disableUI(true);

        //Load Playlist songs from last.fm if neccessary
        var addPlaylist = function (elements, index, songList) {

            if (index > 0 && elements[index - 1]) {
                //Playlist with loaded Tracks
                if (elements[index - 1].isPlaylist) {
                    if (elements[index - 1].tracks && elements[index - 1].tracks.length) {
                        songList = songList.concat(elements[index - 1].tracks);
                    }
                } else {//Song
                    songList = songList.concat([elements[index - 1]]);

                }
            }

            if (index < elements.length && songList.length < searchController.maxResults) {

                //Playlist without loaded Tracks
                if (elements[index].isPlaylist && !elements[index].tracks) {
                    searchController.loadPlaylistTracks(elements[index], function () {
                        addPlaylist(elements, index + 1, songList);
                    }, false)
                } else//Song
                    addPlaylist(elements, index + 1, songList);

            } else {

                addSongsToList(songList.concat());
                uiController.disableUI(false);

            }
        }


        addPlaylist(listToAdd, 0, [])


    }

    addToList(playlist, listToAdd)


}


/**
 * Add selected Songs to Playlist
 * @param event
 */
playlistController.addSelectedElementsToQueue = function (event) {
    event.stopPropagation();

    var songListCallback = function(list){

        playlistController.addSongsToPlaylist(playlistController.currentQueue, list);
        playlistController.selection.deselectElements();

    }
    playlistController.getSongListFromSelection(songListCallback);


}


/**
 * Remove selected Songs to Playlist
 * @param event
 */
playlistController.removeSelectedElementsFromPlaylist = function (event, noConfirmPopup) {
    event.stopPropagation();
    var doReallyDelete = function () {
        var deletedPlaylist = false;
        for (var i = 0; i < playlistController.selectedElements.length; i++) {

            var element = playlistController.selectedElements[i].obj;
            if (element.gid) {

                if (element.isPlaylist) {
                    for (var j = 0; j < playlistController.playlists.length; j++) {
                        if (playlistController.playlists[j].gid == playlistController.selectedElements[i].obj.gid) {
                            accountController.deletePlaylist(playlistController.playlists[j].gid);

                            playlistController.playlists.splice(j, 1);
                            deletedPlaylist = true;
                            j--;
                        }
                    }


                } else {
                    var playlist = playlistController.getLoadedPlaylist();
                    for (var j = 0; j < playlist.tracks.length; j++) {
                        if (playlist.tracks[j].gid == playlistController.selectedElements[i].obj.gid) {
                            playlist.tracks.splice(j, 1);
                            j--;
                            accountController.savePlaylist(playlist.gid, playlist.name, playlist.tracks);

                        }
                    }
                    for (var j = 0; j < playlistController.loadedPlaylistSongs.length; j++) {
                        if (playlistController.loadedPlaylistSongs[j].gid == playlistController.selectedElements[i].obj.gid) {
                            playlistController.loadedPlaylistSongs.splice(j, 1);
                            j--;
                        }
                    }

                }


            }


        }
        console.log(":::::::::::::::::::::::::::: " + deletedPlaylist)
        if (deletedPlaylist) {
            accountController.savePlaylistsPosition();

        }

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
        playlistController.selection.deselectElements();

    }

    //Extract all songs from selected songs and playlists
    //for (var i = playlistController.selectedElements.length - 1; i >= 0; i--) {
    var playlistsDelete = false;
    if (!noConfirmPopup) {

        for (var i = 0; i < playlistController.selectedElements.length; i++) {
            var element = playlistController.selectedElements[i].obj;
            if (element.gid && element.isPlaylist) {
                playlistsDelete = true;
                break;
            }
        }
    }


    if (playlistsDelete) {

        $("#popupConfirm").popup('open', {transition: 'pop'});
    }
    else
        doReallyDelete();


}

/**
 * Share selected Elements
 * @param event
 */
playlistController.shareSelectedElements = function (event) {
    event.stopPropagation();

    //playlistController.selectedElements


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
 * Triggered if chosen selected elements changes
 */


playlistController.onLoadedPlaylistsChanged = function () {


    var closefunc = function () {

        setTimeout(function () {
            $("#playlistselectvertical .chosen-container").removeClass("chosen-with-drop");
            uiController.updateUI();
        }, 0)

        if (Object.keys(playlistController.loadedPlaylists).length != 0) {
            //Save Queue Scroll Position
            playlistController.ui.chosenClose();

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
            playlistController.selection.updateDeselectedSong();

            uiController.updateUI();

            setTimeout(function () {


                $("#playlistview").listview('refresh');
                uiController.playListScroll.scrollTo(0, playlistController.playlistsScrollY, 0);

                $("#playlistview").show();

                playlistController.dragging.makePlayListSortable();
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

            //    var searchChoice = searchChoices.get(searchChoices.length - 1);
            searchChoice.find(".search-choice-close").attr("title", "Close")
            var playlist = null;

            for (var i = 0; i < playlistController.playlists.length; i++) {
                if (playlistController.playlists[i].name == name)
                    playlist = playlistController.playlists[i];
            }


            if (playlist != null && !playlistController.loadedPlaylists[playlist.gid]) {

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


                //Get Similar Songs
                if (playlist.isSimilarSongs && playbackController.playingSong) {

                    if (playlistController.similarSongs.song.name != playbackController.playingSong.name || playlistController.similarSongs.song.artist.name != playbackController.playingSong.artist.name) {
                        $.mobile.loading("show");

                        playlistController.getSimilarSongs(playbackController.playingSong);

                    }


                }

                playlistController.loadPlaylist(playlist);
            }
        } else if (Object.keys(playlistController.loadedPlaylists).length != 0) //No new means one deleted
            closefunc();

    } else if (Object.keys(playlistController.loadedPlaylists).length != 0) // deleted
        closefunc();


    $('#playlistselectvertical .search-choice').data('loaded', 'true')

    if ($('#playlistselectverticalform option:selected').size() > 1)
        $("#clearChoosenPlaylists").show();
    else
        $("#clearChoosenPlaylists").hide();


    uiController.updateUI();

    $('.search-choice-close').unbind('click', closefunc);
    $(".search-choice-close").click(closefunc)


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
                delete playlist.isUnnamedPlaylist;

                $scope.safeApply();
                accountController.savePlaylist(playlist.gid, playlist.name);

            }


        }, 150)
    }

}


playlistController.importPlaylistPopup = function (event) {
    if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 450)
        return;
    if (event)
        event.stopPropagation();

    $("#popupImportInput").popup("open", {transition: 'pop'});

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

    playlistController.loadedPlaylistSongs = playlist.tracks;


    /*  for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
     playlistController.loadedPlaylistSongs[i].id = "plsid" + helperFunctions.padZeros(i, ("" + playlistController.loadedPlaylistSongs.length).length);
     //   console.log("::: "+ playlistController.loadedPlaylistSongs[i].gid)
     }*/

    if (Object.keys(playlistController.loadedPlaylists).length > 1 || !playlistController.loadedPlaylists["0"]) {
        $("#playlisthelp").html(playlistController.playlistHelp.playlist)
    } else {
        $("#playlisthelp").html(playlistController.playlistHelp.queue)
    }


    // $("#playlistview").hide();
    /* $scope.safeApply();
     playbackController.remarkSong();
     playlistController.selection.updateDeselectedSong();
     */
    playlistController.hideHelp = false;
    playlistController.ui.applySongList();


    //List was loaded first time after creation, so ask ro rename it
    if (playlistController.renameLoadedPlaylist) {
        playlistController.renameLoadedPlaylist = false;
        var showRename = function () {
            if ($(".ui-popup-container.ui-popup-active , .ui-popup-container.reverse.out").length == 0) {
                playlistController.editedPlaylist = jQuery.extend(true, {}, playlist);
                playlistController.editedPlaylistTitle = "New Playlist";
                $scope.safeApply();

                $("#popupTextInput").popup('open', {positionTo: "window", transition: 'pop'});
            } else
                setTimeout(showRename, 150)

        }
        setTimeout(showRename, 0)

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

playlistController.createEmptyPlaylist = function (addAtBottom, name) {

    if (!name)
        name = "Playlist";

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
 ** Get Similar Songs from last.fm
 */

playlistController.getSimilarSongs = function (song) {
    playlistController.similarSongs.song = jQuery.extend(true, {}, song);

    var artist = song.artist.name;
    var title = song.name;

    var onlineSearchURL = "http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&%searchTerm&api_key=" + searchController.lastfmapikey + "&format=json"

    $.when(

            exploreController.basicOnlineSearchDeferred(onlineSearchURL, "artist=" + artist + "&track=" + title, searchController.searchTypeSongs, false, artist)

        ).then(function (onlineList) {


            var songList = exploreController.songs.completeSearch([], onlineList);

            if (songList && songList.length > 0) {
                for (var i = 0; i < songList.length; i++) {
                    songList[i].gid = playlistController.getNewID();
                }
                playlistController.similarSongs.tracks = songList.splice(0, playlistController.similarSongsMaxResults);

                if (playlistController.getLoadedPlaylist().isSimilarSongs) {
                    playlistController.loadedPlaylistSongs = playlistController.similarSongs.tracks;

                    uiController.playListScroll.scrollTo(0, 0, 1000)

                    $("#playlistInner .iScrollPlayIndicator").hide();
                    $("#playlistInner .iScrollIndicator").hide();
                    playlistController.ui.applySongList();
                }

            }


            $.mobile.loading("hide");


        });

}


/**
 ** Load Similar Songs
 */

playlistController.loadSimilarSongs = function () {
    if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 450)
        return;
    uiController.swipeTimer = Date.now();

    var playlist = playlistController.similarSongs;


    $scope.safeApply();
    setTimeout(function () {
        playlistController.ui.showPlaylist(playlist);
        setTimeout(function () {
            $scope.safeApply();
        }, 50)
    }, 0)

    event.stopPropagation();

}

/**
 ** Load Current Queue
 */

playlistController.loadCurrentQueue = function () {

    if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 450)
        return;
    uiController.swipeTimer = Date.now();


    var playlist = playlistController.currentQueue;
    $scope.safeApply();

    setTimeout(function () {
        playlistController.ui.showPlaylist(playlist);
        setTimeout(function () {
            $scope.safeApply();
        }, 50)
    }, 0)
    if (event)
        event.stopPropagation();

}


/**
 * Create playlist with songs and Load it
 */

playlistController.loadNewPlaylistWithSongs = function (songs, playlistName) {
    songs = jQuery.extend(true, [], songs);

    $.mobile.loading("show");

    var playlist = playlistController.createEmptyPlaylist(false, playlistName);

    for (var i = 0; i < songs.length; i++) {
        var song = jQuery.extend(true, {}, songs[i]);
        if (song.playlistgid != playlistController.currentQueue.gid || !song.gid)
            song.gid = playlistController.getNewID()

        song.playlistgid = playlist.gid;
        song.id = "plsid" + helperFunctions.padZeros(song, ("" + playlistController.loadedPlaylistSongs.length).length);
        songs[i] = song;

    }

    playlist.tracks = songs;

    //Load cover Images if not already loaded
    for (var j = 0; j < playlist.tracks.length; j++) {
        if (!playlist.tracks[j].image) {
            setTimeout(mediaController.loadPreview(playlist.tracks[j]), j * 300);
        }
    }

    setTimeout(function () {
        accountController.savePlaylist(playlist.gid, playlist.name, playlist.tracks);
        accountController.savePlaylistsPosition();
    }, 0)

    $("#playlistview").hide();
    $("#playlisthelp").hide();

    playlistController.renameLoadedPlaylist = true;

    $scope.safeApply();
    setTimeout(function () {
        playlistController.ui.showPlaylist(playlist);

    }, 0)

}


/**
 * Add empty Playlist Funktion and Load it
 */

playlistController.loadNewEmptyPlaylist = function () {
    if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 450)
        return;
    uiController.swipeTimer = Date.now();

    var playlist = playlistController.createEmptyPlaylist();
    setTimeout(function () {
        accountController.savePlaylist(playlist.gid, playlist.name, []);
        accountController.savePlaylistsPosition();
    }, 0)


    playlistController.renameLoadedPlaylist = true;

    $scope.safeApply();

    setTimeout(function () {
        playlistController.ui.showPlaylist(playlist);
    }, 0)

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



