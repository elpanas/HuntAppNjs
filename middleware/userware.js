const { credentialsHandler } = require('../functions/functions'),
  { User } = require('../models/user'),
  bcrypt = require('bcrypt'),
  config = require('../config/config'),
  saltRounds = ({
    bcrypt: { saltRounds },
  } = config);

// CREATE USER
async function createUser(user_data) {
  const username = Buffer.from(user_data.username, 'base64').toString(),
    password = Buffer.from(user_data.password, 'base64').toString();
  const hashPassword = await bcrypt.hashSync(password, saltRounds);
  return await User.create({
    first_name: user_data.first_name,
    full_name: user_data.full_name,
    username: username,
    password: hashPassword,
    is_admin: user_data.is_admin,
  });
}
// --------------------------------------------------------------------

// GET
async function getUser(id) {
  return await User.findById(id).lean();
}
// --------------------------------------------------------------------

// check credentials
async function checkUser(auth) {
  const credentialObject = credentialsHandler(auth);
  const result = await User.findOne(credentialObject).lean();
  if (result) return result._id;
  return false;
}

// check the same thing but it returns the whole document
async function checkLogin(auth) {
  const credentialObject = credentialsHandler(auth);
  const user = await User.aggregate([
    { $match: credentialObject },
    { $addFields: { logStatus: { $subtract: ['$$NOW', '$logged'] } } },
    { $project: { _id: 0, logStatus: 1 } },
  ]);

  if (user[0].logStatus < 60 * 60000) {
    return await User.findByIdAndUpdate(
      user[0]._id,
      { logged: Date.now() },
      { new: true }
    ).lean();
  }
  return false;
}
// --------------------------------------------------------------------

async function makeLogin(auth) {
  const credentialObject = credentialsHandler(auth);
  return await User.findOneAndUpdate(
    credentialObject,
    { logged: Date.now() },
    { new: true }
  ).lean();
}

async function makeLogout(auth) {
  const credentialObject = credentialsHandler(auth);
  return await User.findOneAndUpdate(
    credentialObject,
    { logged: null },
    { new: true }
  ).lean();
}

module.exports.createUser = createUser;
module.exports.getUser = getUser;
module.exports.checkUser = checkUser;
module.exports.checkLogin = checkLogin;
module.exports.makeLogin = makeLogin;
module.exports.makeLogout = makeLogout;
