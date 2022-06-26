const getDeviceProperties = require('./findDeviceEventBus')

let { x, y, device} = getDeviceProperties()
console.log(x, y, device)