/** * mediaController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 03.03.14 - 14:51
 * @copyright  */


var mediaController = function () {

};



mediaController.playStream =function(playString){


    $.ajax({
        url:preferences.serverURL+"?play="+playString,
        success:function(streamURL){

            if(streamURL){
                uiController.mediaElementPlayer.setSrc(streamURL);
                uiController.mediaElementPlayer.play();

            }

        }
    })
    //TODO

}