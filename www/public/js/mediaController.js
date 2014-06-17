/** * mediaController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 03.03.14 - 14:51
 * @copyright  */


var mediaController = function () {

};

mediaController.unknownData = "Unknown";

mediaController.playCounter = 0;

mediaController.versionList = [];

mediaController.startVersionIndex = -1;
mediaController.versionListSong = null;
mediaController.currentStreamURL = "";
mediaController.currentvideoURL = "";


mediaController.seekTime = 0;
mediaController.seekTimeDuration = 0;

mediaController.retrySongCounter = 0;


mediaController.buySong = function () {
    var song = playbackController.getPlayingSong();
    if (song) {
        var keywords = mediaController.getSongArtist(song) + " - " + song.name;
        var language = window.navigator.userLanguage || window.navigator.language;
        if(language == "de" || language == "de-at" || language == "de-li"){
            mywindow = window.open("http://www.amazon.de/s/?_encoding=UTF8&ajr=0&camp=1638&creative=19454&field-keywords=" + keywords + "&linkCode=ur2&rh=n%3A77195031%2Ck%3A" + keywords + "&site-redirect=de&tag=iggels-21&url=search-alias%3Ddigital-music", "Amazon", "");
        }
        else{
            mywindow = window.open("http://www.amazon.com/mn/search/?_encoding=UTF8&camp=1789&creative=390957&field-keywords=" + keywords + "&linkCode=ur2&linkId=MYPSR6WWIWMTB2LT&tag=songbasefm-20&url=search-alias%3Daps&linkId=D6BN5D5GAFQZOEN3", "Amazon", "");
        }
        mywindow.focus();
        mediaController.getPrice();
    }
}


mediaController.downloadWindowsApp = function () {
  mywindow = window.open("/download/SongBase.fm.exe", "Download Songbase.fm - App", "");
  mywindow.focus();
   $('#popupDownloadApp').popup('close');
}


mediaController.getPrice = function () {
    var song = playbackController.getPlayingSong();
    var keywords = mediaController.getSongArtist(song) + " - " + song.name;

    /*

     $.ajax({
     url: "http://anonymouse.org/cgi-bin/anon-www_de.cgi/amazon.de/s/?_encoding=UTF8&ajr=0&camp=1638&creative=19454&field-keywords=" + keywords + "&linkCode=ur2&rh=n%3A77195031%2Ck%3A" + keywords + "&site-redirect=de&tag=iggels-21&url=search-alias%3Ddigital-music",
     crossDomain: true,
     dataType:"text/html",
     success: function (response) {
     var resp = JSON.parse(response)
     alert(resp.status);
     },
     error: function (xhr, status) {
     alert("error");
     }
     });

     */
}

mediaController.init = function () {

}

mediaController.visitSongWebPage = function () {
    if (mediaController.currentvideoURL != "") {
        console.dir(mediaController.currentvideoURL);
        mywindow = window.open(mediaController.currentvideoURL, "", "");
        mywindow.focus();
    }
}


mediaController.mediaEnded = function () {
    mediaController.sendRating("2");
    document.title = $scope.appTitle;

    videoController.isPlaying = false;
    videoController.disableStopControl(true);
    //$("#videoplayer").css("opacity", "0");
    // $("#videoplayer").css("pointer-events", "none");

    videoController.setBufferedPercentage(0);

    $(".mejs-playpause-button button").addClass("looped");
    uiController.updateUI();
    if (!playbackController.isLoading)
        playbackController.playNextSong();
}

mediaController.loadPreviewSafeApplyTimer =   null;

mediaController.loadPreview = function(song){



    console.dir("loadpreview ajax!!!!");
    var artistString = mediaController.getSongArtist(song);
    var titleString = song.name
    $.ajax({
        url: "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&artist=" + encodeURIComponent(artistString) + "&track=" + encodeURIComponent(titleString) + "&format=json",
        success: function (data) {
            if(data){
                if(data.track){
                    if(data.track.album){
                        song.image = data.track.album.image;
                        if(mediaController.loadPreviewSafeApplyTimer)  {
                            clearTimeout(mediaController.loadPreviewSafeApplyTimer)
                            mediaController.loadPreviewSafeApplyTimer = null;
                        }
                        mediaController.loadPreviewSafeApplyTimer = setTimeout(function(){
                            mediaController.loadPreviewSafeApplyTimer = null;
                            $scope.safeApply();
                        },500)
                    }
                }
            }
        }
    })

}

mediaController.sendRating = function (rating) {
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        var VideoURL = escape(mediaController.currentvideoURL);
        var song = playbackController.getPlayingSong();
        var rate = function (song, VideoURL) {
            if (mediaController.currentvideoURL != "" && song) {
                var artistString = encodeURIComponent(mediaController.getSongArtist(song));
                var titleString = encodeURIComponent(song.name);
                $.ajax({
                    url: preferences.serverURL + "?ratingURL=" + VideoURL + "&rating=" + rating + "&artist=" + artistString + "&title=" + titleString + "&auth=" + authController.ip_token,
                    success: function (data) {
                        authController.ensureAuthenticated(data, function () {
                            mediaController.sendRating(rating);
                        })
                    }
                })
            }
        }
        rate(song, VideoURL);
    }
}

