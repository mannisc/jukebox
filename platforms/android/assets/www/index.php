<!DOCTYPE html>
<!--
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->
<html ng-app="mainApp">
<head>
    <!--meta charset="utf-8"/>
    <meta name="format-detection" content="telephone=no"/>
    <!-- WARNING: for iOS 7, remove the width=device-width and height=device-height attributes. See https://issues.apache.org/jira/browse/CB-4323 -->
    <!--meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi"/-->

    <meta charset="utf-8"/>
    <meta name="format-detection" content="telephone=no"/>
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">

    <?php
       echo '<meta property="og:image" content="public/img/logo.gif"/>';
    ?>


    <link rel="icon" href="public/img/logo/logo.ico" sizes="64x64 32x32 24x24 16x16" >


    <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">

    <link rel="stylesheet" type="text/css" href="public/js/libs/chosen/chosen.min.css"/>

    <link rel="stylesheet" type="text/css" href="public/css/fb.css"/>

    <link rel="stylesheet" type="text/css" href="public/css/index.css"/>
    <link rel="stylesheet" type="text/css" href="public/css/songlist.css"/>
    <link rel="stylesheet" type="text/css" href="public/css/theme.css"/>

    <link rel="stylesheet" type="text/css" href="public/css/videoPlayer/videoPlayer.css"/>

    <link rel="stylesheet" type="text/css" href="public/css/libs/jquery.mobile-1.4.2.css"/>
    <link rel="stylesheet" href="public/js/libs/mediaelement/mediaelementplayer.css"/>
    <link rel="stylesheet" href="public/js/libs/mediaelement/playlist/mep-feature-playlist.css"/>

    <link rel="stylesheet" type="text/css" media="screen" href="public/browser-detection/browser-detection.css" />
    <script type="text/javascript" src="public/browser-detection/browser-detection.js"></script>
    <script type="text/javascript">
        <!--
        var noticeLang = "informal";
        var displayPoweredBy = false;
        var notSupportedBrowsers = [{'os': 'Any', 'browser': 'MSIE', 'version': 10.9}, {'os': 'Any', 'browser': 'Firefox', 'version': 3.4}, {'os': 'Any', 'browser': 'Safari', 'version': 3.9}, {'os': 'Any', 'browser': 'Opera', 'version': 10.4}, {'os': 'Any', 'browser': 'Chrome', 'version': 0}];
        // -->
    </script>



    <script type="text/javascript">
        //Reload Page if params
        function getURLParameters(name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (results == null)    return false;
            else    return results[1];
        }


        if (getURLParameters("ui-state")) {
            console.log("RELOAD")
            location.href = 'http://' + window.location.hostname + window.location.pathname;    //TODO !!!!!!!!!!!!!!!

        }
        //PROVIDE DEBUG INFORMATION
        if (typeof window.console == "undefined") {
            window.console = {log: function (str) {
                window.external.Notify(str);
            }};
        }


        function prompt() {

        }


        window.onerror = function (msg, url, linenumber) {

            console.log("ERROR! : " + url + "(" + linenumber + ") : " + JSON.stringify(msg));
            // Send Error to server
            if (true || Math.random() > .1) {
                // Only log 10% of errors
                return false;
            }
            else {

                var args = "ref=" + window.location.hash + "&line=" + linenumber + "&url=" + url + "&message=" + msg;

                $.ajax({
                    url: "/client_error",
                    type: "POST",
                    data: args,
                    dataType: "json",
                    error: function (xhr, ajaxOptions, thrownError) {
                    },
                    success: function (data) {
                    }
                });

            }
        }

        console.log("Installed console ! ");
    </script>


<!--style id="popupFix" >.ui-popup{
     opacity:0!important;
     pointer-events:none!important;

 }
.ui-popup-container{
      background:none!important;
      pointer-events:none!important;

  }</style-->



    <title>Songbase.fm</title>
</head>

<body ng-controller="MainController">



<!-- FACEBOOK -->
<div id="fb-root"></div>
<!-- FACEBOOK -->

<div id="lyricsiframe" style="left:-50px;opacity:0;pointer-events:none;display:none">
    <div id="lyricsifrmback">
    </div>
    <div id="lyricstopinfo">
        These Lyrics are external content from LyricWiki.<br>More information at <a href='{{"http://lyrics.wikia.com/" +mediaController.getSongArtist(playbackController.playingSong) + ":" + playbackController.playingSong.name}}' target='_blank'>lyrics.wikia.com</a>.
    </div>
    <iframe id="lyricsifrm" src="about:blank" seamless="">
    </iframe>

    <img id="lyricsiframeresizebar" onclick="mediaController.toggleLyrics();" src="public/img/resizebar.png" style="position:absolute;right: 1px;top:1px">
</div>


<div data-role="page" id="page" style="opacity:0" data-theme="b">

<div data-role="panel" id="rightpanel" data-display="overlay" data-position="right" data-theme="b">
</div>
<!-- /panel -->

<div data-role="header" id="header" data-position="fixed">
    <img src="public/img/logostat.png" id="iconHeader" style="opacity:0;position:absolute;left: 8px;top: 8px" width="35px" height="33px">


    <h1 id="titleHeader" style="margin-top: 2px!important;opacity:0;display:inline-block;">{{appTitle}}</h1>

    <img src="public/img/bars-white.png" id="openSidePanelBarIcon" onclick="uiController.toggleSidePanel()" style="position:absolute;right: 6px;top: 13px" width="17px" height="20px"/>


    <div class="ui-btn-right">
        <!--div id="fblike"  href="#" >
         <div class="fb-like fadeincompleteslow" data-show-faces="true" style="display:none" data-width ="85px" data-href="https://www.songbase.fm" data-layout="box_count" data-action="like" data-show-faces="true" data-share="true"></div>
        </div-->
        <a id="playingSongInfoLink" style="opacity:0"  ng-show="playbackController.playingSong" href="#popupArtist" data-rel="popup" data-position-to="#playingSongInfoLink"
           class="playingSongInfo  ui-btn  ui-corner-all ui-shadow ui-btn-inline ui-icon-custom ui-btn-icon-left ui-btn-a" data-transition="pop">
            <span style="opacity:0">{{playbackController.getPlayingTitle()}}</span>
            <span id="playingSongTitleLoading" class="fadeincomplete" style="text-align:left;z-index:0;display:none;position:absolute;left: 35px;top: 9px;right: 0px">{{playbackController.getPlayingTitle()}}</span>
            <span id="playingSongTitle" class="fadeincomplete" style="text-align:left;z-index:0;display:none;position:absolute;left: 35px;top: 9px;right: 0px">{{playbackController.getPlayingTitle()}} </span>
        </a>
        <a id="buySongLink" style="opacity:0" onclick="mediaController.buySong()" ng-show="playbackController.playingSong" href="#" data-rel="popup" data-position-to="#buySongLink"
           class="playingSongBuy   ui-btn  ui-corner-all ui-shadow ui-btn-inline ui-icon-heart ui-btn-icon-left ui-btn-a" data-transition="pop">Buy Song</a>


        <a id="signinLink" ng-if="!accountController.loggedIn" href="#popupLogin" onclick="" data-rel="popup" data-position-to="#signinLink"
           class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-check ui-btn-icon-left ui-btn-a" data-transition="pop">Log in</a>

        <a id="registerLink"  ng-if="!accountController.loggedIn" href="#popupRegister" onclick="" data-rel="popup" data-position-to="#registerLink"
           class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-plus ui-btn-icon-left ui-btn-a" data-transition="pop">Sign up</a>

        <a id="linkAccount" ng-if="accountController.loggedIn" href="#popupAccount" data-rel="popup" class="ui-btn  ui-corner-all ui-shadow ui-btn-inline ui-icon-user ui-btn-icon-left ui-btn-a fadeincomplete" data-transition="pop">{{accountController.userName}}</a>


    </div>

</div>


<!-- /header -->

<!--Open Side Panel-->
<div onclick="uiController.toggleSidePanel();" id="openSidePanelBarIconBar" style="z-index:9000;position: fixed;top: 0;right: 0;width: 30px;height:44px;"></div>



<div data-role="content" id="content">
<div id="controlbar">
    <input id="searchinput" data-type="search" data-theme="a" placeholder="Search" autofocus="false" >


    <div id="controlselecthorizontal">
        <input id="searchbutton1" data-type="button" data-theme="b" onclick="setTimeout(function () {searchController.startSearch()}, 350);searchController.activateButton(0);" type="button" value="Search">
        <!--input id="searchbutton2"data-type="button" data-theme="b" onclick="searchController.activateButton(1);searchController.showPopulars()" type="button" value="Popular"-->

        <input id="searchbutton2" data-type="button" data-theme="b" onclick="setTimeout(function (){ searchController.showSuggestions()}, 350);searchController.activateButton(1);" type="button" value="Suggestions">
        <input id="searchbutton3" data-type="button" data-theme="b" onclick="setTimeout(function (){ searchController.showExplore()}, 350);searchController.activateButton(2);" type="button" value="Explore">
        <a id="searchlayoutbutton" title="Change list layout" data-type="button" data-theme="b" onclick="uiController.toggleGridLayout();" style="margin-left: -3px;background-color: #442727;width: 3px;height: 20px;" class="ui-input-btn ui-btn ui-btn-b ui-shadow ui-corner-all"><img src="public/img/grid.png"  style="width: 21px;margin-left: -9px;"> </a>

        <!--input id="searchbutton4" data-type="button" data-theme="b" onclick="searchController.activateButton(3);searchController.showPlaylists()" type="button" value="Playlists"-->
    </div>
    <div id="controlselectvertical">

        <select name="controlselectvertical" data-native-menu="false" data-iconpos="left" data-inline="true" data-theme="a">
            <option value="1">Songs</option>
            <option value="2">Popular</option>
            <option value="3">Suggestions</option>
            <option value="4">Playlists</option>
        </select>

    </div>
</div>



<div id="searchcontent" >

