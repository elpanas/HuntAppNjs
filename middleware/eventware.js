const { Event } = require('../models/schemas');

// CREATE EVENT
async function createEvent(event_data, user_id) {

    const event = new Event({
        name: event_data.name,
        min_locations: event_data.min_locations,
        max_locations: event_data.max_locations,
        min_avg_distance: event_data.min_avg_distance,
        organizer: user_id
    });

    // salva il documento
    const result = await event.save();

    if (result)
        return result._id;
    else
        return false;
}
// --------------------------------------------------------------------


// GET EVENT
async function getEvent(id) {
    return await Event.findById(id);
}
// --------------------------------------------------------------------


// UPDATE EVENT
async function updateEvent(ide, event_data) {

    const event = await Event.update({ _id: ide }, {
        $set: {
            name: event_data.name,
            min_locations: event_data.min_locations,
            max_locations: event_data.max_locations,
            min_avg_distance: event_data.min_avg_distance
        }
    }, { new: true });

    return event;
}
// --------------------------------------------------------------------


// REMOVE EVENT
async function removeEvent(id) {
    return result = await Event.findByIdAndDelete(id);
}
// --------------------------------------------------------------------

module.exports.createEvent = createEvent;
module.exports.getEvent = getEvent;
module.exports.updateEvent = updateEvent;
module.exports.removeEvent = removeEvent;