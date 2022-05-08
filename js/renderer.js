/*****************************************************************
File Infomation:
	Purpose: To provide rendering capabilities and utilities
		for the visual map of the United States, as well
		as render the basic map of the United States.
*****************************************************************/

var rendererBuffer = new RendererBuffer();

/**
 * jQuery Entry for the Canvas.
 * Begins when the document has finished loading.
 * Calls all necessary functions to initialize the map
 * of the US.
 */
$(() => {
	// Initialize canvas
	$mapCanvas = canvasSetup("mapCanvas", "mapWrapper");

	centerMap();

	updateMapSettings(); // aka "render" the map
});

/**
 * Re-renders the map with new settings applied. Alias for `updateMapSettings()`.
 */
function render() {
	updateMapSettings();
}

/**
 * Re-renders the map with new settings applied
 */
function updateMapSettings() {
	// clear map, reset position
	const $mapPosition = getMapPosition();
	clearMap();
	setMapPosition(0, 0, 1);

	// apply updates, rerender
	plotServiceCenters();
	plotRoutes();

	// move the map back to where it was
	setMapPosition($mapPosition[0], $mapPosition[1], $mapPosition[2]);
}

/**
 * Resets the position of the draggable background
 * to x: 0, y: 0, scale: 1 so that the user can click it again.
 */
async function resetClickableBackground()	// This function resets the position of the rectangle
{
	$mapCanvas.setLayer('clickBackground', {
		x: 0,
		y: 0,
		scale: 1
	}).drawLayers();
};

/**
 * Does all basic initialization for the canvas,
 * such as filling a background color. It also creates
 * the ability to globally drag the canvas.
 * @param {string} canvasID HTML ID of the canvas
 * @param {string} wrapperID HTML id of the DIV surrounding the canvas
 * @returns {string} The jCanvas object representation of the canvas
 */
function canvasSetup(canvasID, wrapperID) {
	// grab and define some info
	var $mapCanvas = $("#" + canvasID); // Map HTML element
	var $mapWrapper = $("#" + wrapperID); // Map parent element (div)

	// set map width/height to the DIV width/height
	var $canvasWidth = $mapWrapper.prop('clientWidth');
	$mapCanvas.prop('width', $canvasWidth);
	var $canvasHeight = $mapWrapper.prop('clientHeight');
	$mapCanvas.prop('height', $canvasHeight);
	var $backgroundColor = '#AABBFF';

	// make coordinate origin the center of the canvas
	// rather than the top left corner
	$mapCanvas.translateCanvas({
		translateX: $canvasWidth / 2,
		translateY: $canvasHeight / 2
	});


	// Apply a stationary background color (rectangle)
	$backgroundRect = {
		fillStyle: $backgroundColor,
		x: 0,
		y: 0,
		width: $canvasWidth,
		height: $canvasHeight,
		fromCenter: true,
		layer: true
	}
	$mapCanvas.drawRect($backgroundRect);

	/*
		Create a phony background rectangle that allows
		us to click and drag from anywhere on the canvas.
		It blends with the above-created rectangle, making
		it invisible.
		It is similar to the above rect, but this one can move and is part of
		the draggable group 'map'. Other 'map' objects will move with it.
	*/
	$clickableBackground = {
		fillStyle: $backgroundColor,
		x: 0,
		y: 0,
		width: $canvasWidth,
		height: $canvasHeight,
		fromCenter: true,
		layer: true,
		name: 'clickBackground',
		groups: ['map'],
		draggable: true,
		dragGroups: ['map'],
		dragstop: resetClickableBackground,		// reset position on mouse release
		mouseout: resetClickableBackground,		// reset position when mouse leaves canvas
	};
	$mapCanvas.drawRect($clickableBackground);

	// create the scroll event listener
	createScrollEventListener(canvasID);

	// Render map of US
	drawUS($mapCanvas);

	return $mapCanvas;
}

/**
 * Creates a scroll event listener and
 * handles the event to provide scrolling capability. jCanvas
 * does not provide a scroll event for us :(
 * @param {string} canvasID HTML ID of the canvas
 */
