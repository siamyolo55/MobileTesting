const ViewGrid = require('../main/createAppiumSession')
const getDeviceProperties = require('../event-filterer/findDeviceEventBus')
//const getAllEvents = require('../event-api/index')
//const axios = require('axios')
//const exitHook = require('exit-hook')
require('dotenv').config()

const opts = {
    path: process.env.APPIUM_SERVER_PATH,
    port: parseInt(process.env.APPIUM_SERVER_PORT),
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
        newCommandTimeout: 300,
        avd: "pixel_9.0",
        // isHeadless: true
        //appActivity: "com.google.android.apps.docs.drive.startup.StartupActivity"
    }
}



const magicFunction = async (opts) => {
    let viewGrid = new ViewGrid(opts)
    await viewGrid.startAppiumServer()
    await new Promise(r => setTimeout(r, 5000))
    await viewGrid.startAppiumSession()
    //viewGrid.startAndroidEmulator()
    const { device, pixelHeight, pixelWidth } = getDeviceProperties()
    console.log(pixelHeight, pixelWidth, " here")
    
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
