const express = require('express'),
    { createRiddle,
    generateRiddle  } = require('../middleware/riddleware'),
    { checkUser } = require('../middleware/userware');
const router = express.Router();

// CREATE
router.post('/', (req, res) => {
    createRiddle(req.body)
        .then((result) => { if (result) res.status(200).send(result); else res.status(400).send(); })
        .catch(() => { res.status(400).send() })
});
// --------------------------------------------------------------------


// READ
router.get('/:id', (req, res) => {
    generateRiddle(req.params.id)
        .then((result) => {
            if (result.length != 0)
                res.status(200).json(result);
            else
                res.status(404).send('Riddle was not found');
        })
        .catch((error) => { res.status(404).send(error) })
});
// --------------------------------------------------------------------


module.exports = router;