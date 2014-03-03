/**
 * uiController.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 01.03.14 - 11:08
 * @copyright munichDev UG
 */


var uiController = function () {

};


uiController.responsiveWidthSmallest = 670;

uiController.responsiveWidthSmall = 850;


uiController.responsiveWidthSmaller = 1115;

/**
 * Init Controller
 */
uiController.init = function () {




    //On Window Resize
    $(window).resize(function () {
        if ($('.ui-panel-open').length != 0) {
            $('#rightpanel').panel('close');
        }
        if (uiController.sortPlaylist)
            uiController.toggleSortablePlaylist();
        uiController.updateUI();
    });


    MediaElementPlayer.prototype.enterFullScreen_org = MediaElementPlayer.prototype.enterFullScreen;
    MediaElementPlayer.prototype.enterFullScreen = function () {
        // Your code here
        $("#videocontrols .mejs-controls").appendTo("#videoplayer .mejs-inner");
        $("#videoplayer").css("-webkit-transform", "scale(1)");
        $("#videoplayer").css("transform", "scale(1)");
        $("#videoplayer").css("-webkit-transform-origin", "50% 50%");
        $("#videoplayer").css("transform-origin", "50% 50%");

        this.enterFullScreen_org();
        $("#videoplayer").css("text-align", "left");


    }
    MediaElementPlayer.prototype.exitFullScreen_org = MediaElementPlayer.prototype.exitFullScreen;
    MediaElementPlayer.prototype.exitFullScreen = function () {
        $("#videoplayer").css("text-align", "center")
        $("#videoplayer").css("-webkit-transform", "scale(0.5)");
        $("#videoplayer").css("transform", "scale(0.5)");
        $("#videoplayer").css("-webkit-transform-origin", "50% 50%");
        $("#videoplayer").css("transform-origin", "50% 50%");


        $("#videoplayer .mejs-controls").appendTo("#videocontrols");

        this.exitFullScreen_org();

    }
    MediaElementPlayer.prototype.extoptions = {scale: 1.5, displayBox: false};


    uiController.mediaElementPlayer = new MediaElementPlayer('video,audio', {
        features: ['playpause', 'current', 'progress', 'duration', 'volume', 'fullscreen'],
        poster: 'http://mediaelementjs.com/media/echo-hereweare-540x304.jpg',
        alwaysShowControls: true,
        autosizeProgress: false,
        success: function (mediaElement, domObject) {
            console.dir(mediaElement)
        }});

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


    $("#videoplayer .mejs-controls").css("background", "none");
    $("#videoplayer .mejs-controls").css("background", "none");
    $("#videocontrols").css("background", "none");

    $("#videoplayer .mejs-controls").appendTo("#videocontrols");

    $("#videoplayer").css("text-align", "center")
    $("#videoplayer").css("-webkit-transform", "scale(0.5)");
    $("#videoplayer").css("transform", "scale(0.5)");
    $("#videoplayer").css("-webkit-transform-origin", "50% 50%");
    $("#videoplayer").css("transform-origin", "50% 50%");


    uiController.searchListScroll = new IScroll('#searchlist', {
        zoom: true,
        scrollX: false,
        scrollY: true,
        mouseWheel: true,
        zoomMin: 0.2,
        zoomMax: 1,
        startZoom: 1,
        // wheelAction: 'zoom',
        scrollbars: true,
        noHorizontalZoom: true
    });

    uiController.playListScroll = new IScroll('#playlistInner', {
        zoom: true,
        scrollX: false,
        scrollY: true,
        mouseWheel: true,
        zoomMin: 0.2,
        zoomMax: 1,
        startZoom: 1,
        // wheelAction: 'zoom',
        scrollbars: true,
        noHorizontalZoom: true
    });


    //Animate Sidde Panel Open Icon
    $("#rightpanel").on("panelbeforeclose", function (event, ui) {
        if (uiController.sortPlaylist)
            uiController.toggleSortablePlaylist();
        uiController.sidePanelOpen = false;
        var transform = "translate3d(0px,0px,0px)";
        $("#openSidePanelBarIcon").css({"transition": "0.15s linear", "-transform": transform, "-ms-transform": transform, "-webkit-transform": transform});
        setTimeout(function () {
            uiController.updateUI();
        }, 500)
    });
    $("#rightpanel").on("panelbeforeopen", function (event, ui) {
        uiController.sidePanelOpen = true;
        var transform = "translate3d(10px,0px,0px)";
        $("#openSidePanelBarIcon").css({"transition": "0.15s linear", "-transform": transform, "-ms-transform": transform, "-webkit-transform": transform});
        setTimeout(function () {
            uiController.updateUI();
        }, 500)
    });

    /*
     $( ".sortable" ).sortable( "disable" );



     */

    $("#playlistselectverticalform").chosen({disable_search_threshold: 2})


    $("#playlistselectverticalform").on('change', function (evt, params) {
        uiController.updateUI();
        $(".search-choice-close").click(function () {
            uiController.updateUI();
        })
    });

    $("#playlistview, #searchlistview").sortable({
        tolerance: "pointer",
        dropOnEmpty: true,
        distance: 0.5,
        connectWith: "#playlistview",
        start: function (event, ui) {
            if (!uiController.sortPlaylist)
                uiController.toggleSortablePlaylist();
        },
        stop: function (event, ui) {
            do {
                var marquee = $("#playlist li marquee").get(0);
                $(marquee).replaceWith($(marquee).contents());
            } while (marquee)
        },
        helper: function (event, $item) {
            var $helper = $('<ul></ul>').addClass('draggedlistelement');

            var ele = $helper.append($item.clone())

            var marquee = $(ele).find("marquee").get(0);
            $(marquee).replaceWith($(marquee).contents());

            return ele;
        },
        appendTo: 'body',
        zIndex: "1000000" //or greater than any other relative/absolute/fixed elements and droppables
    }).disableSelection();
    $(".sortable").sortable("disable");

    $("#sortplaylisttext").hide();

    $("#sortplaylistbutton").click(function () {

        uiController.toggleSortablePlaylist();
    })


    uiController.updateUI();
    setTimeout(function () {
        uiController.updateUI();
        $("#playlist").hide();
        $("#playlist").css("opacity", "1");
        $("#playlist").fadeIn();
    }, 0);
};


