/*****************************************************************
File Infomation: ** REFACTOR OF ROUTING.JS
	Purpose: To determine all possible service centers between
		two selected destinations and passes those items to the
		renderer.
*****************************************************************/

/*****************************************************************
Name: Single Service Center Association
Description: Gets a service center object from its symbol.
Parameters:
	symbol: The service center sybol
Returns: The service center object
*****************************************************************/
function singleServiceAssociation(symbol)
{
	return mapDetails.centers[symbol];
}

/*****************************************************************
Name: Scheduled Path Finder
Description: Gets a scheduled path object from an actual path's
	source and destination.
Parameters:
	src: The source service center
	dst: The destination service center
Returns: The scheduled route object.
*****************************************************************/
function scheduledPathFinder(src, des)
{
	for (routeIDX in mapDetails.scheduled_paths)
	{
		if (mapDetails.scheduled_paths[routeIDX].sourceSymbol == src && mapDetails.scheduled_paths[routeIDX].targetSymbol == des)
		{
			return mapDetails.scheduled_paths[routeIDX];
		}
	}
}

/*****************************************************************
Name: Filter Routes
Description: Given a list of scheduled routes, determines which
	routes do or do not conflict with the scheduled.
Parameters:
	mapObj: Routes object
	src: The source service center object
	des: The destination service center object
	sDate: The start filter date
	eDate: The end filter date
Returns: Object
	GOODPATH: The array of paths that do not conflict with the scheduled
	CONFPATH: The array of paths that conflict with the scheduled
	idlNum: The number of ideal routes
	ncfNum: The number of conflicting routes
*****************************************************************/
function filterRoutes(mapObj, src, des, sDate, eDate)
{
	var idlRet = [];	// service centers for paths that do not conflict with the scheduled route
	var cnfRet = [];	// service centers for paths that do conflict with the scheduled route
	var idlNum = 0;		// holds numbers for ideal routes
	var cnfNum = 0;		// holds numbers for conflicted routes
	if(des != "ALL")
	{
		var idealPathObj = scheduledPathFinder(src, des);
		var idealRoute = scheduledPathFinder(src, des).route;
	}
	for (var centerIdx in mapObj) //jogging through the entire passed list
	{
		if(mapObj[centerIdx].date >= sDate && mapObj[centerIdx].date <= eDate)
		{
			if(mapObj[centerIdx].sourceSymbol == src && des == "ALL")
			{
				addConflictBarText("⚠ Conflicts cannot be determined when filtering to ALL.");
				var splitRoute = mapObj[centerIdx].route.split('-'); // Breaking the route string into an array
				idlRet.push(splitRoute);
			}

			if(mapObj[centerIdx].sourceSymbol == src && mapObj[centerIdx].targetSymbol == des)
			{
				if (mapObj[centerIdx].route == idealRoute)
				{
					var splitRoute = mapObj[centerIdx].route.split('-'); // Breaking the route string into an array
					idlRet.push(splitRoute);
					if (idlNum == 0) // check if numRet is empty
					{
						idlNum = Number(mapObj[centerIdx].value);
					}
					else
					{
						idlNum += Number(mapObj[centerIdx].value);
					}
				}
				else if (mapObj[centerIdx].route != idealRoute)
				{
					mapDetails.conflicts.push({scheduled:idealPathObj, actual:mapObj[centerIdx]}); //generate the conflict to be displayed.
					var splitRoute = mapObj[centerIdx].route.split('-'); // Breaking the route string into an array
					cnfRet.push(splitRoute);
					if (cnfNum == 0) // check if numRet is empty
					{
						cnfNum = Number(mapObj[centerIdx].value);
					}
					else
					{
						cnfNum += Number(mapObj[centerIdx].value);
					}
				}
			}
		}
	}
	return {GOODPATH:idlRet, CONFPATH:cnfRet, idlNum, cnfNum};
}

