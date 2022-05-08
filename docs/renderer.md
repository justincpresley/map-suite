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
* Functional Info
  * [Blue Ocean Background](#blue-ocean-background)
  * [Dragging the Map](#dragging-the-map)
  * [Map of US Source](#map-of-us-source)
* [References](#references)

# Basic Usage of the Renderer (Adding service centers and routes)
Let's add the route NAS to CKV with 3 loads to the empty map. The latitude/longitude of NAS is 36.11, -86.72. The latitude/longitude of CKV is 36.13, -85.49. 

First, register the service centers with the renderer.
```javascript
var NAS = new ServiceCenter("NAS", "Nashville", 36.11, -86.72);
var CKV = new ServiceCenter("CKV", "Cookeville", 36.13, -85.49);
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
mapSettings.valueLabelSize = 4;
updateMapSettings();
```
Functions used in this tutorial:
* [`updateMapSettings`](#updatemapsettings)`()`
# Selecting Which Route Types Get Rendered (Ideal, Actual, Empty)
To select which route types get rendered, you have to change some values in the [MapSettings struct](#structs). For example, if you want to render only ideal and actual maps, but hide empty maps, set the MapSettings values as such:
```javascript
mapSettings.render_ideal = true;
mapSettings.render_actual = true;
mapSettings.render_empty = false;
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
  * Creates a new Route and registers it with the renderer so that it can be drawn when `render()` is called.
* [`addServiceCenter`](#addservicecenter)`(center)`
  * Registers a service center to the renderer so that it can be drawn when `render()` is called.
* [`centerMap`](#centermap)`()`
  * Centers the map on the screen.
* [`clearMapBuffers`](#clearmapbuffers)`()`
  * Clears all buffers from the renderer. It de-registers all service centers and routes.
* [`clearRouteType`](#clearroutetype)`(routeType)`
  * De-registers a specific route type from the renderer.
* [`clearRoutes`](#clearroutes)`()`
  * De-registers all routes from the renderer.
* [`clearServiceCenters`](#clearservicecenters)`()`
  * De-registers all service centers from the renderer.
* [`getPathLength`](#getpathlength)`(centerA, centerB)`
  * Calculates the Euclidean distance between two service centers.
* [`removeRoute`](#removeroute)`(centerA, centerB, label, mapType)`
  * De-registers a route from the renderer (opposite of `addRoute()`).
* [`removeServiceCenter`](#removeservicecenter)`(center)`
  * De-registers a ServiceCenter from the renderer (opposite of `addServiceCenter()`).
* [`render`](#render)`()`
  * Renders (or re-renders) everything on the map. Alias for `updateMapSettings()`.
* [`updateMapSettings`](#updatemapsettings)`()`
  * Re-renders the map with new settings applied.

### Helper Functions
You probably will not need these. These functions do not need to be used to modify the map. They are merely helper functions used by the functions mentioned above (or by each other).
* [`canvasSetup`](#canvassetup)`(canvasID, wrapperID)`
  * Initialize the canvas.
* [`clearMap`](#clearmap)`()`
  * De-renders all routes and service centers from the map on the screen. Note, this does not de-register anything from the renderer.
* [`createScrollEventListener`](#createscrolleventlistener)`(canvasID)`
  * Listen for scroll event and act upon that event.
* [`drawUS`](#drawus)`(canvas)`
  * Renders the map of the United States (polygons in the shape of states).
* [`getMapPosition`](#getmapposition)`()`
  * Calculates and returns the current x, y, and scale of the map.
* [`getServiceCenterCoords`](#getservicecentercoords)`(symbol)`
  * Get the coordinates of a service center given a label. Returns `null` if they don't exist.
* [`longLatToCoords`](#longlattocoords)`(long, lat)`
  * Converts longitude and latitude to screen coordinates.
* [`plotLine`](#plotline)`(longA, latA, longB, latB, attributeObject)`
  * Renders a line from one long/lat pair to another, with optional label, color, arrow, arrow padding, thickness, label color, label size, label offset, dashed style, layer (map type), and "hasBackwards" parameter.
* [`plotPoint`](#plotpoint)`(long, lat, attributeObject)`
  * Renders a point at a given longitude and latitude with an optional label, color, radius, label color, label size, and label offset.
* [`plotRoute`](#plotroute)`(centerA, centerB, label)`
  * Renders a route from center A to center B using the the labels of the service centers. Both service centers must be registered with `addServiceCenter`.
* [`plotRoutes`](#plotroutes)`()`
  * Renders all routes that have been registered with `addRoute`.
* [`plotServiceCenter`](#plotservicecenter)`(label)`
  * Renders a service center given the service center's symbol. The service center must be registered with `addServiceCenter`.
* [`plotServiceCenters`](#plotservicecenters)`()`
  * Renders all service centers that have been registered with `addServiceCenter`.
* [`reorderGroups`](#reordergroups)`()`
  * Changes the order that the objects on the map are rendered so that lines are below points and points are below labels.
* [`resetClickableBackground`](#resetclickablebackground)`()`
  * Moves the clickable background (a blue rectangle) to the center of the screen
* [`setMapPosition`](#setmapposition)`(x, y, zoom)`
  * Translates and scales the map to (x,y) coordinates and a zoom level.

### Global Constants
* `RENDER_ORDER = ["lines", "scheduled", "actual", "empty", "points", "text"];`
  * A list of strings in the order that objects should be rendered.

### Structs
* `MapSettings`
  * `scheduledColor: "#ff0000"`
    * Color of scheduled path
  * `scheduledDotted: false`
    * Whether to force scheduled paths to be dashed
  * `actualColor: "#0000ff"`
    * Actual path color
  * `actualDotted: false`
	* Whether or not to force actual paths to be dashed
  * `emptyColor: "#ff0000"`
    * Empty path color
  * `emptyDotted: false`
	* Whether or not to force empty paths to be dashed
  * `pathSize: 0.7`
    * Thickness of path lines
  * `pathLabelSize: 5`
    * Size of the labels next to the paths
  * `nodeColor: "#000000"`
    * Color of the service centers nodes
  * `nodeSize: 1.7`
    * Size of the service center nodes
  * `nodeLabelSize: 6`
    * Size of the labels next to the service center nodes
  * `plotAllNodes: false`
    * Whether or not to show all nodes
  * `hasArrows: true`
    * Whether the paths should have arrows on them
  * `draggableLabels: false`
    * Whether labels should be draggable
  * `dashSize: [2,3]`
    * Size of dashes and gap between dashes
* `RendererBuffer`
  * `centers: []`
    * List of service centers
  * `scheduled_paths: []`
    * List of ideal paths
  * `actual_paths: []`
    * List of actual paths
  * `empty_paths: []`
    * List of empty paths

# Function Descriptions
## `addRoute`
* Description: Creates a new Route and registers it with the renderer so that it can be drawn when `render()` is called.
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
* Description: Does all basic initialization for the canvas to prepare it for usage. This includes filling a background color, setting up the scroll-to-zoom functionality, and drawing the map of the US.
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
* Description: De-renders all routes and service centers from the map on the screen. Note, this does not de-register anything from the renderer.
* Parameters: None
* Returns: None
* Usage: `clearMap()`
## `clearMapBuffers`
* Description: Clears all buffers from the renderer. It de-registers all service centers.
* Parameters: None
* Returns: None
* Usage: `clearMapBuffers()`
## `clearRoutes`
* Description: De-registers all routes from the renderer.
* Parameters: None
* Returns: None
* Usage: `clearRoutes()`
## `clearRouteType`
* Description: De-registers a specific route type from the renderer.
* Parameters: 
  * routeType: One of the three values:
    * MapType.Ideal
    * MapType.Actual
    * MapType.Empty
* Returns: None
* Usage: `clearRouteType(routeType)`
## `createScrollEventListener`
* Description: Creates a scroll event listener and adds it to the canvas. On a scroll event, each object on the screen is resized and translated based on where the cursor is on the screen. Normally jCanvas handles mouse events for us, but this is an exception, so we must do it ourselves. 😞
* Parameters: 
	* canvasID: String containing the HTML ID of the canvas
* Returns: None
* Usage: `createScrollEventListener(canvasID)`
## `clearServiceCenters`
* Description: De-registers all service centers from the renderer.
* Parameters: None
* Returns: None
* Usage: `clearServiceCenters()`
## `drawUS`
* Description: Renders the background image of the United States based on the JSON object in js/USMap.js. 
* Parameters: 
  * canvas: The jCanvas object representing the HTML canvas
* Returns: None
* Usage: `drawUS(canvas)`
## `getMapPosition`
* Description: Calculates and returns the current x, y, and scale of the map
* Parameters: None
* Returns: An array, \[x, y, scale\]
* Usage: `getMapPosition()`
## `getPathLength`
* Description: Calculates the Euclidean distance between two service centers.
* Parameters: 
  * centerA: Label of the first service center
  * centerB: Label of the second service center
* Returns: The length between the two service centers. Null if one of the service centers doesn't exist.
* Usage: `getPathLength(centerA, centerB)`
## `getServiceCenterCoords`
* Description: Given the label of a service center, it looks up the service center in the global list (`rendererBuffer.centers`) and returns an array containing the longitude and latitude of the service center.
* Parameters: 
	* label: The label, or id, of the service center.
* Returns: 
  * A 2-element array: [longitude, latitude]. Returns `null` if they don't exist.
* Usage: `getServiceCenterCoords(symbol)`
## `longLatToCoords`
* Description: Converts longitude and latitutde to coordinates suitable for plotting on an x,y canvas. 
* Parameters: 
	* long: the longitude to be converted
	* lat: the latitude to be converted
* Returns: 
	* [x, y] an array containing an x-value and a y-value
* Usage: `longLatToCoords(long, lat)`
## `plotLine`
* Description: Draws a line on the screen from one lat/long coordinate pair to another. Can have several style parameters.
* Parameters: 
  * longA: the longitude of end A
  * latA: the latitude of end A
  * longB: the longitude of end B
  * latB: the latitude of end B
  * an optional object containing optional parameters, including:
    * $label: The label to plot beside the line, defaults to an empty string.
    * $color: The color of the line, defaults to blue.
    * $arrow: Whether or not to include an arrow on side B, defaults to mapDetails.setting.hasArrows
    * $arrowPadding: How far the arrow should be from the endpoint. Default is 5
    * $thickness: How thick the line should be drawn. Defaults to mapDetails.settings.pathSize
    * $labelColor: The color of the label beside the line, defaults to black
    * $labelSize: The font size of the label, defaults to mapDetails.settings.pathLabelSize
    * $labelOffset: The vertical position of the label relative to the point. This defaults to -$labelSize
	* $dotted: Whether or not to make the line dashed. Default is false.
	* layer: Which layer to render the line on. Options are "lines" for generic lines, "scheduled" for a scheduled path, "actual" for an actual path, and "empty" for an empty path. Default is "lines".
	* hasBackwards: Whether or not two lines going in opposite directions are rendering on top of each other. Really, this parameter just changes the positions of the labels to move them closer to the arrows. Default is false.
* Returns: None
* Usage:
  * `plotLine(longA, latA, longB, latB)`
	* A basic example, plotting a simple line with no style parameters.
  * `plotLine(longA, latA, longB, latB, {$color: "#00F"})`
	* A simple line, but with a color parameter.
  * `plotLine(longA, latA, longB, latB, {$label: "", $color: "#00F", $arrow: false, $arrowPadding: 5, $thickness: 0.5, $labelColor: "#000", $labelSize: 2, $labelOffset: -3})`
	* A more advanced example, where the line is given several style parameters.
## `plotPoint`
* Description: Plots a point with a label on the map based on latitude and longitude
* Parameters: 
  * long: the longitude to be converted
  * lat: the latitude to be converted 
  * an optional object containing optional parameters, including:
    * $label: The label to plot beside the point, defaults to an empty string
    * $color: The color of the circle, defaults to `mapDetails.settings.nodeColor`
    * $radius: The size of the circle, defaults to `mapDetails.settings.nodeSize`
    * $labelColor: The color of the label beside the point, defaults to black
    * $labelSize: The font size of the label, defaults to `mapDetails.settings.nodeLabelSize`
    * $labelOffset: The vertical position of the label relative to the point. This defaults to -$labelSize*1.5
* Returns: None
* Usage examples: 
  * `plotPoint(long, lat)`
    * Plots a simple point at long/lat
  * `plotPoint(long, lat, {$color="#F00"})`
    * Plots a simple point, but specifies a color
  * `plotPoint(long, lat, {$label="", $color="#F00", $radius=1, $labelColor="#000", $labelSize=4, $labelOffset=-$labelSize*1.5})`
    * An example using all possible options
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
* Description: Renders all routes that have been registered with `addRoute`.
* Parameters: None
* Returns: None
* Usage: `plotRoutes()`
## `plotServiceCenter`
* Description: Plots a registered service center given a label
* Parameters: 
	* label: The label of the service center to draw. It must first be loaded with `addServiceCenter`
* Returns: None
* Usage: `plotServiceCenter(label)`
## `plotServiceCenters`
* Description: Iterates through all registered service centers and plots them.
* Parameters: None
* Returns: None
* Usage: `plotServiceCenters()`
## `removeRoute`
* Description: De-registers a route from the renderer (opposite of `addRoute()`).
* Parameters: 
  * centerA: The label of the first service center (for example, "NAS")
  * centerB: The label of the second service center
  * label: The label of the route (such as the number of empty loads)
  * mapType: One of the three values: MapType.Ideal, MapType.Actual, MapType.Empty
* Returns: None
* Usage: `removeRoute(centerA, centerB, label, mapType)`
## `removeServiceCenter`
* Description: De-registers a ServiceCenter from the renderer (opposite of `addServiceCenter()`).
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
* Description: Resets the position of the draggable background (a blue rectangle) to x: 0, y: 0, scale: 1 so that the user can click it again.
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

# Blue Ocean Background
The background to the map (the blue ocean) is actually made of two separate rectangles that take up the whole canvas and are rendered on top of one another. The rectangle in the front is draggable, but its position resets to the center every time the drag event ends. The reason for this is elaborated in the next section. Since this rectangle can move, the movement reveals gaps on the edges of the canvas where you can see the default white canvas background. The purpose of the second rectangle is to cover these gaps. Therefore, the rectangle in the back needs to remain stationary. 

# Dragging the Map
Dragging the map is accomplished by giving the same drag group to every element on the screen and creating an ocean background that can also be dragged. This way, it doesn't matter where you click on the screen, you can **always** drag everything. In jCanvas, each polygon or other element types drawn to the screen can be given a few properties relating to dragging: `draggable`, `dragGroups`, and `dragstop`. All elements must have the `draggable` property set to true for this application to work, and all elements must have the `dragGroups` property (an array) set to `['map']`. With this configuration, since all elements are draggable and are in the same drag group, dragging one element drags them all. The problem is that it also drags the background, because the background is also in the 'map' drag group (otherwise, we wouldn't be able to drag on the ocean to move the map!). To fix this, the `dragstop` property is set to the `resetClickableBackground` function, which is called whenever you stop dragging something. This function places the background back to the center of the screen, ready to be dragged again. Unfortunately, if the mouse moves out of the bounds of the canvas, the drag event stops without the `dragstop` event being triggered. To fix this, we add one last property to our objects on the screen: `mouseout`. This property must also be set to `resetClickableBackground`. Hopefully this information helps you understand why all objects drawn to the screen share these four properties:
```javascript
draggable: true,
dragGroups: ['map'],
dragstop: resetClickableBackground,
mouseout: resetClickableBackgorund,
```

# Map of US Source
Here, I wanted to describe where the data for the US map came from (longitude and latitude info). The data was downloaded from the R package, ggplot using the following code:
```r
library(ggplot2)
states <- map_data('state')[,c('long', 'lat', 'group')]
write.csv(states, file = "us_map.csv")
```
Then I went to this website [https://www.convertcsv.com/csv-to-json.htm](https://www.convertcsv.com/csv-to-json.htm) to convert the data to a JSON format. I made the conversion in such a way that each "group" (state) is an array of objects containing latitude and longitude in the order that they should be plotted.

# References
jCanvas homepage: [https://projects.calebevans.me/jcanvas/](https://projects.calebevans.me/jcanvas/). <br>
jCanvas docs: [https://projects.calebevans.me/jcanvas/docs/](https://projects.calebevans.me/jcanvas/docs/)