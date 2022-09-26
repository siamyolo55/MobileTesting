const parse = (data) => {
    let input = new Uint8Array(data),
    dv = new DataView(input.buffer),
    duration,
    audioLength,
    audio,
    video

    duration = dv.getUint16(0, true)
    audioLength = dv.getUint16(2, true)
    audio = input.subarray(4, audioLength + 4)
    video = input.subarray(audioLength + 4)

    return {
        audio,
        video,
        duration
    }
}


window.onload = function () {
    let jmuxer = new JMuxer({
        node: 'player',
        debug: true,
        flushingTime: 1,
        clearBuffer: true
    })
    
    let socket = io('http://localhost:3000')
    socket.binaryType = 'arraybuffer'
    
    socket.on('packet', (data) => {
        console.log(data)
        let dat = parse(data)
        console.log(dat)
        jmuxer.feed(dat)
    })
}

// let canvas = document.getElementById('mycanvas')
// const player = new WSAvcPlayer(canvas)

// //player.connectByUrl('ws://localhost:3000')

// const socket = io('http://localhost:3000')
// player.connectWithCustomClient(socket)
// socket.binaryType = 'arraybuffer'

// player.send("REQUESTSTREAM");

// socket.on('packet', (data) => {
//     //player.cmd()
    
// })