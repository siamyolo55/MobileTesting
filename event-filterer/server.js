const express = require('express')
const cors = require('cors')
const rescaleCords = require('./rescaleCords')
//const getViewObject = require('../main/baseScript')
const mongoose = require('mongoose')
const storeEvents = require('./db/storeEvents')
const { createServer } = require('http')
const { Server } = require('socket.io')
const Events = require('./models/eventsSchema');

const PORT = 4001

const connectDb = () => {
    try{
        mongoose.connect('mongodb://127.0.0.1:27017/mobile_events', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log('db connected')
        })
    }
    catch(err){
        console.log('db connection failed')
    }
}

// app object
const app = express()
// cors origin issue
app.use(cors({ origin: "*" }))
//body json parser
app.use(express.json({extended : true}))

// temporary routes
// app.post('/getCordsTimestamps', async (req, res) => {
//     let output = req.body
//     let cordsTimestamps = output.cordsTime
//     let id = output.id
//     let xpath = output.xpath
//     if(cordsTimestamps){
//         let {cordX, cordY} = cordsTimestamps
//         let {rescaledX, rescaledY} = rescaleCords(cordX, cordY)
//         console.log(rescaledX, rescaledY, id, xpath)
//         await storeEvents({id, rescaledX, rescaledY, xpath})
//     }
//     else console.log('error getting data :(')
//     res.status(201).json({message: 'got it bro'})
// })
app.get("/event/:id", async (req, res) => {
    try {
        const {id} = req.params;
        let event = await Events.findOne({eventSessionId: id});
        res.json(event)
    } catch (error) {
        res.json(error)
    }
})

const httpServer = createServer(app)
const io = new Server(httpServer, {});

io.on('connection', (socket) =>{
    console.log(`started socket with id : ${socket.id}`)
    socket.on('touchData', async (data) => {
        let {cordsTime, id, xpath} = data
        let cordsTimestamps = cordsTime
        if(cordsTimestamps){
            let {cordX, cordY} = cordsTimestamps
            let {rescaledX, rescaledY} = rescaleCords(cordX, cordY)
            console.log(rescaledX, rescaledY, id, xpath)
            //await storeEvents({id, rescaledX, rescaledY, xpath})
        }
        else console.log('error getting data :(')
    })
})



httpServer.listen(PORT, () => {
    console.log('started server')
    connectDb()
})


// app.listen(PORT, () => {
//     console.log('started server')
//     
// })
