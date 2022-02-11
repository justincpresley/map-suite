/*****************************************************************
File Infomation:
	Purpose: Define valuable objects that will be used by all
    modules. This reduces the amount of tedious collaboration
    within our team.
	Dependencies: None
*****************************************************************/



/*****************************************************************
Name: A Service Center Object
Description: This object holds all information relating to a
  service center.
Parameters: None
Returns: A Object containing Service Center information.
Object-Function (initialize):
  Parameters: a string for the symbol ("CKVL"), a string for the
    full name ("Cookeville"), and two numeric values for the
    the latitude and longitude.
  Returns: A filled out Service Center Object.
*****************************************************************/
const ServiceCenter = {
  symbol: "",
  name: "",
  latitude: 0,
  longitude: 0,

  initialize: function(symbol, name, latitude, longitude)
	{
    this.symbol = symbol;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
		return this;
  },
};
// TODO: THIS WILL BE DELETED
// Example of Usage
//const sc = Object.create(ServiceCenter).initialize("CKVL", "Cookeville City", 56.21, 704.14);
//console.log(sc);



/*****************************************************************
Name: A MapType Object (Enum)
Description: This object holds information about which map type
	is selected or used.
Parameters: None
Returns: A Object containing information about a certain map type.
*****************************************************************/
const MapType = Object.freeze({
	Undefined: 0,
	Ideal: 1,
  Actual: 2,
  Empty: 3,

	fromString: function(mapstr)
	{
		switch(mapstr)
		{
			case "empty":
				return this.Empty;
			case "ideal":
				return this.Ideal;
			case "actual":
				return this.Actual;
			default:
				return this.Undefined;
		}
  },
});
// TODO: THIS WILL BE DELETED
// Example of Usage
//let mtype = MapType.Ideal;
//let mtype = MapType.fromString("ideal");
//console.log(mtype); // prints 1



/*****************************************************************
Name: A Namespace of Path Objects
Description: Serveral objects that have different Parameters
	based on the MapType. This makes it so that we know that every
	MapType will be providing an array of Paths.
Parameters: None
Returns: A Object that is a Path of a certain MapType
Object-Function (initialize):
  Parameters: All the variables of a specific Path object.
		The 'date' vars are Date() Objects, however initialize()
		automatically creates this object given a string format.
		"2013-05-03", YYYY-MM-DD.
		'route' vars are strings containing a list of symbols
		seperated by a -.
  Returns: A filled out Service Center Object.
*****************************************************************/
const Path = {
  Ideal: {
		date: null,
	  sourceSymbol: "",
	  targetSymbol: "",
	  route: "",

		initialize: function(date, source, target, route)
		{
			var parts = date.split('-');
			this.date = new Date(parts[0], parts[1] - 1, parts[2]);
	    this.sourceSymbol = source;
	    this.targetSymbol = target;
			this.route = route;
			return this;
	  },
	},

	Actual: {
		date: null,
	  sourceSymbol: "",
	  targetSymbol: "",
	  route: "",
		value: 0,

		initialize: function(date, source, target, route, value)
		{
			var parts = date.split('-');
			this.date = new Date(parts[0], parts[1] - 1, parts[2]);
	    this.sourceSymbol = source;
	    this.targetSymbol = target;
			this.route = route;
			this.value = value;
			return this;
	  },
	},

	Empty: {
	  sourceSymbol: "",
	  targetSymbol: "",
	  route: "",
		value: 0,

		initialize: function(source, target, route, value)
		{
	    this.sourceSymbol = source;
	    this.targetSymbol = target;
			this.route = route;
			this.value = value;
			return this;
	  },
	},
};
// TODO: THIS WILL BE DELETED
// Example of Usage
//const sc = Object.create(Path.Ideal).initialize("2013-05-03", "CKVL", "NASH", "CKVL-NASH");
//console.log(sc);



/*****************************************************************
Name: A User Options Object
Description: This object holds all user settings information.
Parameters: None
Returns: A Object containing User Options information.
*****************************************************************/
const UserOptions = {
	// turning off values
	// turning off arrows
	// etc
};



/*****************************************************************
Name: A Map Details Object
Description: This object holds all information besides forming
	US static image of what is displayed on the map.
Parameters: None
Returns: A Object containing Map Details information.
*****************************************************************/
const MapDetails = {
	type: MapType.Undefined,
  centers: [],
  paths: [],
  options: null,
};