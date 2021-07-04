const { Location } = require('../models/location'),
  mongoose = require('mongoose'),
  { clearCache } = require('redis_mongoose'),
  config = require('../config/config'),
  {
    redis: { time },
  } = config;

// CREATE
async function createLocations(locs_data) {
  return await Location.insertMany(locs_data);
}

async function createLocation(loc_data) {
  const locobj = {
      type: 'Point',
      coordinates: [
        parseFloat(loc_data.latitude),
        parseFloat(loc_data.longitude),
      ],
    },
    imagepath = loc_data.image == '' ? '' : `data/locphoto/${loc_data.image}`,
    isStart = loc_data.is_start == 'true',
    isFinal = loc_data.is_final == 'true',
    intCluster = parseInt(loc_data.cluster);

  const result = await Location.create({
    game: loc_data.game_id,
    name: loc_data.name,
    cluster: intCluster,
    location: locobj,
    description: loc_data.description,
    image_path: imagepath,
    hint: loc_data.hint,
    is_start: isStart,
    is_final: isFinal,
  });
  clearCache();
  return result;
}
// --------------------------------------------------------------------

// GET
// get locations nr
async function getNrLocations(idg) {
  return await Location.estimatedDocumentCount({ game: idg }).cache({
    ttl: time,
  });
}

// get all locations of a game
async function getLocations(idg) {
  return await Location.find({ game: idg })
    .sort('cluster')
    .lean()
    .cache({ ttl: time });
}

// get all distances between the new place and the others
async function getDistances(locdata) {
  const newidg = mongoose.Types.ObjectId(locdata.game_id),
    lat = parseFloat(locdata.latitude),
    long = parseFloat(locdata.longitude);

  return await Location.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lat, long] },
        query: { game: newidg },
        distanceField: 'distance',
        key: 'location',
      },
    },
    { $project: { _id: 0, distance: 1 } },
  ])
    .exec()
    .cache({ ttl: time });
}

// mean computation among the distances
function computeMean(distances) {
  const sum = distances.reduce((a, b) => a + b);
  return sum / distances.length;
}
// --------------------------------------------------------------------

module.exports = {
  createLocation: createLocation,
  createLocations: createLocations,
  getNrLocations: getNrLocations,
  getLocations: getLocations,
  getDistances: getDistances,
  computeMean: computeMean,
};
