const { Event } = require('../models/schemas');

// CREATE EVENT
async function createEvent(event_data, user_id) {

    const event = new Event({
        name: event_data.name,
        min_locations: event_data.minloc,
        max_locations: event_data.maxloc,
        min_avg_distance: event_data.avgloc,
        organizer: user_id
    });

    // salva il documento
    return await event.save();
}
// --------------------------------------------------------------------


// get all events and organizer infos
function getAllEvents() {
    return Event.find().populate('organizer');
}

// check if there is an event with the same name
async function checkEvent(event_name) {
    return await Event.exists({ name: event_name });
}
// --------------------------------------------------------------------

module.exports.createEvent = createEvent;
module.exports.getAllEvents = getAllEvents;
module.exports.checkEvent = checkEvent;