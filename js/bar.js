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
function sortCities(cities)
{
	// New array so as to not modify the original
	var newArr = [];

	// Copy array
	for(var i = 0; i < cities.length; i++)
	{
		newArr.push(cities[i]);
	}

	// Sort
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

/*****************************************************************
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