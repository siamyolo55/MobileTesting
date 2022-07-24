const EventsSchema = require('../models/eventsSchema')


const storeEvents = async (eventData) => {
    try{
        console.log(eventData)
        let event = await EventsSchema.findOne({eventSessionId: eventData.id})
        if(event){
            console.log('storing in existing one')
            event.eventList.push({rescaledX: eventData.rescaledX, rescaledY: eventData.rescaledY})
            await event.save()
        }
        else{
            console.log('creating new id')
            let event = await EventsSchema.create({
                eventSessionId: eventData.id,
                eventList: []
            })
            event.eventList.push({rescaledX: eventData.rescaledX, rescaledY: eventData.rescaledY})
            await event.save()
        }
        console.log('saved')

    }
    catch(err){
        console.log(err)
    }
}

module.exports = storeEvents