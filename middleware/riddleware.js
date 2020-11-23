const { Riddle } = require('../models/schemas');
var PO = require('pofile');

// CREATE RIDDLE
async function createRiddle(riddle_data) {

    const riddle = new Riddle({
        riddle_category: riddle_data.category,
        riddle_type: riddle_data.type,
        riddle_param: riddle_data.param,
        riddle_image_path: riddle_data.image_path,
        riddle_solution: riddle_data.solution
    });

    return await riddle.save();
}
// --------------------------------------------------------------------


// GET RIDDLE
function generateRiddle(id, locale) {
    PO.load('src/translation/it_IT/LC_MESSAGES/riddles.po', (err, po) => {
        
        const riddle = Riddle.findById(id).select('riddle_type');

        console.log(riddle.riddle_type);

        const message = po.items.find(item => item.msgid == 'riddle_type_' + riddle.riddle_type);
        
        const riddledata = {
            "text": message.msgstr
            // riddle.riddle_param*/
        }

        return riddledata;    
    });    
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
module.exports.generateRiddle = generateRiddle;
module.exports.updateRiddle = updateRiddle;
module.exports.removeRiddle = removeRiddle;