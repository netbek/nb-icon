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
				_.merge(config, values);
			},
			$get: function () {
				return config;
			}
		};
	}

	var flags = {};

	// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg.js
	flags.svg = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

	// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg/inline.js
	flags.inlinesvg = (function () {
		var div = document.createElement('div');
		div.innerHTML = '<svg/>';
		return (div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
	})();

	nbIconController.$inject = ['$scope', '$element', '$attrs', 'nbIconConfig'];
	function nbIconController ($scope, $element, $attrs, nbIconConfig) {
		/*jshint validthis: true */
		$scope.prefix = nbIconConfig.prefix;

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

		this.update = function nbIconControllerUpdate (attrs) {
			var defaultIcon = {
				className: 'default',
				id: attrs.id,
				color: attrs.color,
				width: attrs.width || nbIconConfig.size,
				height: attrs.height || nbIconConfig.size
			};

			var hoverIcon = {
				className: 'hover',
				id: attrs.hoverId || attrs.id,
				color: attrs.hoverColor || attrs.color,
				width: defaultIcon.width,
				height: defaultIcon.height
			};

			if (flags.svg && flags.inlinesvg) {
				$element.html(renderSvg(defaultIcon) + renderSvg(hoverIcon));
			}
			else {
				$element.html(renderPng(defaultIcon) + renderPng(hoverIcon));
			}
		};

		function renderPng (opts) {
			return '<img class="' + opts.className + '" src="' + nbIconConfig.pngUrl + nbIconConfig.prefix + '-' + opts.id + (opts.color ? '-' + opts.color : opts.color) + '.png" alt="" />';
		}

		function renderSvg (opts) {
			return '<svg class="' + opts.className + '" viewBox="0 0 ' + opts.width + ' ' + opts.height + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#' + nbIconConfig.prefix + '-' + opts.id + '" /></svg>';
		}
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
					if (newValue && newValue.id) {
						controller.update(newValue);
					}
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
					if (newValue && newValue.id) {
						controller.update(newValue);
						deregister();
					}
				}, true);

				scope.$on('$destroy', function () {
					deregister();
				});
			}
		};
	}
})(window, window.angular);

angular.module('nb.icon.templates', ['templates/nb-icon-once.html', 'templates/nb-icon.html']);

angular.module("templates/nb-icon-once.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/nb-icon-once.html",
    "<span ng-attr-class=\"{{::(prefix + ' ' + prefix + '-' + id + (hoverId ? ' has-hover' : ''))}}\"\n" +
    "	  ng-attr-title=\"{{::title}}\"\n" +
    "	  aria-hidden=\"true\">\n" +
    "</span>\n" +
    "");
}]);

angular.module("templates/nb-icon.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/nb-icon.html",
    "<span ng-attr-class=\"{{prefix + ' ' + prefix + '-' + id + (hoverId ? ' has-hover' : '')}}\"\n" +
    "	  ng-attr-title=\"{{title}}\"\n" +
    "	  aria-hidden=\"true\">\n" +
    "</span>\n" +
    "");
}]);
