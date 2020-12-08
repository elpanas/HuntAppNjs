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

async function createRiddles(riddle_data) {
    return await Riddle.insertMany(riddle_data);
}
// --------------------------------------------------------------------


// GET RIDDLE

function generateRiddle(riddle, locale, readValue) {
        
    PO.load('src/translation/it_IT/LC_MESSAGES/riddles.po', (err, po) => { 

        const message = po.items.find(item => item.msgid == 'riddle_type_' + riddle.riddle_type);

        readValue({
            "idr": riddle._id,
            "text": message.msgstr.toString().replace('%RIDDLE_PARAM%', riddle.riddle_param),
            "riddle_image_path": riddle.riddle_image_path,
            "solution": riddle.riddle_solution
        });
    });
}

function getRiddle(idr) {
    return Riddle.findById(idr);
}

function checkRiddle(riddledata) {
    return Riddle.findOne({ _id: riddledata.idr, riddle_solution: riddledata.solution });
}
// --------------------------------------------------------------------

module.exports.createRiddle = createRiddle;
module.exports.createRiddles = createRiddles;
module.exports.getRiddle = getRiddle;
module.exports.generateRiddle = generateRiddle;
module.exports.checkRiddle = checkRiddle;