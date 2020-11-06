const { Cluster } = require('../models/schemas');

// CREATE CLUSTER
async function createCluster(game_data) {

    const cluster = new Cluster({
        game: game_data.id
    });

    const result = await cluster.save();

    if (result)
        return result._id;
    else
        return false;
}
// --------------------------------------------------------------------


// GET CLUSTER
async function getCluster(id) {
    return await Cluster.findById(id);
}
// --------------------------------------------------------------------


// UPDATE CLUSTER
async function updateCluster(idc, cluster_data) {

    return cluster = await Cluster.update({ _id: idc }, {
        $set: {
            name: cluster_data.name
        }
    }, { new: true });
}
// --------------------------------------------------------------------


// REMOVE CLUSTER
async function removeCluster(id) {
    return result = await Cluster.findByIdAndDelete(id);
}
// --------------------------------------------------------------------

module.exports.createCluster = createCluster;
module.exports.getCluster = getCluster;
module.exports.updateCluster = updateCluster;
module.exports.removeCluster = removeCluster;