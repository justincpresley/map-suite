/*****************************************************************
File Infomation:
	Purpose: Detects conflicts between scheduled and actual
		routes.
*****************************************************************/

/*****************************************************************
Name: Add Conflict Bar Text
Description: Adds new row to list of conflicts
Parameters:
	text: The text to be added.
Returns: None
*****************************************************************/
function addConflictBarText(text)
{
	clearConflictBarItems();
	var item = "<div class=\"conflictbarText\">";
	item += text;
	item += "</div>";
	$("#conflictbar").append(item);
}

/*****************************************************************
Name: Add Conflict Bar Item
Description: Adds new row to list of conflicts
Parameters:
	conflict: The conflict object to be added.
Returns: None
*****************************************************************/
function addConflictBarItem(conflict)
{
	var item = "<div class=\"conflictbarItem\">";
	item += "<strong>SCD: </strong>" + conflict.scheduled.route + "</br>";
	item += "<strong>ACT: </strong>" + conflict.actual.route + "</br>"
	item += "<strong>DATE: </strong>" + conflict.actual.date
	item += "<strong> VAL: </strong>" + conflict.actual.value
	item += "</div>";
	$("#conflictbar").append(item);
}

/*****************************************************************
Name: Clear Conflict Bar Items
Description: Removes all content from the list of
	conflicts.
Parameters: None
Returns: None
*****************************************************************/
function clearConflictBarItems()
{
	$(".conflictbarItem").remove();
	$(".conflictbarText").remove();
	mapDetails.conflicts = [];
}

/*****************************************************************
Name: Uodate Conflicts
Description: Updates the conflicts bar with each conflict.
Parameters: None
Returns: None
*****************************************************************/
function updateConflicts()
{
	for(ind in mapDetails.conflicts)
	{
		addConflictBarItem(mapDetails.conflicts[ind]);
	}
}