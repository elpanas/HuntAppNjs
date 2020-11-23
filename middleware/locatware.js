const { Location } = require('../models/schemas');

// CREATE GAME
async function createLocations(locs_data) {
    await Location.insertMany(locs_data);
}
// --------------------------------------------------------------------


// GET NUMBER OF THE CLUSTER
function getNrClusterLoc(idg) {
    return Location.findOne({ game: idg }).select('cluster').sort('-cluster');
}
// --------------------------------------------------------------------


// GET LOCATION
async function getLocation(id) {
    return await Location.findById(id);
}
// --------------------------------------------------------------------


// UPDATE LOCATION
async function updateLocation(idl, loc_data) {

    return loc = await Location.update({ _id: idl }, {
        $set: {
            location: {
                type: 'Point',
                coordinates: [loc_data.longitude, loc_data.latitude]
            },
            image_path: loc_data.image,
            is_start: loc_data.is_start,
            is_end: loc_data.is_end
        }
    }, { new: true });
}
// --------------------------------------------------------------------


// REMOVE LOCATION
async function removeLocation(id) {
    return result = await Location.findByIdAndDelete(id);
}
// --------------------------------------------------------------------

//module.exports.createLocation = createLocation;
module.exports.createLocations = createLocations;
module.exports.getNrClusterLoc = getNrClusterLoc;
module.exports.getLocation = getLocation;
module.exports.updateLocation = updateLocation;
module.exports.removeLocation = removeLocation;