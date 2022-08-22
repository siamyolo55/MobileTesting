const getDeviceProperties = require('./findDeviceEventBus')

// get pixelWidth/Height from device to rescale


// later on get this from the appium server endpoint
// GET /session/:session_id/window/:window_handle/size
// const deviceWidth = 1080
// const deviceHeight = 2280
// adb shell wm size
// Output -> Physical size: 1080x2280
// const deviceWidth = 320
// const deviceHeight = 480
const deviceWidth = 1080
const deviceHeight = 1920


const rescaledCords = (x, y) => {
    //console.log(x, y, 'inside rescale cords')
    //console.log(pixelHeight, pixelWidth, 'pixel height width')
    const {pixelWidth, pixelHeight} = getDeviceProperties()
    console.log(pixelHeight, pixelWidth)
    let rescaledX = Math.ceil(x * (deviceWidth / pixelWidth))
    let rescaledY = Math.ceil(y * (deviceHeight / pixelHeight))
    console.log(rescaledX, rescaledY, 'after rescaling')
    return {rescaledX, rescaledY}
}

module.exports = rescaledCords

