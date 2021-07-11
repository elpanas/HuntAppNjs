const mongoose = require('mongoose'), // MongoDB framework
  Schema = mongoose.Schema,
  numberOpts = {
    type: Number,
    default: 1,
  };

const clusterSchema = Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: 'game',
  },
  cluster: numberOpts,
  nr_extracted_loc: numberOpts,
}).index({ game: 1, cluster: 1 }, { unique: true });

const Cluster = mongoose.model('cluster', clusterSchema);

module.exports.Cluster = Cluster;
