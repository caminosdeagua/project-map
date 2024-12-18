////////////////////////////////////////////////////////////////////////////////
// 											scripts.js
//
// 	Holds any javascript functions necessary for basic opperation universal
// 	to all pages of the Caminos de Agua project-map.
//
//	General description: This map shows all the projects worked on by the NGO
//		Caminos de Agua. Data is read in from a public
//		Google Sheet (using the Google Visualization API)
//		and plotted over stamen basemap tiles using leaflet's open source
//		javascript library. When individual data points are selected, a window
//		is opened to display various data about the selected project site.
//		If the site has multiple projects, the opened data is called a "lobby"
//		from which the user can navigate to a specific project. The specific project
//		data, whether from an individual point or from a lobby, is displayed in
//		the "info panel."
//
//	-- aaron krupp 22-apr-2018
//
////////////////////////////////////////////////////////////////////////////////
//
// 	TABLE OF CONTENTS:
//
// 	1. init():
//			Calls other specific initialization functions.
//
// 	2. fillText():
//			Fills in the text of the appropriate language.
//
// 	3. fillCounters():
//			Fills the spinning project summary counters with the appropriate values
//
// 	4. initMap():
//			Initializes the leaflet map object
//
// 	5. applyBaseMap():
//			Applies the appropriate basemap tiles
//
//	6. adjustXLocation():
//			Adjusts the location of the closing-x-mark in the lobby/info panel to
//			accomodate different scrollbar widths on different browsers
//
//	7. loadData():
//			Loads the data from googleSheets and formats it as a JSON.
//
//	8. plotData(data);
//			Plots the passed data, formatted as a JSON.
//
//	8. getBin(data, i):
//			figure out which color to make the point represented by the i-th row
//			in the json dataset, data.
//
//	9. openPanel(id) / closePanel(id):
//			open or close the data panel for id = "info_panel" or "lobby"
//
//	10. showInfo(z):
//			on the information panel, display the correct information for the z-th
//			row of the dataset
//
//	11. showLobby(z):
//			Displays the lobby (used when a single community has >1 project.) The
//			lobby contains summary info about all of the communities projects. This
//			function displays the lobby for the z-th data point.
//
//	12. openFromLobby(z):
//			When a project is clicked from the lobby, this opens the z-th info panel
//			and displays the appropriate information
//
// 	13. getLabel(data, i):
//			gets the appropriate label for the i-th point in dataset "data"
//
//	14. removePoint(i):
//			removes the i-th point from the map
//
//	15. fadeIn(el) / fadeOut(el, threshhold):
//			fades in or out the element "el" using the appropriate opacity threshhold
//
//	16. onKeypress / goBack(key):
//			checks to see if the keypress was "esc"
//			and takes the user back one step in the lobby/info-panel chain
//
//	17. showSelectedMarker() / hideSelectedMarker():
//			shows/hides a marker in the appropriate place to highlight which data
//			point has been selected
//
//	18. numberWithCommas(x) / numberWithoutCommas(x):
//			Takes an int x and puts/removes commas ever 3rd digit
//
//	19. getScrollBarWidth():
//			get the scrollbar width for the particular browser
//
//	20. openFullSummary():
//			displays an easter-egg summary of all data to the console
//
//	21. map-wide summary functions:
//			totalProjects()
//			totalPeople()
//			totalCapacity()
//			totalCartridgesAndSystems()
//			totalCommunities()
//			totalOther()
//			totalRainSys()
//			totalCeramic()
//			totalPartners()
//			totalWorkshops()
//			totalHours()
//			totalSchools()
//
//			These functions generate totals by adding together the appropriate
//			data from the appropriate rows of the dataset.
//
//	22. individual point summary functions:
//			projectsCompleted(point)
//			peopleImpacted(point)
//			storageInstalled(point)
//			filtersDistributed(point)
//
//			These functions compute total data for a community with multiple
//			projects by summing values from all of a community's projects.
//
//	23. isEmpty(i, name):
//			returns t/f, checks to see if the ith row in the dataset has a name
//
//	24. beginUserExperience():
//			removes the overlay and restarts the counters (makes map accessible
//			to clicks)
//
//	25. restartCounters():
//			re-initializes the spinning counters.
//
//	26. disableMapControls() / enableMapControls():
//			disables and enables map controls for scrolling in lobby/info-panel
//			and clicking on easter egg.
//
//	27. invert(obj):
//			Takes lookup table and inverts the key-value pairs. Returns obj.
//
//	28. formatDate(date):
//			Takes in a date formatted dd-MMM-yyyy in english and returns it as
//			dd/MMM/yyyy with MMM in the correct language.
//
//	29. sendErrorMsg():
//			Sends a GET request to a URL provided by Zapier to activate a webhook.
//
//	30. detectMobile():
//			Returns true if user's device is cellphone or tablet, false otherwise.
//
//	31. adjustDisplayForMobile():
//			Adjusts visible text from desktop to mobile display.
//
//
////////////////////////////////////////////////////////////////////////////////
//
//	UPDATE HISTORY:
//		29/SEP/2017	aaron krupp		document first written
//		4/OCT/2017	aaron krupp		added initAdminIndifferent, initAdmin, and
//									initNonAdmin.
//									Added CORS functionality for cross-domain
//									get/post requests
//		22/APR/2018	aaron krupp		comments/table of contents updated
//									functional specifications added
//
////////////////////////////////////////////////////////////////////////////////


// 	1. init():
//
// 	Description:		Initializes the site.
//
//	Operation:			fills in the appropriate langauge text, inits the map,
//						shows the basemap, plots the data on the map, and sets
//						The spinning counters.
//
//	Dependencies:		None.
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				None.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function init() {
	if(detectMobile()) {adjustDisplayForMobile()}
	// check for mobile and adjust text size appropriately
	fillText();					// Fill in the text in the appropriate language
	initMap(); 					// Initialize the map
	applyBaseMap(); 			// Display the map with the appropriate base tiles
	adjustXLocation();
	loadData(); 				// Load the data for the default contaminant
	// 	then plot the base markers on the map.

}

// 	2. fillText():
//
// 	Description:		Fills in text from the appropriate language file
//
//	Operation:			Grabs the global variables (ALL IN CAPS) from the
//						loaded language file and displays them. This allows for
//						easy addoption of multi-lingual sites.
//
//	Dependencies:		elements with the following:
//							id = "legend_title"
//							name = "project_type"
//							class = "stats_left"
//							id = "overlay_title"
//							id = "overlay_msg"
//							class = "overlay"
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	LEGEND_TITLE, LEGEND_TEXT, SUMMARY_HEADERS, DISPLAY_TITLE,
//						DISPLAY_MSG
//
//	Input:				None.
//	Output:				Displays all text on map.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen 						  	////


function fillText() {
	document.title = TITLE;
	document.getElementById("legend_title").innerHTML = LEGEND_TITLE;
	els = document.getElementsByName("project_type");
	for(var i=0; i<els.length; i++){
		els[i].innerHTML = LEGEND_TEXT[i];
	}

	els = document.getElementsByClassName("stats_left");
	for (var i=0; i<els.length; i++) {
		els[i].innerHTML = SUMMARY_HEADERS[i];
	}
	// load text onto overlay
	document.getElementById("overlay_title").innerHTML = DISPLAY_TITLE;
	document.getElementById("overlay_msg").innerHTML = DISPLAY_MSG;
	$("#overlay").corner("keep 16px cc:#222");	// adjust inner border corners
	$("#overlay").css("display", "inline-block");	// display overlay once stuff loads!
}

