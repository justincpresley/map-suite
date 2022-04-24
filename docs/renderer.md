# renderer.js Documentation Contents
* Tutorials
  * [Basic Usage of the Renderer (Adding service centers and routes)](#basic-usage-of-the-renderer-adding-service-centers-and-routes)
  * [Changing the Settings](#changing-the-settings)
  * [Selecting Which Route Types Get Rendered (Ideal, Actual, Empty)](#selecting-which-route-types-get-rendered-ideal-actual-empty)
  * [Removing Service Centers or Routes](#removing-service-centers-or-routes)
  * [Centering the Map](#centering-the-map)
* [Functions and Global Variables Reference](#functions-and-global-variables-reference)
  * [Map Control Functions](#map-control-functions) (You will need these!)
  * [Helper Functions](#helper-functions)
  * [Global Constants](#global-constants)
  * [Structs](#structs)
* [Function Descriptions](#function-descriptions)

# Basic Usage of the Renderer (Adding service centers and routes)
Let's add the route NAS to CKV with 3 loads to the empty map. The latitude/longitude of NAS is 36.11, -86.72. The latitude/longitude of CKV is 36.13, -85.49. 

First, register the service centers with the renderer.
```javascript
var NAS = new ServiceCenter.initialize("NAS", "Nashville", 36.11, -86.72);
var CKV = new ServiceCenter.initialize("CKV", "Cookeville", 36.13, -85.49);
addServiceCenter(NAS);
addServiceCenter(CKV);
```
Second, register the route using the labels of the service center. 
```javascript
addRoute("NAS", "CKV", 3, MapType.Empty);
```

Lastly, render the map by calling render().
```javascript
render();
```
Functions used in this tutorial:
* [`addServiceCenter`](#addservicecenter)`(center)`
* [`addRoute`](#addroute)`(centerA, centerB, label, mapType)`
* [`render`](#render)`()`

# Changing the Settings
Settings can be changed by modifying the elements in the [MapSettings struct](#structs) and then re-rendering the map. For example, to change the size of the route labels, we change valueLabelSize.
```javascript
MapSettings.valueLabelSize = 4;
updateMapSettings();
```
Functions used in this tutorial:
* [`updateMapSettings`](#updatemapsettings)`()`
# Selecting Which Route Types Get Rendered (Ideal, Actual, Empty)
To select which route types get rendered, you have to change some values in the [MapSettings struct](#structs). For example, if you want to render only ideal and actual maps, but hide empty maps, set the MapSettings values as such:
```javascript
MapSettings.render_ideal = true;
MapSettings.render_actual = true;
MapSettings.render_empty = false;
```
Then refresh the map
```javascript
updateMapSettings();
```
Functions used in this tutorial:
* [`updateMapSettings`](#updatemapsettings)`()`

# Removing Service Centers or Routes
If you want to remove service centers one at a time, you can call removeServiceCenter passing a ServiceCenter object representation of that route. For example, if we use the variable `NAS` from [Basic Usage of the Renderer (Adding service centers and routes)](#basic-usage-of-the-renderer-adding-service-centers-and-routes), we can remove Nashville like this:
```javascript
removeServiceCenter(NAS);
```
If we want to remove all service centers:
```javascript
clearServiceCenters();
```
If we want to remove a route, we use the same parameters as we do when creating the route. 
```javascript
removeRoute("NAS", "CKV", 3, MapType.Empty);
```
If we want to remove all routes of a route type (for example, delete all empty routes):
```javascript
clearRouteType(MapType.Empty);
```
If we want to remove all route types:
```javascript
clearRoutes();
```
If we want to remove everything from the map, including all route types and service centers:
```javascript
clearMapBuffers();
```
Functions used in this tutorial:
* [`removeServiceCenter`](#removeservicecenter)`(center)`
* [`clearServiceCenters`](#clearservicecenters)`()`
* [`removeRoute`](#removeroute)`(centerA, centerB, label, mapType)`
* [`clearRouteType`](#clearroutetype)`(routeType)`
* [`clearMapBuffers`](#clearmapbuffers)`()`
* [`clearRoutes`](#clearroutes)`()`

# Centering the Map
Centering the map is very simple:
```javascript
centerMap();
```
Functions used in this tutorial:
* [`centerMap`](#centermap)`()`

# Functions and Global Variables Reference
### Map Control Functions
You will need these. These functions are useful for changing and updating the map. With these functions, the map/renderer can be treated as a black box.
* [`addRoute`](#addroute)`(centerA, centerB, label, mapType)`
  * Creates a new Route and adds it to the list of routes corresponding to the route type.
* [`addServiceCenter`](#addservicecenter)`(center)`
  * Registers a service center to the renderer so that it can be rendered later.
* [`centerMap`](#centermap)`()`
  * Centers the map on the screen.
* [`clearMapBuffers`](#clearmapbuffers)`()`
  * Clears all buffers from the renderer.
* [`clearRouteType`](#clearroutetype)`(routeType)`
  * Clears a route type from memory and de-renders it.
* [`clearRoutes`](#clearroutes)`()`
  * Clears all route types from memory and de-renders them.
* [`clearServiceCenters`](#clearservicecenters)`()`
  * Clears the Service Center buffer from the Renderer and re-renders the map.
* [`removeRoute`](#removeroute)`(centerA, centerB, label, mapType)`
  * Removes a route from the renderer's route buffers.
* [`removeServiceCenter`](#removeservicecenter)`(center)`
  * Removes a ServiceCenter from the RendererBuffer
* [`render`](#render)`()`
  * Renders (or re-renders) everything on the map. Alias for `updateMapSettings()`.
* [`updateMapSettings`](#updatemapsettings)`()`
  * Re-renders the map with new settings applied.

### Helper Functions
You probably will not need these. These functions do not need to be used to modify the map. They are merely helper functions used in the functions mentioned above.
* [`canvasSetup`](#canvassetup)`(canvasID, wrapperID)`
  * Initialize the canvas.
* [`clearMap`](#clearmap)`()`
  * Derenders the routes and service centers from the map. Note, this does not delete anything from the buffer.
* [`createScrollEventListener`](#createscrolleventlistener)`(canvasID)`
  * Listen for scroll event and act upon that event.
* [`drawUS`](#drawus)`(canvas)`
  * Renders the map of the United States (polygons in the shape of states).
* [`getMapPosition`](#getmapposition)`()`
  * Calculates and returns the current x, y, and scale of the map.
* [`getServiceCenterCoords`](#getservicecentercoords)`(symbol)`
  * Get the coordinates of a service center given a label.
* [`longLatToCoords`](#longlattocoords)`(long, lat)`
  * Converts longitude and latitude to screen coordinates.
* [`plotLine`](#plotline)`(longA, latA, longB, latB, {$label="", $color="#00F", $arrow=MapSettings.hasArrows, $arrowPadding=5, $thickness=MapSettings.lineThickness, $labelColor="#000", $labelSize=MapSettings.valueLabelSize, $labelOffset=-$labelSize*1.5})`
  * Renders a line from one long/lat pair to another, with optional label, color, arrow, arrow padding, thickness, label color, label size, and label offset.
* [`plotPoint`](#plotpoint)`(long, lat, {$label="", $color=MapSettings.nodeColor, $radius=MapSettings.nodeSize, $labelColor="#000", $labelSize=MapSettings.nodeLabelSize, $labelOffset=-$labelSize*1.5} = {})`
  * Renders a point with an optional label, color, radius, label color, label size, and label offset.
* [`plotRoute`](#plotroute)`(centerA, centerB, label)`
  * Renders a route from center A to center B using the the labels of the service centers. Both service centers must be registered with addServiceCenter.
* [`plotRoutes`](#plotroutes)`()`
  * Iterates through each map type array and renders the routes.
* [`plotServiceCenter`](#plotservicecenter)`(label)`
  * Renders a service center given the service center's symbol. The service center must be registered with addServiceCenter.
* [`plotServiceCenters`](#plotservicecenters)`()`
  * Renders all service centers that have been registered with addServiceCenter.
* [`reorderGroups`](#reordergroups)`()`
  * Changes the order that the objects on the map are rendered so that lines are below points and points are below labels.
* [`resetClickableBackground`](#resetclickablebackground)`()`
  * Moves the clickable background to the center of the screen
* [`setMapPosition`](#setmapposition)`(x, y, zoom)`
  * Translates and scales the map to (x,y) coordinates and a zoom level.

### Global Constants
* `RENDER_ORDER = ["lines", "points", "text"];`
  * A list of strings in the order that objects should be rendered.
* `RouteTypes`
  * An enum with route types.
  * Values:
    * `IDEAL: 0`
    * `ACTUAL: 1`
    * `EMPTY: 2`

### Structs
* `MapSettings`
  * `idealColor: "#00f"`
    * Color of ideal paths
  * `actualColor: "#0f0"`
    * Color of actual paths
  * `emptyColor: "#f0f"`
    * Color of empty paths
  * `hasArrows: false`
    * Whether to show arrows
  * `lineThickness: 0.5`
    * Thickness of paths
  * `valueLabelSize: 2`
    * Size of path labels
  * `nodeColor: "#F00"`
    * Color of service center nodes
  * `nodeSize: 1`
    * Size of service center nodes
  * `nodeLabelSize: 4`
    * Size of service center labels
  * `render_ideal: true`
    * Whether to render ideals
  * `render_actual: true`
    * Whether to render actuals
  * `render_empty: true`
    * Whether to render empties
* `RendererBuffer`
  * `centers: []`
    * List of service centers
  * `ideal_paths: []`
    * List of ideal paths
  * `actual_paths: []`
    * List of actual paths
  * `empty_paths: []`
    * List of empty paths

# Function Descriptions
## `addRoute`
* Description: Creates a new Route and adds it to the list of routes corresponding to the route type.
* Parameters: 
  * centerA: The label of the first service center (for example, "NAS")
  * centerB: The label of the second service center
  * label: The label of the route (such as the number of empty loads)
  * mapType: One of the three values:
    * MapType.Ideal, MapTypes.Actual, MapTypes.Empty
* Returns: None
* Usage: `addRoute(centerA, centerB, label, mapType)`
## `addServiceCenter`
* Description: Registers a ServiceCenter object with the renderer
* Parameters: 
  * center: Service center to register with the renderer
* Returns: None
* Usage: `addServiceCenter(symbol)`
## `canvasSetup`
* Description: Does all basic initialization for the canvas, such as filling a background color. It also creates the ability to globally drag the canvas.
* Parameters: 
  * canvasID: String containing the HTML ID of the canvas
  * wrapperID: The HTML id of the DIV surrounding the canvas
* Returns: 
	* mapCanvas: The jCanvas object representation of the canvas
* Usage: `canvasSetup(canvasID, wrapperID)`
## `centerMap`
* Description: Centers the map to the original location
* Parameters: None
* Returns: None
* Usage: `centerMap()`
## `clearMap`
* Description: Deletes the lines, points, and labels from the screen. Note, this does not delete anything from the buffer.
* Parameters: None
* Returns: None
* Usage: `clearMap()`
## `clearMapBuffers`
* Description: Clears all buffers from the renderer. This includes the service center buffers and all route type buffers.
* Parameters: None
* Returns: None
* Usage: `clearMapBuffers()`
## `clearRoutes`
* Description: Clears all route types from memory and de-renders them.
* Parameters: None
* Returns: None
* Usage: `clearRoutes()`
## `clearRouteType`
* Description: Clears a route type from memory and de-renders it.
* Parameters: 
  * routeType: One of the three values:
    * MapType.Ideal
    * MapType.Actual
    * MapType.Empty
* Returns: None
* Usage: `clearRouteType(routeType)`
## `createScrollEventListener`
* Description: Creates a scroll event listener and handles the event to provide scrolling capability. jCanvas does not provide a scroll event for us :(
* Parameters: 
	* canvasID: String containing the HTML ID of the canvas
	* animate: Boolean, whether or not to animate the scrolling
* Returns: None
* Usage: `createScrollEventListener(canvasID)`
## `clearServiceCenters`
* Description: Clears the Service Center buffer from the Renderer and re-renders the map.
* Parameters: None
* Returns: None
* Usage: `clearServiceCenters()`
## `drawUS`
* Description: Renders the background image of the United States from js/USMap.js
* Parameters: 
  * canvas: The jCanvas object representing the HTML canvas
* Returns: None
* Usage: `drawUS(canvas)`
## `getMapPosition`
* Description: Calculates and returns the current x, y, and scale of the map
* Parameters: None
* Returns: An array, \[x, y, scale\]
* Usage: `getMapPosition()`
## `getServiceCenterCoords`
* Description: Given the label of a service center, it looks up the service center in the global list (SERVICE_CENTERS) and returns an array containing the longitude and latitude of the service center.
* Parameters: 
	* label: The label, or id, of the service center.
* Returns: 
  * A 2-element array: [longitude, latitude].
* Usage: `getServiceCenterCoords(symbol)`
## `longLatToCoords`
* Description: Converts longitude and latitutde to coordinates suitable for plotting on an x,y canvas
* Parameters: 
	* long: the longitude to be converted
	* lat: the latitude to be converted
* Returns: 
	* [x, y] an array containing an x-value and a y-value
* Usage: `longLatToCoords(long, lat)`
## `plotLine`
* Description: Draws a line on the screen from one lat/long coordinate pair to another. Can have a label with different style parameters.
* Parameters: 
  * longA: the longitude of end A
  * latA: the latitude of end A
  * longB: the longitude of end B
  * latB: the latitude of end B
  * an optional object containing optional parameters, including:
    * $label: The label to plot beside the line, defaults to an empty string
    * $color: The color of the line, defaults to blue
    * $arrow: Whether or not to include an arrow on side B, defaults to false as specified by MapSettings
    * $arrowPadding: How far the arrow should be from the endpoint
    * $thickness: How thick the line should be drawn. Defaults to 0.5 as specified by MapSettings
    * $labelColor: The color of the label beside the line, defaults to black
    * $labelSize: The font size of the label, defaults to 2 as specified in MapSettings
    * $labelOffset: The vertical position of the label relative to the point. This defaults to -$labelSize*1.5
* Returns: None
* Usage:
  * `plotLine(longA, latA, longB, latB)`
  * `plotLine(longA, latA, longB, latB, {$color: "#00F"})`
  * `plotLine(longA, latA, longB, latB, {$label: "", $color: "#00F", $arrow: false, $arrowPadding: 5, $thickness: 0.5, $labelColor: "#000", $labelSize: 2, $labelOffset: -3})`
  * Any variables in the brackets (the optional 5th parameter) are optional.
## `plotPoint`
* Description: Plots a point with a label on the map based on latitude and longitude
* Parameters: 
  * long: the longitude to be converted
  * lat: the latitude to be converted 
  * an optional object containing optional parameters, including:
    * $label: The label to plot beside the point, defaults to an empty string
    * $color: The color of the circle, defaults to red
    * $radius: The size of the circle, defaults to 1
    * $labelColor: The color of the label beside the point, defaults to black
    * $labelSize: The font size of the label, defaults to 4
    * $labelOffset: The vertical position of the label relative to the point. This defaults to -$labelSize*1.5
* Returns: None
* Usage: 
  * `plotPoint(long, lat)`
  * `plotPoint(long, lat, {$color="#F00"})`
  * `plotPoint(long, lat, {$label="", $color="#F00", $radius=1, $labelColor="#000", $labelSize=4, $labelOffset=-$labelSize*1.5} = {})`
  * Any variables in the brackets (the optional 3rd parameter) are optional.
## `plotRoute`
* Description: Plots a route from one service center to another and shows a label alongside the line.
* Parameters: 
	* centerA: The starting service center label
	* centerB: The ending service center label
	* label: The label to draw alongside the line. The number of empty loads, for example.
  * mapType: One of the three values:
    * MapType.Ideal
    * MapType.Actual
    * MapType.Empty
* Returns: None
* Usage: `plotRoute(centerA, centerB, label, mapType)`
## `plotRoutes`
* Description: Iterates through each map type array and renders the routes
* Parameters: None
* Returns: None
* Usage: `plotRoutes()`
## `plotServiceCenter`
* Description: Plots a previously-loaded service center given a label
* Parameters: 
	* label: The label of the service center to draw. It must first be loaded with addServiceCenter
* Returns: None
* Usage: `plotServiceCenter(label)`
## `plotServiceCenters`
* Description: Iterates through all loaded service centers and plots them
* Parameters: None
* Returns: None
* Usage: `plotServiceCenters()`
## `removeRoute`
* Description: Removes a route from the renderer's route buffers
* Parameters: 
  * centerA: The label of the first service center (for example, "NAS")
  * centerB: The label of the second service center
  * label: The label of the route (such as the number of empty loads)
  * mapType: One of the three values: MapType.Ideal, MapType.Actual, MapType.Empty
* Returns: None
* Usage: `removeRoute(centerA, centerB, label, mapType)`
## `removeServiceCenter`
* Description: Removes a ServiceCenter from the RendererBuffer
* Parameters:
  * center: ServiceCenter to be removed
* Returns: None
* Usage: `removeServiceCenter(center)`
## `render`
* Description: Re-renders the map with new settings applied. Alias for `updateMapSettings()`.
* Parameters: None
* Returns: None
* Usage: `render()`
## `reorderGroups`
* Description: Whenever a new point or line is drawn to the screen, we need to rearrange the layers so that they are in the correct order on the screen.
* Parameters: None
* Returns: None
* Usage: `reorderGroups()`
## `resetClickableBackground`
* Description: Resets the position of the draggable background to x: 0, y: 0, scale: 1 so that the user can click it again.
* Parameters: None
* Returns: None
* Usage: `resetClickableBackground()`
## `setMapPosition`
* Description: Sets the map position to focus on a certain part
* Parameters: 
	* x: The x-coordinate to move the map to
	* y: The y-coordinate to move the map to
	* zoom: The zoom level to zoom to
* Returns: None
* Usage: `setMapPosition($x, $y, $zoom)`
## `updateMapSettings`
* Description: Re-renders the map with new settings applied
* Parameters: None
* Returns: None
* Usage: `updateMapSettings()`