uiController.toggleSearchButton = function (button) {
    $('#searchbutton' + button).buttonMarkup({theme: 'b'});
    $('#searchbutton' + button).parent().buttonMarkup({theme: 'b'});
    for (var i = 0; i < 5; i++) {
        if (i + 1 != button) {
            $('#searchbutton' + (i + 1)).buttonMarkup({theme: 'a'});
            $('#searchbutton' + (i + 1)).parent().buttonMarkup({theme: 'a'});
        }
    }

}


uiController.toggleSortablePlaylist = function () {
    uiController.sortPlaylist = !uiController.sortPlaylist
    if (uiController.sortPlaylist) {


        /*$("#playlist").css("overflow","visible");
         $("#playlistInner").css("overflow","visible");
         */
        $(".sortable").sortable("enable");

        $(".sortable").disableSelection();
        uiController.playListScroll.disable();
        var style = $('<style id="playlistsortstyle">' +
            '#playlistInner ul li {' +
            'opacity:0.9!important;' +
            'margin-bottom:-1px;' +
            'border-bottom: 1px solid #fff;' +
            '}' +
            '</style>');
        $('html > head').append(style);

        $("#playlistInner .iScrollVerticalScrollbar").hide();
        $("#playlistselectvertical").hide();
        $("#sortplaylisttext").show();


    } else {

        $("#playlistInner .iScrollVerticalScrollbar").show();
        $("#playlistselectvertical").show();
        $("#sortplaylisttext").hide();

        $(".sortable").sortable("disable");
        $(".sortable").enableSelection();

        uiController.playListScroll.enable();
        $("#playlistsortstyle").remove();
    }


}

/**
 * Update UI
 */
