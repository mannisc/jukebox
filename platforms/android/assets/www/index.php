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


    <title>Songbase.fm</title>
</head>
<body ng-controller="MainController">

<!-- FACEBOOK -->
<div id="fb-root"></div>
<!-- FACEBOOK -->

<div id="lyricsiframe" class="fadeincompleteslow" style="display:none">
    <div id="lyricsifrmback">
    </div>
    <iframe id="lyricsifrm" src="about:blank" seamless="">
    </iframe>

    <img id="lyricsiframeresizebar" onclick="mediaController.toggleLyrics();" src="public/img/resizebar.png" style="position:absolute;right: 0px;top:0px">
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
        <a id="playingSongInfoLink" style="opacity:0" onclick="searchController.getArtistInfo();" ng-show="playbackController.playingSong" href="#popupArtist" data-rel="popup" data-position-to="#playingSongInfoLink"
           class="playingSongInfo  ui-btn  ui-corner-all ui-shadow ui-btn-inline ui-icon-custom ui-btn-icon-left ui-btn-a" data-transition="pop">
            <span style="opacity:0">{{playbackController.getPlayingTitle()}}</span>
            <span id="playingSongTitleLoading" class="fadeincomplete" style="text-align:left;z-index:0;display:none;position:absolute;left: 35px;top: 9px;right: 0px">{{playbackController.getPlayingTitle()}}</span>
            <span id="playingSongTitle" class="fadeincomplete" style="text-align:left;z-index:0;display:none;position:absolute;left: 35px;top: 9px;right: 0px">{{playbackController.getPlayingTitle()}} </span>
        </a>
        <a id="buySongLink" style="opacity:0" onclick="mediaController.buySong()" ng-show="playbackController.playingSong" href="#" data-rel="popup" data-position-to="#buySongLink"
           class="playingSongBuy   ui-btn  ui-corner-all ui-shadow ui-btn-inline ui-icon-heart ui-btn-icon-left ui-btn-a" data-transition="pop">Buy Song</a>


        <a id="signinLink" ng-if="!accountController.loggedIn" href="#popupLogin" onclick="setTimeout(function(){$('#signinusername').focus();},700)" data-rel="popup" data-position-to="#signinLink"
           class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-check ui-btn-icon-left ui-btn-a" data-transition="pop">Sign in</a>

        <a id="registerLink" ng-if="!accountController.loggedIn" href="#popupRegister" onclick="setTimeout(function(){$('#registerusername').focus();},700)" data-rel="popup" data-position-to="#registerLink"
           class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-plus ui-btn-icon-left ui-btn-a" data-transition="pop">Sign up</a>

        <a id="linkAccount" ng-if="accountController.loggedIn" href="#popupAccount" data-rel="popup" class="ui-btn  ui-corner-all ui-shadow ui-btn-inline ui-icon-user ui-btn-icon-left ui-btn-a fadeincomplete" data-transition="pop">{{accountController.userName}}</a>


    </div>

</div>


<!-- /header -->

<!--Open Side Panel-->
<div onclick="uiController.toggleSidePanel();" id="openSidePanelBarIconBar" style="z-index:9000;position: fixed;top: 0;right: 0;width: 30px;height:44px;"></div>



<div data-role="content" id="content">
<div id="controlbar">
    <input id="searchinput" data-type="search" data-theme="a" placeholder="Search">


    <div id="controlselecthorizontal">
        <a id="searchlayoutbutton" title="Change list layout" data-type="button" data-theme="b" onclick="uiController.toggleGridLayout();" style="background-color: #442727;width: 3px;height: 20px;" class="ui-input-btn ui-btn ui-btn-b ui-shadow ui-corner-all"><img src="public/img/grid.png"  style="width: 20px;margin-left: -9px;"> </a>
        <input id="searchbutton1" data-type="button" data-theme="b" onclick="searchController.activateButton(0);searchController.showSearchList()" type="button" value="Search">
        <!--input id="searchbutton2"data-type="button" data-theme="b" onclick="searchController.activateButton(1);searchController.showPopulars()" type="button" value="Popular"-->

        <input id="searchbutton2" data-type="button" data-theme="b" onclick="searchController.activateButton(1);searchController.showSuggestions()" type="button" value="Suggestions">
        <input id="searchbutton3" data-type="button" data-theme="b" onclick="searchController.activateButton(2);searchController.emptySearchList()" type="button" value="Explore">

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