function createScrollEventListener(canvasID) {
	var $mapCanvas = $("#" + canvasID);
	var $width = $mapCanvas.prop('width');
	var $height = $mapCanvas.prop('height');

	// 3 primary parameters for "feel" of the zoom
	$zoomDuration = 100;
	$easing = 'linear';	// either 'linear' or 'swing'
	$scalingFactor = 1.1; // zoom multiplier

	// initialize scale
	$mapCanvas.setLayerGroup('map', {
		scale: 1
	}).drawLayers();

	// scroll wheel event handler
	function zoom(key) {
		$mapCanvas.stopLayerGroup('map'); // really for the animation option
		$currentScale = $mapCanvas.getLayerGroup('map')[1].scale;

		// zoom in on cursor instead of center of screen
		$xOffset = (key.offsetX - $width / 2) * ($scalingFactor - 1)
		$yOffset = (key.offsetY - $height / 2) * ($scalingFactor - 1)

		if (key.deltaY < 0) {
			// zoom in

			// Move all elements to the correct position
			$mapGroup = $mapCanvas.getLayerGroup('map');
			for (var i = 0; i < $mapGroup.length; i++) {
				$mapGroup[i].x = $mapGroup[i].x * $scalingFactor - $xOffset;
				$mapGroup[i].y = $mapGroup[i].y * $scalingFactor - $yOffset;
			};

			// Change all elements to the correct size
			$mapCanvas.setLayerGroup('map', {
				scale: $currentScale * $scalingFactor
			});

			$mapCanvas.drawLayers();
		} else {
			// zoom out

			// Move all elements to the correct position
			$mapGroup = $mapCanvas.getLayerGroup('map');
			for (var i = 0; i < $mapGroup.length; i++) {
				$mapGroup[i].x = $mapGroup[i].x / $scalingFactor + $xOffset;
				$mapGroup[i].y = $mapGroup[i].y / $scalingFactor + $yOffset;
			};

			// Change all elements to the correct size
			$mapCanvas.setLayerGroup('map', {
				scale: $currentScale / $scalingFactor
			});

			$mapCanvas.drawLayers();
		}
		resetClickableBackground();
	};

	// insert the handler with plain javascript
	document.getElementById(canvasID).addEventListener('wheel', zoom);

}


/**
 * Renders the background image of the United States from js/USMap.js
 * @param {*} $canvas The jCanvas object representing the HTML canvas
 */
async function drawUS($canvas) {

	/*
		To get the dataset, I used map data from the R package ggplot.
		To replicate, run the following R code:
			library(ggplot2)
			states <- map_data('state')[,c('long', 'lat', 'group')]
			write.csv(states, file = "us_map.csv")

		Then I converted it to a JSON format using
		https://www.convertcsv.com/csv-to-json.htm
		such that each "group" (state) is an array of objects containing
		latitude and longitude in the order that they should be plotted.
	*/

	for (let i in $UNITED_STATES_COORDS) {
		// Line object -- the canvas stroke that represents a state
		$countryShape = {
			strokeStyle: 'white',
			strokeWidth: 1,
			fillStyle: '#ccc',
			rounded: true,
			closed: true,
			layer: true,
			groups: ['map', 'states'],
			draggable: true,
			dragGroups: ['map'],				// this group enables global dragging
			dragstop: resetClickableBackground, // reset position on mouse release
			mouseout: resetClickableBackground,	// reset position when mouse leaves canvas
		};

		// For each point in the state, add it to the $countryShape line object
		for (let j in $UNITED_STATES_COORDS[i]) {
			// translate longitude and latitude to coords
			$coords = longLatToCoords(parseFloat($UNITED_STATES_COORDS[i][j].long), parseFloat($UNITED_STATES_COORDS[i][j].lat));
			$long = $coords[0];
			$lat = $coords[1];

			$countryShape['x' + (parseInt(j) + 1)] = $long;
			$countryShape['y' + (parseInt(j) + 1)] = $lat;
		}

		// render the state shape
		$canvas.drawLine($countryShape);
	}

}

/**
 * Converts longitude and latitude to coordinates suitable for plotting
 * on an x,y canvas.
 * @param {number} $long The longitude to be converted
 * @param {number} $lat The latitude to be converted
 * @returns `[x, y]` an array containing an x-coordinate and a y-coordinate
 */
function longLatToCoords($long, $lat) {
	// set longitude to zero in the middle of the map
	$newLong = $long + 97.922211;

	// convert to 3d coords
	$z = Math.sin($lat * Math.PI / 180);
	$longRad = Math.cos($lat * Math.PI / 180);
	$y = $longRad * Math.sin($newLong * Math.PI / 180);
	$x = $longRad * Math.cos($newLong * Math.PI / 180);

	// rotate along x axis
	$temp = $y
	$y = $z
	$z = -$temp

	// convert back to spherical coords
	$vLong = Math.atan($y / $x) * 180 / Math.PI;
	$vLat = Math.atan($z / Math.sqrt($y * $y + $x * $x)) * 180 / Math.PI;

	// set virtual longitude (really latitude) to zero in the middle of the map
	$vLong -= 39.381266;

	// scale
	$yVal = -$vLong * 20;
	$xVal = -$vLat * 20;

	return [$xVal, $yVal];
}

