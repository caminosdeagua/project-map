# project-map
This map shows points for each of Caminos de Agua's projects. 
Points are color-coded by project type and are clickable for more information.
If a location has multiple projects, clicking on the location shows a summary of all projects from which individual projects can be selected. 

## Use
Since this project is exclusively a "front end" with no server-based code, it lives here on github and is accessible for viewing in github pages. You can view it at: https://caminosdeagua.github.io/project-map

To embed this page on a website, simply use an iframe with the following code, adjusting the width, height, and language as desired:

```html
<iframe width="100%" height="520" frameborder="0" src="https://caminosdeagua.github.io/project-map#en" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>
```

To use the map in another language, just add a hash. So ...io/project-map#es will display in spanish while ...io/project-map#en will display in English. Default (no hash) displays in English. Currently only available in English & Spanish.

## How it works | how to update
If you are not a member of the Caminos de Agua team and/or cannot commit to this repo, ignore the rest of this page and enjoy perusing or using the map! To use, please see the license information below. 

*The data for this project was originally stored in a JSON in this repository. THAT IS NOW OUTDATED. If you have any instructions for updating the map that involve a JSON, javascript, or an excel file, please ignore them. These are the most up-to-date instructions (as of 20-May-2018).*

All data is stored on two different Google sheets. One is private (and has personal contact information that would be inappropriate to leave publically available on the internet). The other is public and contains only the data that is visualized on the map. They are both stored in Caminos de Agua's Google Drive. They are:

1. (Private) "Projects PRIVATE" (accessible through the Caminos de Agua Google Drive). <-- This is where the edits happen!
2. (Public) "Projects PUBLIC" https://docs.google.com/spreadsheets/d/1P6Obxu21IhjQFcIBh2N4Cv6fJaMmAyfELEs2tfFWLGI/edit?usp=sharing <-- don't touch this except to adjust the range

Each column in the public sheet uses a QUERY() and a few IMPORTRANGE() functions that grabs all the non-sensitive data from the private sheet based on the column headers in the first row of the private sheet. You only need to touch this if you're adding new columns to the map. The code in each cell is:

=QUERY(IMPORTRANGE("https://docs.google.com/spreadsheets/d/1hBGGjgXYfEUDwnmCKSuLcpIdQXj0Ea5TyH_aV_MCqCU/edit#gid=0", "DATA!A:FF"),"SELECT Col"&COINCIDIR("[COLUMN HEADER]", IMPORTRANGE("https://docs.google.com/spreadsheets/d/1hBGGjgXYfEUDwnmCKSuLcpIdQXj0Ea5TyH_aV_MCqCU/edit#gid=0", "DATA!A1:FF1"), 0))

Where [COLUMN HEADER] needs to match the string in row 1 of the public data sheet that you want to retrieve. To add a new column, just copy/paste this code into a new column in the private sheet and update [COLUMN HEADER] appropriately.

A few notes:
1. As stated above, do not change the name of either spreadsheet.

2. Column A in the public sheet must be "Community" and column B must be "Start Date." No other order matters.

3. Dates need to be in dd-MMM-yyyy format with MMM in English (the default date format on the private sheet)

4. To indicate that a project is ongoing, use the TODAY() function in Google Sheets. The cell should turn blue automatically to make it easy to check if your ongoing projects need to be changed to completed

5. To add a new project or update an existing project, just edit the private google sheet appropriately. Your changes should be visible on the project map within seconds. 

6. To add a new column to the project map:
    1. Add your column wherever you want in the PRIVATE sheet
    2. Add this code to whatever column you want (not A or B, see point #2 above) in the PUBLIC sheet, changing [COLUMN HEADER] appropriately so it matches the header that you've added in the PRIVATE sheet: ```QUERY(IMPORTRANGE("https://docs.google.com/spreadsheets/d/1hBGGjgXYfEUDwnmCKSuLcpIdQXj0Ea5TyH_aV_MCqCU/edit#gid=0", "DATA!A:FF"),"SELECT Col"&MATCH("[COLUMN HEADER]", IMPORTRANGE("https://docs.google.com/spreadsheets/d/1hBGGjgXYfEUDwnmCKSuLcpIdQXj0Ea5TyH_aV_MCqCU/edit#gid=0", "DATA!A1:FF1"), 0))```
    3. adjust the files index.html, scripts.js, and the language files appropriately to include a new column. If you cannot figure out how to do this, contact Aaron: askrupp at gmail. 

## How to add a new column

If the column that you want to add is simple (only involves displaying the number in the spreadsheet under a string header), follow these instructions. For any more complex behavior, see the 'Contact' section below.

1. Add column to Projects-PRIVATE

2. Add column to Projects-PUBLIC, substituting the appropriate column name from step (1). 

3. Add a div element with class="info-text" to index.html, setting the id to whatever you want

4. Add appropriate rows to the following vars in the display_English.js file:
	- var DATA_NAMES (key matches id from (3), value matches column header from (1))
	- var LBL (key matches id from (3), value is whatever label you want displayed in the info box in English

5. Repeat (4) for the display_Spanish.js file. 

6. Adjust any calculations that the new category ought to be included in in scripts.js.  


## License
This work is shared under a Creative Commons 4.0 attribution, non-commercial license. It is also covered under [The MIT License](https://opensource.org/licenses/MIT). 

To give propper attribution, please cite:

Creative Commons License
[Project Map | Caminos de Agua](https://caminosdeagua.github.io/project-map) by [Caminos de Agua](https://www.caminosdeagua.org) is distributed under a [4.0 International Atribution-NoCommercial Creative Commons License](https://creativecommons.org/share-your-work/licensing-types-examples/).

## Contact
With any questions please contact us by email at info@caminosdeagua.org. 
