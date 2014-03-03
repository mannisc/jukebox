/** * mediaController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 03.03.14 - 14:51
 * @copyright  */


var mediaController = function () {

};



mediaController.playStream =function(searchString){
    var streamURL = "";

    //TODO 

    uiController.mediaElementPlayer.setSrc(streamURL);
    uiController.mediaElementPlayer.play();
}