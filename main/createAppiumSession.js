const wdio = require('webdriverio')
const axios = require('axios')
const fs = require('fs')
const { DOMParser } = require('xmldom')

let cnt = {}
let doc
let screenHeight
let screenWidth
let eventBusHeight = 4095
let eventBusWidth = 4095

// the device used for texting has dimension of (4095x4095) in event bus
// need to downscale this to current screenwidth/height (1080x1920) to get which element was pressed

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

async function init() {
    try{
        const driver = await wdio.remote(opts)
        //console.log(driver)
        //await driver.startRecordingScreen()
        let sessionId = await driver.sessionId

        //let searchBox = await driver.$(`//android.widget.EditText[@content-desc="Search here"]/android.widget.TextView`).click()
        //await driver.sendKeyEvent('Crimson Cup')
        //let record = await driver.stopRecordingScreen()
        //console.log(record)
        // try getting view/page source 
        let source = await axios.get(`http://127.0.0.1:4723/wd/hub/session/${sessionId}/source`)
        doc = new DOMParser().parseFromString(source.data.value)
        let rootElement = doc.getElementsByTagName('hierarchy')[0]
        //let outerLayer  = doc.getElementsByTagName(outerLayerTagName)[0]
        //console.log(outerLayer.tagName)
        //console.log(rootElement.childNodes.length)
        screenWidth = rootElement.getAttribute('width')
        screenHeight = rootElement.getAttribute('height')
        
        console.log(screenWidth, screenHeight)

        // attempting to store bounds of all elements in the completeViewObject
        let completeViewObject = buildView(rootElement)

        //console.log(completeViewObject)
        // to check if tagTree is valid
        showView(completeViewObject)

        //fs.writeFile('xmlData2.txt', source.data.value, (err) =>{ if(err) console.log(err) })

    }
    catch(e){
        console.log(e)
    }
}

init()

// building recursive function to add all bounds to the view

let buildView = ( root ) => {
    let tagName = root.tagName

    if(cnt.hasOwnProperty(tagName))
        cnt[tagName] += 1
    else cnt[tagName] = 1
    
    // using cnt object to keep track of the current index of element while getting it with 'getElementsByTagName'
    let curElement = doc.getElementsByTagName(tagName)[cnt[tagName] - 1]
    let bounds = curElement.getAttribute('bounds') || null

    let viewObject = {
        tagName: tagName,
        cnt: cnt[tagName],
        bounds: bounds,
        childs: []
    }


    let childs = root.childNodes

    for(let i = 0 ; i < childs.length ; i++){
        if(childs[i].tagName === undefined || childs[i].tagName === null) continue
        let childViewObject = buildView(childs[i])
        viewObject.childs.push(childViewObject)
    }

    return viewObject
}

let showView = (viewObject) => {
    console.log(viewObject.tagName, viewObject.cnt, viewObject.bounds)
    if(viewObject.childs.length)
        for(let i = 0 ; i < viewObject.childs.length ; i++)
            showView(viewObject.childs[i])
}