/**
 * Registers a ServiceCenter object with the renderer
 * @param {ServiceCenter} $center Service center to register with the renderer
 */
function addServiceCenter($center) {
	var exists = false;
	for (var i = 0; i < rendererBuffer.centers.length; i++) {
		if (rendererBuffer.centers[i].symbol == $center.symbol) {
			exists = true;
		}
	}
	if (!exists) {
		rendererBuffer.centers.push($center);
	}
}

/**
 * Removes a ServiceCenter from the rendererBuffer
 * @param {ServiceCenter} $center ServiceCenter to be removed
 */
function removeServiceCenter($center) {
	for (var i = 0; i < rendererBuffer.centers.length; i++) {
		if (rendererBuffer.centers[i].symbol == $center.symbol) {
			rendererBuffer.centers.splice(i, 1);
			i--;
		}
	}
}


/**
 * Clears all buffers from the renderer. This includes the service center buffers
 * and all route type buffers.
 */
function clearMapBuffers(){
	rendererBuffer.scheduled_paths = [];
	rendererBuffer.actual_paths = [];
	rendererBuffer.empty_paths = [];
	rendererBuffer.centers = [];
	updateMapSettings();
}

/**
 * Clears the Service Center buffer from the Renderer and re-renders the map.
 */
function clearServiceCenters() {
	rendererBuffer.centers = [];
	updateMapSettings();
}

/**
 * Given the label of a service center, it looks up the service center in
 * the global list (MapDetails.center) and returns an array containing the
 * longitude and latitude of the service cetner.
 * @param {string} $symbol The label, or id, of the service center.
 * @returns A 2-element array: `[longitude, latitude]`. Returns `null` if they don't exist.
 */
function getServiceCenterCoords($symbol) {
	for (var i = 0; i < rendererBuffer.centers.length; i++) {
		if (rendererBuffer.centers[i].symbol == $symbol) {
			return [rendererBuffer.centers[i].longitude, rendererBuffer.centers[i].latitude];
		}
	}
	return null;
}

/**
 * Iterates through all loaded service centers and plots them.
 */
function plotServiceCenters() {
	for (var i = 0; i < rendererBuffer.centers.length; i++) {
		plotServiceCenter(rendererBuffer.centers[i].symbol);
	}
}

/**
 * Plots a previously-loaded service center given a label.
 * @param {string} $label The label of the service center to draw. It
 * must first be loaded with addServiceCenter.
 */
function plotServiceCenter($label) {
	$coords = getServiceCenterCoords($label);
	if ($coords != null) {
		plotPoint($coords[0], $coords[1], { $label: $label });
	}
}

/**
 * Plots a point with a label on the map based on latitude and longitude
 * @param {number} $long The longitude to be converted
 * @param {number} $lat The latitude to be converted
 * @param {object} JSONObject An optional object containing optional parameters.
 * The optional parameters are:
 * 			`$label`: The label to plot beside the point, defaults to
				an empty string.
			`$color`: The color of the circle, defaults to red as specified
				in MapSettings.
			`$radius`: The size of the circle, defaults to 1 as specified in
				MapSettings.
			`$labelColor`: The color of the label beside the point,
				defaults to black.
			`$labelSize`: The font size of the label, defaults to 4 as
				specified in MapSettings.
			`$labelOffset`: The vertical position of the label relative
				to the point. This defaults to -$labelSize*1.5.
 * @example plotPoint(long, lat);
 * @example plotPoint(long, lat, {$label: "NAS"});
 * @example plotPoint(long, lat, {$label: "NAS", $labelSize: 8});
 */
