const mongoose = require('mongoose')

const EventsSchema = new mongoose.Schema({
    eventSessionId: {type: String},
    eventList: [
        {
            rescaledX: Number,
            rescaledY: Number
        }
    ]
})

const Events = mongoose.model("mobile_events", EventsSchema)
module.exports = Events;