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

	// Check the Show
	mapDetails.render_scheduled = true;

	//Update dropdowns
	clearDropdowns();
	populateDropdowns();

	// Make Checkmark appear
	$("#sidebarScheduledShow").prop("checked", true);

	// Map Type Conflicts
	if($("#sidebarEmptyShow").is(':checked')){
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

	// Map Type Conflicts
	if($("#sidebarEmptyShow").is(':checked')){
		mapDetails.render_empty = false;
		$("#sidebarEmptyShow").prop("checked", false);
	}

	// Disable Input
	$("#topbarFiltersSrc").prop("disabled", false);
	$("#topbarFiltersDes").prop("disabled", false);
	$("#topbarFiltersDateFrom").prop("disabled", false);
	$("#topbarFiltersDateTo").prop("disabled", false);

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

	// Check the Show
	mapDetails.render_actual = true;

	// Update the dropdowns
	clearDropdowns();
	populateDropdowns();

	// Make Checkmark appear
	$("#sidebarActualShow").prop("checked", true);

	// Map Type Conflicts
	if($("#sidebarEmptyShow").is(':checked')){
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

	// Map Type Conflicts
	if($("#sidebarEmptyShow").is(':checked')){
		mapDetails.render_empty = false;
		$("#sidebarEmptyShow").prop("checked", false);
	}

	// Disable Input
	$("#topbarFiltersSrc").prop("disabled", false);
	$("#topbarFiltersDes").prop("disabled", false);
	$("#topbarFiltersDateFrom").prop("disabled", false);
	$("#topbarFiltersDateTo").prop("disabled", false);

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
				p[0], p[1], p[2]
			) );
		}
	});

	// For debug
	console.log(paths);

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
	if($("#sidebarScheduledShow").is(':checked')){
		mapDetails.render_scheduled = false;
		$("#sidebarScheduledShow").prop("checked", false);
	}
	if($("#sidebarActualShow").is(':checked')){
		mapDetails.render_actual = false;
		$("#sidebarActualShow").prop("checked", false);
	}

	// Disable Input
	$("#topbarFiltersSrc").prop("disabled", true);
	$("#topbarFiltersDes").prop("disabled", true);
	$("#topbarFiltersDateFrom").prop("disabled", true);
	$("#topbarFiltersDateTo").prop("disabled", true);

	routeProcessing();
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

		// Disable Input
		$("#topbarFiltersSrc").prop("disabled", true);
		$("#topbarFiltersDes").prop("disabled", true);
		$("#topbarFiltersDateFrom").prop("disabled", true);
		$("#topbarFiltersDateTo").prop("disabled", true);
	}else{
		mapDetails.render_empty = false;

		// Disable Input
		$("#topbarFiltersSrc").prop("disabled", false);
		$("#topbarFiltersDes").prop("disabled", false);
		$("#topbarFiltersDateFrom").prop("disabled", false);
		$("#topbarFiltersDateTo").prop("disabled", false);
	}

	// Map Type Conflicts
	if($("#sidebarScheduledShow").is(':checked')){
		mapDetails.render_scheduled = false;
		$("#sidebarScheduledShow").prop("checked", false);
	}
	if($("#sidebarActualShow").is(':checked')){
		mapDetails.render_actual = false;
		$("#sidebarActualShow").prop("checked", false);
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
async function loadCenters(doCSVPrompt)
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
				p[1], p[2], parseFloat(p[4]), parseFloat(p[5])
			));

			mapDetails.centersObj[p[1]] = Object.create(ServiceCenter).initialize(
				p[1], p[2], parseFloat(p[4]), parseFloat(p[5]));
		}
	});

	// For debug
	console.log(centers);
	console.log(mapDetails.centersObj);

	// Set input module's objects into MapDetails
	mapDetails.centers = centers;

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
	loadCenters(false);
}


/**
 * Saves all settings (in mapDetails.settings) to local storage
 */