/*****************************************************************
Name: Route Processing
Description: Reads files and pushed routes to the renderer
Parameters: None
Returns: None
*****************************************************************/
function routeProcessing()
{
	// Grabbing the source and destination from the top bar
	var srcSelection = $("#topbarFiltersSrc").val();
	var desSelection = $("#topbarFiltersDes").val();

	// Grabbing the dates from the top bar
	var startDate = $("#topbarFiltersDateFrom").val();
	var endDate = $("#topbarFiltersDateTo").val();

	// Grabbing what to render from structs.js
	var renderAllSvc = mapDetails.settings.plotAllNodes;
	var renderScheduled = mapDetails.render_scheduled;
	var renderActual = mapDetails.render_actual;
	var renderEmpty = mapDetails.render_empty;

	// Removing everything from the render buffers
	// -avoids overlapping paths
	clearMapBuffers();
	clearConflictBarItems();

	if (renderAllSvc == true)
	{
		for(var centerKey in mapDetails.centers) // jog through every possible service center
		{
			addServiceCenter(mapDetails.centers[centerKey]);
		}
	}

	if (renderScheduled == true)
	{
		var filteredPaths = filterRoutes(mapDetails.scheduled_paths, srcSelection, desSelection, startDate, endDate);
		var goodpathObj = filteredPaths.GOODPATH;
		for(var i = 0; i < goodpathObj.length; i++)
		{
			var pathRouteObj = goodpathObj[i];
			for(var j = 0; j < pathRouteObj.length; j++)
			{
				addServiceCenter(singleServiceAssociation(pathRouteObj[j]));
				if (j != (pathRouteObj.length - 1))
				{
					addRoute(pathRouteObj[j], pathRouteObj[j+1], "", MapType.Scheduled);
				}
			}
		}
	}
	if (renderActual == true)
	{
		var filteredPaths = filterRoutes(mapDetails.actual_paths, srcSelection, desSelection, startDate, endDate);
		var goodpathObj = filteredPaths.GOODPATH;
		for(var i = 0; i < goodpathObj.length; i++)
		{
			var pathRouteObj = goodpathObj[i];
			for(var j = 0; j < pathRouteObj.length; j++)
			{
				addServiceCenter(singleServiceAssociation(pathRouteObj[j]));
				if (j != (pathRouteObj.length - 1))
				{
					if (desSelection == "ALL")
					{
						addRoute(pathRouteObj[j], pathRouteObj[j+1], "", MapType.Actual);
					}
					else
					{
						addRoute(pathRouteObj[j], pathRouteObj[j+1], (filteredPaths.idlNum).toString(), MapType.Actual);
					}
				}
			}
		}
		var confpathObj = filteredPaths.CONFPATH;
		for(var i = 0; i < confpathObj.length; i++)
		{
			var pathRouteObj = confpathObj[i];
			for(var j = 0; j < pathRouteObj.length; j++)
			{
				addServiceCenter(singleServiceAssociation(pathRouteObj[j]));
				if (j != (pathRouteObj.length - 1))
				{
					if (desSelection == "ALL")
					{
						addRoute(pathRouteObj[j], pathRouteObj[j+1], "", MapType.Actual);
					}
					else
					{
						addRoute(pathRouteObj[j], pathRouteObj[j+1], (filteredPaths.cnfNum).toString(), MapType.Actual);
					}
				}
			}
		}
	}
	if (renderEmpty == true)
	{
		for(var edgeIdx in mapDetails.empty_paths)
		{
			var edge = mapDetails.empty_paths[edgeIdx]; // because the empty paths have no routes, we have to make them ourselves
			var origin;
			var destination;

			for(var centerKey in mapDetails.centers)
			{
				if(mapDetails.centers[centerKey].symbol == edge.sourceSymbol)
				{
					origin = mapDetails.centers[centerKey];
				}

				if(mapDetails.centers[centerKey].symbol == edge.targetSymbol)
				{
					destination = mapDetails.centers[centerKey];
				}
			}

			if(origin != undefined && desSelection != undefined)
			{
				addServiceCenter(origin);
				addServiceCenter(destination);
				addRoute(origin.symbol, destination.symbol, edge.value.toString(), MapType.Empty);
			}
		}
	}

	render();
	updateConflicts();
}