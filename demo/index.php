<!doctype html>
<html xmlns:ng="http://angularjs.org" lang="en" id="ng-app" ng-app="nb.icon.demo">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>nb-icon demo</title>

		<link rel="stylesheet" href="../src/css/nb-icon.css" />
		<link rel="stylesheet" href="../demo/css/app.css" />

		<script src="../bower_components/angular/angular.js"></script>
		<script src="../bower_components/angular-bindonce/bindonce.js"></script>
		<script src="../bower_components/lodash/lodash.js"></script>
		<script src="../bower_components/ng-stats/dist/ng-stats.js"></script>
		<script src="../bower_components/nb-lodash/dist/js/nb-lodash.js"></script>

		<script src="../dist/js/nb-icon.js"></script>
<!--
		<script src="../src/js/nb-icon.js"></script>
		<script src="../src/js/nb-icon-templates.js"></script>
-->
		<script src="../demo/js/app.js"></script>
	</head>
	<body ng-controller="MainController">
		<div id="svgstore" class="visuallyhidden"><?php print(file_get_contents(dirname(__FILE__) . '/svg/icon.svg')); ?></div>

		<table child-scope id="scope1">
			<thead>
				<tr>
					<th colspan="2">Normal binding</th>
				</tr>
			</thead>
			<tr>
				<td>
					<a><span nb-icon
							 data-id="0008-quill"
							 data-title="Quill"
							 data-color="black"
							 data-hover-color="blue"></span></a>
				</td>
				<td>
					Black quill turns blue on hover
				</td>
			</tr>
			<tr>
				<td>
					<a><span nb-icon
							 data-id="0016-camera"
							 data-title="Camera"
							 data-color="blue"
							 data-hover-color="black"></span></a>
				</td>
				<td>
					Blue camera turns black on hover (2x)
				</td>
			</tr>
			<tr>
				<td>
					<a><span nb-icon
							 data-id="0016-camera"
							 data-title="Camera"
							 data-hover-id="0014-image"
							 data-color="blue"
							 data-hover-color="black"></span></a>
				</td>
				<td>
					Blue camera turns to black picture on hover (3x)
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<div angular-stats
						 watch-count-root="#scope1"
						 watch-count=".watch-count"
						 on-watch-count-update="onWatchCountUpdate(watchCount)">
						Number of watches: <span class="watch-count"></span>
					</div>
				</td>
			</tr>
		</table>

		<table child-scope id="scope2">
			<thead>
				<tr>
					<th colspan="2">Normal binding with ng-repeat</th>
				</tr>
			</thead>
			<tr ng-repeat="icon in icons">
				<td>
					<span nb-icon
						  data-id="{{icon.id}}"
						  data-color="black"></span>
				</td>
				<td ng-bind="icon.id"></td>
			</tr>
			<tr>
				<td colspan="2">
					<div angular-stats
						 watch-count-root="#scope2"
						 watch-count=".watch-count"
						 on-watch-count-update="onWatchCountUpdate(watchCount)">
						Number of watches: <span class="watch-count"></span>
					</div>
				</td>
			</tr>
		</table>

		<table child-scope id="scope3">
			<thead>
				<tr>
					<th colspan="2">One-time binding</th>
				</tr>
			</thead>
			<tr>
				<td>
					<a><span nb-icon-once
							 data-id="0008-quill"
							 data-title="Quill"
							 data-color="black"
							 data-hover-color="blue"></span></a>
				</td>
				<td>
					Black quill turns blue on hover
				</td>
			</tr>
			<tr>
				<td>
					<a><span nb-icon-once
							 data-id="0016-camera"
							 data-title="Camera"
							 data-width="192"
							 data-color="blue"
							 data-hover-color="black"></span></a>
				</td>
				<td>
					Blue camera turns black on hover (2x)
				</td>
			</tr>
			<tr>
				<td>
					<a><span nb-icon-once
							 data-id="0016-camera"
							 data-hover-id="0014-image"
							 data-title="Image"
							 data-width="192"
							 data-color="blue"
							 data-hover-color="black"></span></a>
				</td>
				<td>
					Blue camera turns to black picture on hover (3x)
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<div angular-stats
						 watch-count-root="#scope3"
						 watch-count=".watch-count"
						 on-watch-count-update="onWatchCountUpdate(watchCount)">
						Number of watches: <span class="watch-count"></span>
					</div>
				</td>
			</tr>
		</table>

		<table child-scope id="scope4">
			<thead>
				<tr>
					<th colspan="2">One-time binding with ng-repeat</th>
				</tr>
			</thead>
			<tr ng-repeat="icon in ::icons">
				<td>
					<span nb-icon-once
						  ng-attr-data-id="{{::icon.id}}"
						  data-color="black"></span>
				</td>
				<td ng-bind="::icon.id"></td>
			</tr>
			<tr>
				<td colspan="2">
					<div angular-stats
						 watch-count-root="#scope4"
						 watch-count=".watch-count"
						 on-watch-count-update="onWatchCountUpdate(watchCount)">
						Number of watches: <span class="watch-count"></span>
					</div>
				</td>
			</tr>
		</table>

	</body>
</html>
