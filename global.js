

var map;								// initialize the variable to hold the map

var DATA_URL = "https://dl.dropboxusercontent.com/s/eb80ajfv59csvo3/ask_test_dataset.JSON";
											// ^--- The URL where the data lives in JSON form.
var DATA_NAMES = {							// And store the titles of the columns 
	date: "date",							//	(get from carto.com once you import the dataset.)
	name: "community_name",	
	f: "fluoride",
	as: "arsenic",
	lat: "latitude",
	lng: "longitude",
	docs: "documents"
};

var EPS = 0.0001; 						// This epsilon is the acceptable difference in lat or lng 										
										//	between 2 points to classify them as occupying the same location.	

var base = {Markers: [], Popups: []};	 							// Store all info relevant to base points		

var AllData;							// Global var to hold all data.

var info_panel_open = false;			// indicates whether the info window is open`
var info_being_displayed = -1;			// global to store the current point being displayed

var POPUP_OFFSET = [88, 6]; 			// offset of the popup from the point
var BASE_Z_OFFSET = 10; 				//	and base points. 

var MAP_CENTER = [21.05,-100.65];		// Set all map starting parameters
var MAP_MIN_ZOOM = 2;
var MAP_MAX_ZOOM = 18;
var MAP_INIT_ZOOM = 10;

var MAX_LABEL_LINE_CHARS = 20;			// the max number of characters on a line in the floating labels

var STAMEN_MAP_TYPE = "terrain";		// Set which type of stamen map we want as a base layer.
										// 	options include: "terrain", "watercolor", and "toner"	
										
var ICON_URL = "https://dl.dropboxusercontent.com/s/n3wh4pazt501ckn/xButton_blue.png";
var SMALL_ICON_SIZE = [16,16]; 			// The pixel x and y that the final marker icon image is scaled to. 



