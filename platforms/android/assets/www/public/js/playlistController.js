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


//playlistController.loadedPlaylistSongs = [];

playlistController.loadedPlaylistSongs = [
    {"name": "Supergeil", "artist": "Subzonic", "url": "http://www.last.fm/music/Subzonic/_/Supergeil", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "210", "image": [
        {"#text": "http://userserve-ak.last.fm/serve/34s/32289987.jpg", "size": "small"},
        {"#text": "http://userserve-ak.last.fm/serve/64s/32289987.jpg", "size": "medium"},
        {"#text": "http://userserve-ak.last.fm/serve/126/32289987.jpg", "size": "large"},
        {"#text": "http://userserve-ak.last.fm/serve/300x300/32289987.jpg", "size": "extralarge"}
    ], "mbid": "b90eb892-3426-45e5-91d1-4b02f5c9d320"},
    {"name": "Supergeil", "artist": "Der Tourist", "url": "http://www.last.fm/music/Der+Tourist/_/Supergeil", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "986", "mbid": ""},
    {"name": "Supergeil", "artist": "Geile Tiere", "url": "http://www.last.fm/music/Geile+Tiere/_/Supergeil", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "118", "mbid": ""},
    {"name": "Supergeil", "artist": "The Opposites", "url": "http://www.last.fm/music/The+Opposites/_/Supergeil", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "20", "mbid": ""},
    {"name": "A5 supergeil", "artist": "Geile Tiere", "url": "http://www.last.fm/music/+noredirect/Geile+Tiere/_/A5+supergeil", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "15", "mbid": ""},
    {"name": "Supergeil (Abendstern Remix)", "artist": "Der Tourist", "url": "http://www.last.fm/music/Der+Tourist/_/Supergeil+(Abendstern+Remix)", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "16", "mbid": ""},
    {"name": "Supergeil (Siriusmo Remix)", "artist": "Der Tourist", "url": "http://www.last.fm/music/Der+Tourist/_/Supergeil+(Siriusmo+Remix)", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "10", "mbid": ""},
    {"name": "Supergeil (feat. Friedrich Liechtenstein)", "artist": "Der Tourist", "url": "http://www.last.fm/music/Der+Tourist/_/Supergeil+(feat.+Friedrich+Liechtenstein)", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "401", "mbid": ""},
    {"name": "Supergeil", "artist": "Der Tourist feat. Friedrich Liechtenstein", "url": "http://www.last.fm/music/Der+Tourist+feat.+Friedrich+Liechtenstein/_/Supergeil", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "172", "mbid": ""},
    {"name": "Supergeil - Jan Driver Remix", "artist": "Der Tourist", "url": "http://www.last.fm/music/Der+Tourist/_/Supergeil+-+Jan+Driver+Remix", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "106", "mbid": ""},
    {"name": "Supergeil - Abendstern Remix", "artist": "Der Tourist", "url": "http://www.last.fm/music/Der+Tourist/_/Supergeil+-+Abendstern+Remix", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "112", "mbid": ""},
    {"name": "Supergeil (Jan Driver Remix)", "artist": "Der Tourist", "url": "http://www.last.fm/music/Der+Tourist/_/Supergeil+(Jan+Driver+Remix)", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "11", "mbid": ""},
    {"name": "supergeil klasse phantom durchfall mix 08", "artist": "Tom maertens", "url": "http://www.last.fm/music/Tom+maertens/_/supergeil+klasse+phantom+durchfall+mix+08", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "74", "mbid": ""},
    {"name": "Supergeil - Scorpio's Miami Brass Remix", "artist": "Der Tourist", "url": "http://www.last.fm/music/Der+Tourist/_/Supergeil+-+Scorpio%27s+Miami+Brass+Remix", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "147", "mbid": ""},
    {"name": "Supergeil (Siriusmo Remix) [feat. Friedrich Liechtenstein]", "artist": "Der Tourist", "url": "http://www.last.fm/music/Der+Tourist/_/Supergeil+(Siriusmo+Remix)+%5Bfeat.+Friedrich+Liechtenstein%5D", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "48", "mbid": ""},
    {"name": "The Opposites Big2 ft. Klopdokter - Supergeil", "artist": "The Opposites", "url": "http://www.last.fm/music/The+Opposites/_/The+Opposites+Big2+ft.+Klopdokter+-+Supergeil", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "9", "mbid": ""},
    {"name": "Der Tourist feat. Friedrich Liechtenstein - Supergeil", "artist": "[unknown]", "url": "http://www.last.fm/music/%5Bunknown%5D/_/Der+Tourist+feat.+Friedrich+Liechtenstein+-+Supergeil", "streamable": {"#text": "0", "fulltrack": "0"}, "listeners": "7", "mbid": ""}
];
for (var i = 0; i < playlistController.loadedPlaylistSongs.length; i++) {
    playlistController.loadedPlaylistSongs[i].id = "plsid" + helperFunctions.padZeros(i, ("" + playlistController.loadedPlaylistSongs.length).length);
    playlistController.loadedPlaylistSongs[i].gid = "gsid" + helperFunctions.padZeros(i, ("" + playlistController.loadedPlaylistSongs.length).length);

}