function plotPoint($long, $lat, { $label = "", $color = mapDetails.settings.nodeColor, $radius = mapDetails.settings.nodeSize, $labelColor = "#000", $labelSize = mapDetails.settings.nodeLabelSize, $labelOffset = -$labelSize * 1.5 } = {}) {

	$coords = longLatToCoords($long, $lat);

	$mapCanvas.drawArc({
		fillStyle: $color,
		x: $coords[0] * $mapCanvas.getLayerGroup('map')[1].scale,
		y: $coords[1] * $mapCanvas.getLayerGroup('map')[1].scale,
		origX: $coords[0],
		origY: $coords[1],
		radius: $radius,
		start: 0,
		end: 360,
		scale: $mapCanvas.getLayerGroup('map')[1].scale,
		inDegrees: true,

		fromCenter: true,
		layer: true,
		groups: ['map', 'points'],
		draggable: true,
		dragGroups: ['map'],				// this group enables global dragging
		dragstop: resetClickableBackground, // reset position on mouse release
	});

	// Setting for draggable labels
	$dragGroups = ['map'];   // this group enables global dragging
	if(mapDetails.settings.draggableLabels){
		$dragGroups = [];
	}

	$mapCanvas.drawText({
		fillStyle: $labelColor,
		x: $coords[0] * $mapCanvas.getLayerGroup('map')[1].scale,
		y: ($coords[1] + $labelOffset) * $mapCanvas.getLayerGroup('map')[1].scale,
		origX: $coords[0],
		origY: ($coords[1] + $labelOffset),
		scale: $mapCanvas.getLayerGroup('map')[1].scale,
		fontSize: $labelSize,
		fontFamily: 'Verdana, sans-serif',
		text: $label,

		fromCenter: true,
		layer: true,
		groups: ['map', 'text'],
		draggable: true,
		dragGroups: $dragGroups,				
		dragstop: resetClickableBackground, // reset position on mouse release
	});

	reorderGroups();
}

/**
 * Creates a new Route and adds it to the list of routes corresponding to the route type.
 * @param {string} $centerA The label of the first service center (for example, "NAS")
 * @param {string} $centerB The label of the second service center
 * @param {*} $label The label of the route (such as the number of empty loads)
 * @param {number} $mapType One of the three values: MapType.Scheduled, MapType.Actual,
 * MapType.Empty
 */
function addRoute($centerA, $centerB, $label, $mapType) {
	if ($mapType == MapType.Scheduled) {
		$alreadyExists = false;
		for (var i = 0; i < rendererBuffer.scheduled_paths.length; i++) {
			if (rendererBuffer.scheduled_paths[i].$centerA == $centerA && rendererBuffer.scheduled_paths[i].$centerB == $centerB && rendererBuffer.scheduled_paths[i].$label == $label) {
				$alreadyExists = true;
				break;
			}
		}
		if (!$alreadyExists) {
			rendererBuffer.scheduled_paths.push({ $centerA, $centerB, $label });
		}
	} else if ($mapType == MapType.Actual) {
		$alreadyExists = false;
		for (var i = 0; i < rendererBuffer.actual_paths.length; i++) {
			if (rendererBuffer.actual_paths[i].$centerA == $centerA && rendererBuffer.actual_paths[i].$centerB == $centerB && rendererBuffer.actual_paths[i].$label == $label) {
				$alreadyExists = true;
				break;
			}
		}
		if (!$alreadyExists) {
			rendererBuffer.actual_paths.push({ $centerA, $centerB, $label });
		}
	} else if ($mapType == MapType.Empty) {
		$alreadyExists = false;
		for (var i = 0; i < rendererBuffer.empty_paths.length; i++) {
			if (rendererBuffer.empty_paths[i].$centerA == $centerA && rendererBuffer.empty_paths[i].$centerB == $centerB && rendererBuffer.empty_paths[i].$label == $label) {
				$alreadyExists = true;
				break;
			}
		}
		if (!$alreadyExists) {
			rendererBuffer.empty_paths.push({ $centerA, $centerB, $label });
		}
	}
}

/**
 * Removes a route from the renderer's route buffers
 * @param {string} $centerA The label of the first service center (for example, "NAS")
 * @param {string} $centerB The label of the second service center
 * @param {*} $label The label of the route (such as the number of empty loads)
 * @param {number} $mapType One of the three values: MapType.Scheduled, MapType.Actual,
 * MapType.Empty
 */
