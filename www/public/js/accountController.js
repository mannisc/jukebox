/**
 * accountController.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 07.03.14 - 02:11
 * @copyright munichDev UG
 */


var accountController = function () {

};
accountController.loggedIn=false;
accountController.signIn = function(){
    var btn = $('#header .ui-btn.animated').removeClass("animated");

    $('#popupLogin').popup('close');
    accountController.loggedIn=true;
    uiController.styleTopButtons();

    $scope.safeApply();


    uiController.styleTopButtons();
    setTimeout(function(){
        btn.addClass("animated");
    },500)

}

accountController.register = function(){
    //TODO Register OK


    var btn = $('#header .ui-btn.animated').removeClass("animated");

    $('#popupLogin').popup('close');
    accountController.loggedIn=true;
    uiController.styleTopButtons();

    $scope.safeApply();


    uiController.styleTopButtons();
    setTimeout(function(){
        btn.addClass("animated");
    },500)

}