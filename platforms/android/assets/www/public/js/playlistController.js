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


//Playlists visible
playlistController.playlistMode = true;
//Loaded Playlists
playlistController.loadedPlaylists = {};

playlistController.loadedPlaylistSongs = [];

playlistController.selectPlaylistsPlaceholder = "Search Playlists";

playlistController.NOINTERNETHACK = playlistController.loadedPlaylistSongs;
playlistController.loadedPlaylistSongs = [];


playlistController.selectedSongs = [];


for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
    playlistController.loadedPlaylistSongs[i].gid = playlistController.getNewID();//;"gsid" + helperFunctions.padZeros(i, ("" + playlistController.loadedPlaylistSongs.length).length);
    playlistController.loadedPlaylistSongs[i].id = "plsid" + helperFunctions.padZeros(i, ("" + playlistController.loadedPlaylistSongs.length).length);
    //   console.log("::: "+ playlistController.loadedPlaylistSongs[i].gid)
}

playlistController.globalId = "";//playlistController.loadedPlaylistSongs.length;


playbackController.playedSongs = [];


/*
playlistController.playlists = [
    {gid: 0, id: 0, name: "Rock", isPlaylist: true, tracks: playlistController.loadedPlaylistSongs},
    {gid: 1, id: 1, name: "Charts4/13", isPlaylist: true, tracks: []},
    {gid: 2, id: 2, name: "Chillout", isPlaylist: true, tracks: []},
    {gid: 3, id: 3, name: "Vocals", isPlaylist: true, tracks: []},
    {gid: 4, id: 4, name: "Trance", isPlaylist: true, tracks: []},
    {gid: 5, id: 5, name: "Electro '14", isPlaylist: true, tracks: []}

];
  */

for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
    playlistController.loadedPlaylistSongs[i].playlistgid = 0;
}


//window.localStorage.playlists = null;
/*
 var playlists = window.localStorage.playlists;
 if (playlists)
 playlistController.playlists = JSON.parse(playlists);

 */


playlistController.globalIdPlaylist = "";//playlistController.playlists.length;


playlistController.loadedPlaylistSongs = [];
playlistController.playlists = [];  //CLEAR_______________________________________________________________





playlistController.counterGlobalId = 0;//playlistController.loadedPlaylistSongs.length; //TODO