<div id="searchlist" class="clickarea">


    <!--form class="ui-filterable" >
        <input id="filterBasic-input" data-type="search" data-theme="a">
    </form-->

    <ul  ng-show ="searchController.displayLimit!=0" data-role="listview" id="searchlistview" class="connectedSortable songlist fast3d" >

        <li ng-if ="searchController.showed&&searchController.showMode!=0" onclick="searchController.setShowMode(0)"  ng-dblclick="playlistController.deselectSongs($event);" class="fadeincomplete hoverable specialplaylistbutton songlisttitlebutton othertopheight stayvisible">
            <a tabindex="-1">
                <img src="public/img/empty.png"   class="optionsSearchResultsBack"   >
                <h3 style="font-size: 1.1em;margin-top: 7px;">Show all results</h3>
            </a></li>

        <li  ng-if ="searchController.showMode>0&&false" class="fadeincompleteslow songlisttitlebutton othertopheight stayvisible listad" ><img style="max-width:728px;max-height:90px;width:728px;height:90px"src="public/img/testad2.png"></li>

        <li ng-if ="searchController.artists.searchResults.length>0&&searchController.isVisisbleInShowMode(3)" onclick="searchController.setShowMode(3)"  ng-dblclick="playlistController.deselectSongs($event);" class="fadeincomplete hoverable specialplaylistbutton songlisttitlebutton  othertopheight stayvisible">
            <a tabindex="-1" ng-class="{loaded:searchController.isOnlyTypeDisplayed(3)}">
                <img src="public/img/empty.png" onclick="optionsMenu.openArtistResultsOptions(event,'#positionArtistResultsOptions')"   class="optionsSearchResults"   >
                <div id="positionArtistResultsOptions" class="positionResultsOptions" ></div>

                <h3  ng-if ="searchController.showedPopulars&&searchController.getShowModeLimit(3)>1"  style="font-size: 1.1em;margin-top: 7px;">Featured Artists<span ng-if ="!searchController.isOnlyTypeDisplayed(3)"> ...</span></h3>
                <h3  ng-if ="!searchController.showedPopulars&&searchController.getShowModeLimit(3)>1"  style="font-size: 1.1em;margin-top: 7px;">Artists<span ng-if ="!searchController.isOnlyTypeDisplayed(3)"> ...</span></h3>
                <h3  ng-if ="searchController.showedPopulars&&searchController.getShowModeLimit(3)<=1"  style="font-size: 1.1em;margin-top: 7px;">Featured Artist<span ng-if ="!searchController.isOnlyTypeDisplayed(3)"> ...</span></h3>
                <h3  ng-if ="!searchController.showedPopulars&&searchController.getShowModeLimit(3)<=1"  style="font-size: 1.1em;margin-top: 7px;">Artist<span ng-if ="!searchController.isOnlyTypeDisplayed(3)"> ...</span></h3>
            </a>
        </li>
        
        <li  ng-if ="searchController.isVisisbleInShowMode(3)" context-menu-DISABLED ="playlistController.selectSong(artist)" ng-repeat="artist in searchController.artists.searchResults  | limitTo:searchController.getShowModeLimit(3)  track by $index " data-artist="{{artist}}" ontouchend ="playbackController.touchedElement(event);" data-index="{{$index}}"  data-songtitle ="{{artist.name}}-{{mediaController.getSongArtist(artist)}}"   class="fadeincompletefast othertopheight"  ng-click="playbackController.clickedElement($event,artist);"  ng-dblclick="playlistController.deselectSongs($event);"><a >
            <img src="public/img/empty.png"   ng-style="{'background-image':'url('+mediaController.getImage(artist)+')','background-size':'100%'}"  alt="" class="ui-li-icon ui-corner-none" >
            <img src="public/img/empty.png"    class="loadingSongImg"   >

            <img ng-if ="playlistController.hasTrendStyle(0,artist)" src="public/img/empty.png" class="songWinner songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(1,artist)" src="public/img/emtpy.png" class="songNochange songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(2,artist)" src="public/img/emtpy.png" class="songLoser songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(3,artist)" src="public/img/emtpy.png" class="songNew songTrend" >

            <h3 ng-class="playlistController.getTrendTitleClass(artist)" title="{{artist.name}}">{{artist.name}}</h3>

            <p ><span ng-if ="artist.listeners !== undefined && artist.listeners" class="songPlayCount"><span  style="font-style: normal;font-size: .83em;margin-left:2px;"> &#9829;</span><span  style="font-style: italic;font-size: .93em;margin-left:2px;">{{artist.listeners}}</span></span>  </p></a>
        </li>



        <li ng-if ="searchController.playlists.searchResults.length>0&&searchController.isVisisbleInShowMode(2)" onclick="searchController.setShowMode(2)"  ng-dblclick="playlistController.deselectSongs($event);" class="fadeincomplete hoverable specialplaylistbutton songlisttitlebutton othertopheight stayvisible">
            <a tabindex="-1"  ng-class="{loaded:searchController.isOnlyTypeDisplayed(2)}">

                <img src="public/img/empty.png" onclick="optionsMenu.openPlaylistResultsOptions(event,'#positionPlaylistResultsOptions')"   class="optionsSearchResults"   >
                <div id="positionPlaylistResultsOptions" class="positionResultsOptions" ></div>

                <h3  ng-if ="searchController.showedPopulars&&searchController.getShowModeLimit(2)>1"  style="font-size: 1.1em;margin-top: 7px;">Featured Playlists<span ng-if ="!searchController.isOnlyTypeDisplayed(2)"> ...</span></h3>
                <h3  ng-if ="!searchController.showedPopulars&&searchController.getShowModeLimit(2)>1"  style="font-size: 1.1em;margin-top: 7px;">Playlists<span ng-if ="!searchController.isOnlyTypeDisplayed(2)"> ...</span></h3>
                <h3  ng-if ="searchController.showedPopulars&&searchController.getShowModeLimit(2)<=1"  style="font-size: 1.1em;margin-top: 7px;">Featured Playlist<span ng-if ="!searchController.isOnlyTypeDisplayed(2)"> ...</span></h3>
                <h3  ng-if ="!searchController.showedPopulars&&searchController.getShowModeLimit(2)<=1"  style="font-size: 1.1em;margin-top: 7px;">Playlist<span ng-if ="!searchController.isOnlyTypeDisplayed(2)"> ...</span></h3>

            </a>
        </li>
        
        <li  ng-if ="searchController.isVisisbleInShowMode(2)" context-menu-DISABLED ="playlistController.selectSong(playlist)" ng-repeat="playlist in searchController.playlists.searchResults | limitTo:searchController.getShowModeLimit(2)  track by $index " data-playlist="{{playlist}}" ontouchend ="playbackController.touchedElement(event);" data-index="{{$index}}"    class="fadeincompletefast othertopheight"  ng-click="playbackController.clickedElement($event,playlist);"  ng-dblclick="playlistController.deselectSongs($event);"><a >

            <img src="public/img/empty.png"   ng-style="{'background-image':'url(public/img/empty.png)','background-size':'100%'}" alt="" class="ui-li-icon ui-corner-none" >


            <img src="public/img/empty.png"    class="loadingSongImg"   >

            <div class="playlistCoverSong" >
                <img src="public/img/empty.png" class="coverSong1 coverSong" style="background-image:url({{mediaController.getImage(playlist)}})">
                <img src="public/img/black.png" class="coverSong2 coverSong" style="background-image:url(public/img/playlist.png)">
                <img src="public/img/black.png" class="coverSong3 coverSong" style="background-image:url(public/img/playlist.png)">
            </div>

            <img ng-if ="playlistController.hasTrendStyle(0,playlist)" src="public/img/empty.png" class="songWinner songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(1,playlist)" src="public/img/emtpy.png" class="songNochange songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(2,playlist)" src="public/img/emtpy.png" class="songLoser songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(3,playlist)" src="public/img/emtpy.png" class="songNew songTrend" >

            <h3 ng-class="playlistController.getTrendTitleClass(playlist)" title="{{playlist.name}}">{{playlist.name}}</h3>

            <p>{{mediaController.getSongArtist(playlist)}}<span ng-if ="playlist.playcount !== undefined && playlist.playcount" class="songPlayCount"><span  style="font-style: normal;font-size: .83em;margin-left:2px;"> ?</span><span  style="font-style: italic;font-size: .93em;margin-left:2px;">{{playlist.playcount}}</span></span>  </p></a>
        </li>


        <li  ng-if ="searchController.songs.searchResults.length>0&&searchController.isVisisbleInShowMode(1)&&searchController.showMode==0" class="fadeincompleteslow songlisttitlebutton othertopheight stayvisible listad" ><img style="max-width:728px;max-height:90px;width:728px;height:90px"src="public/img/testad2.png"></li>


        <li  ng-if ="searchController.songs.searchResults.length>0&&searchController.isVisisbleInShowMode(1)" onclick="searchController.setShowMode(1)"  ng-dblclick="playlistController.deselectSongs($event);" class="fadeincomplete hoverable specialplaylistbutton songlisttitlebutton othertopheight stayvisible">
            <a tabindex="-1"  ng-class="{loaded:searchController.isOnlyTypeDisplayed(1)}">

                <img src="public/img/empty.png" onclick="optionsMenu.openSongResultsOptions(event,'#positionSongResultsOptions')"   class="optionsSearchResults"   >
                <div id="positionSongResultsOptions" class="positionResultsOptions" ></div>

                <h3  ng-if ="searchController.showedPopulars"  style="font-size: 1.1em;margin-top: 7px;">Popular Songs<span ng-if ="!searchController.isOnlyTypeDisplayed(1)"> ...</span></h3>
                <h3  ng-if ="!searchController.showedPopulars"  style="font-size: 1.1em;margin-top: 7px;">Songs<span ng-if ="!searchController.isOnlyTypeDisplayed(1)"> ...</span></h3>

         </a></li>

        <li ng-if ="searchController.isVisisbleInShowMode(1)&&!song.tmpHide" context-menu-DISABLED ="playlistController.selectSong(song)" ng-repeat="song in searchController.songs.searchResults | limitTo:searchController.getShowModeLimit(1) track by $index" data-song="{{song}}" ontouchend ="playbackController.touchedElement(event);" data-index="{{$index}}"  data-songtitle ="{{song.name}}-{{mediaController.getSongArtist(song)}}"   class="draggableSong fadeincompletefast"  ng-click="playbackController.clickedElement($event,song);"  ng-dblclick="playlistController.deselectSongs($event);"><a >
            <img src="public/img/empty.png"   ng-style="{'background-image':'url('+mediaController.getSongCover(song)+')','background-size':'100%'}" alt="" class="ui-li-icon ui-corner-none" >
            <img src="public/img/empty.png"    class="loadingSongImg"   >
            <img ng-if ="playlistController.hasTrendStyle(0,song)" src="public/img/empty.png" class="songWinner songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(1,song)" src="public/img/emtpy.png" class="songNochange songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(2,song)" src="public/img/emtpy.png" class="songLoser songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(3,song)" src="public/img/emtpy.png" class="songNew songTrend" >

            <h3 ng-class="playlistController.getTrendTitleClass(song)" title="{{song.name}}">{{song.name}}</h3>

            <p title="{{mediaController.getSongArtist(song)}}">{{mediaController.getSongArtist(song)}}<span ng-if ="song.playcount !== undefined && song.playcount" class="songPlayCount"><span  style="font-style: normal;font-size: .83em;margin-left:2px;"> &#9658;</span><span  style="font-style: italic;font-size: .93em;margin-left:2px;">{{song.playcount}}</span></span>  </p></a>
        </li>


        <li  ng-if ="searchController.users.searchResults.length>0&&searchController.isVisisbleInShowMode(4)" onclick="searchController.setShowMode(4)"  ng-dblclick="playlistController.deselectSongs($event);" class="fadeincomplete hoverable specialplaylistbutton songlisttitlebutton otherbottomheight stayvisible">
            <a tabindex="-1"  ng-class="{loaded:searchController.isOnlyTypeDisplayed(4)}">

                <img src="public/img/empty.png" onclick="optionsMenu.openUserResultsOptions(event,'#positionUserResultsOptions')"   class="optionsSearchResults"   >
                <div id="positionUserResultsOptions" class="positionResultsOptions" ></div>

                <h3   style="font-size: 1.1em;margin-top: 7px;">Users<span ng-if ="!searchController.isOnlyTypeDisplayed(4)"> ...</span></h3>

            </a></li>

        

        <li ng-if ="searchController.isVisisbleInShowMode(4)" context-menu-DISABLED ="playlistController.selectSong(user)" ng-repeat="user in searchController.users.searchResults | limitTo:searchController.getShowModeLimit(4) track by $index" data-user="{{user}}" ontouchend ="playbackController.touchedElement(event);" data-index="{{$index}}"    class="fadeincompletefast otherbottomheight"  ng-click="playbackController.clickedElement($event,user);"  ng-dblclick="playlistController.deselectSongs($event);"><a >
            <img src="public/img/empty.png"   ng-style="{'background-image':'url('+mediaController.getSongCover(user)+')','background-size':'100%'}" alt="" class="ui-li-icon ui-corner-none" >
            <img src="public/img/empty.png"    class="loadingSongImg"   >
            <img ng-if ="playlistController.hasTrendStyle(0,user)" src="public/img/empty.png" class="songWinner songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(1,user)" src="public/img/emtpy.png" class="songNochange songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(2,user)" src="public/img/emtpy.png" class="songLoser songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(3,user)" src="public/img/emtpy.png" class="songNew songTrend" >

            <h3 ng-class="playlistController.getTrendTitleClass(user)" title="{{user.name}}">{{user.name}}</h3>

            <p>{{mediaController.getSongArtist(user)}}<span ng-if ="user.playcount !== undefined && user.playcount" class="songPlayCount"><span  style="font-style: normal;font-size: .83em;margin-left:2px;"> ►</span><span  style="font-style: italic;font-size: .93em;margin-left:2px;">{{user.playcount}}</span></span>  </p></a>
        </li>



       </span>

    </ul>
</div>

    <div id="explorearea" style="display:none" class="fadeincompleteslow" >
        <h1>Events</h1>
    </div>

</div>

