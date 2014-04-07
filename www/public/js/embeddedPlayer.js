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




embeddedPlayer.playpause = function () {
    alert("playpause")

};


embeddedPlayer.stop = function () {
    alert("stop")

};


embeddedPlayer.mute = function () {
    alert("mute")


};

embeddedPlayer.fullscreen = function () {
    alert("fullscreen")
};


embeddedPlayer.setCurrentTime = function(percentage){

    //Set progress in videoController
    videoController.setProgressPercentage(percentage)

}