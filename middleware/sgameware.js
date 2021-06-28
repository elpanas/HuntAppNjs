const { SingleGame } = require('../models/singlegame');

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
  const clusters = await getClusters(idg), // get all cluster infos of this game
    locations = await getLocations(idg); // get all location of this game

  var steps = [],
    m = 0,
    s = 0,
    tot_steps = 2,
    middleLocs,
    filteredLocs;

  const startLocObj = locations.find((loc) => loc.is_start), // get start location
    finalLocObj = locations.find((loc) => loc.is_final); // get final location

  steps.push(createObj(1, idsg, startLocObj._id)); // push the first loc in the array

  // for and from each cluster, get the specified number of locations
  clusters.forEach((clt) => {
    // get an array without start and final locations
    filteredLocs = shuffle(
      locations.filter(
        (loc) => loc.cluster == clt.cluster && !loc.is_start && !loc.is_final
      )
    );

    // extract the number of locations, specified in the cluster options
    middleLocs =
      filteredLocs.length > clt.nr_extracted_loc
        ? filteredLocs.slice(0, clt.nr_extracted_loc - 1)
        : filteredLocs;

    for (
      m = 0;
      m < middleLocs.length;
      m++ // create and push an "action" object (step) for each middle location
    )
      steps.push(createObj(tot_steps++, idsg, middleLocs[m]._id));
  });

  steps.push(createObj(tot_steps, idsg, finalLocObj._id)); // push the final loc in the array

  const riddles = await getRiddles(tot_steps, riddle_cat); // get riddles as much as the locations

  riddles.forEach((r) => (steps[s++].riddle = r._id)); // insert riddle id in each step just created

  // adds actions
  Actions.insertMany(steps); // push steps into the action collection
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

function createObj(nr, idsg, id) {
  return { prog_nr: nr, sgame: idsg, step: id, riddle: null };
}

// Fisher Yates shuffle method
function shuffle(arr) {
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * i);
    k = arr[i];
    arr[i] = arr[j];
    arr[j] = k;
  }
  return arr;
}
// ------------------------------------------------------

// check if a group has been created
function checkGroup(idg, idu) {
  return SingleGame.findOne({
    game: idg,
    group_captain: idu,
    is_completed: false,
  })
    .select('_id')
    .sort('-bootdate')
    .lean();
}

// check if there are other games already played by this user
function checkMultipleGame(idg, idu) {
  return SingleGame.findOne({
    game: idg,
    group_captain: idu,
    is_completed: true,
  })
    .select('game')
    .lean()
    .populate('game');
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
