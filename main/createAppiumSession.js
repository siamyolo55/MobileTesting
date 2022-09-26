const wdio = require('webdriverio')
const axios = require('axios')
//const fs = require('fs')
const { DOMParser } = require('xmldom')
const XPath = require('xpath')
const getDeviceProperties = require('../event-filterer/findDeviceEventBus')
//const { device } = getDeviceProperties()
const { spawn, exec } = require('child_process')
const formatTouchInput = require('../event-api/formatTouchInput')
const findTouchedElement = require('../event-filterer/findTouchedElement')
const { v4: uuidv4 } = require('uuid')
const rescaledCords = require('../event-filterer/rescaleCords')
const { io } = require('socket.io-client')
require('dotenv').config()

// the device used for texting has dimension of (4095x4095) in event bus
// need to downscale this to current screenwidth/height (1080x1920) to get which element was pressed


// Don't need to start emulator from commands since we can simply pass the avd name in desired capabilities

// const emulatorPath = {
//     windows: 'C:/Users/abrar/AppData/Local/Android/sdk/emulator/emulator -avd pixel_9.0',
//     linux: 'emulator -avd pixel_9.0'
// }


const opts = {
    path: '/wd/hub',
    port: parseInt(process.env.APPIUM_SERVER_PORT),
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
        systemPort: "8201",
        avd: "pixel_9.0"
        //isHeadless: true
        //appActivity: "com.google.android.apps.docs.drive.startup.StartupActivity"
    }
}

const postRoute = 'http://127.0.0.1:4001/getCordsTimestamps'

// optimal xpath generator from appium-inspector

function getOptimalXPath (doc, domNode, uniqueAttributes = ['id', 'content-desc']) {
  try {
    // BASE CASE #1: If this isn't an element, we're above the root, return empty string
    if (!domNode.tagName || domNode.nodeType !== 1) {
      return '';
    }

    // BASE CASE #2: If this node has a unique attribute, return an absolute XPath with that attribute
    for (let attrName of uniqueAttributes) {
      const attrValue = domNode.getAttribute(attrName);
      if (attrValue) {
        let xpath = `//${domNode.tagName || '*'}[@${attrName}="${attrValue}"]`;
        let othersWithAttr;

        // If the XPath does not parse, move to the next unique attribute
        try {
          othersWithAttr = XPath.select(xpath, doc);
        } catch (ign) {
          continue;
        }

        // If the attribute isn't actually unique, get it's index too
        if (othersWithAttr.length > 1) {
          let index = othersWithAttr.indexOf(domNode);
          xpath = `(${xpath})[${index + 1}]`;
        }
        return xpath;
      }
    }

    // Get the relative xpath of this node using tagName
    let xpath = `/${domNode.tagName}`;

    // If this node has siblings of the same tagName, get the index of this node
    if (domNode.parentNode) {
      // Get the siblings
      const childNodes = Array.prototype.slice.call(domNode.parentNode.childNodes, 0).filter((childNode) => (
        childNode.nodeType === 1 && childNode.tagName === domNode.tagName
      ));

      // If there's more than one sibling, append the index
      if (childNodes.length > 1) {
        let index = childNodes.indexOf(domNode);
        xpath += `[${index + 1}]`;
      }
    }

    // Make a recursive call to this nodes parents and prepend it to this xpath
    return getOptimalXPath(doc, domNode.parentNode, uniqueAttributes) + xpath;
  } catch (error) {
    // If there's an unexpected exception, abort and don't get an XPath
    log.error(`The most optimal XPATH could not be determined because an error was thrown: '${JSON.stringify(error, null, 2)}'`);

    return null;
  }
}


class ViewGrid {

    constructor(opts){
        this.opts = opts
        this.cnt = {}
    }

    // later on automate the process of starting the appium server
    async startAppiumServer(){
        const APPIUM_SERVER_START_COMMAND = `appium -a ${process.env.APPIUM_SERVER_HOST} -p ${process.env.APPIUM_SERVER_PORT}`
        exec(APPIUM_SERVER_START_COMMAND, async (error, stdout, stderr) => {
            if(error){
                console.log(`exec error on appium`)
                return
            }
        })
    }

