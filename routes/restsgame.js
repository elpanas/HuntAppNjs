const express = require('express'),
  {
    createSingleGame,
    createSteps,
    checkGroup,
    setCompleted,
    checkMultipleGame,
    getFinishedList,
  } = require('../middleware/sgameware'),
  { authHandler } = require('../functions/functions'),
  { generateCertPdf } = require('../middleware/pdfware'),
  router = express.Router();

// ----- CREATE -----
router.post('/', async (req, res) => {
  const idu = await authHandler(req),
    singleGame = await createSingleGame(req.body, idu);
  createSteps(req.body.game_id, singleGame._id, req.body.riddle_cat)
    .then(() => res.status(201).send())
    .catch((err) => res.status(400).send(err));
});
// --------------------------------------------------------------------

// ----- GET -----
router.get('/game/:idg', async (req, res) => {
  const idu = await authHandler(req),
    idsg = checkGroup(req.params.idg, idu);
  idsg ? res.status(200).json(idsg) : res.status(400).send();
});

router.get('/multiple/:idg', async (req, res) => {
  const idu = await authHandler(req),
    result = await checkMultipleGame(req.params.idg, idu);
  result ? res.status(200).send() : res.status(404).send();
});

router.get('/pdf/:idsg', async (req, res) => {
  await authHandler(req);
  res.download(
    `${process.cwd()}/html2pdf/pdfs/${req.params.idsg}-cert.pdf`,
    `${req.params.idsg}-cert.pdf`,
    (err) => console.log(`Error: ${err}`)
  );
});

router.get('/terminated', async (req, res) => {
  const idu = await authHandler(req),
    result = await getFinishedList(idu);
  result.length > 0 ? res.status(200).json(result) : res.status(400).send();
});
// --------------------------------------------------------------------

// UPDATE
router.patch('/completed', async (req, res) => {
  await authHandler(req);
  const isOk = await setCompleted(req.body.idsg);
  isOk
    ? generateCertPdf(req.body.idsg)
        .then(() => res.status(200).send())
        .catch((err) => res.status(400).send(err))
    : res.status(400).send(err);
});
// --------------------------------------------------------------------
module.exports = router;