playlistController.playingSongId = null;
playlistController.playingTitle = "";

playlistController.counterGlobalId = playlistController.loadedPlaylistSongs.length; //TODO


playlistController.disableStopControl = function (disable) {

    if (disable) {
        $(".mejs-stop-button").css("opacity", "0.5");

    } else {
        $(".mejs-stop-button").css("opacity", "1");
    }

}

playlistController.disablePlayStopControls = function (disable) {


    if (disable) {
        $(".mejs-playpause-button").css("opacity", "0.5");
        $(".mejs-stop-button").css("opacity", "0.5");

    } else {
        $(".mejs-playpause-button").css("opacity", "1");
        $(".mejs-stop-button").css("opacity", "1");

    }


}


playlistController.disableControls = function (disable) {

    if (disable) {
        $(".mejs-nexttrack-button").css("opacity", "0.5");
        $(".mejs-prevtrack-button").css("opacity", "0.5");
        $(".mejs-shuffle-button").css("opacity", "0.5");
    } else {
        $(".mejs-nexttrack-button").css("opacity", "1");
        $(".mejs-prevtrack-button").css("opacity", "1");
        $(".mejs-shuffle-button").css("opacity", "1");
    }

}




playlistController.resetPlayingSong = function () {

    playlistController.isLoading = false;

    $(".mejs-controls").find('.mejs-time-loaded').show();

    if ($(".mejs-controls").find('.mejs-time-buffering').css("opacity") > 0)
        $(".mejs-controls").find('.mejs-time-buffering').fadeOut();

    mediaController.playCounter = mediaController.playCounter + 1;

    $("#videoplayer").css("opacity", "1");

    /*
    playlistController.loadingId = playlistController.loadingOldId;
    playlistController.loadingGlobalId = playlistController.loadingOldGlobalId;
    playlistController.loadingIsPlaylistSong = playlistController.loadingOldIsPlaylistSong;
    playlistController.loadingPlayArtist = playlistController.loadingOldPlayArtist;
    playlistController.loadingPlayTitle = playlistController.loadingOldPlayTitle;
    */

    playlistController.loadingSong =  playlistController.loadingOldSong;


  //  playlistController.playlingTitleLoading = playlistController.playingTitle;
  //  playlistController.playlingTitleCoverLoading = playlistController.playlingTitleCover;


    if(playlistController.loadingSong) {
        playlistController.playSong(playlistController.loadingSong, true)
        playlistController.setNewTitle(playlistController.loadingSong.name, playlistController.loadingSong.coverURL, true);

    }
    else{
        $(".songlist li").removeClass("loadedsong playing plausing");
        playlistController.setNewTitle("","", true);
    }




}