<div id="searchlist" class="clickarea">


    <!--form class="ui-filterable" >
        <input id="filterBasic-input" data-type="search" data-theme="a">
    </form-->

    <ul  data-role="listview" id="searchlistview" class="connectedSortable songlist fast3d" >

        <li ng-if ="searchController.searchResults.length>0&&searchController.showMode!=0" onclick="searchController.setShowMode(0)"  ng-dblclick="playlistController.deselectSongs($event);" class="fadeincompletefast hoverable specialplaylistbutton searchlisttitlebutton stayvisible">
            <a tabindex="-1">
                <img src="public/img/empty.png"   class="optionsSearchResultsBack"   >
                <h3 style="font-size: 1.1em;margin-top: 7px;">Show all</h3>
            </a></li>

        <li ng-if ="searchController.searchResults.length>0&&searchController.isVisisbleInShowMode(3)" onclick="searchController.setShowMode(3)"  ng-dblclick="playlistController.deselectSongs($event);" class="fadeincompletefast hoverable specialplaylistbutton searchlisttitlebutton stayvisible">
            <a tabindex="-1" ng-class="{loaded:searchController.showMode==3}">
                <img src="public/img/empty.png" onclick="optionsMenu.openArtistResultsOptions(event,'#positionArtistResultsOptions')"   class="optionsSearchResults"   >
                <div id="positionArtistResultsOptions" class="positionResultsOptions" ></div>

                <h3  ng-if ="searchController.showedPopulars"  style="font-size: 1.1em;margin-top: 7px;">Featured Artists</h3>
                <h3  ng-if ="!searchController.showedPopulars"  style="font-size: 1.1em;margin-top: 7px;">Artists</h3>
            </a>
        </li>
        <li  ng-if ="searchController.isVisisbleInShowMode(3)" ng-repeat="song in searchController.searchResults  | limitTo:searchController.getShowModeLimit(3)  track by song.id " data-song="{{song}}" ontouchend ="playbackController.touchedElement(event);" data-index="{{$index}}" data-songid="searchsong{{song.id}}" data-songtitle ="{{song.name}}-{{mediaController.getSongArtist(song)}}"   class="draggableSong fadeincompletefast"  ng-click="playbackController.clickedElement($event,song);"  ng-dblclick="playlistController.deselectSongs($event);"><a >
            <img src="public/img/empty.png"   ng-style="{'background-image':'url('+mediaController.getSongCover(song)+')','background-size':'100%'}" alt="" class="ui-li-icon ui-corner-none" >
            <img src="public/img/empty.png"    class="loadingSongImg"   >
            <img ng-if ="playlistController.hasTrendStyle(0,song)" src="public/img/empty.png" class="songWinner songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(1,song)" src="public/img/emtpy.png" class="songNochange songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(2,song)" src="public/img/emtpy.png" class="songLoser songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(3,song)" src="public/img/emtpy.png" class="songNew songTrend" >

            <h3 ng-class="playlistController.getTrendTitleClass(song)" title="{{song.name}}">{{song.name}}</h3>

            <p>{{mediaController.getSongArtist(song)}}<span ng-if ="song.playcount !== undefined && song.playcount" class="songPlayCount"><span  style="font-style: normal;font-size: .83em;margin-left:2px;"> ►</span><span  style="font-style: italic;font-size: .93em;margin-left:2px;">{{song.playcount}}</span></span>  </p></a>
        </li>



        <li ng-if ="searchController.searchResults.length>0&&searchController.isVisisbleInShowMode(2)" onclick="searchController.setShowMode(2)"  ng-dblclick="playlistController.deselectSongs($event);" class="fadeincompletefast hoverable specialplaylistbutton searchlisttitlebutton stayvisible">
            <a tabindex="-1"  ng-class="{loaded:searchController.showMode==2}">

                <img src="public/img/empty.png" onclick="optionsMenu.openPlaylistResultsOptions(event,'#positionPlaylistResultsOptions')"   class="optionsSearchResults"   >
                <div id="positionPlaylistResultsOptions" class="positionResultsOptions" ></div>

                <h3  ng-if ="searchController.showedPopulars"  style="font-size: 1.1em;margin-top: 7px;">Featured Playlists</h3>
                <h3  ng-if ="!searchController.showedPopulars"  style="font-size: 1.1em;margin-top: 7px;">Playlists/Albums</h3>
            </a>
        </li>
        <li  ng-if ="searchController.isVisisbleInShowMode(2)" ng-repeat="song in searchController.searchResults  | limitTo:searchController.getShowModeLimit(2)  track by song.id " data-song="{{song}}" ontouchend ="playbackController.touchedElement(event);" data-index="{{$index}}" data-songid="searchsong{{song.id}}" data-songtitle ="{{song.name}}-{{mediaController.getSongArtist(song)}}"   class="draggableSong fadeincompletefast"  ng-click="playbackController.clickedElement($event,song);"  ng-dblclick="playlistController.deselectSongs($event);"><a >
            <img src="public/img/empty.png"   ng-style="{'background-image':'url('+mediaController.getSongCover(song)+')','background-size':'100%'}" alt="" class="ui-li-icon ui-corner-none" >
            <img src="public/img/empty.png"    class="loadingSongImg"   >
            <img ng-if ="playlistController.hasTrendStyle(0,song)" src="public/img/empty.png" class="songWinner songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(1,song)" src="public/img/emtpy.png" class="songNochange songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(2,song)" src="public/img/emtpy.png" class="songLoser songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(3,song)" src="public/img/emtpy.png" class="songNew songTrend" >

            <h3 ng-class="playlistController.getTrendTitleClass(song)" title="{{song.name}}">{{song.name}}</h3>

            <p>{{mediaController.getSongArtist(song)}}<span ng-if ="song.playcount !== undefined && song.playcount" class="songPlayCount"><span  style="font-style: normal;font-size: .83em;margin-left:2px;"> ►</span><span  style="font-style: italic;font-size: .93em;margin-left:2px;">{{song.playcount}}</span></span>  </p></a>
        </li>



        <li  ng-if ="searchController.searchResults.length>0&&searchController.isVisisbleInShowMode(1)" onclick="searchController.setShowMode(1)"  ng-dblclick="playlistController.deselectSongs($event);" class="fadeincompletefast hoverable specialplaylistbutton searchlisttitlebutton stayvisible">
            <a tabindex="-1"  ng-class="{loaded:searchController.showMode==1}">

                <img src="public/img/empty.png" onclick="optionsMenu.openSongResultsOptions(event,'#positionSongResultsOptions')"   class="optionsSearchResults"   >
                <div id="positionSongResultsOptions" class="positionResultsOptions" ></div>

                <h3  ng-if ="searchController.showedPopulars"  style="font-size: 1.1em;margin-top: 7px;">Popular Songs</h3>
                <h3  ng-if ="!searchController.showedPopulars"  style="font-size: 1.1em;margin-top: 7px;">Songs</h3>

         </a></li>

        <li ng-if ="searchController.isVisisbleInShowMode(1)" ng-repeat="song in searchController.searchResults | limitTo:searchController.getShowModeLimit(1) track by song.id" data-song="{{song}}" ontouchend ="playbackController.touchedElement(event);" data-index="{{$index}}" data-songid="searchsong{{song.id}}" data-songtitle ="{{song.name}}-{{mediaController.getSongArtist(song)}}"   class="draggableSong fadeincompletefast"  ng-click="playbackController.clickedElement($event,song);"  ng-dblclick="playlistController.deselectSongs($event);"><a >
            <img src="public/img/empty.png"   ng-style="{'background-image':'url('+mediaController.getSongCover(song)+')','background-size':'100%'}" alt="" class="ui-li-icon ui-corner-none" >
            <img src="public/img/empty.png"    class="loadingSongImg"   >
            <img ng-if ="playlistController.hasTrendStyle(0,song)" src="public/img/empty.png" class="songWinner songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(1,song)" src="public/img/emtpy.png" class="songNochange songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(2,song)" src="public/img/emtpy.png" class="songLoser songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(3,song)" src="public/img/emtpy.png" class="songNew songTrend" >

            <h3 ng-class="playlistController.getTrendTitleClass(song)" title="{{song.name}}">{{song.name}}</h3>

            <p>{{mediaController.getSongArtist(song)}}<span ng-if ="song.playcount !== undefined && song.playcount" class="songPlayCount"><span  style="font-style: normal;font-size: .83em;margin-left:2px;"> ►</span><span  style="font-style: italic;font-size: .93em;margin-left:2px;">{{song.playcount}}</span></span>  </p></a>
        </li>


        <li  ng-if ="searchController.searchResults.length>0&&searchController.isVisisbleInShowMode(4)" onclick="searchController.setShowMode(4)"  ng-dblclick="playlistController.deselectSongs($event);" class="fadeincompletefast hoverable specialplaylistbutton searchlisttitlebutton stayvisible">
            <a tabindex="-1"  ng-class="{loaded:searchController.showMode==4}">

                <img src="public/img/empty.png" onclick="optionsMenu.openUserResultsOptions(event,'#positionUserResultsOptions')"   class="optionsSearchResults"   >
                <div id="positionUserResultsOptions" class="positionResultsOptions" ></div>

                <h3   style="font-size: 1.1em;margin-top: 7px;">Users</h3>

            </a></li>

        <li ng-if ="searchController.isVisisbleInShowMode(4)" ng-repeat="song in searchController.searchResults | limitTo:searchController.getShowModeLimit(4) track by song.id" data-song="{{song}}" ontouchend ="playbackController.touchedElement(event);" data-index="{{$index}}" data-songid="searchsong{{song.id}}" data-songtitle ="{{song.name}}-{{mediaController.getSongArtist(song)}}"   class="draggableSong fadeincompletefast"  ng-click="playbackController.clickedElement($event,song);"  ng-dblclick="playlistController.deselectSongs($event);"><a >
            <img src="public/img/empty.png"   ng-style="{'background-image':'url('+mediaController.getSongCover(song)+')','background-size':'100%'}" alt="" class="ui-li-icon ui-corner-none" >
            <img src="public/img/empty.png"    class="loadingSongImg"   >
            <img ng-if ="playlistController.hasTrendStyle(0,song)" src="public/img/empty.png" class="songWinner songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(1,song)" src="public/img/emtpy.png" class="songNochange songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(2,song)" src="public/img/emtpy.png" class="songLoser songTrend" >
            <img ng-if ="playlistController.hasTrendStyle(3,song)" src="public/img/emtpy.png" class="songNew songTrend" >

            <h3 ng-class="playlistController.getTrendTitleClass(song)" title="{{song.name}}">{{song.name}}</h3>

            <p>{{mediaController.getSongArtist(song)}}<span ng-if ="song.playcount !== undefined && song.playcount" class="songPlayCount"><span  style="font-style: normal;font-size: .83em;margin-left:2px;"> ►</span><span  style="font-style: italic;font-size: .93em;margin-left:2px;">{{song.playcount}}</span></span>  </p></a>
        </li>



       </span>

    </ul>
