const mongoose = require('mongoose'), // MongoDB framework
  Schema = mongoose.Schema;

const userSchema = Schema({
  first_name: String,
  full_name: String,
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

moduleexports.User = User;
