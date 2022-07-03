const formatBounds = require('./formatBounds')

// return the xpath/id of the element in which (x,y) fits with the smallest area
// assuming we don't send the hierarcy object whose bounds is null
// instead completeViewObject represents the first child of the original completeViewObject

let findTouchedElement = (viewObject, x, y) => {

    let touchedElement ={}
    searchTouchedElement(viewObject, touchedElement, x, y)
    return touchedElement
}

let searchTouchedElement = (viewObject, touchedElement, x, y) => {
    //console.log(viewObject)
    let bounds = formatBounds(viewObject.bounds)

    if(fits(bounds, x, y)){
        if(viewObject.id){
            touchedElement.selector = 'id'
            touchedElement.value = viewObject.id
        }
        else{
            touchedElement.selector = 'xpath'
            touchedElement.value = viewObject.xpath
        }
        for(let i = 0 ; i < viewObject.childs.length ; i++){
            searchTouchedElement(viewObject.childs[i], touchedElement, x, y)
        }
    }
}


let fits = (bounds, x, y) => {
    if(x >= bounds[0] && x <= bounds[2] && y >= bounds[1] && y <= bounds[3])
        return true
    return false
}

module.exports = findTouchedElement