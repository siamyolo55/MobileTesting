//const httpServer = require('http')
const io = require('socket.io')({
    cors: {
        origin: '*'
    }
})

const opts = {
    adbHost: 'localhost',
    adbPort: 5037,
    deviceId: null,
    port: 8099,
    maxSize: 600,
    bitrate: 999999999,
    tunnelForward: true,
    crop: '9999:9999:0:0',
    sendFrameMeta: false
  }

const Scrcpy = require('scrcpy-client')

const scrcpy = new Scrcpy({
    sendFrameMeta: false
})

scrcpy.start()
    .then(info => console.log(`started -> ${info.name} at ${info.height}x${info.width}`))
    .catch(e => console.log(`impossible to start ${e}`))


io.on('connection', (socket) => {
    console.log(`${socket.id} connected`)

    scrcpy.on('data', (data) => {
        socket.emit('packet', data)
    })

})

io.listen(3000)