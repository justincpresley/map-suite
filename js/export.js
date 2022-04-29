/*****************************************************************
File Infomation:
	Purpose: Provide functionality for exporting to PDF
	Dependencies:
		lib/html2canvas.min.js
		lib/jspdf.umd.min.js
		lib/purify.min.js
*****************************************************************/

/*****************************************************************
Name: Element to Image Data
Description: Uses HTML2Canvas to convert an element to an
	image for use in the PDF.
Parameters: JQuery Element
Returns: Promise (The Image Data)
*****************************************************************/
function elementToImage(element)
{
	return new Promise((resolve, reject) => {
		html2canvas(element[0]).then((canvas) => {
			var imgData = canvas.toDataURL("image/jpeg", 1.0);
			resolve(imgData);
		}).catch((e) => {
			reject(e);
		});
	});
}

/*****************************************************************
Name: Generate Text
Description: Generates the text for the PDF
Parameters: None
Returns: The image data of the text
*****************************************************************/
async function generateText()
{
	// Get source and destination
	var src = $("#topbarFiltersSrc").val();
	var dst = $("#topbarFiltersDes").val();
	var mapTypes = "";

	// Get which map types are present
	if($("#sidebarEmptyShow").is(':checked'))
	{
		mapTypes += "Empty";
	}

	if($("#sidebarScheduledShow").is(':checked'))
	{
		if(mapTypes.length != 0)
		{
			mapTypes += ", ";
		}

		mapTypes += "Scheduled";
	}

	if($("#sidebarActualShow").is(':checked'))
	{
		if(mapTypes.length != 0)
		{
			mapTypes += ", ";
		}

		mapTypes += "Actual";
	}

	// Default case
	if(mapTypes == "")
	{
		mapTypes = "NONE";
	}

	// Add text to document
	var text = "Map Types Shown: " + mapTypes + "<br />" + "Origin: " + src + " Destination: " + dst;

	if($("#sidebarEmptyShow").is(':checked'))
	{
		text = "Map Types Shown: " + mapTypes + "<br /> Origin: ALL Destination: ALL";
	}

	$(document.body).append("<div id=\"tempExportText\" style=\"text-align:center;width: 1000px;\"><p>" + text + "</p></div>");

	// Render and return
	return await elementToImage($("#tempExportText"));
}

/*****************************************************************
Name: Generate Conflicts
Description: Generates the conflict table for the PDF
Parameters: None
Returns: The image data of the table
*****************************************************************/
async function generateConflicts()
{
	// Create table
	var conflictsHTML = `
		<div id=\"tempExportConflicts\" style=\"display:inline-block;text-align:center;\">
			<h1>Conflicting Routes</h1>
			<table>
				<tr>
					<th>Scheduled</th>
					<th>Actual</th>
					<th>Date</th>
				</tr>`;
	for(var i in mapDetails.conflicts)
	{
		var conflict = mapDetails.conflicts[i];
		conflictsHTML += "<tr><td>" +
			conflict["scheduled"]["route"] +
			"</td><td style=\"padding-left:10px;\">" +
			conflict["actual"]["route"] +
			"</td><td style=\"padding-left:10px;\">" +
			conflict["actual"]["date"] +
			"</td></tr>";
	}

	conflictsHTML += "</table></div>"

	// Append to document
	$(document.body).append(conflictsHTML);

	// Render and return
	return await elementToImage($("#tempExportConflicts"));
}

/*****************************************************************
Name: Export Window
Description: Export the window and prompts user for download
Parameters: None
Returns: None
*****************************************************************/
async function exportWindow()
{
	// Create PDf from HTML...

	// Get image data
	var mapImgData = await elementToImage($("#mapWrapper"));
	var textImgData = await generateText();
	var conflictsImgData = await generateConflicts();

	// Calculations
	var mapPDFWidth = 8.5;
	var HTML_Map_Width = $("#mapWrapper").width();
	var HTML_Map_Height = $("#mapWrapper").height();
	var mapAspectRatio = HTML_Map_Height / HTML_Map_Width;

	var textPDFWidth = 11;
	var HTML_Text_Width = $("#tempExportText").width();
	var HTML_Text_Height = $("#tempExportText").height();
	var textAspectRatio = HTML_Text_Height / HTML_Text_Width;

	var conflictsPDFWidth = 1.5;
	var HTML_Conflicts_Width = $("#tempExportConflicts").width();
	var HTML_Conflicts_Height = $("#tempExportConflicts").height();
	var conflictsAspectRatio = HTML_Conflicts_Height / HTML_Conflicts_Width;

	// Static margins
	var mapMargin = 0.5;
	var textMargin = 7;
	var conflictsMarginX = 9.25;
	var conflictsMarginY = 1;

	// Compile PDF
	var pdf = new jspdf.jsPDF('l', 'in', [8.5, 11]);
	pdf.addImage(mapImgData, 'JPG', mapMargin, mapMargin, mapPDFWidth, mapPDFWidth * mapAspectRatio);
	pdf.addImage(textImgData, 'JPG', 0, textMargin, textPDFWidth, textPDFWidth * textAspectRatio);
	pdf.addImage(conflictsImgData, 'JPG', conflictsMarginX, conflictsMarginY, conflictsPDFWidth, conflictsPDFWidth * conflictsAspectRatio);
	pdf.save("map.pdf");

	// Clean up
	$("#tempExportText").remove();
	$("#tempExportConflicts").remove();
}