/** * importController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 04.04.14 - 01:13
 * @copyright  */

var importController = function () {
};

importController.importPlaylist = function(url){
    $("#popupImportInput").popup("close");
    $.mobile.loading("show");
    $.ajax({
        url: preferences.serverURL + "?importplaylist="+encodeURIComponent(url)+"&auth="+authController.ip_token,
        success: function (data) {

           console.dir("imported playlist:");
           console.dir(data);
           var playlist = [];
            console.dir("current playlist:");
            console.dir(playlistController.getLoadedPlaylist());

            for (var j = 0; j <  data.track.length; j++) {
                playlist[j] = {
                    artist: unescape(data.track[j].artist),
                    name: unescape(data.track[j].name),
                    gid: playlistController.getNewID(),
                    id: "plsid" + helperFunctions.padZeros(j, ("" + playlistController.loadedPlaylistSongs.length).length)
                }


            }

            playlistController.addSongsToPlaylist(playlistController.getLoadedPlaylist(), playlist)


            var loadedplaylist = playlistController.getLoadedPlaylist();
            for (var j = 0; j <  loadedplaylist.tracks.length; j++) {
                if(!loadedplaylist.tracks[j].image){
                    setTimeout(mediaController.loadPreview(loadedplaylist.tracks[j]), j*300);
                }
            }


            console.dir("new playlist:");

            console.dir(loadedplaylist);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.dir("imported playlist - error:");
            console.dir(xhr.responseText);
        },
        complete: function(){
            $.mobile.loading("hide");
        }
    })
}