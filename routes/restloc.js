const express = require('express'),
    { createLocations,
        createLocation,
        getCluster,
        getClusterList,
        getNrClusters,
    getNrLocations,
    checkStartFinal,
    getAllLocations,
    createImg,
    createPdf} = require('../middleware/locatware'),
    { checkUser } = require('../middleware/userware'),
    { getGameEvent } = require('../middleware/gameware');
const router = express.Router();

// CREATE
router.post('/', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if(idu)                
                createLocations(req.body)
                    .then((result) => { if (result) res.status(200).send(); else res.status(400).send(); })
                    .catch(() => res.status(400).send()); 
            else
            res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
    })
    .catch(err => res.status(400).send(err))
});


router.post('/', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if(idu)                
                getGameEvent(req.body)
                .then((event) => {
                    checkDistance(event.min_avg_distance, req.body)
                        .then((distok) => {
                            if (distok)
                                createLocation(req.body)
                                    .then((result) => { if (result) res.status(200).send(); else res.status(400).send(); })
                                    .catch(err => res.status(400).send(err));
                                // add createImg
                        });                    
                });
            else
            res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
    })
    .catch(err => res.status(400).send(err))
});
// --------------------------------------------------------------------


// READ
// Get clusters for this game
router.get('/game/:idg', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if(idu)
                getClusterList(req.params.idg)
                    .then((result) => {
                        if (result.length != 0)
                            res.status(200).json(result);
                        else
                            res.status(404).send('Location was not found');
                    })
                    .catch(err => res.status(404).send(err))
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
        })
        .catch(err => res.status(400).send(err))
});

router.get('/pdf/:idg', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if (idu) {  
                createPdf(req.params.idg)
                    .then(() => res.status(200).send())
                    .catch(err => res.status(400).send(err))                    
            }           
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Area Riservata"').send();
        })
        .catch((err) => res.status(400).send(err));
});

router.get('/all/:idg', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if(idu)
                getAllLocations(req.params.idg)
                    .then((result) => {
                        if (result.length != 0)
                            res.status(200).json(result);
                        else
                            res.status(404).send('Location was not found');
                    })
                    .catch(err => res.status(404).send(err))
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
        })
        .catch(err => res.status(400).send(err))
});

// get locations for this cluster in this game
router.get('/game/:idg/cluster/:cnr', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if(idu)
                getCluster(req.params.idg, req.params.cnr)
                    .then((result) => {
                        if (result.length != 0)
                            res.status(200).json(result);
                        else
                            res.status(404).send('Location was not found');
                    })
                    .catch(err => res.status(404).send(err))
            else
            res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
    })
    .catch(err => res.status(400).send(err))
});

// check if the max has been reached
router.get('/checklocnr/:idg', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if(idu)
                getNrLocations(req.params.idg)
                    .then((loc_nr) => {
                        if (loc_nr == 0)
                            res.status(200).send();
                        else {
                            getGameEvent(req.params.idg)
                                .then((game) => {
                                if (loc_nr >= game.event.min_locations && loc_nr <= game.event.max_locations)
                                    res.status(210).send();
                                else if (loc_nr < game.event.max_locations) 
                                    res.status(220).send();   
                                else 
                                    res.status(230).send();             
                            })
                        }
                    })
                    .catch(err => res.status(404).send(err))
            else
            res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
    })
    .catch(err => res.status(400).send(err))
});

// check if there are start and final locations
router.get('/locsf/:idg', (req, res) => {
    checkStartFinal(req.params.idg)
        .then((result) => {
            if (result.length != 0)
                res.status(200).json(result);
            else
                res.status(404).send('Location was not found');
            
        })
        .catch((error) => res.status(404).send(error))
});

router.get('/:id', (req, res) => {
    getLocation(req.params.id)
        .then((result) => {
            if (result.length != 0)
                res.status(200).json(result);
            else
                res.status(404).send('Location was not found');
        })
        .catch((error) => { res.status(404).send(error) })
});
// --------------------------------------------------------------------


module.exports = router;