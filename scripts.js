/////////////////////////////////////////////////////////////////////////////
////					 INITIALIZATION FUNCTION 						  	////
//////////////////////////////////////////////////////////////////////////////// 

function init() {
	fillText();
	initMap(); 					// Initialize and display the map object
	applyBaseMap(); 			// Apply the base tiles to the map
	adjustXLocation();
	loadAndPlotData(); 			// Load the data for Fluoride (the default contaminant) 
								// 	then plot the base markers on the map.	
	fillCounters();				// Read the data for the counters
}								

////////////////////////////////////////////////////////////////////////////////
////					  	fillText FUNCTION	 						  	////
//// 			Fills out all text from appropriate language .js file.		////
////////////////////////////////////////////////////////////////////////////////

function fillText() {
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

////////////////////////////////////////////////////////////////////////////////
////					  	fillCounters FUNCTION	 					  	////
//// 			Fills out all counters by trolling through the dataset		////
////////////////////////////////////////////////////////////////////////////////

function fillCounters() {
	document.getElementById("stats_box").style.display = "inline-block";		// show the stats menu
	document.getElementById("stats_projects_no").innerHTML = totalProjects();	// fill it!
	document.getElementById("stats_people_no").innerHTML = totalPeople();
	document.getElementById("stats_capacity_no").innerHTML = totalCapacity();
	document.getElementById("stats_ceramic_no").innerHTML = totalCartridgesAndSystems();
}


////////////////////////////////////////////////////////////////////////////////
////					  	initMap FUNCTION	 						  	////
//// 			This function initializes the global map object.			////
////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////
////					  	applyBaseMap FUNCTION 						  	////
//// 	This function grabs a set of Stamen or Mapzen base tiles and 		////
//// 	applies them to the map. 											////
////////////////////////////////////////////////////////////////////////////////


function applyBaseMap() {
	map.addLayer(new L.StamenTileLayer(STAMEN_MAP_TYPE), {});
	
}

////////////////////////////////////////////////////////////////////////////////
////					  adjustXLocation FUNCTION 						  	////
//// 	This function adjusts the location of the x-button that closes the	////
////	info panel, lobby, or other windows. It puts it a set pixel distance////
////	to the left of the scrollbar. 										////
////////////////////////////////////////////////////////////////////////////////

function adjustXLocation() {
	var xButtons = document.getElementsByClassName("x-butt");
	for (var i=0; i<xButtons.length; i++) {
		xButtons[i].style.right = String(getScrollBarWidth()+X_OFFSET_FROM_SCROLLBAR)+'px';
	}
}

////////////////////////////////////////////////////////////////////////////////
////					 	loadAndPlotData FUNCTION 					  	////
//// 	This function grabs data from the JSON and stores it in a local 	////
//// 	variable array. It also stores a copy of the data in the global 	////
////	array AllData for other functions to access. After storing the 		////
////	data, it calls functions to plot them. 								////
////	MAKE SURE ALL DATA IS SORTED BY NAME, THEN START-YEAR, THEN START- 	////
////	MONTH, OTHERWISE YOU'LL LOSE A LOT OF DATA!!!						////
////////////////////////////////////////////////////////////////////////////////

function loadAndPlotData() {

	base.Markers = [];
	base.Popups = [];
	selectedIcon = L.icon({
		iconUrl: SELECTED_URL,
		iconSize: LARGE_ICON_SIZE
	});
	var duplicateCounter = 0;
	var data = PROJECT_MAP_DATA;	// This grabs the JSON data file. 
	AllData = data; 				// store data as global for later access.
	photos = Array.apply(null, Array(data.length)).map(Boolean.prototype.valueOf,false); 	// init an array full of "false"'s to later populate with images
	// (Un)comment the next line to (see) hide the full dataset (in) from the console, super useful for debugging!
	//console.log("Data acquired! "+JSON.stringify(data)); 	// log the data in the console for debugging...
	
	for (var i=0; i<data.length; i++) { // Loop through all the rows of the data
		var bin;
		if (isEmpty(i, "name") | isEmpty(i, "lat") | isEmpty(i, "lng") | bin == -1) { 		// if the row is missing a name, latitutde, or longitude, or doesn't fit a bin,
		} else {																			//	ignore it. Otherwise:
			if (i==0 || data[i][DATA_NAMES.name] != data[i-1][DATA_NAMES.name]) {			// if not a duplicate point (special case for 0th point, cause 0-1 does not exist)
				duplicateCounter = 0;
				AllData[i].duplicates = [i]; 		// create a new array in AllData called duplicates to hold indices of duplicates of this point
				bin = getBin(data, i);
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
																// 	(returns value of marker's center, regardless of where is clicked...)
						var j = base.Markers.map(function(a) {return a._latlng.lat}).indexOf(click_lat);
																// this confusing line gets the index in base.Markers
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

////////////////////////////////////////////////////////////////////////////////
////					 	getBin FUNCTION 					  			////
//// 	Gets the correct bin of the point. Does so with the 				////
////	following algorithm:												////
////		Bin 0: RWH														////
////		Bin 1: Ceramic water filter										////
////		Bin 2: Biochar system											////
////////////////////////////////////////////////////////////////////////////////

function getBin(data, i) {
	var bin = -1;
	if (data[i][DATA_NAMES.proj_type] == RAIN_PROJ) {
		bin = RAINWATER;
	} else if (data[i][DATA_NAMES.proj_type] == CERAMIC_PROJ) {
		bin = CERAMIC;
	} else if (data[i][DATA_NAMES.proj_type] == BIOCHAR_PROJ) {
		bin = BIOCHAR;
	} else if (data[i][DATA_NAMES.proj_type] == OTHER_PROJ) {
		bin = OTHER;
	}
	return bin
}

////////////////////////////////////////////////////////////////////////////////
////			openInfoPanel & closeInfoPanel FUNCTIONs		  			////
//// 	Opens and closes the info panel respectivel. Duh.					////
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


////////////////////////////////////////////////////////////////////////////////
////						showInfo FUNCTION					  			////
//// 	Gets the correct information from the global dataset, then pushes	////
////	it into the correct places in the info panel. 						////
////////////////////////////////////////////////////////////////////////////////

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
		} else if (id == "dates") {				// If there are dates, include them here:
			if (isEmpty(z, "start_year") && isEmpty(z, "end_year")) {}		// if there is no year (i.e. no date) do not display
			else {
				toDisplay = true;
				var start_date = formatDate(AllData[z][DATA_NAMES.start_day], AllData[z][DATA_NAMES.start_month], AllData[z][DATA_NAMES.start_year])
				var end_date = formatDate(AllData[z][DATA_NAMES.end_day], AllData[z][DATA_NAMES.end_month], AllData[z][DATA_NAMES.end_year])
				var formattedDate;
				if (start_date == NO_INFO) {
					formattedDate = String(end_date);
				} else if (end_date == NO_INFO) {
					formattedDate = String(start_date);
				} else {
					if(end_date == start_date) {
						formattedDate = String(start_date);
					} else {
						formattedDate = String(start_date+BETWEEN_DATES+end_date);
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
		} else if (id == "notes1"){
			
			if (isEmpty(z, id)) {
			} else if (isEmpty(z, "notes2")) {
				toDisplay = true;
				els[i].innerHTML = "<b>"+LBL[id]+"</b>"+END_OF_HEADER+AllData[z][DATA_NAMES.notes1];
				
			} else if (isEmpty(z, "notes3")) {
				toDisplay = true;
				els[i].innerHTML = "<b>"+LBL[id]+"</b>"+END_OF_HEADER+AllData[z][DATA_NAMES.notes1]+"\xa0"+AllData[z][DATA_NAMES.notes2];
			}
			else if (isEmpty(z, "notes4")) {
				toDisplay = true;
				els[i].innerHTML = "<b>"+LBL[id]+"</b>"+END_OF_HEADER+AllData[z][DATA_NAMES.notes1]+"\xa0"+AllData[z][DATA_NAMES.notes2]+"\xa0"+AllData[z][DATA_NAMES.notes3];
			}
			else if (isEmpty(z, "notes5")) {
				toDisplay = true;
				els[i].innerHTML = "<b>"+LBL[id]+"</b>"+END_OF_HEADER+AllData[z][DATA_NAMES.notes1]+"\xa0"+AllData[z][DATA_NAMES.notes2]+"\xa0"+AllData[z][DATA_NAMES.notes3]+"\xa0"+AllData[z][DATA_NAMES.notes4];
			} else {
				toDisplay = true;
				els[i].innerHTML = "<b>"+LBL[id]+"</b>"+END_OF_HEADER+AllData[z][DATA_NAMES.notes1]+"\xa0"+AllData[z][DATA_NAMES.notes2]+"\xa0"+AllData[z][DATA_NAMES.notes3]+"\xa0"+AllData[z][DATA_NAMES.notes4]+"\xa0"+AllData[z][DATA_NAMES.notes5];
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

////////////////////////////////////////////////////////////////////////////////
////						showLobby FUNCTION					  			////
//// 	Gets the correct information from the global dataset, then pushes	////
////	it into the correct places in the lobby.	 						////
////////////////////////////////////////////////////////////////////////////////

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
				dateExists = !isEmpty(dup, "start_month") && !isEmpty(dup, "start_year");
				if (j==0) {
					if (dateExists) {		// if there's a date
						date = MONTHS_LONG[AllData[dup][DATA_NAMES.start_month]-1]+", "+String(AllData[dup][DATA_NAMES.start_year]); 		// concatenate month name and year
						els[i].innerHTML = "<p class='proj_box_even' onclick='openFromLobby("+String(dup)+");'>"+nameToDisplay+": "+date+"</p>";
					} else {
						els[i].innerHTML = "<p class='proj_box_even' onclick='openFromLobby("+String(dup)+");'>"+nameToDisplay+"</p>";
					}
				} else {
					if (j%2==0) {
						if (dateExists) {
							date = MONTHS_LONG[AllData[dup][DATA_NAMES.start_month]-1]+", "+String(AllData[dup][DATA_NAMES.start_year]); 		// concatenate month name and year
							els[i].innerHTML = els[i].innerHTML+"<p class='proj_box_even' onclick='openFromLobby("+String(dup)+");'>"+nameToDisplay+": "+date+"</p>";
						} else {
							els[i].innerHTML = els[i].innerHTML+"<p class='proj_box_even' onclick='openFromLobby("+String(dup)+");'>"+nameToDisplay+"</p>";
						}
					} else {
						if (dateExists) {
							date = MONTHS_LONG[AllData[dup][DATA_NAMES.start_month]-1]+", "+String(AllData[dup][DATA_NAMES.start_year]); 		// concatenate month name and year
							els[i].innerHTML = els[i].innerHTML+"<p class='proj_box_odd' onclick='openFromLobby("+String(dup)+");'>"+nameToDisplay+": "+date+"</p>";
						} else {
							els[i].innerHTML = els[i].innerHTML+"<p class='proj_box_odd' onclick='openFromLobby("+String(dup)+");'>"+nameToDisplay+"</p>";
						}
					}
				}
			}	
		}
		
	}	
}

////////////////////////////////////////////////////////////////////////////////
////						openFromLobby FUNCTION					  		////
//// 	When a project is clicked in the lobby, this function opens the 	////
////	info panel with the appropriate data called.						////
////////////////////////////////////////////////////////////////////////////////

function openFromLobby(z) {
	
	showInfo(z);
	openPanel('info_panel');
	closePanel('lobby');
}


////////////////////////////////////////////////////////////////////////////////
////					 	getLabel FUNCTION 							  	////
//// 	Takes in the type of label to plot (string) and the index of the 	////
////	marker's data in the global data array, data. Returns the string 	////
////	that will be contained in the label. 								////
////////////////////////////////////////////////////////////////////////////////

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


////////////////////////////////////////////////////////////////////////////////
////					 	removePoint FUNCTION 						  	////
//// 			Removes the point stored at the index i.					////
////////////////////////////////////////////////////////////////////////////////

function removePoint(i) {
	map.removeLayer(base.Markers[i]); 
}


////////////////////////////////////////////////////////////////////
////				functions fadeIn(el), fadeOut(el) 			////
//// 															////
////	Fades in or out the passed element by adjusting the 	////
////	the div element's opacity in steps. Many thanks to:		////////////////////
////	http://www.chrisbuttery.com/articles/fade-in-fade-out-with-javascript/ 	////	
////	for this simple and lovely bit of js. Cheers! 							////
////	If the div is visible, fadeIn does nothing. If it's not, fade out 		////	
////	does nothing. 															////
////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////
////					 	onKeypress FUNCTION 						  	////
//// 			Closes the info panel if the user presses "esc".			////
////////////////////////////////////////////////////////////////////////////////

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


////////////////////////////////////////////////////////////////////////////////
////		showSelectedMarker / hideSelectedMarker FUNCTIONs 			  	////
//// 	Shows or hides the icon that indicates that a certain marker		////
////	has been selected.													////
////////////////////////////////////////////////////////////////////////////////

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

function formatDate(start, end) {
	var e = String(end).split("/", 3);
	var s = String(start).split("/", 3);
	if (start == "") {
		date = e[1]+"/"+MONTHS[Number(e[0])]+"/"+e[2];
	}
	if (end == "") {
		date = s[1]+"/"+MONTHS[Number(s[0])]+"/"+s[2];
	}
	else {
		date_end = e[1]+"/"+MONTHS[Number(e[0])]+"/"+e[2];
		date_start = s[1]+"/"+MONTHS[Number(s[0])]+"/"+s[2];
		date = date_start+" - "+date_end;	
	}	
	return date
}

////////////////////////////////////////////////////////////////////
////			function numberWith(out)Commas		 			////
//// 															////
////	Adds commas between every 3rd digit for the standard 	////
////	US/Mexico numerical display format. Returns the number  ////
//// 	as a string.											////
////	The Without function does the reverse (takes in a 		////
////	string that could have commas, removes them, and returns////
////	a numerical value, either a float or an int).			////
////////////////////////////////////////////////////////////////////
							
function numberWithCommas(x) {
	return parseInt(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 	//The parseInt() removes any leading zeros that the value may have. 
}

function numberWithoutCommas(x) {
	return Number(x.replace(/,/g, ''));
}

////////////////////////////////////////////////////////////////////
////			function getScrollBarWidth		 				////
//// 															////
////	gets the width of a vertical scrollbar by making some	////
////	invisible divs.											////
////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////
////			function enable/disableMapControls 				////
//// 															////
////	Disables and enables panning, zooming, and all keyboard	////
////	map controls when the cursor is and isn't over the map.	////
////////////////////////////////////////////////////////////////////


function disableMapControls() {
	
	map.dragging.disable();
	map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();
	map.boxZoom.disable();
	map.keyboard.disable();
	if (map.tap) map.tap.disable();
	document.getElementById('WaterMap').style.cursor='default';
}

function enableMapControls() {
	map.dragging.enable();
	map.touchZoom.enable();
	map.doubleClickZoom.enable();
	map.scrollWheelZoom.enable();
	map.boxZoom.enable();
	map.keyboard.enable();
	if (map.tap) map.tap.enable();
	document.getElementById('WaterMap').style.cursor='grab';
}

////////////////////////////////////////////////////////////////////
////			function openFullSummary						////
//// 															////
////	Opens a new tab with the fulltext readout of:			////
////		- Liters of rainwater capacity installed			////
////		- # rainwater systems installed						////	
////		- # filter systems distributed						////
////		- # of filter cartridges distributed				////
////		- liters of ceramic filtration capability			////
////		- People impacted									////
////		- Total # of communities worked in					////
////		- List of partner organizations						////
////		- Total # of projects								////
////		- # of "Other" projects								////
////		- List of "Other" project names w/ community name	////
////		- # of projects in schools							////
////		- # of short workshops								////
////		- # of long workshops								////
////		- # of hours of community-volunteered labor			////
////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////
////						totalProjects 	FUNCTION						////
////						totalPeople		FUNCTION						////
////						totalCapacity	FUNCTION						////
////						totalCartridgesAndSystems	FUNCTION			////
////						totalCommunities	FUNCTION					////
////						totalOther		FUNCTION						////
////						totalRainSys	FUNCTION						////
////						totalCeramic	FUNCTION						////
////						totalPartners	FUNCTION						////
////						totalWorkshops	FUNCTION						////
////						totalHours		FUNCTION						////
////						totalSchools	FUNCTION						////
////																		////
//// 	These functions agregate information from all of the duplicate 		////
////	projects over all of the sites. Can only be called once all the 	////
////	data has been loaded. Each one loops through all of the base points	////
////	aggregating the grouped data from all of the base points.			////
////	Returns: int														////
////////////////////////////////////////////////////////////////////////////////

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
				total = total + Number(AllData[index][DATA_NAMES.no_ferro]) + Number(AllData[index][DATA_NAMES.no_roto_small]) + Number(AllData[index][DATA_NAMES.no_roto_big]) + Number(AllData[index][DATA_NAMES.no_geomembrane]) + Number(AllData[index][DATA_NAMES.no_underground]) + Number(AllData[index][DATA_NAMES.no_rainjar]);
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

////////////////////////////////////////////////////////////////////////////////
////						projectsCompleted 	FUNCTION					////
////						peopleImpacted 		FUNCTION					////
////						storageInstalled	FUNCTION					////
////						filetersDistributed	FUNCTION					////
//// 	These functions agregate information from all of the duplicate 		////
////	projects for the site at 'point' and return  a str to the user. 	////
////////////////////////////////////////////////////////////////////////////////


function projectsCompleted(point) {
	return AllData[point].duplicates.length
}

function peopleImpacted(point) {
	var ppl = 0;
	var dup;
	for (var i=0; i<AllData[point].duplicates.length; i++) {
		dup = AllData[point].duplicates[i];
		ppl = ppl + AllData[dup][DATA_NAMES.people];
	}
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
		storage = storage + 12000*AllData[dup][DATA_NAMES.no_ferro] + 2500*AllData[dup][DATA_NAMES.no_roto_small] + 10000*AllData[dup][DATA_NAMES.no_roto_big] + 30000*AllData[dup][DATA_NAMES.no_geomembrane] + 80000*AllData[dup][DATA_NAMES.no_underground] + 2000*AllData[dup][DATA_NAMES.no_rainjar];
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
////////////////////////////////////////////////////////////////
////			function formatDate							////
////														////
////	Takes in d (day, 1-31), m (month 1-12), and year 	////
////	(yyyy). and returns a string with the format		////
////	dd/mmm/yyyy where dd are numbers, mmm are text, and	////
////	yyyy is the numerical year.							////
////////////////////////////////////////////////////////////////

function formatDate(d, m, y) {
	if(d && m && d) {
		return String(d)+"/"+MONTHS[m-1]+"/"+String(y)
	} else {
		return NO_INFO
	}
}

////////////////////////////////////////////////////////////////
////			function isEmpty							////
////														////
////	Checks the ith entry in the global AllData dataset	////
////	to see if there's anything entered into the "name"	////
////	column. If so, returns false (not empty). otherwise,////
////	returns true (empty). 								////
////////////////////////////////////////////////////////////////

function isEmpty(i, name) {
	empty = false;
	if (AllData[i][DATA_NAMES[name]] == "" | AllData[i][DATA_NAMES[name]] == null) {
		empty = true;
	}
	return empty;
}

function beginUserExperience() {
	$("#overlay").fadeOut(800, function() {});	// fade out the overlay
	restartCounters();							//	and restart the counters 	
}

function restartCounters() { // Resets the odometer counters to 0
	document.getElementById("stats_projects_no").innerHTML = 0;	// fill it!
	document.getElementById("stats_people_no").innerHTML = 0;
	document.getElementById("stats_capacity_no").innerHTML = 0;
	document.getElementById("stats_ceramic_no").innerHTML = 0;
	fillCounters();
}