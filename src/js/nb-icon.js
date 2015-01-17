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
				config = angular.extend({}, config, values);
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
})(window, window.angular);