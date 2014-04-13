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
    this.container = null; //Container of the mediaelement, wil be created by MediaElementPlayer()
    this.videoSelector = selector;
    this.videoElement = $(selector);

    /**
     * Init Player
     */
    this.init = function () {

        var that = this;
        this.mediaElementPlayer = new MediaElementPlayer(selector, {
            features: [ 'prevtrack', 'playpause', 'stop', 'nexttrack', 'shuffle', 'current', 'progress', 'duration', 'volume', 'fullscreen'],

            enableKeyboard: false,
            //poster: 'http://mediaelementjs.com/media/echo-hereweare-540x304.jpg',
            alwaysShowControls: true,
            autosizeProgress: false,

            success: function (mediaElement, domObject) {
                that.container = $(selector).parents(".mejs-container");

                that.container.find("video").css("opacity","0");


                setTimeout(function () {
                    var oldSetProgressRail = that.mediaElementPlayer.setProgressRail;
                    that.mediaElementPlayer.setProgressRail = function () {
                        var percent = oldSetProgressRail();

                        var target = that.mediaElementPlayer.media;
                        if (target && target.buffered && target.buffered.length > 0 && target.buffered.end && target.duration) {

                            var minDiff = target.duration;
                            var minDiffPos = 0;
                            for (var i = 0; i < target.buffered.length; i++) {
                                var diff = target.buffered.end(i)-target.currentTime;
                                if(diff>=0&& diff < minDiff)  {
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

                $("#siteLogo").appendTo(resizeLayer)

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
                    if (mediaController.currentvideoURL ) {
                        mediaController.playNextVersion();
                    }
                });

                mediaElement.addEventListener('loadeddata', function (e) {
                    videoController.setMaxTime(mediaElement.duration)
                    videoController.normalizeVideoSize(that.videoSelector);
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

    }


    /**
     * Load Player with Url before using
     */
    this.unload = function (url) {
        this.stop();
        this.stopUpdateTime();
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
        this.mediaElementPlayer.play();
    };


    this.pause = function () {
        this.mediaElementPlayer.pause();
        this.stopUpdateTime();

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
        if(this.mediaElementPlayer&& this.mediaElementPlayer.media)
          this.mediaElementPlayer.media.setVolume(volume);
    };


    /**
     * Set Fullscreen Mode
     * @param mode  0: Window ,1: Background ,2: Fullscreen
     */
    this.setFullscreenMode = function (mode) {

        i
        $("#videoplayer").hide();
        $("#videoplayer video").addClass("backgroundVideo").insertAfter("#backgroundImage");

        if (videoController.isPlaying)
            var isPlaying = true;
        else
            isPlaying = false;

        if (mode == 0) {
            this.container.find('.mejs-fullscreen-button').click();//TODO remvove with function, but not available in mediaelementjs :(

        } else if (mode == 1) { //Background

            this.videoElement.addClass("backgroundVideo").insertAfter("#backgroundImage");

            $("#videoplayer").hide();


        } else if (mode == 2) {
            $("#videoplayer").show();

            $(".backgroundVideo").removeClass("backgroundVideo").appendTo(".mejs-mediaelement");

            this.container.find('.mejs-fullscreen-button').click();//TODO remvove with function, but not available in mediaelementjs :(

        }

        if (isPlaying)
            this.play();


    };


}