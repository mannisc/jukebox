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


window.localStorage.playlists = null;
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
        if (playbackController.playSongTimer && Date.now() - playbackController.playSongTimer < 800)
            return;
        setTimeout(function(){
            if (playbackController.playSongTimer && Date.now() - playbackController.playSongTimer < 800)
                return;
            var Id = song.id;
            var listElement = null;
            if (song.gid) {
                if (uiController.sortPlaylist)


                    listElement    = $("#playlistInner li[data-songid='playlistsong" + Id + "'] ");
            }
            else {
                //  listElement = $("#searchlist li[data-songid='searchsong" + Id + "'] ");

                listElement = $("#searchlist li[data-songtitle='" + song.name + "-" + mediaController.getSongArtist(song) + "'] ");

            }

            if(listElement)
                listElement.toggleClass("selected");

        },250)

    }
}





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
        for (var i = 0; i <  playlistController.playlists.length; i++) {
           accountController.savePlaylist( playlistController.playlists[i].gid, playlistController.playlists[i].name,i,JSON.stringify( playlistController.playlists[i].tracks))
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


playlistController.loadPlaylist = function (playlist) {

    if (playlistController.loadedPlaylistSongs.length > 0 && playlistController.loadedPlaylistSongs[0].isPlaylist)
        playlistController.loadedPlaylistSongs = [];


    playlistController.loadedPlaylistSongs = playlist.tracks.concat(playlistController.loadedPlaylistSongs)


    // $("#playlistview").hide();
    $scope.safeApply();
    $("#playlistview").listview('refresh');
    playbackController.remarkSong();

    uiController.makePlayListSortable();

    setTimeout(function () {
        uiController.playListScroll.refresh();
    }, 150)


}


