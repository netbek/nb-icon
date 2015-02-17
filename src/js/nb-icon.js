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
			'nb.lodash',
			'nb.modernizr',
			'nb.icon.templates'
		])
		.provider('nbIconConfig', nbIconConfig)
		.controller('nbIconController', nbIconController)
		.directive('nbIcon', nbIconDirective)
		.directive('nbIconOnce', nbIconOnceDirective)
		.controller('nbIconSvgController', nbIconSvgController)
		.directive('nbIconSvg', nbIconSvgDirective)
		.directive('nbIconSvgOnce', nbIconSvgOnceDirective);

	function nbIconConfig () {
		var config = {
			prefix: 'icon',
			pngUrl: '', // URL of directory with PNG fallback images
			size: 128 // Width and height of SVG
		};
		return {
			set: function (values) {
				_.merge(config, values);
			},
			$get: function () {
				return config;
			}
		};
	}

	nbIconController.$inject = ['$scope', '$attrs', 'Modernizr', 'nbIconConfig'];
	function nbIconController ($scope, $attrs, Modernizr, nbIconConfig) {
		/*jshint validthis: true */

		this.attrs = function nbIconControllerAttrs (scope) {
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

		this.update = function nbIconControllerUpdate (options) {
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
				var deregister = scope.$watch(controller.attrs, function watchNbIconDirective (newValue, oldValue, scope) {
					controller.update(newValue);
				}, true);

				scope.$on('$destroy', function () {
					deregister();
				});
			}
		};
	}

	/**
	 * One-time binding with no watchers.
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
				var deregister = scope.$watch(controller.attrs, function watchNbIconOnceDirective (newValue, oldValue, scope) {
					controller.update(newValue);
					deregister();
				}, true);

				scope.$on('$destroy', function () {
					deregister();
				});
			}
		};
	}

	nbIconSvgController.$inject = ['$element', '$attrs'];
	function nbIconSvgController ($element, $attrs) {
		/*jshint validthis: true */

		/**
		 * @param {Scope} scope
		 * @returns {Object}
		 */
		this.attrs = function nbIconSvgControllerAttrs (scope) {
			return {
				use: $attrs.use,
				viewBox: $attrs.viewBox
			};
		};

		/**
		 * Opera 12 does not render new symbol if `xlink:href` attribute of
		 * <use> is changed. Chrome 40, Firefox 35 and IE 9 do. We replace <svg>
		 * for sake of compatibility.
		 *
		 * @param {Object} options
		 */
		this.update = function nbIconSvgControllerUpdate (options) {
			var html = '<svg viewBox="' + options.viewBox + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="' + options.use + '" /></svg>';
			$element.html(html);
		};
	}

	function nbIconSvgDirective () {
		return {
			restrict: 'EA',
			transclude: true,
			scope: true,
			controller: 'nbIconSvgController',
			link: function (scope, element, attrs, controller, transclude) {
				var deregister = scope.$watch(controller.attrs, function watchNbIconSvgDirective (newValue, oldValue, scope) {
					controller.update(newValue);
				}, true);

				scope.$on('$destroy', function () {
					deregister();
				});
			}
		};
	}

	/**
	 * One-time binding with no watchers.
	 */
	function nbIconSvgOnceDirective () {
		return {
			restrict: 'EA',
			transclude: true,
			scope: true,
			controller: 'nbIconSvgController',
			link: function (scope, element, attrs, controller, transclude) {
				var deregister = scope.$watch(controller.attrs, function watchNbIconSvgDirective (newValue, oldValue, scope) {
					controller.update(newValue);
					deregister();
				}, true);

				scope.$on('$destroy', function () {
					deregister();
				});
			}
		};
	}
})(window, window.angular);