const mongoose = require('mongoose'), // MongoDB framework
  Schema = mongoose.Schema,
  stringOpts = {
    type: String,
    default: null,
  };

const singleGameSchema = Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: 'game',
  },
  group_name: stringOpts,
  group_captain: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  group_nr_players: {
    type: Number,
    required: true,
  },
  group_photo_path: stringOpts,
  group_flag: String,
  is_completed: {
    type: Boolean,
    default: false,
  },
}).index({ game: 1, group_captain: 1, is_completed: 1 });

const SingleGame = mongoose.model('singlegame', singleGameSchema);

module.exports.SingleGame = SingleGame;
