const express = require('express'),
  {
    createSingleGame,
    createSteps,
    checkGroup,
    setCompleted,
    checkMultipleGame,
    getFinishedList,
  } = require('../middleware/sgameware'),
  { authHandler } = require('../functions/authHandler'),
  { generateCertPdf } = require('../middleware/pdfware');
const router = express.Router();

// ----- CREATE -----
router.post('/', async (req, res) => {
  const idu = await authHandler(req);
  const singleGame = await createSingleGame(req.body, idu);
  createSteps(req.body.game_id, singleGame._id, req.body.riddle_cat)
    .then(() => res.status(201).send())
    .catch((err) => res.status(400).send(err));
});
// --------------------------------------------------------------------

// ----- GET -----
router.get('/game/:idg', async (req, res) => {
  const idu = await authHandler(req);
  const idsg = checkGroup(req.params.idg, idu);
  idsg ? res.status(200).json(idsg) : res.status(400).send();
});

router.get('/multiple/:idg', async (req, res) => {
  const idu = await authHandler(req);
  const result = await checkMultipleGame(req.params.idg, idu);
  if (result == null) res.status(200).send();
  else if (result.game.is_open) res.status(200).send();
  else res.status(404).send();
});

// Generate and send the final pdf
router.get('/pdf/:idsg', async (req, res) => {
  await authHandler(req);
  res.download(
    `${process.cwd()}/html2pdf/pdfs/${req.params.idsg}-cert.pdf`,
    `${req.params.idsg}-cert.pdf`,
    (err) => console.log(`Error: ${err}`)
  );
});

router.get('/terminated', async (req, res) => {
  const idu = await authHandler(req);
  const result = await getFinishedList(idu);
  result.length > 0 ? res.status(200).json(result) : res.status(400).send();
});
// --------------------------------------------------------------------

router.put('/completed', async (req, res) => {
  // richiamo questa funzione se non c'è un id-action memorizzato in locale
  await authHandler(req);
  setCompleted(req.body.idsg)
    .then(() => {
      generateCertPdf(req.body.idsg)
        .then(() => res.status(200).send())
        .catch((err) => res.status(400).send(err));
    })
    .catch((err) => res.status(400).send(err));
});
module.exports = router;
