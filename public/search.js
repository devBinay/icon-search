function elementFromString(html) {
    const div = document.createElement('div')
    div.innerHTML = html.trim()
    return div.firstChild
}

//fetch function defination to make server call
function postData(url = '', data = {}, type) {
    return fetch(url, {
        method: type,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: data
    }).then(response => response.json())
}

// triggered on input event of search box
function changeHandler (filter) {
    const exactContainer = document.querySelector('#exact-match')
    const partialContainer = document.querySelector('#partial-match') 
    const synonymContainer = document.querySelector('#synonyms-match')

    exactContainer.textContent = null
    partialContainer.textContent = null
    synonymContainer.textContent = null

    const searchKey = filter.trim()
    if (searchKey !== null && searchKey !== "") {

        //JSON object to send to server
        const search = {
            'key': filter.trim()
        }

        // server call with promise
        postData('/generated', JSON.stringify(search), 'POST')
        .then(value => {
            const exactMatch = value.exactMatch[0]
             const partialMatch = value.partialMatch[0]
            const synonymsMatch = value.synonymsMatch[0]

            if (exactMatch.length > 0) {
                createTile(exactMatch, exactContainer, 'Exact result')
            }
            if ( partialMatch.length > 0 ) {
                createTile(partialMatch, partialContainer, 'Partial result')
                if( synonymsMatch.length === 0) {
                    const hr = partialContainer.querySelector('hr')
                    hr.classList.add('d-none')
                }
            }
            if ( synonymsMatch.length > 0 ) {
                createTile(synonymsMatch, synonymContainer, 'Related result', true)
            }
       
        }).catch(error => console.error(error))
    }
}

function createTile (icons, container, title, lastSegment=false) {

    const heading = document.createElement('h5')
    heading.classList.add('d-flex')
    heading.classList.add('mb-2')
    heading.textContent = title
    container.appendChild(heading)

    const notification = document.querySelector('mosaic-notification')
    icons.forEach((element, index) => {
        document.body.appendChild(elementFromString(` <template id="my-template-${index}">
                                <mosaic-tile icon="" title="" fixed="250px"></mosaic-tile>
                            </template>`))
        const tileTemplate = document.querySelector(`#my-template-${index}`)
        const tileElement = document.importNode(tileTemplate.content, true)
        const tile = tileElement.querySelector('mosaic-tile')

        tile.setAttribute('icon', element)
        tile.setAttribute('title', element)
        container.appendChild(tile)
        tile.addEventListener('click', (e) => { 

            // Copy to clipboard - creating dummy input and attaching to DOM and removing
            const input = document.createElement('input')
            input.setAttribute('type', 'text')
            input.setAttribute('value', element)
            document.body.appendChild(input)
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input)

            notification.success('Copied to clipboard')
        })
    })

    if (!lastSegment) {
        const hr = document.createElement('hr')
        container.appendChild(hr)
    }
}

document.addEventListener('mosaicComponentsReady', () => {
    const search = document.querySelector('#my-search')

    //search input listener
   search.addEventListener('input', (e) => {
        window.iconFilter = e.detail.value
        setTimeout(() =>{
            changeHandler(window.iconFilter)
        }, 500)
    })
})
