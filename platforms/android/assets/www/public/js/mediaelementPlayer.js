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





mediaelementPlayer.playpause = function () {
    alert("playpause")

};


mediaelementPlayer.stop = function () {
    alert("stop")

};


mediaelementPlayer.mute = function () {
    alert("mute")


};

mediaelementPlayer.fullscreen = function () {
    alert("fullscreen")
};


mediaelementPlayer.setCurrentTime = function(percentage){
       alert(percentage)
    /*
     newTime = (percentage <= 0.02) ? 0 : percentage * media.duration;

     // seek to where the mouse is
     if (mouseIsDown && newTime !== media.currentTime) {
     media.setCurrentTime(newTime);
     }
    */

}