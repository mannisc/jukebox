/**
 * mediaelementPlayer.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 07.04.14 - 12:00
 * @copyright munichDev UG
 */


var mediaelementPlayer = function (selector) {

    /**
     * HTML5 video Element
     * @type {*|jQuery|HTMLElement}
     */
    this.container = null; //Container of the whole mediaelement, wil be created by MediaElementPlayer()
    this.containerVideo = null; //Container of the mediaelement video element, wil be created by MediaElementPlayer()

    this.videoSelector = selector;
    this.videoElement = $(selector);

    /**
     * Init Player
     */
    this.init = function () {

        var that = this;

        MediaElementPlayer.prototype.extoptions = {scale: 1.5, displayBox: false};
        /*OPTIONS: {
         // if the <video width> is not specified, this is the default
         defaultVideoWidth: 480,
         // if the <video height> is not specified, this is the default
         defaultVideoHeight: 270,
         // if set, overrides <video width>
         videoWidth: -1,
         // if set, overrides <video height>
         videoHeight: -1,
         // width of audio player
         audioWidth: 400,
         // height of audio player
         audioHeight: 30,
         // initial volume when the player starts
         startVolume: 0.8,
         // useful for <audio> player loops
         loop: false,
         // enables Flash and Silverlight to resize to content size
         enableAutosize: true,
         // the order of controls you want on the control bar (and other plugins below)
         features: ['playpause','progress','current','duration','tracks','volume','fullscreen'],
         // Hide controls when playing and mouse is not over the video
         alwaysShowControls: false,
         // force iPad's native controls
         iPadUseNativeControls: false,
         // force iPhone's native controls
         iPhoneUseNativeControls: false,
         // force Android's native controls
         AndroidUseNativeControls: false,
         // forces the hour marker (##:00:00)
         alwaysShowHours: false,
         // show framecount in timecode (##:00:00:00)
         showTimecodeFrameCount: false,
         // used when showTimecodeFrameCount is set to true
         framesPerSecond: 25,
         // turns keyboard support on and off for this instance
         enableKeyboard: true,
         // when this player starts, it will pause other players
         pauseOtherPlayers: true,
         // array of keyboard commands
         keyActions: []
         }*/
        this.mediaElementPlayer = new MediaElementPlayer(selector, {
            features: [ 'prevtrack', 'playpause', 'stop', 'nexttrack', 'shuffle', 'current', 'progress', 'duration', 'volume', 'fullscreen'],
            // when this player starts, it will pause other players
            pauseOtherPlayers: true,
            enableKeyboard: false,
            //poster: 'http://mediaelementjs.com/media/echo-hereweare-540x304.jpg',
            alwaysShowControls: true,
            autosizeProgress: false,

            success: function (mediaElement, domObject) {
                that.container = $(selector).parents(".mejs-container");
                that.containerVideo = $(selector).parents(".mejs-mediaelement");

                setTimeout(function () {
                    var oldSetProgressRail = that.mediaElementPlayer.setProgressRail;
                    that.mediaElementPlayer.setProgressRail = function () {
                        var percent = oldSetProgressRail();

                        var target = that.mediaElementPlayer.media;
                        if (target && target.buffered && target.buffered.length > 0 && target.buffered.end && target.duration) {

                            var minDiff = target.duration;
                            var minDiffPos = 0;
                            for (var i = 0; i < target.buffered.length; i++) {
                                var diff = target.buffered.end(i) - target.currentTime;
                                if (diff >= 0 && diff < minDiff) {
                                    minDiff = diff;
                                    minDiffPos = target.buffered.end(i);
                                }
                            }
                            percent = minDiffPos / target.duration;

                        }
                        // Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
                        // to be anything other than 0. If the byte count is available we use this instead.
                        // Browsers that support the else if do not seem to have the bufferedBytes value and
                        // should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
                        else if (target && target.bytesTotal != undefined && target.bytesTotal > 0 && target.bufferedBytes != undefined) {
                            percent = target.bufferedBytes / target.bytesTotal;
                        }

                        // finally update the progress bar
                        if (percent !== null) {
                            percent = Math.min(1, Math.max(0, percent));
                            videoController.setBufferedPercentage(percent)

                        }

                    }
                }, 0);


                var resizeLayer = $(".mejs-overlay-play").clone();
                resizeLayer.removeClass("mejs-overlay-play").addClass("mejs-overlay-resize");
                resizeLayer.insertAfter(".mejs-overlay-play");
                that.container.find(".mejs-overlay-play").remove();


                //TODO ENABLE CLICK ON VIDEO CPLAY/PAUSE FOR ALL PLAYERS In videoController -----------
                that.container.find(".mejs-overlay-resize").click(function () {
                    setTimeout(function () {
                        if (Date.now() - uiController.noVideoClickTimer > 600) {
                            videoController.playPauseSong();
                        }
                    }, 500)
                })
                that.container.find(".mejs-overlay-resize").dblclick(function () {
                    uiController.noVideoClickTimer = Date.now();

                    if (!uiController.isMaxVideoSizeFaktor(uiController.sizeVideo))
                        uiController.sizeVideo = uiController.sizeVideo * 1.5;
                    else
                        uiController.sizeVideo = 1 / 1.5;

                    uiController.styleVideo();
                })
                //TODO END -----------------------------------------------------------------------------------

                mediaElement.addEventListener("canplay", function (e) {
                    that.mediaElementPlayer.media.setVolume(videoController.volume);
                    that.canplay = true;
                        if (that.startplay){

                            that.play();
                        }
                        else if (that.startplause)
                            that.pause();

                        that.startplause = false;
                        that.startplay = false;
                        that.startplay = false;




                })

                mediaElement.addEventListener("playing", function (e) {

                    videoController.playingSong();

                    that.updateTime.call(that);

                });

                mediaElement.addEventListener("ended", function (e) {
                    videoController.endedSong();
                    that.stopUpdateTime();

                });

                mediaElement.addEventListener("error", function (e) { //TODO VideoController Handling nötig wenn versionen embedded fähig???

                    console.log("MEDIAELEMENT ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                    /*  if (mediaController.currentvideoURL ) {
                     mediaController.playNextVersion();
                     }  */
                });

                mediaElement.addEventListener('loadeddata', function (e) {
                    videoController.setMaxTime(mediaElement.duration)

                    //videoController.normalizeVideoSize(that.videoSelector);
                });
            },
            error: function () {
                console.log("Error creating mediaelementjs!");
            }
        });

    };


    /**
     * Load Player with Url before using
     */
    this.load = function (url) {
        videoController.setProgressPercentage(0);

        this.mediaElementPlayer.setSrc(url);
        this.mediaElementPlayer.load();
        this.containerVideo.addClass("backgroundVideo").appendTo("#backgroundVideo");
        this.canplay = false;
        this.startplay = false;
        this.startplause = false;
        console.log("LOAD"+Date.now())


    }


    /**
     * Load Player with Url before using
     */
    this.unload = function (url) {
        this.stop();
        this.stopUpdateTime();
        this.containerVideo.addClass("backgroundVideo").insertAfter($(this.container).find(".mejs-inner"));
        this.containerVideo.find("video").first().attr('src', '')


    }


    this.updateTime = function () {
        var that = this;

        if (that.updateTimeTimeout) {
            clearTimeout(that.updateTimeTimeout)
            that.updateTimeTimeout = null;
        }
        if (that.mediaElementPlayer) {
            videoController.setProgressTime(that.mediaElementPlayer.media.currentTime);
        }
        this.updateTimeTimeout = setTimeout(function () {
            that.updateTime.call(that)
        }, 100);
    }

    this.stopUpdateTime = function () {
        if (this.updateTimeTimeout) {
            clearTimeout(this.updateTimeTimeout)
            this.updateTimeTimeout = null;
        }
    }


    this.play = function () {
        if (this.canplay) {

            this.mediaElementPlayer.play();

        }
        else {
            this.startplay = true;
            this.startplause = false;

        }
    };


    this.pause = function () {
        if (this.canplay) {
            this.mediaElementPlayer.pause();
            this.stopUpdateTime();
        } else {
            this.startplay = false;
            this.startplause = true;

        }


    };

    this.stop = function () {
        //this.mediaElementPlayer.pause();

        this.container.find(".mejs-stop-button").click();//TODO remvove with function, but not available in mediaelementjs :(
    };

    /**
     * Set Progress in percentage
     */
    this.setProgressPercentage = function (percentage) {
        if (!this.mediaElementPlayer.media)
            return;
        var newTime = percentage * this.mediaElementPlayer.media.duration;

        // seek to where the mouse is
        if (newTime !== this.mediaElementPlayer.media.currentTime) {
            this.mediaElementPlayer.media.setCurrentTime(newTime);
        }


        videoController.setProgressPercentage(percentage, false)

    }

    this.setVolume = function (volume) {
        if (this.mediaElementPlayer && this.mediaElementPlayer.media)
            this.mediaElementPlayer.media.setVolume(volume);
    };


}