function saveSettings(){
	if (typeof(Storage) !== "undefined") {
		window.localStorage.scheduledColor = mapDetails.settings.scheduledColor;
		window.localStorage.actualColor = mapDetails.settings.actualColor;
		window.localStorage.emptyColor = mapDetails.settings.emptyColor;
		window.localStorage.pathLabelSize = mapDetails.settings.pathLabelSize * 5 / MapSettings.pathLabelSize;
		window.localStorage.nodeLabelSize = mapDetails.settings.nodeLabelSize * 5 / MapSettings.nodeLabelSize;
		window.localStorage.nodeSize = mapDetails.settings.nodeSize * 5 / MapSettings.nodeSize;
		window.localStorage.pathSize = mapDetails.settings.pathSize * 5 / MapSettings.pathSize;
		window.localStorage.hasArrows = mapDetails.settings.hasArrows;
		window.localStorage.plotAllNodes = mapDetails.settings.plotAllNodes;
		window.localStorage.nodeColor = mapDetails.settings.nodeColor;
		window.localStorage.scheduledDotted = mapDetails.settings.scheduledDotted;
		window.localStorage.actualDotted = mapDetails.settings.actualDotted;
		window.localStorage.emptyDotted = mapDetails.settings.emptyDotted;
	}
}


/**
 * Loads all settings to mapDetails.settings from local storage, or load defaults from MapSettings
 * if local storage is not available.
 */
