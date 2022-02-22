/*****************************************************************
File Infomation:
	Purpose: To provide rendering capabilities and utilities
		for the visual map of the United States, as well
		as render the basic map of the United States.
*****************************************************************/




/*****************************************************************
Name: jQuery Entry for the Canvas
Description: Begins when the document has finished loading.
	Calls all necessary functions to initialize the map
	of the US.
Parameters: None
Returns: None
*****************************************************************/
$(function()
{
	// Initialize canvas
	$mapCanvas = canvasSetup("mapCanvas", "mapWrapper");

	// As an example, plot Nashville and Cookeville
	plotPoint(-86.72, 36.11, {$label: "NAS"});
	plotPoint(-85.49, 36.13, {$label: "CKV"});

});


/*****************************************************************
Name: Draggable Background Position Reset
Description: Resets the position of the draggable background
	to x: 0, y: 0, scale: 1 so that the user can click it again.
Parameters: None
Returns: None
*****************************************************************/
async function resetClickableBackground()       // This function resets the position of the rectangle
{
	$mapCanvas.setLayer('clickBackground', {
		x: 0,
		y: 0,
		scale: 1
	}).drawLayers();
};

/*****************************************************************
Name: Canvas Setup
Description: Does all basic initialization for the canvas,
	such as filling a background color. It also creates
	the ability to globally drag the canvas.
Parameters: 
	canvasID: String containing the HTML ID of the canvas
	wrapperID: The HTML id of the DIV surrounding the canvas
Returns: 
	$mapCanvas: The jCanvas object representation of the canvas
*****************************************************************/
function canvasSetup(canvasID, wrapperID)
{
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
		translateX: $canvasWidth/2,
		translateY: $canvasHeight/2
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
		dragstop: resetClickableBackground, // reset position on mouse release
		mouseout: resetClickableBackground,  // reset position when mouse leaves canvas
	};
	$mapCanvas.drawRect($clickableBackground);


	// TODO: modify each vertex so that we zoom to the center of the screen,
	// 		 not the center of the map

	// create the scroll event listener
	createScrollEventListener(canvasID);
	
	// Render map of US
	drawUS($mapCanvas);

	return $mapCanvas;
}

/*****************************************************************
Name: Create Zoom Functionality
Description: (EXPERIMENTAL) creates a scroll event listener and 
	handles the event to provide scrolling capability. jCanvas
	does not provide a scroll event for us :(
Parameters: 
	canvasID: String containing the HTML ID of the canvas
	$animate: Boolean, whether or not to animate the scrolling
Returns: None
*****************************************************************/
function createScrollEventListener(canvasID){
	var $mapCanvas = $("#" + canvasID);
	var $width = $mapCanvas.prop('width');
	var $height = $mapCanvas.prop('height');

	// 3 primary parameters for "feel" of the zoom
	$zoomDuration = 100;
	$easing = 'linear';  // either 'linear' or 'swing'
	$scalingFactor = 1.1;

	// initialize scale
	$mapCanvas.setLayerGroup('map', {
		scale: 1
	}).drawLayers();

	// scroll wheel event handler
	function zoom(key){
		$mapCanvas.stopLayerGroup('map'); // really for the animation option
		$currentScale = $mapCanvas.getLayerGroup('map')[1].scale;

		// zoom in on cursor instead of center of screen
		$xOffset = (key.offsetX - $width/2)*($scalingFactor-1)
		$yOffset = (key.offsetY - $height/2)*($scalingFactor-1)

		if(key.deltaY < 0){
			// zoom in

			// scale vertices (for correct translation)
			$mapGroup = $mapCanvas.getLayerGroup('map');
			for(var i = 0; i < $mapGroup.length; i++){
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
			for(var i = 0; i < $mapGroup.length; i++){
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


/*****************************************************************
Name: Draw United States
Description: Renders the background image of the United States
	from js/USMap.js
Parameters: 
	$canvas: The jCanvas object representing the HTML canvas
Returns: None
*****************************************************************/
async function drawUS($canvas){

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

	for(let i in $UNITED_STATES_COORDS){	
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
			dragGroups: ['map'],  // this group enables global dragging
			dragstop: resetClickableBackground, // reset position on mouse release
			mouseout: resetClickableBackground,  // reset position when mouse leaves canvas
		};
		
		// For each point in the state, add it to the $countryShape line object
		for(let j in $UNITED_STATES_COORDS[i]){
			// translate longitude and latitude to coords
			$coords = longLatToCoords(parseFloat($UNITED_STATES_COORDS[i][j].long), parseFloat($UNITED_STATES_COORDS[i][j].lat));
			$long = $coords[0];
			$lat = $coords[1];

			$countryShape['x' + (parseInt(j)+1)] = $long;
			$countryShape['y' + (parseInt(j)+1)] = $lat;
		}

		// render the state shape
		$canvas.drawLine($countryShape);
	}

}


/*****************************************************************
Name: Longitude and Latitude to Coordinates
Description: Converts longitude and latitutde to coordinates 
	suitable for plotting on an x,y canvas
Parameters: 
	$long: the longitude to be converted
	$lat: the latitude to be converted
Returns: 
	[x, y] an array containing an x-value and a y-value
*****************************************************************/
function longLatToCoords($long, $lat){
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

/*****************************************************************
Name: Plot point
Description: Plots a point with a label on the map based on latitude
	and longitude
Parameters: 
	$long: the longitude to be converted
	$lat: the latitude to be converted
	an optional object containing optional parameters, including:
		{
			$label: The label to plot beside the point, defaults to
				an empty string
			$color: The color of the circle, defaults to red
			$radius: The size of the circle, defaults to 1
			$labelColor: The color of the label beside the point,
				defaults to black
			$labelSize: The font size of the label, defaults to 4
			$labelOffset: The vertical position of the label relative
				to the point. This defaults to -$labelSize*1.5
		}
Returns: None
Examples:
	Plot a simple point with default visuals:
		plotPoint(-86.781408, 36.162628);
	Plot a point that is green and has the label "NAS":
		plotPoint(-86.781408, 36.162628, {$label: "NAS", $color: "#0F0"});
*****************************************************************/
function plotPoint($long, $lat, {$label="", $color="#F00", $radius=1, $labelColor="#000", $labelSize=4, $labelOffset=-$labelSize*1.5} = {}){

	$coords = longLatToCoords($long, $lat);

	$mapCanvas.drawArc({
		fillStyle: $color,
		x: $coords[0],
		y: $coords[1],
		radius: $radius,
		start: 0,
		end: 360,
		scale: $mapCanvas.getLayerGroup('map')[1].scale,
		inDegrees: true,

		fromCenter: true,
		layer: true,
		groups: ['map', 'points'],
		draggable: true,
		dragGroups: ['map'],  // this group enables global dragging
		dragstop: resetClickableBackground, // reset position on mouse release
	});
	
	$mapCanvas.drawText({
		fillStyle: $labelColor,
		x: $coords[0],
		y: $coords[1]+$labelOffset,
		fontSize: $labelSize,
		fontFamily: 'Verdana, sans-serif',
		text: $label,
		fromCenter: true,
		layer: true,
		groups: ['map', 'points'],
		draggable: true,
		dragGroups: ['map'],  // this group enables global dragging
		dragstop: resetClickableBackground, // reset position on mouse release
	});
}