function removeRoute($centerA, $centerB, $label, $mapType) {
	if ($mapType == MapType.Scheduled) {
		for (var i = 0; i < rendererBuffer.scheduled_paths.length; i++) {
			if (rendererBuffer.scheduled_paths[i].$centerA == $centerA && rendererBuffer.scheduled_paths[i].$centerB == $centerB && rendererBuffer.scheduled_paths[i].$label == $label) {
				rendererBuffer.scheduled_paths.splice(i, 1);
				i--;
			}
		}
	} else if ($mapType == MapType.Actual) {
		for (var i = 0; i < rendererBuffer.actual_paths.length; i++) {
			if (rendererBuffer.actual_paths[i].$centerA == $centerA && rendererBuffer.actual_paths[i].$centerB == $centerB && rendererBuffer.actual_paths[i].$label == $label) {
				rendererBuffer.actual_paths.splice(i, 1);
				i--;
			}
		}
	} else if ($mapType == MapType.Empty) {
		for (var i = 0; i < rendererBuffer.empty_paths.length; i++) {
			if (rendererBuffer.empty_paths[i].$centerA == $centerA && rendererBuffer.empty_paths[i].$centerB == $centerB && rendererBuffer.empty_paths[i].$label == $label) {
				rendererBuffer.empty_paths.splice(i, 1);
				i--;
			}
		}
	}
}


/**
 * Iterates through each map type array and renders the routes.
 */
function plotRoutes() {
	if (mapDetails.render_scheduled) {
		for (var i = 0; i < rendererBuffer.scheduled_paths.length; i++) {
			plotRoute(rendererBuffer.scheduled_paths[i].$centerA, rendererBuffer.scheduled_paths[i].$centerB, rendererBuffer.scheduled_paths[i].$label, MapType.Scheduled);
		}
	}
	if (mapDetails.render_actual) {
		for (var i = 0; i < rendererBuffer.actual_paths.length; i++) {
			plotRoute(rendererBuffer.actual_paths[i].$centerA, rendererBuffer.actual_paths[i].$centerB, rendererBuffer.actual_paths[i].$label, MapType.Actual);
		}
	}
	if (mapDetails.render_empty) {
		for (var i = 0; i < rendererBuffer.empty_paths.length; i++) {
			plotRoute(rendererBuffer.empty_paths[i].$centerA, rendererBuffer.empty_paths[i].$centerB, rendererBuffer.empty_paths[i].$label, MapType.Empty);
		}
	}
}

/**
 * Plots a route from one service center to another and shows a
 * label alongside the line.
 * @param {string} $centerA The starting service center label
 * @param {string} $centerB The ending service center label
 * @param {*} $label The label to draw alongside the line. The number
 * of empty loads, for example.
 * @param {number} $mapType One of the three values: MapType.Scheduled,
 * MapType.Actual, MapType.Empty
 */
