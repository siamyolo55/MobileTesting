const wdio = require('webdriverio')
const axios = require('axios')
const fs = require('fs')
const { DOMParser } = require('xmldom')


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


class ViewGrid {

    constructor(opts){
        this.opts = opts
        this.cnt = {}
    }

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
        
        let xpath
        if(idx > 0)
            xpath = `${parentXpath}/${tagName}[${idx}]`
        else xpath = `${parentXpath}/${tagName}`
        
        // using cnt object to keep track of the current index of element while getting it with 'getElementsByTagName'
        let curElement = this.doc.getElementsByTagName(tagName)[this.cnt[tagName] - 1]
        // retrieve all attributes here for future
        let bounds = curElement.getAttribute('bounds') || null
        let id = curElement.getAttribute('resource-id') || null

        let viewObject = {
            tagName: tagName,
            cnt: this.cnt[tagName],
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
                childViewObject = this.buildView(childs[i], 0, xpath)
            else childViewObject = this.buildView(childs[i], cur, xpath)
            
            viewObject.childs.push(childViewObject)
        }

        return viewObject
    }

}

// let init  = async (opts) => {
//     let viewGrid = new ViewGrid(opts)
//     await viewGrid.startAppiumSession()
//     let dom = await viewGrid.getCurrentPageDOM()
//     let {screenHeight, screenWidth} = viewGrid.getScreenResolution()
//     let completeViewObject = viewGrid.buildView(viewGrid.rootElement, 0, '')
//     console.log(completeViewObject)
// }

//init(opts)

module.exports = ViewGrid