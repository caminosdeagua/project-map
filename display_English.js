////////////////////////////////////////////////////////////////////////////////
////				Stuff to be Translated 									////
////	The stuff in the next section is all of the text that appears at 	////
////	any point on the map. It's stored in simple strings for ease of 	////
////	translation. Enjoy =)												////
////////////////////////////////////////////////////////////////////////////////
var TITLE = "Proejct Map | Caminos de Agua";
var MONTHS = ["Jan", "Feb", "Mar", 		// Array of names of months for displaying
			"Apr", "May", "Jun", 		//	the date in an accessible, clear format,
			"Jul", "Aug", "Sep", 		// 	even for silly US people who choose to put 
			"Oct", "Nov", "Dec"];		//	the month first. Ugh. 


var DATE = "Date";

var ATTRIBUTION = 'Data hosting on <a href="http://www.dropbox.com">Dropbox</a> legends by <a href="http://www.carto.com">Carto</a>';

var SEE_MORE = "More info";

var LEGEND_TITLE = "Project types"
var LEGEND0 = "\xa0\xa0\xa0Rainwater\xa0Harvesting\xa0Systems";
var LEGEND1 = "\xa0\xa0\xa0Ceramic\xa0Water\xa0Filters";
var LEGEND2 = "\xa0\xa0\xa0Biochar\xa0Water\xa0Treatment";
var LEGEND_TEXT = [LEGEND0, LEGEND1, LEGEND2];

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

//// The labels for the info windows. 
//// Make sure the handles match the ids for 
////	their divs in index.html!!!! <<--- Super important!!!
var LBL = {
	proj_name: "",
	photo: "",
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
	no_roto_big: "Large plastic cisterns (10,000L) installed",
	no_geomembrane: "Large geomembranes installed",
	no_underground: "Underground cisterns installed",
	partner: "Partner(s)",
	primary_contact: "Primary contact(s)",
	contact_info: "Contact info",
	docs: "More information",
	notes1: "Notes"
};

var BETWEEN_DATES = " - ";


var END_OF_HEADER = ":<br>\xa0\xa0\xa0";