playlistController.playSong = function (song,onlyStyle){

    var Id = song.id;
    var globalId = song.gid;
    if(globalId)
       var isPlaylistSong = true;
    else
        isPlaylistSong = false;
    var playArtist =  mediaController.getSongArtist(song);
    var playTitle = song.name;


    if (playlistController.playSongTimer && Date.now() - playlistController.playSongTimer < 100)
        return;
    if (uiController.swipeTimer && Date.now() - uiController.swipeTimer < 100)
        return;

    if (isPlaylistSong) {
        var listElement = $("#playlistInner li[data-songid='playlistsong" + Id + "'] ");
        var newId = globalId
    }
    else {
        listElement = $("#searchlist li[data-songid='searchsong" + Id + "'] ");
        newId = Id
    }

    //Already Loading
    if (playlistController.isLoading&&playlistController.playingSongId == newId)
     return;

    playlistController.playSongTimer = Date.now();

    if(!playlistController.isLoading){
       playlistController.loadingOldSong =   playlistController.loadingSong;

      /*
      playlistController.loadingOldId = playlistController.loadingId;
      playlistController.loadingOldGlobalId = playlistController.loadingGlobalId;
      playlistController.loadingOldIsPlaylistSong = playlistController.loadingIsPlaylistSong;
      playlistController.loadingOldPlayArtist = playlistController.loadingPlayArtist;
      playlistController.loadingOldPlayTitle = playlistController.loadingPlayTitle;
        */
    }

    playlistController.loadingSong = song;
    playlistController.loadingSong.coverURL =  listElement.find(".ui-li-icon").attr("src");

    /*
    playlistController.loadingId = Id;
    playlistController.loadingGlobalId = globalId;
    playlistController.loadingIsPlaylistSong = isPlaylistSong;
    playlistController.loadingPlayArtist = playArtist;
    playlistController.loadingPlayTitle = playTitle;
    playlistController.playlingTitleLoading = playArtist + " - " + playTitle;
    playlistController.playlingTitleCoverLoading = listElement.find(".ui-li-icon").attr("src");

     */


    playlistController.disableControls(!isPlaylistSong)


    $(".songlist li").removeClass("loadedsong playing plausing");

    //Clicked first Time, loading song?
    var loadedSong = false;

    if (!playlistController.isLoading&&playlistController.playingSongId) {
        if (playlistController.isPlaying)
            listElement.addClass("playing");
        else
            listElement.addClass("pausing");
    }


    if (!onlyStyle) {
        if (playlistController.playingSongId != newId) {
            playlistController.isLoading = true;
            loadedSong = true;
            mediaController.playStream(playArtist, playTitle);
            console.log("LOAD STREAM")
            listElement.addClass("playing").removeClass("pausing");
        }
    }
    playlistController.playingSongId = newId;



    listElement.addClass("loadedsong")

    if (!onlyStyle) {
        if (!loadedSong){
            setTimeout(function(){
                $(".mejs-playpause-button").click();
            } ,50);
        }
        else
            playlistController.setNewTitle(playlistController.loadingSong.name, playlistController.loadingSong.coverURL);
    }

}


playlistController.setNewTitle = function (title, coverUrl, isLoaded) {

    if (!isLoaded) {
        $("#playingSongCover").removeClass("fadeincomplete")
        $("#playingSongTitle").removeClass("fadeincomplete");
        $("#playingSongTitle").hide();
        $("#playingSongTitleLoading").hide();
        $("#playingSongCover").hide();
    }
    $("#playingSongTitleLoading").removeClass("fadeincomplete").removeClass("fadeoutcomplete");


    if (title && title != "")
        document.title = $scope.appTitle + playlistController.getPlayingSepSign() + title;
    else
        document.title = $scope.appTitle;

    $("#playingSongCover").attr("src", coverUrl);
    $scope.safeApply();
    setTimeout(function () {


        if (isLoaded) {
            $("#playingSongTitleLoading").addClass("fadeoutcomplete")
            $("#playingSongTitleLoading").show();
        }
        else {
            $("#playingSongCover").addClass("fadeincomplete")
            $("#playingSongCover").show();
            $("#playingSongTitleLoading").addClass("fadeincomplete")
            $("#playingSongTitleLoading").show();
            $("#playingSongTitle").addClass("fadeincomplete")
            $("#playingSongTitle").show();
        }

    }, 50)
}

playlistController.getIsLoadingText = function () {
    if (playlistController.isLoading)
        return " ...";
    else
        return "";
}


playlistController.getPlaylingTitle = function () {

    if (playlistController.loadingSong){
        return playlistController.loadingSong.name+" - "+ mediaController.getSongArtist(playlistController.loadingSong);
    }
    else
        return "";
}


playlistController.getPlaylingSong = function () {
    if (playlistController.loadingSong)
        return playlistController.loadingSong;
    else
        return {name:""};
}


playlistController.getPlayingSepSign = function () {
    if (playlistController.loadingSong) {
        return " : ";
    } else
        return "";

}


playlistController.playNextSong = function () {

    alert("!!!!!!")

}


playlistController.playPrevSong = function () {


}

playlistController.toggleShuffleSongs = function () {


}