</div>



<div id="playlist" style="opacity:0">

    <!--h3>Playlist</h3-->

    <div id="controlbarplaylist">

        <div id="playlistselectvertical">
            <a href="#" id="clearChoosenPlaylists"   style="display:none" class="ui-input-clear ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all" title="Clear Selection">Clear Selection</a>

            <form>
                <select id="playlistselectverticalform" data-role="none"  multiple class="chosen-select">
                    <option  value="{{playlistController.currentQueue.gid}}" class ="currentQueue">{{playlistController.currentQueue.name}}</option>

                    <option ng-repeat="playlist in playlistController.playlists track by playlist.gid" ng-if ="!playlist.isCurrentQueue" value="{{playlist.gid}}" >{{playlist.name}}</option>

                </select>

            </form>


        </div>
        <div id="sortplaylistbutton">

            <button id="sortplaylistbtn" title="Sortable List" onclick="playlistController.toggleSortablePlaylist(true);" data-mini="true" data-type="button" value="" data-theme="b">
                <img src="public/img/sort.png" width="22px" height="22px" alt="Sort"/>
            </button>

        </div>




    </div>
    <!--form class="ui-filterable" >
        <input id="filterBasic-input" data-type="search" data-theme="a">
    </form-->
    <div id="playlisthelp" class="{{playlistController.getHelpStyleClass()}}">
    </div>

    <div id="playlistInner" class="animate" style="display:none">
        <ul ui-sortable ng-model="playlistController.loadedPlaylistSongs" data-role="listview" id="playlistview" class="sortable songlist connectedSortable">

            <li ng-if ="playlistController.playlistMode" ng-click="playlistController.loadCurrentQueue($event)"  ng-dblclick="playlistController.deselectSongs($event);" class="fadeincomplete hoverable specialplaylistbutton currentqueue stayvisible">
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

            <li ng-repeat="song in playlistController.loadedPlaylistSongs track by song.gid" ng-if ="!song.isCurrentQueue&&(!song.isPlaylist||!song.isUnnamedPlaylist||song.tracks.length>0)" data-index="{{$index}}" data-songid="playlistsong{{song.id}}" data-songtitle ="{{song.name}}-{{mediaController.getSongArtist(song)}}" data-songgid="playlistsong{{song.gid}}" class="fadeslideincompletefast hoverable  playlistsong"
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
                         <p>Playlist</p><img class="removesong" ng-style="{'background-image':'url(public/img/trash.png)',display:'none'}" src="public/img/empty.png">
                    </span>
            </a></li>
        </ul>
    </div>
