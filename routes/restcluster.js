const express = require('express'),
  {
    addExtractedLoc,
    getClusterList,
    getClusterInfo,
  } = require('../middleware/clusterware'),
  { authHandler } = require('../functions/authHandler'),
  router = express.Router();

// READ
router.get('/:idg', async (req, res) => {
  await authHandler(req);
  const result = await getClusterList(req.params.idg);
  result.length > 0 ? res.status(200).json(result) : res.status(404).send();
});

router.get('/game/:idg/clt/:clt', async (req, res) => {
  await authHandler(req);
  const result = await getClusterInfo(req.params.idg, req.params.clt);
  result ? res.status(200).send(result) : res.status(400).send();
});
// --------------------------------------------------------------

// UPDATE
router.patch('/', (req, res) => {
  await authHandler(req);
  const result = await addExtractedLoc(req.body);
  result ? res.status(200).send() : res.status(400).send();
});
// --------------------------------------------------------------

module.exports = router;
