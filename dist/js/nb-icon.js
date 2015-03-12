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
			size: 128, // {Number} Width and height of SVG (viewBox)
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

	flags.serialize = (typeof XMLSerializer == 'function');

	// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg.js
	flags.svg = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

	// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg/inline.js
	flags.inlinesvg = (function () {
		var div = document.createElement('div');
		div.innerHTML = '<svg/>';
		return (div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
	})();

	var svgSymbols = {};
	var xmlSerializer;

	if (flags.serialize) {
		xmlSerializer = new XMLSerializer();
	}

	/**
	 * Returns the child nodes of a <symbol> as a string.
	 *
	 * Symbols are "injected" because <use xlink:href="#symbol"> does not work
	 * on second-level pages, e.g. /path/to/page, if <base> is in <head>.
	 * https://github.com/angular/angular.js/issues/8934
	 *
	 * @param {String} elmId DOM element ID
	 * @returns {Object}
	 */
	function getSvgSymbol (elmId) {
		if (elmId in svgSymbols) {
			return svgSymbols[elmId];
		}

		if (!xmlSerializer) {
			throw new Error('XMLSerializer is not instantiated.');
		}

		var viewBox;
		var inner = '';
		var elm = document.getElementById(elmId);

		// If symbol is an element node.
		if (elm && elm.nodeType === 1) {
			viewBox = elm.getAttribute('viewBox');

			_.forEach(elm.childNodes, function (node) {
				// If child node is not a text node.
				if (node.nodeType !== 3) {
					inner += xmlSerializer.serializeToString(node);
				}
			});
		}

		svgSymbols[elmId] = {
			viewBox: viewBox,
			inner: inner
		};

		return svgSymbols[elmId];
	}

	nbIconController.$inject = ['$scope', '$element', '$attrs', 'nbIconConfig'];
	function nbIconController ($scope, $element, $attrs, nbIconConfig) {
		/*jshint validthis: true */
		var useSvg = (nbIconConfig.svg === true || (nbIconConfig.svg === undefined && flags.serialize && flags.svg && flags.inlinesvg));

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

			// Use padding-bottom hack on container to preserve aspect ratio.
			// @see https://css-tricks.com/scale-svg
			var ratio = Number(defaultIcon.height / defaultIcon.width * 10000) / 100;
			$scope.style = (ratio === 100 ? '' : 'height: 0; padding: 0 0 ' + ratio + '% 0;');
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
			var symbol = getSvgSymbol(nbIconConfig.prefix + '-' + opts.id);
			var viewBox = symbol.viewBox || '0 0 ' + opts.width + ' ' + opts.height;
			return '<svg class="' + opts.className + '"' + (opts.fill ? ' fill="' + opts.fill + '"' : '') + ' viewBox="' + viewBox + '" preserveAspectRatio="xMidYMid meet" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + symbol.inner + '</svg>';
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
    "<span ng-attr-class=\"{{::(prefix + ' ' + prefix + '-' + id + (hoverId || hoverColor ? ' has-hover' : ''))}}\"\n" +
    "	  ng-attr-style=\"{{::('' + style)}}\"\n" +
    "	  ng-attr-title=\"{{::('' + title)}}\"\n" +
    "	  aria-hidden=\"true\"\n" +
    "	  draggable=\"false\"\n" +
    "	  ondragstart=\"return false;\">\n" +
    "</span>\n" +
    "");
}]);

angular.module("templates/nb-icon.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/nb-icon.html",
    "<span ng-attr-class=\"{{prefix + ' ' + prefix + '-' + id + (hoverId || hoverColor ? ' has-hover' : '')}}\"\n" +
    "	  ng-attr-style=\"{{'' + style}}\"\n" +
    "	  ng-attr-title=\"{{'' + title}}\"\n" +
    "	  aria-hidden=\"true\"\n" +
    "	  draggable=\"false\"\n" +
    "	  ondragstart=\"return false;\">\n" +
    "</span>\n" +
    "");
}]);