<div id="playlist" style="opacity:0">

    <!--h3>Playlist</h3-->

    <div id="controlbarplaylist">

        <div id="playlistselectvertical">
            <a href="#" id="clearChoosenPlaylists"   style="display:none" class="ui-input-clear ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all" title="Clear Selection">Clear Selection</a>

            <form>
                <select id="playlistselectverticalform" data-role="none"  multiple class="chosen-select">
                    <option  value="{{playlistController.currentQueue.gid}}" class="currentQueue">{{playlistController.currentQueue.name}}</option>

                    <option ng-repeat="playlist in playlistController.playlists track by playlist.gid" ng-if ="!playlist.isCurrentQueue" value="{{playlist.gid}}" >{{playlist.name}}</option>

                </select>

            </form>


        </div>
        <div id="sortplaylistbutton">

            <button id="sortplaylistbtn" title="Sortable List" onclick="playlistController.toggleSortablePlaylist(true);" data-mini="true" data-type="button" value="" data-theme="b">
                <img src="public/img/sort.png" width="21px" height="21px" alt="Sort"/>
            </button>

        </div>




    </div>
    <!--form class="ui-filterable" >
        <input id="filterBasic-input" data-type="search" data-theme="a">
    </form-->
    <div id="playlisthelp" class="{{playlistController.getHelpStyleClass()}}">
    </div>

    <div id="playlistInner" class="animate">
        <ul ui-sortable ng-model="playlistController.loadedPlaylistSongs" data-role="listview" id="playlistview" class="sortable songlist connectedSortable">

            <li ng-if ="!playlistController.playlistMode" ng-click="uiController.showPlaylists();"  ng-dblclick="playlistController.deselectSongs($event);" class="fadeincomplete hoverable specialplaylistbutton songlisttitlebutton showplaylists othertopheight stayvisible">
                <a tabindex="-1" >
                    <img src="public/img/empty.png" onclick=""  class="optionsPlaylistBack"   >

                    <h3 style="font-size: 1.1em;margin-top: 7px;">Show all Playlists</h3>
                </a>
            </li>

            <li ng-if ="!playlistController.playlistMode"  onclick="playlistController.openLoadedPlaylistMenu(event,this)"   ng-dblclick="playlistController.deselectSongs($event);" class="fadeincomplete hoverable specialplaylistbutton songlisttitlebutton currentplaylist othertopheight stayvisible">
                <a tabindex="-1"  ng-class="{loaded:!searchController.playlistMode}">
                    <img src="public/img/empty.png" class="optionsPlaylist"   >

                    <h3 style="font-size: 1.1em;margin-top: 7px;">{{playlistController.getLoadedPlaylist().name}}</h3>
                </a>
            </li>

            <li ng-if ="!playlistController.playlistMode&&playlistController.loadedPlaylistSongs.length == 0" ng-click=""  ng-dblclick="playlistController.deselectSongs($event);" class="fadeincomplete hoverable specialplaylistbutton createplaylist importplaylist stayvisible">
                <a tabindex="-1">

                    <img src="public/img/empty.png"  alt="" class="noshadow ui-li-icon ui-corner-none"  >


                    <div class="playlistCoverSong" >

                        <img src="public/img/empty.png" class="coverSong1 coverSong" style="background-image:url(public/img/playlist.png)">
                        <img src="public/img/black.png" class="coverSong2 coverSong" style="background-image:url(public/img/playlist.png)">
                        <img src="public/img/black.png" class="coverSong3 coverSong" style="background-image:url(public/img/playlist.png)">
                        <img src="public/img/empty.png"  class="addPlaylist" style="background-image:url(public/img/import.png)">

                    </div>


                    <h3 style="font-size: 1.1em;margin-top: 17px;">Import Playlist</h3>

                </a></li>


            <li ng-if ="playlistController.playlistMode " ng-click="playlistController.loadCurrentQueue($event)"  ng-dblclick="playlistController.deselectSongs($event);" class="fadeincomplete hoverable specialplaylistbutton currentqueue stayvisible">
                <a tabindex="-1">

                    <img src="public/img/empty.png"  alt="" class="noshadow ui-li-icon ui-corner-none"  >


                    <div class="playlistCoverSong" >



                        <img src="public/img/empty.png" class="coverSong1 coverSong" style="{{mediaController.getPlaylistCoverSong(0,2,playlistController.currentQueue,true)}}">
                        <img src="public/img/black.png" class="coverSong2 coverSong" style="{{mediaController.getPlaylistCoverSong(1,2,playlistController.currentQueue)}}">
                        <img src="public/img/black.png" class="coverSong3 coverSong" style="{{mediaController.getPlaylistCoverSong(2,2,playlistController.currentQueue)}}">

                        <img src="public/img/empty.png"  class="addPlaylist" style="background-image:url(public/img/queue.png)">

                    </div>


                    <h3 style="font-size: 1.1em;margin-top: 17px;">Current Play Queue</h3>

             </a></li>




            <li ng-if ="playlistController.playlistMode" ng-click="playlistController.loadNewEmptyPlaylist($event);"  ng-dblclick="playlistController.deselectSongs($event);" class="fadeincomplete hoverable specialplaylistbutton createplaylist stayvisible">
                <a tabindex="-1">

                <img src="public/img/empty.png"  alt="" class="noshadow ui-li-icon ui-corner-none"  >


                <div class="playlistCoverSong" >

                    <img src="public/img/empty.png" class="coverSong1 coverSong" style="background-image:url(public/img/playlist.png)">
                    <img src="public/img/black.png" class="coverSong2 coverSong" style="background-image:url(public/img/playlist.png)">
                    <img src="public/img/black.png" class="coverSong3 coverSong" style="background-image:url(public/img/playlist.png)">
                    <img src="public/img/empty.png"  class="addPlaylist" style="background-image:url(public/img/addplaylist.png)">

                </div>


                <h3 style="font-size: 1.1em;margin-top: 17px;">Create new Playlist</h3>

            </a></li>

            <li ng-repeat="song in playlistController.loadedPlaylistSongs track by song.gid" context-menu-DISABLED ="playlistController.selectSong(song)" ng-if ="!song.isCurrentQueue&&(!song.isPlaylist||!song.isUnnamedPlaylist||song.tracks.length>0)" data-index="{{$index}}"  data-song="{{song}}" data-songid="playlistsong{{song.id}}" data-songtitle ="{{song.name}}-{{mediaController.getSongArtist(song)}}" data-songgid="playlistsong{{song.gid}}" class="fadeslideincompletefast hoverable  playlistsong"
                ng-click="playbackController.clickedElement($event,song);"  ng-dblclick="playlistController.deselectSongs($event);"><a tabindex="-1">

                <img src="public/img/empty.png" ng-style="{'background-image':'url('+mediaController.getSongCover(song)+')','background-size':'100%'}" alt=""   class="ui-li-icon ui-corner-none"  >
                <div ng-if= "playlistController.playlistMode" class="playlistCoverSong" >
                <img src="public/img/empty.png" class="coverSong1 coverSong" style="{{mediaController.getPlaylistCoverSong(0,2,song)}}">
                <img src="public/img/black.png" class="coverSong2 coverSong" style="{{mediaController.getPlaylistCoverSong(1,2,song)}}">
                <img src="public/img/black.png" class="coverSong3 coverSong" style="{{mediaController.getPlaylistCoverSong(2,2,song)}}">
                </div>
                <img src="public/img/empty.png" class="loadingSongImg">
                    <span ng-if="!song.isPlaylist">
                    <h3>{{song.name}}</h3>
                    <p>{{mediaController.getSongArtist(song)}}<span style="font-style: italic;font-size: .93em;margin-left:2px;"> {{playlistController.getSongPlaylistName(song)}} </span>  </p>
                    <!--img class="removesong" ng-style="{'background-image':'url(public/img/trash.png)',display:'none'}" src="public/img/empty.png"-->
                    </span>
                    <span ng-if="song.isPlaylist">
                         <h3>{{song.name}}</h3>
                         <p ng-if="song.tracks.length==1">1 Song</p>
                         <p ng-if="song.tracks.length!=1">{{song.tracks.length}} Songs</p>
                        <img class="removesong" ng-style="{'background-image':'url(public/img/trash.png)',display:'none'}" src="public/img/empty.png">

                    </span>
            </a></li>
        </ul>
    </div>
</div>

<div id="videoplayer">
    <div id="videoplayerInner">

        <!-- mediaemelemtjs player -->
        <video id="mediaemelemtjsPlayer1" controls="controls" preload="true" >
            <source src="" type="video/mp4"/>
            <!--   <source src="" type="video/flv"/> -->
        </video>



        <!-- embedded players -->
        <div id="dailymotionembedplayer" >
            <div id="dailymotionplayer" >
            </div>
        </div>
        <div id="vimeoembedplayer" >
            <div id="vimeoplayer" >
                <!-- <iframe id="vimeoplayerframe" src="//player.vimeo.com/video/95255285?portrait=0&badge=0&title=0&byline=0" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>-->
              </div>
          </div>


      </div>

  </div>
  <div id="videocontrols" class="videoControlElements-container" style="text-align: center">
      <div id="videocontrolsInner">

          <div class="videoControlElements-controls">
              <div class="videoControlElements-button videoControlElements-prevtrack-button videoControlElements-prevtrack">
                  <button type="button" aria-controls="mep_0" title="Previous Track" ></button>
              </div>
              <div class="videoControlElements-button videoControlElements-playpause-button videoControlElements-play">
                  <button type="button" aria-controls="mep_0" title="Play/Pause" aria-label="Play/Pause" ></button>
              </div>
              <div class="videoControlElements-button videoControlElements-stop-button videoControlElements-stop">
                  <button type="button" aria-controls="mep_0" title="Stop" aria-label="Stop" ></button>
              </div>
              <div class="videoControlElements-button videoControlElements-nexttrack-button videoControlElements-nexttrack">
                  <button type="button" aria-controls="mep_0" title="Next Track" ></button>
              </div>
              <div class="videoControlElements-button videoControlElements-shuffle-button videoControlElements-shuffle-off">
                  <button type="button" aria-controls="mep_0" title="Shuffle On/Off" style="opacity:0.5" >
                  </button>
              </div>
              <div class="videoControlElements-time videoControlElements-currenttime-container">
                  <span class="videoControlElements-currenttime">00:00</span>

              </div>
              <div class="videoControlElements-time-rail" style="width: 491px;">
                      <span class="videoControlElements-time-total" style="width: 481px;">
                          <span class="videoControlElements-time-buffering" style="display: none;"></span>
                          <span class="videoControlElements-time-loaded"></span>
                          <span class="videoControlElements-time-current"></span>
                          <span class="videoControlElements-time-handle"></span>
                          <span class="videoControlElements-time-float">
                              <span class="videoControlElements-time-float-current">00:00</span>
                              <span class="videoControlElements-time-float-corner"></span>
                          </span>
                      </span>
              </div>

              <div class="videoControlElements-time videoControlElements-duration-container">
                  <span class="videoControlElements-duration">00:00</span>
              </div>

              <div class="videoControlElements-button videoControlElements-volume-button videoControlElements-mute">
                  <button type="button" aria-controls="mep_0" title="Mute Toggle" aria-label="Mute Toggle"></button>
                  <div class="videoControlElements-volume-slider" style="display: none;">
                      <div class="videoControlElements-volume-total"></div>
                      <div class="videoControlElements-volume-current" style="height: 80px; top: 32px;"></div>
                      <div class="videoControlElements-volume-handle" style="top: 29px;"></div>
                  </div>
              </div>


              <div class="videoControlElements-button videoControlElements-fullscreen-button">
                  <button type="button" aria-controls="mep_0" title="Fullscreen" style="opacity:0.5" aria-label="Fullscreen"> </button>
                  <div class="videoControlElements-fullscreen-slider" style="display: none;">
                      <div class="videoControlElements-fullscreen-total"></div>
                      <div class="videoControlElements-fullscreen-current" style="height: 80px; top: 32px;"></div>
                      <div class="videoControlElements-fullscreen-handle" style="top: 29px;"></div>
                  </div>
              </div>

              <div class="videoControlElements-button videoControlElements-button-choose-version videoControlElements-custom-button">
                  <button type="button" id="chooseversionbutton" data-role="none" style="opacity:0.5" aria-controls="mep_0" title="Choose Version" aria-label="Choose Version"></button>
              </div>
              <div class="videoControlElements-button videoControlElements-button-lyrics videoControlElements-custom-button">
                  <button type="button" id="lyricsbutton" data-role="none" style="opacity:0.5" aria-controls="mep_0" title="Lyrics" aria-label="Lyrics"></button>
              </div>
              <div class="videoControlElements-button videoControlElements-button-facebook videoControlElements-custom-button">
                  <button type="button" id="facebookpostbutton" data-role="none"   aria-controls="mep_0" title="Facebook" aria-label="Facebook"></button>
              </div>
              <!--div style =class="videoControlElements-button videoControlElements-button-copyright videoControlElements-custom-button">
                  <button type="button" id="copyrightbutton" data-role="none" style="opacity:0.9"  onclick="window.open('','_blank')" aria-controls="mep_0" title="Copyright" aria-label="Copyright"></button>
              </div-->
            <div class="videoControlElements-button videoControlElements-button-external videoControlElements-custom-button">
                <button type="button" id="openexternalbutton" data-role="none" style="opacity:0.5"  aria-controls="mep_0" title="Open external site" aria-label="Open external site"></button>
            </div>
        </div>

    </div>
</div>

<div id="siteLogo" style="display:none" class="fadeincomplete2s" >
    <img id="siteLogoImage" width="70px"  src="" onclick="mediaController.openExternalSite()">
</div>

