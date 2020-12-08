const { SingleGame, Riddle, Actions, Location } = require('../models/schemas');

// ----- CREATE -----
async function createSingleGame(single_data, idu) {
    const sgame = new SingleGame({
        game: single_data.game_id,                  
        group_name: single_data.group_name,
        group_captain: idu,
        group_nr_players: single_data.group_nr_players,
        group_photo_path: single_data.group_photo_path
    });
    
    return await sgame.save();
}

async function createSteps(idg, idsg, riddle_cat) {
    
    var actual_cluster = 0,
        startLoc,
        finalLoc,
        clusters = [],
        stepsLoc = [],
        tot_loc = 0,
        tot_steps = 2;

    Location.find({ game: idg }).select('_id cluster is_start is_final').sort('cluster')
        .then((locations) => {
            locations.forEach((loc) => {
                if (tot_loc == 0) clusters[actual_cluster] = [];

                if (actual_cluster != (loc.cluster-1)) {
                    clusters[actual_cluster].sort(() => Math.random() - 0.5); // shuffle locs in clusters
                    actual_cluster++;
                    clusters[actual_cluster] = [];
                }
                
                if (loc.is_start)
                    startLoc = { "prog_nr": 1, "sgame": idsg, "step": loc._id };
                else if (loc.is_final) 
                    finalLoc = loc._id;
                else 
                    clusters[actual_cluster].push(loc._id); // inserisci qui il subarray
                
                tot_loc++;
            });

            tot_loc--;

            // add first element
            stepsLoc.push(startLoc);

            clusters.forEach(cluster => {   
                cluster.forEach(step => {                    
                    stepsLoc.push(
                        { 
                            "prog_nr": tot_steps++,
                            "sgame": idsg,
                            "step": step                           
                        }
                    );                    
                }); // cluster.forEach()
            }); // clusters.forEach()  

            // add last element
            stepsLoc.push(
                {
                    "prog_nr": tot_steps,
                    "sgame": idsg,
                    "step": finalLoc
                }
            );
            
            // associate a riddle foreach location
            Riddle.aggregate()
                .match({ riddle_category: riddle_cat })
                .project({ _id: 1 })
                .sample(tot_steps)
                .then(riddles => {
                    var s = 0;
                    riddles.forEach(r => {
                        stepsLoc[s].riddle = r._id;
                        s++;
                    });

                    /* stepsLoc.push(
                        {
                            "prog_nr": tot_steps,
                            "sgame": idsg,
                            "step": finalLoc,
                            "riddle": finalriddle // insieme di riddle più difficili
                        }
                    )*/
                    // adds actions
                    Actions.insertMany(stepsLoc);                  
                });                 
        });
}
// --------------------------------------------------------------------

// GET STEP
function checkGroup(idg, idu) {
    return SingleGame.findOne(
            { 
                game: idg, 
                group_captain: idu,
                is_completed: false
            })
            .select('_id')
            .sort('-bootdate');
}

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
// --------------------------------------------------------------------


// SET
async function setCompleted(idsg) {
    return SingleGame.findByIdAndUpdate(idsg, { is_completed: true });
}
// --------------------------------------------------------------------

module.exports.createSingleGame = createSingleGame;
module.exports.createSteps = createSteps;
module.exports.checkGroup = checkGroup;
module.exports.checkMultipleGame = checkMultipleGame;
module.exports.setCompleted = setCompleted;