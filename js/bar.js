/*****************************************************************
File Infomation:
	Purpose: Provides functions for bar interation
*****************************************************************/

/*****************************************************************
vestigial 
Name: Sort Cities by English Name
Description: Sorts cities by their English name so they can
	more easily be found in the settings. Uses bubble sort.
Parameters:
	cities: The array of cities
Returns: The sorted array of cities
*****************************************************************/
function sortCities(cities)
{
	// New array so as to not modify the original
	var newArr = [];

	// Copy array
	for(var i = 0; i < cities.length; i++)
	{
		newArr.push(cities[i]);
	}

	// Sort but saucy (O(n^2))
	for(var i = 0; i < newArr.length - 1; i++)
	{
		for(var j = 0; j < newArr.length - 2; j++)
		{
			if(newArr[j].name > newArr[j + 1].name)
			{
				var temp = newArr[j];
				newArr[j] = newArr[j + 1];
				newArr[j + 1] = temp;
			}
		}
	}

	return newArr;
}

function sortTarget(paths)
{
	// New array so as to not modify the original
	var newArr = [];

	// Copy array
	for(var i = 0; i < paths.length; i++)
	{
		if (i == 0)
			newArr.push(paths[i]);
		else if (paths[i].targetSymbol != paths[i-1].targetSymbol)
			newArr.push(paths[i]);
	}

	// Sort but saucy (O(n^2))
	for(var i = 0; i < newArr.length - 1; i++)
	{
		for(var j = 0; j < newArr.length - 2; j++)
		{
			if(newArr[j].targetSymbol > newArr[j + 1].targetSymbol)
			{
				var temp = newArr[j];
				newArr[j] = newArr[j + 1];
				newArr[j + 1] = temp;
			}
		}
	}

	return newArr;
}

function clearDropdowns()
{
	$("#topbarFiltersSrc").empty();
	$("#topbarFiltersSrc").append("<option value =\"" + "NONE"+"</option>");
	$("#topbarFiltersDes").empty();
	$("#topbarFiltersDes").append("<option value =\"" + "NONE"+"</option>");
}

function populateDropdowns()
{
	var renderScheduled = mapDetails.render_scheduled;
    var renderActual = mapDetails.render_actual;
	var renderEmpty = mapDetails.render_empty;

	if (renderScheduled == true)
	{
		var sortedScheduled = sortTarget(mapDetails.scheduled_paths);
		console.log(sortedScheduled);
		for (var idx1 in sortedScheduled)
		{
			var center = sortedScheduled[idx1]
			$("#topbarFiltersSrc").append("<option value=\"" + center.sourceSymbol + "\">" + center.sourceSymbol + "</option>");
			$("#topbarFiltersDes").append("<option value=\"" + center.targetSymbol + "\">" + center.targetSymbol + "</option>");	
		}
	}
	if (renderActual == true)
	{
		var sortedActual = sortTarget(mapDetails.actual_paths);
		console.log(sortedActual);
		for (var idx2 in sortedActual)
		{
			var center = sortedActual[idx2];
			$("#topbarFiltersSrc").append("<option value=\"" + center.sourceSymbol + "\">" + center.sourceSymbol + "</option>");
			$("#topbarFiltersDes").append("<option value=\"" + center.targetSymbol + "\">" + center.targetSymbol + "</option>");
		}
	}
	if (renderEmpty == true)
	{
		var sortedEmpty = sortTarget(mapDetails.empty_paths);
		console.log(sortedEmpty)
		for (var idx3 in sortedEmpty)
		{
			var center = sortedEmpty[idx3];
			$("#topbarFiltersSrc").append("<option value=\"" + center.sourceSymbol + "\">" + center.sourceSymbol + "</option>");
			$("#topbarFiltersDes").append("<option value=\"" + center.targetSymbol + "\">" + center.targetSymbol + "</option>");
		}
	}
}

/*****************************************************************
vestigial
Name: Populate Map Settings
Description: Updates the dropdowns to let the user choose a
	service center. Requires that mapDetails.centers be
	populated.
Parameters: None
Returns: None
*****************************************************************/
function populateMapSettings()
{
	var sortedCities = sortCities(mapDetails.centers);
	for(centerIdx in sortedCities)
	{
		var center = sortedCities[centerIdx];
		$("#topbarFiltersSrc").append("<option value=\"" + center.symbol + "\">" + center.name + "</option>");
		$("#topbarFiltersDes").append("<option value=\"" + center.symbol + "\">" + center.name + "</option>");
	}
}