const mongoose = require('mongoose'); // MongoDB framework
const Schema = mongoose.Schema;

const clusterSchema = Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: 'game',
  },
  cluster: { type: Number, default: 1 },
  nr_extracted_loc: { type: Number, default: 1 },
}).index({ game: 1, cluster: 1 }, { unique: true });

const Cluster = mongoose.model('cluster', clusterSchema);

exports.Cluster = Cluster;
