/*****************************************************************
File Infomation:
	Purpose: Provides functions for bar interation
*****************************************************************/

/*****************************************************************
Name: Sort Cities by English Name
Description: Sorts cities by their English name so they can
	more easily be found in the settings. Uses bubble sort.
Parameters:
	cities: The array of cities
Returns: The sorted array of cities
*****************************************************************/
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

// Global variables for min and max date
var minDate = "NDE"
var maxDate = "NDE"

// Helper constant for 1 day in miliseconds
const day = 1000 * 60 * 60 * 24;

/*****************************************************************
Name: Fast Forward Filter Dates
Description: Moves the filter dates forward by one day. If max
	date is reached, it just shrinks the window by only fast
	forwarding the min date.
Parameters: None
Returns: None
*****************************************************************/
function filterDateFF()
{
	var startDate = Date.parse($("#topbarFiltersDateFrom").val());
	var endDate = Date.parse($("#topbarFiltersDateTo").val());

	if(endDate < Date.parse(maxDate))
	{
		startDate += day;
		endDate += day;
	}
	else if (endDate == Date.parse(maxDate) && startDate != Date.parse(maxDate))
	{
		startDate += day;
	}
	else
	{
		console.error("Can't modify date");
	}
	$("#topbarFiltersDateFrom").prop("value", new Date(startDate).toISOString().replace(/T.*/, ""));
	$("#topbarFiltersDateTo").prop("value", new Date(endDate).toISOString().replace(/T.*/, ""));

	routeProcessing();
}

/*****************************************************************
Name: Reverse Filter Dates
Description: Moves the filter dates backward by one day. If min
	date is reached, it just shrinks the window by only
	reversing the max date.
Parameters: None
Returns: None
*****************************************************************/
function filterDateRR()
{
	var startDate = Date.parse($("#topbarFiltersDateFrom").val());
	var endDate = Date.parse($("#topbarFiltersDateTo").val());

	if(startDate > Date.parse(minDate))
	{
		startDate -= day;
		endDate -= day;
	}
	else if (startDate == Date.parse(minDate) && endDate != Date.parse(minDate))
	{
		endDate -= day;
	}
	else
	{
		console.error("Can't modify date");
	}
	$("#topbarFiltersDateFrom").prop("value", new Date(startDate).toISOString().replace(/T.*/, ""));
	$("#topbarFiltersDateTo").prop("value", new Date(endDate).toISOString().replace(/T.*/, ""));

	routeProcessing();
}

/*****************************************************************
Name: Clear Dropdowns
Description: Empties out all of the contents in the filter
	dropdowns.
Parameters: None
Returns: None
*****************************************************************/
function clearDropdowns()
{
	$("#topbarFiltersSrc").empty();
	$("#topbarFiltersSrc").append("<option value =\"" + "NONE" + "</option>");
	$("#topbarFiltersDes").empty();
	$("#topbarFiltersDes").append("<option value =\"" + "NONE"+"</option>");
}

/*****************************************************************
Name: Check if Service Center is in Dropdown
Description: Checks if the option is present in the given
	dropdown.
Parameters:
	id: The HTML ID of the dropdown.
	val: The option to check for
Returns: Whether or not it is in the dropdown.
*****************************************************************/
function checkIfInDropDown(id, val)
{
	if(!$(id).find("option:contains('" + val  + "')").length)
	{
		return true;
	}
	return false;
}

/*****************************************************************
Name: Populate Dropdowns
Description: Fills the dropdown menus with service center
	options. These service centers are sorted for convenience.
	Only adds service centers found in the input files.
Parameters: None
Returns: None
*****************************************************************/
function populateDropdowns()
{
	var renderScheduled = mapDetails.render_scheduled;
	var renderActual = mapDetails.render_actual;

	$("#topbarFiltersDes").append("<option value =\"ALL\">ALL</option>");

	if (renderScheduled == true)
	{
		var sortedScheduled = sortTarget(mapDetails.scheduled_paths);

		for (dateIdx in mapDetails.scheduled_paths)
		{
			if(minDate == "NDE" || maxDate == "NDE")
			{
				maxDate = mapDetails.scheduled_paths[dateIdx].date;
				minDate = mapDetails.scheduled_paths[dateIdx].date;
			}
			else if (mapDetails.scheduled_paths[dateIdx].date > maxDate)
			{
				maxDate = mapDetails.scheduled_paths[dateIdx].date;
			}
			else if (mapDetails.scheduled_paths[dateIdx] < minDate)
			{
				minDate = mapDetails.scheduled_paths[dateIdx].date;
			}
		}

		for (var idx1 in sortedScheduled)
		{
			var center = sortedScheduled[idx1]
			if (checkIfInDropDown("#topbarFiltersSrc", center.sourceSymbol))
			{
				$("#topbarFiltersSrc").append("<option value=\"" + center.sourceSymbol + "\">" + center.sourceSymbol + "</option>");
			}
			if (checkIfInDropDown("#topbarFiltersDes", center.targetSymbol))
			{
				$("#topbarFiltersDes").append("<option value=\"" + center.targetSymbol + "\">" + center.targetSymbol + "</option>");
			}
		}
	}
	if (renderActual == true)
	{
		var sortedActual = sortTarget(mapDetails.actual_paths);

		for (dateIdx in mapDetails.actual_paths)
		{
			if (minDate == "NDE" || maxDate == "NDE")
			{
				maxDate = mapDetails.actual_paths[dateIdx].date;
				minDate = mapDetails.actual_paths[dateIdx].date;
			}
			else if(mapDetails.actual_paths[dateIdx].date > maxDate)
			{
				maxDate = mapDetails.actual_paths[dateIdx].date;
			}
			else if (mapDetails.actual_paths[dateIdx] < minDate)
			{
				minDate = mapDetails.actual_paths[dateIdx].date;
			}
		}

		for (var idx2 in sortedActual)
		{
			var center = sortedActual[idx2];
			if (checkIfInDropDown("#topbarFiltersSrc", center.sourceSymbol))
			{
				$("#topbarFiltersSrc").append("<option value=\"" + center.sourceSymbol + "\">" + center.sourceSymbol + "</option>");
			}
			if (checkIfInDropDown("#topbarFiltersDes", center.targetSymbol))
			{
				$("#topbarFiltersDes").append("<option value=\"" + center.targetSymbol + "\">" + center.targetSymbol + "</option>");
			}
		}
	}

	// If we only have two options (ALL and some service center), remove the ALL option.
	if($("#topbarFiltersDes").children().length == 2)
	{
		$("#topbarFiltersDes").children()[0].remove();
	}

	$("#topbarFiltersDateFrom").prop("value", minDate);
	$("#topbarFiltersDateFrom").prop("min", minDate);
	$("#topbarFiltersDateFrom").prop("max", maxDate);

	$("#topbarFiltersDateTo").prop("value", maxDate);
	$("#topbarFiltersDateTo").prop("min", minDate);
	$("#topbarFiltersDateTo").prop("max", maxDate);
}