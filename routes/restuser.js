const express = require('express'),
    { createUser, checkLogin } = require('../middleware/userware');
const router = express.Router();

// CREATE
router.post('/', (req, res) => {
    createUser(req.body)
        .then(result => res.status(200).json(result))
        .catch(() => res.status(400).send())
});
// --------------------------------------------------------------------


// READ
// login
router.get('/login', (req, res) => {
    checkLogin(req.headers.authorization)
        .then(result => {            
            (!result)
                ? res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
                : res.status(200).send(result.is_admin);
        })
        .catch(err => res.status(404).send(err))
});
// --------------------------------------------------------------------

module.exports = router;