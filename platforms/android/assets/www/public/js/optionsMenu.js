/**
 * optionsMenu.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 08.05.14 - 19:46
 * @copyright munichDev UG
 */


var optionsMenu = function () {

};


optionsMenu.options = [
    {text: "", callback: null}
]




//Playlist

optionsMenu.openPlaylistOptions = function (event, positionTo) {

    if (event)
        event.stopPropagation();

    optionsMenu.options = [
        {text: "Rename Playlist", callback: null}
    ]

    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions" ).popup( "option", "arrow", "t" );
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});
    $("#popupOptions-popup").css("margin-top","15px");

}


//Search Results

optionsMenu.openArtistResultsOptions = function (event, positionTo) {

    if (event)
        event.stopPropagation();

    optionsMenu.options = [
        {text: "Play Artists Songs", callback: null} ,
        {text: "Add Songs to Play Queue", callback: null},
        {text: "Add Songs to Playlist", callback: null},
        {text: "Add Songs as new Playlist", callback: null}

    ]

    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions" ).popup( "option", "arrow",true );
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});

}






optionsMenu.openPlaylistResultsOptions = function (event, positionTo) {

    if (event)
        event.stopPropagation();

    optionsMenu.options = [
        {text: "Play Playlist Songs", callback: null} ,
        {text: "Add Playlists to Play Queue", callback: null},
        {text: "Add to own Playlist", callback: null},
        {text: "Add as new Playlist", callback: null},
        {text: "Select All", callback: null}

    ]

    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions" ).popup( "option", "arrow",true );
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});


}


optionsMenu.openSongResultsOptions = function (event, positionTo) {

    if (event)
        event.stopPropagation();

    optionsMenu.options = [
        {text: "Play Songs", callback: null} ,
        {text: "Add Songs to Play Queue", callback: null},
        {text: "Add Songs to Playlist", callback: null},
        {text: "Add Songs as new Playlist", callback: null},
        {text: "Select All", callback: null}


    ]

    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions" ).popup( "option", "arrow",true );
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});


}


optionsMenu.openUserResultsOptions = function (event, positionTo) {

    if (event)
        event.stopPropagation();


    optionsMenu.options = [
        {text: "Show All Results", callback: function () {
            optionsMenu.closePopup();
            setTimeout(function () {
                searchController.setShowMode(4);
            }, 150)
        }
        }
    ]

    $scope.safeApply();
    $("#popupOptionsList").listview("refresh");
    $("#popupOptions" ).popup( "option", "arrow",true );
    $("#popupOptions").popup('open', {positionTo: positionTo, transition: 'pop'});


}


optionsMenu.closePopup = function () {
    $("#popupOptions").popup('close');

}