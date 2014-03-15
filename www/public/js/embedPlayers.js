/** * embedPlayer.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 12.03.14 - 00:49
 * @copyright  */



var embedPlayer = function () {

};

embedPlayer.active = 1;

window.dmAsyncInit = function()
{
    // PARAMS is a javascript object containing parameters to pass to the player if any (eg: {autoplay: 1})

}



embedPlayer.loadDailymotion = function (url) {
    var PARAMS = {background : 'ABE866', autoplay : 1, chromeless : 1,
        foreground : '000000',
        html : 1, highlight : '857580',
        info : 1, network : 'dsl', autoplay : 1};
    embedPlayer.dmplayer = DM.player("dmplayer", {video: id, width: "640", height: "360", params: PARAMS});
    embedPlayer.dmplayer.setVolume(0);
   /*
    player.addEventListener("apiready", function (e) {
        console.log('apiready');
    });

    player.addEventListener("playing", function (e) {
        console.log("playing");
    });


    var controls = ['pause', 'play'];
    for (var i = 0; i < controls.length; i++) {
        $('#controls').append('<button id=\'' + controls[i] + '\'>' + controls[i] + '</button>');
        var lc = '#' + controls[i];
        $(lc).click(function () {

            eval('player.' + this.id + '();');
        });
    }

    //----- TOGGLE PLAY - OK to play, NOK to pause -----//
    $('#controls').append('<button id="togglePlay">togglePlay</button>');
    $('#togglePlay').click(function () {

    });

    //----- SEEK - OK -----//
    $('#controls').append('<button id="seek">seek</button>');
    $('#seek').click(function () {
        player.seek(10);
    });

    //----- LOAD - OK -----//
    $('#controls').append('<button id="load">load</button>');
    $('#load').click(function () {
        player.load("x174uig");
    });

    //----- SETVOLUME - OK -----//
    $('#controls').append('<button id="setVolume">setVolume</button>');
    $('#setVolume').click(function () {

    });

    //----- UNMUTE - NOK -----//
    $('#controls').append('<button id="unmute">unmute</button>');
    $('#unmute').click(function () {
        player.setMuted(0);
    });

    //----- MUTE - OK -----//
    $('#controls').append('<button id="mute">mute</button>');
    $('#mute').click(function () {
        player.setMuted(1);
    });

    //----- TOGGLEMUTE - OK -----//
    $('#controls').append('<button id="toggleMute">toggleMute</button>');
    $('#toggleMute').click(function () {
        player.toggleMuted();
    });

    //----- FULLSCREEN - NOK -----//
    $('#controls').append('<button id="setFullscreen">setFullscreen</button>');
    $('#setFullscreen').click(function () {
        player.setFullscreen(1);
    });
    */

}

embedPlayer.loadYouTube = function (id) {

}

embedPlayer.setLoaded = function () {

}

embedPlayer.setVolume = function (volume) {
    embedPlayer.dmplayer.setVolume(volume);
}

embedPlayer.play = function () {
    embedPlayer.dmplayer.play();
}
embedPlayer.pause = function () {
    embedPlayer.dmplayer.pause();
}

embedPlayer.stop = function () {
    embedPlayer.dmplayer.stop();
}

embedPlayer.seek = function (time) {
    embedPlayer.dmplayer.seek(time);
}



