const { spawnSync } = require('child_process')

let output = null
let searchSection = null


let getDeviceProperties = () => {
    const cmd = spawnSync("adb", ["shell", "getevent", "-li"])
    output = cmd.stdout.toString()

    let x = ""
    let y = ""
    let device

    let sections = output.split("input props:")
    for(let i = 0 ; i < sections.length ; i++){
        if(sections[i].indexOf("ABS (0003)") !== -1){
            searchSection = sections[i]
            //console.log(searchSection)
            break
        }
    }
    if(searchSection != null){
        let eventN = searchSection.indexOf("/dev/input/event")
        let n
        if(eventN != -1){
            n = searchSection[eventN + 16]
        }
        device = "/dev/input/event" + n
        let idxX = searchSection.indexOf('ABS_MT_POSITION_X') + 'ABS_MT_POSITION_X'.length
        let idxY = searchSection.indexOf('ABS_MT_POSITION_Y') + 'ABS_MT_POSITION_Y'.length

        if(idxX != -1){
            for(let i = idxX ; ; i++){
                //console.log(searchSection[i], searchSection[i+1], searchSection[i+2])
                if(searchSection[i] == 'm' && searchSection[i+1] == 'a' && searchSection[i+2] == 'x'){
                    let j = i + 4
                    while(searchSection[j] !== ','){
                        x += searchSection[j]
                        j++
                    }
                    break
                }
                if(i > idxX + 30) break
            }
        }

        if(idxY != -1){
            for(let i = idxY ; ; i++){
                //console.log(searchSection[i], searchSection[i+1], searchSection[i+2])
                if(searchSection[i] == 'm' && searchSection[i+1] == 'a' && searchSection[i+2] == 'x'){
                    let j = i + 4
                    while(searchSection[j] !== ','){
                        y += searchSection[j]
                        j++
                    }
                    break
                }
                if(i > idxY + 30) break
            }
        }
    }
    return { x, y, device }
}

module.exports = getDeviceProperties




