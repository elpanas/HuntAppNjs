const express = require('express'),
  {
    createLocation,
    getLocations,
    getDistances,
    computeMean,
  } = require('../middleware/locatware'),
  { authHandler, makeUpload } = require('../functions/functions'),
  { generateQrPdf, generateQrHtml } = require('../middleware/pdfware2'),
  { createCluster } = require('../middleware/clusterware'),
  router = express.Router();
var upload = makeUpload('/data/locphoto');

// CREATE
router.post('/', upload.single('lphoto'), async (req, res) => {
  await authHandler(req);
  const distances = await getDistances(req.body),
    start = req.body.is_start == 'true',
    avgdist = parseInt(req.body.avg_distance);
  let is_mean = false;

  if (!start) {
    is_mean =
      distances.length == 1 && distances[0].distance >= avgdist
        ? true
        : computeMean(distances) >= avgdist;
  }

  if (start || is_mean) {
    const result = await createLocation(req.body);
    if (result._id) {
      if (req.body.new_cluster == 'true')
        createCluster(result.game, result.cluster);

      generateQrHtml(result);
      if (result.is_final) generateQrPdf(result.game);

      res.status(201).send();
    }
    res.status(400).send();
  }
  res.status(400).send();
});
// --------------------------------------------------------------------

// READ
// Generate and send the final pdf
router.get('/pdf/:idg', async (req, res) => {
  await authHandler(req);
  res.download(
    `${process.cwd()}/html2pdf/pdfs/${req.params.idg}-file.pdf`,
    `${req.params.idg}-file.pdf`,
    (err) => console.log(`Error: ${err}`)
  );
});

router.get('/game/:idg', async (req, res) => {
  await authHandler(req);
  const result = await getLocations(req.params.idg);
  result.length > 0 ? res.status(200).json(result) : res.status(400).send();
});

router.get('/:id', async (req, res) => {
  const result = await getLocation(req.params.id);
  result.length != 0 ? res.status(200).json(result) : res.status(404).send();
});
// --------------------------------------------------------------------

module.exports = router;
