/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        // Nicht verwenden für Webseite, wird nur in phonegap gefeuert


    }

};

var preferences = {
   serverURL: "http://localhost:3001/"
   //serverURL: "http://info.jukebox.selfhost.eu:3001/"
}

$.support.cors = true;

lyricscallback = function (test) {
    alert(text)
}
lyricsvisible = false;


var urlParams;
var loadUrlParams = function () {
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) {
            return decodeURIComponent(s.replace(pl, " "));
        },
        query = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);

}

window.onbeforeunload = function (event) {

    if (typeof event == 'undefined') {
        event = window.event;
    }

    if (event&& playlistController.playlists.length>1){//&&accountController.loggedIn ){
        var message = 'Without an Sonbase.fm Account your unsaved Playlists will be lost!';
        event.returnValue = message;
    }
    return message;
}


$(document).ready(function () {


    // FastClick.attach(document.body);

    $.mobile.loading("show");
    var initPage = function () {
        if ($scope.loaded) {

            app.isCordova = (window.location.hash == "#cordova" );
            loadUrlParams();
            facebookHandler.init();
            mediaController.init();
            authController.init();
            uiController.init();
            searchController.init();
            playlistController.init();
            accountController.init();
            videoController.init();


            setTimeout(function () {
                $("#searchinput").focus();
            }, 500);


            console.dir(urlParams);
            setTimeout(function () {
                if (urlParams.search && urlParams.search != "") {

                    $("#searchinput").val(urlParams.search);
                    $("#searchinput").trigger("input");
                    function search(searchID) {
                        searchController.searchSongs(urlParams.search, "", "", function (list) {
                            searchController.completeSearch(list, null, searchController.searchCounter)
                        });
                    }

                    search(searchController.searchCounter);
                    searchController.searchCounter++;

                }
                if (urlParams.artist && urlParams.artist != "") {
                    if (urlParams.title && urlParams.title != "") {
                        var song = {
                            artist: urlParams.artist,
                            name: urlParams.title,
                            id: "slsid" + helperFunctions.padZeros(1, 2)
                        }

                        playbackController.playSong(song, false, false);
                    }
                }
            }, 3500);

            //Show loaded page
            $scope.safeApply();
            $("#page").css("opacity", "1");


            var updatePage = function () {
                if ($("#playlistInner ul").length > 0) //Check if angular loaded
                    uiController.updateUI();
                else
                    setTimeout(updatePage, 200);

            }
            setTimeout(updatePage, 500);


        } else
            setTimeout(initPage, 50);
    }
    initPage();

    //http://localhost:3001/?play=alesso%20under%20control
});

showregisterpopup = false;

//JQ Erweiterungen


jQuery.fn.outerHTML = function (s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};


if (!Object.keys) {
    Object.keys = function (obj) {
        var keys = [],
            k;
        for (k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}


