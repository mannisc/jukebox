/**
 * myBaseController.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 05.06.14 - 00:42
 * @copyright munichDev UG
 */


var myBaseController = function () {

};


myBaseController.usesSearchList = false;

myBaseController.index = 3;

myBaseController.inputText = "Filter MyBase";


/**
 * Something was entered in input
 */
myBaseController.onInput = function(){



}

/**
 * Input was cleared
 */
myBaseController.onClear = function(){

}


/**
 *  Show View
 */
myBaseController.showView = function(){

    exploreController.oldVideoOpactiy =     videoController.videoOpactiy;

    videoController.setVideoOpacity(exploreController.oldVideoOpactiy/2)  ;


    myBaseController.visible = true;
    viewController.showLoading(true);

    $("#explorearea").show();

    setTimeout(function () {
        if(myBaseController.visible)
            viewController.showLoading(false);

    } ,350);


}


/**
 * Hide View
 */
myBaseController.hideView = function(){
    myBaseController.visible = false;
    $("#explorearea").hide();

    if( exploreController.oldVideoOpactiy ==  videoController.videoOpactiy*2)
       videoController.setVideoOpacity(exploreController.oldVideoOpactiy)


}