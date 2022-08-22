const ViewGrid = require('../main/createAppiumSession')
const axios = require('axios')
//const findTouchedElement = require('../event-filterer/findTouchedElement')

const opts = {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        platformName: "Android",
        //udid: "299edc22",
        udid: "emulator-5554",
        //udid: "KPSDU18928011624",
        //platformVersion: "8.0.0",
        platformVersion: "9",
        deviceName: "Huawei",
        //appPackage: "com.google.android.apps.maps",
        appPackage: 'com.android.calculator2',
        appActivity: 'com.android.calculator2.Calculator',
        //appPackage: "com.google.android.apps.docs",
        //appActivity: "com.google.android.maps.MapsActivity",
        autoGrantPermissions: true,
        systemPort: "8201",
        newCommandTimeout: 300
        //isHeadless: true
        //appActivity: "com.google.android.apps.docs.drive.startup.StartupActivity"
    }
}



        
let replay = async (eventSessionId, opts) => {
    
    let res = await axios.get(`http://localhost:4001/event/${eventSessionId}`)
    let eventData = res.data
    let viewGrid = new ViewGrid(opts)
    viewGrid.startAppiumServer()
    viewGrid.startAndroidEmulator()
    await new Promise(r => setTimeout(r, 5000))
    
    await viewGrid.startAppiumSession()
    
    // wait for view to load on app
    //console.log(eventData.eventList)
    let eventList = eventData.eventList
    for(let i = 0 ; i < eventList.length ; i++){
        let dom = await viewGrid.getCurrentPageDOM()
        console.log(viewGrid.getScreenResolution())
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
            // console.log('waiting 2 secs')
            // await new Promise(r => setTimeout(r, 2000));
            // console.log('waited 2 secs')
            // await viewGrid.driver.touchPerform([
            //     { action: 'tap', options: { x, y } }
            // ])
            // console.log('done')
            await viewGrid.driver.$(`${eventList[i].xpath}`).click()
            console.log('done')
        }
        catch(err){
            console.log(err)
        }
    } 
}

let testId = "43e0ef60-6cf0-4d54-8fe8-12c57e9e39bc"

replay(testId, opts)



