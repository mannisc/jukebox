/**
 * helperFunctions.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 05.03.14 - 17:49
 * @copyright munichDev UG
 */

var helperFunctions = function () {

};



helperFunctions.padZeros = function(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}



helperFunctions.clearBackground =    function(selector){
    var element = $(selector).get(0);

    if(!element)
        return;
    $(element).hide();
    $(element).css("opacity","0")


}


helperFunctions.animateBackgroundTimeout=null;
helperFunctions.animateBackground = function(selector, cImageSrc,cWidth,cHeight,cTotalFrames,cFrameWidth,cSpeed){

    var cImageTimeout=false;
    var cIndex=0;
    var cXpos=0;
    var cPreloaderTimeout=false;
    var SECONDS_BETWEEN_FRAMES=0;

    if(helperFunctions.animateBackgroundTimeout){
        clearTimeout(helperFunctions.animateBackgroundTimeout);
        helperFunctions.animateBackgroundTimeout = null;
    }

    function startAnimation(){

        var element = $(selector).get(0);

        if(!element)
        return;
        $(element).show();
        element.style.opacity = 0.8;
        element.style.backgroundImage='url('+cImageSrc+')';
        element.style.width=cWidth+'px';
        element.style.height=cHeight+'px';
        element.style.backgroundPositionX = "0px";
        element.style.backgroundPositionY = "0px";

        //FPS = Math.round(100/(maxSpeed+2-speed));
        var FPS = Math.round(100/cSpeed);
        SECONDS_BETWEEN_FRAMES = 1 / FPS;
        helperFunctions.animateBackgroundTimeout=setTimeout(continueAnimation, SECONDS_BETWEEN_FRAMES/1000);

    }

    function continueAnimation(){

        cXpos += cFrameWidth;
        //increase the index so we know which frame of our animation we are currently on
        cIndex += 1;

        //if our cIndex is higher than our total number of frames, we're at the end and should restart
        if (cIndex >= cTotalFrames) {
            cXpos =0;
            cIndex=0;
        }

        var element = $(selector).get(0);

        if(!element)
            return;
        element.style.backgroundPositionY =(-cXpos)+'.0px';

        console.log( element.style.backgroundSize+"   "+element.style.backgroundPositionX)
        helperFunctions.animateBackgroundTimeout=setTimeout(continueAnimation, SECONDS_BETWEEN_FRAMES*1000);


    }

    function stopAnimation(){//stops animation
        clearTimeout(cPreloaderTimeout);
        helperFunctions.animateBackgroundTimeout=null;
    }

    function imageLoader(s, fun)//Pre-loads the sprites image
    {
        clearTimeout(cImageTimeout);
        cImageTimeout=0;
        var genImage = new Image();
        genImage.onload=function (){cImageTimeout=setTimeout(fun, 0)};
        genImage.src=s;
    }

    //The following code starts the animation
    new imageLoader(cImageSrc, startAnimation);



}

