const mongoose = require('mongoose'); // MongoDB framework
const Schema = mongoose.Schema;

const actionsSchema = Schema({
  prog_nr: Number,
  sgame: { type: Schema.Types.ObjectId, ref: 'singlegame' },
  step: { type: Schema.Types.ObjectId, ref: 'location' },
  reachedOn: { type: Date, default: null },
  riddle: { type: Schema.Types.ObjectId, ref: 'riddle', default: null },
  solvedOn: { type: Date, default: null },
  group_photo: { type: String, default: null },
}).index({ sgame: 1 });

const Actions = mongoose.model('actions', actionsSchema);

exports.Actions = Actions;
