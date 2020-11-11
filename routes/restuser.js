const express = require('express');
const { createUser,
    getUser,
    updateUser,
    removeUser,
    checkUser } = require('../middleware/userware');
const router = express.Router();

// CREATE
router.post('/', (req, res) => {
    createUser(req.body)
        .then((result) => res.status(200).send(result))
        .catch(() => res.status(400).send())
});
// --------------------------------------------------------------------


// READ
//single user
router.get('/:id', (req, res) => {
    getUser(req.params.id)
        .then((result) => {
            if (result.length > 0)
                res.status(200).json(result);
            else
                res.status(404).send('User was not found');
        })
        .catch(() => res.status(404).send('User was not found'))
});

// login
router.get('/login', (req, res) => {
    checkUser(req.get('Authorization'))
        .then((result) => {
            if (!result)
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Area Riservata"').send();
            else
                res.status(200).json("id", result);
        })
        .catch(() => res.status(404).send('Error'))
});
// --------------------------------------------------------------------


// UPDATE
router.put('/:id', (req, res) => {
    checkUser(req.get('Authorization'))
        .then((result) => {
            if (result) {
                updateUser(req.params.id, req.body)
                    .then(() => res.status(200).send())
                    .catch(() => res.status(404).send('The user with the given id was not found'))
            }
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Area Riservata"').send();
        })
        .catch(() => res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Area Riservata"').send())
});
// --------------------------------------------------------------------


// DELETE
router.delete('/:id', (req, res) => {
    checkUser(req.get('Authorization'))
        .then((result) => {
            if (result) {
                removeUser(req.params.id)
                    .then(() => res.status(200).send())
                    .catch(() => res.status(404).send('The user with the given id was not found'))
            }
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Area Riservata"').send();
        })
        .catch(() => res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Area Riservata"').send());
});
// --------------------------------------------------------------------

module.exports = router;