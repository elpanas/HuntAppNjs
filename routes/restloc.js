const express = require('express'),
  {
    createLocations,
    createLocation,
    getLocations,
    getDistances,
    computeMean,
  } = require('../middleware/locatware'),
  { authHandler } = require('../functions/authHandler'),
  { generateQrPdf, generateQrHtml } = require('../middleware/pdfware2'),
  { createCluster } = require('../middleware/clusterware'),
  multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, process.cwd() + '/data/locphoto');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  imgFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png')
      cb(null, true);
    else cb(null, false);
  };

var upload = multer({ storage: storage, fileFilter: imgFilter });

// CREATE
/*
router.post('/', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if(idu)                
                createLocations(req.body)
                    .then((result) => { if (result) res.status(200).send(); else res.status(400).send(); })
                    .catch(() => res.sendStatus(400)); 
            else
            res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
    })
    .catch(err => res.status(400).send(err))
});
*/

// CREATE
router.post('/', upload.single('lphoto'), async (req, res) => {
  await authHandler(req);
  const distances = await getDistances(req.body);
  var is_mean = false;
  const start = req.body.is_start == 'true',
    avgdist = parseInt(req.body.avg_distance);

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
      res.status(200).send();
    } else res.status(400).send();
  } else res.status(400).send();
});
// --------------------------------------------------------------------

// READ
// Generate and send the final pdf
router.get('/pdf/:idg', async (req, res) => {
  await authHandler(req);
  // generateQrPdf(req.params.idg);  // just for testing
  res.download(
    `${process.cwd()}/html2pdf/pdfs/${req.params.idg}-file.pdf`,
    `${req.params.idg}-file.pdf`,
    (err) => console.log('Error: ' + err)
  );
});

router.get('/game/:idg', async (req, res) => {
  await authHandler(req);
  const result = await getLocations(req.params.idg);
  result.length > 0 ? res.status(200).json(result) : res.status(400).send();
});

router.get('/:id', async (req, res) => {
  const result = await getLocation(req.params.id);
  result.length != 0
    ? res.status(200).json(result)
    : res.status(404).send('Location was not found');
});
// --------------------------------------------------------------------

module.exports = router;
