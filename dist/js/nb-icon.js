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
			'nb.modernizr',
			'nb.svg'
		])
		.provider('nbIconConfig', nbIconConfig)
		.directive('nbIcon', nbIconDirective);

	function nbIconConfig () {
		var config = {
			prefix: 'icon',
			pngUrl: '', // URL of directory with PNG fallback images
			size: 128 // Width and height of SVG
		};
		return {
			set: function (values) {
				config = extend(true, {}, config, values);
			},
			$get: function () {
				return config;
			}
		};
	}

	nbIconDirective.$inject = ['nbIconConfig', 'Modernizr', '_'];
	function nbIconDirective (nbIconConfig, Modernizr, _) {
		return {
			restrict: 'A',
			replace: true,
			template:
				'<span aria-hidden="true" ng-attr-class="{{prefix + \' \' + prefix + \'-\' + id + (hoverId ? \' has-hover\' : \'\')}}" ng-attr-title="{{title}}">\n\
					<svg class="default" ng-if="canInlineSvg" nb-svg-view-box data-width="{{width}}" data-height="{{height}}">\n\
						<use xlink:href="" nb-svg-xlink-href="{{\'#\' + prefix + \'-\' + id}}"></use>\n\
					</svg>\n\
					<svg class="hover" ng-if="canInlineSvg && hoverId" nb-svg-view-box data-width="{{width}}" data-height="{{height}}">\n\
						<use xlink:href="" nb-svg-xlink-href="{{\'#\' + prefix + \'-\' + hoverId}}"></use>\n\
					</svg>\n\
					<img ng-if="!canInlineSvg" ng-attr-src="{{pngUrl + prefix + \'-\' + id + (color ? \'-\' + color : color) + \'.png\'}}" alt="" class="fallback" />\n\
					<img ng-if="!canInlineSvg" ng-attr-src="{{pngUrl + prefix + \'-\' + id + (hoverColor ? \'-\' + hoverColor : hoverColor) + \'.png\'}}" alt="" class="fallback-hover" />\n\
				</span>',
			scope: {
				id: '@',
				hoverId: '@?',
				title: '@?',
				width: '@?',
				height: '@?',
				color: '@?',
				hoverColor: '@?'
			},
			link: function (scope, element, attrs) {
				scope.pngUrl = nbIconConfig.pngUrl;
				scope.prefix = nbIconConfig.prefix;
				scope.canInlineSvg = Modernizr.inlinesvg;

				attrs.$observe('title', function (value) {
					scope.title = angular.isDefined(value) ? value : '';
				});
				attrs.$observe('width', function (value) {
					scope.width = angular.isDefined(value) ? value : nbIconConfig.size;
				});
				attrs.$observe('height', function (value) {
					scope.height = angular.isDefined(value) ? value : nbIconConfig.size;
				});
				attrs.$observe('color', function (value) {
					scope.color = angular.isDefined(value) ? value : '';
				});
				attrs.$observe('hoverColor', function (value) {
					scope.hoverColor = angular.isDefined(value) && !_.isEmpty(value) ? value : scope.color;
				});
			}
		};
	}

	/**
	 * Checks if value is an object created by the Object constructor.
	 *
	 * @param {mixed} value
	 * @returns {Boolean}
	 */
	function isPlainObject (value) {
		return (!!value && typeof value === 'object' && value.constructor === Object
			// Not DOM node
			&& !value.nodeType
			// Not window
			&& value !== value.window);
	}

	/**
	 * Merge the contents of two or more objects together into the first object.
	 *
	 * Shallow copy: extend({}, old)
	 * Deep copy: extend(true, {}, old)
	 *
	 * Based on jQuery (MIT License, (c) 2014 jQuery Foundation, Inc. and other contributors)
	 */
	function extend () {
		var options, key, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;

			// Skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if (!isPlainObject(target) && !angular.isFunction(target)) {
			target = {};
		}

		// If only one argument is passed
		if (i === length) {
			i--;
		}

		for (; i < length; i++) {
			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {
				// Extend the base object
				for (key in options) {
					src = target[key];
					copy = options[key];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = angular.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && angular.isArray(src) ? src : [];
						}
						else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[key] = extend(deep, clone, copy);
					}
					// Don't bring in undefined values
					else if (copy !== undefined) {
						target[key] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	}
})(window, window.angular);