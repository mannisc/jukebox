/** * mediaController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 03.03.14 - 14:51
 * @copyright  */


var mediaController = function () {

};

mediaController.unknownData = "<Unknown>";

mediaController.playCounter = 0;

mediaController.versionList = [];

mediaController.currentStreamURL = "";
mediaController.currentvideoURL = "";

mediaController.seekTime = 0;
mediaController.seekTimeDuration = 0;

mediaController.buySong = function () {
    var song = playlistController.getPlayingSong();
    if(song){
        var keywords = mediaController.getSongArtist(song) + " - " + song.name;
        mywindow = window.open("http://www.amazon.de/s/?_encoding=UTF8&ajr=0&camp=1638&creative=19454&field-keywords=" + keywords + "&linkCode=ur2&rh=n%3A77195031%2Ck%3A" + keywords + "&site-redirect=de&tag=iggels-21&url=search-alias%3Ddigital-music", "Amazon", "");
        mywindow.focus();
        mediaController.getPrice();
    }
}


mediaController.getPrice = function () {
    var song = playlistController.getPlayingSong();
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


mediaController.visitSongWebPage = function () {
    if (mediaController.currentvideoURL != "") {
        console.dir(mediaController.currentvideoURL);
        mywindow = window.open(mediaController.currentvideoURL, "", "");
        mywindow.focus();
    }
}

mediaController.postOnFacebook = function () {
    if(mediaController.currentvideoURL!=""){
        var song = playlistController.getPlayingSong();
        mywindow = window.open("http://www.facebook.com/sharer.php?u="+mediaController.currentvideoURL+"&t="+mediaController.getSongArtist(song)+" - "+song.name, "", "");
        mywindow.focus();
        mediaController.sendRating("1");
    }
    else{
        mywindow = window.open("http://www.facebook.com/sharer.php?u=", "", ""); //TODO
        mywindow.focus();
    }
}


mediaController.sendRating = function (rating) {
    var song = playlistController.getPlayingSong();
    if(mediaController.currentvideoURL!="" && song){

        $.ajax({
            url: preferences.serverURL + "?ratingURL="+mediaController.currentvideoURL+"&rating="+rating+"&artist="+mediaController.getSongArtist(song)+"&title="+song.name,
            success: function (data) {

            }
        })
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

mediaController.getVersions = function () {

    if($(".mejs-button-choose-version button").css("opacity")<1)
      return;


    var currentsong = playlistController.getPlayingSong();
    if (currentsong.name != "") {
        mediaController.versionList = [];
        $scope.safeApply();
        $("#searchviewVersions").listview('refresh');
        $('#popupVideoSettings').popup('open', {positionTo: '#chooseversionbutton'});
        $('#loadversionimg').css("opacity", "1");
        var getsongversions = function (counter) {
            if (counter < 120) {
                var song = currentsong;
                console.dir("SEARCH OTHER VERSIONS! " + counter + "  - " + mediaController.getSongArtist(song) + " - " + song.name);
                $.ajax({
                    url: preferences.serverURL + "?getversions=8&artist=" + mediaController.getSongArtist(song) + "&title=" + song.name,
                    success: function (data) {
                        console.dir("loaded " + counter);
                        console.dir(data);
                        if (data.track) {
                            console.dir("SUCCESS VERSIONS! " + counter + "  - " + mediaController.getSongArtist(song) + " - " + song.name);
                            if (playlistController.getPlayingSong() == song) {
                                console.dir(data.track);
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
                                mediaController.versionList = data.track;

                                $scope.safeApply();
                                $('#loadversionimg').css("opacity", "0");
                                $("#searchviewVersions").listview('refresh');
                                $('#popupVideoSettings').popup("reposition", {positionTo: '#chooseversionbutton'});
                                ///$('#popupVideoSettings').popup('open', {positionTo: '#chooseversionbutton'});
                            }
                        }
                        else {
                            if (playlistController.getPlayingSong() == song) {
                                setTimeout(function () {
                                    getsongversions(counter + 1)
                                }, 1500);
                            }
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        if (playlistController.getPlayingSong() == song) {
                            setTimeout(function () {
                                getsongversions(counter + 2)
                            }, 5000);
                        }
                    }

                })
            }
        }
        getsongversions(0);
    }
}

mediaController.playVersion = function (songversion) {
    $('#loadversionimg').css("opacity", "1");
    $(".mejs-time-buffering").fadeIn();
    if ($(".mejs-time-loaded").width() > $(".mejs-time-total").width() * 0.7)
        $(".mejs-time-loaded").hide();

    $(".mejs-playpause-button button").removeClass("looped");
    mediaController.playCounter++;
    var streamID = mediaController.playCounter;
    var videoURL = songversion.url
    var play = function (streamID, videoURL) {
        var song = playlistController.getPlayingSong();
        console.dir(videoURL);
        $.ajax({
            timeout: 30000,
            url: preferences.serverURL + "?playurl=" + videoURL + "&artist=" + mediaController.getSongArtist(song) + "&title=" + song.name,
            success: function (data) {
                if (streamID == mediaController.playCounter) {
                    if (data.streamURL) {
                        var streamURL = data.streamURL;
                        if (data.videoURL) {
                            videoURL = data.videoURL;
                        }
                        try {
                            streamURL = decodeURIComponent(streamURL);
                        }
                        catch (e) {
                            streamURL = unescape(streamURL);
                        }
                        try {
                            videoURL = decodeURIComponent(videoURL);
                        }
                        catch (e) {
                            videoURL = unescape(videoURL);
                        }
                        if (streamURL) {
                            mediaController.sendRating("-2");
                            mediaController.seekTime = uiController.mediaElementPlayer.getCurrentTime();
                            mediaController.seekTimeDuration = uiController.mediaElementPlayer.media.duration;
                            mediaController.playStreamURLSeek(streamURL,videoURL,true);

                        } else
                            loadError = true;

                    } else
                        loadError = true;
                } else
                    loadError = true;
            },
            error: function () {
                loadError = true;
            },
            complete: function () {
                //TODO
                $('#loadversionimg').css("opacity", "0");
                setTimeout(function () {
                    $(".mejs-controls").find('.mejs-time-buffering').hide()
                }, 500);
            }
        })

    }
    play(streamID, videoURL);

}


mediaController.playStream = function (artist, title) {

    $(".mejs-time-buffering").fadeIn();

    if ($(".mejs-time-loaded").width() > $(".mejs-time-total").width() * 0.7)
        $(".mejs-time-loaded").hide();


    $(".mejs-playpause-button button").removeClass("looped");

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


    var error = function () {
        console.log("ERROR")
        if (streamID == mediaController.playCounter) {
            setTimeout(function () {
                $(".mejs-controls").find('.mejs-time-buffering').hide()
            }, 500);
            uiController.toast("Sorry, this song is not available at the moment.", 1500)
            playlistController.resetPlayingSong();

        }
    }


    var play = function (streamID, searchString, artistString, titleString, streamURL) {
        mediaController.currentvideoURL = "";

        $.ajax({
            url: "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=019c7bcfc5d37775d1e7f651d4c08e6f&artist=" + artistString + "&track=" + titleString + "&format=json",
            success: function (data) {
                if (streamID == mediaController.playCounter) {
                    setTimeout(function () {
                        if (streamID == mediaController.playCounter)
                            $(".mejs-time-buffering").fadeIn();
                    }, 500);
                    var duration = 200000;

                    if (data.track) {
                        if (data.track.duration) {
                            duration = data.track.duration;
                        }
                    }
                    var loadError = false;
                    $.ajax({
                        timeout: 30000,
                        url: preferences.serverURL + "?play=" + searchString + "&force1=" + artistString + "&force2=" + titleString + "&duration=" + duration,
                        success: function (data) {
                            console.dir(preferences.serverURL + "?play=" + searchString + "&force1=" + artistString + "&force2=" + titleString + "&duration=" + duration);
                            if (streamID == mediaController.playCounter) {
                                mediaController.playCounter++;
                                console.dir("STREAM");
                                console.dir(data);
                                if (data.streamURL) {
                                    streamURL = data.streamURL;
                                    var videoURL = "";
                                    if (data.videoURL) {
                                        videoURL = data.videoURL;
                                    }
                                    try {
                                        streamURL = decodeURIComponent(streamURL);
                                    }
                                    catch (e) {
                                        streamURL = unescape(streamURL);
                                    }
                                    try {
                                        videoURL = decodeURIComponent(videoURL);
                                    }
                                    catch (e) {
                                        videoURL = unescape(videoURL);
                                    }
                                    if (streamURL) {

                                        mediaController.playStreamURL(streamURL,videoURL,true);
                                        playlistController.playedSongs.push(playlistController.loadingSong);

                                        if( playlistController.playedSongs.length>100){
                                            playlistController.playedSongs.splice( playlistController.playedSongs.length-100,100)
                                        }

                                    }
                                    loadError = true;

                                } else
                                    loadError = true;
                            } else
                                loadError = true;
                        },
                        error: function () {
                            loadError = true;
                        },
                        complete: function () {
                            console.log("COMPLETED")
                            playlistController.isLoading = false;
                            if (loadError) {
                                console.log("ERROR")
                                error();
                            }
                        }
                    })


                }

            },
            error: function () {
                console.log("ERROR")
                error();
            }

        })
    }

    play(streamID, searchString, artistString, titleString, streamURL);


}

mediaController.playStreamURLSeek = function (streamURL,videoURL,differentVersions,time) {


    $("#videoplayer").removeClass("animate").addClass("animatefast");
    $("#videoplayer").css("opacity", "0");

    setTimeout(function () {
        $("#videoplayer").removeClass("animatefast").addClass("animate");

        // playlistController.playingTitle = playlistController.playlingTitleLoading ;
        // playlistController.playlingTitleCover = playlistController.playlingTitleCoverLoading ;

        playlistController.loadingOldSong = playlistController.loadingSong;

        playlistController.setNewTitle(playlistController.loadingSong.name, mediaController.getSongCover(playlistController.loadingSong), true);



        uiController.mediaElementPlayer.setSrc(streamURL);
        uiController.mediaElementPlayer.load();
        uiController.mediaElementPlayer.play();

        mediaController.currentStreamURL = streamURL;
        mediaController.currentvideoURL = videoURL;
        mediaController.sendRating("1");
        console.dir(videoURL);


        if(differentVersions) {
            $(".mejs-button-choose-version button").css("opacity", "1");
            $("#chooseversionbutton").removeClass("rotateIt");
            setTimeout(function () {
                $("#chooseversionbutton").addClass("rotateIt");
            }, 500)
        } else
            $(".mejs-button-choose-version button").css("opacity", "0.5");
               uiController.mediaElementPlayer.media.addEventListener('loadedmetadata', mediaController.setVideoTime, false);


    }, 200)


}

mediaController.setVideoTime = function () {
    var duration = uiController.mediaElementPlayer.media.duration;
    var relativTime = mediaController.seekTime;
    console.dir("SEEK:");
    console.dir("duration: "+duration);
    console.dir("seekTimeDuration: "+mediaController.seekTimeDuration);
    console.dir("relativTime: "+relativTime);
    if(mediaController.seekTimeDuration > 0 && duration > 0){
        console.dir("SEEK OK!");
        console.dir(mediaController.seekTimeDuration+" -> "+duration+"  ("+relativTime+")");
       relativTime = ((mediaController.seekTime*1.0)/mediaController.seekTimeDuration)*duration;
    }
    uiController.mediaElementPlayer.setCurrentTime(relativTime);
    uiController.mediaElementPlayer.media.removeEventListener('loadedmetadata', mediaController.setVideoTime, false);
}


mediaController.playStreamURL = function (streamURL,videoURL,differentVersions) {


    $("#videoplayer").removeClass("animate").addClass("animatefast");
    $("#videoplayer").css("opacity", "0");

    setTimeout(function () {
        $("#videoplayer").removeClass("animatefast").addClass("animate");

        // playlistController.playingTitle = playlistController.playlingTitleLoading ;
        // playlistController.playlingTitleCover = playlistController.playlingTitleCoverLoading ;

        playlistController.loadingOldSong = playlistController.loadingSong;

        playlistController.setNewTitle(playlistController.loadingSong.name, mediaController.getSongCover(playlistController.loadingSong), true);



        uiController.mediaElementPlayer.setSrc(streamURL);
        uiController.mediaElementPlayer.load();
        uiController.mediaElementPlayer.play();

        mediaController.currentStreamURL = streamURL;
        mediaController.currentvideoURL = videoURL;
        console.dir(videoURL);



        if (playlistController.playingSongInPlaylist)
            var listElement = $("#playlistInner li[data-songgid='playlistsong" + playlistController.playingSongId + "'] ");
        else
            listElement = $("#searchlist li[data-songid='searchsong" + playlistController.playingSongId + "'] ");

        helperFunctions.clearBackground(".songlist li.loadedsong.stillloading .loadingSongImg");
        listElement.addClass("playing").removeClass("stillloading");


        if(differentVersions) {
            $(".mejs-button-choose-version button").css("opacity", "1");
            $("#chooseversionbutton").removeClass("rotateIt");
            setTimeout(function () {
                $("#chooseversionbutton").addClass("rotateIt");
            }, 500)
        } else
            $(".mejs-button-choose-version button").css("opacity", "0.5");



    }, 200)


}




mediaController.toggleLyrics = function(){

    var iframe =  $('#lyricsiframe');


    if(mediaController.showLyrics===undefined)
        uiController.toast("This Lyrics are external content.<br> Contact the external site for answers regarding its content.", 3000)

    mediaController.showLyrics=!mediaController.showLyrics;
    if(mediaController.showLyrics){
        if(playlistController.loadingSong){
            $("#lyricsifrm").attr("src","http://lyrics.wikia.com/"+mediaController.getSongArtist(playlistController.loadingSong)+":"+playlistController.loadingSong.name);
            iframe.removeClass('fadeoutcomplete');
            iframe.addClass('fadeincompleteslow');
            iframe.show();
        }
    }else{
       iframe.removeClass('fadeincompleteslow');
       iframe.addClass('fadeoutcomplete');
        setTimeout(function(){
           iframe.removeClass('fadeoutcomplete');
           iframe.hide();

        },1000);}

}






    mediaController.getSongCover = function (song) {


    var url;

    if (song.image){
        if(song.image[1])
          url = song.image[1]['#text'];
        else
          url = song.image[0]['#text'];

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