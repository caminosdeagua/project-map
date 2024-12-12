var map;								// initialize the variable to hold the map

var EPS = 0.0001; 						// This epsilon is the acceptable difference in lat or lng
										//	between 2 points to classify them as occupying the same location.

var base = {Markers: [], Popups: []};	 							// Store all info relevant to base points

var used_indices = []; 					// stores the indices of the data
var AllData;							// Global var to hold all data.
var photos = [];						// Global array for holding all photos for quick loading

var lobby_active = false;				// indicates whether the current info on the info panel is the lobby
var info_panel_open = false;			// indicates whether the info window is open`
var NO_INFO = -1;						// indicates there's no info currently being displayed
var info_being_displayed = NO_INFO;		// global to store the current point being displayed
var activeMarker;						// global to hold the active marker
var selectedIcon;						// global to hold selected icon image
var active_marker_on = false;			// indicated whether the selected-point-marker is being displayed

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

var SELECTED_URL = "https://caminosdeagua.github.io/project-map/img/whitePoint.png";
var ICON_URLS = ["https://caminosdeagua.github.io/project-map/img/projectpoint0.png",
"https://caminosdeagua.github.io/project-map/img/projectpoint1.png",
"https://caminosdeagua.github.io/project-map/img/projectpoint2.png",
"https://caminosdeagua.github.io/project-map/img/projectpoint3.png",
"https://caminosdeagua.github.io/project-map/img/projectpoint4.png",
"https://caminosdeagua.github.io/project-map/img/opaqeWhitePoint.png"];


var RAINWATER = 0;						// Bins for determining point color
var CERAMIC = 1;
//var BIOCHAR = 2;
var OTHER = 4;
var VARIOUS = 5;
var GTS = 2;
var DRY_TOILET = 3;
//var BORDO = 7;

var ENGLISH_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


var SMALL_ICON_SIZE = [16,16]; 			// The pixel x and y that the final marker icon image is scaled to.
var LARGE_ICON_SIZE = [24, 24];

var X_OFFSET_FROM_SCROLLBAR = 5; 		// the x-button to close the info panel/lobby is offset from the scrollbar by this many pixels

var LITERS_DAY = 24; 					// Data on ceramic filters, see totalCeramic() function
var YEARS_OF_FILTER_LIFE = 5;
var DAYS_YEAR = 365.25;

var HRS_PER_DAY = 8;					// Assumptions on constructing a 12,000 L ferro cement cistern
var DAYS_PER_CISTERN = 5;
var PPL_PER_CISTERN = 5;

var DATA_URL = "https://docs.google.com/spreadsheets/d/1P6Obxu21IhjQFcIBh2N4Cv6fJaMmAyfELEs2tfFWLGI/edit?usp=sharin";
var ERROR_MSG_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/2853893/lg9a8s?toEmail=true';

var DISPLAY_BOX_WIDTH_MOBILE = "85%";	// width of display box on mobile/tablet
