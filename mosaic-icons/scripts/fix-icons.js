const fs = require('fs')
const path = require('path')
const glob = require('glob-all')

const inputDir = '/source/temp/mosaic-icon-sets/icons'
const outputDir = '/source/temp/mosaic-icon-sets/fixed-icons'
const icons = glob.sync([`${inputDir}/*.svg`]).map(f => path.basename(f))

icons.forEach(iconFile => {
    let data = fs.readFileSync(path.join(inputDir, iconFile), 'utf8')
    data = data
        .replace(/<path(.*?)\/>/gm, '<path$1></path>')
        .replace(/\s?id=".*?"/g, '')
        .replace(/\s?style=".*?"/g, '')
    const outputFile = path.join(outputDir, iconFile)
    fs.writeFileSync(outputFile, data, { encoding: 'utf8' })
})