// 	3. fillCounters():
//
// 	Description:		fills the counters with the appropirate values
//
//	Operation:			Calls the appropriate map-wide summary function (21) and
//						sets the innerHTML of the appropriate spinner to that value
//
//	Dependencies:		Elements with the following ids:
//							"stats_box"
//							"stats_projects_no"
//							"stats_people_no"
//							"stats_capacity_no"
//							"stats_ceramic_no"
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				None.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function fillCounters() {
	if(!detectMobile()) {	// only fill counters if not on a mobile/tablet
		document.getElementById("stats_box").style.display = "inline-block";		// show the stats menu
		document.getElementById("stats_projects_no").innerHTML = totalProjects();	// fill it!
		document.getElementById("stats_people_no").innerHTML = totalPeople();
		document.getElementById("stats_capacity_no").innerHTML = totalCapacity();
		document.getElementById("stats_ceramic_no").innerHTML = totalCartridgesAndSystems();
	}
}

// 	4. initMap():
//
// 	Description:		Initializes the global map object.
//
//	Operation:			Initializes the map object using leaflet's L.map function
//
//	Dependencies:		Leaflet.js
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	map		--- the global map object
//
//	Input:				None.
//	Output:				None.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function initMap() {
	map = new L.map('WaterMap', { //First, initialize the map
		center: MAP_CENTER,
		zoom: MAP_INIT_ZOOM,
		minZoom: MAP_MIN_ZOOM,
		maxZoom: MAP_MAX_ZOOM,
		attributionControl: true,
		fullscreenControl: true
	});
	map.attributionControl.setPrefix(ATTRIBUTION);
}

// 	5. applyBaseMap():
//
// 	Description:		Applies the basemap tiles
//
//	Operation:			grabs a set of Stamen or Mapzen base tiles and
//	 					applies them to the map
//
//	Dependencies:		Leaflet.js
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	STAMEN_MAP_TYPE ---	A string specified on maps.stamen.com
//
//	Input:				None.
//	Output:				None.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function applyBaseMap(id) {
	map.addLayer(new L.StamenTileLayer(STAMEN_MAP_TYPE), {});
}

// 	6. adjustXLocation();
//
// 	Description:		Adjusts location of x-button in info panel or lobby
//
//	Operation:			Gets the width of the browser's scrollbar and offsets the
//						x-button a corresponding set pizeldistance from the edge of
//						the window
//
//	Dependencies:		element with class = 'x-butt'
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	X_OFFSET_FROM_SCROLLBAR ---	Dictates the x-button's offset
//							from the scrollbar
//
//	Input:				None.
//	Output:				The x-button moves if it is displayed to the user.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen


function adjustXLocation() {
	var xButtons = document.getElementsByClassName("x-butt");
	for (var i=0; i<xButtons.length; i++) {
		xButtons[i].style.right = String(getScrollBarWidth()+X_OFFSET_FROM_SCROLLBAR)+'px';
	}
}

// 	7. LoadData():
//
// 	Description:		Loads the appropriate dataset calls the plotting function.
//
//	Operation:			Grabs the data from the gloabl dataset PROJECT_MAP_DATA.
//						Stores it in a local variable data and a global AllData.
//						(yes, i know this is wildly redundant, its to deal with
//						other methods of data entry). Then it calls specific functions
//						to plot the data.
//
//						MAKE SURE ALL DATA IS SORTED BY NAME, THEN START-YEAR,
//						THEN START-MONTH, OTHERWISE YOU'LL LOSE A LOT OF POINTS!!!
//
//	Dependencies:		leaflet.js
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	base, PROJECT_MAP_DATA, SELECTED_URL, LARGE_ICON_SIZE, DATA_NAMES,
//						ICON_URLS, SMALL_ICON_SIZE, BASE_Z_OFFSET, VARIOUS
//						You can find descriptions for these variables in the global
//						variable definition file.
//
//	Input:				None.
//	Output:				Data points appear on map.
//
//	Error handling:		If a data entry doesn't have a name, lat, or lng, or is a
//						duplicate, it isn't show. Duplicate indicies are noted in
//						a separate array
//
// 	Algorithms:			None.
//	Data structures:	Data is treated as a json
//
//	Known bugs:			None.
// 	Limitations:		DATA MUST BE SORTED BY NAME (ALPHABETICAL) THEN START-YEAR
//						THEN START-MONTH.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function loadData() {
	var url = DATA_URL;
	var options = {sendMethod: 'auto'};
	var query = new google.visualization.Query(url, options);
	query.setQuery('select * ORDER BY B,C');				// Relies on B being community name and C being start-date
	query.send(onQueryResponse);

}

function onQueryResponse(response) {
	if(response.isError()) {
		throw new Error("data could not be retieved from Google sheets")
	} else {
		var data = googleDataTable2JSON(response.getDataTable());	// convert data to json
		plotData(data);												// feed into plotting function

		fillCounters();											// Read the data for the counters

	}
}

function googleDataTable2JSON(dataTable) {

	numCols = dataTable.getNumberOfColumns();
	numRows = dataTable.getNumberOfRows();

	var data = [];										// initialze data array to hold json

	for(var i=0; i<numRows; i++) {						// loop through rows
		data.push({});									// on each row creating a new dictionary
		for(var j=0; j<numCols; j++) {					// and loop through each column of that row

			var lbl = dataTable.getColumnLabel(j);		// get the name of the column
			var value = dataTable.getValue(i,j);		// get cell's value
			if (!value) {								// if a value exists in the cell
				value = "";
			}
			data[i][lbl] = value;						// store the "key: value" pair
		}
	}
	return data											// after all looping is done, return the finalized json
}


