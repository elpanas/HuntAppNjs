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
  { authHandler, makeUpload } = require('../functions/functions');
const router = express.Router();
var upload = makeUpload('/data/gamephoto');

// CREATE
// Upload photo
router.post('/gphoto', upload.single('selfie'), async (req, res) => {
  await authHandler(req);
  const result = await setPhoto(req.body.ida, req.body.img);
  result ? res.status(201).send() : res.status(400).send();
});
// --------------------------------------------------------------------

// READ
// get the location info
router.get('/sgame/:idsg', async (req, res) => {
  await authHandler(req);
  const result = await getActionLoc(req.params.idsg); // recupera l'ultimo step
  result ? res.status(200).json(result) : res.status(400).send();
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
  const result = await getImages(req.params.idsg);
  result ? res.status(200).json(imageslist) : res.status(400).send();
});
// --------------------------------------------------------------------

// UPDATE
// qrcode checked when a location is reached
router.patch('/reached/:ida', async (req, res) => {
  await authHandler(req);
  const result = await setReached(req.params.ida); // after qrcode scan
  result ? res.status(200).send() : res.status(400).send(err);
});

// when a riddle is solved
router.patch('/solution', async (req, res) => {
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
