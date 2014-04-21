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


for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
    playlistController.loadedPlaylistSongs[i].id = "plsid" + helperFunctions.padZeros(i, ("" + playlistController.loadedPlaylistSongs.length).length);
    playlistController.loadedPlaylistSongs[i].gid = "gsid" + helperFunctions.padZeros(i, ("" + playlistController.loadedPlaylistSongs.length).length);
    //   console.log("::: "+ playlistController.loadedPlaylistSongs[i].gid)
}

playlistController.globalId = playlistController.loadedPlaylistSongs.length;


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


playlistController.globalIdPlaylist = playlistController.playlists.length;


playlistController.loadedPlaylistSongs = playlistController.playlists;

playlistController.loadedPlaylistSongs = [];
playlistController.playlists = [];  //CLEAR_______________________________________________________________

playlistController.counterGlobalId = playlistController.loadedPlaylistSongs.length; //TODO


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

        var Id = song.id;
        var listElement = null;
        if (song.gid) {
            if (!playlistController.sortPlaylist)
                uiController.toggleSortablePlaylist(false, true);

            listElement = $("#playlistInner li[data-songgid='playlistsong" + song.gid + "'] ");

        }
        else {
            //  listElement = $("#searchlist li[data-songid='searchsong" + Id + "'] ");

            listElement = $("#searchlist li[data-songtitle='" + song.name + "-" + mediaController.getSongArtist(song) + "'] ");

        }

        if (listElement)
            listElement.toggleClass("selected");

        /*     },250)
         */
    }
}


/**
 * Save Playlist
 * @param useSelected
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
            for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
                playlistController.loadedPlaylistSongs[i].playlistgid = playlistController.globalIdPlaylist;
            }
            playlist = {gid: playlistController.globalIdPlaylist, id: playlistController.globalIdPlaylist, name: playlistTitle, isPlaylist: true, tracks: playlistController.loadedPlaylistSongs}
            playlists.push(playlist);

        }


        playlistController.globalIdPlaylist++;
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



playlistController.deselectSongs = function () {
//Remove Selection

   $(".songlist li.selected").removeClass("selected");

}


playlistController.loadPlaylist = function (playlist) {

    if (playlistController.loadedPlaylistSongs.length > 0 && playlistController.loadedPlaylistSongs[0].isPlaylist)
        playlistController.loadedPlaylistSongs = [];


    playlistController.loadedPlaylistSongs = playlist.tracks.concat(playlistController.loadedPlaylistSongs)


    // $("#playlistview").hide();
    $scope.safeApply();
    $("#playlistview").listview('refresh');
    playbackController.remarkSong();

    playlistController.makePlayListSortable();

    setTimeout(function () {
        uiController.playListScroll.refresh();
    }, 150)


}


/**
 * Make Playlist Drag and Droppable
 */
