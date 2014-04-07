/**
 * embeddedPlayer.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 07.04.14 - 09:25
 * @copyright munichDev UG
 */

var embeddedPlayer = function () {
};



embeddedPlayer.play = function () {
    alert("play")


};

embeddedPlayer.pause = function () {

    alert("pause")

};

embeddedPlayer.stop = function () {
    alert("stop")

};


embeddedPlayer.setVolume = function (volume) {
    console.log(volume);
};

embeddedPlayer.fullscreen = function () {
    alert("fullscreen")
};


embeddedPlayer.setCurrentTime = function(percentage){

    //Set progress in videoController
    videoController.setProgressPercentage(percentage)

}