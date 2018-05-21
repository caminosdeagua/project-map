// This script grabs the appropriate language files. #es at end of URL for spanish,
//	otherwise english will display
//
// Version History
//
//	aaron krupp 23-Apr-2018	first draft written

var head = document.getElementsByTagName('head')[0];
var js = document.createElement("script");
var post_hash = location.href.split("#")[1];
js.type = "text/javascript";

if (post_hash == "es") {
	js.src = "text/display_Spanish.js";
	$('head').append('<link rel="stylesheet" type="text/css" href="https://caminosdeagua.github.io/project-map/styles/map_styles_Spanish.css">');
} else {
	js.src = "text/display_English.js";
	$('head').append('<link rel="stylesheet" type="text/css" href="https://caminosdeagua.github.io/project-map/styles/map_styles_English.css">');	
}

head.appendChild(js);