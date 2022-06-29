const EventsSchema = require('../models/eventsSchema')


const storeEvents = async (eventData) => {
    try{
        console.log(eventData)
        // let event = await EventsSchema.find({eventSessionId: eventData.id})
        // if(event){
        //     event.eventList.push()
        // }

    }
    catch(err){
        console.log('error storing event')
    }
}

module.exports = storeEvents