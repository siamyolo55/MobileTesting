const { default:axios } = require('axios')
const { spawn } = require('child_process')
const getDeviceProperties = require('../event-filterer/findDeviceEventBus')
const formatTouchInput = require('./formatTouchInput')
const {device} = getDeviceProperties()

const postRoute = 'http://127.0.0.1:4001/getCordsTimestamps'

const getAllEvents = async (device) => {
    const cmd = spawn('adb', ['exec-out', 'getevent', '-lt', device])
    //let time_start_idx = 4 // index from where timestamp starts

    cmd.stdout.on('data', async (data) => {
        //console.log(++cnt)
        let curData = data.toString()
        //console.log(curData)
        let cordsTime = formatTouchInput(curData)
        if(cordsTime){
            let res = await axios.post(postRoute, {
                cordsTime
            })
            if(res.status === 201)
                console.log(res.data.message)
        }
    })
}

getAllEvents(device)


