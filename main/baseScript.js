const ViewGrid = require('./createAppiumSession')
//const findTouchedElement = require('../event-filterer/findTouchedElement')

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
        //appActivity: "com.google.android.apps.docs.drive.startup.StartupActivity"
    }
}

let getViewObject  = async (opts) => {
    let viewGrid = new ViewGrid(opts)
    await viewGrid.startAppiumSession()
    let dom = await viewGrid.getCurrentPageDOM()
    let {screenHeight, screenWidth} = viewGrid.getScreenResolution()
    let completeViewObject = viewGrid.buildView(viewGrid.rootElement, 0, '')
    // console.log(completeViewObject)
    // we have the complete viewObect, with proper coordinates we also have
    // the function to find selected element, now we need to bring the (x,y) touched events here
    return completeViewObject
}

//getViewObject(opts)

module.exports = getViewObject
