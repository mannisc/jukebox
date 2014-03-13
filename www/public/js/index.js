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
   // serverURL: "http://localhost:3001/"
    serverURL: "http://info.jukebox.selfhost.eu:3001/"
}

$.support.cors = true;

lyricscallback = function(test){
    alert(text)
}
lyricsvisible=false;

$(document).ready(function () {

    var initPage = function () {
        if ($scope.loaded) {

            app.isCordova = (window.location.hash == "#cordova" );

            uiController.init();
            searchController.init();

            setTimeout(function(){
                $("#searchinput").focus();
            }, 500);

            //Show loaded page
            $("#page").css("opacity", "1");



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




