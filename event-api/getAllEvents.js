const { spawn } = require('child_process')
const getDeviceProperties = require('../event-filterer/findDeviceEventBus')

const {pixelHeight, pixelWidth, device} = getDeviceProperties()
console.log(device)

const cmd = spawn('adb', ['exec-out', 'getevent', '-lt', device])

let cnt = 0
let cords_start = 52 // index from where cords start

cmd.stdout.on('data', (data) => {
    //console.log(++cnt)
    let curData = data.toString()
    //console.log(curData)
    let cords = formatTouchInput(curData)
    if(cords)
        console.log(cords)

})

let formatTouchInput = (curData) => {
    let lines = curData.split('\n')
    let btn_touch = false, abs_mt_x = false, abs_mt_y = false
    let hexCordX = "", hexCordY = ""
    for(let i = 0 ; i < lines.length ; i++){
        //console.log(lines[i])
        //console.log(lines[i].indexOf('BTN_TOUCH') , lines[i].indexOf('DOWN') )
        if(!btn_touch && lines[i].indexOf('BTN_TOUCH') !==1 && lines[i].indexOf('DOWN') !== -1){
            btn_touch = true
            // console.log('setting hex')
            // for(let j = cords_start ; j < cords_start + 8 ; j++)
            //     hexCordX += lines[i][j]
        }
        if(btn_touch && lines[i].indexOf('ABS_MT_POSITION_X') !== -1){
            for(let j = cords_start ; j < cords_start + 8 ; j++)
                hexCordX += lines[i][j]
                abs_mt_x = true
        }
        if(btn_touch && lines[i].indexOf('ABS_MT_POSITION_Y') !== -1){
            for(let j = cords_start ; j < cords_start + 8 ; j++)
                hexCordY += lines[i][j]
                abs_mt_y = true
        }
    }
    if(btn_touch && abs_mt_x && abs_mt_y){
        let cordX = parseInt(hexCordX, 16)
        let cordY = parseInt(hexCordY, 16)
        return {cordX, cordY}
    }
    return null
}




