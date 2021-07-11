const mongoose = require('mongoose'), // MongoDB framework
  Schema = mongoose.Schema,
  dateOpts = { type: Date, default: null };

const actionsSchema = Schema({
  prog_nr: Number,
  sgame: {
    type: Schema.Types.ObjectId,
    ref: 'singlegame',
  },
  step: {
    type: Schema.Types.ObjectId,
    ref: 'location',
  },
  reachedOn: dateOpts,
  riddle: {
    type: Schema.Types.ObjectId,
    ref: 'riddle',
    default: null,
  },
  solvedOn: dateOpts,
  group_photo: {
    type: String,
    default: null,
  },
}).index({ sgame: 1 });

const Actions = mongoose.model('actions', actionsSchema);

module.exports.Actions = Actions;
