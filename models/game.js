const mongoose = require('mongoose'), // MongoDB framework
  Schema = mongoose.Schema,
  boolOpts = {
    type: Boolean,
    default: false,
  };

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
  qr_created: boolOpts,
  active: boolOpts,
  is_open: boolOpts,
}).index({ event: 1 });

const Game = mongoose.model('game', gameSchema);

module.exports.Game = Game;
