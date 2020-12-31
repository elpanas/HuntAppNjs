const { SingleGame, Riddle, Actions, Location, Cluster } = require('../models/schemas');

// ----- CREATE -----
async function createSingleGame(single_data, idu) {
    const sgame = new SingleGame({
        game: single_data.game_id,                  
        group_name: single_data.group_name,
        group_captain: idu,
        group_nr_players: single_data.group_nr_players,
        group_flag: single_data.group_flag
        //group_photo_path: single_data.group_photo_path
    });
    
    return await sgame.save();
}

async function createSteps(idg, idsg, riddle_cat) {

    const clusters = await getClusters(idg),
        locations = await getLocations(idg);

    var steps = [],
        m = 0,
        s = 0,
        tot_steps = 1,
        middleLocs,
        filteredLocs;

    const startLocObj = locations.find(loc => loc.is_start),
        finalLocObj = locations.find(loc => loc.is_final);

    steps.push(createObj(tot_steps++, idsg, startLocObj._id));
    
    clusters.forEach(clt => {

        filteredLocs = shuffle(locations.filter(loc => loc.cluster == clt.cluster && !loc.is_start && !loc.is_final));

        middleLocs = (filteredLocs.length > clt.nr_extracted_loc)
                    ? filteredLocs.slice(0, clt.nr_extracted_loc - 1)
                    : filteredLocs; // extract locs from cluster

        for (m = 0; m < middleLocs.length; m++)
            steps.push(createObj(tot_steps++, idsg, middleLocs[m]._id));
    });

    steps.push(createObj(tot_steps, idsg, finalLocObj._id));

    const riddles = await getRiddles(tot_steps, riddle_cat);

    riddles.forEach(r => steps[s++].riddle = r._id );

    // adds actions
    Actions.insertMany(steps);   
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
    return { "prog_nr": nr, "sgame": idsg, "step": id, "riddle": null };
}

// Fisher Yates shuffle method
function shuffle(arr) {
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * i)
        k = arr[i]
        arr[i] = arr[j]
        arr[j] = k
      } 
    return arr;
}
// ------------------------------------------------------

// check if a group has been created
function checkGroup(idg, idu) {
    return SingleGame.findOne(
        { 
            game: idg, 
            group_captain: idu,
            is_completed: false
        })
        .select('_id')
        .sort('-bootdate')
        .lean();
}

// check if there are other games already played by this user
function checkMultipleGame(idg, idu) {
    return SingleGame.findOne(
        {
            game: idg,
            group_captain: idu,
            is_completed: true
        })
        .select('game')
        .populate('game');
}

async function getTerminatedList(idu) {
    return await SingleGame.find(
        {
            group_captain: idu,
            is_completed: true
        })
        .populate('game')
        .select('_id game');
}
// --------------------------------------------------------------------


// set a game session as completed
async function setCompleted(idsg) {
    return SingleGame.findByIdAndUpdate(idsg, { is_completed: true });
}
// --------------------------------------------------------------------

module.exports.createSingleGame = createSingleGame;
module.exports.createSteps = createSteps;
module.exports.checkGroup = checkGroup;
module.exports.checkMultipleGame = checkMultipleGame;
module.exports.getTerminatedList = getTerminatedList;
module.exports.setCompleted = setCompleted;
