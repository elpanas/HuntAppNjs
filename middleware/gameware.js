const { mongoose } = require('mongoose');
const { Game } = require('../models/schemas');

// CREATE GAME
async function createGame(game_data) {

    const game = new Game({
        event: game_data.event_id,
        name: game_data.name,
        organizer: game_data.organizer,
        riddle_category: game_data.riddle_category,
        is_open: game_data.is_open
    });

    // salva il documento
    return await game.save();
}
// --------------------------------------------------------------------


// GET ALL GAMES
function getAllGames(event_id) {
    return Game.find({ event: event_id }).select('_id name riddle_category organizer qr_created active is_open');
}

function getGameCategory(idg) {
    return Game.findById(idg).select('riddle_category');
}

function getGameEvent(idg) {
    return Game.findById(idg).select('event').populate('event');
}
// --------------------------------------------------------------------

function setQrCode(idg) {
    return Game.findByIdAndUpdate(idg, { qr_created: true });
}

function activateGame(idg) {
    return Game.findByIdAndUpdate(idg, { active: true });
}
// --------------------------------------------------------------------

module.exports.createGame = createGame;
module.exports.getGameCategory = getGameCategory;
module.exports.getGameEvent = getGameEvent;
module.exports.getAllGames = getAllGames;
module.exports.setQrCode = setQrCode;
module.exports.activateGame = activateGame;