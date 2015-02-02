/**
 * AngularJS icon demo
 *
 * @author Hein Bekker <hein@netbek.co.za>
 * @copyright (c) 2015 Hein Bekker
 * @license http://www.gnu.org/licenses/agpl-3.0.txt AGPLv3
 */

(function (window, angular, undefined) {
	'use strict';

	angular
		.module('nb.icon.demo', [
			'angularStats',
			'nb.icon'
		])
		.config(['nbIconConfigProvider',
			function (nbIconConfigProvider) {
				nbIconConfigProvider.set({
					prefix: 'icon',
					pngUrl: 'img/',
					size: 256
				});
			}])
		.directive('childScope', childScopeDirective)
		.controller('MainController', MainController)
		.run(runBlock);

	function childScopeDirective () {
		return {
			scope: true
		};
	}

	MainController.$inject = ['$timeout', '$scope'];
	function MainController ($timeout, $scope) {
		$timeout(function () {
			$scope.$apply(function () {
				console.log('Firing $scope.apply() from MainController');
			});
		}, 1000);
	}

	runBlock.$inject = ['Modernizr', '$window'];
	function runBlock (Modernizr, $window) {
		Modernizr.inlinesvg = false;
		angular.element($window.document.documentElement).removeClass('inlinesvg');
	}
})(window, window.angular);