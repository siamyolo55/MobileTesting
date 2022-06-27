const { spawn } = require('child_process')
const getDeviceProperties = require('../event-filterer/findDeviceEventBus')

const {pixelHeight, pixelWidth, device} = getDeviceProperties()
console.log(device)

const cmd = spawn('adb', ['exec-out', 'getevent', '-lt', device])

let cords_start = 52 // index from where cord starts
let time_start_idx = 4 // index from where timestamp starts

cmd.stdout.on('data', (data) => {
    //console.log(++cnt)
    let curData = data.toString()
    //console.log(curData)
    let cords = formatTouchInput(curData)
    if(cords)
        console.log(cords)

})

// currently filtering only single touch/tap event
// later on we'll try to capture other events as slide/double tap etc
let formatTouchInput = (curData) => {
    let lines = curData.split('\n')
    let btn_touch = false, abs_mt_x = false, abs_mt_y = false
    let hexCordX = "", hexCordY = ""
    let touchTime
    for(let i = 0 ; i < lines.length ; i++){
        if(!btn_touch && lines[i].indexOf('BTN_TOUCH') !==1 && lines[i].indexOf('DOWN') !== -1){
            btn_touch = true
            touchTime = lines[i].substr(time_start_idx, 12) // time string is of length 12
        }
        if(btn_touch && !abs_mt_x && lines[i].indexOf('ABS_MT_POSITION_X') !== -1){
            //console.log(lines[i][4])
            for(let j = cords_start ; j < cords_start + 8 ; j++)
                hexCordX += lines[i][j]
                abs_mt_x = true
        }
        if(btn_touch && !abs_mt_y && lines[i].indexOf('ABS_MT_POSITION_Y') !== -1){
            for(let j = cords_start ; j < cords_start + 8 ; j++)
                hexCordY += lines[i][j]
                abs_mt_y = true
        }
    }
    if(btn_touch && abs_mt_x && abs_mt_y){
        let cordX = parseInt(hexCordX, 16)
        let cordY = parseInt(hexCordY, 16)
        return {cordX, cordY, touchTime}
    }
    return null
}




