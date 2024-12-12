////////////////////////////////////////////////////////////////////////////////
////				Stuff to be Translated 									////
////	The stuff in the next section is all of the text that appears at 	////
////	any point on the map. It's stored in simple strings for ease of 	////
////	translation. Enjoy =)												////
////////////////////////////////////////////////////////////////////////////////
var TITLE = "Mapa de Proyectos | Caminos de Agua";


var MONTHS_LONG = ["Enero", "Febrero", "Marzo",
				 "Abril", "Mayo", "Junio",
				"Julio", "Agosto", "Septiembre",
				"Octubre", "Noviembre", "Diciembre"];

var MONTH_CODES = ["Ene", "Feb", "Mar",
					"Abr", "May", "Jun",
					"Jul", "Ago", "Sep",
					"Oct", "Nov", "Dic"];

var DATE = "Fecha";

var ATTRIBUTION = 'Almacenamiento de datos con <a href="http://drive.google.com">Google Sheets</a> | <a href="https://caminosdeagua.org/en/donate">Donar</a>';

var SEE_MORE = "Más información";

var LEGEND_TITLE = "Tipos de proyecto";
var LEGEND0 = "\xa0\xa0\xa0Sistemas\xa0de\xa0captación\xa0de\xa0lluvia";
var LEGEND1 = "\xa0\xa0\xa0Filtros\xa0cerámicos";
var LEGEND2 = "\xa0\xa0\xa0Sistema\xa0de\xa0tratamiento\xa0de\xa0aguas\xa0subterráneas";
var LEGEND3 = "\xa0\xa0\xa0Sanitarios\xa0secos"
var LEGEND4 = "\xa0\xa0\xa0Otros\xa0proyectos"
var LEGEND5 = "\xa0\xa0\xa0Varios\xa0proyectos";
var LEGEND_TEXT = [LEGEND0, LEGEND1, LEGEND2, LEGEND3, LEGEND4,LEGEND5];

var BACK_BUTTON_TXT = ["Atrás hacía todos los proyectos en ",""];
var LOBBY_MESSAGE = ["<b>Haz clic en un proyecto abajo para encontrar más información<br></b>"]
var SUMMARY_TITLE = "<b>Perfiles comunitarios</b>";

var NO_PROJECTS_HDR = "Proyectos";										// Headers for lobby summary chart
var PPL_SERVED_HDR = "Personas afectadas";
var CERAMIC_HDR = "Filtros cerámicos distribuidos";
var RWH_HDR = "Capacidad de almacenamiento de agua de lluvia (litros) ";
var SUMMARY_HEADERS = [NO_PROJECTS_HDR, PPL_SERVED_HDR, RWH_HDR, CERAMIC_HDR];

//// The headers for the spreadsheet. Make sure the LHS
//// 	matches those in var LBL below, and the RHS matches
////	the column headers in the dataset.

var DATA_NAMES = {
	name: "Community",
	lat: "Latitude",
	lng: "Longitude",
	proj_name: "Nombre del proyecto",
	proj_type: "Tipo de proyecto",
	muni: "Municipality",
	site: "Localización",
	partner: "Partner Organization",
	start_date: "Start Date",
	end_date: "End Date",
	people: "Total # of People Served",
	big_train: "Weeklong Capacity Training",
	small_train: "Small Scale Capacity Training",
	no_ceramic_systems: "# of Ceramic Filter Systems",
	no_ceramic_filters: "# of Ceramic Water Filters",
	no_biochar: "Biochar Treatment System",
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
	notes: "Notas",
	photo: "Image Link",
	video: "Video Link Spanish",
	photo_folder: "Images Folder"
};

//// The labels for the info windows.
//// Make sure the handles match the ids for
////	their divs in index.html!!!! <<--- Super important!!!
var LBL = {
	proj_name: "",
	photo: "",
	photo_folder: "Ver más fotos",
	name: "Comunidad",
	muni: "Municipalidad",
	proj_type: "Tipo de proyecto",
	site: "Localización",
	dates: "Fecha(s)",
	people: "Número de beneficiarios",
	workshops: "Talleres",
	big_train: "Talleres de una semana",
	small_train: "Talleres de pequeña escala",
	no_ceramic_systems: "Sistemas de filtración cerámica",
	no_ceramic_filters: "Filtros cerámicos",
	no_biochar: "Sistemas construidos con bio carbón",
	no_ferro: "Cisternas de ferrocemento construidas",
	no_roto_small: "Cisternas de plástico pequeñas (2,500L) instaladas",
	no_roto_medium: "Cisternas de plástico medianas (5,000L) instaladas",
	no_roto_big: "Cisternas de plástico grandes (10,000L) instaladas",
	no_geomembrane: "Geomembranas instaladas",
	no_underground: "Cisternas subterráneas instaladas",
	no_rainjar: "Cántaros de lluvia (2,000L) instaladas",
	partner: "Socio(s)",
	primary_contact: "Contacto(s) principal(es)",
	contact_info: "Información de contacto",
	docs: "Más información",
	notes: "Notas"
};

var BETWEEN_DATES = " --- ";

var END_OF_HEADER = ":<br>\xa0\xa0\xa0";

// These need to match the project types in the database perfectly!
RAIN_PROJ = "Cosecha de agua de lluvia";
CERAMIC_PROJ = "Filtros cerámicos";
BIOCHAR_PROJ = "Sistema de tratamiento con biocarbón";
GTS_PROJ = "Sistema de Tratamiento de Agua Subterráneas";
DRY_TOILET_PROJ = "Sanitarios secos";
BORDO_PROJ = "Bordo";
OTHER_PROJ = "Otro";

var EASTER_EGG_TXT = {			// NEED TO TRANSLATE!!!
	rainL: "Liters of rainwater capacity installed",
	rainSys: "Number of rainwater systems installed",
	filterSys: "Number of ceramic filter systems distributed",
	filterCar: "Number of ceramic filter cartridges distributed",
	filterL: "Liters of ceramic filter capability distributed (5 years x 24 L / day per filter)",
	ppl: "Total number of people impacted",
	communities: "Total number of communities impacted",
	partners: "List of partner organizations",
	partnerNames: "All partners",
	projects: "Total number of projects completed",
	other: "Total number of 'Other' types of projects",
	otherNames: "Names of 'Other' projects",
	schools: "Number of projects in schools",
	shortShops: "Number of short capacity building workshops completed",
	longShops: "Number of long capacity building workshops completed",
	laborHours: "Total number of person-hours of volunteer labor (8 hrs per person per day x 5 people over 5 days)"
}

var DISPLAY_TITLE = "<b>Mapa de proyectos</b>";
var DISPLAY_MSG = "Haz clic para saber más de nuestro trabajo";
var ONGOING_PROJECT = "Presente";
