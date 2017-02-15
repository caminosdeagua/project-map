# project-map
Map of all Caminos de Agua projects

# How to update data
1. Go to the Caminos dropbox: Mapping and Data Set -> 1. Online Dataset -> Project Maps Data 
2. Open "Projects Database.xls
3. Add your data to the spreadsheet
4. Run the Macro by pushing the button in the upper left, "Make website..."
5. A new sheet/tab should be generated called "Projects Database Website." Navigate to this sheet.
6. Save As .csv file.
7. Open the .csv file in a text editor like TextEdit, Notepad, or Notepad++
8. Copy/paste the entire .csv file into http://www.csvjson.com/csv2json and push ">Convert"
9. Copy/paste the .json output into http://jsonlint.com/ and push "Validate JSON"
10. If an error is displayed, fix it! 
11. If "Valid JSON" is displayed, copy the input.
12. Go to the github repo: caminosdeagua -> project-map -> data
13. Open the file "project_map_dataset.json"
14. Delete everything after the = sign. (all but the top line)
15. Paste your validated JSON from step 11 after the equals sign.
16. Save the file and commit and sync with github.
17. CHECK https://caminosdeagua.github.io/project-map TO MAKE SURE YOUR CHANGES HAVE BEEN APPLIED!!!
18. Woohoo!!!
