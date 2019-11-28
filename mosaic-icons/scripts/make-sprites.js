const SVGSpriter = require('svg-sprite')
const glob = require('glob-all')
const path = require('path')
const fs = require('fs')

const config = {
    'mode': {
        'symbol': {
            'bust': false,
            'inline': true
        }
    }
}

const inputDir = '/source/temp/mosaic-icon-sets/office'
const outputDir = '/source/temp/mosaic-icon-sets/office-sprites'
const officeIcons = glob.sync([`${inputDir}/*.svg`]).map(f => path.basename(f))

const sprintPromises = []

officeIcons.forEach(iconFile => {
    sprintPromises.push(new Promise((resolve, reject) => {
        const svgData = fs.readFileSync(path.join(inputDir, iconFile), 'utf8')
        const spriter = new SVGSpriter(config)
        spriter.add(`./${iconFile}`, `${path.basename(iconFile)}`, svgData)
        spriter.compile(function(error, result) {
            if (error) {
                reject(error)
            }
            let data = result.symbol.sprite._contents.toString()
            data = data
                .replace(/<svg.*?>/gm, '')
                .replace(/<\/svg>/gm, '')
                .replace(/<circle(.*?)\/>/gm, '<circle$1></circle>')
                .replace(/<path(.*?)\/>/gm, '<path$1></path>')
                .replace(/id=""/g, '')
                .replace(/\s{2,}/gm, '')
                .replace(/"(?:\s{1,})/gm, '" ')
                .replace(/<symbol(.*?)>/gm, '<svg$1>')
                .replace(/<\/symbol>/gm, '</svg>')
                .replace(/"xmlns=/, '" xmlns=')
            const outputFile = path.join(outputDir, iconFile)
            fs.writeFileSync(outputFile, data, { encoding: 'utf8' })
            resolve(outputFile)
        })
    }))
})

Promise.all(sprintPromises)
    .then(result => {
        console.log(result)
    })
