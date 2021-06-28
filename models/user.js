const mongoose = require('mongoose'); // MongoDB framework
const Schema = mongoose.Schema;

// ----- USERS -----
const userSchema = Schema({
  first_name: {
    type: String,
  },
  full_name: {
    type: String,
  },
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  logged: {
    type: Date,
    default: Date.now(),
  },
}).index({ username: 1, password: 1 });

const User = mongoose.model('user', userSchema);
exports.User = User;