playlistController.init = function () {


    setTimeout(function () {
        $("#playlistInner").show();
    }, 500);


    playlistController.makePlayListScrollable();

    $("#playlistselectverticalform").chosen({disable_search_threshold: 2})

    $(".chosen-choices").addClass("ui-input ui-body-a ui-corner-all ui-shadow-inset");
    $(".chosen-choices").css("min-height", "2.2em");


    $(".chosen-choices input").css("margin-top", "5px")
    $(".chosen-container").css("margin-top", "-3px")


    $("#playlistselectverticalform").on('change', function (evt, params) {
        //on trigger, all playlists still there, after ms gone if return key pressd
        var playlistsOldLoaded = [];


        if ($("#playlistselectvertical .search-choice").length > 0) {
            $("#playlistselectvertical .search-field input").attr("placeholder", "");
            $('#playlistselectvertical .search-choice').each(function () {

                playlistsOldLoaded.push($(this).text());
                if ($(this).data('loaded') != "true") {
                    var playlist = null;
                    var name = $(this).text();
                    for (var i = 0; i < playlistController.playlists.length; i++) {
                        if (playlistController.playlists[i].name == name)
                            playlist = playlistController.playlists[i];
                    }

                    if (playlist != null) {
                        playlistController.loadPlaylist(playlist);

                    }

                }

            })
        }
        //Check if playlist was deleted, is gone after 50 ms in dom
        setTimeout(function () {

            for (var i = 0; i < playlistsOldLoaded.length; i++) {
                var name = playlistsOldLoaded[i];
                var selections = $('#playlistselectvertical .search-choice');
                var found = false;
                for (var j = 0; j < selections.length; j++) {
                    if ($(selections.get(j)).text() == name) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    console.log("REMOVED")
                    var playlistgid = null;
                    for (var i = 0; i < playlistController.playlists.length; i++) {
                        if (playlistController.playlists[i].name == name) {
                            playlistgid = playlistController.playlists[i].gid
                            break;
                        }
                    }

                    if (playlistgid != null) {
                        playlistController.removeLoadedPlaylist(playlistgid);
                    }

                }
            }
        }, 50)


        $('#playlistselectvertical .search-choice').data('loaded', 'true')

        if ($('#playlistselectverticalform option:selected').size() > 1)
            $("#clearChoosenPlaylists").show();
        else
            $("#clearChoosenPlaylists").hide();


        uiController.updateUI();


        var closefunc = function () {

            setTimeout(function(){
                $("#playlistselectvertical .chosen-container").removeClass("chosen-with-drop");
            },0)

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
            uiController.updateUI();

        }
        $('.search-choice-close').unbind('click', closefunc);
        $(".search-choice-close").click(closefunc)



    });


    $("#clearChoosenPlaylists").hide();
    uiController.updateUI();

    $("#playlistview").hide();
    $scope.safeApply();
    setTimeout(function () {
        $("#playlistview").listview('refresh');
        $("#playlistview").show();
        playlistController.makePlayListSortable();
        setTimeout(function () {
            uiController.playListScroll.refresh();
        }, 150)
    }, 0)


    $('#playlistselectvertical .chosen-container').click(function (event) {
        if ($('#playlistselectvertical #clearChoosenPlaylists:hover, #playlistselectvertical .search-choice:hover').length == 0)
            $(".chosen-drop").addClass("visible")
        else
         setTimeout(function(){
             $("#playlistselectvertical .chosen-container").removeClass("chosen-with-drop");
         },0)
    });


    $('#playlistselectvertical #clearChoosenPlaylists').click(function (event) {


        if (playlistController.unsafedSongsExists()) {
            $("#playlistselectvertical .chosen-container").removeClass("chosen-with-drop");
            $("#popupConfirm").popup("option", "positionTo", "#clearChoosenPlaylists");
            $("#popupConfirm").popup("option", "transition", "pop");

            uiController.popupConfirm = {doIt: function () {
                uiController.showPlaylists();
            }}
            setTimeout(function () {
                $("#popupConfirm").popup("open");
            }, 150)

        }
        else {
            uiController.showPlaylists();

        }

    });


    $('.chosen-container input').blur(function () {
        setTimeout(uiController.updateUI, 100);
    });


    playlistController.makePlayListSortable();

    uiController.updateUI();
    setTimeout(function () {

        uiController.updateUI();
        $("#playlist").addClass("fadeincomplete");
        $(".sortable").sortable("disable");
        // $("#playlist").css("opacity", "1");
    }, 0);


    $("#playlistselectvertical .ui-input-clear").appendTo("#playlistselectvertical .ui-input");
    $("#playlistselectvertical .search-field input").attr("placeholder", playlistController.selectPlaylistsPlaceholder)


    setTimeout(function () {
        uiController.playListScroll.refresh();
        playlistController.playIndicator = searchController.playIndicator.clone();

        playlistController.playIndicator .appendTo("#playlistInner .iScrollVerticalScrollbar");

        playlistController.playIndicator .click(function () {
            uiController.playListScroll.scrollToElement(".loadedsong", 700);
        });

        $(".iScrollIndicator").addClass("fadeincomplete");

    }, 150)






}


playlistController.getNewID = function () {
    var timeNow = new Date();
    playlistController.counterGlobalId++;
    var id = MD5(timeNow.getTime() + "." + Math.random() + "." + playlistController.counterGlobalId);
    return "id_" + id;
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
            //if (!playlistController.sortPlaylist)
            //    playlistController.toggleSortablePlaylist(false, true);
            listElement = $("#playlistInner li[data-songgid='playlistsong" + song.gid + "'] ");
        }
        else {
            listElement = $("#searchlist li[data-songtitle='" + song.name + "-" + mediaController.getSongArtist(song) + "'] ");
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
    if (playlistController.selectedSongs.length > 0 && $("#songOptions").length > 0) {
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

        $("#songOptions").css("left", (63 + width) + "px");
    }
}

/**
 * Show Songs Options
 */
