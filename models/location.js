const mongoose = require('mongoose'); // MongoDB framework
const Schema = mongoose.Schema;

const locationSchema = Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: 'game',
    required: true,
  },
  cluster: Number, // progressive number
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: [Number],
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image_path: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: null,
  },
  hint: {
    type: String,
    default: null,
  },
  is_start: {
    type: Boolean,
    default: false,
  },
  is_final: {
    type: Boolean,
    default: false,
  },
}).index({ location: '2dsphere', game: 1 });

const Location = mongoose.model('location', locationSchema);

exports.Location = Location;
