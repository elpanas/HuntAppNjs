const express = require('express'),
  { getLocations, locationPhotoHandler } = require('../middleware/locatware'),
  { authHandler, makeUpload } = require('../functions/functions'),
  router = express.Router();
var upload = makeUpload('/data/locphoto');

// CREATE
router.post('/', upload.single('lphoto'), async (req, res) => {
  await authHandler(req);
  const result = await locationPhotoHandler(req.body);
  result ? res.status(201).send() : res.status(400).send();
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
