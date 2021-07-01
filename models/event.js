const mongoose = require('mongoose'); // MongoDB framework
const Schema = mongoose.Schema;

const eventSchema = Schema({
  name: {
    type: String,
    default: null,
    unique: true,
  },
  min_locations: {
    type: Number,
    default: 2,
  },
  max_locations: {
    type: Number,
    default: 8,
  },
  min_avg_distance: {
    type: Number,
    default: null,
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  location: {
    // center of the circle of radius max_distance
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: [Number],
  },
  end_date: {
    type: Date,
    default: null,
  },
}).index({ location: '2dsphere' });

const Event = mongoose.model('event', eventSchema);

exports.Event = Event;
