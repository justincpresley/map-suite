/*****************************************************************
File Infomation:
	Purpose: Provide functionality for exporting to PDF
	Dependencies:
		lib/html2canvas.min.js
		lib/jspdf.umd.min.js
		lib/purify.min.js
*****************************************************************/

/*****************************************************************
Name: Export Window
Description: Export the window and prompts user for download
Parameters: None
Returns: None
*****************************************************************/
function exportWindow()
{
	//Create PDf from HTML...
	let HTML_Width = $("#mapWrapper").width();
	let HTML_Height = $("#mapWrapper").height();
	let top_left_margin = 15;
	let PDF_Width = HTML_Width + (top_left_margin * 2);
	var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
	let canvas_image_width = HTML_Width;
	let canvas_image_height = HTML_Height;

	html2canvas($("#mapWrapper")[0]).then(async (canvas) => {
		var imgData = canvas.toDataURL("image/jpeg", 1.0);
		let pdf = new jspdf.jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
		pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);

		var src = $("#topbarFiltersSrc").val();
		var dst = $("#topbarFiltersDes").val();
		var mapTypes = "";

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

		var text = "Map Types Shown: " + mapTypes + "<br />" + "Origin: " + src + " Destination: " + dst;

		$(document.body).append("<p id=\"tempExportText\">" + text + "</p>");

		let nHTML_Width = $("#tempExportText").width();
		let nHTML_Height = $("#tempExportText").height();
		let nPDF_Width = nHTML_Width + (top_left_margin * 2);
		let ncanvas_image_width = nHTML_Width;
		let ncanvas_image_height = nHTML_Height;

		html2canvas($("#tempExportText")[0]).then((canvas) => {
			var imgData = canvas.toDataURL("image/jpeg", 1.0);
			pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, ncanvas_image_width, ncanvas_image_height);

			pdf.save("map.pdf");
		});

		$("#tempExportText").remove();
	});
}