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

myBaseController.index = 2;

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
    myBaseController.visible = true;
    $("#explorearea").show();

}


/**
 * Hide View
 */
myBaseController.hideView = function(){
    myBaseController.visible = false;
    $("#explorearea").hide();

}