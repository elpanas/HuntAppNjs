const express = require('express'),
    { createSingleGame, 
    checkGroup, 
    setCompleted,
    checkMultipleGame} = require('../middleware/sgameware'),
    { checkUser } =  require('../middleware/userware');    
const router = express.Router();


// ----- CREATE -----
router.post('/', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if (idu)
                createSingleGame(req.body, idu)
                    .then((singleGame) => {
                        createSteps(req.body.game_id, singleGame._id, req.body.riddle_cat)
                            .then(() => res.status(200).json({"idsg": singleGame._id}))
                            .catch(() => res.status(400).send());
                    })
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
                    .catch(() => res.status(400).send())
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send();
        })    
});

router.get('/multiple/:idg', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if (idu)            
                checkMultipleGame(req.params.idg, idu)
                    .then(result => { (result.game.is_open) ? res.status(200).send() : res.status(400).send() })
                    .catch(err => res.status(400).send(err))
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send();
        })    
});
// --------------------------------------------------------------------


router.put('/completed', (req, res) => { // richiamo questa funzione se non c'è un id-action memorizzato in locale
    checkUser(req.headers.authorization)
        .then((idu) => {
            if (idu)                
                setCompleted(req.body.idsg)
                    .then(() => res.status(200).send())
                    .catch(() => res.status(400).send())
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send();
        })    
});
module.exports = router;