<div id="songOptionsOriginal" style="display:none">

    <img id="playSelection" title="Play" onclick="playlistController.playSelection(event)"  ondblclick="playlistController.playSelection(event)"    src="public/img/playopt.png">

    <img id="removeFromPlaylist"  onclick="playlistController.addSelectedElementsToQueue(event)"  ondblclick="playlistController.removeSelectedElementsFromPlaylist(event)"   src="public/img/empty.png" >

    <img id="addToPlaylist" title="Add to queue" onclick="playlistController.addSelectedElementsToQueue(event)"  ondblclick="playlistController.addSelectedElementsToQueue(event)"    src="public/img/add.png">

    <img id="searchSimilar" title="Search similar" onclick="event.stopPropagation();" ondblclick="event.stopPropagation();"   src="public/img/radio.png" >

    <img id="moreOptions" onclick="playlistController.showMoreSelectionOptions(event,this);" ondblclick="event.stopPropagation();"   src="public/img/moreoptions.png" >

    <!--img id="shareSocial" onclick="event.stopPropagation();" ondblclick="event.stopPropagation();" width="53px"  src="public/img/share.png" -->

</div>



</div>
<!-- /content -->


<!-- Popups ---------------------------------------->

<div data-role="popup" id="popupVideoSettings" data-arrow="true" data-theme="a" class="ui-corner-all">
    <form>
        <div>
            <h3 style="margin-right: 40px; margin-left:40px;text-align: center">Choose Version</h3>
            <ul data-role="listview" id="searchviewVersions" data-theme="b">
                <li ng-repeat="songversion in mediaController.versionList track by songversion.id" data-theme="b"  class="fadeslideincompletefast playlistsong" ng-click="mediaController.playVersion(songversion,1,1)">
                    <a href="#" ng-class="{selectedversion: songversion.url==mediaController.currentvideoURL}" style="padding-left: 15px!important;" id="" title="{{songversion.url}}">{{songversion.title}}{{mediaController.getSiteName(songversion.url ,' - ')}}<span style="opacity:0"> ..{{mediaController.showDuration(songversion)}}</span> <span style="position:absolute;right: 42px;top:10px;opacity:0.8"> {{ mediaController.showDuration(songversion) }}</span> </a>
                </li>

            </ul>
            <div id="loadversionimg" style="opacity:0">
                <img src="public/img/loader.gif"/>
            </div>
        </div>
    </form>
</div>


<div data-role="popup" id="popupRegister" data-arrow="true" data-theme="a" class="ui-corner-all"  >
        <div style="padding:0px 20px 10px 20px">
            <h3 id="registertitle">Sign Up <span style="font-style: italic">for free</span></h3>

            <label for="registerusername" class="ui-hidden-accessible">Username:</label>
            <input type="text" name="user" id="registerusername" value="" placeholder="Username" data-theme="a" >
            <span id="registeruseremail">
            <label for="registeruser" class="ui-hidden-accessible">Email Adress:</label>
            <input type="text" name="user" id="registeruser" value="" placeholder="Email Adress" data-theme="a" >
            </span>
            <label for="registerpw" class="ui-hidden-accessible">Password:</label>
            <input type="password" name="pass" id="registerpw" value="" placeholder="Password" data-theme="a" >
                <span id="pwconfirm">
                <input type="password" name="pass" id="registerpwc" value="" placeholder="Confirm Password" data-theme="a" >
                </span>
            <button onclick="accountController.register();" id="registerButton" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-btn-icon-left ui-icon-check">Create Account</button>
            <hr>
            <button onclick="facebookHandler.login()"  class="fbloginbutton ui-btn ui-corner-all ui-shadow ui-btn-b ui-btn-icon-left ui-icon-check">Sign in with Facebook</button>

            <fb:login-button class="fbnativeloginButton"  show-faces="true" width="200" scope="public_profile, email"  max-rows="1" size="large">Sign in with Facebook</fb:login-button>

        </div>
</div>



<div data-role="popup" id="popupLogin" data-arrow="true" data-theme="a" class="ui-corner-all">
        <div style="padding:0px 20px 10px 20px">
            <h3 id="signintitle">Sign in</h3>
            <label for="signinusername" class="ui-hidden-accessible">Username:</label>
            <input type="text" name="user" id="signinusername" value="" placeholder="Username" data-theme="a" >
            <span id="useremail" style="display:none">
            <label for="signinuser" class="ui-hidden-accessible">Email Adress:</label>
            <input type="text" name="user" id="signinuser" value="" placeholder="Email Adress" data-theme="a" >
            </span>
            <label for="signinpw" class="ui-hidden-accessible">Password:</label>
            <input type="password" name="pass" id="signinpw" value="" placeholder="Password" data-theme="a" >
            <button onclick="accountController.signIn();"  id="signinButton" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-btn-icon-left ui-icon-check">Sign in</button>
            <hr>
            <button onclick="facebookHandler.login()"  class="fbloginbutton ui-btn ui-corner-all ui-shadow ui-btn-b ui-btn-icon-left ui-icon-check">Sign in with Facebook</button>

            <fb:login-button class="fbnativeloginButton"  show-faces="true" width="200" scope="public_profile, email"  max-rows="1" size="large">Sign in with Facebook</fb:login-button>
        </div>
</div>


<div data-role="popup" id="popupAccount" data-arrow="true" data-theme="a" class="ui-corner-all">
    <form>
        <div>
            <h3 style="margin-right: 40px; margin-left:40px;text-align: center">Account</h3>
            <ul data-role="listview">
                <li  style="border-bottom:1px solid #ddd;"><a href="#" onclick='$.mobile.loading("show");$("#popupAccount").popup("close");setTimeout(function(){$.mobile.loading("hide");$("#popupEditAccount").popup("open");},900);' data-rel="back" id="manageUserProfile" ><img src="public/img/user.png" width="28px" >Your Account</a></li>
                <li style="border-top:15px solid rgba(255,255,255,0);">
                    <a href="#" data-rel="back" onclick="googleHandler.login();" id="manageGoogle"><img src="public/img/gdrive.png" width="28px" >Google Drive
                        <!--span class="GoogleBlue">G</span><span class="GoogleRed">o</span><span class="GoogleYellow">o</span><span class="GoogleBlue">g</span><span class="GoogleGreen">l</span><span class="GoogleRed">e</span--></a></li>
                <li style="display:none">
                    <a href="#" data-rel="back" id="manageFacebook"><img src="public/img/fb.png" width="28px" >Facebook</a></li>
                  <li style="border-bottom:1px solid #ddd;;display:none">
                    <a href="#" data-rel="back" id="manageDropbox"><img src="public/img/dropbox.png" width="28px" >Dropbox</a></li>
                <li style="border-top:15px solid rgba(255,255,255,0);"><a href="#" onclick="accountController.logout();" id="logoutlink" data-rel="back"><img src="public/img/logout.png">Log out</a></li>

            </ul>
        </div>
    </form>
</div>




<div data-role="popup" id="popupEditAccount" data-theme="a" class="ui-corner-all"  >
    <a href="#"  data-role="button" data-rel ="back" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right"></a>

    <div style="padding:0px 20px 10px 20px">
        <h3 id="edittitle">Edit Account</h3>

        <label for="registerusername" class="ui-hidden-accessible">Username:</label>
        <input type="text" name="user" id="editusername" value="" placeholder="Username" data-theme="a" >
            <span id="edituseremail">
            <label for="registeruser" class="ui-hidden-accessible">Email Adress:</label>
            <input type="text" name="user" id="edituser" value="" placeholder="Email Adress" data-theme="a" >
            </span>
        <label for="registerpw" class="ui-hidden-accessible">Password:</label>
        <input type="password" name="pass" id="editpw" value="" placeholder="Password" data-theme="a" >
                <span id="editpwconfirm">
                <input type="password" name="pass" id="editpwc" value="" placeholder="Confirm Password" data-theme="a" >
                </span>
        <button onclick='accountController.saveProfile();' id="editButton" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-btn-icon-left ui-icon-check">Save Changes</button>
        <button onclick='$("#popupEditAccount").popup("close")' id="cancelButton"  class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-btn-icon-left ui-icon-delete">Cancel</button>


    </div>
</div>




<!--div data-role="popup" id="popupConfirm" data-arrow="true" data-dismissible="false" data-theme="a" class="ui-corner-all">
    <form>
        <div>
            <h3 style="text-align: center">Clear Selection?</h3>
            <p  style="margin-left: 10px;margin-right: 10px;" >Unsafed changes will be lost!</p>
            <div style="text-align: center;width: 100%">
            <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" style="margin-left: 10px;" data-rel="back" onclick="uiController.popupConfirm.doIt()">Clear</a>
            <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" data-transition="flow">Cancel</a>
            </div>
        </div>
    </form>
</div-->





<div data-role="popup" id="popupConfirmLogout" data-arrow="false" data-dismissible="true" data-theme="a" class="ui-corner-all">
    <form>
        <div>
            <h3 style="text-align: center">Log out?</h3>
            <p  style="margin-left: 10px;margin-right: 10px;" >Unsafed changes will be lost!</p>
            <div style="text-align: center;width: 100%">
                <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" style="margin-left: 10px;" data-rel="back" onclick="uiController.popupConfirmLogout.doIt()">Log out</a>
                <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" data-transition="flow">Cancel</a>
            </div>
        </div>
    </form>
</div>


<div data-role="popup" id="popupOptions" data-arrow="true" data-dismissible="true" data-theme="a" class="ui-corner-all">
    <form>
        <div>
            <ul data-role="listview" id="popupOptionsList" data-theme="b" style="background-color: #545454;">
                <li ng-repeat = "option in optionsMenu.options"  ng-click = "option.callback()"  data-theme="b" data-icon="false" class="marked">
                    <a ng-if = "!option.currentQueue" style="text-decoration:none;padding-left: 14px!important" target="_blank">{{option.text}}</a>
                    <a ng-if = "option.currentQueue" class= "currentqueue" style="text-decoration:none;padding-left: 14px!important" target="_blank">{{option.text}}</a>

                </li>

            </ul>
        </div>
    </form>
</div>

<div data-role="popup" id="popupTextInput"  data-dismissible="true" data-theme="a" class="ui-corner-all">
    <!--a href="#"  data-role="button" data-rel ="back" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right"></a-->

    <div style="padding:0px 20px 10px 20px">
            <h3>{{playlistController.editedPlaylistTitle}}</h3>

            <input type="text" name="user" ng-model="playlistController.editedPlaylist.name" placeholder="" data-theme="a" >
            <button  onclick='playlistController.renamePlaylist(playlistController.editedPlaylist,$("#popupTextInput input").val());' class="saveButton ui-btn ui-corner-all ui-shadow ui-btn-b ui-btn-icon-left ui-icon-check">Ok</button>

    </div>
</div>








    <div data-role="popup" id="popupArtist" data-arrow="true" data-theme="a" class="ui-corner-all">
    <form>
        <div style="text-align:center">
            <h3 style="margin-top: 12px;margin-right: 40px;margin-left: 40px;padding-right: 20px;padding-left: 20px;text-align: center;">{{mediaController.getSongArtist(playbackController.playingSong)}}</h3>

            <div style="font-size: 1em;font-weight: bold;margin-top: -10px; margin-bottom: 10px;"> {{playbackController.playingSong.name}}</div>
            <ul data-role="listview" id="popupArtistExternList" data-theme="b" style="margin-bottom:5px ">
                <li data-theme="b" class="marked"><a ng-show="playbackController.playingSong" onclick="$('#popupArtist').popup('close');searchController.searchArtistSongs(mediaController.getSongArtist(playbackController.playingSong));"
                                                     style="text-decoration:none;padding-left: 14px!important" target="_blank">Songs from Artist</a></li>
                <li data-theme="b" class="marked"  style="border-bottom:1px solid #000;"><a ng-show="playbackController.playingSong" onclick="$('#popupArtist').popup('close');searchController.searchSimilarSongs(playbackController.playingSong);"
                                                                                            style="text-decoration:none;padding-left: 14px!important" target="_blank">Similar Songs</a></li>


                <li data-theme="b" style="border-top:5px solid rgba(255,255,255,0.2);"><a ng-show="playbackController.playingSong" href="https://www.facebook.com/search/results.php?q={{mediaController.getSongArtist(playbackController.playingSong)}}" onclick="$('#popupArtist').popup('close')"
                                      style="text-decoration:none" target="_blank"><img src="public/img/facebook.png">Facebook</a></li>
                <li data-theme="b"><a ng-show="playbackController.playingSong" href="https://myspace.com/search/?q={{mediaController.getSongArtist(playbackController.playingSong)}}" onclick="$('#popupArtist').popup('close')"
                                      style="text-decoration:none" target="_blank"><img src="public/img/myspace.png">Myspace</a></li>
                <li data-theme="b"><a ng-show="playbackController.playingSong" href="http://www.lastfm.de/search?q={{mediaController.getSongArtist(playbackController.playingSong)}}" onclick="$('#popupArtist').popup('close')"
                                      style="text-decoration:none" target="_blank"><img src="public/img/lastfm.png">last.fm</a></li>
                <li data-theme="b"><a ng-show="playbackController.playingSong" href="http://de.wikipedia.org/w/index.php?go=Artikel&title&search={{mediaController.getSongArtist(playbackController.playingSong)}}"
                                                                                           onclick="$('#popupArtist').popup('close')" style="text-decoration:none" target="_blank"><img src="public/img/wikipedia.png">Wikipedia</a></li>
                <li data-theme="b" ><a ng-show="playbackController.playingSong" href="https://www.google.de/search?q={{mediaController.getSongArtist(playbackController.playingSong)}}" onclick="$('#popupArtist').popup('close')"
                                      style="text-decoration:none" target="_blank"><img src="public/img/google.png">Google</a></li>

            </ul>
        </div>
    </form>


    <div style="margin: 3px" >
        <div class="fbliketitle fblikeartisttitle" >{{mediaController.getSongArtist(playbackController.playingSong)}}</div>

     <span id="songfblikeartist">

        <div class="fb-like" style="display:inline-block" data-href="https://www.songbase.fm" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div>
       <!--div class="fb-like"  data-href="https://www.songbase.fm" data-layout="button" data-action="like" data-show-faces="true" data-share="true"></div-->
    </span>
    </div>
    <div style="margin: 3px" >
    <div class="fbliketitle fblikeartistartist" >{{playbackController.playingSong.name}}</div>
    <span id="songfblikesong">

        <div class="fb-like" style="display:inline-block" data-href="https://www.songbase.fm" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div>
       <!--div class="fb-like"  data-href="https://www.songbase.fm" data-layout="button" data-action="like" data-show-faces="true" data-share="true"></div-->
    </span>
    </div>
