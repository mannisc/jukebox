/***********************************************
 *  mainModule.js
 *
 *  Definiert Modul für die mainApp laut angular.js
 *
 *
 *  @author rival, masch
 *  @date 25.10.13
 *  @copyright munichDev UG
 *
 *
 *
 *  COMMENTS:
 *  -
 *
 *
 *
 ***********************************************
 */

/**
 * Defines NG Module mainApp
 * @type {*|ng.$compileProvider}
 */
var mainApp = angular.module('mainApp', ['ngRoute', 'ngSanitize']);





// Code


/*
 .directive('liJqMobile', function () {
 return function ($scope, element) {

 $scope.$on('$viewContentLoaded',function(){

 alert("ID:  "+element.id) ;
 }




 ); //element.parent().listview('refresh')
 }
 });


 /*
 .directive('postRender', function () {
 return {

 link: function (scope, element, attrs) {
 //  element.hide();
 // alert(attrs["id"]);
 if (attrs["id"]) {
 element = scope.getElementFromKey(attrs["id"]);
 // alert(element.status);

 if (element.status == 2) {
 // setTimeout(function(){

 //  scope.markElement(element.key, "g")},1000 );
 }
 else if (element.status == 3)
 scope.markElement(element.key, "r");
 else if (element.registered)
 scope.markElement(element.key, "er");
 //scope.redrawElement(element.key);
 }
 }
 };
 });

 .directive('liJqMobile', function() {
 var def = {
 restrict : 'A',
 terminal : true,
 transclude : true,
 link : function(scope, element, attrs) {
 alert("!!!ffffgfgfg");
 }
 };
 return def;
 })

 })*/

