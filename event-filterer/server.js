const express = require('express')
const cors = require('cors')
const rescaleCords = require('./rescaleCords')

const PORT = 4001

// app object
const app = express()
// cors origin issue
app.use(cors({ origin: "*" }))
//body json parser
app.use(express.json({extended : true}))

// temporary routes
app.post('/getCordsTimestamps', (req, res) => {
    let cordsTimestamps = req.body.cordsTime
    if(cordsTimestamps){
        let {cordX, cordY} = cordsTimestamps
        let {resclaedX, resclaedY} = rescaleCords(cordX, cordY)
        console.log(resclaedX, resclaedY)
    }
    else console.log('error getting data :(')
    res.status(201).json({message: 'got it bro'})
})


app.listen(PORT)