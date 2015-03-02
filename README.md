# nb-icon

AngularJS directive for scalable icons (SVG with PNG fallback)

## To do

* Add SVG injection to fix `<use>` bug

## Notes about SVG and `<use>`

* One cannot override an existing fill color of `<svg>` or its child elements. SVGs that should be colorized should not have a `fill` attribute.
* Icons are not displayed on second-level pages, e.g. /path/to/page, if `<base>` is present https://github.com/angular/angular.js/issues/8934

## Compatibility

One-time bindings require Angular 1.3+

Tested in:

* Chrome 40
* Firefox 35
* IE 9
* Opera 12
* iOS 6 Safari

## Credits

* Demo icons by [IcoMoon](https://icomoon.io) (CC BY 4.0 or GPL)
