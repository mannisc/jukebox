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


playlistController.loadedPlaylistSongs = new Array();

playlistController.loadedPlaylistSongs = new Array();

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


playlistController.playlists = [
    {gid: 0, id: 0, name: "Rock", isPlaylist: true, tracks: playlistController.loadedPlaylistSongs},
    {gid: 1, id: 1, name: "Charts4/13", isPlaylist: true, tracks: []},
    {gid: 2, id: 2, name: "Chillout", isPlaylist: true, tracks: []},
    {gid: 3, id: 3, name: "Vocals", isPlaylist: true, tracks: []},
    {gid: 4, id: 4, name: "Trance", isPlaylist: true, tracks: []},
    {gid: 5, id: 5, name: "Electro '14", isPlaylist: true, tracks: []}

];


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


playlistController.loadedPlaylistSongs = playlistController.playlists;

playlistController.loadedPlaylistSongs = [];
playlistController.playlists = [];  //CLEAR_______________________________________________________________

playlistController.counterGlobalId = 0;//playlistController.loadedPlaylistSongs.length; //TODO

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
            var widthTitle = $("<div id='textMeasuring2' style='opacity:0;z-index:10000000;top:110px;left:0;font-size: .75em;position:absolute'>" + mediaController.getSongArtist(song) + "</div>").appendTo("body").width()
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
                $("#songOptions").css("width", "0px");


                $("#songOptions").css("left", (63 + width) + "px");

                $("#songOptions").css("width", "199px");
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

    for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
        if (!playlistController.loadedPlaylistSongs[i].playlistgid) {
            return true;

        }
    }

    return false;
}

/**
 * Play Selection
 * @param event
 */
