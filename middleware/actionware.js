const { Actions } = require('../models/schemas');

// get location info
async function getActionLoc(idsg) {    
    return await Actions.findOne({ sgame: idsg, solvedOn: null })
        .sort('prog_nr')
        .select('reachedOn step')
        .populate('step');
}

// get riddle id from field in the action object
function getRiddleFromAction(ida) {
    return Actions.findById(ida).select('riddle').populate('riddle');
}

// set location as reached
async function setReached(ida) {  // qrcode     
    return await Actions.findByIdAndUpdate(ida, { reachedOn: Date.now() });
}

// set the path of the selfie image
async function setPhoto(ida, file) {
    return await Actions.findByIdAndUpdate(ida, { group_photo: '/data/gamephoto/' + file }); 
}

// set riddle as solved
async function setSolved(ida) {  // qrcode     
    return await Actions.findByIdAndUpdate(ida, { solvedOn: Date.now() }); 
}

module.exports.getActionLoc = getActionLoc;
module.exports.setReached = setReached;
module.exports.setPhoto = setPhoto;
module.exports.getRiddleFromAction = getRiddleFromAction;
module.exports.setSolved = setSolved;