playlistController.makePlayListSortable = function () {

    var startSorting = function () {
        playlistController.playlistMouseDown = false;
        // Add your code to run
        uiController.stopPlaylistScrollingOnClick(event);
        //$(that).data("checkdown", setTimeout(function () {
        if (!playlistController.sortPlaylist) {
            console.log("DRAGGGGIT!")

            uiController.toggleSortablePlaylist(true);

            var dragHandle = $(that);

            var coords = {
                clientX: event.clientX,
                clientY: event.clientY
            };

            // this actually triggers the drag start event
            uiController.startedSortPlaylist = true;
            dragHandle.simulate("mousedown", coords);
        }
    }


    $("#playlistInner li").on("mousedown",function (event) {
        console.log("MDOWN")

        if ($(this).parents("#playlistInner").length == 0)
            return;
        if (!playlistController.dragDraggableLastSongTimer || Date.now() - playlistController.dragDraggableLastSongTimer > 500) {
            playlistController.dragDraggableSongX = event.clientX;
            playlistController.dragDraggableSongY = event.clientY;
            playlistController.dragDraggableSongTimer = Date.now();
            playlistController.dragDraggableSongStartEvent = event;
        } else
            playlistController.dragDraggableSongTimer = 0;

    }).on("mouseup",function (event) {

            console.log("MDOWN")

            if ($(this).parents("#playlistInner").length == 0)
                return;
            if (Math.abs(event.clientY - playlistController.dragDraggableSongY) > 30) {
                uiController.swipeTimer = Date.now();
                playlistController.dragDraggableSongY = -10;
            }
            playlistController.dragDraggableSongTimer = 0;

        }).on("mousemove", function (event) {


            if ($(this).parents("#searchlist").length == 0)
                return;
            if (Math.abs(event.clientY - playlistController.dragDraggableSongY) > 8)
                playlistController.dragDraggableSongY = -10;
            if (playlistController.dragDraggableSongY > 0 && Math.abs(event.clientY - playlistController.dragDraggableSongY) > 30) {
                uiController.swipeTimer = Date.now();
            } else if (playlistController.dragDraggableSongTimer && Date.now() - playlistController.dragDraggableSongTimer < 500) {
                if (!uiController.draggingSong && event.clientX - playlistController.dragDraggableSongX > 2 && Math.abs(event.clientY - playlistController.dragDraggableSongY) < Math.abs(event.clientX - playlistController.dragDraggableSongX) * 0.8) {
                    playlistController.dragDraggableSongY = -10;
                    playlistController.dragDraggableLastSongTimer = Date.now();
                    playlistController.dragDraggableSongTimer = 0;

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
                        clientX: playlistController.dragDraggableSongStartEvent.clientX,
                        clientY: playlistController.dragDraggableSongStartEvent.clientY
                    };
                    $(that).simulate("mouseup", coords);

                    setTimeout(function () {

                        $(that).simulate("mousedown", coords);

                    }, delay)


                }

            }

        }

    )

    /*
    if (app.isCordova)
        return;
    $("#playlistInner li").on("mousedown",function (event) {

        if ($(this).parents("#playlistInner").length == 0)
            return;

        if (!playlistController.playlistMouseDown) {
            playlistController.playlistMouseDown = true;

            var that = this;
            if (!playlistController.sortPlaylist) {

                playlistController.dragSortableSongY = event.clientY;
                console.log("MDOWN");
                if ($("#playlistview").height() > $("#playlistInner").height())

                    $(that).data("checkdown", setTimeout(function () {
                        playlistController.playlistMouseDown = false;
                        // Add your code to run
                        uiController.stopPlaylistScrollingOnClick(event);
                        //$(that).data("checkdown", setTimeout(function () {
                        if (!playlistController.sortPlaylist) {
                            console.log("DRAGGGGIT!")

                            uiController.toggleSortablePlaylist(true);

                            var dragHandle = $(that);

                            var coords = {
                                clientX: event.clientX,
                                clientY: event.clientY
                            };

                            // this actually triggers the drag start event
                            uiController.startedSortPlaylist = true;
                            dragHandle.simulate("mousedown", coords);
                        }
                        //  }, 10));
                    }, 350));
            } else {


            }
        }
    }).on("mouseup",function (event) {
            console.log("MUP");


            if (Math.abs(event.clientY - playlistController.dragSortableSongY) > 30) {
                uiController.swipeTimer = Date.now();
            }

            playlistController.playlistMouseDown = false;

            clearTimeout($(this).data("checkdown"));
            $(this).data("checkdown", null);

        }).on("mouseout",function (event) {

            if (playlistController.dragSortableSongY > 0 && Math.abs(event.clientY - playlistController.dragSortableSongY) > 30)
                uiController.swipeTimer = Date.now();

            playlistController.playlistMouseDown = false;

            clearTimeout($(this).data("checkdown"));
            $(this).data("checkdown", null);

        }).on("mousemove", function (event) {
            // console.log("MOVE " + Math.abs(event.clientY - playlistController.dragSortableSongY))
            if ($("#playlistview").height() > $("#playlistInner").height()) {

                if (Math.abs(event.clientY - playlistController.dragSortableSongY) > 8) {

                    if ($(this).data("checkdown")) {
                        clearTimeout($(this).data("checkdown"));
                    }
                }

            } else {


            }


            if (playlistController.dragSortableSongY > 0 && Math.abs(event.clientY - playlistController.dragSortableSongY) > 30)
                uiController.swipeTimer = Date.now();


        })

    */


    $("#playlistview").sortable({
        tolerance: "pointer",
        dropOnEmpty: true,
        revert: true,
        opacity: 0.9,

        helper: function (event, $item) {
            $($item).addClass("selected");
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

            var ele = $helper.append(elements.clone());

            if (!oneItem) {
                for (var i = 0; i < elements.length; i++) {
                    if ($item[0] != elements.get(i)) {
                        $(elements.get(i)).hide();
                    }
                }
                playlistController.draggedElements = elements;

            }


            // elements.hide();

            /*
             for(var i = 0; i<elementsRemove.length;i++ ){
             console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbb")

             console.dir($item[0])
             console.dir(elementsRemove.get(i))

             if($item[0]!=elementsRemove.get(i)){
             $(elementsRemove.get(i)).remove();
             }

             } */


            /*
             var $helper = $('<ul class="songlist"></ul>').addClass('draggedlistelement draggedsortablelistelement');

             var elementsRemove =   $("#playlistInner li.selected").removeClass("selected");

             var elements =    elementsRemove.clone().removeClass("loadedsong playing pausing stillLoading");

             //   var elements = $("#playlistInner li.selected").removeClass("selected").clone().removeClass("loadedsong playing pausing stillLoading");

             if(elements.length==0)
             elements = $(this).removeClass("selected").clone().removeClass("loadedsong playing pausing stillLoading");

             var ele = $helper.append(elements)

             playlistController.draggedElements = elements;
             setTimeout(function(){elementsRemove.remove();},0)
             elements.css("opacity", "0.5")

             */
            //var marquee = $(ele).find("marquee").get(0);
            //$(marquee).replaceWith($(marquee).contents());

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


            $("#playlistInner").offset().top

            uiController.draggingSortableSong = true;
            $("#playlistInner").removeClass("animate");

            $("#playlistInner li").removeClass("fadeslideincompletefast");

            setTimeout(function () {
                //debugger;
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

                    if (isElement) {
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
                } else {
                    var id = this.dataset.songid.substring(10);
                    found = false;
                    isElement = false;
                    if (playlistController.draggedElements) {

                        if (!this.dataset.songgid && ui.item[0].dataset.songid.substring(10) == this.dataset.songid.substring(10))
                            isElement = true;

                    }
                    if (isElement) {
                        playlistController.draggedElements.each(function (index) {
                            var id = playlistController.draggedElements[index].dataset.songid.substring(10);

                            var actSong = searchController.searchResults[parseInt(id.substring(5))];

                            actSong = jQuery.extend(true, {}, actSong);


                            actSong.gid = "plsgid" + playlistController.globalId;
                            playlistController.globalId = playlistController.globalId + 1;


                            actSong.id = "plsid" + helperFunctions.padZeros(actPlsid, ("" + playlistController.loadedPlaylistSongs.length).length);


                            newLoadedPlaylistSongs.push(actSong);
                            actPlsid = actPlsid + 1

                        })
                    }
                    else {

                        var actSong = searchController.searchResults[parseInt(id.substring(5))];

                        actSong = jQuery.extend(true, {}, actSong);

                        actSong.gid = "plsgid" + playlistController.globalId;
                        playlistController.globalId = playlistController.globalId + 1;

                        actSong.id = "plsid" + helperFunctions.padZeros(actPlsid, ("" + playlistController.loadedPlaylistSongs.length).length);


                        newLoadedPlaylistSongs.push(actSong);
                        actPlsid = actPlsid + 1

                    }
                    //  alert(index)
                    $(this).remove();
                }


            })

            console.log("___________________________")
            console.dir(newLoadedPlaylistSongs)
            playlistController.loadedPlaylistSongs = newLoadedPlaylistSongs;

            if (playlistController.loadedPlaylistSongs.length > 0)
                $("#clearChoosenPlaylists").show();


            console.log("DROPPED------------------------------")
            console.log($("#playlistview").get(0))
            console.log("------------------------------")
            console.dir(playlistController.loadedPlaylistSongs)
            console.log("------------------------------")
            $scope.safeApply();

            $("#playlistview").listview('refresh');
            $("#playlistview li").show().css("opacity", "");
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
                uiController.toggleSortablePlaylist();
                uiController.startedSortPlaylist = false;
            }

        },
        appendTo: 'body',
        zIndex: "1000000" //or greater than any other relative/absolute/fixed elements and droppables
    }).disableSelection();

}

