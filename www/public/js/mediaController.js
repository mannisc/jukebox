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

    console.dir(preferences.serverURL+"?play="+playString);
    $.ajax({

        url:preferences.serverURL+"?play="+playString,
        success:function(streamURL){
            if(streamURL){

               // uiController.mediaElementPlayer.pause();
                console.dir(streamURL);
                uiController.mediaElementPlayer.setSrc(streamURL);
              //  uiController.mediaElementPlayer.load();
                uiController.mediaElementPlayer.play();

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Server is not responding!");

        }
    })
    //TODO

}