const mongoose = require('mongoose'); // MongoDB framework
const Schema = mongoose.Schema;

const riddleSchema = Schema({
  riddle_category: {
    type: String,
    enum: ['Basic', 'Intermadiate', 'Hard'],
  },
  riddle_type: {
    type: Number,
    default: 1,
  },
  riddle_param: {
    type: String,
    default: '',
  },
  riddle_image_path: {
    type: String,
    default: null,
  },
  riddle_solution: {
    type: String,
  },
  is_final: {
    type: Boolean,
    default: false,
  },
}).index({ riddle_solution: 1, riddle_category: 1 });

const Riddle = mongoose.model('riddle', riddleSchema);

exports.Riddle = Riddle;
