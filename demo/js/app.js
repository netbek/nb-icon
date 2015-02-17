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
					pngUrl: '../demo/img/',
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
		var ngStats = showAngularStats({
			position: 'topright'
		});
		ngStats.listeners.digestLength.log = function (digestLength) {
			console.log('Digest: ' + digestLength);
		};

		$scope.icons = [
			{
				id: '0008-quill'
			},
			{
				id: '0014-image'
			},
			{
				id: '0016-camera'
			}
		];
	}

	runBlock.$inject = ['Modernizr', '$window'];
	function runBlock (Modernizr, $window) {
//		Modernizr.inlinesvg = false;
//		angular.element($window.document.documentElement).removeClass('inlinesvg');
	}
})(window, window.angular);