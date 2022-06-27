const wdio = require('webdriverio')
const axios = require('axios')
const fs = require('fs')
const { DOMParser } = require('xmldom')
//const buildView = require('./buildView')

let doc
let screenHeight
let screenWidth
let cnt = {}

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
        let idx = 0 // to add index of elements in xpath
        // attempting to store bounds of all elements in the completeViewObject
        let completeViewObject = buildView(rootElement, idx, '') // '/hierarchy' has 1 children

        //console.log(completeViewObject)
        // to check if tagTree is valid
        //showView(completeViewObject)

        //fs.writeFile('xmlData2.txt', source.data.value, (err) =>{ if(err) console.log(err) })

        return completeViewObject

    }
    catch(e){
        console.log(e)
    }
}

let buildView = ( root , idx, parentXpath ) => {
    let tagName = root.tagName
    
    if(cnt.hasOwnProperty(tagName))
        cnt[tagName] += 1
    else cnt[tagName] = 1
    
    let xpath
    if(idx > 0)
        xpath = `${parentXpath}/${tagName}[${idx}]`
    else xpath = `${parentXpath}/${tagName}`
    
    // using cnt object to keep track of the current index of element while getting it with 'getElementsByTagName'
    let curElement = doc.getElementsByTagName(tagName)[cnt[tagName] - 1]
    // retrieve all attributes here for future
    let bounds = curElement.getAttribute('bounds') || null
    let id = curElement.getAttribute('resource-id') || null

    let viewObject = {
        tagName: tagName,
        cnt: cnt[tagName],
        bounds: bounds,
        xpath: xpath,
        id: id,
        childs: []
    }


    let childs = root.childNodes
    let childsLen = childs.length
    // determine if the node has >1 valid childs
    let validChildCount = 0
    for(let i = 0 ; i < childsLen ; i++)
        if(childs[i].tagName) validChildCount++
    let cur = 0
    for(let i = 0 ; i < childsLen ; i++){
        if(childs[i].tagName === undefined || childs[i].tagName === null) continue
        let childViewObject
        cur++
        if(validChildCount === 1)
            childViewObject = buildView(childs[i], 0, xpath)
        else childViewObject = buildView(childs[i], cur, xpath)
        
        viewObject.childs.push(childViewObject)
    }

    //let res = await axios.post()
    //console.log(completeViewObject)
}

let showView = (viewObject) => {
    //console.log(viewObject.cnt, viewObject.xpath)
    if(viewObject.childs.length)
        for(let i = 0 ; i < viewObject.childs.length ; i++)
            showView(viewObject.childs[i])
}


// calling the method
init()
