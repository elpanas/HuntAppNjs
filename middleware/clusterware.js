const { Cluster } = require('../models/cluster'),
  { clearCache } = require('redis_mongoose'),
  config = require('../config/config'),
  {
    redis: { time },
  } = config;

// CREATE
async function createCluster(idg, cluster_nr) {
  const result = await Cluster.create({ game: idg, cluster: cluster_nr });
  clearCache();
  return result;
}
// --------------------------------------------------------------------

// GET
async function getClusterList(idg) {
  return await Cluster.find({ game: idg })
    .sort('cluster')
    .select('cluster')
    .lean()
    .cache({ ttl: time });
}

async function getClusterInfo(idg, clt) {
  return await Cluster.findOne({ game: idg, cluster: clt })
    .select('nr_extracted_loc')
    .lean()
    .cache({ ttl: time });
}
// --------------------------------------------------------------------

// UPDATE
async function addExtractedLoc(clt_data) {
  const result = await Cluster.findByIdAndUpdate(clt_data.idc, {
    nr_extracted_loc: clt_data.stepsnr,
  }).lean();
  clearCache();
  return result;
}
// --------------------------------------------------------------------

module.exports = {
  createCluster: createCluster,
  getClusterList: getClusterList,
  getClusterInfo: getClusterInfo,
  addExtractedLoc: addExtractedLoc,
};
