const express = require('express'),
    { createSingleGame, 
        createSteps,
    checkGroup, 
    setCompleted,
    checkMultipleGame,
    getTerminatedList} = require('../middleware/sgameware'),
    { checkUser } =  require('../middleware/userware'),  
    { generateCertPdf } = require('../middleware/pdfware');
const router = express.Router();


// ----- CREATE -----
router.post('/', (req, res) => {
    checkUser(req.headers.authorization)
        .then(idu => {
            if (idu)
                createSingleGame(req.body, idu)
                    .then(singleGame => {                  
                        createSteps(req.body.game_id, singleGame._id, req.body.riddle_cat)
                            .then(() => res.status(200).send())
                            .catch(err => res.status(400).send(err))
                    })
                    .catch(err => res.status(400).send(err))
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send();    
        })    
        .catch(() => res.status(400).send());
    });
// --------------------------------------------------------------------


// ----- GET -----
router.get('/game/:idg', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if (idu)            
                checkGroup(req.params.idg, idu)
                    .then(idsg => { (idsg) ? res.status(200).json(idsg) : res.status(400).send() })
                    .catch(err => res.status(400).send(err))
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send();
        })    
});

router.get('/multiple/:idg', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if (idu)            
                checkMultipleGame(req.params.idg, idu)
                    .then(result => { 
                        if (result == null) 
                            res.status(200).send();
                        else if (result.game.is_open)
                            res.status(200).send();
                        else
                            res.status(404).send();
                    })
                    .catch(err => res.status(400).send(err))
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send();
        })    
});

// Generate and send the final pdf
router.get('/pdf/:idsg', (req, res) => {  
    checkUser(req.headers.authorization)
        .then(idu => {  
            if (idu)  
                res.download(process.cwd() + '/html2pdf/pdfs/' + req.params.idsg + '-cert.pdf',
                            req.params.idsg + '-cert.pdf',
                            err => console.log('Error: ' + err));              
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send();
        })
        .catch(err => res.status(400).send(err));
});


router.get('/terminated', (req, res) => {
    checkUser(req.headers.authorization)
        .then(idu => {
            if (idu)            
                getFinishedList(idu)
                    .then(result => (result) ? res.status(200).json(result) : res.status(400).send())
                    .catch(() => res.status(400).send())
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send();
        }) 
        .catch(() => res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send())   
});
// --------------------------------------------------------------------


router.put('/completed', (req, res) => { // richiamo questa funzione se non c'è un id-action memorizzato in locale
    checkUser(req.headers.authorization)
        .then(idu => {
            if (idu)                
                setCompleted(req.body.idsg)
                    .then(() => {
                        generateCertPdf(req.body.idsg)
                            .then(() => res.status(200).send())
                            .catch(err => res.status(400).send(err))
                    })
                    .catch(err => res.status(400).send(err))
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send();
        })    
});
module.exports = router;