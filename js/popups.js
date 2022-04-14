/*****************************************************************
File Infomation:
	Purpose: Provide functions and callbacks
		for the landing page pop-up.
	Dependencies: structs.js, jquery.js
*****************************************************************/

/*****************************************************************
Global Variables
*****************************************************************/
var mapDetails = Object.create(MapDetails);	      // Global container for map details (See structs.js)
mapDetails.settings = Object.create(MapSettings); // Settings in global map details
var doCSVPrompt = true;							              // Tells the landing page how to behave.

/*****************************************************************
Name:
Description:
Parameters:
Returns:
*****************************************************************/
function hideError()
{
	$("#popupError").hide();
	$("#cover").hide();
}


/*****************************************************************
Name: Print landing page error
Description: Print an error to the landing page
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
Name:
Description:
Parameters:
Returns:
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
Name:
Description:
Parameters:
Returns:
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
			paths.push( Object.create(Path.Scheduled).initialize(
				p[0], p[1], p[2], p[3]
			) );
		}
	});

	// For debug
	console.log(paths);

	// Set input module's objects into MapDetails
	mapDetails.scheduled_paths = paths;
}

/*****************************************************************
Name:
Description:
Parameters:
Returns:
*****************************************************************/
function showScheduled(ele)
{
	if($(ele).is(':checked')){
		mapDetails.render_scheduled = true;
	}else{
		mapDetails.render_scheduled = false;
	}
	// For debug
	console.log(mapDetails);

	updateMapSettings();
}

/*****************************************************************
Name:
Description:
Parameters:
Returns:
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
			paths.push( Object.create(Path.Actual).initialize(
				p[0], p[1], p[2], p[3]
			) );
		}
	});

	// For debug
	console.log(paths);

	// Set input module's objects into MapDetails
	mapDetails.actual_paths = paths;
}

/*****************************************************************
Name:
Description:
Parameters:
Returns:
*****************************************************************/
function showActual(ele)
{
	if($(ele).is(':checked')){
		mapDetails.render_actual = true;
	}else{
		mapDetails.render_actual = false;
	}
	// For debug
	console.log(mapDetails);

	updateMapSettings();
}

/*****************************************************************
Name:
Description:
Parameters:
Returns:
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
	csvFile.split("\n").forEach((item, index) => {
		if (item)
		{
			p = item.split(",");
			paths.push( Object.create(Path.Empty).initialize(
				p[0], p[1], p[2], p[3]
			) );
		}
	});

	// For debug
	console.log(paths);

	// Set input module's objects into MapDetails
	mapDetails.empty_paths = paths;
}

/*****************************************************************
Name:
Description:
Parameters:
Returns:
*****************************************************************/
function showEmpty(ele)
{
	if($(ele).is(':checked')){
		mapDetails.render_empty = true;
	}else{
		mapDetails.render_empty = false;
	}
	// For debug
	console.log(mapDetails);

	updateMapSettings();
}

/*****************************************************************
Name: Load Centers Callback
Description: Loads the service centers from the document. Simply
	adds these service center into the webpage.
Parameters: None
Returns: None
*****************************************************************/
async function loadCenters()
{
	var csvFile;
	if(doCSVPrompt)
	{
		// Grab the centers file from user
		var csvFile = await getCSVFileInput("#popupCentersFileInput")
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
	var centers = [];
	var p;
	csvFile.split("\n").forEach((item, index) => {
		if (item)
		{
			p = item.split(",");
			centers.push( Object.create(ServiceCenter).initialize(
				p[1], p[2], parseFloat(p[3]), parseFloat(p[4])
			));
		}
	});

	// For debug
	console.log(centers);

	// Set input module's objects into MapDetails
	mapDetails.centers = centers;

	// Update settings dialog to have cities list
	populateMapSettings();
}

/*****************************************************************
Name: Show CSV Menu Callback
Description: Shows the CSV Menu and hides the ask menu. Triggers
	if the user selects "yes" or there is no CSV in storage.
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
Returns: None
*****************************************************************/
function skipCSVMenu()
{
	$("#popupAskCenters").hide();
	loadCenters();
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
$(() => { checkCSV(); });

/*****************************************************************
Name:
Description:
Parameters:
Returns:
*****************************************************************/
function settingsMenu()
{
	$("#popupSettings").show();
	$("#cover").show();
}

/*****************************************************************
Name:
Description:
Parameters:
Returns:
*****************************************************************/
function closeSettings()
{
	// load in settings struct
	mapDetails.settings.pathLabelSize = document.getElementById('popupSettingsPathLabelSize').value;
	mapDetails.settings.nodeLabelSize = document.getElementById('popupSettingsNodeLabelSize').value;
	mapDetails.settings.nodeSize = document.getElementById('popupSettingsNodeSize').value;
	mapDetails.settings.pathSize = document.getElementById('popupSettingsPathSize').value;
	mapDetails.settings.hasArrows = document.getElementById('popupSettingsHasArrows').checked;
	mapDetails.settings.plotAllNodes = document.getElementById('popupSettingsPlotAllNodes').checked;
	mapDetails.settings.nodeColor = document.getElementById('popupSettingsNodeColor').value;
	mapDetails.settings.idealColor = document.getElementById('popupSettingsScheduledColor').value;
	mapDetails.settings.actualColor = document.getElementById('popupSettingsActualColor').value;
	mapDetails.settings.emptyColor = document.getElementById('popupSettingsEmptyColor').value;

	// For debug
	console.log(mapDetails.settings);

	$("#popupSettings").hide();
	$("#cover").hide();

	// Normalize the continuous variables
	mapDetails.settings.nodeLabelSize = mapDetails.settings.nodeLabelSize * MapSettings.nodeLabelSize / 5;
	mapDetails.settings.nodeSize = mapDetails.settings.nodeSize * MapSettings.nodeSize / 5;
	mapDetails.settings.pathSize = mapDetails.settings.pathSize * MapSettings.pathSize / 5;
	mapDetails.settings.valueLabelSize = mapDetails.settings.valueLabelSize * MapSettings.valueLabelSize / 5;

	// Apply settings
	updateMapSettings();
}

/*****************************************************************
Name:
Description:
Parameters:
Returns:
*****************************************************************/
function exportToPDF()
{
	producePopupError("Coming Soon")
}