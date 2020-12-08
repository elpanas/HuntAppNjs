const express = require('express'),
    { createGame,
    getAllGames, 
    setQrCode} = require('../middleware/gameware'),
    { checkUser } = require('../middleware/userware');
const router = express.Router();

// CREATE
router.post('/', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if(idu)
                createGame(req.body)
                    .then((result) => { if (result) res.status(200).send(); else res.status(400).send(); })
                    .catch(() => { res.status(400).send() })
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
        })
        .catch(err => res.status(400).send(err))    
});
// --------------------------------------------------------------------


// READ
router.get('/event/:ide', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if(idu)
                getAllGames(req.params.ide)
                    .then((result) => {
                        if (result.length > 0)
                            res.status(200).json(result);            
                        else
                            res.status(404).send('No games found'); 
                    })
                    .catch((error) => res.status(404).send(error))
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
    })
    .catch(err => res.status(400).send(err))
});

router.get('/:id', (req, res) => {
    getGame(req.params.id)
        .then((result) => {
            if (result.length != 0)
                res.status(200).json(result);
            else
                res.status(404).send('Game was not found');
        })
        .catch(error => res.status(400).send(error) )
});
// --------------------------------------------------------------------


router.put('/qrc', (req, res) => {
    checkUser(req.headers.authorization)
        .then((idu) => {
            if(idu)
                setQrCode(req.body.idg)
                    .then((result) => {
                        if (result.length != 0)
                            res.status(200).send();
                        else
                            res.status(404).send('Game was not found');
                    })
                    .catch((error) => res.status(400).send(error));
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
        })
});
// --------------------------------------------------------------------

module.exports = router;