function plotData(data) {

	base.Markers = [];
	base.Popups = [];
	selectedIcon = L.icon({
		iconUrl: SELECTED_URL,
		iconSize: LARGE_ICON_SIZE
	});
	var duplicateCounter = 0;

	AllData = data; 				// store data as global for later access.
	if (!AllData | AllData.length == 0) {
		// Add something here to do in case the data isn't loaded...
	}



	photos = Array.apply(null, Array(data.length)).map(Boolean.prototype.valueOf,false); 	// init an array full of "false"'s to later populate with images

	for (var i=0; i<data.length; i++) { // Loop through all the rows of the data
		var bin = getBin(data, i);
		if (isEmpty(i, "name") | isEmpty(i, "lat") | isEmpty(i, "lng") | bin == -1) { 		// if the row is missing a name, latitutde, or longitude, or doesn't fit a bin,
			data.splice(i,1);                                                               // Removes it from data (which also removed it from allData)
			i=i-1;                                                                          // Otherwise, it could trigger the "is duplicate", without AllData[i].duplicates having been created
		} else {																			// Otherwise:

			//Note: This if statement determines whic rows of data will be grouped together within one marker on the map (with the query in loadData())
			// At the moment, rows with same "community" (.name) value, but different coordinates will be plotted under one marker
			// To fix that, we would have to have the coordinates included in the "ORDER BY" statement of the query (ORDER BY B,E,F,C), and add conditions on the coordinates to
			// the "If" statement below (probably in a dedicated function)
			// Not sure we want the map to behave that way, so leave it as an idea for now
			if (i==0 || data[i][DATA_NAMES.name] != data[i-1][DATA_NAMES.name]) {			// if not a duplicate point (special case for 0th point, cause 0-1 does not exist)
				duplicateCounter = 0;
				AllData[i].duplicates = [i]; 		// create a new array in AllData called duplicates to hold indices of duplicates of this point
				AllData[i].bin = bin;
				if (isEmpty(i, "photo")) { // if there's no photo, do nothing
				} else { 							// if there's a photo, get it from the link and store it in the browser
					photos[i] = new Image();
					photos[i].src = data[i][DATA_NAMES.photo];
				}




				var icon = L.icon({ 							// 	to be used when displaying the base markers
					iconUrl: ICON_URLS[bin],
					iconSize: SMALL_ICON_SIZE
				})
				var latLng = L.latLng([data[i][DATA_NAMES.lat], data[i][DATA_NAMES.lng]]); // Grab the latLng of the point
				used_indices.push(i);
				base.Markers.push( 								// Save the appropriate marker
					L.marker(latLng, {
						icon: icon,
						riseOnHover: true,
						zIndexOffset: BASE_Z_OFFSET
					})
					.on('click', function(event) {

						click_lat = event.latlng.lat; 			// Grab the latLng of the cliked point
						click_lng = event.latlng.lng;
						// 	(returns value of marker's center, regardless of where is clicked...)

						//This loops below gets the index of the point with the same latitude and longitude as the clicked points
						//we'll use that index to access the marker, popup, and label soon.
						for (var index =0;index<base.Markers.length;index++){
							if(base.Markers[index]._latlng.lat == click_lat && base.Markers[index]._latlng.lng == click_lng){
								j = index;
								index = base.Markers.length;
							}
						}
						//	of the point with the same latitude as the clicked point
						// 	we'll use that index to access the marker, label, and data.
						var z = used_indices[j];				// Then get the index of the point in AllData.

						if (AllData[z].duplicates.length > 1) { // if the current point HAS duplicates:
							if(!info_panel_open && !lobby_active) {		// and the info panel and lobby are both closed
								info_being_displayed = z;		// set the info to display as this point
								showLobby(z);					// show the lobby for this point, since it has multiple projects

								openPanel('lobby');				// open the info panel
							} else if ((info_panel_open || lobby_active) && info_being_displayed != z ) {	// if the info panel or lobby are open and not displaying this point
								info_being_displayed = z;		// change the info being displayed to this point
								closePanel('info_panel');
								showLobby(z);					// show the lobby since this point has multiple projects
								openPanel('lobby');
							}
						} else {								// If the selected point DOESN'T have duplicates
							if (!info_panel_open) {				// and the info panel is closed
								info_being_displayed = z;		// set the info being displayed to this point
								// push the info for this community/project to the info panel
								if (lobby_active) {
									closePanel('lobby');			// close the lobby in case it's open
								}
								showInfo(z);
								openPanel('info_panel');				// open the info panel
							} else if (info_panel_open && info_being_displayed != z) {	// if the info panel is open, but showing a different point
								info_being_displayed = z;		// change the info being displayed to this point
								showInfo(z);					// push the current info to the info panel.
							}
						}

					})
				);
				base.Markers[base.Markers.length-1].bindLabel(getLabel(data, i), {
					noHide: false,										// attach labels to all the base points
					className: "ourLabel"								//	that activate during mouseover
				});
				base.Markers[base.Markers.length-1].addTo(map); 		// And finally, actually add the markers to the map!


			} else {													// if i is a duplicate
				duplicateCounter = duplicateCounter + 1;				// increment the duplicate counter
				AllData[i-duplicateCounter].duplicates.push(i);
				AllData[i].isDuplicate = true;
				AllData[i-1].isDuplicate = true;
				bin = getBin(data, i);
				AllData[i].bin = bin;
				if (AllData[i-1].bin == VARIOUS) {
					bin = VARIOUS;
				} else if (bin != AllData[i-1].bin) {
					bin = VARIOUS;
					AllData[i-1].bin = VARIOUS;

					map.removeLayer(base.Markers[base.Markers.length-1]);
					base.Markers[base.Markers.length-1].options.icon.options.iconUrl = ICON_URLS[VARIOUS];
					base.Markers[base.Markers.length-1].addTo(map);
				}
				AllData[i].bin = bin;
				if (isEmpty(i, "photo")) { // if there's no photo, do nothing
				} else { 							// if there's a photo, get it from the link and store it in the browser
					photos[i] = new Image();
					photos[i].src = data[i][DATA_NAMES.photo];
				}
			}
		};
	};



}

// 	8. getBin(data, i):
//
// 	Description:		gets the bin of the point at row i of dataset "data"
//
//	Operation:			The bin is how the point will be color-coded on the map
//						based on project type:
//							Bin RAINWATER: rainwater harvesting
//							Bin CERAMIC: ceramic filtration
//							Bin BIOCHAR: biochar water treatment
//							Bin OTHER: other project types
//							Bin -1: doesn't match a known project type
//
//	Dependencies:		None.
// 	Arguments:			data	---	the data set
//						i		---	index of data set for which to find bin
//	Return values: 		bin ---	the project's bin as defined by the global vars
//
//	Global variables:	RAIN_PROJ, RAINWATER, CERAMIC_PROJ, CERAMIC, BIOCHAR_PROJ,
//						BIOCHAR, OTHER_PROJ, OTHER
//
//	Input:				None.
//	Output:				None.
//
//	Error handling:		If project doesn't match a known bin, -1 is returned
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function getBin(data, i) {
	var bin = -1;
	switch (data[i][DATA_NAMES.proj_type]) {
		case RAIN_PROJ:
		bin = RAINWATER;
		break;

		case CERAMIC_PROJ:
		bin = CERAMIC;
		break;

		case OTHER_PROJ:
		case BORDO_PROJ:
		case BIOCHAR_PROJ:
		bin = OTHER;
		break;

		case GTS_PROJ:
		bin = GTS;
		break;

		case DRY_TOILET_PROJ:
		bin = DRY_TOILET;
		break;

		default:
	}

	return bin
}

// 	9. openPanel(id) / closePanel(id):
//
// 	Description:		Opens and closes the named element with the id "id"
//
//	Operation:			Configures the element with the id "id"
//						Then fades in or out that element.
//						Saves the status of the panel in the boolean globals:
//							info_panel_open and lobby_active
//
//	Dependencies:		None.
// 	Arguments:			id	---	id of an HTML element to display or hide
//	Return values: 		None.
//
//	Global variables:	info_panel_open ---	boolean that indicates true if panel open,
//											false if not
//						lobby_active	---	boolean that indicates true if lobby open,
//											false if not
//
//	Input:				None.
//	Output:				Displays/hides appropriate panel to/from user
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen
////////////////////////////////////////////////////////////////////////////////

function openPanel(id) {
	var el = document.getElementById(id);
	el.style.opacity = 0; 				// Since the info panel isn't open, make sure opacity is 0
	el.style.display = "block";			//	but the panel isn't hidden, so it can be scrolled.
	$("#"+id).scrollTop(0);		// Since we're opening a new point, scroll to top of info window
	fadeIn(el)							// Once it's scrolled, fade the info window in.

	if (id == 'info_panel') {
		info_panel_open = true;				// And set the global to show that it's being displayed.
	} else if (id == 'lobby') {
		lobby_active = true;
	}
}

function closePanel(id) { 			// To close the panel:
	enableMapControls();
	var el = document.getElementById(id);
	fadeOut(el, 0.09)							// Just fade it out.

	if (id=='info_panel') {
		info_panel_open = false;			// Then reset the global to show it's hidden.
	} else if (id == 'lobby') {
		lobby_active = false;
	}

	// This following chunk of code
	$('.vid_box').each(function(){		//	resets the video's source
		var el_src = $(this).attr("src");	//	which effectively resets the video,
		$(this).attr("src",el_src);			//	pausing or stopping it.
	});
}


