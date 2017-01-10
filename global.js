

var map;								// initialize the variable to hold the map

var DATA_URL = "https://dl.dropboxusercontent.com/s/c4aheh7i1lidgck/project_map_dataset.json";
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
	primary_contact: "Contact",
	phone: "Phone Number",
	email: "Email",
	docs: "Document",
	notes1: "Notes 1",
	notes2: "Notes 2",
	notes3: "Notes 3",
	notes4: "Notes 4",
	notes5: "Notes 5",
	photo: "Image Link",
	photo_folder: "Images Folder"
};

var EPS = 0.0001; 						// This epsilon is the acceptable difference in lat or lng 										
										//	between 2 points to classify them as occupying the same location.	

var base = {Markers: [], Popups: []};	 							// Store all info relevant to base points		

var used_indices = []; 					// stores the indices of the data
var AllData;							// Global var to hold all data.
var photos = [];						// Global array for holding all photos for quick loading

var info_panel_open = false;			// indicates whether the info window is open`
var NO_INFO = -1;						// indicates there's no info currently being displayed
var info_being_displayed = NO_INFO;		// global to store the current point being displayed
var activeMarker;						// global to hold the active marker
var selectedIcon;						// global to hold selected icon image
		
var SCROLL_TIME = 500;					// Time of auto-scroll animation.

var POPUP_OFFSET = [88, 6]; 			// offset of the popup from the point
var BASE_Z_OFFSET = 10; 				//	and base points. 

var MAP_CENTER = [21.15,-85];		// Set all map starting parameters
var MAP_MIN_ZOOM = 2;
var MAP_MAX_ZOOM = 18;
var MAP_INIT_ZOOM = 5;

var MAX_LABEL_LINE_CHARS = 20;			// the max number of characters on a line in the floating labels

var STAMEN_MAP_TYPE = "terrain";		// Set which type of stamen map we want as a base layer.
										// 	options include: "terrain", "watercolor", and "toner"	
										
var ICON_URL = "https://dl.dropboxusercontent.com/s/3tyu7ewpaqi6nem/600x600-49158.png";
var SELECTED_URL = "https://dl.dropboxusercontent.com/s/jo10pqogp5o1jv5/whitePoint.png" 
var ICON_URLS = ["https://dl.dropboxusercontent.com/s/hnluhcbhwhwlynp/projectpoint0.png",
"https://dl.dropboxusercontent.com/s/9slly25r0xtbk56/projectpoint1.png",
"https://dl.dropboxusercontent.com/s/zvjdf8h1pbyyyfi/projectpoint2.png",
"https://dl.dropboxusercontent.com/s/toumsb8ezqy8x99/projectpoint3.png",
"https://dl.dropboxusercontent.com/s/zddax2pmvkg0mgf/projectpoint4.png",
"https://dl.dropboxusercontent.com/s/vrephtwq9ohac9z/projectpoint5.png"];

var RAINWATER = 0;
var CERAMIC = 1;
var BIOCHAR = 2;


var SMALL_ICON_SIZE = [16,16]; 			// The pixel x and y that the final marker icon image is scaled to. 
var LARGE_ICON_SIZE = [24, 24];


