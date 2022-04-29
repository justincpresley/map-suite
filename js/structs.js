/*****************************************************************
File Infomation:
	Purpose: Define valuable objects that will be used by all
	modules. This reduces the amount of tedious collaboration
	within our team.
*****************************************************************/

class ServiceCenter
{
	constructor(symbol, name, latitude, longitude)
	{
		this.symbol = symbol;
		this.name = name;
		this.latitude = latitude;
		this.longitude = longitude;
	}
};

class MapType
{
	static Undefined = 0;
	static Scheduled = 1;
	static Actual = 2;
	static Empty = 3;

	static fromString(mapstr)
	{
		switch(mapstr)
		{
			case "empty":
				return MapType.Empty;
			case "scheduled":
				return MapType.Scheduled;
			case "actual":
				return MapType.Actual;
			default:
				return MapType.Undefined;
		}
	}
};

class Path
{
	constructor(source, target)
	{
		this.sourceSymbol = source;
		this.targetSymbol = target;
	}
};

class EmptyPath extends Path
{
	constructor(source, target, value)
	{
		super(source, target);

		this.value = value;
	}
}

class ScheduledPath extends Path
{
	constructor(date, source, target, route, value)
	{
		super(source, target);

		this.date = date;
		this.route = route;
		this.value = value;
	}
}

class ActualPath extends Path
{
	constructor(date, source, target, route, value)
	{
		super(source, target);

		this.date = date;
		this.route = route;
		this.value = value;
	}
}

class PathConflict
{
	constructor(scheduled, actual)
	{
		this.scheduled = scheduled;
		this.actual = actual;
	}
};

class MapSettings
{
	constructor()
	{
		this.scheduledColor = MapSettings.defaults.scheduledColor;
		this.scheduledDotted = MapSettings.defaults.scheduledDotted;
		this.actualColor = MapSettings.defaults.actualColor;
		this.actualDotted = MapSettings.defaults.actualDotted;
		this.emptyColor = MapSettings.defaults.emptyColor;
		this.emptyDotted = MapSettings.defaults.emptyDotted;

		this.pathSize = MapSettings.defaults.pathSize;
		this.pathLabelSize = MapSettings.defaults.pathLabelSize;

		this.nodeColor = MapSettings.defaults.nodeColor;
		this.nodeSize = MapSettings.defaults.nodeSize;
		this.nodeLabelSize = MapSettings.defaults.nodeLabelSize;

		this.plotAllNodes = MapSettings.defaults.plotAllNodes;
		this.hasArrows = MapSettings.defaults.hasArrows;

		this.dashSize = MapSettings.defaults.dashSize;

		this.draggableLabels = MapSettings.defaults.draggableLabels;
	}

	static defaults = {
		scheduledColor: "#ff0000",
		scheduledDotted: false,
		actualColor: "#0000ff",
		actualDotted: false,
		emptyColor: "#ff0000",
		emptyDotted: false,

		pathSize: 0.7,
		pathLabelSize: 5,

		nodeColor: "#000000",
		nodeSize: 1.7,
		nodeLabelSize: 6,

		plotAllNodes: false,
		hasArrows: true,
		draggableLabels: false,

		dashSize: [2,3]
	}
}

// Specifies the order in which the graphics should be rendered,
// excluding the picture of the states
const RENDER_ORDER = ["lines", "scheduled", "actual", "empty", "points", "text"];

/**
 * Arrays of objects that will be rendered by the Renderer
 * when the render() function is called.
 */
class RendererBuffer
{
	constructor()
	{
		this.centers = [];
		this.scheduled_paths = [];
		this.actual_paths = [];
		this.empty_paths = [];
	}
}

/*****************************************************************
Name: A Map Details Object
Description: This object holds all information besides forming
	US static image of what is displayed on the map.
Parameters: None
Returns: A Object containing Map Details information.
*****************************************************************/
class MapDetails
{
	constructor()
	{
		this.centers = {};
		this.scheduled_paths = [];
		this.render_scheduled = false;
		this.actual_paths = [];
		this.render_actual = false;
		this.empty_paths = [];
		this.render_empty = false;
		this.settings = new MapSettings();
		this.conflicts = [];
	}
};