// 	10. showInfo(z):
//
// 	Description:		This outrageously long function (that would be better
//						written in react) dynamically generates / hides the
//						appropriate elements in the info-panel for each given
//						date point.
//
//	Operation:			For each div element within the div id="info-panel", this
//						function checks to see if the dataset has the corresponding
//						information. If not, toDisplay is set to false. else, it is
//						set to true. If toDisplay is set to true, the appropriate
//						data is loaded and displayed with the appropriate color
//						and styling. If not, the div is hidden.
//
//	Dependencies:		Divs with the following ids:
//							back_button, proj_name, video, photo, docs, name, muni,
//                          proj_type, site, dates, people, workshops, no_ceramic_systems,
//                          no_ceramic_filters, no_biochar, no_ferro, no_roto_small,
//							no_roto_big, no_geomembrane, no_underground, no_rainjar,
//                          partner, notes1
//
// 	Arguments:			z 	--- The index of the point from which to grab data in
//								the global dataset
//	Return values: 		None.
//
//	Global variables:	AllData 	---	global dataset
//						DATA_NAMES, BACK_BUTTON_TXT, NO_INFO, LBL, END_OF_HEADER,
//
//	Input:				None.
//	Output:				Divs in info-panel are displayed or hidden.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen


function showInfo(z) {
	hideSelectedMarker();
	showSelectedMarker();
	var isVideo = false; 				//initialize a var that will say whether or not this point has a video
	var currentElement = 0;
	var elementsBeingDisplayed = 0;
	var els = document.getElementsByClassName("info_text");
	var i=0;
	for(i; i<els.length; i++) { 		// Loop through all the elements to fill

		var toDisplay = false;				// Initialize each element to not display in case there's no content.
		var id = els[i].id;					// Grab the id of the current element
		els[i].style.margin = "5px";		// Reset the margin property to the default values
		// A few ids have special cases:
		//	photo,
		//	dates,
		//	workshops,
		// 	contact_info
		//	and docs.
		if (id == "proj_name") {
			toDisplay = true;
			els[i].innerHTML = AllData[z][DATA_NAMES.name]+":<br><i>"
			if (AllData[z][DATA_NAMES.proj_type] == OTHER_PROJ) {
				if (!isEmpty(z, "proj_name")) {
					els[i].innerHTML = els[i].innerHTML + AllData[z][DATA_NAMES.proj_name]+"</i>";
				}
			} else {
				els[i].innerHTML = els[i].innerHTML + AllData[z][DATA_NAMES.proj_type]+"</i>";
			}
		} else if (id == 'back_button') {
			els[i].innerHTML = BACK_BUTTON_TXT[0]+AllData[z][DATA_NAMES.name]+BACK_BUTTON_TXT[1];
			if (AllData[z].isDuplicate) {toDisplay = true;}
		} else if (id == "dates") {												// If there are dates, include them here:
			if (!isEmpty(z, "start_date")) {									// if there IS at least a start date
				toDisplay = true;
				var start_date = formatDate(AllData[z][DATA_NAMES.start_date]);	// grab start and end dates
				var end_date = formatDate(AllData[z][DATA_NAMES.end_date]);
				var formattedDate;												// initialize formattedDate for various start-end combos
				if (end_date == "") {											// if there's no end date
					formattedDate = start_date;									//	just include the start date
				} else {														// if there IS an end date as well
					if (end_date == formatDate("today")) {						// if the end date is TODAY (project is ongoing)
						end_date = ONGOING_PROJECT; 							// 	set the end date to say "ongoing" in the correct language
					}
					if(end_date == start_date) {								// 	if they're the same,
						formattedDate = start_date;								// 	just display the start date
					} else {													// otherwise, display both, separted by the BETWEEN_DATES str.
						formattedDate = start_date+BETWEEN_DATES+end_date;
					}
				}
				els[i].innerHTML = "<b>"+LBL[id]+"</b>"+END_OF_HEADER+formattedDate;
			}
		} else if (id == "video")
		if (isEmpty(z, id)) {}
		else {
			toDisplay = true;
			isVideo = true;
			var video_element = document.getElementById("video_box");
			video_element.src = AllData[z][DATA_NAMES[id]];


		} else if (id == "photo") {			// If there's a photo, deal with it:
			if (isEmpty(z, id) && isEmpty(z, "photo_folder")) {	// if there's no photo don't display the photo box
			} else if (isVideo) {	// if there's a video, don't display the photo!
			} else {
				toDisplay = true;
				var photoEl = document.getElementById("photo_box");
				if (AllData[z][DATA_NAMES.photo_folder] == null | AllData[z][DATA_NAMES.photo_folder] == "" ) { 	// if there's a photo but no link
					photoEl.src = photos[z].src;
				} else {																							// if there's a photo and a link
					photoEl.src = photos[z].src;
					photoEl.style.display = "block";

				}
			}
		} else if (id == "workshops") {		// If there were workshops, include them here:
			if (isEmpty(z, "big_train") && isEmpty(z, "small_train")) {}
			else {
				toDisplay = true;
				if (isEmpty(z, "big_train")) {
					els[i].innerHTML = "<b>"+LBL.small_train+"</b>"+END_OF_HEADER+AllData[z][DATA_NAMES.small_train];
				} else if (isEmpty(z, "small_train")) {
					els[i].innerHTML = "<b>"+LBL.big_train+"</b>"+END_OF_HEADER+AllData[z][DATA_NAMES.big_train];
				} else {
					els[i].innerHTML = "<b>"+LBL[id]+"</b>"+":<br>"+
					LBL.small_train+END_OF_HEADER+AllData[z][DATA_NAMES.small_train]+"<br>"+
					LBL.big_train+END_OF_HEADER+AllData[z][DATA_NAMES.big_train];
				}
			}
		}else if (id == "docs") {			// If there's a link to a document, include it here:
			if (isEmpty(z, id)) {}
			else {
				toDisplay = true;
				els[i].innerHTML = "<a href='"+AllData[z][DATA_NAMES[id]]+"' target='_blank'>"+SEE_MORE+"</a>";
				els[i].style.textAlign = "center";
			}
		} else {							// The rest are just text that need to be displayed with a label:
			if (isEmpty(z, id)) {}
			else {
				toDisplay = true;
				if (LBL[id] != "") {
					els[i].innerHTML = "<b>"+LBL[id]+"</b>"+END_OF_HEADER+AllData[z][DATA_NAMES[id]];
				} else {
					els[i].innerHTML = "<big><b>"+AllData[z][DATA_NAMES[id]]+"</big></b>";
				}
			}
		}
		if (toDisplay) {
			currentElement = i;

			if (els[i].id == 'back_button') {								// display for back button
				els[i].style.backgroundColor = "rgba(235, 235, 235, 0)";
				els[i].style.marginRight = "100px";
				els[i].style.textDecoration = "underline";
				els[i].onmouseenter = function(event) {
					event.target.style.color = '#63aec1';
				}
				els[i].onmouseleave = function(event) {
					event.target.style.color = 'black';
				}

			} else if (els[i].id == "photo") {								// display for photo frame
				els[i].style.backgroundColor = "rgba(235, 235, 235, 0)";
			} else if (els[i].id == "video") {								// display for video frame
				els[i].style.backgroundColor = "rgba(235, 235, 235, 0)";
			} else if(els[i].id=="proj_name") {								// display for project name
				els[i].style.fontSize = "20px";
				els[i].style.backgroundColor = "rgba(235, 235, 235, 0)";
				els[i].style.marginRight = "40px";
				els[i].style.fontWeight = "600";

			} else if (els[i].id=="docs") {									// display for links to more information/documentation
				els[i].style.backgroundColor = "rgba(235, 235, 235, 0)";
				els[i].style.fontSize = "18px";

			} else if(elementsBeingDisplayed%2) {							// display for every even element
				els[i].style.backgroundColor = "rgba(211, 233, 237, 1)";
			} else {														// display for every odd element
				els[i].style.backgroundColor = "rgba(166, 211, 218, 1)";
			}
			els[i].style.display = "block";
			elementsBeingDisplayed++;
		} else {
			els[i].style.display = "none";
		}
	}
	els[currentElement].style.marginBottom = "25px";				// adjust the margin on the last element for clearance
	$("#info_panel").animate({scrollTop: 0}, SCROLL_TIME);	// First, scroll the info window back to the top.
}

