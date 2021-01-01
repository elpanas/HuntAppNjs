const { Game } = require('../models/schemas');

// CREATE
async function createGame(game_data) {

    const game = new Game({
        event: game_data.event_id,
        name: game_data.name,
        organizer: game_data.organizer,
        riddle_category: game_data.riddle_category,
        is_open: game_data.is_open
    });

    return await game.save();
}
// --------------------------------------------------------------------

//READ
// get all games infos
function getAllGames(event_id) {
    return Game.find({ event: event_id }).select('_id name riddle_category organizer qr_created active is_open').lean();
}

// get the riddle category of a game
function getGameCategory(idg) {
    return Game.findById(idg).select('riddle_category').lean();
}

// UPDATE
// set qrcode pdf as created
function setQrCode(idg) {
    return Game.findByIdAndUpdate(idg, { qr_created: true }).lean();
}

// set a game as active
function activateGame(idg) {
    return Game.findByIdAndUpdate(idg, { active: true }).lean();
}
// --------------------------------------------------------------------

module.exports.createGame = createGame;
module.exports.getGameCategory = getGameCategory;
module.exports.getAllGames = getAllGames;
module.exports.setQrCode = setQrCode;
module.exports.activateGame = activateGame;