</div>

<div id="videoplayer">
    <div id="videoplayerInner">

        <!-- mediaemelemtjs player -->
        <video id="mediaemelemtjsPlayer1" controls="controls" preload="true">
            <source src="" type="video/mp4"/>
            <!--   <source src="" type="video/flv"/> -->
        </video>



        <!-- embedded players -->
        <div id="embedplayer" >
            <div id="dmplayer" ></div>
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

    <img id="playSelection" onclick="playlistController.playSelection(event)"  ondblclick="playlistController.playSelection(event)"    src="public/img/playopt.png">

    <img id="removeFromPlaylist" onclick="playlistController.addSongsToPlaylist(event)"  ondblclick="playlistController.removeSongsFromPlaylist(event)"   src="public/img/empty.png" >

    <img id="addToPlaylist" onclick="playlistController.addSongsToPlaylist(event)"  ondblclick="playlistController.addSongsToPlaylist(event)"    src="public/img/add.png">
    <img id="searchSimilar" onclick="event.stopPropagation();" ondblclick="event.stopPropagation();"   src="public/img/radio.png" >

    <img id="moreOptions" onclick="playlistController.shareSelectedElements();event.stopPropagation();" ondblclick="event.stopPropagation();"   src="public/img/moreoptions.png" >

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
                <li ng-repeat="songversion in mediaController.versionList track by songversion.id" data-theme="b" class="fadeslideincompletefast playlistsong" ng-click="mediaController.playVersion(songversion,1,1)"><a href="#"
                                                                                                                                                                                                                          style="padding-left: 15px!important;"
                                                                                                                                                                                                                          id=""
                                                                                                                                                                                                                          title="{{songversion.url}}">{{songversion.title}}<span
                        style="opacity:0"> ..{{mediaController.showDuration(songversion)}}</span> <span style="position:absolute;right: 42px;top:10px;opacity:0.8"> {{ mediaController.showDuration(songversion) }}</span> </a></li>

            </ul>
            <div id="loadversionimg" style="opacity:0">
                <img src="public/img/loader.gif"/>
            </div>
        </div>
    </form>
    <br>
