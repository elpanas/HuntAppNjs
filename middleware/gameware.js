const { Game } = require('../models/game'),
  { clearCache } = require('redis_mongoose'),
  config = require('../config/config'),
  {
    redis: { time },
  } = config;

// CREATE
async function createGame(game_data) {
  const result = await Game.create(game_data);
  clearCache();
  return result;
}
// --------------------------------------------------------------------

//READ
// get all games infos
async function getAllGames(event_id) {
  return await Game.find({ event: event_id })
    .select('_id name riddle_category organizer qr_created active is_open')
    .lean()
    .cache({ ttl: time });
}

// get the riddle category of a game
async function getGameCategory(idg) {
  return await Game.findById(idg)
    .select('riddle_category')
    .lean()
    .cache({ ttl: time });
}

// UPDATE
// set qrcode pdf as created
async function setQrCode(idg) {
  const result = await Game.findByIdAndUpdate(idg, { qr_created: true }).lean();
  clearCache();
  return result;
}

// set a game as active
async function activateGame(idg) {
  const result = await Game.findByIdAndUpdate(idg, { active: true }).lean();
  clearCache();
  return result;
}
// --------------------------------------------------------------------

module.exports = {
  createGame: createGame,
  getGameCategory: getGameCategory,
  getAllGames: getAllGames,
  setQrCode: setQrCode,
  activateGame: activateGame,
};