mediaController.showDuration = function (songversion) {
    var duration = parseInt(songversion.duration);
    myDate = new Date();
    myDate.setMinutes(0, duration, 0);
    var minutes = myDate.getMinutes().toString();
    if (minutes.length < 2) {
        minutes = "0" + minutes;
    }
    var seconds = myDate.getSeconds().toString();
    if (seconds.length < 2) {
        seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
}


mediaController.getSiteLogo = function () {
    if (mediaController.currentvideoURL.toLowerCase().search(".dailymotion.com") > -1 || mediaController.currentvideoURL.toLowerCase().search("/dailymotion.com") > -1) {
        return "dailymotion.png"
    } else if (mediaController.currentvideoURL.toLowerCase().search(".youtube.") > -1 || mediaController.currentvideoURL.toLowerCase().search("/youtube.") > -1) {
        return "youtube.png"
    } else if (mediaController.currentvideoURL.toLowerCase().search(".muzu.tv") > -1 || mediaController.currentvideoURL.toLowerCase().search("/muzu.tv") > -1) {
        return "muzu.png"
    } else if (mediaController.currentvideoURL.toLowerCase().search(".vimeo.") > -1 || mediaController.currentvideoURL.toLowerCase().search("/vimeo.") > -1) {
        return "vimeo.png"
    } else if (mediaController.currentvideoURL.toLowerCase().search(".photobucket.") > -1 || mediaController.currentvideoURL.toLowerCase().search("/photobucket.") > -1) {
        return "photobucket.png"
    } else if (mediaController.currentvideoURL.toLowerCase().search(".metacafe.") > -1 || mediaController.currentvideoURL.toLowerCase().search("/metacafe.") > -1) {
        return "metacafe.png"
    } else if (mediaController.currentvideoURL.toLowerCase().search(".veoh.") > -1 || mediaController.currentvideoURL.toLowerCase().search("/veoh.") > -1) {
        return "veoh.png"

    } else if (mediaController.currentvideoURL.toLowerCase().search(".blip.") > -1 || mediaController.currentvideoURL.toLowerCase().search("/blip.") > -1) {
        return "blip.png"

    } else if (mediaController.currentvideoURL.toLowerCase().search(".myvideo.") > -1 || mediaController.currentvideoURL.toLowerCase().search("/myvideo.") > -1) {
        return "myvideo.png"

    } else if (mediaController.currentvideoURL.toLowerCase().search(".clipfish.") > -1 || mediaController.currentvideoURL.toLowerCase().search("/clipfish.") > -1) {
        return "clipfish.png"

    }

    alert(mediaController.currentvideoURL.toLowerCase())
    return "empty.png"

}


mediaController.getSiteName = function (url, prefix) {
    if (url.toLowerCase().search(".dailymotion.com") > -1 || url.toLowerCase().search("/dailymotion.com") > -1) {
        return prefix + "Dailymotion";
    } else if (url.toLowerCase().search(".youtube.") > -1 || url.toLowerCase().search("/youtube.") > -1) {
        return prefix + "Youtube";
    } else if (url.toLowerCase().search(".muzu.tv") > -1 || url.toLowerCase().search("/muzu.tv") > -1) {
        return prefix + "Muzu";
    } else if (url.toLowerCase().search(".vimeo.") > -1 || url.toLowerCase().search("/vimeo.") > -1) {
        return prefix + "Vimeo";
    } else if (url.toLowerCase().search(".photobucket.") > -1 || url.toLowerCase().search("/photobucket.") > -1) {
        return prefix + "Photobucket";
    } else if (url.toLowerCase().search(".metacafe.") > -1 || url.toLowerCase().search("/metacafe.") > -1) {
        return prefix + "Metacafe";
    } else if (url.toLowerCase().search(".veoh.") > -1 || url.toLowerCase().search("/veoh.") > -1) {
        return prefix + "Veoh";

    } else if (url.toLowerCase().search(".blip.") > -1 || url.toLowerCase().search("/blip.") > -1) {
        return prefix + "Blip";

    } else if (url.toLowerCase().search(".myvideo.") > -1 || url.toLowerCase().search("/myvideo.") > -1) {
        return prefix + "Myvideo";

    } else if (url.toLowerCase().search(".clipfish.") > -1 || url.toLowerCase().search("/clipfish.") > -1) {
        return prefix + "Clipfish";

    }

    return ""

}


mediaController.playSong = function (streamURL, videoURL) {
    console.dir("PLAYSONG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    //streamURL = "http://video-1-9.rutube.ru/hls-vod/QABcsA4mk0tpMcwf-Ykh0g/1398726462/n1vol2/3c0e1ef57e234d0d9b3d4a66cc787f96.mp4.m3u8"
    mediaController.currentStreamURL = streamURL;
    mediaController.currentvideoURL = videoURL;
    videoController.loadSongInSuitablePlayer(streamURL, videoURL);
    videoController.playSong();
    $scope.safeApply();


}

mediaController.PlayingSongError  = function (){
    if(mediaController.currentvideoURL!=""){
        if(mediaController.retrySongCounter<5){
            if(videoController.isEmbedVideo(mediaController.currentvideoURL)){
                mediaController.sendRating("-1");
                mediaController.playNextVersion();
            }
            else
            {
                if(mediaController.retrySongCounter>0){
                  mediaController.sendRating("-1");
                  mediaController.playNextVersion();
                }
                else{
                 mediaController.playStream(mediaController.getSongArtist(playbackController.playingSong), playbackController.playingSong.name, 0,0);
                }
            }
            mediaController.retrySongCounter+1;
        }
    }
}





mediaController.getVersions = function (artist,title) {

    //console.dir("current playlist:");
    //console.dir(playlistController.getLoadedPlaylist());
    // importController.importPlaylist("https://www.youtube.com/watch?v=3O9LzMOqrD4&list=PL0E36D9A2654B03CF");
    //importController.importPlaylist("http://vimeo.com/channels/rihanna");//
    // importController.importPlaylist("http://www.dailymotion.com/playlist/xvguj_dailymotionuk_rihanna/1#video=x6f3n8");//"https://www.youtube.com/watch?v=3O9LzMOqrD4&list=PL0E36D9A2654B03CF");
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        var currentsong = playbackController.getPlayingSong();
        if (mediaController.currentStreamURL != "") {
            if (mediaController.versionListSong != currentsong) {
                mediaController.versionList = [];
                $scope.safeApply();
                $('#reloadVersionButton').hide();
                $("#searchviewVersions").listview('refresh');
                $('#popupVideoSettings').popup('open', {positionTo: '#chooseversionbutton'});
                $('#loadversionimg').css("opacity", "1");
                var getsongversions = function (counter) {
                    if ($(".mejs-button-choose-version button").css("opacity") < 1 && counter > 2)
                        return;
                    var song = playbackController.getPlayingSong();
                    // console.dir("SEARCH OTHER VERSIONS! " + counter + "  - " + mediaController.getSongArtist(song) + " - " + song.name);
                    var artistString = encodeURIComponent(mediaController.getSongArtist(song));
                    var titleString = encodeURIComponent(song.name);
                    if(artistString==artist&&titleString==title){
                        $.ajax({
                            url: preferences.serverURL + "?getversions=8&artist=" + artistString + "&title=" + titleString + "&auth=" + authController.ip_token,
                            success: function (data) {
                                // console.dir("loaded " + counter);
                                // console.dir(data);

                                if (authController.ensureAuthenticated(data, function () {
                                    getsongversions(counter);
                                })) {

                                    var dataok = false;
                                    if (data.track) {
                                        if (data.track.length > 0) {
                                            //  console.dir("SUCCESS VERSIONS! " + counter + "  - " + mediaController.getSongArtist(song) + " - " + song.name);
                                            if (playbackController.getPlayingSong() == song) {
                                                //   console.dir(data.track);
                                                for (var i = 0; i < data.track.length; i++) {
                                                    try {
                                                        data.track[i].title = decodeURIComponent(data.track[i].title);
                                                    }
                                                    catch (e) {
                                                        data.track[i].title = unescape(data.track[i].title);
                                                    }
                                                    try {
                                                        data.track[i].url = decodeURIComponent(data.track[i].url);
                                                    }
                                                    catch (e) {
                                                        data.track[i].url = unescape(data.track[i].url);
                                                    }

                                                }
                                                mediaController.versionListSong = song;


                                                mediaController.versionList = data.track;
                                                mediaController.startVersionIndex = -1;
                                                $('#reloadVersionButton').show();
                                                $scope.safeApply();
                                                $('#loadversionimg').css("opacity", "0");
                                                $("#searchviewVersions").listview('refresh');
                                                $("#popupVideoSettings-popup").css("margin-left", "");

                                                $('#popupVideoSettings').popup("reposition", {positionTo: '#chooseversionbutton'});
                                                $("#popupVideoSettings-popup").css("margin-left", "1px");

                                                ///$('#popupVideoSettings').popup('open', {positionTo: '#chooseversionbutton'});
                                            }
                                            dataok = true;
                                        }
                                    }
                                    if (dataok == false) {
                                        if (counter < 120) {
                                            if (playbackController.getPlayingSong() == song) {
                                                setTimeout(function () {
                                                    getsongversions(counter + 1)
                                                }, 2000);
                                            }
                                        }
                                    }
                                }
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                if (counter < 120) {
                                    if (playbackController.getPlayingSong() == song) {
                                        setTimeout(function () {
                                            getsongversions(counter + 2)
                                        }, 2000);
                                    }
                                }
                            }

                        })
                    }
                }
                getsongversions(0);
            }
            else {
                $("#searchviewVersions").listview('refresh');
                $('#popupVideoSettings').popup('open', {positionTo: '#chooseversionbutton'});
                $scope.safeApply();
                $('#popupVideoSettings').popup("reposition", {positionTo: '#chooseversionbutton'});
            }
        }
    }
}


mediaController.getReloadedVersions = function (artist, title) {

    //console.dir("current playlist:");
    //console.dir(playlistController.getLoadedPlaylist());
    // importController.importPlaylist("https://www.youtube.com/watch?v=3O9LzMOqrD4&list=PL0E36D9A2654B03CF");
    //importController.importPlaylist("http://vimeo.com/channels/rihanna");//
    // importController.importPlaylist("http://www.dailymotion.com/playlist/xvguj_dailymotionuk_rihanna/1#video=x6f3n8");//"https://www.youtube.com/watch?v=3O9LzMOqrD4&list=PL0E36D9A2654B03CF");
    if (authController.ip_token != "auth" && authController.ip_token != "") {
        var currentsong = playbackController.getPlayingSong();
        if (mediaController.currentStreamURL != "") {

            $scope.safeApply();
            $("#searchviewVersions").listview('refresh');
            $('#loadversionimg').css("opacity", "1");
            var getsongversions = function (counter) {
                if ($(".mejs-button-choose-version button").css("opacity") < 1 && counter > 2)
                    return;
                var song = currentsong;
                // console.dir("SEARCH OTHER VERSIONS! " + counter + "  - " + mediaController.getSongArtist(song) + " - " + song.name);
                var artistString = encodeURIComponent(mediaController.getSongArtist(song));
                var titleString = encodeURIComponent(song.name);
                if(artistString==artist&&titleString==title){
                    $.ajax({
                        url: preferences.serverURL + "?getversions=8&artist=" + artistString + "&title=" + titleString + "&auth=" + authController.ip_token,
                        success: function (data) {
                           //console.dir("loaded " + counter);
                           // console.dir(data);

                            if (authController.ensureAuthenticated(data, function () {
                                getsongversions(counter);
                            })) {

                                var dataok = false;
                                if (data.track) {
                                    if (data.track.length > 0) {
                                        //  console.dir("SUCCESS VERSIONS! " + counter + "  - " + mediaController.getSongArtist(song) + " - " + song.name);
                                        if (playbackController.getPlayingSong() == song) {
                                            //   console.dir(data.track);
                                            for (var i = 0; i < data.track.length; i++) {
                                                try {
                                                    data.track[i].title = decodeURIComponent(data.track[i].title);
                                                }
                                                catch (e) {
                                                    data.track[i].title = unescape(data.track[i].title);
                                                }
                                                try {
                                                    data.track[i].url = decodeURIComponent(data.track[i].url);
                                                }
                                                catch (e) {
                                                    data.track[i].url = unescape(data.track[i].url);
                                                }

                                            }
                                            var newlist = true;
                                            for (var i in data.track) {
                                                newlist = true;
                                                for (var j in mediaController.versionList) {
                                                    if (data.track[i].url == mediaController.versionList[j].url) {
                                                        newlist = false;
                                                        break;
                                                    }
                                                }
                                                if( newlist == true)
                                                {
                                                    break;
                                                }
                                            }
                                            mediaController.versionListSong = song;
                                            if(newlist==true){
                                                mediaController.versionList = data.track;
                                                mediaController.startVersionIndex = -1;
                                                $scope.safeApply();
                                                $('#loadversionimg').css("opacity", "0");
                                                $("#searchviewVersions").listview('refresh');
                                                $("#popupVideoSettings-popup").css("margin-left", "");

                                                $('#popupVideoSettings').popup("reposition", {positionTo: '#chooseversionbutton'});
                                                $("#popupVideoSettings-popup").css("margin-left", "1px");
                                                dataok = true;
                                            }
                                            ///$('#popupVideoSettings').popup('open', {positionTo: '#chooseversionbutton'});
                                        }

                                    }
                                }
                                if (dataok == false) {
                                    if (counter < 120) {
                                        if (playbackController.getPlayingSong() == song) {
                                            setTimeout(function () {
                                                getsongversions(counter + 1)
                                            }, 3000);
                                        }
                                    }
                                }
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            console.dir("error " + counter);
                            console.fir(xhr.responseText);
                            if (counter < 120) {
                                if (playbackController.getPlayingSong() == song) {
                                    setTimeout(function () {
                                        getsongversions(counter + 2)
                                    }, 3000);
                                }
                            }
                        }

                    })
                }
            }
            getsongversions(0);
        }
    }
}



mediaController.reloadVersions = function(){
    $('#loadversionimg').css("opacity", "1");
    $('#reloadVersionButton').hide();

    var song = playbackController.getPlayingSong();
    var reload = function (artistString, titleString,duration) {
        $.ajax({
            timeout: 30000,
            url: preferences.serverURL + "?reloadversions=" + artistString + "&title=" + titleString + "&duration=" + duration + "&auth=" + authController.ip_token,
            complete: function (data) {
                setTimeout(function () {mediaController.getReloadedVersions(artistString, titleString)},2000);
            }
        })
    }
    var getinfo = function (artistString, titleString) {
        //mediaController.currentvideoURL = "";
        $.ajax({
            url: "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&artist=" + artistString + "&track=" + titleString + "&format=json",
            success: function (data) {

                var duration = 200000;

                if (data.track) {
                    if (data.track.duration) {
                        duration = data.track.duration;
                    }
                }
                //  alert(artistString+" - "+titleString);
                if (authController.ip_token != "auth" && authController.ip_token != "") {
                    var loadError = false;
                    reload(artistString, titleString,duration);
                }

            }

        })
    }


   var artistString = encodeURIComponent(mediaController.getSongArtist(song));
   var titleString = encodeURIComponent(song.name);
   getinfo(artistString,titleString);


}


mediaController.playVersion = function (songversion, rating, resetVersion) {
    console.dir("PLAY VERSION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    var loadError = false;

    $('#loadversionimg').css("opacity", "1");

    mediaController.playCounter++;
    var streamID = mediaController.playCounter;
    var videoURL = songversion.url
    var play = function (streamID, videoURL) {
        var song = playbackController.getPlayingSong();
        if (videoURL != mediaController.currentvideoURL) {
            if (videoController.isEmbedVideo(videoURL)) {

                if (rating == 1) {
                    mediaController.sendRating("-1");
                }
                mediaController.playStreamURLSeek(videoURL, videoURL, true, rating);
                $('#loadversionimg').css("opacity", "0");
                setTimeout(function () {
                    videoController.showBuffering(false);
                }, 500);
            }
            else {
                //  console.dir(videoURL);
                if (authController.ip_token != "auth" && authController.ip_token != "") {
                    $.ajax({
                        timeout: 30000,
                        url: preferences.serverURL + "?playurl=" + encodeURIComponent(videoURL) + "&artist=" + encodeURIComponent(mediaController.getSongArtist(song)) + "&title=" + encodeURIComponent(song.name) + "&auth=" + authController.ip_token,
                        success: function (data) {

                            if (authController.ensureAuthenticated(data, function () {
                                play(streamID, videoURL);
                            })) {

                                if (streamID == mediaController.playCounter) {
                                    if (data.streamURL) {
                                        var streamURL = data.streamURL;
                                        if (data.videoURL) {
                                            videoURL = data.videoURL;
                                        }
                                        videoURL = unescape(videoURL);
                                        streamURL = unescape(streamURL);
                                        if (streamURL) {
                                            if (rating == 1) {
                                                mediaController.sendRating("-1");
                                            }
                                            if (resetVersion == 1) {
                                                mediaController.startVersionIndex = -1;
                                            }
                                            mediaController.seekTime = videoController.progressTime//uiController.mediaElementPlayer.getCurrentTime();
                                            mediaController.seekTimeDuration = videoController.maxTime; //uiController.mediaElementPlayer.media.duration;
                                            mediaController.versionListSong = song;
                                            mediaController.playStreamURLSeek(streamURL, videoURL, true, rating);
                                        } else
                                            loadError = true;

                                    } else
                                        loadError = true;
                                } else
                                    loadError = true;
                            }
                        },
                        error: function () {
                            loadError = true;
                        },
                        complete: function () {
                            //TODO
                            $('#loadversionimg').css("opacity", "0");
                            setTimeout(function () {
                                videoController.showBuffering(false);
                            }, 500);

                        }
                    })
                }
            }
        }
        else {
            $('#loadversionimg').css("opacity", "0");
            setTimeout(function () {
                videoController.showBuffering(false);
            }, 500);
        }

    }
    play(streamID, videoURL);

}

mediaController.loadStreamURL = function (streamID, searchString, artistString, titleString, streamURL, duration, playedAutomatic,fromCache) {

    var loadError = false;
    //var stime=new Date();
    //var time=stime.getTime();
    $.ajax({
        timeout: 30000,
        url: preferences.serverURL + "?play=" + encodeURIComponent(searchString) + "&force1=" + encodeURIComponent(artistString) + "&force2=" + encodeURIComponent(titleString) + "&duration=" + duration +"&fromCache="+fromCache+"&auth=" + authController.ip_token,
        success: function (data) {
            if (streamID == mediaController.playCounter) {
                //var etime=new Date();
                //var diff = etime.getTime()-time;
                //alert("RESPONSE TIME: "+diff+" ms");

                if (authController.ensureAuthenticated(data, function () {
                    mediaController.loadStreamURL(streamID, searchString, artistString, titleString, streamURL, duration, playedAutomatic,fromCache);
                })) {

                    // console.dir(preferences.serverURL + "?play=" + searchString + "&force1=" + artistString + "&force2=" + titleString + "&duration=" + duration);
                    mediaController.playCounter++;
                    // console.dir("STREAM");
                    // console.dir(data);
                    //
                    var videoURL = "";
                    if (data.videoURL) {
                        videoURL = data.videoURL;
                    }
                    videoURL = unescape(videoURL);
                    if (videoController.isEmbedVideo(videoURL)) {
                        streamURL = videoURL;
                        mediaController.playStreamURL(streamURL, videoURL, true);
                        if (playbackController.playedSongs.length > 100) {
                            playbackController.playedSongs.splice(playbackController.playedSongs.length - 100, 100)
                        }

                    }
                    else if (data.streamURL) {
                        streamURL = data.streamURL;
                        streamURL = unescape(streamURL);
                        console.dir(data);

                        if (streamURL) {

                            mediaController.playStreamURL(streamURL, videoURL, true);

                            if (playbackController.playedSongs.length > 100) {
                                playbackController.playedSongs.splice(playbackController.playedSongs.length - 100, 100)
                            }

                        }
                        //loadError = true;

                    } else
                        loadError = true;
                }
            }
        },
        error: function () {
            loadError = true;
            /* setTimeout(function () {
             videoController.showBuffered(true);
             videoController.showBuffering(false);
             }, 500);*/
        },
        complete: function () {

            //log("COMPLETED")
            //playbackController.isLoading = false;
            //console.log("LOADED")
            if (loadError) {
                //  console.log("ERROR")
                mediaController.onLoadingError(streamID, playedAutomatic);
            }
        }
    })
}


mediaController.onLoadingError = function (streamID, playedAutomatic) {
    //console.log("ERROR")
    if (streamID == mediaController.playCounter) {

        setTimeout(function () {
            videoController.showBuffering(false);
        }, 500);

        uiController.toast("Sorry, this song is not available at the moment.", 1500);
        if (!playedAutomatic)
            playbackController.resetPlayingSong();
        else
            playbackController.playNextSong();

        mediaController.songError();
    }
}


mediaController.playStream = function (artist, title, playedAutomatic,fromCache) {
    if(fromCache==0){
        mediaController.retrySongCounter = 0;
    }
    //videoController.showBuffering(true);

    //videoController.showBuffered(false);

    videoController.setLoopButton(false);

    mediaController.playCounter++;
    var streamID = mediaController.playCounter;
    var artistString = artist;
    var titleString = title;


    artistString = artistString.replace("?", "");
    titleString = titleString.replace("?", "");

    var searchString = ""
    if (artist != "")
        searchString = artist + " - " + title;
    else
        searchString = title;

    var streamURL = "";


    var play = function (streamID, searchString, artistString, titleString, streamURL,fromCache) {
        //mediaController.currentvideoURL = "";
        $.ajax({
            url: "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&artist=" + encodeURIComponent(artistString) + "&track=" + encodeURIComponent(titleString) + "&format=json",
            success: function (data) {
                if (streamID == mediaController.playCounter) {

                    var duration = 200000;

                    if (data.track) {
                        if (data.track.duration) {
                            duration = data.track.duration;
                        }
                    }
                    //  alert(artistString+" - "+titleString);
                    if (authController.ip_token != "auth" && authController.ip_token != "") {
                        var loadError = false;
                        mediaController.loadStreamURL(streamID, searchString, artistString, titleString, streamURL, duration, playedAutomatic,fromCache);
                    }
                }

            },
            error: function () {
                // console.log("ERROR")
                var duration = 200000;
                mediaController.loadStreamURL(streamID, searchString, artistString, titleString, streamURL, duration, playedAutomatic,fromCache);
            }

        })
    }

    play(streamID, searchString, artistString, titleString, streamURL,fromCache);


}

mediaController.playStreamURLSeek = function (streamURL, videoURL, differentVersions, rating) {
    // $("#videoplayer").removeClass("animate").addClass("animatefast");
    // $("#videoplayer").css("opacity", "0");
    // $("#videoplayer").css("pointer-events", "none");
    console.dir("playStreamURLSeek!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    setTimeout(function () {
        // $("#videoplayer").removeClass("animatefast").addClass("animate");

        // playlistController.playingTitle = playlistController.playlingTitleLoading ;
        // playlistController.playlingTitleCover = playlistController.playlingTitleCoverLoading ;


        playbackController.playingOldSong = playbackController.playingSong;

        playbackController.setNewTitle(playbackController.playingSong.name, mediaController.getSongCover(playbackController.playingSong), true);


        mediaController.playSong(streamURL, videoURL)

        if (rating == 1) {
            mediaController.sendRating("1");
        }


        if (differentVersions) {
            videoController.disableVersionControl(false);

            /* $("#chooseversionbutton").removeClass("rotateIt");
             setTimeout(function () {
             $("#chooseversionbutton").addClass("rotateIt");
             }, 500)*/
        } else
            videoController.disableVersionControl(true);


    }, 200)


}


mediaController.songError = function () {

    setTimeout(function () {
        videoController.showBuffering(false);
    }, 500);
    uiController.toast("Sorry, this song is not available at the moment.", 1500);
    // $("#videoplayer").css("opacity", "0");
    playbackController.resetPlayingSong();
}

mediaController.playNextVersion = function () {
    console.dir("playNextVersion!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    if (!videoController.versionsEnabled)
        return;
    var currentsong = playbackController.getPlayingSong();
    if (currentsong.name != "") {
        if (mediaController.versionListSong != currentsong) {
            var getsongversions = function (counter) {
                if (counter < 120) {
                    if (authController.ip_token != "auth" && authController.ip_token != "") {
                        var song = currentsong;
                        $.ajax({
                            url: preferences.serverURL + "?getversions=8&artist=" + encodeURIComponent(mediaController.getSongArtist(song)) + "&title=" + encodeURIComponent(song.name) + "&auth=" + authController.ip_token,
                            success: function (data) {

                                if (authController.ensureAuthenticated(data, function () {
                                    getsongversions(counter);
                                })) {

                                    if (data.track) {
                                        if (playbackController.getPlayingSong() == song) {
                                            mediaController.startVersionIndex = -1;
                                            var nextIndex = -1
                                            for (var i = 0; i < data.track.length; i++) {
                                                try {
                                                    data.track[i].title = decodeURIComponent(data.track[i].title);
                                                }
                                                catch (e) {
                                                    data.track[i].title = unescape(data.track[i].title);
                                                }
                                                try {
                                                    data.track[i].url = decodeURIComponent(data.track[i].url);
                                                }
                                                catch (e) {
                                                    data.track[i].url = unescape(data.track[i].url);
                                                }
                                                if (data.track[i].url == mediaController.currentvideoURL) {
                                                    nextIndex = i;
                                                }
                                            }
                                            nextIndex = nextIndex + 1;
                                            if (nextIndex >= data.track.length) {
                                                nextIndex = 0;
                                            }
                                            mediaController.playVersion(data.track[nextIndex], 1, 0);
                                        }
                                    }
                                    else {
                                        if (playbackController.getPlayingSong() == song) {
                                            setTimeout(function () {
                                                getsongversions(counter + 1)
                                            }, 1500);
                                        }
                                    }
                                }
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                if (playbackController.getPlayingSong() == song) {
                                    setTimeout(function () {
                                        getsongversions(counter + 2)
                                    }, 5000);
                                }
                            }

                        })
                    }
                }
            }
            getsongversions(0);
        }
        else {
            var nextIndex = -1
            for (var i = 0; i < mediaController.versionList.length; i++) {
                if (mediaController.versionList[i].url == mediaController.currentvideoURL) {
                    nextIndex = i;
                }
            }

            nextIndex = nextIndex + 1;
            if (nextIndex >= mediaController.versionList.length) {
                nextIndex = 0;
            }
            console.log("nextIndex: " + nextIndex);
            console.log("startVersionIndex: " + mediaController.startVersionIndex);
            if (mediaController.startVersionIndex != nextIndex) {
                if (mediaController.startVersionIndex == -1) {
                    mediaController.startVersionIndex = nextIndex;

                }
                mediaController.playVersion(mediaController.versionList[nextIndex], 1, 0)
            }
            else {
                mediaController.songError();
            }
        }
    }
}


mediaController.playStreamURL = function (streamURL, videoURL, differentVersions) {
    console.dir("playStreamURL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

    $(".songlist li.oldloadedsong").removeClass("oldloadedsong loadedsong playing pausing");    //


    //$("#videoplayer").removeClass("animate").addClass("animatefast");
    //$("#videoplayer").css("opacity", "0");
    //$("#videoplayer").css("pointer-events", "none");
    /*setTimeout(function () {
     videoController.showBuffering(false);
     videoController.showBuffered(true);
     }, 500);*/
    uiController.swipeTimer = Date.now(); //Avoid Clicks
    setTimeout(function () {

        var listElement = playbackController.getListElementFromElement(playbackController.playingSong);

        if (listElement.length==0||(listElement.length>0&&listElement.hasClass("loadedsong"))) {
            uiController.dontRemark = true;

            var loadTime = Date.now() - playbackController.startedLoadingTime;
            /* var delayTime = loadTime % 2000;
             if(delayTime>400)
             delayTime = delayTime-400;
             else
             delayTime = 0;
             */
            listElement.addClass("firstplay");

            //  setTimeout(function () {

            var cover = listElement.find("img.ui-li-icon");
            var playing = listElement.find(".loadingSongImg");

            cover.addClass("fadeout");
            playing.addClass("fadeout");

            uiController.swipeTimer = Date.now();//Avoid Clicks

            setTimeout(function () {

                if (listElement.hasClass("stillloading")) {
                    listElement.addClass("playing");
                    listElement.removeClass("stillloading")
                }

                listElement.find("img.ui-li-icon").css("opacity", "0.001")
                listElement.find(".loadingSongImg").css("opacity", "0")

                listElement.find(".loadingSongImg").removeClass("fadeout")

                listElement.find("img.ui-li-icon").removeClass("fadeout");
                setTimeout(function () {
                    listElement.find("img.ui-li-icon").addClass("fadeincomplete")
                    listElement.removeClass("firstplay");
                    setTimeout(function () {
                        listElement.find(".loadingSongImg").css("opacity", "")
                        listElement.find("img.ui-li-icon").css("opacity", "1")
                        listElement.find("img.ui-li-icon").removeClass("fadeincomplete");
                        uiController.dontRemark = false;
                    }, 1000)
                }, 500)

            }, 50)
            //  }, delayTime)

            // $("#videoplayer").removeClass("animatefast").addClass("animate");

            // playlistController.playingTitle = playlistController.playlingTitleLoading ;
            // playlistController.playlingTitleCover = playlistController.playlingTitleCoverLoading ;

            playbackController.playingOldSong = playbackController.playingSong;

            playbackController.setNewTitle(playbackController.playingSong.name, mediaController.getSongCover(playbackController.playingSong), true);
            mediaController.playSong(streamURL, videoURL);

            //$("#siteLogoImage").attr('onclick',"win=window.open('"+mediaController.currentvideoURL+"', '_blank')");

            console.dir(streamURL);


            if (differentVersions) {
                videoController.disableVersionControl(false);

                /* $("#chooseversionbutton").removeClass("rotateIt");
                 setTimeout(function () {
                 $("#chooseversionbutton").addClass("rotateIt");
                 }, 500)*/
            } else
                videoController.disableVersionControl(true);

        }
    }, 100)


}


mediaController.toggleLyrics = function () {

    var iframe = $('#lyricsiframe');

    /*
     if (!mediaController.showLyrics)

     setTimeout(function () {
     uiController.toast("These Lyrics are external content from LyricWiki.<br>More information at <a href='http://lyrics.wikia.com/" + mediaController.getSongArtist(playbackController.playingSong) + ":" + playbackController.playingSong.name + "' target='_blank'>lyrics.wikia.com</a>.", 5000)
     }, 2500);
     */
    mediaController.showLyrics = !mediaController.showLyrics;
    if (mediaController.showLyrics) {
        if (playbackController.playingSong) {
            var src = "http://lyrics.wikia.com/" + mediaController.getSongArtist(playbackController.playingSong) + ":" + playbackController.playingSong.name + "?useskin=wikiamobile";
            if ($("#lyricsifrm").attr("src") != src)
                $("#lyricsifrm").attr("src", src);

            iframe.show();
            setTimeout(function () {
                iframe.css("left", "").css("opacity", "").css("pointer-events", "auto");
            }, 0)
        }
    } else {
        iframe.css("left", "-50px").css("opacity", "0").css("pointer-events", "none");
        setTimeout(function () {
            iframe.hide();
        }, 1500)

    }

}


/**
 * Get Cover for loaded Playlist
 * @returns {string}
 */
mediaController.getSongCoverForLoadedPlaylist = function () {


    if (playlistController.loadedPlaylists[0] && playbackController.playingSong) {
        return mediaController.getSongCover(playbackController.playingSong);

    } else
        return "public/img/playlist.png";


}


/**
 * Get the Cover for Element
 * @returns {string}
 */
mediaController.getImage = function (element, defaultImage) {
    if (!defaultImage)
        var url = "public/img/playlist.png";
    else
        url = defaultImage

    if (element.image) {

        if (element.image[1])
            url = element.image[1]['#text'];
        else
            url = element.image[0]['#text']
    } else
        url = "public/img/playlist.png";


    if (!url || $.trim(url) == "")
        url = "public/img/playlist.png";

    return url ;

}


/**
 * Get the Cover for Playlist
 * @param index
 * @param playlist
 * @returns {string}
 */
mediaController.getPlaylistCoverSong = function (index, maxIndex, playlist, playingSong) {

    if (playlist.isPlaylist) {


        if (playingSong && playbackController.playingSong)
            return "background-image:url(" + mediaController.getSongCover(playbackController.playingSong, (index != 0)) + ")";

        var actIndex = playlist.tracks.length - 1 - index;


        if (playlist.tracks && playlist.tracks[actIndex]) {
            if (playlist.tracks[actIndex].isGoogleDrive) {
                return "background-image:url(public/img/playlistgdrive.png)";

            } else {

                return "background-image:url(" + mediaController.getSongCover(playlist.tracks[actIndex], (index != 0)) + ")";

            }
        }
        else {
            return "background-image:url(public/img/playlist.png);opacity:0.9;";

        }


    } else
        return "display:none";


}


mediaController.getSongCover = function (song, lowQuality) {
    var url = "";
    if(!song)
        url = "public/img/playlist.png";
    else if (song.isPlaylist) {
        url = "public/img/empty.png";
    } else {

        if (song.image) {

            if (song.image[1] && !lowQuality)
                url = song.image[1]['#text'];
            else
                url = song.image[0]['#text']
        } else
            url = "public/img/playlist.png";

    }
    if (!url || $.trim(url) == "")
        url = "public/img/playlist.png";

    return url;
}




mediaController.getSongDisplayName = function (song) {
    if (!song)
        return mediaController.unknownData;

    var artist = mediaController.getSongArtist(song);
    if (artist == "") {
        if (song.name)
            return song.name
        else
            return mediaController.unknownData;
    } else {
        if (song.name)
            return artist + " - " + song.name;
        else
            return artist + " - " + mediaController.unknownData;

    }

}

/**
 * Returns Title for Element, used in List to identify elemenet
 * @param element
 * @returns {string}
 */
mediaController.getElementTitle = function(element) {

    var name = element.name;

    var artist =element.artist.name;
    if (element.artist&&element.artist.name)
        artist = element.artist.name;
    else
        artist = mediaController.unknownData;


    if(element.isPlaylist){
       return "Playlist: "+ name+" - " +  artist;
    } else{

       return "Song: "+ name+" - " +  artist;

    }

}


mediaController.getSongArtist = function (song) {
    if (!song)
        return mediaController.unknownData;

    var artist = mediaController.unknownData;
    if (song.artist) {
        if (song.artist.name)
            artist = song.artist.name;
        else if (song.artist)
            artist = song.artist;
    }
    return artist;
}

mediaController.openExternalSite = function () {

    window.open(mediaController.currentvideoURL, '_blank');
    if (videoController.isPlaying) {
        //uiController.mediaElementPlayer.pause();
        videoController.pauseSong();

    }
}

mediaController.showNewMedia = function () {
    //    videobox.empty();
    //    videobox.append('<video id="videoplayer" preload="auto" src="http://www.youtube.com/watch?v=Qqqdw0poiSI" width="100%" height="100%" autoplay="autoplay" loop="loop" />');
    //    videobox.show();

    //  videoplayer.remove();
}

cryptauth = function (string) {
    return SHA1(string + mediaController.randomseed + mediaController.ipaddress + mediaController.clientid);
}


/*
 mediaController.restartPlayer  = function (){


 var videobox = $('#videoplayerInner').first();
 var videoplayer = $('#player1').first();
 videobox.empty();
 videoplayer.remove();
 uiController.mediaElementPlayer.media.remove();
 uiController.mediaElementPlayer.remove();

 videobox.append('<video id="player1" controls="controls" autoplay="true" preload="true"><source src="" type="video/mp4"/><source src="" type="video/flv"/></video>');
 videobox.show();

 // videobox.append('<video id="player1" controls="controls" autoplay="true" preload="true"><source src="" type="video/mp4"/><source src="" type="video/flv"/></video>');
 $("#videocontrols").remove();
 $("#videocontrols").append('<div id="videocontrolsInner"><div class="mejs-button mejs-button-choose-version mejs-custom-button"> <button type="button" id="chooseversionbutton" data-role="none" style="opacity:0.5" onclick="mediaController.getVersions();" aria-controls="mep_0" title="Choose Version" aria-label="Choose Version"></button> </div><div class="mejs-button mejs-button-lyrics mejs-custom-button"><button type="button" id="lyricsbutton" data-role="none" style="opacity:0.5" onclick="mediaController.toggleLyrics();" aria-controls="mep_0" title="Lyrics" aria-label="Lyrics"></button></div> <div class="mejs-button mejs-button-facebook mejs-custom-button"><button type="button" id="facebookpostbutton" data-role="none" style="opacity:0.5" onclick="mediaController.postOnFacebook();" aria-controls="mep_0" title="Facebook" aria-label="Facebook"></button></div></div>');

 uiController.initMediaPlayer();
 uiController.styleVideo();

 $("#videocontrolsInner").show();
 $("#videocontrols").show();
 $('#player1').first().show();
 $('#player1').show();
 $("#videoplayer").css("opacity", "1");
 $("#videocontrols").css("opacity", "1");
 videobox.show();
 }
 */