/*
 *
 *

 MediaElementPlayer.prototype.enterFullScreen_org = MediaElementPlayer.prototype.enterFullScreen;
 MediaElementPlayer.prototype.enterFullScreen = function () {
 // Your code here
 $(".mejs-overlay-resize").hide();


 $("#videoplayer").css("-webkit-transform", "scale(1)");
 $("#videoplayer").css("transform", "scale(1)");
 $("#videoplayer").css("-webkit-transform-origin", "50% 50%");
 $("#videoplayer").css("transform-origin", "50% 50%");
 $("#videoplayer").css("opacity", "1");
 $("#videoplayer").css("pointer-events", "auto");


 this.enterFullScreen_org();
 $("#videoplayer").css("text-align", "left");


 }
 MediaElementPlayer.prototype.exitFullScreen_org = MediaElementPlayer.prototype.exitFullScreen;
 MediaElementPlayer.prototype.exitFullScreen = function () {

 var setHeight = function () {
 var height = $("video").outerHeight();  //
 console.log("Height: " + height);
 if (height > 0) {
 uiController.sizeVideoRelative = 400 / height;
 uiController.styleVideo();

 } else
 setTimeout(setHeight, 50);
 }
 setTimeout(setHeight, 50);


 $(".mejs-overlay-resize").show();

 //uiController.translateVideo=0;
 $("#videoplayer").removeClass("animate")


 uiController.updateUI();

 var oSizeVideo = uiController.sizeVideo;
 uiController.sizeVideo = uiController.sizeVideo * 1.5;
 uiController.styleVideo();
 setTimeout(function () {
 uiController.sizeVideo = oSizeVideo
 $("#videoplayer").addClass("animate")
 uiController.styleVideo();

 }, 100)
 $("#videoplayer").css("text-align", "center")


 if (!playbackController.playingSong) {
 $("#videoplayer").css("opacity", "0");
 $("#videoplayer").css("pointer-events", "none");

 }


 this.exitFullScreen_org();

 }
 *
 *
 *
 * */