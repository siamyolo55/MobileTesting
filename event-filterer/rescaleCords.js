const getDeviceProperties = require('./findDeviceEventBus')

// get pixelWidth/Height from device to rescale
const {pixelWidth, pixelHeight} = getDeviceProperties()


// later on get this from the appium server endpoint
// GET /session/:session_id/window/:window_handle/size
const deviceWidth = 1080
const deviceHeight = 1920

const rescaledCords = (x, y) => {
    let resclaedX = Math.ceil(x * (deviceWidth / pixelWidth))
    let resclaedY = Math.ceil(y * (deviceHeight / pixelHeight))
    return {resclaedX, resclaedY}
}

module.exports = rescaledCords

