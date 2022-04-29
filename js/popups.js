/*****************************************************************
File Infomation:
	Purpose: Provide functions and callbacks
		for the landing page pop-up.
	Dependencies: structs.js, jquery.js
*****************************************************************/

/*****************************************************************
Global Variables
*****************************************************************/
var mapDetails = new MapDetails();	      // Global container for map details (See structs.js)

/*****************************************************************
Name: Hide Error
Description: Hides the error popup
Parameters: None
Returns: None
*****************************************************************/
function hideError()
{
	$("#popupError").hide();
	$("#cover").hide();
}

/*****************************************************************
Name: Print error to popup
Description: Print an error to the popup
Parameters:
	str: The string to be printed
Returns: None
*****************************************************************/
function producePopupError(str)
{
	// Show the map error
	$("#popupError").show();
	$("#cover").show();
	// Check for injection
	if(/[<>]/.test(str))
	{
		throw new Error("XSS Detected");
	}
	// Put in page
	$("#popupErrorText").first().text(str);
}

/*****************************************************************
Name: Read File
Description: Allows synchronous reading of files.
Parameters:
	fileDescriptor: The file data retrieved from the document
Returns: Promise. Resolves with file content.
*****************************************************************/
function readFile(fileDescriptor)
{
	// Promise used to wait for completion
	return new Promise((resolve, reject) => {
		// Set up file reader
		var reader = new FileReader();

		// Callbacks
		reader.onload = (e) => {
			resolve(e.target.result);
		};

		reader.onerror = (e) => {
			reject("Error reading file.");
		};

		// Execute file read
		reader.readAsText(fileDescriptor);
	});
}

