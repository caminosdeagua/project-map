////////////////////////////////////////////////////////////////////////////////
////				Stuff to be Translated 									////
////	The stuff in the next section is all of the text that appears at 	////
////	any point on the map. It's stored in simple strings for ease of 	////
////	translation. Enjoy =)												////
////////////////////////////////////////////////////////////////////////////////

var MONTHS = ["Jan", "Feb", "Mar", 		// Array of names of months for displaying
			"Apr", "May", "Jun", 		//	the date in an accessible, clear format,
			"Jul", "Aug", "Sep", 		// 	even for silly US people who choose to put 
			"Oct", "Nov", "Dec"];		//	the month first. Ugh. 


var DATE = "Date";

var ATTRIBUTION = 'Data hosting on <a href="http://www.dropbox.com">Dropbox</a> legends by <a href="http://www.carto.com">Carto</a>';

var SEE_MORE = "More info here!"

var NO_DATA_MSG = "NO DATA HERE, PISS OFF, MOFO!"

var LEGEND_TITLE = "Types of projects"
var LEGEND0 = "\xa0\xa0\xa0Large\xa0Cisterns\xa0(10,000\xa0liters\xa0or\xa0more)";
var LEGEND1 = "\xa0\xa0\xa0Small\xa0cisterns\xa0(less\xa0than\xa010,000\xa0liters)\xa0with\xa0ceramic\ntreatment\xa0systems";
var LEGEND2 = "\xa0\xa0\xa0Ceramic\xa0treatment\xa0systems";
var LEGEND3 = "\xa0\xa0\xa0Ceramic\xa0filters\xa0(system\xa0not\xa0included)";
var LEGEND4 = "\xa0\xa0\xa0Biochar\xa0systems";
var LEGEND5 = "\xa0\xa0\xa0Trainings\xa0with\xa0no\xa0installation";
var LEGEND_TEXT = [LEGEND0, LEGEND1, LEGEND2, LEGEND3, LEGEND4, LEGEND5];

//// The labels for the info windows. 
//// Make sure the handles match the ids for 
////	their divs in index.html!!!! <<--- Super important!!!
var LBL = {
	proj_name: "",
	photo: "",
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
	no_roto_large: "Large plastic cisterns (10,000L) installed",
	no_geomembrane: "Large geomembranes installed",
	no_underground: "Underground cisterns installed",
	partner: "Partner(s)",
	primary_contact: "Primary contact(s)",
	contact_info: "Contact info",
	docs: "More information",
	notes: "Notes"
};



var END_OF_HEADER = ":<br>\xa0\xa0\xa0";
