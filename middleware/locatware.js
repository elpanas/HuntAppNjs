const { Location } = require('../models/schemas');
const mongoose = require('mongoose');

// CREATE 
async function createLocations(locs_data) {
    await Location.insertMany(locs_data);
}

async function createLocation(loc_data) {

    const loc = new Location({
        game: loc_data.game_id,
        name: loc_data.name,
        cluster: loc_data.cluster,
        location: loc_data.location,
        description: loc_data.description,
        image_path: loc_data.imagepath,
        hint: loc_data.hint,
        is_start: loc_data.is_start,
        is_final: loc_data.is_final
    });

    // salva il documento
    return await loc.save();
}
// --------------------------------------------------------------------


// get the game cluster list
async function getClusterList(idg) {
    newidg = mongoose.Types.ObjectId(idg);
    return await Location.aggregate([        
        { $match: { game: newidg } },   
        { $project: { _id: 0, cluster: 1 } },     
        { $group: { _id: "$cluster" } },         
        { $sort: { _id: 1 } }
    ])
}

// get locations nr
function getNrLocations(idg) {
    newidg = mongoose.Types.ObjectId(idg);
    return Location.estimatedDocumentCount({ game: newidg });
}

// get all locations of a game
function getLocations(idg) {
    // newidg = mongoose.Types.ObjectId(idg);
    return Location.find({ game: idg }).sort('cluster');
}

// get all distances between the new place and the others
function getDistances(locdata) {  
    const newidg = mongoose.Types.ObjectId(locdata.game_id);
    return Location.aggregate([
            { 
                $geoNear: {                    
                    near: locdata.location,
                    query: { game: newidg },
                    distanceField: "distance",
                } 
            },
            { $project: { _id: 0, distance: 1 } }
        ]).exec();
}

// mean computation among the distances
function computeMean(distances) {
    var sum = 0;
    for( var i = 0; i < distances.length; i++ ){
        sum += distances[i].distance; //don't forget to add the base
    }

    return sum / distances.length;
}
// --------------------------------------------------------------------

module.exports.createLocation = createLocation;
module.exports.createLocations = createLocations;
module.exports.getClusterList = getClusterList;
module.exports.getNrLocations = getNrLocations;
module.exports.getLocations = getLocations;
module.exports.getDistances = getDistances;
module.exports.computeMean = computeMean;
