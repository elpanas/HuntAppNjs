const express = require('express'),
    { createUser, checkLogin, makeLogin, makeLogout } = require('../middleware/userware');
const router = express.Router();

// CREATE
router.post('/', (req, res) => {
    createUser(req.body)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).send(err))
});
// --------------------------------------------------------------------


// READ
// login
router.get('/chklogin', (req, res) => {
    checkLogin(req.headers.authorization)
        .then(result => {
            (result)
                ? res.status(200).send()
                : res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
        })
        .catch(err => res.status(404).send(err))
});
// --------------------------------------------------------------------

router.put('/login', (req, res) => {
    makeLogin(req.headers.authorization)
        .then(result => {            
            (!result)
                ? res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
                : res.status(200).send(result.is_admin);
        })
        .catch(err => res.status(404).send(err))
});

router.put('/logout', (req, res) => {
    makeLogout(req.headers.authorization)
        .then(result => {            
            (!result)
                ? res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
                : res.status(200).send();
        })
        .catch(err => res.status(404).send(err))
});

module.exports = router;