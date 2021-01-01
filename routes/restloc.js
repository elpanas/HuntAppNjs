const express = require('express'),
    { createLocations,
        createLocation,
    getLocations, 
    getDistances,
    computeMean} = require('../middleware/locatware'),
    { checkUser } = require('../middleware/userware'),
    { generateQrPdf } = require('../middleware/pdfware'),
    { createCluster } = require('../middleware/clusterware'),
    multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.cwd() + '/data/locphoto');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
}),
    imgFilter = (req, file, cb) => {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png')
            cb(null, true);
        else 
            cb(null, false);
    }

var upload = multer({ storage: storage, fileFilter: imgFilter });

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

// CREATE
router.post('/', upload.single('lphoto'), (req, res) => {    
    checkUser(req.headers.authorization)
        .then(idu => {
            if(idu)                         
                getDistances(req.body).then(distances => {
                    var is_mean = false;
                    const start = (req.body.is_start == 'true'),                
                        avgdist = parseInt(req.body.avg_distance);                    
  
                    if (!start) {
                        is_mean = (distances.length == 1 && distances[0].distance >= avgdist)
                            ? true
                            : (computeMean(distances) >= avgdist);
                    }   

                    if (start || is_mean)                        
                        createLocation(req.body)
                            .then(result => { 
                                if (result._id) {
                                    if (result.cluster == 1 && result.is_start) createCluster(result.game);
                                    if (result.is_final) generateQrPdf(result.game); 
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
                    .then(result => { (result.length > 0) ? res.status(200).json(result) : res.status(400).send()})
                    .catch(err => res.status(400).send(err))            
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
        .catch(err => res.status(400).send(err))
});
// --------------------------------------------------------------------


module.exports = router;