function loadSettings(){
	if (typeof(Storage) !== "undefined") {

		if(!window.localStorage.scheduledColor){
			window.localStorage.scheduledColor = MapSettings.scheduledColor;
		}
		window.document.getElementById('popupSettingsScheduledColor').value = window.localStorage.scheduledColor;
		mapDetails.settings.scheduledColor = document.getElementById('popupSettingsScheduledColor').value;

		if(!window.localStorage.actualColor){
			window.localStorage.actualColor = MapSettings.actualColor;
		}
		window.document.getElementById('popupSettingsActualColor').value = window.localStorage.actualColor;
		mapDetails.settings.actualColor = document.getElementById('popupSettingsActualColor').value;

		if(!window.localStorage.emptyColor){
			window.localStorage.emptyColor = MapSettings.emptyColor;
		}
		window.document.getElementById('popupSettingsEmptyColor').value = window.localStorage.emptyColor;
		mapDetails.settings.emptyColor = document.getElementById('popupSettingsEmptyColor').value;

		if(!window.localStorage.pathLabelSize){
			window.localStorage.pathLabelSize = 5;
		}
		window.document.getElementById('popupSettingsPathLabelSize').value = window.localStorage.pathLabelSize;
		mapDetails.settings.pathLabelSize = document.getElementById('popupSettingsPathLabelSize').value;
		mapDetails.settings.pathLabelSize = mapDetails.settings.pathLabelSize * MapSettings.pathLabelSize / 5;

		if(!window.localStorage.nodeLabelSize){
			window.localStorage.nodeLabelSize = 5;
		}
		window.document.getElementById('popupSettingsNodeLabelSize').value = window.localStorage.nodeLabelSize;
		mapDetails.settings.nodeLabelSize = document.getElementById('popupSettingsNodeLabelSize').value;
		mapDetails.settings.nodeLabelSize = mapDetails.settings.nodeLabelSize * MapSettings.nodeLabelSize / 5;

		if(!window.localStorage.nodeSize){
			window.localStorage.nodeSize = 5;
		}
		window.document.getElementById('popupSettingsNodeSize').value = window.localStorage.nodeSize;
		mapDetails.settings.nodeSize = document.getElementById('popupSettingsNodeSize').value;
		mapDetails.settings.nodeSize = mapDetails.settings.nodeSize * MapSettings.nodeSize / 5;

		if(!window.localStorage.pathSize){
			window.localStorage.pathSize = 5;
		}
		window.document.getElementById('popupSettingsPathSize').value = window.localStorage.pathSize;
		mapDetails.settings.pathSize = document.getElementById('popupSettingsPathSize').value;
		mapDetails.settings.pathSize = mapDetails.settings.pathSize * MapSettings.pathSize / 5;

		if(!window.localStorage.hasArrows){
			window.localStorage.hasArrows = MapSettings.hasArrows;
		}
		var $hasArrows = true;
		if(window.localStorage.hasArrows == 'false'){
			$hasArrows = false;
		}
		window.document.getElementById('popupSettingsHasArrows').checked = $hasArrows;
		mapDetails.settings.hasArrows = document.getElementById('popupSettingsHasArrows').checked;

		if(!window.localStorage.plotAllNodes){
			window.localStorage.plotAllNodes = MapSettings.plotAllNodes;
		}
		var $plotAllNodes = true;
		if(window.localStorage.plotAllNodes == 'false'){
			$plotAllNodes = false;
		}
		window.document.getElementById('popupSettingsPlotAllNodes').checked = $plotAllNodes;
		mapDetails.settings.plotAllNodes = document.getElementById('popupSettingsPlotAllNodes').checked;

		if(!window.localStorage.nodeColor){
			window.localStorage.nodeColor = MapSettings.nodeColor;
		}
		window.document.getElementById('popupSettingsNodeColor').value = window.localStorage.nodeColor;
		mapDetails.settings.nodeColor = document.getElementById('popupSettingsNodeColor').value;

		if(!window.localStorage.scheduledDotted){
			window.localStorage.scheduledDotted = MapSettings.scheduledDotted;
		}
		var $scheduledDotted = true;
		if(window.localStorage.scheduledDotted == 'false'){
			$scheduledDotted = false;
		}
		window.document.getElementById('popupSettingsScheduledDotted').checked = $scheduledDotted;
		mapDetails.settings.scheduledDotted = document.getElementById('popupSettingsScheduledDotted').checked;

		if(!window.localStorage.actualDotted){
			window.localStorage.actualDotted = MapSettings.actualDotted;
		}
		var $actualDotted = true;
		if(window.localStorage.actualDotted == 'false'){
			$actualDotted = false;
		}
		window.document.getElementById('popupSettingsActualDotted').checked = $actualDotted;
		mapDetails.settings.actualDotted = document.getElementById('popupSettingsActualDotted').checked;

		if(!window.localStorage.emptyDotted){
			window.localStorage.emptyDotted = MapSettings.emptyDotted;
		}
		var $emptyDotted = true;
		if(window.localStorage.emptyDotted == 'false'){
			$emptyDotted = false;
		}
		window.document.getElementById('popupSettingsEmptyDotted').checked = $emptyDotted;
		mapDetails.settings.emptyDotted = document.getElementById('popupSettingsEmptyDotted').checked;


	} else {
		console.log("No local storage support.");
	}
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
$(() => {
	checkCSV();
	loadSettings();
});

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
	mapDetails.settings.scheduledColor = document.getElementById('popupSettingsScheduledColor').value;
	mapDetails.settings.actualColor = document.getElementById('popupSettingsActualColor').value;
	mapDetails.settings.emptyColor = document.getElementById('popupSettingsEmptyColor').value;
	mapDetails.settings.scheduledDotted = document.getElementById('popupSettingsScheduledDotted').checked;
	mapDetails.settings.actualDotted = document.getElementById('popupSettingsActualDotted').checked;
	mapDetails.settings.emptyDotted = document.getElementById('popupSettingsEmptyDotted').checked;

	// For debug
	console.log(mapDetails.settings);

	$("#popupSettings").hide();
	$("#cover").hide();

	// Normalize the continuous variables
	mapDetails.settings.nodeLabelSize = mapDetails.settings.nodeLabelSize * MapSettings.nodeLabelSize / 5;
	mapDetails.settings.nodeSize = mapDetails.settings.nodeSize * MapSettings.nodeSize / 5;
	mapDetails.settings.pathSize = mapDetails.settings.pathSize * MapSettings.pathSize / 5;
	mapDetails.settings.pathLabelSize = mapDetails.settings.pathLabelSize * MapSettings.pathLabelSize / 5;

	// save settings to local storage for browser refresh
	saveSettings();

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

function openSettingsTab(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("popupSettingsTabContent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("settingsTabLinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}