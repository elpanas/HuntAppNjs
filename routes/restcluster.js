const express = require('express'),
    { addExtractedLoc,
        getClusterList,
        getClusterInfo } = require('../middleware/clusterware'),
    { checkUser } = require('../middleware/userware');
const router = express.Router();

router.get('/:idg', (req, res) => {
    checkUser(req.headers.authorization)
        .then(idu => {
            if(idu)
                getClusterList(req.params.idg)
                    .then(result => { 
                        (result.length > 0)
                            ? res.status(200).json(result)
                            : res.status(404).send('Clusters was not found');
                    })
                    .catch(err => res.status(404).send(err))
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
        })
        .catch(err => res.status(400).send(err))
});

router.get('/game/:idg/clt/:clt', (req, res) => {
    checkUser(req.headers.authorization)
        .then(idu => {      
            if (idu)
                getClusterInfo(req.params.idg, req.params.clt)
                    .then(result => res.status(200).send(result))
                    .catch(err => res.status(400).send(err))
        })
        .catch(err => res.status(400).send(err))
});
// --------------------------------------------------------------

router.put('/', (req, res) => {
    checkUser(req.headers.authorization)
        .then(idu => {      
            if (idu)
                addExtractedLoc(req.body)
                    .then(() => res.status(200).send())
                    .catch(err => res.status(400).send(err))
        })
        .catch(err => res.status(400).send(err))
});
// --------------------------------------------------------------

module.exports = router;