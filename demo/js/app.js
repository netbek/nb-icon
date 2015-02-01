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
		.directive('demoTable', demoTableDirective)
		.controller('MainController', MainController)
		.run(runBlock);

	// http://stackoverflow.com/a/18526757
	function c (root) {
		var watchers = [];

		var f = function (element) {
			angular.forEach(['$scope', '$isolateScope'], function (scopeProperty) {
				if (element.data() && element.data().hasOwnProperty(scopeProperty)) {
					angular.forEach(element.data()[scopeProperty].$$watchers, function (watcher) {
						watchers.push(watcher);
					});
				}
			});

			angular.forEach(element.children(), function (childElement) {
				f(angular.element(childElement));
			});
		};

		f(root);

		// Remove duplicate watchers
		var watchersWithoutDuplicates = [];
		angular.forEach(watchers, function (item) {
			if (watchersWithoutDuplicates.indexOf(item) < 0) {
				watchersWithoutDuplicates.push(item);
			}
		});

		return watchersWithoutDuplicates.length;
	}

	function demoTableDirective () {
		return {
			scope: true,
			link: function (scope, element) {
				scope.countWatches = function () {
					return c(element) - 1;
				};
			}
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