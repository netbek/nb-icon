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
			colors: {}, // {Object} Colors of default and hover icons, if any. Key: color, value: hexadecimal or named value (compatible with <svg> `fill` attribute)
			prefix: 'icon', // {String}
			pngUrl: '', // {String} URL of directory with PNG fallback images
			size: 128, // {Number} Width and height of SVG
			svg: undefined // {Boolean} Override SVG feature detection (can be used for testing fallback images)
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
		var useSvg = (nbIconConfig.svg === true || (nbIconConfig.svg === undefined && flags.svg && flags.inlinesvg));

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
			var color = attrs.color;
			var defaultIcon = {
				className: 'default' + (color ? ' ' + color : ''),
				id: attrs.id,
				color: color,
				fill: getFill(color),
				width: attrs.width || nbIconConfig.size,
				height: attrs.height || nbIconConfig.size
			};

			var hoverIcon;
			if (attrs.hoverId || attrs.hoverColor) {
				var hoverColor = attrs.hoverColor || color;
				hoverIcon = {
					className: 'hover' + (hoverColor ? ' ' + hoverColor : ''),
					id: attrs.hoverId || attrs.id,
					color: hoverColor,
					fill: getFill(hoverColor),
					width: defaultIcon.width,
					height: defaultIcon.height
				};
			}

			var html;
			if (useSvg) {
				html = renderSvg(defaultIcon);
				if (hoverIcon) {
					html += renderSvg(hoverIcon);
				}
			}
			else {
				html = renderPng(defaultIcon);
				if (hoverIcon) {
					html += renderPng(hoverIcon);
				}
			}

			$element.html(html);
		};

		function getFill (color) {
			if (color && color in nbIconConfig.colors) {
				return nbIconConfig.colors[color];
			}
			return false;
		}

		function renderPng (opts) {
			return '<img class="' + opts.className + '" src="' + nbIconConfig.pngUrl + nbIconConfig.prefix + '-' + opts.id + (opts.color ? '-' + opts.color : '') + '.png" alt="" />';
		}

		function renderSvg (opts) {
			return '<svg class="' + opts.className + '"' + (opts.fill ? ' fill="' + opts.fill + '"' : '') + ' viewBox="0 0 ' + opts.width + ' ' + opts.height + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#' + nbIconConfig.prefix + '-' + opts.id + '"></use></svg>';
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
