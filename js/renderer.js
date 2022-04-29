/*****************************************************************
File Infomation:
	Purpose: To provide rendering capabilities and utilities
		for the visual map of the United States, as well
		as render the basic map of the United States.
*****************************************************************/

var rendererBuffer = new RendererBuffer();

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
 * jQuery Entry for the Canvas.
 * Begins when the document has finished loading.
 * Calls all necessary functions to initialize the map
 * of the US.
 */
$(() => {
	// Initialize canvas
	$mapCanvas = canvasSetup("mapCanvas", "mapWrapper");

	//loadSampleData();

	centerMap();

	updateMapSettings();
});

/**
 * Generates sample service centers and routes
 * that can be used to demonstrate settings,
 * the way everything looks, etc.
 */
function loadSampleData(){
	$exampleRoutes =
	`ATL,CHA, 6 ,-84.39,33.75,-85.19,35.06, -
	ABL,DAL, 3 ,-99.81,32.44,-97.00,32.80, -
	AUG,ATL, 4 ,-82.13,33.48,-84.39,33.75, -
	DAL,ABL, 4 ,-99.81,32.44,-97.00,32.80, -
	AUG,ATL, 5 ,-82.13,33.48,-84.39,33.75, -
	AUS,WAC, 9 ,-97.63,30.29,-97.18,31.47, -
	AVL,KNX, 3 ,-82.61,35.55,-84.13,35.91, -
	BHM,ATL, 8 ,-86.76,33.56,-84.39,33.75, -
	BHM,DEC, 4 ,-86.76,33.56,-86.84,34.65, -
	BHM,GAD, 2 ,-86.76,33.56,-86.08,34.00, -
	BHM,TUP, 3 ,-86.76,33.56,-88.77,34.31, -
	BMT,BTR, 2 ,-93.78,30.09,-91.05,30.37, -
	BMT,HOU, 1 ,-93.78,30.09,-95.33,29.92, 1
	BTR,JMS, 6 ,-91.05,30.37,-90.14,32.25, -
	BTR,SHR, 1 ,-91.05,30.37,-93.93,32.45, -
	BWG,LOU, 7 ,-86.42,36.93,-85.66,38.19, -
	BWG,OWN, 2 ,-86.42,36.93,-87.15,37.79, -
	CHA,KNX, 1 ,-85.19,35.06,-84.13,35.91, -
	CHA,NAS, 2 ,-85.19,35.06,-86.72,36.11, -
	CHI,MWK, 5 ,-87.75,41.76,-87.93,42.93, -
	CHR,CLM, 2 ,-80.07,32.94,-81.08,33.91, -
	CIN,CHI, 1 ,-84.64,39.03,-87.75,41.76, -
	CIN,LOU, 1 ,-84.64,39.03,-85.66,38.19, 1
	CKV,NAS, 6 ,-85.49,36.13,-86.72,36.11, -
	CLM,AUG, 1 ,-81.08,33.91,-82.13,33.48, -
	CLM,CLT, 7 ,-81.08,33.91,-80.97,35.13, -
	CLT,GRN, 3 ,-80.97,35.13,-82.13,34.88, -
	COR,LEX, 4 ,-84.07,37.11,-84.52,38.09, -
	CRP,SAT, 1 ,-97.46,27.79,-98.42,29.46, -
	DAL,LRK, 5 ,-97.00,32.80,-92.15,34.74, -
	DAR,CLM, 1 ,-79.79,34.24,-81.08,33.91, -
	DAR,CLT, 2 ,-79.79,34.24,-80.97,35.13, -
	DEC,NAS, 6 ,-86.84,34.65,-86.72,36.11, -
	DOT,MON, 1 ,-85.46,31.28,-86.12,32.37, -
	DOT,OPK, 2 ,-85.46,31.28,-85.36,32.67, -
	ENC,RAL, 2 ,-77.34,35.64,-78.83,35.84, -
	FMY,TAM, 7 ,-81.81,26.64,-82.38,28.00, -
	FTS,LRK, 2 ,-94.39,35.33,-92.15,34.74, -
	FTV,CLT, 2 ,-78.89,35.00,-80.97,35.13, -
	FTV,RAL, 1 ,-78.89,35.00,-78.83,35.84, -
	GAD,CHA, 2 ,-86.08,34.00,-85.19,35.06, -
	GBO,CLT, 8 ,-79.99,36.11,-80.97,35.13, -
	GBO,HKY, 3 ,-79.99,36.11,-81.24,35.69, -
	GRN,ATL, 2 ,-82.13,34.88,-84.39,33.75, -
	HAR,SAT, 1 ,-97.83,26.17,-98.42,29.46, -
	HKY,AVL, 1 ,-81.24,35.69,-82.61,35.55, -
	HOU,BMT, 1 ,-95.33,29.92,-93.78,30.09, 1
	HOU,DAL, 3 ,-95.33,29.92,-97.00,32.80, -
	HOU,SAT, 1 ,-95.33,29.92,-98.42,29.46, -
	HOU,SHR, 1 ,-95.33,29.92,-93.93,32.45, -
	JAX,SAV, 9 ,-81.74,30.33,-81.22,32.11, -
	JAX,TIF, 5 ,-81.74,30.33,-83.51,31.42, -
	JKN,MAY, 1 ,-88.89,35.67,-88.67,36.82, -
	JKN,MFS, 1 ,-88.89,35.67,-89.92,35.03, 3
	JKN,NAS, 1 ,-88.89,35.67,-86.72,36.11, 2
	JMS,MER, 3 ,-90.14,32.25,-88.73,32.35, -
	JMS,MFS, 10 ,-90.14,32.25,-89.92,35.03, -
	KNX,CKV, 5 ,-84.13,35.91,-85.49,36.13, -
	KNX,COR, 4 ,-84.13,35.91,-84.07,37.11, -
	LEX,CIN, 1 ,-84.52,38.09,-84.64,39.03, -
	LEX,LOU, 2 ,-84.52,38.09,-85.66,38.19, -
	LOU,CHI, 5 ,-85.66,38.19,-87.75,41.76, -
	LOU,CIN, 1 ,-85.66,38.19,-84.64,39.03, 1
	LRK,MFS, 10 ,-92.15,34.74,-89.92,35.03, -
	LUB,ABL, 2 ,-101.83,33.61,-99.81,32.44, -
	MAC,ATL, 41 ,-83.73,32.80,-84.39,33.75, -
	MER,BHM, 4 ,-88.73,32.35,-86.76,33.56, -
	MFS,JKN, 3 ,-89.92,35.03,-88.89,35.67, 1
	MIA,ORL, 10 ,-80.34,26.13,-81.37,28.41, -
	MOB,JMS, 1 ,-88.13,30.57,-90.14,32.25, -
	MOB,MON, 3 ,-88.13,30.57,-86.12,32.37, -
	MOD,ABL, 1 ,-102.31,31.88,-99.81,32.44, -
	MON,BHM, 5 ,-86.12,32.37,-86.76,33.56, -
	MON,OPK, 2 ,-86.12,32.37,-85.36,32.67, -
	NAS,BWG, 9 ,-86.72,36.11,-86.42,36.93, -
	NAS,JKN, 2 ,-86.72,36.11,-88.89,35.67, 1
	NAS,MAY, 2 ,-86.72,36.11,-88.67,36.82, -
	NFK,RAL, 1 ,-76.37,36.81,-78.83,35.84, -
	NOL,BTR, 1 ,-90.28,29.99,-91.05,30.37, -
	NOL,JMS, 3 ,-90.28,29.99,-90.14,32.25, -
	OKC,DAL, 2 ,-97.42,35.39,-97.00,32.80, -
	OPK,ATL,5,-85.36,32.67,-84.39,33.75, -
	OPK,BHM,3,-85.36,32.67,-86.76,33.56, -
	ORL,JAX,10,-81.37,28.41,-81.74,30.33, -
	ORL,TIF,19,-81.37,28.41,-83.51,31.42, -
	PEO,CHI,1,-89.69,40.66,-87.75,41.76, -
	RAL,GBO,11,-78.83,35.84,-79.99,36.11, -
	RMD,GBO,1,-77.43,37.40,-79.99,36.11, -
	ROA,GBO,1,-79.97,37.32,-79.99,36.11, -
	ROA,TRI,1,-79.97,37.32,-82.52,36.44, -
	SAT,AUS,2,-98.42,29.46,-97.63,30.29, -
	SAT,LAR,1,-98.42,29.46,-99.50,27.61, -
	SAV,CLM,5,-81.22,32.11,-81.08,33.91, -
	SAV,MAC,2,-81.22,32.11,-83.73,32.80, -
	SHE,ROA,1,-78.99,38.07,-79.97,37.32, -
	SHR,LRK,3,-93.93,32.45,-92.15,34.74, -
	SHR,TYL,2,-93.93,32.45,-95.20,32.44, -
	TAL,TIF,1,-84.35,30.44,-83.51,31.42, -
	TAM,ORL,6,-82.38,28.00,-81.37,28.41, -
	TAM,TIF,18,-82.38,28.00,-83.51,31.42, -
	TIF,MAC,38,-83.51,31.42,-83.73,32.80, -
	TIF,OPK,3,-83.51,31.42,-85.36,32.67, -
	TRI,KNX,1,-82.52,36.44,-84.13,35.91, -
	TUP,MFS,4,-88.77,34.31,-89.92,35.03, -
	TYL,DAL,3,-95.20,32.44,-97.00,32.80, -
	WAC,DAL,7,-97.18,31.47,-97.00,32.80, -
	WIN,SHE,1,-78.16,39.14,-78.99,38.07, -
	WPB,ORL,5,-80.08,26.78,-81.37,28.41, -`;

	$exampleRoutesLines = $exampleRoutes.split("\n");
	for(var i = 0; i < $exampleRoutesLines.length; i++){
		$line = $exampleRoutesLines[i];
		$components = $line.split(",");

		$SVCA = $components[0].trim();
		$SVCB = $components[1].trim();
		$empties = $components[2].trim();
		$SVCA_long = $components[3].trim();
		$SVCA_lat = $components[4].trim();
		$SVCB_long = $components[5].trim();
		$SVCB_lat = $components[6].trim();

		addServiceCenter(new ServiceCenter.initialize($SVCA, "", parseFloat($SVCA_lat), parseFloat($SVCA_long)));
		addServiceCenter(new ServiceCenter.initialize($SVCB, "", parseFloat($SVCB_lat), parseFloat($SVCB_long)));
		addRoute($SVCA, $SVCB, $empties, (i%3)+1);
	}
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
	$scalingFactor = 1.1;

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

			// scale vertices (for correct translation)
			$mapGroup = $mapCanvas.getLayerGroup('map');
			for (var i = 0; i < $mapGroup.length; i++) {
				$mapGroup[i].x = $mapGroup[i].x * $scalingFactor - $xOffset;
				$mapGroup[i].y = $mapGroup[i].y * $scalingFactor - $yOffset;
			};

			// scale UI (for scalable visuals)
			$mapCanvas.setLayerGroup('map', {
				scale: $currentScale * $scalingFactor
			});

			$mapCanvas.drawLayers();
		} else {
			// zoom out

			// scale vertices (for correct translation)
			$mapGroup = $mapCanvas.getLayerGroup('map');
			for (var i = 0; i < $mapGroup.length; i++) {
				$mapGroup[i].x = $mapGroup[i].x / $scalingFactor + $xOffset;
				$mapGroup[i].y = $mapGroup[i].y / $scalingFactor + $yOffset;
			};

			// scale UI (for scalable visuals)
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
 */
function plotLine($longA, $latA, $longB, $latB, { $label = "", $color = "#00F", $arrow = mapDetails.settings.hasArrows, $arrowPadding = 5, $thickness = mapDetails.settings.pathSize, $labelColor = "#000", $labelSize = mapDetails.settings.pathLabelSize, $labelOffset = -$labelSize, $dotted = false, $labelSwap = false, $layer = 'lines', $hasBackwards = false } = {}) {

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
 * Clears all route types from memory and de-renders them.
 */
function clearRoutes(){
	rendererBuffer.scheduled_paths = [];
	rendererBuffer.actual_paths = [];
	rendererBuffer.empty_paths = [];

	updateMapSettings();
}

/**
 * Clears a route type from memory and de-renders it.
 * @param {number} $routeType ROUTE_TYPES.IDEAL, ROUTE_TYPES.ACTUAL, ROUTE_TYPES.EMPTY
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