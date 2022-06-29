const mongoose = require('mongoose')

const EventsSchema = new mongoose.Schema({
    eventSessionId: String,
    eventList: [
        {
            type: String,
            value: String,
            timeStamp: String
        }
    ]
})

module.exports = mongoose.model("mobile_events", EventsSchema)