const { Game } = require('../models/schemas');

// CREATE GAME
async function createGame(game_data, user_id, event_id) {

    const game = new Game({
        event: event_id,
        name: game_data.name,
        organizer: user_id
    });

    // salva il documento
    const result = await game.save();

    if (result)
        return result._id;
    else
        return false;
}
// --------------------------------------------------------------------


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
module.exports.updateGame = updateGame;
module.exports.removeGame = removeGame;