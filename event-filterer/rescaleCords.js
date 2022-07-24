const getDeviceProperties = require('./findDeviceEventBus')

// get pixelWidth/Height from device to rescale
const {pixelWidth, pixelHeight} = getDeviceProperties()


// later on get this from the appium server endpoint
// GET /session/:session_id/window/:window_handle/size
const deviceWidth = 1080
const deviceHeight = 2280

const rescaledCords = (x, y) => {
    let rescaledX = Math.ceil(x * (deviceWidth / pixelWidth))
    let rescaledY = Math.ceil(y * (deviceHeight / pixelHeight))
    return {rescaledX, rescaledY}
}

module.exports = rescaledCords

