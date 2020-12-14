const express = require('express'),
    { createLocations,
        createLocation,
        getCluster,
        getClusterList,
    getNrLocations,
    checkStartFinal,
    getLocations } = require('../middleware/locatware'),
    { checkUser } = require('../middleware/userware'),
    { getGameEvent } = require('../middleware/gameware'),
    { generateQrPdf } = require('../middleware/pdfware');
const router = express.Router();

// CREATE
/*
router.post('/', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if(idu)                
                createLocations(req.body)
                    .then((result) => { if (result) res.status(200).send(); else res.status(400).send(); })
                    .catch(() => res.sendStatus(400)); 
            else
            res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
    })
    .catch(err => res.status(400).send(err))
});
*/

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
                                    .then((result) => { 
                                        if (result._id) {
                                            if (result.is_final) { generatePdf(req.body.game_id) }      

                                            res.status(200).send(); 
                                        }
                                        else res.status(400).send();
                                    })
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
//Get clusters for this game
router.get('/clusters/:idg', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if(idu)
                getClusterList(req.params.idg)
                    .then(result => {
                        if (result.length > 0)
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

// Generate and send the final pdf
router.get('/pdf/:idg', (req, res) => {  
    checkUser(req.headers.authorization)
        .then(idu => {            
            if (idu)     
            generateQrPdf(req.params.idg).then(() => res.status(200).send());
                //res.download(process.cwd() + '/html2pdf/pdfs/' + req.params.idg + '/test.pdf', 'test.pdf', err => console.log(err));
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send();
        })
        .catch(err => res.status(400).send(err));
});


router.get('/game/:idg', (req, res) => {
    checkUser(req.headers.authorization)
        .then(idu => {
            if(idu) 
                getLocations(req.params.idg)
                    .then((result) => { (result.length > 0) ? res.status(200).json(result) : res.status(400).send()})
                    .catch(() => res.statusCode(400))            
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
    })
    .catch(err => res.status(400).send(err))
});



// check if there are start and final locations
/*router.get('/locsf/:idg', (req, res) => {
    checkStartFinal(req.params.idg)
        .then((result) => {
            if (result.length != 0)
                res.status(200).json(result);
            else
                res.status(404).send('Location was not found');
            
        })
        .catch((error) => res.status(404).send(error))
});*/

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