// 	11. showLobby(z):
//
// 	Description:		Shows the lobby for the z-th element in the global dataset
//
//	Operation:			Loops through all the divs in the lobby and popultates them
//						appropriately. Follows a parallel structure to  function
//						#10, showInfo(z)
//
//	Dependencies:		Divs within the div with id = "lobby" with the following ids:
//							proj_name_l, photo_l, video_l, summary, project_list
// 	Arguments:			z 	--- the index in the global dataset to grab data from
//	Return values: 		None.
//
//	Global variables:	AllData	---	global dataset
//						DATA_NAMES, SUMMARY_HEADERS, SUMMARY_TITLE, MONTHS_LONG
//
//	Input:				None.
//	Output:				Shows data to user within the lobby.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen


function showLobby(z) {
	hideSelectedMarker();
	showSelectedMarker();
	document.getElementById('message_l').innerHTML = LOBBY_MESSAGE[0];
	var els = document.getElementsByClassName("lobby_text");

	for (var i = 0; i<els.length; i++) {
		var id = els[i].id;					// Grab the id of the current element
		if (id == 'proj_name_l') {
			els[i].innerHTML = AllData[z][DATA_NAMES.name];
			els[i].style.fontSize = "32px";
			els[i].style.backgroundColor = "rgba(235, 235, 235, 0)";
			els[i].style.fontWeight = "600";
		}
		else if (id == 'photo_l') {
			var photoCounter = 0;
			for (var j = 0; j<AllData[z].duplicates.length; j++) {		// loop through duplicates
				dup = AllData[z].duplicates[j];
				if (photoCounter == 0) {								// grab and display 1st photo
					if (isEmpty(dup, "photo")) {
						document.getElementById("photo_l").style.display = 'none';
					} else {
						photoCounter = 1;
						document.getElementById("photo_l").style.display = 'inline-block';
						document.getElementById("photo_box_l").src = photos[dup].src;
						document.getElementById("photo_box_l").style.display = 'block';
					}
				}
			}
		}
		else if (id == "video_l") {
			var videoCounter = 0;
			for (var j = 0; j<AllData[z].duplicates.length; j++) {		// loop through duplicates
				dup = AllData[z].duplicates[j];
				if (videoCounter == 0) {
					if (isEmpty(dup, "video")) {
						document.getElementById("video_l").style.display = 'none';
					} else {
						videoCounter = 1;
						document.getElementById("video_l").style.display = 'inline-block';
						document.getElementById("video_box_l").src = AllData[dup][DATA_NAMES.video];
						document.getElementById("photo_l").style.display = "none";
					}
				}
			}
		}
		else if (id == "summary") {
			document.getElementById("summary_header").innerHTML = SUMMARY_TITLE;
			var heads = document.getElementsByClassName("left_column");
			for (var i=0; i<heads.length; i++) {
				heads[i].innerHTML = SUMMARY_HEADERS[i];
			}
			document.getElementById('no_projects_value').innerHTML = projectsCompleted(z);
			document.getElementById('ppl_served_value').innerHTML = peopleImpacted(z);
			document.getElementById('liters_value').innerHTML = storageInstalled(z);
			document.getElementById('ceramic_value').innerHTML = filtersDistributed(z);

		}
		else if (id == "project_list") {

			for (var j = 0; j<AllData[z].duplicates.length; j++) {		// loop through duplicates
				dup = AllData[z].duplicates[j];
				//rawDate = String(AllData[dup][DATA_NAMES.start_date]).split("-", 3);


				var nameToDisplay = AllData[dup][DATA_NAMES.proj_type];
				var proj_name = AllData[dup][DATA_NAMES.proj_name]
				if (nameToDisplay == OTHER_PROJ && proj_name != "" && proj_name != null) {
					nameToDisplay = proj_name;
				}
				dateExists = !isEmpty(dup, "start_date");
				if (dateExists) {		// if there's a date
					var mm = AllData[dup][DATA_NAMES.start_date].getMonth();							// get month as number
					var yyyy = String(AllData[dup][DATA_NAMES.start_date].getFullYear());				// get year as string
					var date = ": "+MONTHS_LONG[mm]+", "+yyyy; 											// concatenate month name and year
				} else {
					var date = "";			// if there,s no date, set the date var to an empty string
				}
				if (j==0) {					// for the first project in the lobby
					els[i].innerHTML = "<p class='proj_box_even' onclick='openFromLobby("+String(dup)+");'>"+nameToDisplay+date+"</p>";
				} else {
					if (j%2==0) {		// for all subsequent even projects (indices 2, 4, 6, etc.)
						els[i].innerHTML = els[i].innerHTML+"<p class='proj_box_even' onclick='openFromLobby("+String(dup)+");'>"+nameToDisplay+date+"</p>";
					} else {			// for all subsequent odd projects (indices 1, 3, 5, etc.)
						els[i].innerHTML = els[i].innerHTML+"<p class='proj_box_odd' onclick='openFromLobby("+String(dup)+");'>"+nameToDisplay+date+"</p>";
					}
				}
			}
		}

	}
}

// 	12. openFromLobby(z):
//
// 	Description:		Opens a specific projects info-panel from the lobby.
//
//	Operation:			populates the info panel with the correct info. Then
//						opens the info panel on top of the lobby, the closes
//						the lobby.
//
//	Dependencies:		None.
// 	Arguments:			z 	---	the index of the project to show in the
//								global dataset
//	Return values: 		None.
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				Closes lobby, opens info panel for selected project
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function openFromLobby(z) {

	showInfo(z);
	openPanel('info_panel');
	closePanel('lobby');
}

// 	13. getLabel():
//
// 	Description:		Gets the appropriate label to display next to a data point
//
//	Operation:			Generates a string based on the project name.
//
//	Dependencies:		None.
// 	Arguments:			None.
//	Return values: 		returns the new label as a string.
//
//	Global variables:	DATA_NAMES, MAX_LABEL_LINE_CHARS
//
//	Input:				None.
//	Output:				None.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function getLabel(data, i) {
	str = String(data[i][DATA_NAMES.name]);
	str = str.split(" ")
	var newStr = "";
	var lineCount = 1;
	for (var i=0; i<str.length; i++) {
		tempNewStr = newStr+"\xa0"+str[i]
		if(tempNewStr.length>MAX_LABEL_LINE_CHARS*lineCount & i!=0) {
			newStr = newStr+"\xa0\n\xa0"+str[i];
		} else {
			newStr = tempNewStr;
		}
	};
	return "\xa0"+newStr+"\xa0";
}


// 	14. removePoint():
//
// 	Description:		removes point from map
//
//	Operation:			removes the point at index i from map with leaflet commands
//
//	Dependencies:		leaflet.js
// 	Arguments:			i 	---	the index of the point to remove in base.Markers array
//	Return values: 		None.
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				Makes formerly visible point on map invisible.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function removePoint(i) {
	map.removeLayer(base.Markers[i]);
}

// 	15. fadeIn(el) / fadeOut(el, threshhold):
//
// 	Description:		fades in/out a passed html element
//
//	Operation:			Fades in or out the passed element by adjusting the
//						the div element's opacity in steps. Many thanks to:
//						http://www.chrisbuttery.com/articles/fade-in-fade-out-with-javascript/
//						for this simple and lovely bit of js. Cheers!
//						If the div is visible, fadeIn does nothing. If it's not,
//						fade out does nothing.
//
//	Dependencies:		None.
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				The passed html element appears or disappears slowly
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen


function fadeOut(el, threshhold){

	(function fade() {
		if ((el.style.opacity -= threshhold) < 0) {
			el.style.opacity = 0;
		} else {
			requestAnimationFrame(fade);
		}
	})();

	el.style.display = 'none';
}

