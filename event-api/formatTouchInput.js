// currently filtering only single touch/tap event
// later on we'll try to capture other events as slide/double tap etc
let formatTouchInput = (curData) => {
    console.log(curData)
    let lines = curData.split('\n')
    let btn_touch = false
    let abs_mt_x = curData.indexOf('ABS_MT_POSITION_X')
    let abs_mt_y = curData.indexOf('ABS_MT_POSITION_Y') // false / false on older iterations

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

    //let cords_start = 52 // index from where cord starts
    // for(let i = 0 ; i < lines.length ; i++){
    //     later on we'll try to use (BTN_TOUCH == UP) to verify that it's not a long press

    //     if(!btn_touch && lines[i].indexOf('BTN_TOUCH') !==1 && lines[i].indexOf('DOWN') !== -1){
    //         btn_touch = true
    //         touchTime = new Date()
    //         //touchTime = lines[i].substr(time_start_idx, 12) // time string is of length 12
    //     }
    //     if(btn_touch && !abs_mt_x && lines[i].indexOf('ABS_MT_POSITION_X') !== -1){
    //         //console.log(lines[i][4])
    //         for(let j = cords_start ; j < cords_start + 8 ; j++)
    //             hexCordX += lines[i][j]
    //             abs_mt_x = true
    //     }
    //     if(btn_touch && !abs_mt_y && lines[i].indexOf('ABS_MT_POSITION_Y') !== -1){
    //         for(let j = cords_start ; j < cords_start + 8 ; j++)
    //             hexCordY += lines[i][j]
    //             abs_mt_y = true
    //     }

    //     ********* second iteration *************

    //     if(!btn_touch && curData.indexOf('BTN_TOUCH') !==1 && curData.indexOf('DOWN') !== -1){
    //         btn_touch = true
    //         touchTime = new Date()
    //         //touchTime = lines[i].substr(time_start_idx, 12) // time string is of length 12
    //     }
    //     if(btn_touch && !abs_mt_x && lines[i].indexOf('ABS_MT_POSITION_X') !== -1){
    //         //console.log(lines[i][4])
    //         for(let j = cords_start ; j < cords_start + 8 ; j++)
    //             hexCordX += lines[i][j]
    //             abs_mt_x = true
    //     }
    //     if(btn_touch && !abs_mt_y && lines[i].indexOf('ABS_MT_POSITION_Y') !== -1){
    //         for(let j = cords_start ; j < cords_start + 8 ; j++)
    //             hexCordY += lines[i][j]
    //             abs_mt_y = true
    //     }

    //     ****** 3rd iteration ********

        
    // }
    

    // if(btn_touch && abs_mt_x && abs_mt_y){
    //     let cordX = parseInt(hexCordX, 16)
    //     let cordY = parseInt(hexCordY, 16)
    //     return {cordX, cordY, touchTime: touchTime}
    // }
    //return null
}

module.exports = formatTouchInput