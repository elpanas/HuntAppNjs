const express = require('express'),
  { createRiddle, generateRiddle } = require('../middleware/riddleware'),
  { authHandler, makeUpload } = require('../functions/functions'),
  { makeUpload } = require('../functions/functions'),
const router = express.Router();
var upload = makeUpload('/src/riddles');

router.post('/', upload.single('rphoto'), async (req, res) => {
  await authHandler(req);
  const result = await createRiddle(req.body);
  result ? res.status(201).send() : res.status(400).send();
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
