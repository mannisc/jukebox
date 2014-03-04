/** * mediaController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 03.03.14 - 14:51
 * @copyright  */


var mediaController = function () {

};

mediaController.playCounter = 0;


mediaController.playStream = function (playString) {
    mediaController.playCounter++;
    var streamID = mediaController.playCounter;
    var streamURL = "";
    var searchString = playString;
    var func = function (searchString,streamURL,streamID) {
        if (!uiController.swipeTimer || Date.now() - uiController.swipeTimer > 500) {
            $.ajax({
                timeout:30000,
                url: preferences.serverURL + "?play=" + searchString,
                success: function (data) {
                    if(streamID == mediaController.playCounter){
                        streamURL = data;
                        if (streamURL) {
                            uiController.mediaElementPlayer.setSrc(streamURL);
                            uiController.mediaElementPlayer.load();
                            uiController.mediaElementPlayer.play();

                        }
                    }

                }
            })

        }
    }
    func(searchString,streamURL,streamID);
    //TODO

}


mediaController.getSongCover= function(song){

    var url;

    if(song.image)
      url =  song.image[0]['#text'];

    if(!url|| $.trim(url) == "")
        url ="public/img/playlist.png";

    return url;
}

mediaController.getSongArtist= function(song){

    var artist = "";

    if(song.artist.name)
        artist =  song.artist.name;
    else if(song.artist)
        artist = song.artist;
    return artist;
}