function fadeIn(el){

	el.style.opacity = 0;
	el.style.display = 'block';

	(function fade() {
		var val = parseFloat(el.style.opacity);
		if (!((val += .075) > 1)) {
			el.style.opacity = val;
			requestAnimationFrame(fade);
		}
	})();

}

// 	16. onKeypress / goBack(key):
//
// 	Description:		onKeypress triggers when any keys are pressed. If the key
//						is 'esc,' calls the goBack(key) fn.
//
//	Operation:			If the key is 'x' close everything (info panel and lobby)
//						Otherwise, the key pressed is 'esc' so go back one step.
//						If the user is in an info panel w/o a lobby, close it.
//						If an info panel with a lobby, go back to the lobby.
//						If a lobby, close it.
//
//	Dependencies:		None.
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	None.
//
//	Input:				Takes in keystroke from user.
//	Output:				Closes info panel or lobby.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

$(document).bind('keypress', function (event) {
	if(String(event.originalEvent.key) == "Escape") {
		goBack('esc');
	}
})

function goBack(key) {
	if (key == 'x') {
		closePanel('lobby');
		closePanel('info_panel');
		hideSelectedMarker();
	} else if (lobby_active) {
		closePanel('lobby');
		hideSelectedMarker();
	} else if (info_panel_open && AllData[info_being_displayed].duplicates.length == 1) {
		closePanel('info_panel');
		hideSelectedMarker();
	} else if (info_panel_open) {
		showLobby(info_being_displayed);
		openPanel('lobby')
		closePanel('info_panel');
	}
}

// 	17. showSelectedMarker() / hideSelectedMarker():
//
// 	Description:		Shows/hides the marker on the map that indicates for which
//						point the data is being displayed.
//
//	Operation:			Finds the lat-lng of the active point by using the index
//						stored in the global info_being_displayed. Places (or
//						or removes) the active-marker at that location.
//
//	Dependencies:		None.
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	info_being_displayed 	---	the index of the global var AllData
//													dataset for the active point.
//						AllData	---	Global dataset
//						active_marker_on	--- Boolena, true if active marker is on
//
//	Input:				None.
//	Output:				Active marker is shown or hidden
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function showSelectedMarker() {
	if (!active_marker_on) {
		var latLng = L.latLng([AllData[info_being_displayed][DATA_NAMES.lat], AllData[info_being_displayed][DATA_NAMES.lng]]); // Grab the latLng of the point
		activeMarker = L.marker(latLng, {
			icon: selectedIcon,
			riseOnHover: true,
			zIndexOffset: BASE_Z_OFFSET
		})
		activeMarker.addTo(map);
		active_marker_on = true;
	}
}

function hideSelectedMarker() {
	if (active_marker_on) {
		if (info_being_displayed != -1) {
			map.removeLayer(activeMarker);
		}
		active_marker_on = false;
	}
}

// 	18. numberWithCommas(x) / numberWithoutCommas(x):
//
// 	Description:		Takes a number and adds/removes the formatting commas
//
//	Operation:			The "With" fn: adds commas between every 3rd digit for the
//						standard US/Mexico numerical display format. Returns the
//						number as a string.
//
//						The "Without" fn: does the reverse (takes in a
//						string that could have commas, removes them, and returns
//						a numerical value, either a float or an int).
//
//	Dependencies:		None.
// 	Arguments:			x	--- "With": int to add commas to
//								"Without": string to remove commas from
//	Return values: 		"with": returns a string with commas
//						"without": returns an int without commas
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				None.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen


