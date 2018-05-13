# project-map
This map shows points for each of Caminos de Agua's projects. 
Points are color-coded by project type and are clickable for more information.
If a location has multiple projects, clicking on the location shows a summary of all projects from which individual projects can be selected. 

## Use
Since this project is exclusively a "front end" with no server-based code, it lives here on github and is accessible for viewing in github pages. You can view it at: https://caminosdeagua.github.io/project-map

To embed this page on a website, simply use an iframe with the following code, adjusting the width and height as appropriate:

`<iframe width="100%" height="520" frameborder="0" src="https://caminosdeagua.github.io/project-map/" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>`

## How to update the map
If you are not a member of the Caminos de Agua team and/or cannot commit to this repo, ignore the rest of this page and enjoy perusing or using the map!

However, if you *are* with Caminos de Agua and need to update the map, please follow the following steps.
1. Go to the Caminos dropbox: Mapping and Data Set -> 1. Online Dataset -> Project Maps Data 
2. Open "Projects Database.xls
3. Add your data to the spreadsheet
4. **MAKE SURE THE SPREADSHEET IS SORTED BY:
    1. Name (a-z)
    1. Start year (ascending)
    1. Start month (ascending)**
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
