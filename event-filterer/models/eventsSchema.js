const mongoose = require('mongoose')

const EventsSchema = new mongoose.Schema({
    eventSessionId: {type: String},
    eventList: [
        {
            rescaledX: Number,
            rescaledY: Number,
            xpath: String
        }
    ]
})

const Events = mongoose.model("mobile_events", EventsSchema)
module.exports = Events;