playlistController.showSongOptions = function (listElement, song) {
    setTimeout(function () {


        if (playlistController.selectedSongs.length > 0 && playlistController.selectedSongs[ playlistController.selectedSongs.length - 1].song == song && listElement.hasClass("selected")) {
            var width = $("<h3 id='textMeasuring' style='opacity:0;z-index:10000000;top:80px;left:0;font-size: 1em;font-weight: bold;position:absolute'>" + song.name + "</h3>").appendTo("body").width()
            var widthTitle = $("<div id='textMeasuring2' style='opacity:0;z-index:10000000;top:110px;left:0;font-size: .75em;position:absolute'>" + mediaController.getSongArtist(song) + "<span style='font-style: italic;font-size: .93em;margin-left:2px;'> " + playlistController.getPlaysText(song) + "</span></div>").appendTo("body").width()
            $("#textMeasuring").remove();
            $("#textMeasuring2").remove();

            if (width < widthTitle)
                width = widthTitle;
            width = width + 35;

            if (63 + width + 150 > listElement.outerWidth() - 50)
                width = listElement.outerWidth() - 150 - 63 - 50;

            $("#songOptionsOriginal").clone(true, true).attr("id", "songOptions").appendTo(listElement)

            $("#songOptions").css("opacity", "0");
            $("#songOptions").css("left", (63 + width + 20) + "px");
            $("#songOptions").addClass("noanim").hide();

            $("#songOptions").removeClass("noanim").show();

            setTimeout(function () {


                $("#songOptions").css("left", (63 + width) + "px");

                $("#songOptions").css("opacity", "0.83");

            }, 0)
        }
    }, 600)
}


/**
 * Hide Songs Options
 */
playlistController.hideSongOptions = function () {
    if ($("#songOptions").length > 0) {
        $("#songOptions").css("opacity", "0");
        $("#songOptions").css("width", "0px");
        $("#songOptions").css("left", (parseInt($("#songOptions").css("left").replace("px", "")) - 5) + "px");
        setTimeout(function () {
            $("#songOptions").remove();
        }, 200)
    }
}


/**
 * True if unsafed Songs in playlist
 */
playlistController.unsafedSongsExists = function () {

    if (playlistController.playlistMode)
        return false;

    for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
        if (!playlistController.loadedPlaylistSongs[i].playlistgid)
            return true;
    }

    return false;
}

/**
 * Play Selection
 * @param event
 */
playlistController.playSelection = function (event) {
    event.stopPropagation();


    for (var i = 0; i < playlistController.selectedSongs.length; i++) {


    }


    playlistController.deselectSongs();

}


/**
 * Remove selected Songs to Playlist
 * @param event
 */
playlistController.removeSongsFromPlaylist = function (event) {
    event.stopPropagation();


    playlistController.deselectSongs();

}

/**
 * Add selected Songs to Playlist
 * @param event
 */
playlistController.addSongsToPlaylist = function (event) {
    event.stopPropagation();


    playlistController.deselectSongs();

}

/**
 * Save Playlist
 * @param useSelected  use the only seleted playlist
 * @returns {number|gid|playlists.gid|gid|.data.gid|string|string}
 */

playlistController.savePlaylist = function (useSelected) {

    if (!useSelected)
        var playlistTitle = $("#saveplaylistinpt").val();
    else
        playlistTitle = $('#playlistselectvertical .search-choice').text();

    if (playlistTitle) {

        /*
         var playlists = window.localStorage.playlists;
         if (!playlists || playlists == "null" || playlists == "undefined" || playlists == "false")
         playlists = playlistController.playlists;
         else
         playlists = JSON.parse(playlists);
         */

        playlistController.loadedPlaylistSongs = $.extend(true, [], playlistController.loadedPlaylistSongs);

        var exists = false;
        for (var i = 0; i < playlists.length; i++) {
            if (playlists[i].name == playlistTitle) {
                exists = true;
                for (var j = 0; j < playlistController.loadedPlaylistSongs.length; j++) {
                    playlistController.loadedPlaylistSongs[j].playlistgid = playlists[i].gid;
                    var newGid = playlistController.getNewID();
                    if (playbackController.playingSong && playbackController.playingSong.gid == playlistController.loadedPlaylistSongs[j].gid)
                        playbackController.playingSong = playlistController.loadedPlaylistSongs[j];

                    playlistController.loadedPlaylistSongs[j].gid = newGid


                }
                playlists[i].tracks = playlistController.loadedPlaylistSongs;
                var playlist = playlists[i];
                // playlists.splice(i,1);
                break;
            }
        }


        if (!exists) {

            playlistController.globalIdPlaylist = playlistController.getNewID();
            for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
                playlistController.loadedPlaylistSongs[i].playlistgid = playlistController.globalIdPlaylist;
            }
            playlist = {gid: playlistController.globalIdPlaylist, id: playlistController.globalIdPlaylist, name: playlistTitle, isPlaylist: true, tracks: playlistController.loadedPlaylistSongs}
            playlists.push(playlist);

        }


        //playlistController.globalIdPlaylist++;
        playlistController.playlists = playlists;

        // window.localStorage.playlists = JSON.stringify(playlists);
        // alert("SAVE!!");
        console.dir("SAVE");
        console.dir(playlistController.playlists);
        console.dir("----");
        for (var i = 0; i < playlistController.playlists.length; i++) {
            accountController.savePlaylist(playlistController.playlists[i].gid, playlistController.playlists[i].name, i, JSON.stringify(playlistController.playlists[i].tracks))
        }

        $scope.safeApply();


        $("#playlistview").listview('refresh');
        $("#playlistview li").removeClass("fadeslideincompletefast");

        $('#playlistselectverticalform').trigger('chosen:updated');
        return   playlist.gid;
    }


}


