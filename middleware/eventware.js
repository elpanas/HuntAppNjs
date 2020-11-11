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


// GET ALL EVENTS
async function getAllEvents() {
    return await Event.find().populate('organizer','username');
}

// GET EVENT BY NAME
async function checkEvent(event_name) {
    return await Event.exists({ name: event_name });
}
// --------------------------------------------------------------------


// UPDATE EVENT
async function updateEvent(ide, event_data) {

    return await Event.update({ _id: ide }, {
        $set: {
            name: event_data.name,
            min_locations: event_data.min_locations,
            max_locations: event_data.max_locations,
            min_avg_distance: event_data.min_avg_distance
        }
    }, { new: true });
}
// --------------------------------------------------------------------


// REMOVE EVENT
async function removeEvent(id) {
    return await Event.findByIdAndDelete(id);
}
// --------------------------------------------------------------------

module.exports.createEvent = createEvent;
module.exports.getEvent = getEvent;
module.exports.getAllEvents = getAllEvents;
module.exports.checkEvent = checkEvent;
module.exports.updateEvent = updateEvent;
module.exports.removeEvent = removeEvent;