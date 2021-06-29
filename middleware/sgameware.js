const { SingleGame } = require('../models/singlegame'),
  { Actions } = require('../models/action'),
  { Cluster } = require('../models/cluster'),
  { Riddle } = require('../models/riddle'),
  { createObj, shuffle } = require('../models/functions');

// ----- CREATE -----
async function createSingleGame(single_data, idu) {
  return await SingleGame.create({
    game: single_data.game_id,
    group_name: single_data.group_name,
    group_captain: idu,
    group_nr_players: single_data.group_nr_players,
    group_flag: single_data.group_flag,
    //group_photo_path: single_data.group_photo_path
  });
}

// generate random steps on the
async function createSteps(idg, idsg, riddle_cat) {
  const clusters = await getClusters(idg),
    locations = await getLocations(idg);
  const startLocObj = locations.find((loc) => loc.is_start),
    finalLocObj = locations.find((loc) => loc.is_final);
  let steps = [],
    s = 0,
    tot_steps = 2;

  steps.push(createObj(1, idsg, startLocObj._id)); // First

  clusters.forEach((clt) => {
    const filteredLocs = locations.filter(
      (loc) => loc.cluster == clt.cluster && !loc.is_start && !loc.is_final
    );
    const shuffleLocs = shuffle(filteredLocs);
    const middleLocs =
      shuffleLocs.length > clt.nr_extracted_loc
        ? shuffleLocs.slice(0, clt.nr_extracted_loc - 1)
        : shuffleLocs;

    for (let m = 0; m < middleLocs.length; m++)
      steps.push(createObj(tot_steps++, idsg, middleLocs[m]._id));
  }); // Middle

  steps.push(createObj(tot_steps, idsg, finalLocObj._id)); // Last

  const riddles = await getRiddles(tot_steps, riddle_cat);
  riddles.forEach((r) => (steps[s++].riddle = r._id));

  await Actions.insertMany(steps);
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
    .lean();
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
      .populate('game');

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
    .populate('game');
}
// --------------------------------------------------------------------

// set a game session as completed
async function setCompleted(idsg) {
  return SingleGame.findByIdAndUpdate(idsg, { is_completed: true }).lean();
}
// --------------------------------------------------------------------

module.exports.createSingleGame = createSingleGame;
module.exports.createSteps = createSteps;
module.exports.checkGroup = checkGroup;
module.exports.checkMultipleGame = checkMultipleGame;
module.exports.getFinishedList = getFinishedList;
module.exports.setCompleted = setCompleted;
