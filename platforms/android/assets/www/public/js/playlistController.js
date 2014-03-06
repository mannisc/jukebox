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


playlistController.playlingSongId = null;
playlistController.playlingTitle = "";

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


playlistController.playSong = function (Id, globalId, isPlaylistSong, playArtist,playTitle) {

    if(!(!uiController.swipeTimer|| Date.now() -  uiController.swipeTimer >500))
     return;


    playlistController.playlingTitleLoading = playArtist+" - "+playTitle;
    playlistController.disableControls(!isPlaylistSong)

    $(".songlist li").removeClass("loadedsong playing plausing");

    var loadedSong = false;

    if (isPlaylistSong) {
        var  listElement = $("#searchlist li[data-songid='searchsong" + Id + "'] ");
        var  newId =  globalId
    }
    else {
        listElement = $("#searchlist li[data-songid='searchsong" + Id + "'] ");
        newId =  Id
    }

    playlistController.playlingTitleCoverLoading = listElement.find(".ui-li-icon").attr("src");
    if (playlistController.playlingSongId != newId) {
        playlistController.isLoading = true;
        loadedSong = true;
        mediaController.playStream( playArtist,playTitle);
        playlistController.playlingSongId = newId;
        listElement.addClass("playing");
        alert("OOOOO"+listElement.outerHTML())
    }

    listElement.addClass("loadedsong")


    if (!loadedSong)
        $(".mejs-playpause-button").click();
    else
        playlistController.setNewTitle(playlistController.playlingTitleLoading,playlistController.playlingTitleCoverLoading);


    var  listElement = $("#searchlist li[data-songid='searchsong" + Id + "'] ");
    alert("fffffff"+listElement.outerHTML())



}



playlistController.setNewTitle = function (title, coverUrl, onlyAnimateTitle) {
    $("#playingSongTitle").removeClass("fadeincomplete")

    if(!onlyAnimateTitle) {
        $("#playingSongCover").hide();
        $("#playingSongCover").removeClass("fadeincomplete")

    }

    $("#playingSongTitle").hide();

    if(title&&title!="")
      document.title = $scope.appTitle + playlistController.getPlayingSepSign() + title;
    else
      document.title = $scope.appTitle;

    $("#playingSongCover").attr("src", coverUrl);
    $scope.safeApply();
    setTimeout(function () {
        $("#playingSongTitle").addClass("fadeincomplete")
        if(!onlyAnimateTitle) {
            $("#playingSongCover").show();
            $("#playingSongCover").addClass("fadeincomplete")

        }
        $("#playingSongTitle").show();

    }, 50)
}

playlistController.isLoading = function () {
    if (playlistController.playlingTitleLoading!=playlistController.playlingTitle) {
        return " is loading... ";
    } else
        return "";



}

playlistController.getPlaylingTitle = function () {

    var title = "";
    if (playlistController.playlingTitleLoading) {
        title = playlistController.playlingTitleLoading;
        if (playlistController.playlingTitleLoading!=playlistController.playlingTitle)
            title= title+ " is loading";

    }
    return title;






}


playlistController.getPlayingSepSign = function () {
    if (playlistController.playlingTitleLoading) {
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
