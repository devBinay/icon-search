const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const port = 5001
var thesaurus = require("thesaurus");
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// Reading all icon names and storing it in a Array
let iconSet = []
const iconFolder = './mosaic-icons/svg';
fs.readdir(iconFolder, (err, files) => {
    files.forEach(file => {
        iconSet.push(file.split(".")[0])
    });
});

app.use('/public', express.static('public'))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')))

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))


//method to filter icon
app.post('/generated', (req, res) => {
    const searchKey = req.body.key.toLowerCase()
    const synonyms = thesaurus.find(searchKey)

    const filteredIcons = {              
        exactMatch: [], 
        partialMatch: [],
        synonymsMatch: []
    }

    let exactMatch = []
    let partialMatch = []
    let synonymsMatch = []

    
    iconSet.forEach((nameFromSet) => {

        // icons with exact match
        if (nameFromSet === searchKey) {
            exactMatch.push(nameFromSet)
        }

        // icons with partial match
        if (nameFromSet.includes(searchKey)) {
            if (! exactMatch.includes(nameFromSet)) {
                partialMatch.push(nameFromSet)
            }
        }

        // icons which matches with synonyms
        synonyms.forEach((name) => {
            if (name === nameFromSet) {
                if ( !exactMatch.includes(nameFromSet) && !partialMatch.includes(nameFromSet) ) {
                synonymsMatch.push(nameFromSet)
                }
            }
        })

    })
    
    filteredIcons['exactMatch'].push(exactMatch)
    filteredIcons['partialMatch'].push(partialMatch)
    filteredIcons['synonymsMatch'].push(synonymsMatch)

    res.send(filteredIcons)

})