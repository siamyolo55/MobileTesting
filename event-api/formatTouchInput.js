// currently filtering only single touch/tap event
// later on we'll try to capture other events as slide/double tap etc
let formatTouchInput = (curData) => {
    //console.log(curData)
    // let lines = curData.split('\n')
    // let btn_touch = false
    let abs_mt_x = curData.indexOf('ABS_MT_POSITION_X')
    let abs_mt_y = curData.indexOf('ABS_MT_POSITION_Y') // false / false on older iterations
    //console.log(abs_mt_x, abs_mt_y, 'cords found in curData')
    if(abs_mt_x > 0  && abs_mt_y > 0){
        let touchTime = new Date()
        let hexCordX = curData.substr(abs_mt_x + 21, 8)
        let hexCordY = curData.substr(abs_mt_y + 21, 8)
        //console.log(hexCordX, hexCordY)
        let cordX = parseInt(hexCordX, 16)
        let cordY = parseInt(hexCordY, 16)
        return {cordX, cordY, touchTime}
    }
    return null
}

module.exports = formatTouchInput