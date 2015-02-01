/**
 * AngularJS directive for scalable icons
 *
 * @author Hein Bekker <hein@netbek.co.za>
 * @copyright (c) 2015 Hein Bekker
 * @license http://www.gnu.org/licenses/agpl-3.0.txt AGPLv3
 */

(function (window, angular, undefined) {
	'use strict';

	angular
		.module('nb.icon', [
			'pasvaz.bindonce',
			'nb.modernizr',
			'nb.svg',
			'nb.icon.templates'
		])
		.provider('nbIconConfig', nbIconConfig)
		.controller('nbIconController', nbIconController)
		.directive('nbIcon', nbIconDirective)
		.directive('nbIconOnce', nbIconOnceDirective);

	function nbIconConfig () {
		var config = {
			prefix: 'icon',
			pngUrl: '', // URL of directory with PNG fallback images
			size: 128 // Width and height of SVG
		};
		return {
			set: function (values) {
				config = window.merge(true, config, values);
			},
			$get: function () {
				return config;
			}
		};
	}

	nbIconController.$inject = ['$scope', '$attrs', 'Modernizr', 'nbIconConfig'];
	function nbIconController ($scope, $attrs, Modernizr, nbIconConfig) {
		this.attrs = function attrs (scope) {
			return {
				id: $attrs.id,
				hoverId: $attrs.hoverId,
				title: $attrs.title,
				width: $attrs.width,
				height: $attrs.height,
				color: $attrs.color,
				hoverColor: $attrs.hoverColor
			};
		};

		this.update = function (options) {
			options.pngUrl = nbIconConfig.pngUrl;
			options.prefix = nbIconConfig.prefix;
			options.canInlineSvg = Modernizr.inlinesvg;

			if (!options.width) {
				options.width = nbIconConfig.size;
			}
			if (!options.height) {
				options.height = nbIconConfig.size;
			}
			if (!options.hoverId) {
				options.hoverId = options.id;
			}
			if (!options.hoverColor) {
				options.hoverColor = options.color;
			}

			$scope.icon = options;
		};
	}

	function nbIconDirective () {
		return {
			restrict: 'EA',
			replace: true,
			controller: 'nbIconController',
			templateUrl: 'templates/nb-icon.html',
			scope: {
				id: '@',
				hoverId: '@?',
				title: '@?',
				width: '@?',
				height: '@?',
				color: '@?',
				hoverColor: '@?'
			},
			link: function (scope, element, attrs, controller) {
				var watch = scope.$watch(controller.attrs, function (newValue, oldValue, scope) {
					controller.update(newValue);
				}, true);

				scope.$on('$destroy', function () {
					watch();
				});
			}
		};
	}

	/**
	 * One-time binding with no watches.
	 */
	function nbIconOnceDirective () {
		return {
			restrict: 'EA',
			replace: true,
			controller: 'nbIconController',
			templateUrl: 'templates/nb-icon-once.html',
			scope: {
				id: '@',
				hoverId: '@?',
				title: '@?',
				width: '@?',
				height: '@?',
				color: '@?',
				hoverColor: '@?'
			},
			link: function (scope, element, attrs, controller) {
				var watch = scope.$watch(controller.attrs, function (newValue, oldValue, scope) {
					controller.update(newValue);
					watch();
				}, true);

				scope.$on('$destroy', function () {
					watch();
				});
			}
		};
	}
})(window, window.angular);