function plotRoute($centerA, $centerB, $label, $mapType) {
	$coordsA = getServiceCenterCoords($centerA);
	$coordsB = getServiceCenterCoords($centerB);

	if ($coordsA != null && $coordsB != null) {
		if ($mapType == MapType.Scheduled) {
			// Check if there are two lines rendering over each other, going different directions
			$hasBackwards = false;
			for(var i = 0; i < rendererBuffer.scheduled_paths.length; i++){
				if(rendererBuffer.scheduled_paths[i].$centerA == $centerB && rendererBuffer.scheduled_paths[i].$centerB == $centerA){
					$hasBackwards = true;
					break;
				}
			}
			if(mapDetails.render_actual){
				for(var i = 0; i < rendererBuffer.actual_paths.length; i++){
					if(rendererBuffer.actual_paths[i].$centerA == $centerB && rendererBuffer.actual_paths[i].$centerB == $centerA){
						$hasBackwards = true;
						break;
					}
				}
			}

			// check to see if there is already an Actual path on this route. If so, make the label scheduled color so that we can tell the difference between
			// the other label, and force the line to be solid.
			$inActual = false;
			for (var i = 0; i < rendererBuffer.actual_paths.length; i++) {
				if((rendererBuffer.actual_paths[i].$centerA == $centerA && rendererBuffer.actual_paths[i].$centerB == $centerB) ||
					(rendererBuffer.actual_paths[i].$centerA == $centerB && rendererBuffer.actual_paths[i].$centerB == $centerA)) {
					$inActual = true;
					break;
				}
			}
			if($inActual && mapDetails.render_actual){
				plotLine($coordsA[0], $coordsA[1], $coordsB[0], $coordsB[1], { $label: String($label), $color: mapDetails.settings.scheduledColor, $dotted: false, $hasBackwards: $hasBackwards, $layer: 'scheduled', $labelColor: mapDetails.settings.scheduledColor });

			// Otherwise, render it like normal, according to the user settings.
			} else {
				plotLine($coordsA[0], $coordsA[1], $coordsB[0], $coordsB[1], { $label: String($label), $color: mapDetails.settings.scheduledColor, $dotted: mapDetails.settings.scheduledDotted, $hasBackwards: $hasBackwards, $layer: 'scheduled' });
			}

		} else if ($mapType == MapType.Actual) {
			// Check if there are two lines rendering over each other, going different directions
			$hasBackwards = false;
			for(var i = 0; i < rendererBuffer.actual_paths.length; i++){
				if(rendererBuffer.actual_paths[i].$centerA == $centerB && rendererBuffer.actual_paths[i].$centerB == $centerA){
					$hasBackwards = true;
					break;
				}
			}
			if(mapDetails.render_scheduled){
				for(var i = 0; i < rendererBuffer.scheduled_paths.length; i++){
					if(rendererBuffer.scheduled_paths[i].$centerA == $centerB && rendererBuffer.scheduled_paths[i].$centerB == $centerA){
						$hasBackwards = true;
						break;
					}
				}
			}

			// check to see if there is already a Scheduled path on this route. If so, make the path dashed, make the label the actual path color.
			$inScheduled = false;
			for (var i = 0; i < rendererBuffer.scheduled_paths.length; i++) {
				if((rendererBuffer.scheduled_paths[i].$centerA == $centerA && rendererBuffer.scheduled_paths[i].$centerB == $centerB) ||
					(rendererBuffer.scheduled_paths[i].$centerA == $centerB && rendererBuffer.scheduled_paths[i].$centerB == $centerA)) {
					$inScheduled = true;
					break;
				}
			}
			if($inScheduled && mapDetails.render_scheduled){
				plotLine($coordsA[0], $coordsA[1], $coordsB[0], $coordsB[1], { $label: String($label), $color: mapDetails.settings.actualColor, $dotted: true, $hasBackwards: $hasBackwards, $labelColor: mapDetails.settings.actualColor, $layer: 'actual' });

			// otherwise, just keep it the default, according to the user settings.
			} else {
				plotLine($coordsA[0], $coordsA[1], $coordsB[0], $coordsB[1], { $label: String($label), $color: mapDetails.settings.actualColor, $dotted: mapDetails.settings.actualDotted, $hasBackwards: $hasBackwards, $layer: 'actual' });
			}

		} else if ($mapType == MapType.Empty) {$hasBackwards = false;
			// Check if there are two lines rendering over each other, going different directions
			$hasBackwards = false;
			for(var i = 0; i < rendererBuffer.empty_paths.length; i++){
				if(rendererBuffer.empty_paths[i].$centerA == $centerB && rendererBuffer.empty_paths[i].$centerB == $centerA){
					$hasBackwards = true;
					break;
				}
			}

			// Empty map stays entirely according to user settings.
			plotLine($coordsA[0], $coordsA[1], $coordsB[0], $coordsB[1], { $label: String($label), $color: mapDetails.settings.emptyColor, $dotted: mapDetails.settings.emptyDotted, $layer: 'empty', $hasBackwards: $hasBackwards });
		}
	}

}


/**
 * Draws a line on the screen from one lat/long coordinate
 * pair to another. Can have a label with different style parameters.
 * @param {number} $longA The longitude of end A
 * @param {number} $latA The latitude of end A
 * @param {number} $longB The longitude of end B
 * @param {number} $latB The latitude of end B
 * @param {*} JSONObject An optional object containing optional parameters,
 * including: $label: The label to plot beside the line, defaults to
				an empty string.
			$color: The color of the line, defaults to blue.
			$arrow: Whether or not to include an arrow on side B,
				as described in MapSettings.
			$arrowPadding: How far the arrow should be from the endpoint.
			$thickness: How thick the line should be drawn. As described
				in MapSettings.
			$labelColor: The color of the label beside the line,
				defaults to black.
			$labelSize: The font size of the label as descriped in MapSettings.
			$labelOffset: The vertical position of the label relative
				to the point. This defaults to -$labelSize*1.5.
			$dotted: Whether or not to make the line dashed
			$layer: Which layer to render the line on. Options are "lines"
				for generic lines, "scheduled" for a scheduled route, "actual"
				for actual route, and "empty" for empty route.
			$hasBackwards: Whether or not two lines going in opposite directions
				are rendering on top of each other. Really, this parameter just
				changes the positions of the labels to move them closer to the
				arrows.
 */
