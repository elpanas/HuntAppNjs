const express = require('express'),
    { createLocations,
        createLocation,
    getLocations, 
    getDistances,
    computeMean} = require('../middleware/locatware'),
    { checkUser } = require('../middleware/userware'),
    { generateQrPdf } = require('../middleware/pdfware'),
    { createCluster } = require('../middleware/clusterware');
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
        .then(idu => {
            if(idu)                         
                getDistances(req.body).then(distances => {
                    var is_mean = false;
  
                    if (!req.body.is_start) {
                        is_mean = (distances.length == 1 && distances[0].distance >= req.body.avg_distance )
                            ? true
                            : (computeMean(distances) >= req.body.avg_distance);
                    }   

                    if (req.body.is_start || is_mean)                        
                        createLocation(req.body)
                            .then(result => { 
                                if (result._id) {
                                    if (result.cluster == 1) createCluster(result.game);
                                    if (result.is_final) { generateQrPdf(result.game) }  
                                    res.status(200).send(); 
                                }
                                else res.status(400).send();
                            })
                            .catch(err => res.status(400).send(err));
                    else
                        res.status(400).send();
                })            
            else
            res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
    });
});
// --------------------------------------------------------------------


// READ
// Generate and send the final pdf
router.get('/pdf/:idg', (req, res) => {  
    checkUser(req.headers.authorization)
        .then(idu => {            
            if (idu)     
                res.download(process.cwd() + '/html2pdf/pdfs/' + req.params.idg + '-file.pdf',
                            req.params.idg + '-file.pdf',
                            err => console.log('Error: ' + err));
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


router.get('/:id', (req, res) => {
    getLocation(req.params.id)
        .then(result => {
            (result.length != 0)
                ? res.status(200).json(result)
                : res.status(404).send('Location was not found');
        })
        .catch((error) => { res.status(404).send(error) })
});
// --------------------------------------------------------------------


module.exports = router;