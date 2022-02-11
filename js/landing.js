/*****************************************************************
File Infomation:
	Purpose: Provide functions and callbacks
		for the landing page pop-up.
	Dependencies: structs.js, jquery.js
*****************************************************************/

/*****************************************************************
Global Variables
*****************************************************************/
var mapDetails = Object.create(MapDetails);

/*****************************************************************
Name: Landing Page Back Button Callback
Description: Go back to the map select screen
Parameters: None
Returns: None
*****************************************************************/
function landingGoBack()
{
	$(".landingOptions").hide();
	$("#landingMapSelect").show();
	$("#landingBackButton").hide();
}

/*****************************************************************
Name: Print landing page error
Description: Print an error to the landing page
Parameters:
	str: The string to be printed
Returns: None
*****************************************************************/
function landingError(str)
{
	// Check for injection
	if(/[<>]/.test(str))
	{
		throw new Error("XSS Detected");
	}

	// Put in page
	$("#landingError").first().text(str);
}

/*****************************************************************
Name: Map Select Callback
Description: Performs the necessary operations (Show/Hide) to
	the document depending on which map type was
	selected.
Parameters: None
Returns: None
*****************************************************************/
function mapSelect()
{
	// Get selected map
	var mapChoice = $("#landingMapSelectDropdown").find(":selected").val();

	// Store the selected map
	mapDetails.type = MapType.fromString(mapChoice);

	// Hide the map select screen
	$("#landingMapSelect").hide();

	// Show the back button
	$("#landingBackButton").show();

	// Select which map options to unhide
	switch(mapDetails.type)
	{
		case MapType.Empty:
			$("#landingEmptyOptions").show();
			break;
		case MapType.Ideal:
			$("#landingIdealOptions").show();
			break;
		case MapType.Actual:
			$("#landingActualOptions").show();
			break;
		// TODO: Undefined Type / default case
	}

	// For debug
	console.log(mapDetails.type);
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
Name: Load Options Callback
Description: Loads the selected options from the document based
	on which map type was selected. Calls the data processor
	when finished.
Parameters: None
Returns: None
*****************************************************************/
async function loadOptions()
{
	// Based on selected map type, grab the files passed
	var files;
	switch(mapDetails.type)
	{
		case MapType.Empty:
			files = $("#landingEmptyFileInput").prop("files");
			break;
		case MapType.Ideal:
			files = $("#landingIdealFileInput").prop("files");
			break;
		case MapType.Actual:
			files = $("#landingActualFileInput").prop("files");
			break;
		// TODO: Undefined Type / default case
	}

	if(files.length === 0)
	{
		landingError("No file specified");
		return;
	}
	// TODO: what if multiple files are passed?
	var csvFile = await readFile(files[0]);
	csvFile = csvFile.replace(/(\r)/gm, "");

	// Hide the landing popup and then the cover
	$("#landing").hide();
	$("#cover").hide();

	// Form Path Objects out of the File's Content
	var paths = [];
	var p;
	switch(mapDetails.type)
	{
		case MapType.Empty:
			csvFile.split("\n").forEach(function (item, index) {
				if (item)
				{
					p = item.split(",");
					paths.push( Object.create(Path.Empty).initialize(
						p[1], p[2], p[3], Number(p[4])
					) );
				}
			});
			break;
		case MapType.Ideal:
			csvFile.split("\n").forEach(function (item, index) {
				if (item)
				{
					p = item.split(",");
					paths.push( Object.create(Path.Ideal).initialize(
						p[0], p[1], p[2], p[3]
					) );
				}
			});
			break;
		case MapType.Actual:
			csvFile.split("\n").forEach(function (item, index) {
				if (item)
				{
					p = item.split(",");
					paths.push( Object.create(Path.Actual).initialize(
						p[0], p[1], p[2], p[3], Number(p[4])
					) );
				}
			});
			break;
		// TODO: Undefined Type / default case
	}

	// For debug
	console.log(paths);

	// Set input module's objects into MapDetails
	mapDetails.paths = paths;
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
	// Grab the centers file from user
	var files = $("#landingCentersFileInput").prop("files");

	if(files.length === 0)
	{
		landingError("No file specified");
		return;
	}

	// TODO: what if multiple files are passed?
	var csvFile = await readFile(files[0]);
	csvFile = csvFile.replace(/(\r)/gm, "");


	// Hide the centers screen
	$("#landingCentersOptions").hide();

	// Show the map types
	$("#landingMapSelect").show();

	// Form Path Objects out of the File's Content
	var centers = [];
	var p;
	csvFile.split("\n").forEach(function (item, index) {
		if (item)
		{
			p = item.split(",");
			centers.push( Object.create(ServiceCenter).initialize(
				p[1], p[2], parseFloat(p[3]), parseFloat(p[4])
			) );
		}
	});

	// For debug
	console.log(centers);

	// Set input module's objects into MapDetails
	mapDetails.centers = centers;
}