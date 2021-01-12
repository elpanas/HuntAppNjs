const { Cluster } = require('../models/schemas');

// CREATE
async function createCluster(idg, cluster_nr) {
    return await Cluster.create({ game: idg, cluster: cluster_nr});
}
// --------------------------------------------------------------------

// GET
function getClusterList(idg) {
    return Cluster.find({ game: idg }).sort('cluster').select('cluster').lean();
}

function getClusterInfo(idg, clt) {
    return Cluster.findOne({ game: idg, cluster: clt }).select('nr_extracted_loc').lean();
}
// --------------------------------------------------------------------

// UPDATE
async function addExtractedLoc(clt_data) {
    return await Cluster.findByIdAndUpdate(clt_data.idc, { nr_extracted_loc: clt_data.stepsnr }).lean();
}
// --------------------------------------------------------------------

module.exports.createCluster = createCluster;
module.exports.getClusterList = getClusterList;
module.exports.getClusterInfo = getClusterInfo;
module.exports.addExtractedLoc = addExtractedLoc;