const express = require('express'),
    { createCluster,
    getCluster,
    updateCluster,
    removeCluster } = require('../middleware/clusterware'),
    { checkUser } = require('../middleware/userware');
const router = express.Router();

// CREATE
router.post('/', (req, res) => {
    createCluster(req.body)
        .then((result) => { if (result) res.status(200).send(result); else res.status(400).send(); })
        .catch(() => { res.status(400).send() })
});
// --------------------------------------------------------------------


// READ
router.get('/:id', (req, res) => {
    getCluster(req.params.id)
        .then((result) => {
            if (result.length != 0)
                res.status(200).json(result);
            else
                res.status(404).send('User was not found');
        })
        .catch((error) => { res.status(404).send(error) })
});
// --------------------------------------------------------------------


// UPDATE
router.put('/:id', (req, res) => {
    checkUser(req.get('Authorization'))
        .then((result) => {
            if (result) {
                updateCluster(req.params.id, req.body)
                    .then(() => { res.status(200).send() })
                    .catch(() => { res.status(404).send('User was not found') })
            }
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send();
        })
        .catch(() => { res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send() })
});
// --------------------------------------------------------------------


// DELETE
router.delete('/:id', (req, res) => {
    checkUser(req.get('Authorization'))
        .then((result) => {
            if (result) {
                removeCluster(req.params.id)
                    .then(() => { res.status(200).send() })
                    .catch((error) => { res.status(404).send(error) })
            }
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send();
        })
        .catch(() => { res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send() });
});
// --------------------------------------------------------------------

module.exports = router;