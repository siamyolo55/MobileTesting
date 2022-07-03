const ViewGrid = require('../main/createAppiumSession')
const axios = require('axios')
const findTouchedElement = require('../event-filterer/findTouchedElement')

const opts = {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        platformName: "Android",
        udid: "299edc22",
        platformVersion: "8.0.0",
        deviceName: "Galaxy S7",
        //appPackage: "com.google.android.apps.maps",
        appPackage: "com.google.android.apps.docs",
        //appActivity: "com.google.android.maps.MapsActivity",
        //isHeadless: true
        appActivity: "com.google.android.apps.docs.drive.startup.StartupActivity"
    }
}


        
let replay = async (eventSessionId, opts) => {
    let res = await axios.get(`http://localhost:4001/event/${eventSessionId}`)
    let eventData = res.data
    let viewGrid = new ViewGrid(opts)
    await viewGrid.startAppiumSession()
    // wait for view to load on app
    //console.log(eventData.eventList)
    let eventList = eventData.eventList
    for(let i = 0 ; i < eventList.length ; i++){
        let dom = await viewGrid.getCurrentPageDOM()
        //console.log(viewGrid.rootElement)
        //let completeViewObject = viewGrid.buildView(viewGrid.rootElement, 0, '')
        let x = eventList[i].rescaledX
        let y = eventList[i].rescaledY
        //console.log(x, y)
        //console.log(completeViewObject)
        //let element = findTouchedElement(completeViewObject.childs[0], x, y)
        //console.log(element.selector, element.value)
        //await viewGrid.driver.$(`${element.value}`).click()
        //setTimeout(() => {}, 3000)
        try{
            await viewGrid.driver.touchPerform([
                { action: 'tap', options: { x, y } }
            ])
            console.log('done')
        }
        catch(err){
            console.log(err)
        }
    } 
}

let testId = "bea30620-3f5d-437a-a282-0f3c381f0945"

replay(testId, opts)



