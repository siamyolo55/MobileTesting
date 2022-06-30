const { default:axios } = require('axios')
const { spawn } = require('child_process')
const getDeviceProperties = require('../event-filterer/findDeviceEventBus')
const formatTouchInput = require('./formatTouchInput')
const { device } = getDeviceProperties()
const { v4: uuidv4 } = require('uuid')
const ViewGrid = require('../main/createAppiumSession')

const postRoute = 'http://127.0.0.1:4001/getCordsTimestamps'

const getAllEvents = async (device) => {
    const cmd = spawn('adb', ['exec-out', 'getevent', '-lt', device])
    //let time_start_idx = 4 // index from where timestamp starts
    let id = uuidv4()
    cmd.stdout.on('data', async (data) => {
        //console.log(++cnt)
        let curData = data.toString()
        //console.log(curData)
        let cordsTime = formatTouchInput(curData)
        if(cordsTime){
            let res = await axios.post(postRoute, {
                cordsTime,
                id: id
            })
            if(res.status === 201)
                console.log(res.data.message)
        }
    })
}

//getAllEvents(device)

module.exports = getAllEvents


