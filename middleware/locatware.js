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

    return await loc.save();
}
// --------------------------------------------------------------------

// GET
// get locations nr
function getNrLocations(idg) {
    return Location.estimatedDocumentCount({ game: idg });
}

// get all locations of a game
function getLocations(idg) {
    return Location.find({ game: idg }).sort('cluster').lean();
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
module.exports.getNrLocations = getNrLocations;
module.exports.getLocations = getLocations;
module.exports.getDistances = getDistances;
module.exports.computeMean = computeMean;
