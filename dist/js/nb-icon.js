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
angular.module('nb.icon.templates', ['templates/nb-icon-once.html', 'templates/nb-icon.html']);

angular.module("templates/nb-icon-once.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/nb-icon-once.html",
    "<span ng-attr-class=\"{{::(icon.prefix + ' ' + icon.prefix + '-' + icon.id + (icon.hoverId ? ' has-hover' : ''))}}\"\n" +
    "	  ng-attr-title=\"{{::icon.title}}\"\n" +
    "	  aria-hidden=\"true\">\n" +
    "	<svg ng-if=\"::(icon.canInlineSvg)\"\n" +
    "		 nb-svg-view-box-once\n" +
    "		 data-width=\"{{::icon.width}}\"\n" +
    "		 data-height=\"{{::icon.height}}\"\n" +
    "		 class=\"default\">\n" +
    "	<use xlink:href=\"\" nb-svg-xlink-href=\"{{::('#' + icon.prefix + '-' + icon.id)}}\"></use>\n" +
    "	</svg>\n" +
    "	<svg ng-if=\"::(icon.canInlineSvg && icon.hoverId)\"\n" +
    "		 nb-svg-view-box-once\n" +
    "		 data-width=\"{{::icon.width}}\"\n" +
    "		 data-height=\"{{::icon.height}}\"\n" +
    "		 class=\"hover\">\n" +
    "	<use xlink:href=\"\" nb-svg-xlink-href=\"{{::('#' + icon.prefix + '-' + icon.hoverId)}}\"></use>\n" +
    "	</svg>\n" +
    "	<img ng-if=\"::(!icon.canInlineSvg)\"\n" +
    "		 ng-src=\"{{::(icon.pngUrl + icon.prefix + '-' + icon.id + (icon.color ? '-' + icon.color : icon.color) + '.png')}}\"\n" +
    "		 alt=\"\"\n" +
    "		 class=\"fallback\" />\n" +
    "	<img ng-if=\"::(!icon.canInlineSvg && icon.hoverId)\"\n" +
    "		 ng-src=\"{{::(icon.pngUrl + icon.prefix + '-' + icon.hoverId + (icon.hoverColor ? '-' + icon.hoverColor : icon.hoverColor) + '.png')}}\"\n" +
    "		 alt=\"\"\n" +
    "		 class=\"fallback-hover\" />\n" +
    "</span>");
}]);

angular.module("templates/nb-icon.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/nb-icon.html",
    "<span ng-attr-class=\"{{icon.prefix + ' ' + icon.prefix + '-' + icon.id + (icon.hoverId ? ' has-hover' : '')}}\"\n" +
    "	  ng-attr-title=\"{{icon.title}}\"\n" +
    "	  aria-hidden=\"true\">\n" +
    "	<svg ng-if=\"icon.canInlineSvg\"\n" +
    "		 nb-svg-view-box\n" +
    "		 data-width=\"{{icon.width}}\"\n" +
    "		 data-height=\"{{icon.height}}\"\n" +
    "		 class=\"default\">\n" +
    "	<use xlink:href=\"\" nb-svg-xlink-href=\"{{'#' + icon.prefix + '-' + icon.id}}\"></use>\n" +
    "	</svg>\n" +
    "	<svg ng-if=\"icon.canInlineSvg && icon.hoverId\"\n" +
    "		 nb-svg-view-box\n" +
    "		 data-width=\"{{icon.width}}\"\n" +
    "		 data-height=\"{{icon.height}}\"\n" +
    "		 class=\"hover\">\n" +
    "	<use xlink:href=\"\" nb-svg-xlink-href=\"{{'#' + icon.prefix + '-' + icon.hoverId}}\"></use>\n" +
    "	</svg>\n" +
    "	<img ng-if=\"!icon.canInlineSvg\"\n" +
    "		 ng-src=\"{{icon.pngUrl + icon.prefix + '-' + icon.id + (icon.color ? '-' + icon.color : icon.color) + '.png'}}\"\n" +
    "		 alt=\"\"\n" +
    "		 class=\"fallback\" />\n" +
    "	<img ng-if=\"!icon.canInlineSvg && icon.hoverId\"\n" +
    "		 ng-src=\"{{icon.pngUrl + icon.prefix + '-' + icon.hoverId + (icon.hoverColor ? '-' + icon.hoverColor : icon.hoverColor) + '.png'}}\"\n" +
    "		 alt=\"\"\n" +
    "		 class=\"fallback-hover\" />\n" +
    "</span>");
}]);