    // starting emulator from appium desired capabilities

    // startAndroidEmulator(){
    //     exec(emulatorPath.linux , (error, stdout, stderr) => {
    //         if(error){
    //             console.log(`exec error starting emulator`)
    //             return
    //         }
    //     })
    // }

    async startAppiumSession(){
        this.driver = await wdio.remote(this.opts)
        this.sessionId = await this.driver.sessionId
    }

    async getCurrentPageDOM(){
        this.source = await axios.get(`http://127.0.0.1:4723/wd/hub/session/${this.sessionId}/source`)
        this.doc = new DOMParser().parseFromString(this.source.data.value)
        this.rootElement = this.doc.getElementsByTagName('hierarchy')[0]
        return this.doc
    }

    getScreenResolution(){
        this.screenHeight = this.rootElement.getAttribute('height')
        this.screenWidth = this.rootElement.getAttribute('width')
        return {screenHeight: this.screenHeight, screenWidth: this.screenWidth}
    }

    buildView(root, idx, parentXpath){
        let tagName = root.tagName
    
        if(this.cnt.hasOwnProperty(tagName))
            this.cnt[tagName] += 1
        else this.cnt[tagName] = 1
        
        // let xpath
        // if(idx > 0)
        //     xpath = `${parentXpath}/${tagName}[${idx}]`
        // else xpath = `${parentXpath}/${tagName}`
        let xpath = getOptimalXPath(this.doc, root)
        
        // using cnt object to keep track of the current index of element while getting it with 'getElementsByTagName'
        let curElement = this.doc.getElementsByTagName(tagName)[this.cnt[tagName] - 1]
        // retrieve all attributes here for future
        let bounds = curElement.getAttribute('bounds') || null
        //let id = curElement.getAttribute('resource-id') || null

        let viewObject = {
            tagName: tagName,
            cnt: this.cnt[tagName],
            bounds: bounds,
            xpath: xpath,
            //id: id,
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
                childViewObject = this.buildView(childs[i], 0, xpath)
            else childViewObject = this.buildView(childs[i], cur, xpath)
            
            viewObject.childs.push(childViewObject)
        }

        return viewObject
    }

    // modification of getAllEvents()
    async recordEvents(device){
        //await this.startAppiumSession()
        const socket = io('http://localhost:4001')
        // attempting to group together everything
        const cmd = spawn('adb', ['exec-out', 'getevent', '-lt', device])
        let curDom = await this.getCurrentPageDOM()
        let completeViewObject = this.buildView(this.rootElement, 0, '')
        console.log(device)
        let cnt = 0
        //let time_start_idx = 4 // index from where timestamp starts
        let id = uuidv4()
        cmd.stdout.on('data', async (data) => {
            //console.log(++cnt)
            try{
              let curData = data.toString()
              //console.log(curData)
              let cordsTime = formatTouchInput(curData)
              console.log(cordsTime)
              if(cordsTime){
                  let {rescaledX, rescaledY} = rescaledCords(cordsTime.cordX, cordsTime.cordY)
                  console.log(rescaledX, rescaledY, 'after rescaling')
                  //let x = rescaledX * (1977 / 2280)
                  //let y = rescaledY
                  let touchedElement = findTouchedElement(completeViewObject, rescaledX, rescaledY)
                  //console.log(cordsTime)
                  console.log(touchedElement)
                  let data = {
                      cordsTime,
                      id,
                      xpath: touchedElement.value
                  }
                  socket.emit('touchData', data)
              }
            }
            catch(err){
              //console.log('erroed here')
            }
        })
        socket.on('connection', () => {
            console.log(`conneted to ${socket.id}`)
        })
    }

}

// const init  = async (opts) => {
//     let viewGrid = new ViewGrid(opts)
//     await viewGrid.startAppiumSession()
//     let dom = await viewGrid.getCurrentPageDOM()
//     //let {screenHeight, screenWidth} = viewGrid.getScreenResolution()
//     let completeViewObject = viewGrid.buildView(viewGrid.rootElement, 0, '')
//     console.log(completeViewObject)
// }

// init(opts)

module.exports = ViewGrid