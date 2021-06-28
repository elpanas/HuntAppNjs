const { Actions } = require('../models/action');

// get location info
async function getActionLoc(idsg) {
  return await Actions.findOne({ sgame: idsg, solvedOn: null })
    .sort('prog_nr')
    .select('reachedOn step')
    .lean()
    .populate('step');
}

// get riddle id from field in the action object
async function getRiddleFromAction(ida) {
  return await Actions.findById(ida).select('riddle').lean().populate('riddle');
}

// get selfies for the final carousel
async function getImages(idsg) {
  return await Actions.find({ sgame: idsg })
    .sort('prog_nr')
    .select('group_photo')
    .lean();
}

// set location as reached
async function setReached(ida) {
  return await Actions.findByIdAndUpdate(ida, { reachedOn: Date.now() }).lean();
}

// set the path of the selfie image
async function setPhoto(ida, file) {
  return await Actions.findByIdAndUpdate(ida, {
    group_photo: `/data/gamephoto/${file}`,
  }).lean();
}

// set riddle as solved
async function setSolved(ida) {
  return await Actions.findByIdAndUpdate(ida, { solvedOn: Date.now() }).lean();
}

module.exports.getActionLoc = getActionLoc;
module.exports.getRiddleFromAction = getRiddleFromAction;
module.exports.getImages = getImages;
module.exports.setReached = setReached;
module.exports.setPhoto = setPhoto;
module.exports.setSolved = setSolved;