function plotLine($longA, $latA, $longB, $latB, { $label = "", $color = "#00F", $arrow = mapDetails.settings.hasArrows, $arrowPadding = 5, $thickness = mapDetails.settings.pathSize, $labelColor = "#000", $labelSize = mapDetails.settings.pathLabelSize, $labelOffset = -$labelSize, $dotted = false, $layer = 'lines', $hasBackwards = false } = {}) {

	$coordsA = longLatToCoords($longA, $latA);
	$coordsB = longLatToCoords($longB, $latB);

	$mapScaling = $mapCanvas.getLayerGroup('map')[1].scale;

	// Dashed line vs solid line
	$strokeDash = [0];
	if($dotted){
		$strokeDash = mapDetails.settings.dashSize;
	}

	$mapCanvas.drawLine({
		strokeStyle: $color,
		strokeWidth: $thickness,
		rounded: true,
		arrowRadius: 3,
		strokeDash: $strokeDash,
		x1: $coordsA[0] * $mapScaling,
		y1: $coordsA[1] * $mapScaling,
		x2: $coordsB[0] * $mapScaling,
		y2: $coordsB[1] * $mapScaling,
		scale: $mapScaling,

		fromCenter: true,
		layer: true,
		groups: ['map', $layer],
		draggable: true,
		dragGroups: ['map'],				// this group enables global dragging
		dragstop: resetClickableBackground, // reset position on mouse release
	});

	// make an arrow, if this setting is applied.
	$ratio = (Math.sqrt(($coordsA[0] - $coordsB[0])**2 + ($coordsA[1] - $coordsB[1])**2) - $arrowPadding)
			/ Math.sqrt(($coordsA[0] - $coordsB[0])**2 + ($coordsA[1] - $coordsB[1])**2);
	if ($arrow) {
		$mapCanvas.drawLine({
			strokeStyle: $color,
			strokeWidth: $thickness,
			rounded: true,
			arrowRadius: 3,
			strokeDash: $strokeDash,
			endArrow: true,
			x1: $coordsA[0] * $mapScaling,
			y1: $coordsA[1] * $mapScaling,
			x2: ($coordsA[0] * (1 - $ratio) + $coordsB[0] * $ratio) * $mapScaling,
			y2: ($coordsA[1] * (1 - $ratio) + $coordsB[1] * $ratio) * $mapScaling,
			scale: $mapScaling,

			fromCenter: true,
			layer: true,
			groups: ['map', $layer],
			draggable: true,
			dragGroups: ['map'],				// this group enables global dragging
			dragstop: resetClickableBackground, // reset position on mouse release
		});
	}

	// Make sure the labels render beside the lines, not on them in any situation
	$yRatio = 1;
	$xRatio = 0;
	if ($coordsB[1] - $coordsA[1] != 0) {
		$slope = -($coordsB[0] - $coordsA[0]) / ($coordsB[1] - $coordsA[1]);
		$xRatio = Math.sqrt(1 / ($slope * $slope + 1));
		$yRatio = $xRatio * $slope;
		if (-$yRatio > $yRatio) {
			$xRatio = -$xRatio;
			$yRatio = -$yRatio;
		}
	}

	// Raw coordinates to render to
	$xCoord = ($coordsA[0] + $coordsB[0]) / 2;
	$yCoord = ($coordsA[1] + $coordsB[1]) / 2;

	// $hasBackwards should be true when there are two paths crossing each other. (Center A -> Center B, and Center B to Center A)
	// If this is the case, render the labels beside the arrows rather than in the center.
	if($hasBackwards){
		$ratio = (Math.sqrt(($coordsA[0] - $coordsB[0])**2 + ($coordsA[1] - $coordsB[1])**2) - $arrowPadding * 2)
			/ Math.sqrt(($coordsA[0] - $coordsB[0])**2 + ($coordsA[1] - $coordsB[1])**2);
		$xCoord = ($coordsA[0] * (1 - $ratio) + $coordsB[0] * $ratio);
		$yCoord = ($coordsA[1] * (1 - $ratio) + $coordsB[1] * $ratio);
	}

	// Setting for draggable labels
	$dragGroups = ['map'];  // this group enables global dragging
	if(mapDetails.settings.draggableLabels){
		$dragGroups = [];
	}

	$mapCanvas.drawText({
		fillStyle: $labelColor,
		x: ($xCoord + $xRatio * $labelOffset) * $mapScaling,
		y: ($yCoord + $yRatio * $labelOffset) * $mapScaling,
		origX: ($xCoord + $xRatio * $labelOffset),
		origY: ($yCoord + $yRatio * $labelOffset),
		scale: $mapScaling,
		fontSize: $labelSize,
		fontFamily: 'Verdana, sans-serif',
		text: $label,

		fromCenter: true,
		layer: true,
		groups: ['map', 'text'],
		draggable: true,
		dragGroups: $dragGroups,				
		dragstop: resetClickableBackground, // reset position on mouse release
	});

	reorderGroups();

}

