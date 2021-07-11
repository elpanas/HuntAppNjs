const mongoose = require('mongoose'), // MongoDB framework
  Schema = mongoose.Schema,
  stringOpts = {
    type: String,
    default: null,
  },
  boolOpts = {
    type: Boolean,
    default: false,
  };

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
  description: stringOpts,
  hint: stringOpts,
  is_start: boolOpts,
  is_final: boolOpts,
}).index({ location: '2dsphere', game: 1 });

const Location = mongoose.model('location', locationSchema);

module.exports.Location = Location;
