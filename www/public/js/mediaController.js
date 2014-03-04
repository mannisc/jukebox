/** * mediaController.
 *
 * >>Description<<
 *
 * @author Norbert
 * @date 03.03.14 - 14:51
 * @copyright  */


var mediaController = function () {

};


mediaController.playStream = function (playString) {


    if (!uiController.swipeTimer || Date.now() - uiController.swipeTimer > 500) {
        $.ajax({
            url: preferences.serverURL + "?play=" + playString,
            success: function (streamURL) {

                if (streamURL) {

                    // uiController.mediaElementPlayer.pause();
                    uiController.mediaElementPlayer.setSrc(streamURL);
                    //  uiController.mediaElementPlayer.load();
                    uiController.mediaElementPlayer.play();



                }

            }
        })

    }


    //TODO

}