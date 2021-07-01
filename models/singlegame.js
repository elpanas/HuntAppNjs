const mongoose = require('mongoose'); // MongoDB framework
const Schema = mongoose.Schema;

const singleGameSchema = Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: 'game',
  },
  group_name: {
    type: String,
    default: null,
  },
  group_captain: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  group_nr_players: {
    type: Number,
    required: true,
  },
  group_photo_path: {
    type: String,
    default: null,
  },
  group_flag: {
    type: String,
  },
  is_completed: {
    type: Boolean,
    default: false,
  },
}).index({ game: 1, group_captain: 1, is_completed: 1 });

const SingleGame = mongoose.model('singlegame', singleGameSchema);

exports.SingleGame = SingleGame;