playlistController.playSelection = function (event) {
    event.stopPropagation();


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

        var playlists = window.localStorage.playlists;

        if (!playlists || playlists == "null" || playlists == "undefined" || playlists == "false")
            playlists = playlistController.playlists;
        else
            playlists = JSON.parse(playlists);

        var exists = false;
        for (var i = 0; i < playlists.length; i++) {
            if (playlists[i].name == playlistTitle) {
                exists = true;
                for (var j = 0; j < playlistController.loadedPlaylistSongs.length; j++) {
                    playlistController.loadedPlaylistSongs[j].playlistgid = playlists[i].gid;
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
        $('#playlistselectverticalform').trigger('chosen:updated');
        return   playlist.gid;
    }


}


playlistController.selectPlaylist = function (playlist) {

    $('#playlistselectverticalform option[value="' + playlist.gid + '"]').prop('selected', true);
    $('#playlistselectverticalform').trigger('chosen:updated');

    setTimeout(function () {
        $('#playlistselectverticalform').trigger('chosen:close');
        $("#clearChoosenPlaylists").show();
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


playlistController.loadPlaylist = function (playlist) {

    if (playlistController.loadedPlaylistSongs.length > 0 && playlistController.loadedPlaylistSongs[0].isPlaylist)
        playlistController.loadedPlaylistSongs = [];


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
            } else
                playlistController.dragDraggableSongTimer = 0;

        }


    }).on("mouseup", function (event) {

            console.log("MUP")

            if ($(this).parents("#playlistInner").length == 0)
                return;
            if (Math.abs(event.clientY - playlistController.dragDraggableSongY) > 30) {
                uiController.swipeTimer = Date.now();
                playlistController.dragDraggableSongY = -10;
            }
            playlistController.dragDraggableSongTimer = 0;

        })
        .on("mousemove", function (event) {
            if ($(this).parents("#playlistInner").length == 0)
                return;

            if (playlistController.dragDraggableSongTimer > 0 && playlistController.dragDraggableSongY > 0 && Math.abs(event.clientY - playlistController.dragDraggableSongY) > 30)
                uiController.swipeTimer = Date.now();

            if (playlistController.sortPlaylist) {
                console.log("MMOUVE")
                uiController.stopPlaylistScrollingOnClick(event);
                if ($(this).parents("#playlistInner").length == 0)
                    return;
                if (playlistController.dragDraggableSongTimer && Date.now() - playlistController.dragDraggableSongTimer < 500 && Date.now() - playlistController.dragDraggableSongTimer > 100) {

                    playlistController.dragDraggableLastSongTimer = Date.now();
                    playlistController.dragDraggableSongTimer = 0;

                    var dragHandle = $(this);
                    $(".sortable").sortable("enable");

                    var coords = {
                        clientX: event.clientX,
                        clientY: event.clientY
                    };

                    // this actually triggers the drag start event
                    dragHandle.simulate("mousedown", coords);

                }
            }
        }

    )


    $("#playlistview").sortable({
        tolerance: "pointer",
        dropOnEmpty: true,
        revert: true,
        opacity: 0.9,

        helper: function (event, $item) {
            $("#songOptions").appendTo("body").hide();


            if (!$($item).hasClass("selected")) {
                $("#playlistInner li.selected").removeClass("selected")
                $($item).addClass("selected");
            }
            console.log("------------XXXXXXXXXXXXXXXXXXXXXXXXXXXXx")
            console.dir($("#playlistview").contents().find($item))


            /*var $helper = $('<ul class="songlist"></ul>').addClass('draggedlistelement draggedsortablelistelement');

             var item = $item.clone();


             var ele = $helper.append($item.clone())
             */

            var $helper = $('<ul></ul>').addClass('songlist draggedlistelement draggedsortablelistelement');

            var elements = $("#playlistInner li.selected").removeClass("selected").removeClass("loadedsong playing pausing stillLoading");


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
            playlistController.hideSongOptions();


            $("#playlistInner").offset().top

            uiController.draggingSortableSong = true;
            $("#playlistInner").removeClass("animate");

            $("#playlistInner li").removeClass("fadeslideincompletefast");

            setTimeout(function () {
                // debugger;
            }, 3000)

            $(".draggedsortablelistelement").on('mousemove', function (event) {
                if (uiController.draggingSortableSong) {

                    if ($("#playlistview").height() > $("#playlistInner").height()) {
                        //console.log('X:' + (event.clientX-110) + ' Y: '+(event.clientY-30) );

                        if ($("#playlistInner").offset().top - $(".draggedsortablelistelement").offset().top > 10 && Math.abs($("#playlistInner").offset().left - $(".draggedsortablelistelement").offset().left) < 50) {
                            if (!uiController.playListScrollTimer || Date.now() - uiController.playListScrollTimer > 500) {
                                console.log(uiController.playListScroll.scrollY)
                                uiController.playListScrollTimer = Date.now()
                                uiController.playListScroll.enable();
                                uiController.playListScroll.refresh();
                                uiController.playListScroll.scrollBy(0, 100, 1000)
                            }

                        } else if ($("#playlistInner").offset().top + $("#playlistInner").height() - $(".draggedsortablelistelement").offset().top - $(".draggedsortablelistelement").height() < -10 && Math.abs($("#playlistInner").offset().left - $(".draggedsortablelistelement").offset().left) < 50) {
                            if (!uiController.playListScrollTimer || Date.now() - uiController.playListScrollTimer > 500) {
                                console.log(uiController.playListScroll.scrollY)
                                uiController.playListScrollTimer = Date.now()
                                uiController.playListScroll.enable();
                                uiController.playListScroll.refresh();
                                uiController.playListScroll.scrollBy(0, -100, 1000)
                            }

                        }
                    }

                }
            });

        }, beforeStop: function () {
            //debugger;
        },

        stop: function (event, ui) {

            var newLoadedPlaylistSongs = [];
            if (playlistController.draggedElements) {
                playlistController.draggedElements.css("opacity", "");
                playlistController.draggedElements.show();
            }
            var actPlsid = 0;
            $("#playlistview").find("li").each(function (index) {
                $(this).removeClass("margintop fadeslideincompletefast");

                if ($(this).hasClass("playlistsong")) {
                    console.dir("Playlist " + $(this).find("h3").text())

                    id = this.dataset.songid.substring(12);
                    var found = false;
                    var isElement = false;

                    if (playlistController.draggedElements) {

                        if (this.dataset.songgid && ui.item[0].dataset.songid.substring(12) == this.dataset.songid.substring(12))
                            isElement = true;
                        else {
                            playlistController.draggedElements.each(function (index) {
                                var dragid = playlistController.draggedElements[index].dataset.songid.substring(12);

                                if (dragid == id)
                                    found = true;
                            })

                        }

                    }

                    if (isElement) {//Was Dragged
                        playlistController.draggedElements.each(function (index) {
                            id = playlistController.draggedElements[index].dataset.songid.substring(12);
                            actSong = playlistController.loadedPlaylistSongs[parseInt(id.substring(5))];
                            actSong = jQuery.extend(true, {}, actSong);
                            actSong.id = "plsid" + helperFunctions.padZeros(actPlsid, ("" + playlistController.loadedPlaylistSongs.length).length);
                            newLoadedPlaylistSongs.push(actSong);

                            actPlsid = actPlsid + 1

                        });
                    }
                    else if (!found) {
                        actSong = playlistController.loadedPlaylistSongs[parseInt(id.substring(5))];

                        actSong = jQuery.extend(true, {}, actSong);
                        actSong.id = "plsid" + helperFunctions.padZeros(actPlsid, ("" + playlistController.loadedPlaylistSongs.length).length);


                        newLoadedPlaylistSongs.push(actSong);
                        actPlsid = actPlsid + 1


                    }
                } else {  //From Searchlist

                    var id = this.dataset.songid.substring(10);
                    found = false;
                    isElement = false;
                    if (playlistController.draggedElements) {

                        if (!this.dataset.songgid && ui.item[0].dataset.songid.substring(10) == this.dataset.songid.substring(10))
                            isElement = true;

                    }
                    if (isElement) {//Was Dragged
                        playlistController.draggedElements.each(function (index) {
                            var id = playlistController.draggedElements[index].dataset.songid.substring(10);

                            var actSong = searchController.searchResults[parseInt(id.substring(5))];

                            actSong = jQuery.extend(true, {}, actSong);

                            actSong.gid = playlistController.getNewID();//"plsgid" + playlistController.globalId;
                            //playlistController.globalId = playlistController.globalId + 1;


                            actSong.id = "plsid" + helperFunctions.padZeros(actPlsid, ("" + playlistController.loadedPlaylistSongs.length).length);


                            newLoadedPlaylistSongs.push(actSong);
                            actPlsid = actPlsid + 1;


                        })
                    }
                    else {

                        var actSong = searchController.searchResults[parseInt(id.substring(5))];

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

            if (playlistController.loadedPlaylistSongs.length > 0)
                $("#clearChoosenPlaylists").show();


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
            $("#playlistview").listview();
            playlistController.makePlayListScrollable();

            $scope.safeApply();
            uiController.playListScroll.scrollTo(0, scrollY);


            $("#playlistview").listview('refresh');

            $("#playlistview li").show().css("opacity", "");
            $("#playlistInner").show();
            uiController.updateUI();

            if (playlistController.sortPlaylist) {
                $("#playlistInner  .removesong").show();
                $("#playlistInner  .ui-btn-icon-right").css("margin-right", "0px");
                $("#playlistInner  .ui-btn-icon-right").css("padding-right", "40px");
            }

            console.log($("#playlistview").get(0))
            console.log("------------------------------")


            $("#playlistInner li").removeClass("fadeslideincompletefast");
            playlistController.makePlayListSortable();


            setTimeout(function () {
                playbackController.remarkSong();
                uiController.playListScroll.refresh();
                if (playlistController.sortPlaylist) {
                    $("#playlistInner  .removesong").show();
                    $("#playlistInner  .ui-btn-icon-right").css("margin-right", "0px");
                    $("#playlistInner  .ui-btn-icon-right").css("padding-right", "40px");
                }
            }, 150)

            if ($('#playlistselectvertical .search-choice').length == 1) {
                setTimeout(function () {
                    uiController.savePlaylistVisible(true);
                }, 250)
            }

            if (uiController.startedSortPlaylist) {
                playlistController.toggleSortablePlaylist();
                uiController.startedSortPlaylist = false;
            }
            setTimeout(function () {
                $(".sortable").sortable("disable");
            }, 0)

        },
        appendTo: 'body',
        zIndex: "1000000" //or greater than any other relative/absolute/fixed elements and droppables
    }).disableSelection();

}


/**
 * Toggle Save Playlist Funktion
 * @param savePlaylist
 */
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


        if (playlistController.loadedPlaylistSongs.length > 0 && playlistController.loadedPlaylistSongs[0].isPlaylist) {
            playlistController.loadedPlaylistSongs = [];
            $("#saveplaylistbtn img").attr("src", "public/img/save.png");
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


/**
 * Toggle Sortable playlist
 * @param dontShowTrash
 * @param manuell
 */
playlistController.toggleSortablePlaylist = function (dontShowTrash, manuell) {
    if (manuell) {
        uiController.startedSortPlaylist = false;
    }

    playlistController.sortPlaylist = !playlistController.sortPlaylist
    if (playlistController.sortPlaylist) {
        if (!dontShowTrash) {
            $("#sortplaylistbtn img").attr("src", "public/img/check.png");

        }
        $("#sortplaylistbtn").addClass("greenbackground");

        $("#playlistInner").css("background-color", "rgba(255,255,255,0.1)");


        $('#playlistInner').css({backgroundColor: 'rgba(255,255,255,0)'})

        $('#playlistInner').animate({
            backgroundColor: 'rgba(255,255,255,0.1)'
        }, 100);


        //  if (!dontShowTrash)
        $("#playlistInner  .removesong").show();

        $("#playlistInner  .ui-btn-icon-right").css("margin-right", "0px");

        $("#playlistInner  .ui-btn-icon-right").css("padding-right", "40px");


        uiController.playListScroll.disable();
        $("#playlistsortstyle").remove();
        var style = $('<style id="playlistsortstyle">' +
            '#playlistInner ul li {' +
            'opacity:0.9!important;' +
            'margin-bottom:-1px;' +
            'border-bottom: 1px solid rgba(255,255,255,0.35);' +
            '}' +
            '</style>');
        $('html > head').append(style);

        $("#playlistInner .iScrollVerticalScrollbar").hide();


    } else {

        playlistController.deselectSongs();

        if (manuell)
            var delay = 0;
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


        $("#playlistInner  .removesong").hide();
        $("#playlistInner  .ui-btn-icon-right").css("padding-right", "");
        $("#playlistInner  .ui-btn-icon-right").css("margin-right", "");
        if (!dontShowTrash)
            $("#sortplaylistbtn img").attr("src", "public/img/sort.png");

        $("#sortplaylistbtn").removeClass("greenbackground");

        $("#playlistInner .iScrollVerticalScrollbar").show();

        $(".sortable").sortable("disable");

        uiController.playListScroll.enable();
        $("#playlistsortstyle").remove();
    }


    setTimeout(uiController.updateUI, 0);
}

