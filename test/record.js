const ViewGrid = require('../main/createAppiumSession')
const getDeviceProperties = require('../event-filterer/findDeviceEventBus')
const getAllEvents = require('../event-api/index')

const { device } = getDeviceProperties()

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
        appPackage: "com.google.android.apps.maps",
        //appPackage: "com.google.android.apps.docs",
        appActivity: "com.google.android.maps.MapsActivity",
        autoGrantPermissions: true,
        
        //isHeadless: true
        //appActivity: "com.google.android.apps.docs.drive.startup.StartupActivity"
    }
}



const magicFunction = async (opts, device) => {
    let viewGrid = new ViewGrid(opts)
    await viewGrid.startAppiumSession()
    //console.log(viewGrid.getScreenResolution())
    await getAllEvents(device)
}

let startRecording = async () => {
    await magicFunction(opts, device)
}

startRecording()