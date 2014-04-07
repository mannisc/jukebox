/**
 * mediaelementPlayer.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 07.04.14 - 12:00
 * @copyright munichDev UG
 */


var mediaelementPlayer = function () {
};





mediaelementPlayer.play = function () {


};

mediaelementPlayer.pause = function () {

};

mediaelementPlayer.stop = function () {
    alert("stop")

};


mediaelementPlayer.setVolume = function (volume) {
    console.log(volume);
};

mediaelementPlayer.fullscreen = function () {
    alert("fullscreen")
};


mediaelementPlayer.setCurrentTime = function(percentage){

    //Set progress in videoController
    videoController.setProgressPercentage(percentage)


    /*
     newTime = (percentage <= 0.02) ? 0 : percentage * media.duration;

     // seek to where the mouse is
     if (mouseIsDown && newTime !== media.currentTime) {
     media.setCurrentTime(newTime);
     }
    */

}