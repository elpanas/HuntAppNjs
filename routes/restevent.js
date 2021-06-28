const express = require('express'),
  {
    createEvent,
    getAllEvents,
    checkEvent,
  } = require('../middleware/eventware'),
  { authHandler } = require('../functions/authHandler');
const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  const idu = await authHandler(req);
  const eventexist = await checkEvent(req.body.name);
  !eventexist
    ? createEvent(req.body, idu)
        .then(() => res.status(201).send())
        .catch((err) => res.status(400).send(err))
    : res.status(400).send('Error: name already exists');
});
// --------------------------------------------------------------------

// READ
router.get('/lat/:lat/long/:long', async (req, res) => {
  await authHandler(req);
  const result = await getAllEvents(req.params.lat, req.params.long);
  result.length > 0
    ? res.status(200).json(result)
    : res.status(404).send('Events not found');
});
// --------------------------------------------------------------------

module.exports = router;