</div>


<!--div data-role="footer" id="footer" data-position="fixed">
    <h4>Footer content</h4>
</div>< /footer -->


<!--div style="position:absolute;top: 0;left:0;width: 100%;height:100%">

    <table class="tg">

        <tr>
            <td class="tg-031e">    <video autoplay="true" preload="true" src="http://media3.muzu.tv/media/web/002/179/019/0001/2179019_web1.mp4?s=1399509464&amp;e=1399510664&amp;h=0a4cb56600154865bcdccc04018f63f2" width="640" height="360"></video>
            </td>
            <td class="tg-031e">    <video autoplay="true" preload="true" src="http://media3.muzu.tv/media/web/002/179/019/0001/2179019_web1.mp4?s=1399509464&amp;e=1399510664&amp;h=0a4cb56600154865bcdccc04018f63f2" width="640" height="360"></video>
            </td>

        </tr>
        <tr>
            <td class="tg-031e">    <video autoplay="true" preload="true" src="http://media3.muzu.tv/media/web/002/179/019/0001/2179019_web1.mp4?s=1399509464&amp;e=1399510664&amp;h=0a4cb56600154865bcdccc04018f63f2" width="640" height="360"></video>
            </td>
            <td class="tg-031e">    <video autoplay="true" preload="true" src="http://media3.muzu.tv/media/web/002/179/019/0001/2179019_web1.mp4?s=1399509464&amp;e=1399510664&amp;h=0a4cb56600154865bcdccc04018f63f2" width="640" height="360"></video>
            </td>

        </tr>

    </table>


</div-->

<div id="backgroundVideo">

</div>




</div>




<!-- /dailymotion -->
<script src="http://api.dmcdn.net/all.js"></script>
<!-- /page -->

<script type="text/javascript" src="public/js/generatedData.js"></script>

<script type="text/javascript" src="public/js/libs/jquery-1.11.0.js"></script>

<script type="text/javascript" src="public/js/preload.js"></script>



<script type="text/javascript" src="public/cordova.js"></script>

<!-- Libraries -->
<!-- AngularJS -->
<script type="text/javascript" src="public/js/libs/angular.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-touch.js"></script>
<script type="text/javascript" src="public/js/libs/ng-context-menu.js"></script>

<script type='text/javascript' src="http://a.vimeocdn.com/js/froogaloop2.min.js"></script>

<!-- jQuery -->
<script type="text/javascript" src="public/js/libs/jquery-ui.js"></script>
<script type="text/javascript" src="public/js/libs/jqm/jquery.mobile-1.4.2.js"></script>

<script type="text/javascript" src="public/js/libs/jquery.ui.touch-punch.js"></script>
<script type="text/javascript" src="public/js/libs/jquery.simulate.js"></script>

<!-- iScroll -->
<script type="text/javascript" src="public/js/libs/iscroll-zoom.js"></script>

<!--Fastclick>

<script type="text/javascript" src="public/js/libs/fastclick.js"></script-->

<!-- mediaplayerjs -->

<script type="text/javascript" src="public/js/libs/mediaelement/mediaelement-and-player.js"></script>
<script type="text/javascript" src="public/js/libs/mediaelement/playlist/mep-feature-playlist.js"></script>


<!-- mediaplayerjs -->
<script type="text/javascript" src="public/js/libs/chosen/chosen.jquery.js"></script>

<!-- hammerjs -->
<script type="text/javascript" src="public/js/libs/hammer.js"></script>

<!-- cipher -->
<script type="text/javascript" src="public/js/libs/rsa/prng4.js"></script>
<script type="text/javascript" src="public/js/libs/rsa/rng.js"></script>
<script type="text/javascript" src="public/js/libs/rsa/jsbn.js"></script>
<script type="text/javascript" src="public/js/libs/rsa/jsbn2.js"></script>
<script type="text/javascript" src="public/js/libs/rsa/rsa.js"></script>
<script type="text/javascript" src="public/js/libs/rsa/rsa2.js"></script>
<script type="text/javascript" src="public/js/encoder.js"></script>
<!-- cipher -->


<!-- helperFunctions -->
<script type="text/javascript" src="public/js/helperFunctions.js"></script>

<!-- business logic -->
<script type="text/javascript" src="public/js/playbackController.js"></script>

<script type="text/javascript" src="public/js/uiController.js"></script>

<script type="text/javascript" src="public/js/mediaelementPlayer.js"></script>

<script type="text/javascript" src="public/js/dailymotionPlayer.js"></script>
<script type="text/javascript" src="public/js/vimeoPlayer.js"></script>


<script type="text/javascript" src="public/js/videoController.js"></script>


<script type="text/javascript" src="public/js/mediaController.js"></script>

<script type="text/javascript" src="public/js/searchController.js"></script>

<script type="text/javascript" src="public/js/playlistController.js"></script>

<script type="text/javascript" src="public/js/accountController.js"></script>

<script type="text/javascript" src="public/js/authController.js"></script>

<script type="text/javascript" src="public/js/importController.js"></script>


<script type="text/javascript" src="public/js/optionsMenu.js"></script>

<!-- ng Controlle -->
<script type="text/javascript" src="public/js/mainModule.js"></script>



<!-- Include Business Logic and Start App -->
<script type="text/javascript" src="public/js/index.js"></script>
<script type="text/javascript">
    app.initialize();
</script>


<!--Google-->
<script type="text/javascript" src="public/js/googleHandler.js"></script>
<!--Facebook-->
<script type="text/javascript" src="public/js/facebookHandler.js"></script>

<script type="text/javascript" src="public/js/libs/screenfull.js"></script>


<!-- The Google API Loader script. -->
<script type="text/javascript" src="https://apis.google.com/js/api.js?onload=onApiLoad"></script>
<script src="https://apis.google.com/js/client.js?onload=loadClient"></script>



<!--Main NG Controller-->
<script type="text/javascript" src="public/js/mainController.js"></script>


