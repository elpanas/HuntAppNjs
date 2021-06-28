const express = require('express'),
  {
    getActionLoc,
    setReached,
    getRiddleFromAction,
    getImages,
    setSolved,
    setPhoto,
  } = require('../middleware/actionware'),
  { generateRiddle, checkRiddle } = require('../middleware/riddleware'),
  { authHandler } = require('../functions/authHandler'),
  multer = require('multer');

// storage infos
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './data/gamephoto'),
    filename: (req, file, cb) => {
      var ext = file.originalname.split('.');
      cb(null, file.fieldname + req.body.ida + '.' + ext[1]);
    },
  }),
  imgFilter = (req, file, cb) => {
    file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'
      ? cb(null, true)
      : cb(null, false);
  },
  router = express.Router();
var upload = multer({ storage: storage, fileFilter: imgFilter });

// POST
// Upload photo
router.post('/gphoto', upload.single('selfie'), async (req, res) => {
  await authHandler(req);
  setPhoto(req.body.ida, req.body.img)
    .then(() => res.status(200).send())
    .catch((err) => res.status(400).send());
});
// --------------------------------------------------------------------

// GET
// get the location info
router.get('/sgame/:idsg', async (req, res) => {
  await authHandler(req);
  getActionLoc(req.params.idsg) // recupera l'ultimo step
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err));
});

// get riddle
router.get('/riddle/:ida/:locale', async (req, res) => {
  await authHandler(req);
  const result = await getRiddleFromAction(req.params.ida); // get the riddle id from the action record
  result
    ? generateRiddle(result.riddle, req.params.locale, (riddledata) =>
        res.status(200).json(riddledata)
      )
    : res.status(400).send();
});

// returns selfie paths list of a singlegame
router.get('/selfies/:idsg', async (req, res) => {
  await authHandler(req);
  getImages(req.params.idsg)
    .then((imageslist) => res.status(200).json(imageslist))
    .catch((err) => res.status(400).send(err));
});
// --------------------------------------------------------------------

// PUT
// qrcode checked when a location is reached
router.put('/reached/:ida', async (req, res) => {
  await authHandler(req);
  setReached(req.params.ida) // after qrcode scan
    .then(() => res.status(200).send())
    .catch((err) => res.status(400).send(err));
});

// when a riddle is solved
router.put('/solution', async (req, res) => {
  await authHandler(req);
  const solok = await checkRiddle(req.body);
  solok
    ? setSolved(req.body.ida)
        .then(() => res.status(200).send())
        .catch((err) => res.status(400).send(err))
    : res.status(400).send();
});
// --------------------------------------------------------------------

module.exports = router;
