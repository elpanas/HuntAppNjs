const express = require('express'),
    { createSingleGame, createSteps } = require('../middleware/sgameware');
const router = express.Router();

// CREATE
router.post('/', (req, res) => {
    createSingleGame(req.body)
        .then((singleGame) => {
            createSteps(req.body.game, singleGame._id, req.body.riddle_cat)
                .then(() => res.status(200).send())
                .catch(() => res.status(400).send());
        })
        .catch(() => res.status(400).send());
});
// --------------------------------------------------------------------

module.exports = router;