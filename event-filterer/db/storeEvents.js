const EventsSchema = require('../models/eventsSchema')


const storeEvents = async (eventData) => {
    try{
        console.log(eventData)
        let event = await EventsSchema.findOne({eventSessionId: eventData.id})
        if(event){
            event.eventList.push({rescaledX: eventData.rescaledX, rescaledY: eventData.rescaledY})
            await event.save()
        }
        else{
            let event = await EventsSchema.create({
                eventSessionId: eventData.id,
                eventList: []
            })
            event.eventList.push({rescaledX: eventData.rescaledX, rescaledY: eventData.rescaledY})
            await event.save()
        }

    }
    catch(err){
        console.log(err)
    }
}

module.exports = storeEvents