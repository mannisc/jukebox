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


optionsMenu.options = [{text:"",callback:null}]



optionsMenu.openSongResultsOptions = function(event){

    if(event)
     event.stopPropagation();

    optionsMenu.options = [
        {text:"Play Songs",callback:null} ,
        {text:"Add Songs to Play Queue",callback:null},
        {text:"Add Songs to Playlist",callback:null},
        {text:"Add Songs as new Playlist",callback:null},

    ]

    $scope.safeApply();

    $('#popupOptions').popup('open', {positionTo: '#positionSongResultsOptions', transition: 'pop'});$

}
