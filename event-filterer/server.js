const getDeviceProperties = require('./findDeviceEventBus')

// getting device name in eventbus and width & height of pixels
let { pixelWidth, pixelHeight, device} = getDeviceProperties()