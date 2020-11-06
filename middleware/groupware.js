const { Group } = require('../models/schemas');

// CREATE GROUP
async function createGroup(game_id, group_data) {

    const group = new Group({
        game: game_id,
        name: group_data.name,
        captain: group_data.captain,
        num_players: group_data.num_players,
        final_location: group_data.final_location
    });

    const result = await group.save();

    if (result)
        return result._id;
    else
        return false;
}
// --------------------------------------------------------------------


// GET GROUP
async function getGroup(id) {
    return await Group.findById(id);
}
// --------------------------------------------------------------------


// UPDATE GROUP
async function updateGroup(idg, group_data) {

    return GROUP = await GROUP.update({ _id: idg }, {
        $set: {            
            name: group_data.name,
            captain: group_data.captain,
            num_players: group_data.num_players,
            final_location: group_data.final_location
        }
    }, { new: true });
}
// --------------------------------------------------------------------


// REMOVE GROUP
async function removeGroup(id) {
    return result = await Group.findByIdAndDelete(id);
}
// --------------------------------------------------------------------

module.exports.createGroup = createGroup;
module.exports.getGroup = getGroup;
module.exports.updateGroup = updateGroup;
module.exports.removeGroup = removeGroup;