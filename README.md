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

1. (Private) "Projects TO EDIT" (accessible through the Caminos de Agua Google Drive). <-- This is where the edits happen!
2. (Public) "Projects PUBLIC" https://docs.google.com/spreadsheets/d/1P6Obxu21IhjQFcIBh2N4Cv6fJaMmAyfELEs2tfFWLGI/edit?usp=sharing <-- don't touch this except to adjust the range

The public sheet is a simple IMPORTRANGE() function that grabs all the non-sensitive data from the private sheet. You only need to touch this if you're adding new columns to the map. 

A few notes:
1. As stated above, do not change the name of either spreadsheet.

2. Dates need to be in dd-MMM-yyyy format with MMM in English (the default date format on the private sheet)

3. To indicate that a project is ongoing, use the TODAY() function in Google Sheets. The cell should turn blue automatically to make it easy to check if your ongoing projects need to be changed to completed

4. To add a new project or update an existing project, just edit the private google sheet appropriately. Your changes should be visible on the project map within seconds. 

5. To add a new column to the project map:
    1. if the new column is to be publically visible, add it before the "Contact" column
    2. If the new column is to be private, add it after the last column
    3. adjust the range in A1 of the public sheet if you're adding a publically-available column
    4. adjust the files index.html, scripts.js, and the language files appropriately to include a new column. If you cannot figure out how to do this, contact Aaron: askrupp at gmail. 
    




However, if you *are* with Caminos de Agua and need to update the map, please follow the following steps.
1. Go to the Caminos dropbox: Mapping and Data Set -> 1. Online Dataset -> Project Maps Data 
2. Open "Projects Database.xls
3. Add your data to the spreadsheet
4. **MAKE SURE THE SPREADSHEET IS SORTED BY:**
    1. Name (a-z)
    1. Start year (ascending)
    1. Start month (ascending)
5. Run the Macro by pushing the button in the upper left, "Make website..."
6. A new sheet/tab should be generated called "Projects Database Website." Navigate to this sheet.
7. Save As .csv file (text delimitter: double-quote (""), entry separator: comma (,))
7. Open the .csv file in a text editor like TextEdit, Notepad, or Notepad++
8. Copy/paste the entire .csv file into http://www.csvjson.com/csv2json and push ">Convert" (or any other csv -> json converter)
9. Copy/paste the .json output into http://jsonlint.com/ and push "Validate JSON"
10. If an error is displayed, fix it! 
11. If "Valid JSON" is displayed, copy the input.
12. Go to the github repo: caminosdeagua -> project-map -> data
13. Open the file "project_map_dataset.js"
14. Delete everything after the = sign. (all but the top line)
15. Paste your validated JSON from step 11 after the equals sign.
16. Save the file and commit and sync with github.
17. CHECK https://caminosdeagua.github.io/project-map to make sure that your changes have been applied (can take up to 15 minutes).
18. Woohoo!!!

## License
This work is shared under a Creative Commons 4.0 attribution, non-commercial license. It is also covered under [The MIT License](https://opensource.org/licenses/MIT). 

To give propper attribution, please cite:

Creative Commons License
[Project Map | Caminos de Agua](https://caminosdeagua.github.io/project-map) by [Caminos de Agua](https://www.caminosdeagua.org) is distributed under a [4.0 International Atribution-NoCommercial Creative Commons License](https://creativecommons.org/share-your-work/licensing-types-examples/).

## Contact
With any questions please contact us by email at info@caminosdeagua.org. 
