const mongoose = require('mongoose'); // MongoDB framework
const Schema = mongoose.Schema;

const gameSchema = Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'event',
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  riddle_category: {
    type: String,
    enum: ['Basic', 'Intermediate', 'Advanced'],
  },
  //start_date: Date,
  qr_created: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  is_open: {
    type: Boolean,
    default: false,
  },
}).index({ event: 1 });

const Game = mongoose.model('game', gameSchema);

exports.Game = Game;
