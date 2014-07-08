/**
* ng-context-menu - v0.1.1 - An AngularJS directive to display a context menu when a right-click event is triggered
*
* @author Ian Kennington Walter (http://ianvonwalter.com)
*/
angular
.module('ng-context-menu', [])
.factory('ContextMenuService', function() {
return {
menuElement: null
};
})
.directive('contextMenu', ['$window', '$parse', 'ContextMenuService', function($window, $parse, ContextMenuService) {
return {
restrict: 'A',
link: function($scope, element, attrs) {
var opened = false,
openTarget,
disabled = $scope.$eval(attrs.contextMenuDisabled),
win = angular.element($window),
fn = $parse(attrs.contextMenu);
element.bind('contextmenu', function(event) {
if (!disabled) {
if (ContextMenuService.menuElement !== null) {
close(ContextMenuService.menuElement);
}
ContextMenuService.menuElement = angular.element(document.getElementById(attrs.target));
openTarget = event.target;
event.preventDefault();
event.stopPropagation();
$scope.$apply(function() {
fn($scope, { $event: event });
});
}
});
// Firefox treats a right-click as a click and a contextmenu event while other browsers
// just treat it as a contextmenu event
// win.bind('click', handleWindowClickEvent);
//win.bind('contextmenu', handleWindowClickEvent);
}
};
}]);
