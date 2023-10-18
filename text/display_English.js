////////////////////////////////////////////////////////////////////////////////
////				Stuff to be Translated 									////
////	The stuff in the next section is all of the text that appears at 	////
////	any point on the map. It's stored in simple strings for ease of 	////
////	translation. Enjoy =)												////
////////////////////////////////////////////////////////////////////////////////
var TITLE = "Proejct Map | Caminos de Agua";

var MONTHS_LONG = ["January", "February", "March",
					"April", "May", "June",
					"July", "August", "September",
					"October", "November", "December"];

var MONTH_CODES = ["Jan", "Feb", "Mar",
					"Apr", "May", "Jun",
					"Jul", "Aug", "Sep",
					"Oct", "Nov", "Dec"];

var DATE = "Date";

var ATTRIBUTION = 'Data hosting on <a href="http://drive.google.com">Google Sheets</a> | <a href="https://caminosdeagua.org/en/donate">Donate</a>';

var SEE_MORE = "More info";

var LEGEND_TITLE = "Project types"
var LEGEND0 = "\xa0\xa0\xa0Rainwater\xa0harvesting\xa0systems";
var LEGEND1 = "\xa0\xa0\xa0Ceramic\xa0water\xa0filters";
var LEGEND2 = "\xa0\xa0\xa0Biochar\xa0water\xa0treatment";
var LEGEND3 = "\xa0\xa0\xa0Other\xa0projects"
var LEGEND4 = "\xa0\xa0\xa0Multiple\xa0projects";
var LEGEND_TEXT = [LEGEND0, LEGEND1, LEGEND2, LEGEND3, LEGEND4];

var BACK_BUTTON_TXT = ["Back to all "," projects"];
var LOBBY_MESSAGE = ["<b>Click on a project below for more information<br></b>"]
var SUMMARY_TITLE = "<b>Community profile</b>";

var NO_PROJECTS_HDR = "Projects";										// Headers for lobby summary chart
var PPL_SERVED_HDR = "People impacted";
var CERAMIC_HDR = "Ceramic filters distributed";
var RWH_HDR = "Liters of rainwater capacity installed";
var SUMMARY_HEADERS = [NO_PROJECTS_HDR, PPL_SERVED_HDR, RWH_HDR, CERAMIC_HDR];

//// The headers for the spreadsheet. Make sure the LHS
//// 	matches those in var LBL below, and the RHS matches
////	the column headers in the dataset.

var DATA_NAMES = {
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
	no_roto_medium: "Rotoplas Cistern (5,000L)",
	no_roto_big: "Rotoplas Cistern (10,000L)",
	no_geomembrane: "Large Geomembrane (30,000L)",
	no_underground: "Large Underground (80,000L+)",
	no_rainjar: "Rain Jar (2,000L)",
	primary_contact: "Contact",
	phone: "Phone Number",
	email: "Email",
	docs: "Document",
	notes: "Notes",
	photo: "Image Link",
	video: "Video Link",
	photo_folder: "Images Folder"
};

//// The labels for the info windows.
//// Make sure the handles match the ids for
////	their divs in index.html!!!! <<--- Super important!!!
var LBL = {
	proj_name: "",
	photo: "",
	video: "",
	photo_folder: "View more photos",
	name: "Community",
	muni: "Municipality",
	proj_type: "Project type",
	site: "Site",
	dates: "Date(s)",
	people: "Number of people served",
	workshops: "Workshops",
	big_train: "Weeklong capacity trainings",
	small_train: "Small-scale capacity trainings",
	no_ceramic_systems: "Ceramic filtration systems",
	no_ceramic_filters: "Ceramic filter cartridges",
	no_biochar: "Biochar systems built",
	no_ferro: "Ferrocement cisterns built",
	no_roto_small: "Small plastic cisterns (2,500L) installed",
	no_roto_medium: "Medium plastic cisterns (5,000L) installed",
	no_roto_big: "Large plastic cisterns (10,000L) installed",
	no_geomembrane: "Large geomembranes installed",
	no_underground: "Underground cisterns installed",
	no_rainjar: "Rainjars (2,000L) installed",
	partner: "Partner(s)",
	primary_contact: "Primary contact(s)",
	contact_info: "Contact info",
	docs: "More information",
	notes: "Notes"
};

var BETWEEN_DATES = " --- ";

var END_OF_HEADER = ":<br>\xa0\xa0\xa0";

// These need to match the project types in the database perfectly!
RAIN_PROJ = "Rainwater Harvesting";
CERAMIC_PROJ = "Ceramic Water Filter";
BIOCHAR_PROJ = "Biochar Treatment Systems (330L/d)";
OTHER_PROJ = "Other";

var EASTER_EGG_TXT = {
	rainL: "Liters of rainwater capacity installed",
	rainSys: "Number of rainwater systems installed",
	filterSys: "Number of ceramic filter systems distributed",
	filterCar: "Number of ceramic filter cartridges distributed",
	filterL: "Liters of ceramic filter capability distributed (5 years x 24 L / day per filter)",
	ppl: "Total number of people impacted",
	communities: "Total number of communities impacted",
	partners: "Total number of partner orgs",
	partnerNames: "All partners",
	projects: "Total number of projects completed",
	other: "Total number of 'Other' types of projects",
	otherNames: "Names of 'Other' projects",
	schools: "Number of projects in schools",
	shortShops: "Number of short capacity building workshops completed",
	longShops: "Number of long capacity building workshops completed",
	laborHours: "Total number of person-hours of volunteer labor (8 hrs per person per day x 5 people over 5 days)"
}

var DISPLAY_TITLE = "<b>Project Map</b>";
var DISPLAY_MSG = "Click to learn more about our work";
var ONGOING_PROJECT = "Present";