</div>


<div data-role="popup" id="popupRegister" data-arrow="true" data-theme="a" class="ui-corner-all"  >
        <div style="padding:0px 20px 10px 20px">
            <h3 id="registertitle">Sign Up For Free</h3>

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
            <fb:login-button show-faces="true" width="200" scope="public_profile, email"  max-rows="1" size="large">Sign in with Facebook</fb:login-button>

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
            <fb:login-button show-faces="true" width="200" perms="public_profile, email" max-rows="1" size="large">Sign in with Facebook</fb:login-button>
        </div>
</div>


<div data-role="popup" id="popupAccount" data-arrow="true" data-theme="a" class="ui-corner-all">
    <form>
        <div>
            <h3 style="margin-right: 40px; margin-left:40px;text-align: center">Account</h3>
            <ul data-role="listview">
                <li><a href="#" data-rel="back" id="manageFacebook"><img src="public/img/fb.png">Facebook</a></li>
                <li><a href="#" data-rel="back" onclick="googleHandler.login();" id="manageGoogle"><img src="public/img/gdrive.png">Google
                    <!--span class="GoogleBlue">G</span><span class="GoogleRed">o</span><span class="GoogleYellow">o</span><span class="GoogleBlue">g</span><span class="GoogleGreen">l</span><span class="GoogleRed">e</span--></a></li>
                <li style="border-bottom:1px solid #ddd;"><a href="#" data-rel="back" id="manageDropbox"><img src="public/img/dropbox.png">Dropbox</a></li>
                <li style="border-top:15px solid rgba(255,255,255,0);"><a href="#" onclick="accountController.logout();" id="logoutlink" data-rel="back"><img src="public/img/logout.png">Log out</a></li>

            </ul>
        </div>
    </form>
