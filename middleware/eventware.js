const { Event } = require('../models/event'),
  { clearCache } = require('redis_mongoose'),
  config = require('../config/config'),
  {
    redis: { time },
  } = config;

// CREATE EVENT
async function createEvent(event_data, user_id) {
  const result = await Event.create({
    name: event_data.name,
    min_locations: event_data.minloc,
    max_locations: event_data.maxloc,
    min_avg_distance: event_data.avgloc,
    organizer: user_id,
    location: event_data.location,
  });
  clearCache();
  return result;
}
// --------------------------------------------------------------------

// READ
// get all events at 20km
async function getAllEvents(lat, long) {
  return await Event.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lat, long] },
        $maxDistance: 20000,
      },
    },
  })
    .lean()
    .populate('organizer')
    .cache({ ttl: time });
}

// check if there is an event with the same name
async function checkEvent(event_name) {
  return await Event.exists({ name: event_name }).cache({ ttl: time });
}
// --------------------------------------------------------------------

module.exports = {
  createEvent: createEvent,
  getAllEvents: getAllEvents,
  checkEvent: checkEvent,
};
