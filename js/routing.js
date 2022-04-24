/*****************************************************************
File Infomation:
	Purpose: To determine all possible service centers between
        two selected destinations and passes those items to the
        renderer.
*****************************************************************/

function serviceAssociation(route)
{
    var serviceArr = [];

    for(i = 0; i < route.length; i++)
    {
        for(centerIdx in mapDetails.centers)
        {
            //console.info("Comparing center symbol, ", mapDetails.centers[centerIdx].symbol, ", and route value, ", route[i], "." );
            if(mapDetails.centers[centerIdx].symbol == route[i])
            {
                //console.log("Pass.");
                serviceArr.push(mapDetails.centers[centerIdx]);
            }
        }
    }

    //console.log(serviceArr);
    return serviceArr;
}

function fastServiceAssociation(route)
{
    var serviceArr = [];
    for (i = 0; i < route.length; i++)
    {
        serviceArr.push(mapDetails.centersObj[route[i]]);
        // doesn't work, in need of service center symbol index obj
    }
    return serviceArr
}

function routeProcessing()
{
    console.info("!!routeProcessing trigger");
    var srcSelection = $("#topbarFiltersSrc").val();
    console.log("->srcSelection: ", srcSelection);
    var desSelection = $("#topbarFiltersDes").val();
    console.log("->desSelection: ", desSelection);

    var startDate = $("#topbarFiltersDateFrom").val()
    console.log("->startDate: ", startDate);
    var endDate = $("#topbarFiltersDateTo").val()
    console.log("->endDate: ", endDate);

    //Values for which maps to render.
    var renderAllSvc = mapDetails.settings.plotAllNodes;
    var renderScheduled = mapDetails.render_scheduled;
    console.log("-->renderScheduled: ", renderScheduled);
    var renderActual = mapDetails.render_actual;
    console.log("-->renderActual: ", renderActual);
    var renderEmpty = mapDetails.render_empty;
    console.log("-->renderEmpty: ", renderEmpty);

    clearMapBuffers(); //remove items already on the map

    if (renderAllSvc == true)
    {
        for(var centerIdx in mapDetails.centers)
        {
            addServiceCenter(mapDetails.centers[centerIdx]);
        }
    }
    if (renderScheduled == true)
    {
        console.log("Processing Scheduled Map");
        console.log(mapDetails.scheduled_paths);
        for(var centerIdx in mapDetails.scheduled_paths) // jog through scheduled_paths
        {
            //console.log("Comparing if:", mapDetails.scheduled_paths[centerIdx].date, " is between ", startDate, " and ", endDate);
            if (mapDetails.scheduled_paths[centerIdx].date >= startDate && mapDetails.scheduled_paths[centerIdx].date <= endDate)
            {
                //console.log("Comparing sources:", mapDetails.scheduled_paths[centerIdx].sourceSymbol, ", ", srcSelection, " and targets: ", mapDetails.scheduled_paths[centerIdx].targetSymbol, ", ", desSelection);
                if(mapDetails.scheduled_paths[centerIdx].sourceSymbol == srcSelection && desSelection == "ALL")
                {
                    for(var centerIdx in mapDetails.scheduled_paths)
                    {
                        var splitRoute = mapDetails.scheduled_paths[centerIdx].route.split('-'); //Breaking the route string into an array
                        //console.log(splitRoute);
                        var tempServArray = fastServiceAssociation(splitRoute); // Associating the results of the split with ServiceCenter objects
                        //console.log(tempServArray);
                        for(var j = 0; j < tempServArray.length; j++)
                        {
                            addServiceCenter(tempServArray[j]); //dotting the map
                            if( j != tempServArray.length-1) // dont want to draw a line from the beginning to the beginning
                            {
                                addRoute(tempServArray[j].symbol, tempServArray[j+1].symbol, "", MapType.Scheduled); //drawing the lines
                            }
                        }
                    }
                }
                else if (mapDetails.scheduled_paths[centerIdx].sourceSymbol == srcSelection && mapDetails.scheduled_paths[centerIdx].targetSymbol == desSelection) //Comparing both Src and Des
                {
                    var splitRoute = mapDetails.scheduled_paths[centerIdx].route.split('-'); //Breaking the route string into an array
                    //console.log(splitRoute);
                    var tempServArray = fastServiceAssociation(splitRoute); // Associating the results of the split with ServiceCenter objects
                    //console.log(tempServArray);
                    for(var j = 0; j < tempServArray.length; j++)
                    {
                        addServiceCenter(tempServArray[j]); //dotting the map
                        if( j != tempServArray.length-1) // dont want to draw a line from the beginning to the beginning
                        {
                            addRoute(tempServArray[j].symbol, tempServArray[j+1].symbol, "", MapType.Scheduled); //drawing the lines
                        }
                    }
                }
            }
        }
    }
    if (renderActual == true)
    {
        console.log("Processing Actual Map");
        //console.log(mapDetails.actual_paths);
        for(var centerIdx in mapDetails.actual_paths) // jog through actual_paths
        {
            //console.log("Comparing if:", mapDetails.actual_paths[centerIdx].date, " is between ", startDate, " and ", endDate);
            if (mapDetails.actual_paths[centerIdx].date >= startDate && mapDetails.actual_paths[centerIdx].date <= endDate) // Seeing if the date of the given route is between the two supplied by the user
            {
                //console.log("Comparing sources:", mapDetails.actual_paths[centerIdx].sourceSymbol, ", ", srcSelection, " and targets: ", mapDetails.actual_paths[centerIdx].targetSymbol, ", ", desSelection);
                if(mapDetails.actual_paths[centerIdx].sourceSymbol == srcSelection && desSelection == "ALL")
                {
                    for(var centerIdx in mapDetails.actual_paths)
                    {
                        var splitRoute = mapDetails.actual_paths[centerIdx].route.split('-'); //Breaking the route string into an array
                        //console.log(splitRoute);
                        var tempServArray = fastServiceAssociation(splitRoute); // Associating the results of the split with ServiceCenter objects
                        //console.log(tempServArray);
                        for(var j = 0; j < tempServArray.length; j++)
                        {
                            addServiceCenter(tempServArray[j]); //dotting the map
                            if( j != tempServArray.length-1) // dont want to draw a line from the beginning to the beginning
                            {
                                addRoute(tempServArray[j].symbol, tempServArray[j+1].symbol, "", MapType.Actual); //drawing the lines
                            }
                        }
                    }
                }
                else if (mapDetails.actual_paths[centerIdx].sourceSymbol == srcSelection && mapDetails.actual_paths[centerIdx].targetSymbol == desSelection) //Comparing both Src and Des
                {    
                    var splitRoute = mapDetails.actual_paths[centerIdx].route.split('-'); //Breaking the route string into an array
                    //console.log(splitRoute);
                    var tempServArray = fastServiceAssociation(splitRoute); // Associating the results of the split with ServiceCenter objects
                    //console.log(tempServArray);
                    for(var j = 0; j < tempServArray.length; j++)
                    {
                        addServiceCenter(tempServArray[j]); //dotting the map
                        if( j != tempServArray.length-1) // dont want to draw a line from the beginning to the beginning
                        {
                            addRoute(tempServArray[j].symbol, tempServArray[j+1].symbol, "", MapType.Actual); //drawing the lines
                        }
                    }
                }
            }
        }
    }
    if(renderEmpty == true)
    {
        console.log("Processing Empty Map");
        console.log(mapDetails.empty_paths);
        for(var edgeIdx in mapDetails.empty_paths)
        {
            var edge = mapDetails.empty_paths[edgeIdx]; // because the empty paths have no routes, we have to make them ourselves
            var origin;
            var destination;

            for(var i = 0; i < mapDetails.centers.length; i++)
            {
                if(mapDetails.centers[i].symbol == edge.sourceSymbol)
                {
                    origin = mapDetails.centers[i];
                }
                
                if(mapDetails.centers[i].symbol == edge.targetSymbol)
                {
                    destination = mapDetails.centers[i];
                }
            }

            if(origin != undefined && desSelection != undefined)
            {
                addServiceCenter(origin);
                addServiceCenter(destination);
                addRoute(origin.symbol, destination.symbol, edge.value.toString(), MapType.Empty);
            }   
        }
    }

    render();
    console.info("!!routeProcessing finish");
}