function numberWithCommas(x) {
	return parseInt(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 	//The parseInt() removes any leading zeros that the value may have.
}

function numberWithoutCommas(x) {
	return Number(x.replace(/,/g, ''));
}

// 	19. getScrollBarWidth():
//
// 	Description:		Gets the width of the scrollbar
//
//	Operation:			Creates some hidden divs and measures their relative widths.
//
//	Dependencies:		None.
// 	Arguments:			None.
//	Return values: 		The width of the scrollbar in pixels.
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				None.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function getScrollBarWidth () {
	var inner = document.createElement('p');
	inner.style.width = "100%";
	inner.style.height = "200px";

	var outer = document.createElement('div');
	outer.style.position = "absolute";
	outer.style.top = "0px";
	outer.style.left = "0px";
	outer.style.visibility = "hidden";
	outer.style.width = "200px";
	outer.style.height = "150px";
	outer.style.overflow = "hidden";
	outer.appendChild (inner);

	document.body.appendChild (outer);
	var w1 = inner.offsetWidth;
	outer.style.overflow = 'scroll';
	var w2 = inner.offsetWidth;
	if (w1 == w2) w2 = outer.clientWidth;

	document.body.removeChild (outer);

	return (w1 - w2);
};

// 	20. openFullSummary():
//
// 	Description:		Displays and easter egg to the console with:
//							- Liters of rainwater capacity installed
//							- # rainwater systems installed
//							- # filter systems distributed
//							- # of filter cartridges distributed
//							- liters of ceramic filtration capability
//							- People impacted
//							- Total # of communities worked in
//							- List of partner organizations
//							- Total # of projects
//							- # of "Other" projects
//							- List of "Other" project names w/ community name
//							- # of projects in schools
//							- # of short workshops
//							- # of long workshops
//							- # of hours of community-volunteered labor
//
//	Operation:			Calls the appropriate function to generate each of
//						the above values. Stores values in an array called
//						"summary". Prints summary to console.
//
//	Dependencies:		None.
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				Prints Summary to console
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen


function openFullSummary() {
	var summary = {};
	summary[EASTER_EGG_TXT.rainL] = totalCapacity();
	summary[EASTER_EGG_TXT.rainSys] = totalRainSys();
	summary[EASTER_EGG_TXT.filterSys] = totalCeramic()[1]
	summary[EASTER_EGG_TXT.filterCar] = totalCeramic()[0]
	summary[EASTER_EGG_TXT.filterL] = totalCeramic()[2];
	summary[EASTER_EGG_TXT.ppl] = totalPeople();
	summary[EASTER_EGG_TXT.communities] = totalCommunities();
	summary[EASTER_EGG_TXT.partners] = totalPartners()[0];
	summary[EASTER_EGG_TXT.partnerNames] = totalPartners()[1]
	summary[EASTER_EGG_TXT.projects] = totalProjects();
	summary[EASTER_EGG_TXT.other] = totalOther()[0];
	summary[EASTER_EGG_TXT.otherNames] = totalOther()[1];
	summary[EASTER_EGG_TXT.schools] = totalSchools();
	summary[EASTER_EGG_TXT.shortShops]= totalWorkshops()[0];
	summary[EASTER_EGG_TXT.longShops] = totalWorkshops() [1];
	summary[EASTER_EGG_TXT.laborHours] = totalHours();

	console.log(summary)
}

// 	21. Map-wide summary functions():
//
// 	Description:		Each of these functions return a single int that
//						computes a summary value based on all the data on the map
//						These functions are:
//							totalProjects
//							totalPeople
//							totalCapacity
//							totalCartridgesAndSystems
//							totalCommunities
//							totalOther
//							totalRainSys
//							totalCeramic
//							totalPartners
//							totalWorkshops
//							totalHours
//							totalSchools
//
//	Operation:			By looping through the base points array, each function
//						aggregates a particular piece of information.
//
//	Dependencies:		None.
// 	Arguments:			None.
//	Return values: 		Int, function specific
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				None.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen


function totalProjects() {
	var total = 0
	for (var i=0; i<used_indices.length; i++) {				// loop through all base points
		total = total + projectsCompleted(used_indices[i]);	// add up all projects from all and their duplicates
	}
	return total;
}

function totalPeople() {
	var total = 0
	for (var i=0; i<used_indices.length; i++) {				// loop through all base points
		if (peopleImpacted(used_indices[i]) != 'unknown') {	// if the number of people impacted is known (for it and all duplicates)
			total = total + numberWithoutCommas(peopleImpacted(used_indices[i]));	// add them up, making sure to
		}													//	remove the commas from all numbers...
	}
	return total;
}

function totalCapacity() {
	var total = 0
	for (var i=0; i<used_indices.length; i++) {
		total = total + numberWithoutCommas(storageInstalled(used_indices[i]));
	}
	return total;
}

function totalCartridgesAndSystems() {
	var total = 0
	for (var i=0; i<used_indices.length; i++) {
		total = total + numberWithoutCommas(filtersDistributed(used_indices[i]));
	}
	return total;
}

function totalCommunities() {
	return used_indices.length;
}

function totalOther() {				// returns an array: [# of Other projects, [array of names of other projects]]
	var total = 0;
	var names = "";
	for (var i=0; i<used_indices.length; i++) {
		if (AllData[used_indices[i]].duplicates) {
			for (var j=0; j<AllData[used_indices[i]].duplicates.length; j++) {
				index = AllData[used_indices[i]].duplicates[j];
				if (AllData[index][DATA_NAMES.proj_type] == OTHER_PROJ) {
					total++;	// counts the number of "Other" projects
					if (names == "") {								// for 1st project, don't precede with a comma
						names = AllData[index][DATA_NAMES.proj_name];
					} else {										// for the rest, create a list!
						names = names + ", " + AllData[index][DATA_NAMES.proj_name];
					}
				}
			}
		}
	}
	return [total, names];
}

function totalRainSys() {
	var total = 0;
	for (var i=0; i<used_indices.length; i++) {					// loop through all projects and duplicates
		if (AllData[used_indices[i]].duplicates) {
			for (var j=0; j<AllData[used_indices[i]].duplicates.length; j++) {
				index = AllData[used_indices[i]].duplicates[j];
				total = total + Number(AllData[index][DATA_NAMES.no_ferro]) + Number(AllData[index][DATA_NAMES.no_roto_small]) + Number(AllData[index][DATA_NAMES.no_roto_medium]) + Number(AllData[index][DATA_NAMES.no_roto_big]) + Number(AllData[index][DATA_NAMES.no_geomembrane]) + Number(AllData[index][DATA_NAMES.no_underground]) + Number(AllData[index][DATA_NAMES.no_rainjar]);
			}
		}
	}
	return total
}

function totalCeramic() { 		// returns an array: [#cartridges, #systems, potentialLiters]
	var car = 0;
	var sys = 0;
	for (var i=0; i<used_indices.length; i++) {					// loop through all projects and duplicates
		if (AllData[used_indices[i]].duplicates) {
			for (var j=0; j<AllData[used_indices[i]].duplicates.length; j++) {
				index = AllData[used_indices[i]].duplicates[j];
				car = car + Number(AllData[index][DATA_NAMES.no_ceramic_filters]);
				sys = sys + Number(AllData[index][DATA_NAMES.no_ceramic_systems]);
			}
		}
	}
	var total = car + sys;
	var potential_liters = total*LITERS_DAY*YEARS_OF_FILTER_LIFE*DAYS_YEAR
	return [car, sys, potential_liters]
}

function totalPartners() {					// returns number of partners and list of partners as: [#, list as string]
	var total = 0;
	var names = "";
	for (var i=0; i<used_indices.length; i++) {
		if (AllData[used_indices[i]].duplicates) {
			for (var j=0; j<AllData[used_indices[i]].duplicates.length; j++) {
				index = AllData[used_indices[i]].duplicates[j];
				if (!isEmpty(index, "partner")) {
					var partners = AllData[index][DATA_NAMES.partner].split("; ");
					if (names == "") {					// if no orgs have been added yet
						names = partners[0];			//	add the first org
						total = total + 1;				// 	and increase the total number of orgs counter
						if (partners.length > 1) {		// if this entry has multiple partner orgs
							for (var k=1; k<partners.length; k++) {	// loop through them, checking for repeates and adding and counting them
								var re = new RegExp(partners[k], 'g');
								if (names.match(re) == null | names.match(re) == 0 | names.match(re) == false) {
									total = total + 1;
									names = names + "; " + partners[k];
								}
							}
						}
					} else {							// if some orgs have already been added, loop through checking for repeate and adding and counting them

						for (var k=0; k<partners.length; k++) {
							var re = new RegExp(partners[k], 'g');
							if (names.match(re) == null | names.match(re) == 0 | names.match(re) == false) {
								total = total + 1;
								names = names + "; " + partners[k];
							}
						}
					}


				}
			}
		}
	}
	return [total, names]
}

function totalWorkshops() {
	var shortShops = 0;
	var longShops = 0;
	for (var i=0; i<used_indices.length; i++) {
		if (AllData[used_indices[i]].duplicates) {
			for (var j=0; j<AllData[used_indices[i]].duplicates.length; j++) {
				index = AllData[used_indices[i]].duplicates[j];
				shortShops = shortShops + Number(AllData[index][DATA_NAMES.small_train]);
				longShops = longShops + Number(AllData[index][DATA_NAMES.big_train]);
			}
		}
	}
	return [shortShops, longShops];
}

function totalHours() {		// total hours of volunteer labor put into cisterns
	var totalFerro = 0;
	for (var i=0; i<used_indices.length; i++) {
		if (AllData[used_indices[i]].duplicates) {
			for (var j=0; j<AllData[used_indices[i]].duplicates.length; j++) {
				index = AllData[used_indices[i]].duplicates[j];
				totalFerro = totalFerro + Number(AllData[index][DATA_NAMES.no_ferro]);
			}
		}
	}
	return totalFerro * PPL_PER_CISTERN * DAYS_PER_CISTERN * HRS_PER_DAY;
}

function totalSchools() {
	var schools = 0;
	for (var i=0; i<used_indices.length; i++) {
		if (AllData[used_indices[i]].duplicates) {
			for (var j=0; j<AllData[used_indices[i]].duplicates.length; j++) {
				index = AllData[used_indices[i]].duplicates[j];
				var re = new RegExp("school", 'gi');
				var sites = AllData[index][DATA_NAMES.site];
				if (sites.match(re) != null && sites.match(re) != 0 && sites.match(re) != false) {
					schools = schools + sites.match(re).length;
				}
			}
		}
	}
	return schools;
}

// 	22. individual point summpary functions:
//
// 	Description:		These functions return summary values across multiple
//						projects in a single community.
//
//	Operation:			The functions take in the community as an index in the
//						global dataset and loop through all of the duplicate
//						projects at the same site as stored in the
//						AllData[point].duplicates global array
//
//	Dependencies:		None.
// 	Arguments:			Point 	---	the index of the AllData global.
//	Return values: 		str	---	function dependent.
//
//	Global variables:	AllData ---	the full dataset.
//
//	Input:				None.
//	Output:				None.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen



function projectsCompleted(point) {
	return AllData[point].duplicates.length
}

function peopleImpacted(point) {
	var ppl = 0;
	var dup;
	for (var i=0; i<AllData[point].duplicates.length; i++) {
		dup = AllData[point].duplicates[i];
		ppl = ppl + Number(AllData[dup][DATA_NAMES.people]);		// casting as a Number ensures that a non number (represented by an empty string, "")
	}																//	gets converted to a 0. Otherwise all the numbers concatenate as strings
	ppl = numberWithCommas(ppl);
	if (ppl == '0') {
		ppl = "unknown";
	}

	return ppl
}

function storageInstalled(point) {
	var storage = 0;
	var dup;
	for (var i=0; i<AllData[point].duplicates.length; i++) {
		dup = AllData[point].duplicates[i];
		storage = storage + 12000*AllData[dup][DATA_NAMES.no_ferro] + 2500*AllData[dup][DATA_NAMES.no_roto_small] + 5000*AllData[dup][DATA_NAMES.no_roto_medium] + 10000*AllData[dup][DATA_NAMES.no_roto_big] + 30000*AllData[dup][DATA_NAMES.no_geomembrane] + 80000*AllData[dup][DATA_NAMES.no_underground] + 2000*AllData[dup][DATA_NAMES.no_rainjar];
	}
	storage = numberWithCommas(storage);

	return storage

}

function filtersDistributed(point) {
	var filters = 0;
	var dup;
	for (var i=0; i<AllData[point].duplicates.length; i++) {
		dup = AllData[point].duplicates[i];
		filters = filters + Number(AllData[dup][DATA_NAMES.no_ceramic_systems]) + Number(AllData[dup][DATA_NAMES.no_ceramic_filters]);
	}
	filters = numberWithCommas(filters);
	return filters
}


// 	23. isEmpty(i, name):
//
// 	Description:		checks to see if a certain field in the global dataset is
//						empty or not.
//
//	Operation:			If the field has an empty or null value, returns true.
//
//	Dependencies:		None.
// 	Arguments:			i 	---	the index of the global dataset to check
//						name---	the name of the field to check
//	Return values: 		Boolean -- true if field is empty or null, false if not.
//
//	Global variables:	AllData 	--- the global dataset
//						DATA_NAMES
//
//	Input:				None.
//	Output:				None.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function isEmpty(i, name) {
	empty = false;
	if (AllData[i][DATA_NAMES[name]] == "" | AllData[i][DATA_NAMES[name]] == null) {
		empty = true;
	}
	return empty;
}