playlistController.selectPlaylist = function (playlist) {
    $("#playlistselectvertical .search-field input").attr("placeholder", "");
    $('#playlistselectverticalform option[value="' + playlist.gid + '"]').prop('selected', true);
    $('#playlistselectverticalform').trigger('chosen:updated');

    setTimeout(function () {
        $('#playlistselectverticalform').trigger('chosen:close');
        if ($('#playlistselectverticalform option:selected').size() > 1)
            $("#clearChoosenPlaylists").show();
        else
            $("#clearChoosenPlaylists").hide();
        $("#playlistselectverticalform").trigger('change');
        uiController.updateUI();
    }, 0)


}


playlistController.deselectSongs = function (event) {
//Remove Selection

    if (event)
        event.stopPropagation();

    $(".songlist li.selected").removeClass("selected");
    playlistController.selectedSongs = [];

    playlistController.hideSongOptions();
}


playlistController.removeLoadedPlaylist = function (playlistgid) {

    playlistController.loadedPlaylists[playlistgid] = {};
    delete  playlistController.loadedPlaylists[playlistgid];

    for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
        if (playlistController.loadedPlaylistSongs[i].playlistgid == playlistgid) {
            playlistController.loadedPlaylistSongs.splice(i, 1);
            i--;
        }
    }

    if (playlistController.loadedPlaylistSongs.length == 0 && $('#playlistselectvertical .search-choice').length == 0) {
        playlistController.loadedPlaylistSongs = playlistController.playlists;
        $("#playlistselectvertical .search-field input").attr("placeholder", playlistController.selectPlaylistsPlaceholder)
        playlistController.loadedPlaylists = {};
        playlistController.playlistMode = true;
        $("#playlistInner .iScrollPlayIndicator").hide();
        $("#searchlist .iScrollPlayIndicator").hide();
        $("#clearChoosenPlaylists").hide();
        $('#playlistselectverticalform').trigger('chosen:updated');


    } else {
        if ($('#playlistselectverticalform option:selected').size() > 1)
            $("#clearChoosenPlaylists").show();
        else
            $("#clearChoosenPlaylists").hide();

    }


    $("#playlistview").hide();
    $scope.safeApply();
    setTimeout(function () {
        $("#playlistview").listview('refresh');
        $("#playlistview").show();
        playlistController.makePlayListSortable();
        setTimeout(function () {
            uiController.playListScroll.refresh();
        }, 150)
    }, 0)


}


