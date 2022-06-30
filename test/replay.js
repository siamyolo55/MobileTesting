const ViewGrid = require('../main/createAppiumSession')
const Events = require('../event-filterer/models/eventsSchema')
const mongoose = require('mongoose')
const axios = require('axios');

const opts = {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        platformName: "Android",
        udid: "299edc22",
        platformVersion: "8.0.0",
        deviceName: "Galaxy S7",
        appPackage: "com.google.android.apps.maps",
        //appPackage: "com.google.android.apps.docs",
        appActivity: "com.google.android.maps.MapsActivity",
        isHeadless: true
        //appActivity: "com.google.android.apps.docs.drive.startup.StartupActivity"
    }
}


        
let replay = async (eventSessionId, opts) => {
    let res = await axios.get(`http://localhost:4001/event/${eventSessionId}`)
    let eventData = res.data
    let viewGrid = new ViewGrid(opts)
    await viewGrid.startAppiumSession()
    // wait for view to load on app
    let dom = await viewGrid.getCurrentPageDOM()
    //console.log(eventData)
    let eventList = eventData.eventList
    for(let i = 0 ; i < eventList.length ; i++){
        let x = eventList[i].rescaledX
        let y = eventList[i].rescaledY
        console.log(x, y)
    } 

}

let testId = "ae33e59f-ec2e-4e17-ba49-b513f1db7225"

replay(testId, opts)



