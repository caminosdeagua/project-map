

var map;								// initialize the variable to hold the map

var DATA_URL = "https://dl.dropboxusercontent.com/s/pe8xnz2h74a3q9x/project_map_dataset.json";
											// ^--- The URL where the data lives in JSON form.
var DATA_NAMES = {							// And store the titles of the columns 							//	(get from carto.com once you import the dataset.)
	name: "Community",	
	lat: "Latitude",
	lng: "Longitude",
	proj_name: "Project Name",
	proj_type: "Project Type",
	muni: "Municipality",
	site: "Site Location",
	partner: "Partner Organization",
	start_date: "Start Date",
	end_date: "End Date",
	people: "Total # of People Served",
	big_train: "Weeklong Capacity Training",
	small_train: "Small Scale Capacity Training",
	no_ceramic_systems: "# of Ceramic Filter Systems",
	no_ceramic_filters: "# of Ceramic Water Filters",
	no_biochar: "Biochar Treatment System (300L/day)",
	no_ferro: "Ferrocement RWH Systems (12,000L)",
	no_roto_small: "Rotoplas Cistern (2,500L)",
	no_roto_big: "Rotoplas Cistern (10,000L)",
	no_geomembrane: "Large Geomembrane (30,000L)",
	no_underground: "Large Underground (80,000L+)",
	contact: "Contact",
	phone: "Phone Number",
	email: "Email",
	docs: "Document",
	notes: "Notes",
	photo: "Image Link"
};

var EPS = 0.0001; 						// This epsilon is the acceptable difference in lat or lng 										
										//	between 2 points to classify them as occupying the same location.	

var base = {Markers: [], Popups: []};	 							// Store all info relevant to base points		

var AllData;							// Global var to hold all data.

var info_panel_open = false;			// indicates whether the info window is open`
var info_being_displayed = -1;			// global to store the current point being displayed

var SCROLL_TIME = 500;					// Time of auto-scroll animation.

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
var SELECTED_URL = "https://dl.dropboxusercontent.com/s/enbtx3fc6k5cwtd/projectpoint_selected.png" 
var ICON_URLS = ["https://dl.dropboxusercontent.com/s/hnluhcbhwhwlynp/projectpoint0.png",
"https://dl.dropboxusercontent.com/s/9slly25r0xtbk56/projectpoint1.png",
"https://dl.dropboxusercontent.com/s/zvjdf8h1pbyyyfi/projectpoint2.png",
"https://dl.dropboxusercontent.com/s/toumsb8ezqy8x99/projectpoint3.png",
"https://dl.dropboxusercontent.com/s/zddax2pmvkg0mgf/projectpoint4.png",
"https://dl.dropboxusercontent.com/s/vrephtwq9ohac9z/projectpoint5.png"];

BIG_CISTERN_BIN = 0;
SMALL_CISTERN_BIN = 1;
CERAMIC_SYSTEM_BIN = 2;
CERAMIC_FILTER_BIN = 3;
BIOCHAR_BIN = 4;
TRAINING_BIN = 5;
var SMALL_ICON_SIZE = [16,16]; 			// The pixel x and y that the final marker icon image is scaled to. 