playlistController.loadPlaylist = function (playlist) {
    $("#playlistselectvertical .search-field input").attr("placeholder", "")

    playlistController.loadedPlaylists[playlist.gid] = playlist;

    if (playlistController.playlistMode) {
        //  playlistController.loadedPlaylistSongs.length > 0 && playlistController.loadedPlaylistSongs[0].isPlaylist)
        playlistController.loadedPlaylistSongs = [];
        playlistController.playlistMode = false;
    }

    console.log("----GGGG------")
    console.dir(playlist)
    playlistController.loadedPlaylistSongs = playlist.tracks.concat(playlistController.loadedPlaylistSongs)
    for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
        playlistController.loadedPlaylistSongs[i].id = "plsid" + helperFunctions.padZeros(i, ("" + playlistController.loadedPlaylistSongs.length).length);
        //   console.log("::: "+ playlistController.loadedPlaylistSongs[i].gid)
    }


    // $("#playlistview").hide();
    $scope.safeApply();

    $("#playlistview").listview('refresh');
    playbackController.remarkSong();

    playlistController.makePlayListSortable();

    setTimeout(function () {
        uiController.playListScroll.refresh();
    }, 150)


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

    if (song.playlistgid && playlistController.loadedPlaylists[song.playlistgid]) {
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
    if (song.trend == 0 || song.trend == 1 || song.trend == 2) {
        return "songTitleMargin";
    }
    return "";

}


/**
 *
 */
playlistController.getTrendTitleStyle = function (song) {
    console.log(song.trend)
    if (song.trend == 0 || song.trend == 1 || song.trend == 2) {
        return "margin-left:13px!important;";
    }
    return "";

}

/**
 *
 */
playlistController.getPlaysText = function (song) {
    if (song.playcount !== undefined && song.playcount)
        return " - " + song.playcount

    return "";

}

/**
 *
 * @param event
 */
playlistController.scrollByWheel = function(event){
    uiController.playListScroll.handleEvent(event);

}

/**
 * Called wenn mousemove
 * @param event
 */
playlistController.scrollByDragCallback = function (event) {

    if (uiController.draggingSortableSong || uiController.draggingSong) {

        var dragEle = $(".draggedsortablelistelement, .draggedsearchlistelement");


        console.dir(dragEle)

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

            console.log(doScroll + "    " + scrollY)
            if (doScroll)
                uiController.playListScroll.scrollTo(0, scrollY, 1000)


        }

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

}


/**
 * Make Playlist Drag and Droppable
 */
