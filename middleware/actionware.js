const { Actions } = require('../models/action'),
  { clearCache } = require('redis_mongoose'),
  config = require('../config/config'),
  {
    redis: { time },
  } = config;

// get location info
async function getActionLoc(idsg) {
  return await Actions.findOne({ sgame: idsg, solvedOn: null })
    .sort('prog_nr')
    .select('reachedOn step')
    .lean()
    .populate('step')
    .cache({ ttl: time });
}

// get riddle id from field in the action object
async function getRiddleFromAction(ida) {
  return await Actions.findById(ida)
    .select('riddle')
    .lean()
    .populate('riddle')
    .cache({ ttl: time });
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
  const result = await Actions.findByIdAndUpdate(ida, {
    reachedOn: Date.now(),
  }).lean();
  clearCache;
  return result;
}

// set the path of the selfie image
async function setPhoto(ida, file) {
  const result = await Actions.findByIdAndUpdate(ida, {
    group_photo: `/data/gamephoto/${file}`,
  }).lean();
  clearCache();
  return result;
}

// set riddle as solved
async function setSolved(ida) {
  const result = await Actions.findByIdAndUpdate(ida, {
    solvedOn: Date.now(),
  }).lean();
  clearCache();
  return result;
}

module.exports = {
  getActionLoc: getActionLoc,
  getRiddleFromAction: getRiddleFromAction,
  getImages: getImages,
  setReached: setReached,
  setPhoto: setPhoto,
  setSolved: setSolved,
};