// 	24. beginUserExperience():
//
// 	Description:		Makes the map available to the user.
//
//	Operation:			fades out the overlay and restarts the counter.
//
//	Dependencies:		an element with class = "overlay".
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				The overlay fades out and the counters start to spinner
//						again from 0
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function beginUserExperience() {
	$("#overlay").fadeOut(800, function() {});	// fade out the overlay
	restartCounters();							//	and restart the counters
}

// 	25. restartCounters():
//
// 	Description:		resets the counters from 0
//
//	Operation:			for each counter, set the innerHTML to 0, then
//						call fillCounters() to refill them.
//
//	Dependencies:		The counter elements with the following ids:
//							stats_projects_no, stats_people_no, stats_capacity_no,
//							stats_ceramic_no
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				The counters reset to 0 and start spinning again
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function restartCounters() { 	// Resets the odometer counters to 0
	if (!detectMobile()){		// only restart the counters if we're not on a mobile/tablet
		document.getElementById("stats_projects_no").innerHTML = 0;	// fill it!
		document.getElementById("stats_people_no").innerHTML = 0;
		document.getElementById("stats_capacity_no").innerHTML = 0;
		document.getElementById("stats_ceramic_no").innerHTML = 0;
		fillCounters();
	}
}

// 	26. disableMapControls() / enableMapControls():
//
// 	Description:		disables and enables zooming, panning scrolling, etc. on
//						the map.
//
//	Operation:			uses Leaflet commands to disable and enable specific
//						map controls.
//
//	Dependencies:		leaflet.js
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				Map becomes non/re-interactive for the user
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function disableMapControls() {
	if(map) {
		map.dragging.disable();
		map.touchZoom.disable();
		map.doubleClickZoom.disable();
		map.scrollWheelZoom.disable();
		map.boxZoom.disable();
		map.keyboard.disable();
		if (map.tap) map.tap.disable();
		document.getElementById('WaterMap').style.cursor='default';
	}
}

function enableMapControls() {
	if (map) {
		map.dragging.enable();
		map.touchZoom.enable();
		map.doubleClickZoom.enable();
		map.scrollWheelZoom.enable();
		map.boxZoom.enable();
		map.keyboard.enable();
		if (map.tap) map.tap.enable();
		document.getElementById('WaterMap').style.cursor='grab';
	}
}

// 	27. invert():
//
// 	Description:		Inverts the key: value pairs in a lookup table
//
//	Operation:			Taken from the folks at underscorejs.org
//
//	Dependencies:		None.
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				Map becomes non/re-interactive for the user
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		4/APR/2018	aaron krupp		functional specification writen

function invert(obj) {
	var result = {};
	var keys = _.keys(obj);
	for (var i = 0, length = keys.length; i < length; i++) {
		result[obj[keys[i]]] = keys[i];
	}
	return result
}

// 	28. formatDate(d):
//
// 	Description:		formats the date in the appropriate language
//
//	Operation:			Accepts strings "", "today", or Date objects
//						If given an empty string, returns an empty string.
//						Otherwise, returns the date as a string formatted
//						as dd/MMM/yyyy (if "today" is passed as the arg,
//						returns today's date, formatted as described above. Duh.).
//						If the passed value is invalid, throws an error.
//
//	Dependencies:		None.
// 	Arguments:			d	---	"", "today", or object type Date
//	Return values: 		string of the date with format dd/MMM/yyyy with MMM in the appropriate language
//						or "" if arg is "".
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				None.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		20/MAY/2018	aaron krupp		functional specification & fn writen
//						12/OCT/2018	aaron krupp		function and functional spec modified to accomodate Date objects and ""

function formatDate(d) {
	if (d instanceof Date | d == "today") {
		if (d == "today") {
			d = new Date();
		}
		var dd = d.getDate();
		var MMM = MONTH_CODES[d.getMonth()];
		var yyyy = d.getFullYear();
		return dd+"/"+MMM+"/"+yyyy;
	} else if (d == "") {
		return ""
	} else {
		throw new Error("An invalid date was used as an argument in the formatDate() function.")
	}
}

// 	29. sendErrorMsg():
//
// 	Description:		Sends a GET request to a Zapier-generated webhook URL
//
//	Operation:			Sends get by changing the document.location to globally set URL.
//
//	Dependencies:		None.
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	ERROR_MSG_WEBHOOK_URL --- url to which to send the GET request
//
//	Input:				None.
//	Output:				Changes the document's location to that of the webhook.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		12/OCT/2018	aaron krupp		functional specification & fn writen

function sendErrorMsg() {
	document.location.href = ERROR_MSG_WEBHOOK_URL;
}


// 	30. detectMobile():
//
// 	Description:		Checks to see if the user is on a mobile browser.
//
//	Operation:			Thanks to Michael Zaporozhets for this function:
//						http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
//						Basically just checks all known mobile/table browsers.
//
//	Dependencies:		None.
// 	Arguments:			None.
//	Return values: 		Binary 	---	True for mobile/tablet, false otherwise.
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				None.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		Relies on known browsers/platforms as of writing, needs to be
//						regularly updated. Ugh.
//
// 	Update history:		07/MAR/2019	aaron krupp		functional specification & fn added

function detectMobile() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

// 	31. adjustDisplayForMobile():
//
// 	Description:		Adjusts font and element sizing for nice mobile/table experience
//
//	Operation:			Adjusts relevant elements by getId.style
//
//	Dependencies:		None.
// 	Arguments:			None.
//	Return values: 		None.
//
//	Global variables:	None.
//
//	Input:				None.
//	Output:				Font and element sizes change for viewer.
//
//	Error handling:		None.
//
// 	Algorithms:			None.
//	Data structures:	None.
//
//	Known bugs:			None.
// 	Limitations:		None.
//
// 	Update history:		07/MAR/2019	aaron krupp		functional specification & fn added

function adjustDisplayForMobile() {
	document.getElementById("overlay_title").style.fontSize = "36px";
	document.getElementById("overlay_msg").style.fontSize = "22px";
	var displays = document.getElementsByClassName("display_box");
	for(var i=0; i<displays.length; i++) {
		displays[i].style.width = DISPLAY_BOX_WIDTH_MOBILE;
	}

}
