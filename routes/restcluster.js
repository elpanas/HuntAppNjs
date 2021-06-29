const express = require('express'),
  {
    addExtractedLoc,
    getClusterList,
    getClusterInfo,
  } = require('../middleware/clusterware'),
  { authHandler } = require('../functions/authHandler');
const router = express.Router();

router.get('/:idg', async (req, res) => {
  await authHandler(req);
  const result = await getClusterList(req.params.idg);
  result.length > 0 ? res.status(200).json(result) : res.status(404).send();
});

router.get('/game/:idg/clt/:clt', async (req, res) => {
  await authHandler(req);
  getClusterInfo(req.params.idg, req.params.clt)
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(400).send(err));
});
// --------------------------------------------------------------

router.put('/', (req, res) => {
  await authHandler(req);
  addExtractedLoc(req.body)
    .then(() => res.status(200).send())
    .catch((err) => res.status(400).send(err));
});
// --------------------------------------------------------------

module.exports = router;
