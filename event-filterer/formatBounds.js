let formatBounds = (bounds) => {
    let start = false
    let cur = ""
    let numbers = []
    for(let i = 0 ; i < bounds.length ; i++){
        if((bounds[i] === '[' || bounds[i] === ',') && start === false){
            start = true
        }
        else if(start && bounds[i] !== ',' && bounds[i] !== ']' && bounds[i] !== '[')
            cur += bounds[i]
        else if(start && (bounds[i] === ',' || bounds[i] === ']')){
            numbers.push(cur)
            cur = ""
        }
    }
    return numbers
}

module.exports = formatBounds