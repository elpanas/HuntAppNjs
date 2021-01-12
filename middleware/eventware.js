const { Event } = require('../models/schemas');

// CREATE EVENT
async function createEvent(event_data, user_id) {
    return await Event.create({
        name: event_data.name,
        min_locations: event_data.minloc,
        max_locations: event_data.maxloc,
        min_avg_distance: event_data.avgloc,
        organizer: user_id,
        location: event_data.location
    });
}
// --------------------------------------------------------------------

// READ
// get all events at 20km
function getAllEvents(lat,long) {  
    return Event.find({
            location: { 
                $near: { 
                    $geometry: { type: "Point", coordinates: [lat,long] },                  
                    $maxDistance: 20000
                }                              
            } 
        })
        .lean()
        .populate('organizer');
}


// check if there is an event with the same name
async function checkEvent(event_name) {
    return await Event.exists({ name: event_name });
}
// --------------------------------------------------------------------

module.exports.createEvent = createEvent;
module.exports.getAllEvents = getAllEvents;
module.exports.checkEvent = checkEvent;