playlistController.makePlayListSortable = function () {


    $("#playlistInner li").on("mousedown",function (event) {
        console.log("MDOWN")
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


    }).on("mouseup", function (event) {

            if ($(this).parents("#playlistInner").length == 0)
                return;
            if (uiController.swiping || (playlistController.dragDraggableSongY > 0 && Math.abs(event.clientY - playlistController.dragDraggableSongY) > 30)) {
                uiController.swipeTimer = Date.now();
                playlistController.dragDraggableSongY = -10;
            }
            playlistController.dragDraggableSongTimer = 0;
            uiController.swiping = false;
            playlistController.dragDraggableSongY = 0;
        })
        .on("mousemove", function (event) {
            if ($(this).parents("#playlistInner").length == 0)
                return;
            if (uiController.swiping || (playlistController.dragDraggableSongY > 0 && Math.abs(event.clientY - playlistController.dragDraggableSongY) > 30)) {
                uiController.swipeTimer = Date.now();
                uiController.swiping = true;
                console.log("SWIPING")
            }

            if (playlistController.sortPlaylist) {
                console.log("MMOUVE")
                uiController.stopPlaylistScrollingOnClick(event);
                if ($(this).parents("#playlistInner").length == 0)
                    return;
                if (playlistController.dragDraggableSongTimer && Date.now() - playlistController.dragDraggableSongTimer < 500 && Date.now() - playlistController.dragDraggableSongTimer > 100) {

                    playlistController.dragDraggableLastSongTimer = Date.now();
                    playlistController.dragDraggableSongTimer = 0;

                    $(".sortable").sortable("enable");

                    var coords = {
                        clientX: playlistController.dragDraggableSongStartEvent.clientX,
                        clientY: playlistController.dragDraggableSongStartEvent.clientY
                    };
                    $(playlistController.dragDraggableSongStartElement).simulate("mouseup", coords);

                    // this actually triggers the drag start event
                    $(playlistController.dragDraggableSongStartElement).simulate("mousedown", coords);

                }
            }
        }

    )


    $("#playlistview").sortable({
        tolerance: "pointer",
        dropOnEmpty: true,
        revert: true,
        opacity: 0.9,
        items: ".playlistsong",
        helper: function (event, $item) {
            $("#songOptions").appendTo("body").hide();


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
            // setTimeout(function(){ debugger; },1000)
            playlistController.hideSongOptions();

            $("#playlistInner").offset().top

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

                if ($(this).hasClass("createplaylist"))
                    return;

                if ($(this).hasClass("playlistsong")) {
                    console.dir("Playlist " + $(this).find("h3").text())


                    id = this.dataset.index;

                    var found = false;
                    var isElement = false;

                    if (playlistController.draggedElements) {

                        if (this.dataset.songgid && ui.item[0].dataset.index == this.dataset.index)
                            isElement = true;
                        else {
                            playlistController.draggedElements.each(function (index) {
                                var dragid = playlistController.draggedElements[index].dataset.index;

                                if (dragid == id)
                                    found = true;
                            })

                        }

                    }

                    if (isElement) {//Was Dragged
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
                    else if (!found) {
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
                    found = false;
                    isElement = false;
                    if (playlistController.draggedElements) {

                        if (!this.dataset.songgid && ui.item[0].dataset.index == this.dataset.index)
                            isElement = true;

                    }
                    if (isElement) {//Was Dragged
                        playlistController.draggedElements.each(function (index) {
                            var id = playlistController.draggedElements[index].dataset.index;

                            var actSong = searchController.searchResults[parseInt(id)];

                            actSong = jQuery.extend(true, {}, actSong);

                            actSong.gid = playlistController.getNewID();//"plsgid" + playlistController.globalId;
                            //playlistController.globalId = playlistController.globalId + 1;


                            actSong.id = "plsid" + helperFunctions.padZeros(actPlsid, ("" + playlistController.loadedPlaylistSongs.length).length);


                            newLoadedPlaylistSongs.push(actSong);
                            actPlsid = actPlsid + 1;


                        })
                    }
                    else {

                        var actSong = searchController.searchResults[parseInt(id)];

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


            console.log("newLoadedPlaylistSongs___________________________")
            console.dir(newLoadedPlaylistSongs)
            playlistController.loadedPlaylistSongs = newLoadedPlaylistSongs;

            if (playlistController.playlistMode)
                playlistController.playlists = playlistController.loadedPlaylistSongs;
            else{
                if ($('#playlistselectverticalform option:selected').size() > 1)
                    $("#clearChoosenPlaylists").show();
                else
                    $("#clearChoosenPlaylists").hide();
            }


            console.log("DROPPED------------------------------")
            console.log($("#playlistview").get(0))
            console.log("------------------------------")
            console.dir(playlistController.loadedPlaylistSongs)
            console.log("------------------------------")
            var scrollY = uiController.playListScroll.y

            $("#playlistInner").hide();
            $("#playlistInner").html(
                window.$compile(
                    preloadhtml.playlisthtml
                )($scope));
            $scope.safeApply();
            $("#playlistview li").removeClass("fadeslideincompletefast");
            $("#playlistview").listview();
            playlistController.makePlayListScrollable();


            $("#playlistview").listview('refresh');
            uiController.playListScroll.scrollTo(0, scrollY);


            $("#playlistInner").show();
            uiController.updateUI();


            console.log($("#playlistview").get(0))
            console.log("------------------------------")


            setTimeout(function () {
                playbackController.remarkSong();
                uiController.playListScroll.refresh();

            }, 150)



            if (uiController.startedSortPlaylist) {
                playlistController.toggleSortablePlaylist();
                uiController.startedSortPlaylist = false;
            }
            setTimeout(function () {
                playlistController.makePlayListSortable();
                $(".sortable").sortable("disable");
            }, 0)

        },
        appendTo: 'body',
        zIndex: "1000000" //or greater than any other relative/absolute/fixed elements and droppables
    }).disableSelection();

}




/**
 * Add empty Playlist Funktion
*/

 playlistController.createEmptyPlaylist = function () {

     var id = playlistController.getNewID();
     var playlist = {gid: id, id: id, name: "Unnamed Playlist", isUnnamedPlaylist:true, isPlaylist: true, tracks: []};
     playlistController.playlists.unshift(playlist);
     $scope.safeApply();

     setTimeout(function(){
         playlistController.selectPlaylist(playlist);
     },0)



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

    playlistController.sortPlaylist = !playlistController.sortPlaylist
    if (playlistController.sortPlaylist) {

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


        $(".sortable").sortable("disable");

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



playlistController.getHelpStyleClass = function(){

   if(!playlistController.playlistMode &&playlistController.loadedPlaylistSongs.length==0){
     return "";
   }else{
       return "invisible";

   }
}