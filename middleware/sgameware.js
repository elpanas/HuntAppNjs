const { SingleGame } = require('../models/singlegame'),
  { Actions } = require('../models/action'),
  { Cluster } = require('../models/cluster'),
  { Riddle } = require('../models/riddle'),
  { createObj, shuffle } = require('../functions/functions'),
  { clearCache } = require('redis_mongoose'),
  config = require('../config/config'),
  {
    redis: { time },
  } = config;

// ----- CREATE -----
async function createSingleGame(single_data, idu) {
  const result = await SingleGame.create({
    game: single_data.game_id,
    group_name: single_data.group_name,
    group_captain: idu,
    group_nr_players: single_data.group_nr_players,
    group_flag: single_data.group_flag,
    //group_photo_path: single_data.group_photo_path
  });
  clearCache();
  return result;
}

// generate random steps
async function createSteps(idg, idsg, riddle_cat) {
  const clusters = await getClusters(idg),
    locations = await getLocations(idg),
    startLocObj = locations.find((loc) => loc.is_start),
    finalLocObj = locations.find((loc) => loc.is_final);
  let steps = [],
    s = 0,
    tot_steps = 1;

  steps.push(createObj(1, idsg, startLocObj._id)); // First

  clusters.forEach((clt) => {
    const filteredLocs = shuffle(
      locations.filter(
        (loc) => loc.cluster == clt.cluster && !loc.is_start && !loc.is_final
      )
    ),

    const middleLocs =
      filteredLocs.length > clt.nr_extracted_loc
        ? filteredLocs.slice(0, clt.nr_extracted_loc - 1)
        : filteredLocs;

    middleLocs.forEach((loc) =>
      steps.push(createObj(tot_steps++, idsg, loc._id))
    );
  }); // Middle

  steps.push(createObj(tot_steps++, idsg, finalLocObj._id)); // Last

  const riddles = await getRiddles(tot_steps, riddle_cat);
  riddles.forEach((r) => (steps[s++].riddle = r._id));

  await Actions.insertMany(steps);
  clearCache();
}

// auxiliary functions
async function getClusters(idg) {
  return await Cluster.find({ game: idg })
    .select('cluster nr_extracted_loc')
    .sort('cluster')
    .lean();
}

async function getLocations(idg) {
  return await Location.find({ game: idg })
    .select('_id cluster is_start is_final')
    .sort('cluster')
    .lean();
}

async function getRiddles(tot_steps, rid_cat) {
  return await Riddle.aggregate()
    .match({ riddle_category: rid_cat })
    .project({ _id: 1 })
    .sample(tot_steps);
}

// check if a group has been created
async function checkGroup(idg, idu) {
  return await SingleGame.findOne({
    game: idg,
    group_captain: idu,
    is_completed: false,
  })
    .select('_id')
    .sort('-bootdate')
    .lean()
    .cache({ ttl: time });
}

// check if there are other games already played by this user
async function checkMultipleGame(idg, idu) {
  try {
    const result = await SingleGame.findOne({
      game: idg,
      group_captain: idu,
      is_completed: true,
    })
      .select('game')
      .lean()
      .populate('game')
      .cache({ ttl: time });

    return result.game.is_open;
  } catch (e) {
    return false;
  }
}

// get a list of finished games
async function getFinishedList(idu) {
  return await SingleGame.find({
    group_captain: idu,
    is_completed: true,
  })
    .select('_id game')
    .lean()
    .populate('game')
    .cache({ ttl: time });
}
// --------------------------------------------------------------------

// set a game session as completed
async function setCompleted(idsg) {
  const result = await SingleGame.findByIdAndUpdate(idsg, {
    is_completed: true,
  }).lean();
  clearCache();
  return result;
}
// --------------------------------------------------------------------

module.exports = {
  createSingleGame: createSingleGame,
  createSteps: createSteps,
  checkGroup: checkGroup,
  checkMultipleGame: checkMultipleGame,
  getFinishedList: getFinishedList,
  setCompleted: setCompleted,
};
