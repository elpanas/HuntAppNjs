const { SingleGame, Location, Riddle } = require('../models/schemas');


// ----- CREATE -----
async function createSingleGame(single_data) {
    const sgame = new SingleGame({
        game: single_data.game_id,                  
        group_name: single_data.group_name,
        group_captain: single_data.group_captain,
        group_nr_players: single_data.group_nr_players,
        group_photo_path: single_data.group_photo_path
    });

    return await sgame.save();

    // creteSteps(idg, idsg, single_data.riddle_cat);
}

async function createSteps(idg, idsg, riddle_cat) {
    
    var actual_cluster = 0,
        startLoc,
        finalLoc,
        clusters = [],
        stepsLoc = [],
        tot_loc = 0,
        tot_cluster_loc = 0,
        tot_steps = 2,
        tot_steps_loc = 0;

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
                    startLoc = { "prog_nr": 1, "step": loc._id, "reachedOn": null, "riddle": null, "solvedOn": null };
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

                tot_steps_loc = 1;

                tot_cluster_loc = (tot_loc > 10) 
                    ? Math.round(((75/100) * cluster.length)) // take 75% of the locs in a cluster 
                    : cluster.length;

                cluster.forEach(step => {
                    if (tot_steps_loc <= tot_cluster_loc) {
                        stepsLoc.push(
                            { 
                                "prog_nr": tot_steps++,
                                "step": step,   
                                "reachedOn": null,                                        
                                "riddle": null, 
                                "solvedOn": null
                            }
                        );
                    } 
                    tot_steps_loc++;
                }); // cluster.forEach()
            }); // clusters.forEach()  

            // add last element
            stepsLoc.push(
                {
                    "prog_nr": tot_steps,
                    "step": finalLoc, 
                    "reachedOn": null, 
                    "riddle": null, 
                    "solvedOn": null 
                }
            );

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

                    SingleGame.updateOne(
                        { _id: idsg },
                        { $push: { steps: { $each: stepsLoc } } }
                    ).exec();
                });                 
        });

    return await 0;
}
// --------------------------------------------------------------------

// GET STEP
function getSgameStep(idsg) {
    console.log(idsg);
    SingleGame.findOne({ _id: idsg }).select('steps')
        .then((result) => {
            // to do
        });

    // const passo = stepsList.find(step => step.solvedOn === null);

    // console.log(passo.riddle);

    //  passo;
}
// --------------------------------------------------------------------

module.exports.createSingleGame = createSingleGame;
module.exports.createSteps = createSteps;
module.exports.getSgameStep = getSgameStep;