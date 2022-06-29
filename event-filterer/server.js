const express = require('express')
const cors = require('cors')
const rescaleCords = require('./rescaleCords')
//const getViewObject = require('../main/baseScript')
const mongoose = require('mongoose')
const storeEvents = require('./db/storeEvents')

const PORT = 4001

const connectDb = () => {
    try{
        mongoose.connect('mongodb://localhost:27017/mobile_events', {
            useNewUrlParser: true,
            useUnifiedTopology: true
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
app.post('/getCordsTimestamps', async (req, res) => {
    let output = req.body
    let cordsTimestamps = output.cordsTime
    let id = output.id
    if(cordsTimestamps){
        let {cordX, cordY} = cordsTimestamps
        let {rescaledX, rescaledY} = rescaleCords(cordX, cordY)
        console.log(rescaledX, rescaledY, id)
        storeEvents({id, rescaledX, rescaledY})
    }
    else console.log('error getting data :(')
    res.status(201).json({message: 'got it bro'})
})


app.listen(PORT, () => {
    connectDb()
})