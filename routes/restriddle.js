const express = require('express'),
  { createRiddle, generateRiddle } = require('../middleware/riddleware'),
  { authHandler } = require('../functions/authHandler'),
  multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${process.cwd()}/src/riddles`);
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

router.post('/', upload.single('rphoto'), async (req, res) => {
  await authHandler(req);
  createRiddle(req.body)
    .then(() => res.status(201).send())
    .catch((err) => res.status(400).send(err));
});

// CREATE
router.post('/', async (req, res) => {
  await authHandler(req);
  const result = await createRiddle(req.body);
  result ? res.status(200).send() : res.status(400).send();
});
// --------------------------------------------------------------------

// READ
router.get('/:id', (req, res) => {
  const result = (await = generateRiddle(req.params.id));
  result.length != 0 ? res.status(200).json(result) : res.status(404).send();
});
// --------------------------------------------------------------------

module.exports = router;