/**
 * De-registers all routes from the renderer.
 */
function clearRoutes(){
	rendererBuffer.scheduled_paths = [];
	rendererBuffer.actual_paths = [];
	rendererBuffer.empty_paths = [];

	updateMapSettings();
}

/**
 * De-registers a specific route type from the renderer.
 * @param {number} $routeType MapType.Ideal, MapType.Actual, MapType.Empty
 */
function clearRouteType($routeType) {
	if ($routeType == MapType.Scheduled) {
		rendererBuffer.scheduled_paths = [];
	} else if ($routeType == MapType.Actual) {
		rendererBuffer.actual_paths = [];
	} else if ($routeType == MapType.Empty) {
		rendererBuffer.empty_paths = [];
	}

	updateMapSettings();
}

/**
 * Whenever a new point or line is drawn to the screen,
 * we need to rearrange the layers so that they are in the correct
 * order on the screen.
 */
function reorderGroups() {
	$positionalIndex = $mapCanvas.getLayerGroup('map').length;
	for (var i = 0; i < RENDER_ORDER.length; i++) {
		$groupName = RENDER_ORDER[i];
		try {
			$positionalIndex -= $mapCanvas.getLayerGroup($groupName).length;
		} catch (err) { };
	}

	for (var i = RENDER_ORDER.length - 1; i >= 0; i--) {
		$groupName = RENDER_ORDER[i];
		try {
			$group = $mapCanvas.getLayerGroup($groupName);
			for (var j = 0; j < $group.length; j++) {
				$layer = $group[j];
				$mapCanvas.moveLayer($layer, $positionalIndex);
			}
		} catch (err) { }
	}
}

/**
 * Deletes the lines, points, and labels from the screen.
 */
function clearMap() {
	for (var i = 0; i < RENDER_ORDER.length; i++) {
		$mapCanvas.removeLayerGroup(RENDER_ORDER[i]);
	}
}

/**
 * Centers the map to the original location
 */
function centerMap() {
	setMapPosition(120, 100, 2);
}

/**
 * Calculates and returns the current x, y, and scale
 * of the map
 * @returns An array, [x, y, scale]
 */
function getMapPosition() {
	$mapGroup = $mapCanvas.getLayerGroup('map');

	return [-$mapGroup[1].x / $mapGroup[1].scale, -$mapGroup[1].y / $mapGroup[1].scale, $mapGroup[1].scale];
}

/**
 * Sets the map position to focus on a certain part
 * @param {number} $x The x-coordinate to move the map to
 * @param {number} $y The y-coordinate to move the map to
 * @param {number} $zoom The zoom level to zoom to
 */
function setMapPosition($x, $y, $zoom) {
	$x = -$x;
	$y = -$y;
	$mapGroup = $mapCanvas.getLayerGroup('map');
	for (var i = 0; i < $mapGroup.length; i++) {
		if ('origX' in $mapGroup[i]) {
			$mapGroup[i].x = ($mapGroup[i].origX + $x) * $zoom;
			$mapGroup[i].y = ($mapGroup[i].origY + $y) * $zoom;
		} else {
			$mapGroup[i].x = $x * $zoom;
			$mapGroup[i].y = $y * $zoom;
		}
		$mapGroup[i].scale = $zoom;
	};
	$mapCanvas.drawLayers();
}

/**
 * Finds the length between two service centers.
 * @param {string} $centerA Label of the first service center
 * @param {string} $centerB Label of the second service center
 * @returns The length between the two service centers. Null if 
 * one of the service centers doesn't exist.
 */
function getPathLength($centerA, $centerB){
	$longLatA = getServiceCenterCoords($centerA);
	$longLatB = getServiceCenterCoords($centerB);

	if($longLatA != null && $longLatB != null){
		$coordsA = longLatToCoords($longLatA[0], $longLatA[1]);
		$coordsB = longLatToCoords($longLatB[0], $longLatB[1]);

		$length = Math.sqrt(($coordsB[0] - $coordsA[0])**2 + ($coordsB[1] - $coordsA[1])**2);

		return $length;
	} else {
		return null;
	}
}