</div>

<div data-role="popup" id="popupConfirm" data-arrow="true" data-dismissible="false" data-theme="a" class="ui-corner-all">
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
</div>

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


<div data-role="popup" id="popupOptions" data-dismissible="true" data-theme="a" class="ui-corner-all">
    <form>
        <div>
            <ul data-role="listview" id="popupOptionsList" data-theme="b" style="background-color: #545454;">
                <li ng-repeat = "option in optionsMenu.options" ng-click = "option.callback()" data-theme="b" data-icon="false" class="marked"><a style="text-decoration:none;padding-left: 14px!important" target="_blank">{{option.text}}</a></li>
            </ul>
        </div>
    </form>
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

<img src="public/img/background.jpg" id="backgroundImage">
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

<!-- jQuery -->
<script type="text/javascript" src="public/js/libs/jquery-ui.js"></script>
<script type="text/javascript" src="public/js/libs/jqm/jquery.mobile-1.4.2.js"></script>

<script type="text/javascript" src="public/js/libs/jquery.ui.touch-punch.js"></script>
<script type="text/javascript" src="public/js/libs/jquery.simulate.js"></script>

<!-- iScroll -->
<script type="text/javascript" src="public/js/libs/iscroll-zoom.js"></script>

<!--Fastclick-->

<script type="text/javascript" src="public/js/libs/fastclick.js"></script>

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
<script type="text/javascript" src="public/js/dailymotionPlayers.js"></script>

<script type="text/javascript" src="public/js/videoController.js"></script>
<script type="text/javascript" src="public/js/videoPlayer.js"></script>


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

<!--Embed-->
<script type="text/javascript" src="public/js/dailymotionPlayers.js"></script>

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




</body>
</html>
