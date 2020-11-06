const { Riddle } = require('../models/schemas');

// CREATE RIDDLE
async function createRiddle(riddle_data) {

    const riddle = new Riddle({
        event: riddle_data.event_id,
        riddle_type: riddle_data.type,
        riddle_param: riddle_data.param,
        image_path: riddle_data.image,
        solution: riddle_data.solution
    });

    const result = await riddle.save();

    if (result)
        return result._id;
    else
        return false;
}
// --------------------------------------------------------------------


// GET RIDDLE
async function getRiddle(id) {
    return await Riddle.findById(id);
}
// --------------------------------------------------------------------


// UPDATE RIDDLE
async function updateRiddle(idr, riddle_data) {

    return riddle = await Riddle.update({ _id: idr }, {
        $set: {            
            riddle_type: riddle_data.type,
            riddle_param: riddle_data.param,
            image_path: riddle_data.image,
            solution: riddle_data.solution
        }
    }, { new: true });
}
// --------------------------------------------------------------------


// REMOVE RIDDLE
async function removeRiddle(id) {
    return result = await Riddle.findByIdAndDelete(id);
}
// --------------------------------------------------------------------

module.exports.createRiddle = createRiddle;
module.exports.getRiddle = getRiddle;
module.exports.updateRiddle = updateRiddle;
module.exports.removeRiddle = removeRiddle;