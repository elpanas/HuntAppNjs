const express = require('express'),
  {
    createGame,
    getAllGames,
    activateGame,
    setQrCode,
  } = require('../middleware/gameware'),
  { authHandler } = require('../functions/functions');
const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  await authHandler(req);
  const result = await createGame(req.body);
  result ? res.status(201).send() : res.status(400).send();
});
// --------------------------------------------------------------------

// READ
router.get('/event/:ide', async (req, res) => {
  await authHandler(req);
  const result = await getAllGames(req.params.ide);
  result.length > 0 ? res.status(200).json(result) : res.status(404).send();
});

router.get('/activate/:idg', async (req, res) => {
  await authHandler(req);
  const result = getGame(req.params.idg);
  result ? res.status(200).send(result) : res.status(400).send();
});
// --------------------------------------------------------------------

// UPDATE
router.patch('/qrc', async (req, res) => {
  await authHandler(req);
  const result = await setQrCode(req.body.idg);
  result.length != 0 ? res.status(200).send() : res.status(404).send();
});

router.patch('/activate/:idg', async (req, res) => {
  await authHandler(req);
  const result = activateGame(req.params.idg);
  result ? res.status(200).send() : res.status(400).send();
});
// --------------------------------------------------------------------

module.exports = router;
