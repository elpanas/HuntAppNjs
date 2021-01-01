const { Cluster } = require('../models/schemas');

// CREATE
async function createCluster(idg) {

    const cluster = new Cluster({ game: idg });

    return await cluster.save();
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