uiController.updateUI = function () {


    $(".ui-panel").css("height", $(window).height() - 44 - 3);
    $("#page").css("height", $(window).height() - 44 - 3);

    $("#videoplayer").css("width", $(window).width());


    //Smallest Size
    if ($(window).width() < uiController.responsiveWidthSmallest) {

        if ($("#playlist").parents("#rightpanel").length == 0)
            $("#playlist").appendTo("#rightpanel");


        $("#playlist").css("max-height", $(window).height() - 44 - 3);

        setTimeout(function () {
            if ($("#playlistselectvertical .chosen-container").height() > 0)
                $("#playlistInner").css("max-height", $(window).height() - 44 - 3 - (100 + $("#playlistselectvertical .chosen-container").height() - 30));
            else
                $("#playlistInner").css("max-height", $(window).height() - 44 - 3 - 30);
        }, 100)



        if (uiController.sidePanelOpen) {

            $("#searchlist").css("width", $(window).width() - $("#rightpanel").width() - 10);

            if ($(window).width() - $("#rightpanel").width() - 10 < 100) {
                $("#searchlist li a").wrap('<marquee behavior="alternate"></marquee>');
                $("#searchlist li").css("max-height", "44px");

            }


        }
        else {
            $("#searchlist").css("width", $(window).width() - 20);

            do {
                var marquee = $("#searchlist li marquee").get(0);
                $(marquee).replaceWith($(marquee).contents());
            } while (marquee)
        }



        $("#playlist").css("width", $("#rightpanel").width() - 20);

        $("#playlistselectvertical .chosen-container").css("width", "");
        $("#playlistselectvertical .chosen-container").css("max-width", "");

        $("#playlistselectvertical input").css("width", $("#rightpanel").width() - 80);
        $("#playlistselectvertical input").css("max-width", $("#rightpanel").width() - 80);



    }
    else { //Bigger then Smallest size

        if ($("#playlist").parents("#rightpanel").length != 0){
            $("#playlist").hide().appendTo("#content");
            setTimeout(function () {
                $("#playlist").fadeIn()
            }, 150)
        }

        setTimeout(function () {
            var topDifference;

            if ($("#playlistselectvertical .chosen-container").height() > 0)
                topDifference = $("#playlistselectvertical .chosen-container").height() - 30;
            else
                topDifference = 30;

            //Smaller Size
            if ($(window).width() < uiController.responsiveWidthSmaller&&$(window).width()> uiController.responsiveWidthSmall) {
                $("#playlist").css("max-height", $(window).height() - 44 - 110);
                $("#playlistInner").css("max-height", $(window).height() - 44 - 110 - 100 - topDifference);

            } else {
                $("#playlist").css("max-height", $(window).height() - 44 - 50);
                $("#playlistInner").css("max-height", $(window).height() - 44 - 50 - 100 - topDifference);

            }
        }, 100)

        $("#playlist").css("width", "");


        $("#searchlist").css("max-height", $(window).height() - 44 - 120);

        $("#searchlist").css("width", "");

        $("#playlistselectvertical .chosen-container").css("width", $("#playlist").width() - 50);
        $("#playlistselectvertical .chosen-container").css("max-width", $("#playlist").width() - 50);
        $("#playlistselectvertical input").css("width", $("#playlist").width() - 60);
        $("#playlistselectvertical input").css("max-width", $("#playlist").width() - 60);


    }




    //Small Size
    if ($(window).width() < uiController.responsiveWidthSmall) {

        $("#videoplayer .mejs-time-total").css("width", $(window).width() / 1.5 - 160);
        $("#videoplayer .mejs-time-rail").css("width", $(window).width() / 1.5 - 160 + 10);
        $("#videocontrols .mejs-time-total").css("width", ($(window).width() / 1.5 - 160));


        if (($(window).width() / 1.5 - 160) + 10 < 323)
            $("#videocontrols .mejs-time-rail").css("width", ($(window).width() / 1.5 - 160) + 10);
        else
            $("#videocontrols .mejs-time-rail").css("width", 323);


        $("#searchlist").css("max-height", $(window).height() - 44 - 130 - 50);

        $("#content").css({"width": $(window).width() - 16, "height": $(window).height() - 44 - 4 - 8});



    }
    //Big Size
    else {

        do {
            var marquee = $("#searchlist li marquee").get(0);
            $(marquee).replaceWith($(marquee).contents());
        } while (marquee)

        $("#videoplayer .mejs-time-total").css("width", $(window).width() / 1.5 - 160);
        $("#videoplayer .mejs-time-rail").css("width", $(window).width() / 1.5 - 160 + 10);
        $("#videocontrols .mejs-time-total").css("width", ($(window).width() / 1.5 - 160) / 1.3);
        $("#videocontrols .mejs-time-rail").css("width", ($(window).width() / 1.5 - 160) / 1.3 + 10);



        $("#content").css({"width": $(window).width() - 32, "height": $(window).height() - 44 - 4 - 32});

    }

    if ($(window).width() < 365) {

        $("#controlbar .ui-input-search").css("max-width", $(window).width() - 65);
        $("#controlbar .ui-select").css("max-width", $(window).width() - 25);


    } else {
        $("#controlbar .ui-input-search").css("max-width", 300);
        $("#controlbar .ui-select").css("max-width", 340);

    }

    // alert($("#playlistselectvertical .chosen-container").height() )
    setTimeout(function () {
        if ($("#playlistselectvertical .chosen-container").height() > 0)
            $("#playlistInner").css("top", 100 + $("#playlistselectvertical .chosen-container").height() - 30);
        else
            $("#playlistInner").css("top", 100 + 30);

    }, 100)

    setTimeout(function () {
        uiController.mediaElementPlayer.setControlsSize();
        uiController.searchListScroll.refresh();
        uiController.playListScroll.refresh();
    }, 150)
};


/**
 * Toggle Side Panel
 */
uiController.toggleSidePanel = function () {

    if (!this.toggleSidePanelTimer || Date.now() - this.toggleSidePanelTimer > 200) {
        if ($('.ui-panel-open').length == 0) {

            $('#rightpanel').panel('open')

        } else {

            $('#rightpanel').panel('close')

        }
    }
    this.toggleSidePanelTimer = Date.now();
}


