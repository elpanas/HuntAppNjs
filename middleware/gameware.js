const { Game } = require('../models/schemas');

// CREATE GAME
async function createGame(game_data) {

    const game = new Game({
        event: game_data.event_id,
        name: game_data.name,
        riddle_category: game_data.riddle_category,
        is_open: game_data.is_open
    });

    // salva il documento
    return await game.save();
}
// --------------------------------------------------------------------


// GET ALL GAMES
async function getAllGames(event_id) {
    return await Game.find({ event: event_id }).select('_id name');
}

// GET GAME
async function getGame(id) {
    return await Game.findById(id);
}
// --------------------------------------------------------------------


// UPDATE GAME
async function updateGame(idg, game_data) {

    return game = await Game.update({ _id: idg }, {
        $set: {
            name: game_data.name
        }
    }, { new: true });
}
// --------------------------------------------------------------------


// REMOVE GAME
async function removeGame(id) {
    return result = await Game.findByIdAndDelete(id);
}
// --------------------------------------------------------------------

module.exports.createGame = createGame;
module.exports.getGame = getGame;
module.exports.getAllGames = getAllGames;
module.exports.updateGame = updateGame;
module.exports.removeGame = removeGame;