<!-- FACEBOOK
<script>(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/de_DE/all.js#xfbml=1";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
<!-- FACEBOOK -->

<!-- Preload Images/WebGL-->
<div style="display:none">
    <img src="public/img/play.png">
    <img src="public/img/playloading.png">
    <img src="public/img/pause.png">
    <img src="public/img/crosswhite.png">
    <img src="public/img/save.png">
    <img src="public/img/plus.png">
    <img src="public/img/loader.gif">
    <img src="public/img/loadertitle.gif">
    <img src="public/img/cross.png">
    <img src="public/img/loader/sprites.png">
    <img src="public/img/empty.png">
    <img src="public/img/addplaylist.png">
    <img src="public/img/queue.png">

    <img  src="public/img/cross.png"  style="background-image: url(public/img/cross.png)">




    <canvas id="webglcanvas"></canvas>
</div>

<img src="public/img/background.jpg" id="backgroundImage">


<div class="sideinfo fadeincompleteslow">
    <img src="public/img/testad.png">
</div>


<div style="max-height:0px!important;overflow:hidden ">
Music Charts
This article is also " hit parade " called music list . See also charts (disambiguation).
Music Charts ( also shortened English Charts ( Pluraletantum [1 ] ) or German charts and charts ) refers to a method for the numerical compiling a ranking of songs over a certain period , which should reflect their popularity or their success on a limited scale.

Contents [hide ]
1 General
2 Hit Parade -specific terms
3 History
4 Methods of collection
4.1 Sales Charts
4.2 listeners and readers charts
4.3 Airplay Charts
4.4 Merchant Charts
5 Frequency
6 Independence
7 accuracy
8 goals
9 number -one hit
10 criticism
11 examples of national Charts
12 See also
13 Web Links
14 References and notes
General [ Edit]
Charts are intended to represent a measure of the success of a song . In the music charts , higher placed songs therefore the lower ranks of the charts are more successful than title , are taking. The Number One is therefore the most successful songs in the hit parade a certain period. The charts are interested in information about the ranking of songs along with artist and associated record label as well as the previous rankings back to the entry date into the charts . The order of the music is to provide information on the relative popularity of a title. The popularity or popularity of a song depends in turn on the question of the criteria by which it should be measured. As popularity criteria are the frequency of the broadcasting performance ( Airplay ) , sales figures or surveys into consideration. For lack of other alternatives ( sales figures are only fragmentarily available , airplay is not an objective source) make music charts , the only generally accepted classification of songs dar.

Hit Parade -specific terms [ Edit]
Newcomer or new entry ( "entry" , " newcomer " ) are songs that are listed for the first time after its official publication in a current hit parade . In many chart lists they are conspicuously marked with the words " NEW " .
As Chartbreaker or chart-topping song or artist is called , the new goes on one of the front seats or chart can improve its ranking from the previous week tremendously. When you start off in a hit list equal to the first place we also speak of " from zero to one ."
As a climber or climber of the week titles are designated , which could be improved with continuous charts compared to the placement from the previous week especially . In many Favourites therefore, there is a column that identifies a Vorwochenplatzierung . This also applies for songs that fall in the placement over the previous week especially , the term losers or losers of the week.
Returners ( " re-entry" ) are songs that were already recorded in a chart , fell out of it again and now re-emerge as a new arrival.
Crossover hits are songs that are listed because of their music genres not only in their actual charts , but also in the charts of other genres. So Michael Jackson's Rock with You was from November 1979 not only number one in the rhythm and blues charts , but also to rank one of the pop charts in the USA.
Chart position is the current as well as the highest numerical rank which could reach a song .
Hit ( plural: . Sellers , English for Results ) is a song that has reached one of the top rankings of a hit parade . According to the extent of placement success is colloquially then also speak of a " super hit ", " top hit " or " mega-hit " .
Top Ten (also: Top 10) Top Twenty or Hot 100, etc. are names for the numerical extent of a hit parade and also for the placement of a song within this aggregate .
Number -one hit or top hit describes a song , who held the first rank of a hit parade for at least one week. In Germany since 1977, in particular the Media Control Charts are considered relevant ranks for the weekly number -one hit of Germany .
From a one- hit wonder is used when an artist of a single reached the top ranks of the charts , but are no more hits.
History [edit ]
The term " hit parade " has been widely used in the U.S. for the first time with the radio program "Your Hit Parade ", which aired on the NBC Radio from April 20, 1935 with 15 songs that were played in random order . [2 ] Since June 1956 Your been hit parade televised nationally on television ; the regularly scheduled program ran until June 1958. It mainly involved live performances, which were the main factor for the music industry for the determination of a hit on the radio .

The privately organized U.S. radio stations increasingly sought by an individual identification , which distinguished them from competing stations. In this way, initially emerged stations that played as a specific program format only pop music , Country & Western or Rhythm & Blues music . It was followed by the " Top 40 radio ," which played the latest hits and the stations gave a compact and clearly identifiable sound. [3 ]

In 1952, the private radio stations KOWH in Omaha / Nebraska, WTIX had and others started in New Orleans / Louisiana order to offer a specific program format, the Top 40 charts of Billboard [4 ] Todd Storz, owner of a radio chain - . Which also WTIX belonged - had observed that no more than 40 songs were selected in music boxes; Guests tended always the same play from the most 40 plates. Thus arose the still existing " Top 40 radio" . [5 ] This was the core of the "music rotation" , according to which the most popular songs should be played more than others. As of May in 1953 other stations took this hit parade concept, so that the term " Top40 radio" stood for a radio format in which the hit parade in the Countdown principle is played with the number -one hit at the end. This format has been sent for 24 hours and consisted only of short neutral announcements without mentioning the record labels [6] and commercial breaks. Very popular plates were played 30-40 times a day. [7 ] Top 40 radio offered little room for other program content as hits, there was division radio mostly based on the Billboard charts. [8 ] This program format required little attention from the listener , especially since about 50 % of the listeners heard the car radio . [9 ] American Top 40 is the longest running national music countdown in U.S. radio . [10 ]

Earliest Sources Hit Parade ( 1891 ) were the sale of sheet music or a ranking of ASCAP , published in the journal Phonogram ( 1891 ) or the published monthly Phonoscope ( 1896-1899 ) . In particular, these records are based on Joel Whitburns Compilation Pop Memories 1890-1954 , which , however, does not reach the precision of future charts because of the different sources and collection techniques . [11 ] The Billboard magazine worked since its first edition dated November 1, 1894 , initially for the advertising industry ( " billboards " are promotional posters) . Weekly sheet music sales have been published in Billboard from 1913 , from 1914 to 1921 provided the record companies the journal Talking Machine World with sales figures. Published from November 1934 Billboard the bestseller charts record labels , the end of 1938 the weekly compilations of the most popular panels were added in music boxes. The first release of hit parades took place on 4 January 1936 and the first "Music Popularity Chart" was compiled on July 20, 1940. Billboard used since a mixture of airplay and sales statistics . Other important U.S. music magazines with own charts were Cash Box ( October 13, 1951 to the last issue of 16 November 1996) and Record World ( completed 1981). [12 ] Each magazine used in the compilation of his charts its own method . [13 ] as Cash box (1996 ) and Record World ( 1981) disappeared from the market , Billboard expanded its market power as a leading music magazine further.

Since March 7, 1952 is the British music magazine NME , which since November 14, 1952 - . Since as New Musical Express - (later "Top 30") regularly publishes charts Since the acquisition of Melody Maker by the New Musical Express in 2000, the Record Retailer and Music Week as journals with own charts are next to it still remained.

Also create radio and television stations own charts. The BBC began in 1965 with the presentation of its own hit parade , the " Fab 40 " Radio London were hit parade from 19 September 1965. Nearly all pirate radio stations had opted for the program format of the charts radios.

On the long -time third-largest recorded music market Germany , the first single - charts were published from April 1954 through the music magazine " The vending market." For the first time statistics of inserts in music boxes were made. This hit lists can be regarded as the first "official" charts. The magazine " music market " has carried on the tradition and initially led local surveys and pure sales lists , which was far higher than that of the same publishing house published from 1959 total list. With switch from monthly to 14 - daily publication in the early 1960s of the survey mode was unified . There are always publishing houses , together publishing a chart statistics, but often are not very objective ; especially if they rely on their own sources as archives. The first German -language hit parade on the radio was broadcast on April 6, 1958 by Radio Luxembourg ( Camillo rims) . Only in 1967 , the concept hit parade was listed in the Duden spelling dictionary and referred as appropriate forms of representation in radio and television broadcasts. [14 ]

The market research company Media Control collects on behalf of the Federation of the Phonographic Industry week, the official German charts. To this end, over 2000 Report to the automatic ordering system " PhonoNet " connected partner shops in the Federal Republic of all CD sales that go through alternating randomly electronically over the counter and are charged with electronic cash . Large retail chains are involved it just like small businesses . The prerequisite is that the respective store carries a full range, that holds all current disks and is not specialized on about punk. Media Control leads the surveys since 1976. , The transition from the music market and Radio Luxembourg conducted by then charts was fluent . The music market led the charts before 1971 a week , before 14 - day and first month.

In Austria there is the Austrian charts since 1965 , in Switzerland, the Swiss charts since 1968.

Methods of survey [ Edit]
Music charts represent a statistic , so that their composition must also satisfy statistical requirements . Cost-base must be a source that provides objectively verifiable data , whilst also being quantifiable . A survey method, the total or the sample Survey ( with representative samples determined ) in question. The airplay by evaluating the playlists that the radio or TV stations for the national collecting society ( in Germany : GEMA ) must create , are measured. Sales figures can be provided by the recorded music market or by the record companies are available. Finally, representative surveys of music consumers and the legal music downloads can be measured. Some charts use combinations of these data collection methods .

Another method assigns certain genres of music under a certain chart . Thus, Billboard had begun to split the existing to 1942 , all music genres comprehensive pop music charts. Since October 24, 1942 , there is a separate rhythm and blues charts , 8 January 1944, Country & Western Hit Parade and various other charts like the started on March 24, 1956 weekly album charts. Nevertheless, it remains technically hit parade for the pop charts over a wide range of musical styles. It ranges from the actual pop music , rock & roll, folk music, protest songs , rock music or jazz to special styles (especially Comedy, Novelty or film music) and seasonal songs such as summer hits and carols . Then there are the crossovers from their native Rhythm & Blues or Country & Western charts.

Because of the different data collection methods the charts of the various publications almost never match. The informational value is further limited by the fact that the ranking is determined in charts not music aesthetic considerations , but by often barely comprehensible popularity characteristics .

Sales charts [ Edit]
Sales charts imply that only the sales of trading to end users as a criterion for the ranking of the " best-seller " critical. Deliveries of the music industry to the trade are not considered. In general, the absolute sales figures for economic reasons will not be published. The publication of data is limited to details such as the placement , the total number of rating weeks in the charts or the highest chart position reached .

Listeners and readers Charts [ Edit]
Listeners and readers charts are often compiled by the Internet and / or telephone vote . They are usually organized by radio , but also by television . It is each voter either by post (rare), allows by phone or via the Internet , be ( e) favorite song (s) from a list . Own proposals Abstimmers are possible in many cases.

Airplay Charts [ Edit]
The Airplay chart are the ranking of the games played on the radio tracks the number of times a week and transmitter range again . The charts can be, for example, by evaluating the transmission lists drawn up by the broadcasters or by direct observation of the programs broadcast take place . [15 ] based on the determination of the inserts ( the airplay ) is nowadays usually an electronic detection system in which each song is captured by so-called " digital fingerprints" , ie at short intervals a kind of musical fingerprint is taken . The detection system then compares the electronic structure of the emitted title in the monitored stations permanently with the fingerprints in the file. If a track is detected, the respective application is automatically recorded with the title, artist , stations and time and evaluated later. When evaluating the Plays are weighted with the respective listener reach the transmitter .

Interestingly , this type of survey , especially for the music and media industry . Since songs are first played by radio and television stations before they go on sale , the airplay is considered an indicator of the development of a title in the sales charts . By assigning radio stations and music program also the positioning of a music track in terms of the target groups is transparent. Be Published airplay charts especially in the trade press , in Germany , for example, in music week or music market.

Nielsen Music Control determined in 18 countries, the airplay charts , [16 ] , for example, in Austria and Germany . In Switzerland, the official Swiss Charts are created by the German company MusicTrace , this company offers on behalf of several record labels also German airplay charts at . [17 ]

Merchant Charts [ Edit]
Dealer charts are compiled by major dealers themselves and in their own shops hung out , partly published in newspapers or on websites, bestseller lists. You are a marketing tool that promotes the sale and to refer to the listed repertoire. Conclusions on the overall market can be drawn only partly because dealers individual product ranges and marketing activities are reflected in the result.

Frequency [ Edit]
Most charts are compiled on a weekly basis in order to take into account the extensive weekly new releases as soon as possible can . Thus even the smallest changes in the popularity can be closely monitored . Here, all , published in the previous week of my music can be considered in the current week's hit parade , provided they fulfill the potential as a new arrival. The probability not to get into the charts, has always been high. Thus , published in the first half of 1952, the then- six major labels in the U.S. a total of 788 singles , of which only 66 ( = 8.4 %) were noted in Billboard charts. [18 ]

Independence [ Edit]
Charts form the basis for decisions for consumers and a basis for assessing program content in media. At the same time , they also serve the music industry as an important measure of the success of their interpreters . Therefore, the charts do not represent influenced by these stakeholders listings, their creator has to be independent from consumers, the media and music industry. Radio charts are determined by radio or television stations as part of the media and are therefore subject to the risk of dependency or manipulation that could affect the composition of or placement in the charts in a influence. This independence is to prevent the risk of manipulation of the charts , which could take the fact that a certain title in the "Top 10 " lands or even number one on the charts , although he was not listed there without manipulation. Manipulation allegations have been raised time and again , so also in the case of Boyzones hit No Matter What [ 19] or the German Euro Vision Post Run And Hide by Gracia. [20 ] The U.S. " payola " scandal of 1959 again brought to the fore that Radio stations have been bribed by the record industry , so they preferred playing certain songs in order to influence this increased airplay charts the placement. Famous disc jockeys such as Alan Freed were involved herein and were punished. [21 ]

The charts are a fragile barometer of public taste, especially these days , sales of already 2,000 to 3,000 CDs a week is enough to pretty high to get into the charts, possibly even in the "Top Ten" . [22 ] In 1968 had in the U.S. still 750,000 singles sold in order to achieve a top position in the charts in 1979 already sufficed 50,000 . In addition, the plate sales are seasonal heavily concentrated in the winter time, so in the summer lower sales figures for a good chart placement satisfy ( summer hit ) than in winter. With the decrease of the absolute sales figures , the risk of manipulation of those charts that are based as -base solely on sales increases.

Accuracy [ Edit]
" Charts do not really reflect the bestseller except in relation to the other chart positions of the same hit parade " . [23 ] in early 1980 continued in the United States one of the top 5 titles 700,000 copies around , and " two years earlier had this position a turnover of three requires million, " estimated Cynthia Kirk from the magazine Variety. Lower sales levels are also reflected on the gold or platinum status a plate. Goods in Germany in 1976, a million singles needed for a gold record , there are still only 150,000 units since 2003. The global reference point for million-seller by Joseph Murrells [24 ] counts a single as a unit, an EP and an album as a two than six units , but also needs to make revenue estimates. Murrells proves often that a million-seller was not advanced to the first rank , which was blocked by another title , which had been less strongly sale .

" There is nobody who can make the accurate location of the plate sales of White Christmas ," says industry expert Bob Livingston . [25 ] Also, returns of unsold panels can correct the turnover statistics nor down . To examine the RIAA that the gold or platinum award status in the U.S. , after a waiting period of 120 days the exact sales figures. The transfer of sales, airplay , or online downloads in a recent compilation by order represents a highly subjective process dar. [26 ] The tabulation of a particular chart is not a measure of the intensity ( sales, airplay , etc. ) so that a certain top 10 hit a certain period might have exceeded the number -one hit another time. [27 ]

Objectives [ Edit]
Charts represent a selection criterion by choosing from the wide range of music tracks , a limited number ( "Top ten ", " Top Twenty" , " Hot 100 " ), and these bring with the help of the Survey type described in an order that survey caused scheduled re is created. Thus, they focus the attention of consumers in this limited number of hits. They serve the consumers of music as an important guide when deciding what to buy . The consumer has the option of titles in stores or on the radio and TV to be heard before his decision. Auditory impression and status charts are next to the affinity for certain artists , sounds or music styles , the main criteria of the buying decision. For the radio or TV stations , the charts represent a popularity scale on which they can base their playlists. Retailers, in turn used charts for his order lists to thereto to orient the recordings ordered by title and amount . Because chart positions influence program decisions on the radio or TV and ordering decisions in the trade, they act consequently also on the sales of the record label from [28]. Charts are a tool of the music industry , because record labels enjoy a special prestige when they produce constant Chart Hits or even often reach number-one rankings . This self-reinforcing process can affect promotional . Finally, successful national Hits ensure that you are covered internationally licensed in other states. Even artists are favored by good chart positions , as their status at the record company and the fans increases. Charts often from other media (radio , television, press , literature) are used as reference for the meeting of songs.

Number -one hit [ Edit]
For number -one hit is a phonogram ( single, LP , CD or DVD) if he has at least has taken first place a certain charts for a week. The number -one hit in the charts enjoys a particularly prominent status because it features the top ranked recordings of a hit parade period. This exclusively statistical attribute is of particular importance because it is theoretically a month and only 4 in the year can give 52 number-one hits and standing in contrast, appeared in Germany in 2012 a total of 6,698 singles title . [29 ] is thus the probability that it brings to a single number -one hit , just 0.8 % per title. This probability decreases / increases both with the increase / decrease of new releases as well as the residence time of a hit on the first rank. So there was in Germany throughout 1959, only 7 songs that occupied the first rank , in 2003 it was , however, 25 number one hits , both for the music industry as well as in the media and the consumers of importance . The music industry is celebrating the first rank in any charts as a particular success , concentrating on the affected artists more than any other performer without this status ; a first rank in the charts can have a positive impact on the recording contract . For interpreters of the status of a first-tier is regarded as an outward symbol of stardom , radio stations favor the first rank with a more intense airplay , consumers commonly work in their purchasing decisions at number-one hits. With a number -one hit can also be connected to the possibility of a moderate turnover Bestsellers ( million seller ), although this does not apply automatically .

Criticism [ Edit]
Analogous to Bestseller research in literary studies , the hit parade comparable to the best-seller list reference category ; they carry out certain directive functions for different instances of the music industry such as record labels , the music business , airplay or buyer. [30 ] The music tracks or especially the list contained in these charts Leader on music tracks are referred to as hits. This can be unequivocally determine which musical works were most successful . [ 31]

The pioneer of research Bestsellers Werner Faulstich the phenomenon of the bestseller investigated , which can be transferred by analogy to hits. The charts appearing in music are not necessarily musikologisch or music aesthetically the best , but the most sought after in a particular time period. Factors that make a hit, in particular advertising, media, music critic , music fairs , bestseller lists , summer hits and - not least - interested buyers. Another factor is the so-called personalization by stars. Therefore already known artists benefit from their brand profile , so that for instance a new release of Robbie Williams in its segment from the start, has a better chance than a still unknown artist . Have also been proven the influence of phonogram companies that dominate the market for recorded music . You have a better chance of ending up in the charts as a small independent labels. Bestsellers arise in markets where product-related knowledge represents a consumptive use relevant requirement. [32 ] condition for the existence of stars are sufficient duplication options (ie more phonograms ) , to hereby be able to meet the demand , once created , leading to the superstar. Knowledge Acquisition on the plate market is analogous by [33 ]

direct contact with the offer ( currently invested listening time or has already taken place consumption of recorded music of the same artist )
indirect contact through information channels (advertising, media coverage )
personal interaction with other people ( word of mouth ) .
Examples of national Charts [ Edit]
Billboard Hot 100 (United States)
Billboard 200 ( USA )
UK Top 40 ( UK )
Media Control Charts ( Germany )
Ö3 Austria Top 40 ( Austria )
Swiss Charts ( Switzerland )
Nederlandse Top 40 (Netherlands)
Sverigetopplistan (Sweden)
Svensktoppen (Sweden)
New Zealand Top 40 (New Zealand)
Oricon (Japan)
Gaon Chart (South Korea)



Billboard Hot 100


Logo of the charts
The Billboard Hot 100 is a hit parade of the U.S. Billboard magazine , published every Thursday charts. Since June 2007, Billboard publishes the Canadian Hot 100 , which are determined according to the same principle as the Billboard Hot 100 .

Contents [hide ]
1 Determination of the charts
1.1 Today
1.2 1940s and 1950s
1.3 Further to determine
2 Meaning of Charts
3 History of number-one songs on the Billboard Hot 100
4 Problems by boycott by musicians through radio stations
5 sources
6 External links
Determination of the Charts [ Edit]
Today [ Edit]
The charts are based on the airplay and sales of each week. With the issue of 24 March 2012, on-demand songs were recorded , so the data retrieved on the internet songs in audio-on -demand platforms such as Spotify and Rdio [ 1]. Since March 2, 2013 streaming songs charts are part of the Hot 100 , which also take into account the demand figures for the video platform YouTube [ 2].

The sales week begins on Monday and ends on Sunday . The " airplay week " begins on Wednesday and ends on Tuesday .

example
Monday, January 1 - sales week begins
Wednesday, January 3 - " Airplay Week" starts
Sunday, January 7 - sales week ends
Tuesday, January 9th - " Airplay week " ends
Thursday, January 11th - the charts are published
Monday, January 15th until Sunday, January 21 - Validity period of the charts , with January 21 will be the official chart date (week ending January 21st )
criteria
Hot 100 Airplay - about 1,000 radio stations in the U.S.
Hot 100 Singles Sales - the best-selling singles of the week (CD)
Hot Digital Songs - the songs most commonly sold as a download of the week ( digital file )
Streaming songs - music and video streams at polling stations and video platforms such as Spotify and YouTube
1940s and 1950s [ Edit]
In the 1940s and 1950s there was today's Hot 100 yet, so that songs are then entered in three different charts :

Sales - songs that have sold the most in the shops ( 20 to 50 positions )
Airplay - the songs that were played most on the radio (20 to 25 positions )
Jukebox - the songs that were most played in jukeboxes (20 positions). Since then have not played Rock'n'Roll many radio stations , this was the first point of contact for young people who wanted to listen to music.
On August 4, 1958 Billboard published for the first time a hit parade that united all genres, the Hot 100
As of October 13, 1958 also business oriented themselves on the Hot 100 and sorted the records according to the respective position in the charts.
More for determining [ Edit]
A special feature of the U.S. charts is that there songs are listed and not records. So it may be that of a single with two equal songs (double -A- side) both titles may appear in the charts simultaneously. Both get the same sales figures attributed add then come the respective radio airplay . It argues , for example, the Beatles in 1969 with their double feature single Come Together / Something same places 1 and 3

Radio / SoundScan
To be precise, Billboard has contracts with radio stations and stores / online providers , creating the billboard is possible to incorporate exact numbers of sales and the number of played songs to a radio station in the hit parade with .

Importance of charts [ Edit]
The relevance of the Hot 100 Billboard in the United States is very high. They are considered the official U.S. singles chart .

History of number-one songs on the Billboard Hot 100 [ Edit]
The first number-one song was 1958 Poor Little Fool by Ricky Nelson. For a list see List of number-one hits in the United States.

Most number one hits have the Beatles (20 ), followed by Mariah Carey (18 ) , Elvis Presley (17 ) and Michael Jackson ( 14). Elvis Presley is performed only with 7 titles on the Hot 100 , as most of his hits were issued prior to August 1958.

Problems caused by the boycott of musicians through radio stations [ Edit]
With the disappearance of the singles sales and the increasing weighting of radio airplay , the total charts were more dependent on the policies of the radio stations in recent years . This affected not only musical choices, but actually political as in the case of Madonna and the Dixie Chicks , which due to negative comments against George W. Bush in connection with the Iraq war at many stations handed curled a radio boycott and thus hardly still had chances , to place in the top 40 . Due to the increasing trend towards music downloads This effect was again somewhat in perspective.


Media Control Charts
The media control GfK ® charts are weekly music charts for Germany , which are determined by Media Control . In addition to the top 100 singles and album charts disaggregated charts are also available for other media and by musical style .

Contents [hide ]
1 History and development
1.1 Chart Date
2 sales charts
2.1 Collection of Charts
2.2 Qualification rules for record sales
3 download charts
4 More Official Charts
5 features and special achievements in chart history
5.1 Album Charts
5.2 Single Charts
5.2.1 singles that were represented at least 1 year in the Top 100 of the German Singles Charts
5.3 artists who occupied first place in the singles and album charts simultaneously
Chart 6 reports based on media control GfK ®
7 Literature
8 External links
9 sources
History and development [edit ]
Charts are available in Germany since the end of 1953, when the jukebox from the USA came to Germany . The magazine The vending market published each month a list of the most popular boxing - hit. The first publication of this kind had the title It depends a horse collar on the wall of the Kilima Hawaiians than boxing hit the month of December 1953 . This title was thus the first number 1 in the German chart history.

Over the years, the vending market remained the only institution that the success of songs in the form of chart lists reproduced in Germany on a monthly basis in the amount of usually 30 squares. In June 1959, the music market started such a business . This appears also monthly charts were more sophisticated , as they not only subjected to the jukebox success rate , but also the music sales , the airplay - use and the sound carrier , therefore, had record sales . The first number 1 in the charts music market was in June 1959, the title The guitar and the sea by Freddy Quinn. This title was at the same time also number 1 in the market for vending machines .

The boxes charts ran the music market charts in the shortest possible time from the rank and assumed the role of official German chart organ. Had the music market hit parade in 1959 still a strongly fluctuating amount (20 to 70 seats) , then every month appeared from the beginning of 1960 been quite consistent on the 15th with the magazine in the amount of usually 50 seats (sometimes a few more, up to 54 were before ) . At the beginning of 1965, the scope was reduced to 40 seats , but also the chart poster that hung in the record shop appeared the hit parade , which is now based on the pure record sales , twice monthly on the 1st and the 15th since that time there be . At the beginning of 1971, the music market on weekly appearance to ( every Monday ) and increased the scope back to 50 seats. The determination of these weekly Top 50 was broadcast from September 1977, the company Media Control , which is still in charge today.

As of January 1980, the charts had 75 seats , in August 1989 was extended to the still valid today circumference of 100 seats . Not only is the sale of records , but also the radio insert the title was 1989-2001 for places 51 to 100 used . In early 1997, also a restrictive clause was introduced , the 100 allows the bottom half of the top , only a limited residence time for the chart title . Here, a title was canceled after nine weeks in the charts and no later than two weeks after leaving the top 50 . In March 2010 (issue of 19 March ) , this threshold was abolished . [1 ]

Since January 2001, sales of online CD retailers like Amazon.de , and since July 2002, music videos ( DVD, VHS) are miteinberechnet in the calculation of the single and album top 100. As of September 2004 provided the digital downloads of shops were such as the iTunes Store included in the evaluation of the single charts with and used for the determination of the newly introduced download charts . Requirement was that the download song was available as a physical single.

Until October 2005 , respectively , sales week from Monday to Sunday was evaluated . Then the date for new releases has been brought forward to Friday, to have new releases at the beginning of high-volume weekend on the market. According to the evaluation period of the charts has been postponed to Friday to Friday. The official date of the charts since then no more Monday, but Friday.

Since 13 July 2007, the evaluations were converted to so-called value charts. For the chart position is no longer as before, the number of records sold and Downloads decisive , but the turnover of a product ( value ) . At number one on the hit parade is therefore not necessarily the best-selling song or album , but one that has been issued for the most money. This reduces the dependency on special offers and promotions of big chain stores and online shops . The move away from the sales figures laying down the charts listing is unique in the world . [2 ] For this, the requirement was deleted , that singles had to be released as a CD single for inclusion in the charts , so there are also so-called digital -only releases recorded . The recording of digital downloads in the album charts was in 2009.

After the music streaming in 2013 celebrated his breakthrough and was included by Billboard in the U.S. singles charts, it was included with the initial evaluation of 2014 in the chart calculation in Germany . In the official charts only the so-called premium streams are counted , so song calls for the individual , the customer pays directly or via PC. Ad-supported platforms like YouTube are not considered. [3 ]

Chart Date [ Edit]
Unlike in some other countries, the official date of the German charts is not identical to the period in which the sales of songs and albums are evaluated. By 2005 the collection period ended on Sunday , and the charts were exactly eight days later released on Monday . There is therefore a more complete sales week between evaluation and expiration date of the charts. 2005 periods have been brought forward to Friday to Thursday, the official chart date is thus ever since a Friday. This used to be due to the fact that data collection by mail and telephone and chart calculation accordingly took a lot of time . With the development of electronic data processing and transmission ever faster and more accurate evaluations were possible to the official date but was not adjusted. However, the charting is completed as early as the Monday following the sale week and first details will be published on Mondays or Tuesdays. The new lists are published in advance on a fee-based side of media control GfK ® or in the magazine music market. As of Friday afternoon , when the new charts are formally valid, it is partly also from online retailers and music channels ( MTV, VIVA ) published on the internet free ( in albums but not more than the top 50 ) .

Sales charts [ Edit]
Survey of the Charts [ Edit]
The survey carried out on behalf of the Federation of Music Industry ( BVMI ) (until 2007 : Federation of the Phonographic Industry (BPW ) ) and is carried out by the company Media Control GfK International. Media Control GfK ® also carries the publishing rights and markets . The most important are published in industry magazines Music Week and music market.

In its introduction, the charts were created on the sales volume of discs . However, the investigation changed over time and is constantly adapted to current conditions. Among the factors that change include the implementation of the survey , the subdivision of the charts in different genres and the indicators that are included in the score with .

Previously, the pieces sold were counted , but today is the basis of the Euro - sales of records sold within a week chart : cheap recordings must therefore sell more copies than more expensive in relative terms . The determination of dealer record sales since 1997 takes place exclusively by electronic means through the coverage introduced ordering system PhonoNet . The PhonoNet GmbH was founded 1991 as a service company for the electronic ordering traffic between trade and the recording industry .

Participating on the chart panel music stores must meet certain criteria , perform a representative width of the repertoire , for example. In 2007, the sales of about 3,000 points of sale ( " Outlets " ) will be considered. Thus, the chart panel approaches a statistically complete survey . To prevent possible manipulation, there is a control mechanism that reports flashy sales. Among other statistically observed how evenly distributed the sales of a title on all participating businesses : sell individual traders disproportionate amount ( for example, through special sales promotions ) , the numbers are adjusted under certain circumstances to such " action sales " . This also affects other promotions, for example, if in the context of recorded music concerts are sold and that transaction is reported to the Panel . These rules and calculations are all non-public , to prevent tampering .

Most of 2008, 5000 weekly sales of physical singles ranged nationwide to achieve top ranks of the top 10 singles chart . For the top 100 rich , according to Manfred Gillig - Degrave , chief editor of the trade magazine Music Week in bad weeks already " three-digit numbers " (here again Downloads not counted) . [4 ]

Qualification rules for record sales [ Edit]
Thus, a CD can be included in the chart standings, the title ( larger dealers or summaries of smaller retailers) must be sold at several dealer groups. To exclude cheap CD sales from the rating , the CDs had a certain price limit exceeded (for example, 8.50 Euro for an album ) . With the conversion to sales-related chart investigation in July 2007 accounted for this minimum price limit .

Download Charts [ Edit]
In September 2004, the top 20 music downloads charts were collected for the first time . This uses the music - download sales from iTunes, musicload , AOL and other providers. In the meantime, download sales via mobile phones are included (eg Vodafone) . Overall, media control GfK ® sales figures of 18 Download dealers be published, leaving a market coverage of 95 percent is achieved. Media Control GfK surveys ® additionally the top 100 singles download charts and Top 20 music downloads charts.

The download charts are part of the official sales charts and their importance has increased steadily since the beginning of the recording . In the singles have come to dominate the download sales and 2010, the share of digital song downloads was 85%. In the albums , however, continues to dominate the CD , here is the download sales had a share of only 21%. [5 ]

Other official Charts [ Edit]
In addition to the Top 100 singles chart , the Top 100 album chart and the top 30 compilation charts can the Federation of the Phonographic Industry Association determine

the official German Dance Charts (Official Dance Charts , ODC 50)
the top 20 classical charts ( albums , since 1994) ,
the top 30 jazz charts (since 2006) ,
the top 10 comedy charts (since 2008) ,
Top 20 Independent Charts,
the top 100 streaming charts (since 2012) ,
Top 20 Music DVDs ( since 2001) and
the top 20 German Schlager ( since 2001).
The Airplay charts were introduced in 1977 along with the sales charts and determined by Media Control . From 2004 to 2013 they were charged by the media control ® spun-off company Nielsen Music Control . Since 2013 MusicDNA is the official provider. [6 ]

Trend charts like the Germans Black Charts , German Dance Charts or the German Alternative Charts are sold by Public Music & Media Ltd. . created and marketed. They do not reflect real sales figures, but are using , determined by selected and classified according to Nielsen DJs and major trend - dealers at the DCRC important Leftfield and college radio editors .

Special features and special achievements in chart history [edit ]
Album Charts [ Edit]
Shortly after his death on June 25, 2009 was Michael Jackson with the albums " King of Pop" and "Thriller " at the top of the German album charts. In the "Top 10 " followed by " Number Ones " at number seven , and "Bad" over nine two other Jackson albums. Overall, first -placed nine albums in the " Top 100 " in the following weeks were even fourteen of his albums represented in the German album charts . It occupied the published on 17 July 2009 Album Charts six albums by Michael Jackson , the first six places , two more albums landed in the squares 8 and 9 in the singles charts Jackson also reached a novelty , when 24 of his titles in the were able to place "Top 100" ; the song "Thriller" placed himself in ninth best in the "Top 20" continue to follow the song " Earth Song " at 12, " Beat It " on 14 and "Billie Jean " at the 18th
Single Charts [ Edit]
In the week of May 24, 2014 succeeded the German rapper Kollegah , be placed with 18 titles in the top 100 . 17 of which were from his newly released album King, they were all released as single track downloads for the single charts . Earlier, the French DJ David Guetta was in September 2011, nine singles simultaneously on the charts. 2008 and 2012 Cro or Xavier Naidoo were represented with eight titles in the singles charts in Naidoo including publications as a member of the Söhne Mannheims .
The German singer Lena Meyer- Landrut , who won the contest Unser Star für Oslo in March 2010 , shortly after this victory with their first three titles to publish a remarkable sales record. As the first performer in the history of the German singles chart , she succeeded with the song " Satellite" (No. 1 ) , " Bee " (No. 3) and " Love Me " (No. 4) at first three titles in the "Top 5 to place . " In the week of March 4, 2011, also managed to Lena Meyer-Landrut to place yourself right away with five of her songs in the top 100 .
In September 2011, nine singles of the French DJ David Guetta were the same position in the German single charts. These were the three single releases of the album Nothing but the Beat , Little Bad Girl feat. Taio Cruz and Ludacris (16th place ) vs. Sweat . Snoop Dogg ( 27th place ) and Where Them Girls At feat. Nicki Minaj and Flo Rida ( No. 31 ) , as well as the album tracks Titanium feat. Sia (8th place ) , Without You feat. Usher ( 12th place) , Night of Your Life feat. Jennifer Hudson ( # 21 ) , Turn Me On feat. Nicki Minaj ( No. 35 ) , Crank It Up feat. Akon ( No. 43 ) and I Can Only Imagine feat. Chris Brown and Lil Wayne ( No. 72 ) . The newly named album debuted in the same week at # 2 in the German album charts. [7 ]
The American artist Madonna carries the record for the most singles on the charts , Madonna had in the course of her career total of 60 singles on the charts. Followed it is of the singer Peter Alexander with 59 hits.
Singles that were represented at least 1 year in the Top 100 of the German Singles Chart [ Edit]
Currently (as of November 22, 2013 ) made ​​it since 1959 73 items at least 52 weeks to be recorded long [8 ] The following titles were able to at least 70 weeks to place in the charts (the year refers to the first entry in the charts ) . . Of these, at least one week were only six listed at # 1 . With 129 chart weeks of the title Sky and Sand by Paul & Fritz Kalkbrenner has been quoted most often to date.

Previously, such an " evergreen" very rare in the age of downloads, where singles are no longer dependent on a physical equivalent to charters to , they are more common . The frequent occurrence of " evergreens " is also favored by abolishing old chart rules by which certain earlier songs were excluded after some time off the charts.

! 1985 - Wham " Last Christmas" (109 weeks)
1992 - Metallica , " Nothing Else Matters" (72 weeks)
1996 - Wolfgang Petry : " The longest single ever " (81 weeks)
2001 - Melanie Thornton : "Wonderful Dream ( Holidays Are Coming ) " (90 weeks)
2005 - Xavier Naidoo : " This Way" (80 weeks)
2006 - Silver Moon: " The Best " (85 weeks)
2006 - Sunrise Avenue " Fairytale Gone Bad" (73 weeks)
2007 - The Disco Boys feat . Manfred Mann's Earth Band : "For You" (93 weeks)
2007 - DJ Ötzi & Nik P. : "A Star ( ... thy name carries ) " (107 weeks)
2008 - Leona Lewis: 'Run' (99 weeks)
2008 - Peter Fox: " Lake House" (70 weeks)
2009 - The Black Eyed Peas: "I Gotta Feeling" (90 weeks)
2009 - Gossip : " Heavy Cross " (97 weeks)
2009 - Lady Gaga: "Poker Face" (77 weeks)
2009 - Frauenarzt & Manny Marc: "That 's up ! " (70 weeks)
2009 - Kings of Leon " Sex on Fire " (83 weeks)
2009 - Jay- Z & Alicia Keys "Empire State of Mind" (70 weeks)
2010 - Unholy : " Born to Live " (106 weeks)
2010 - Paul & Fritz Kalkbrenner " Sky and Sand " (129 weeks)
2010 - Shakira : " Waka Waka ( This Time for Africa ) " (76 weeks)
2010 - Andreas Gabalier : " I sing a Liad for di " (70 weeks)
2011 - Adele : " Rolling in the Deep" (83 weeks)
2012 - Die Toten Hosen : " Days like these " (81 weeks)
2012 - Sound carousel : " Sun Dance " (83 weeks)
Artists who occupied first place in the single and album charts simultaneously [ Edit]
Year Artist Single Album Time of simultaneous occupancy
1977 ABBA Money , Money, Money + Knowing Me , Knowing You Arrival 5 weeks (December 17, 1976 - January 20, 1977 ) + 2 weeks ( 8 April to 21 April 1977)
1993 4 Non Blondes What's Up Bigger , Better , Faster, More! 9 weeks ( August 20 to October 21 1993)
Pet Shop Boys Go West Very 3 weeks ( 29 October to 18 November 1993)
Meat Loaf I'd Do Anything for Love (But I Will not Do That ) Bat Out of Hell II: Back Into Hell 2 weeks ( November 19 to December 2 1993)
1994 Bryan Adams All For Love ( with Rod Stewart & Sting ) So Far So Good 4 weeks ( 11 February-10 March 1994)
Mariah Carey Without You Music Box 4 weeks ( 13 May to 9 June 1994)
Crash Test Dummies Mmm Mmm Mmm Mmm God Shuffled His Feet 1 week ( 15 July to 21 July 1994)
1995 The Cranberries Zombie No Need to Argue 1 week ( February 3 to February 9 , 1995)
Vangelis Conquest of Paradise 1492 : Conquest of Paradise 4 weeks ( 24 February-23 March 1995)
Take That Back for Good Nobody Else 1 week ( 12 May to 18 May 1995)
1996 The Fugees Killing Me Softly The Score 6 weeks ( 12 July to 22 August 1996)
Andrea Bocelli Time to Say Goodbye ( with Sarah Brightman ) Bocelli 11 weeks (December 20, 1996 - March 13, 1997 )
1998 Doctors A pig named Men 13 3 weeks ( 5 June to 25 June 1998)
1999 Britney Spears ... Baby One More Time ... Baby One More Time 1 week ( 9 April to 15 April 1999)
Bloodhound Gang The Bad Touch Hooray for Boobies 1 week ( October 15 to October 21 1999)
2000 HIM Join Me Razorblade Romance 1 week ( February 4 to February 10 )
Santana Maria Maria ( feat. The Product G & B ) Supernatural 3 weeks ( 17 March to 30 March 2000 and 7 April to 13 April 2000)
2001 No Angels Daylight in Your Eyes Elle'ments 1 week ( 23 March to 29 March 2001)
Shaggy Angel ( feat. Rayvon ) Hot Shot 4 weeks ( 13 July to 9 August 2001)
Enya Only Time A Day Without Rain 3 weeks ( 5 October to 18 October 2001, 26 October-1 November 2001)
2002 Eminem Without Me The Eminem Show 2 weeks ( 14 June to 20 June 2002, 28 June-4 July 2002)
Herbert Grönemeyer Mensch Mensch 1 week ( 13 September to 19 September 2002)
2005 Sarah Connor From Zero to Hero Naughty but Nice 1 week ( 1 April to 7 April 2005)
Madonna Hung Up Confessions on a Dance Floor 2 weeks ( November 25 to December 28 2005)
2006 Shame Monrose Temptation 1 week ( 22 December-28 December 2006)
2007 Nelly Furtado All Good Things ( Come to an End ) Loose 4 weeks ( 12 January to 8 February 2007)
2008 Leona Lewis Bleeding Love Spirit 1 week ( 8 February to 14 February 2008)
2009 Robbie Williams Bodies Reality Killed the Video Star 1 week ( 20 November-26 November 2009)
Ich + Ich paving Bon Voyage 2 weeks ( November 27 to December 10 2009)
2010 Lady Gaga Bad Romance The Fame Monster 1 week ( 15 January to 21 January 2010)
Satellite Lena My Cassette Player 1 week ( 11 June to 17 June 2010)
2011 Adele Rolling in the Deep 21 1 week ( 4 February to 10 February 2011)
Pietro Lombardi Call My Name jackpot 1 week ( 10 June to 16 June 2011)
2012 Die Toten Hosen Days like these ballast of the Republic 3 weeks ( 25 May-7 June and 29 June-5 July 2012)
2013 Daft Punk Get Lucky Random Access Memories 1 week ( 31 May-6 June 2013)
Chart reports based on media control GfK ® [ Edit]
The following chart lists are based on data from the media control GfK ® .

List of number-one hits in Germany
List of number-one albums in Germany
List of number-one albums in the German pop charts
List of top 10 albums in Germany
List of top 10 singles in Germany
</div>
</body>
</html>
