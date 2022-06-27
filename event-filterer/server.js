const express = require('express')
const cors = require('cors')

const PORT = 4001

// app object
const app = express()
// cors origin issue
app.use(cors({ origin: "*" }))
//body json parser
app.use(express.json({extended : true}))

// temporary routes
app.post('/getCordsTimestamps', (req, res) => {
    let cordsTimestamps = req.body
    console.log(cordsTimestamps)
    res.status(201).json({message: 'got it bro'})
})


app.listen(PORT)