/*****************************************************************
Name: Get CSV File Input
Description: Loads a CSV file from the HTML input
Parameters:
	html_location: The jQuery string used to select the input
Returns: The CSV file
*****************************************************************/
async function getCSVFileInput(html_locator)
{
	var files = $(html_locator).prop("files");
	if(files.length === 0)
	{
		producePopupError("No file specified");
		return null;
	}
	else if(files.length != 1)
	{
		producePopupError("Please select one file only");
		return null;
	}

	var csvFile = await readFile(files[0]);
	return csvFile.replace(/(\r)/gm,"").replace(/['"]+/g,"");
}

/*****************************************************************
Name: Load Scheduled File
Description: Loads a scheduled file from the file input.
Parameters: None
Returns: None
*****************************************************************/
async function loadScheduled()
{
	var csvFile = await getCSVFileInput("#sidebarScheduledFileInput");
	var paths = [];
	var p;
	if (csvFile == null)
	{
		return;
	}
	csvFile.split("\n").forEach((item, index) => {
		if (item)
		{
			p = item.split(",");
			paths.push(new ScheduledPath(
				p[0], p[1], p[2], p[3]
			));
		}
	});

	// Set input module's objects into MapDetails
	mapDetails.scheduled_paths = paths;

	// Check the Show
	mapDetails.render_scheduled = true;

	//Update dropdowns
	clearDropdowns();
	populateDropdowns();

	// Make Checkmark appear
	$("#sidebarScheduledShow").prop("checked", true);

	// Map Type Conflicts
	if($("#sidebarEmptyShow").is(':checked'))
	{
		mapDetails.render_empty = false;
		$("#sidebarEmptyShow").prop("checked", false);
	}

	// Disable Input
	$("#topbarFiltersSrc").prop("disabled", false);
	$("#topbarFiltersDes").prop("disabled", false);
	$("#topbarFiltersDateFrom").prop("disabled", false);
	$("#topbarFiltersDateTo").prop("disabled", false);
}

/*****************************************************************
Name: Show Scheduled
Description: After loading the scheduled file, update the page
	and begin rendering.
Parameters:
	ele: the jQuery selector for the render scheduled check
		box
Returns: None
*****************************************************************/
function showScheduled(ele)
{
	if($(ele).is(':checked'))
	{
		mapDetails.render_scheduled = true;
	}
	else
	{
		mapDetails.render_scheduled = false;
	}

	// Update the dropdowns
	clearDropdowns();
	populateDropdowns();

	// Map Type Conflicts
	if($("#sidebarEmptyShow").is(':checked'))
	{
		mapDetails.render_empty = false;
		$("#sidebarEmptyShow").prop("checked", false);
	}

	// Disable Input
	$("#topbarFiltersSrc").prop("disabled", false);
	$("#topbarFiltersDes").prop("disabled", false);
	$("#topbarFiltersDateFrom").prop("disabled", false);
	$("#topbarFiltersDateTo").prop("disabled", false);

	routeProcessing();
}

/*****************************************************************
Name: Load Actual File
Description: Loads an actual file from the file input.
Parameters: None
Returns: None
*****************************************************************/
async function loadActual()
{
	var csvFile = await getCSVFileInput("#sidebarActualFileInput");
	var paths = [];
	var p;
	if (csvFile == null)
	{
		return;
	}
	csvFile.split("\n").forEach((item, index) => {
		if (item)
		{
			p = item.split(",");
			paths.push(new ActualPath(
				p[0], p[1], p[2], p[3], p[4]
			));
		}
	});

	// Set input module's objects into MapDetails
	mapDetails.actual_paths = paths;

	// Check the Show
	mapDetails.render_actual = true;

	// Update the dropdowns
	clearDropdowns();
	populateDropdowns();

	// Make Checkmark appear
	$("#sidebarActualShow").prop("checked", true);

	// Map Type Conflicts
	if($("#sidebarEmptyShow").is(':checked'))
	{
		mapDetails.render_empty = false;
		$("#sidebarEmptyShow").prop("checked", false);
	}

	// Disable Input
	$("#topbarFiltersSrc").prop("disabled", false);
	$("#topbarFiltersDes").prop("disabled", false);
	$("#topbarFiltersDateFrom").prop("disabled", false);
	$("#topbarFiltersDateTo").prop("disabled", false);
}

/*****************************************************************
Name: Show Scheduled
Description: After loading the actual file, update the page
	and begin rendering.
Parameters:
	ele: the jQuery selector for the render actual check
		box
Returns: None
*****************************************************************/
function showActual(ele)
{
	if($(ele).is(':checked'))
	{
		mapDetails.render_actual = true;
	}
	else
	{
		mapDetails.render_actual = false;
	}

	// Update the dropdowns
	clearDropdowns();
	populateDropdowns();

	// Map Type Conflicts
	if($("#sidebarEmptyShow").is(':checked'))
	{
		mapDetails.render_empty = false;
		$("#sidebarEmptyShow").prop("checked", false);
	}

	// Disable Input
	$("#topbarFiltersSrc").prop("disabled", false);
	$("#topbarFiltersDes").prop("disabled", false);
	$("#topbarFiltersDateFrom").prop("disabled", false);
	$("#topbarFiltersDateTo").prop("disabled", false);

	routeProcessing();
}

/*****************************************************************
Name: Load Empty File
Description: Loads an empty file from the file input and begins
	rendering
Parameters: None
Returns: None
*****************************************************************/
async function loadEmpty()
{
	var csvFile = await getCSVFileInput("#sidebarEmptyFileInput");
	var paths = [];
	var p;
	if (csvFile == null)
	{
		return;
	}

	var arr = csvFile.split("\n");
	for(var i = 1; i < arr.length; i++)
	{
		if(arr[i])
		{
			p = arr[i].split(",");
			paths.push(new EmptyPath(
				p[0], p[1], p[2]
			));
		}
	};

	// Set input module's objects into MapDetails
	mapDetails.empty_paths = paths;

	// Check the Show
	mapDetails.render_empty = true;

	//Update dropdowns
	clearDropdowns();
	populateDropdowns();

	// Make Checkmark appear
	$("#sidebarEmptyShow").prop("checked", true);

	// Map Type Conflicts
	if($("#sidebarScheduledShow").is(':checked'))
	{
		mapDetails.render_scheduled = false;
		$("#sidebarScheduledShow").prop("checked", false);
	}
	if($("#sidebarActualShow").is(':checked'))
	{
		mapDetails.render_actual = false;
		$("#sidebarActualShow").prop("checked", false);
	}

	// Disable Input
	$("#topbarFiltersSrc").prop("disabled", true);
	$("#topbarFiltersDes").prop("disabled", true);
	$("#topbarFiltersDateFrom").prop("disabled", true);
	$("#topbarFiltersDateTo").prop("disabled", true);
}

/*****************************************************************
Name: Show Empty
Description: After loading the empty file, update the page
	and begin rendering.
Parameters:
	ele: the jQuery selector for the render empty check
		box
Returns: None
*****************************************************************/
function showEmpty(ele)
{
	if($(ele).is(':checked'))
	{
		mapDetails.render_empty = true;
		// Disable Input
		$("#topbarFiltersSrc").prop("disabled", true);
		$("#topbarFiltersDes").prop("disabled", true);
		$("#topbarFiltersDateFrom").prop("disabled", true);
		$("#topbarFiltersDateTo").prop("disabled", true);
	}
	else
	{
		mapDetails.render_empty = false;
		// Disable Input
		$("#topbarFiltersSrc").prop("disabled", false);
		$("#topbarFiltersDes").prop("disabled", false);
		$("#topbarFiltersDateFrom").prop("disabled", false);
		$("#topbarFiltersDateTo").prop("disabled", false);
	}

	// Update the dropdowns
	clearDropdowns();
	populateDropdowns();

	// Map Type Conflicts
	if($("#sidebarScheduledShow").is(':checked'))
	{
		mapDetails.render_scheduled = false;
		$("#sidebarScheduledShow").prop("checked", false);
	}
	if($("#sidebarActualShow").is(':checked'))
	{
		mapDetails.render_actual = false;
		$("#sidebarActualShow").prop("checked", false);
	}

	routeProcessing();
}

/*****************************************************************
Name: Load Centers Callback
Description: Loads the service centers from the document. Simply
	adds these service center into the webpage.
Parameters: None
Returns: None
*****************************************************************/
async function loadCenters(doCSVPrompt)
{
	var csvFile;
	if(doCSVPrompt)
	{
		// Grab the centers file from user
		csvFile = await getCSVFileInput("#popupCentersFileInput")
		// TODO: What happens if we receive null here??
		window.localStorage.setItem("service-centers-csv", csvFile);
	}
	else
	{
		csvFile = window.localStorage.getItem("service-centers-csv");
	}

	$("#popupCentersFile").hide();
	$("#cover").hide();

	// Form Path Objects out of the File's Content
	csvFile.split("\n").forEach((item, index) => {
		if (item)
		{
			var p = item.split(",");
			var svcCenter = new ServiceCenter(
				p[1], p[2], parseFloat(p[4]), parseFloat(p[5])
			);
			mapDetails.centers[p[1]] = svcCenter;
		}
	});
}

/*****************************************************************
Name: Show CSV Menu Callback
Description: Shows the CSV Menu and hides the ask menu. Triggers
	if the user selects "yes" or there is no CSV in storage.
Parameters: None
Returns: None
*****************************************************************/
function showCSVMenu()
{
	$("#popupAskCenters").hide();
	$("#popupCentersFile").show();
}

/*****************************************************************
Name: Skip CSV Menu Callback
Description: Shows the CSV Menu and hides the ask menu. Triggers
	if the user selects "no".
Parameters: None
Returns: None
*****************************************************************/
function skipCSVMenu()
{
	$("#popupAskCenters").hide();
	loadCenters(false);
}


/*****************************************************************
Name: Save Settings
Description: Saves all settings to the local storage
Parameters: None
Returns: None
*****************************************************************/
function saveSettings()
{
	if (typeof(Storage) !== "undefined")
	{
		window.localStorage.scheduledColor = mapDetails.settings.scheduledColor;
		window.localStorage.actualColor = mapDetails.settings.actualColor;
		window.localStorage.emptyColor = mapDetails.settings.emptyColor;
		window.localStorage.pathLabelSize = parseFloat((mapDetails.settings.pathLabelSize * 5 / MapSettings.defaults.pathLabelSize).toFixed(2));
		window.localStorage.nodeLabelSize = parseFloat((mapDetails.settings.nodeLabelSize * 5 / MapSettings.defaults.nodeLabelSize).toFixed(2));
		window.localStorage.nodeSize = parseFloat((mapDetails.settings.nodeSize * 5 / MapSettings.defaults.nodeSize).toFixed(2));
		window.localStorage.pathSize = parseFloat((mapDetails.settings.pathSize * 5 / MapSettings.defaults.pathSize).toFixed(2));
		window.localStorage.hasArrows = mapDetails.settings.hasArrows;
		window.localStorage.plotAllNodes = mapDetails.settings.plotAllNodes;
		window.localStorage.nodeColor = mapDetails.settings.nodeColor;
		window.localStorage.scheduledDotted = mapDetails.settings.scheduledDotted;
		window.localStorage.actualDotted = mapDetails.settings.actualDotted;
		window.localStorage.emptyDotted = mapDetails.settings.emptyDotted;
		window.localStorage.draggableLabels = mapDetails.settings.draggableLabels;
	}
}


/*****************************************************************
Name: Load Settings
Description: Loads settings from local storage
Parameters: None
Returns: None
*****************************************************************/
function loadSettings()
{
	if (typeof(Storage) !== "undefined")
	{
		if(!window.localStorage.scheduledColor)
		{
			window.localStorage.scheduledColor = MapSettings.defaults.scheduledColor;
		}
		window.document.getElementById('popupSettingsScheduledColor').value = window.localStorage.scheduledColor;
		mapDetails.settings.scheduledColor = document.getElementById('popupSettingsScheduledColor').value;

		if(!window.localStorage.actualColor)
		{
			window.localStorage.actualColor = MapSettings.defaults.actualColor;
		}
		window.document.getElementById('popupSettingsActualColor').value = window.localStorage.actualColor;
		mapDetails.settings.actualColor = document.getElementById('popupSettingsActualColor').value;

		if(!window.localStorage.emptyColor)
		{
			window.localStorage.emptyColor = MapSettings.defaults.emptyColor;
		}
		window.document.getElementById('popupSettingsEmptyColor').value = window.localStorage.emptyColor;
		mapDetails.settings.emptyColor = document.getElementById('popupSettingsEmptyColor').value;

		if(!window.localStorage.pathLabelSize)
		{
			window.localStorage.pathLabelSize = 5;
		}
		window.document.getElementById('popupSettingsPathLabelSize').value = window.localStorage.pathLabelSize;
		mapDetails.settings.pathLabelSize = document.getElementById('popupSettingsPathLabelSize').value;
		mapDetails.settings.pathLabelSize = mapDetails.settings.pathLabelSize * MapSettings.defaults.pathLabelSize / 5;

		if(!window.localStorage.nodeLabelSize)
		{
			window.localStorage.nodeLabelSize = 5;
		}
		window.document.getElementById('popupSettingsNodeLabelSize').value = window.localStorage.nodeLabelSize;
		mapDetails.settings.nodeLabelSize = document.getElementById('popupSettingsNodeLabelSize').value;
		mapDetails.settings.nodeLabelSize = mapDetails.settings.nodeLabelSize * MapSettings.defaults.nodeLabelSize / 5;

		if(!window.localStorage.nodeSize)
		{
			window.localStorage.nodeSize = 5;
		}
		window.document.getElementById('popupSettingsNodeSize').value = window.localStorage.nodeSize;
		mapDetails.settings.nodeSize = document.getElementById('popupSettingsNodeSize').value;
		mapDetails.settings.nodeSize = mapDetails.settings.nodeSize * MapSettings.defaults.nodeSize / 5;

		if(!window.localStorage.pathSize)
		{
			window.localStorage.pathSize = 5;
		}
		window.document.getElementById('popupSettingsPathSize').value = window.localStorage.pathSize;
		mapDetails.settings.pathSize = document.getElementById('popupSettingsPathSize').value;
		mapDetails.settings.pathSize = mapDetails.settings.pathSize * MapSettings.defaults.pathSize / 5;

		if(!window.localStorage.hasArrows)
		{
			window.localStorage.hasArrows = MapSettings.defaults.hasArrows;
		}

		if(window.localStorage.hasArrows == 'false')
		{
			window.document.getElementById('popupSettingsHasArrows').checked = false;
		}
		else
		{
			window.document.getElementById('popupSettingsHasArrows').checked = true;
		}
		mapDetails.settings.hasArrows = document.getElementById('popupSettingsHasArrows').checked;

		if(!window.localStorage.plotAllNodes)
		{
			window.localStorage.plotAllNodes = MapSettings.defaults.plotAllNodes;
		}
		if(window.localStorage.plotAllNodes == 'false')
		{
			window.document.getElementById('popupSettingsPlotAllNodes').checked = false;
		}
		else
		{
			window.document.getElementById('popupSettingsPlotAllNodes').checked = true;
		}
		mapDetails.settings.plotAllNodes = document.getElementById('popupSettingsPlotAllNodes').checked;

		if(!window.localStorage.nodeColor)
		{
			window.localStorage.nodeColor = MapSettings.defaults.nodeColor;
		}
		window.document.getElementById('popupSettingsNodeColor').value = window.localStorage.nodeColor;
		mapDetails.settings.nodeColor = document.getElementById('popupSettingsNodeColor').value;

		if(!window.localStorage.scheduledDotted)
		{
			window.localStorage.scheduledDotted = MapSettings.defaults.scheduledDotted;
		}
		if(window.localStorage.scheduledDotted == 'false')
		{
			window.document.getElementById('popupSettingsScheduledDotted').checked = false;
		}
		else
		{
			window.document.getElementById('popupSettingsScheduledDotted').checked = true;
		}
		mapDetails.settings.scheduledDotted = document.getElementById('popupSettingsScheduledDotted').checked;

		if(!window.localStorage.actualDotted)
		{
			window.localStorage.actualDotted = MapSettings.defaults.actualDotted;
		}
		if(window.localStorage.actualDotted == 'false')
		{
			window.document.getElementById('popupSettingsActualDotted').checked = false;
		}
		else
		{
			window.document.getElementById('popupSettingsActualDotted').checked = true;
		}
		mapDetails.settings.actualDotted = document.getElementById('popupSettingsActualDotted').checked;

		if(!window.localStorage.emptyDotted)
		{
			window.localStorage.emptyDotted = MapSettings.defaults.emptyDotted;
		}
		if(window.localStorage.emptyDotted == 'false')
		{
			window.document.getElementById('popupSettingsEmptyDotted').checked = false;
		}
		else
		{
			window.document.getElementById('popupSettingsEmptyDotted').checked = true;
		}
		mapDetails.settings.emptyDotted = document.getElementById('popupSettingsEmptyDotted').checked;

		if(!window.localStorage.draggableLabels)
		{
			window.localStorage.draggableLabels = MapSettings.defaults.draggableLabels;
		}
		if(window.localStorage.draggableLabels == 'false')
		{
			window.document.getElementById('settingsAdvancedDraggableLabels').checked = false;
		}
		else
		{
			window.document.getElementById('settingsAdvancedDraggableLabels').checked = true;
		}
		mapDetails.settings.draggableLabels = document.getElementById('settingsAdvancedDraggableLabels').checked;
	}
	else
	{
		console.log("No local storage support.");
	}
}

/*****************************************************************
Name: Reset Settings
Description: Resets all settings to default
Parameters: None
Returns: None
*****************************************************************/
function resetSettings()
{
	window.document.getElementById('popupSettingsScheduledColor').value = MapSettings.defaults.scheduledColor;
	window.document.getElementById('popupSettingsActualColor').value = MapSettings.defaults.actualColor;
	window.document.getElementById('popupSettingsEmptyColor').value = MapSettings.defaults.emptyColor;
	window.document.getElementById('popupSettingsPathLabelSize').value = 5;
	window.document.getElementById('popupSettingsNodeLabelSize').value = 5;
	window.document.getElementById('popupSettingsNodeSize').value = 5;
	window.document.getElementById('popupSettingsPathSize').value = 5;
	window.document.getElementById('popupSettingsHasArrows').checked = MapSettings.defaults.hasArrows;
	window.document.getElementById('popupSettingsPlotAllNodes').checked = MapSettings.defaults.plotAllNodes;
	window.document.getElementById('popupSettingsNodeColor').value = MapSettings.defaults.nodeColor;
	window.document.getElementById('popupSettingsScheduledDotted').checked = MapSettings.defaults.scheduledDotted;
	window.document.getElementById('popupSettingsActualDotted').checked = MapSettings.defaults.actualDotted;
	window.document.getElementById('popupSettingsEmptyDotted').checked = MapSettings.defaults.emptyDotted;
	window.document.getElementById('settingsAdvancedDraggableLabels').checked = MapSettings.defaults.draggableLabels;
}

/*****************************************************************
Name: Check Local Storage for CSV
Description: Checks the local storage for a service-centers-csv
	key. Skips question prompt if not found.
Returns: None
*****************************************************************/
function checkCSV()
{
	if(window.localStorage.getItem("service-centers-csv") === null)
	{
		doCSVPrompt = true;
		showCSVMenu();
	}
}

// Entry point
$(() => {
	checkCSV();
	loadSettings();
});

/*****************************************************************
Name: Show Settings menu
Description: Shows the settings menu
Parameters: None
Returns: None
*****************************************************************/
function settingsMenu()
{
	$("#popupSettings").show();
	$("#cover").show();
}

/*****************************************************************
Name: Close Settings menu
Description: Closes the settings menu
Parameters:
	$save: Whether or nor to save the settings
Returns: None
*****************************************************************/
function closeSettings($save)
{
	if($save)
	{
		// load in settings struct
		mapDetails.settings.pathLabelSize = document.getElementById('popupSettingsPathLabelSize').value;
		mapDetails.settings.nodeLabelSize = document.getElementById('popupSettingsNodeLabelSize').value;
		mapDetails.settings.nodeSize = document.getElementById('popupSettingsNodeSize').value;
		mapDetails.settings.pathSize = document.getElementById('popupSettingsPathSize').value;
		mapDetails.settings.hasArrows = document.getElementById('popupSettingsHasArrows').checked;
		mapDetails.settings.plotAllNodes = document.getElementById('popupSettingsPlotAllNodes').checked;
		mapDetails.settings.nodeColor = document.getElementById('popupSettingsNodeColor').value;
		mapDetails.settings.scheduledColor = document.getElementById('popupSettingsScheduledColor').value;
		mapDetails.settings.actualColor = document.getElementById('popupSettingsActualColor').value;
		mapDetails.settings.emptyColor = document.getElementById('popupSettingsEmptyColor').value;
		mapDetails.settings.scheduledDotted = document.getElementById('popupSettingsScheduledDotted').checked;
		mapDetails.settings.actualDotted = document.getElementById('popupSettingsActualDotted').checked;
		mapDetails.settings.emptyDotted = document.getElementById('popupSettingsEmptyDotted').checked;
		mapDetails.settings.draggableLabels = document.getElementById('settingsAdvancedDraggableLabels').checked;

		$("#popupSettings").hide();
		$("#cover").hide();

		// Normalize the continuous variables
		mapDetails.settings.nodeLabelSize = mapDetails.settings.nodeLabelSize * MapSettings.defaults.nodeLabelSize / 5;
		mapDetails.settings.nodeSize = mapDetails.settings.nodeSize * MapSettings.defaults.nodeSize / 5;
		mapDetails.settings.pathSize = mapDetails.settings.pathSize * MapSettings.defaults.pathSize / 5;
		mapDetails.settings.pathLabelSize = mapDetails.settings.pathLabelSize * MapSettings.defaults.pathLabelSize / 5;

		// save settings to local storage for browser refresh
		saveSettings();

		// Apply settings
		updateMapSettings();
		routeProcessing();
	}
	else
	{
		if($('#popupSettings').is(':visible'))
		{
			// close menu
			$("#popupSettings").hide();
			$("#cover").hide();

			// restore settings
			loadSettings();
		}
	}
}

function openSettingsTab(evt, cityName)
{
	// Declare all variables
	var i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("popupSettingsTabContent");
	for (i = 0; i < tabcontent.length; i++)
	{
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("settingsTabLinks");
	for (i = 0; i < tablinks.length; i++)
	{
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(cityName).style.display = "block";
	evt.currentTarget.className += " active";
}