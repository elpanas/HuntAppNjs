const express = require('express'),
    { createRiddles } = require('../middleware/riddleware');

const router = express.Router();

const riddledata = require('./riddledata.json');

router.get('/', (req, res) => {
    createRiddles(riddledata)
        .then(() => res.status(200).send());
});

module.exports = router;