const ViewGrid = require('../main/createAppiumSession')
const getDeviceProperties = require('../event-filterer/findDeviceEventBus')
//const getAllEvents = require('../event-api/index')
//const axios = require('axios')
//const exitHook = require('exit-hook')

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



const magicFunction = async (opts) => {
    let viewGrid = new ViewGrid(opts)
    viewGrid.startAppiumServer()
    viewGrid.startAndroidEmulator()
    await new Promise(r => setTimeout(r, 5000))
    const { device, pixelHeight, pixelWidth } = getDeviceProperties()
    console.log(pixelHeight, pixelWidth)

    //await viewGrid.startAppiumSession()
    //console.log(viewGrid.getScreenResolution())
    await viewGrid.recordEvents(device)
}

let startRecording = async () => {
    await magicFunction(opts)
}

startRecording()

// process.on('exit', (code) => {
//     console.log(`Explicit exit with code ${code}`)
// })

// exitHook(() => {
//     console.log('exiting')
// })
