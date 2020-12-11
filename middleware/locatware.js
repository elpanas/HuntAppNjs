const { Location } = require('../models/schemas');
const mongoose = require('mongoose');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// CREATE 
async function createLocations(locs_data) {
    await Location.insertMany(locs_data);
}

async function createLocation(loc_data) {

    const loc = new Location({
        game: loc_data.game_id,
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


// GET
/* get locations of a cluster
function getCluster(idg, cluster_nr) {
    return Location.find({ game: idg, cluster: cluster_nr }).sort('cluster');
}*/

function checkStartFinal(idg) {
    newidg = mongoose.Types.ObjectId(idg);
    return Location.find({ game: newidg, $or: [{is_start: true}, {is_final: true}] })
        .select('is_start is_final');
}

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

function getLocations(idg) {
    // newidg = mongoose.Types.ObjectId(idg);
    return Location.find({ game: idg }).sort('cluster');
}

function checkDistance(event_dist, locdata) {    
    const distanceAVG = Location.aggregate([
            { $match: { game: locdata.game_id } },
            { $geoNear: {
                near: locdata.location,
                distanceField: "distance"
                } 
            },
            { $project: { distAvg: { $avg: '$distance' } } }
        ]);
    
    if (distanceAVG.distAvg >= event_dist)
        return true;
    else
        return false;
}
// --------------------------------------------------------------------



module.exports.createLocation = createLocation;
module.exports.createLocations = createLocations;
//module.exports.getCluster = getCluster;
module.exports.getClusterList = getClusterList;
module.exports.checkStartFinal = checkStartFinal;
module.exports.getNrLocations = getNrLocations;
module.exports.getLocations = getLocations;
module.exports.checkDistance = checkDistance;
