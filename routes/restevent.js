const express = require('express'),
    { checkUser } = require('../middleware/userware'),
    { createEvent,
    getEvent,
    checkEvent,
    updateEvent,
    removeEvent } = require('../middleware/eventware');    
const router = express.Router();

// CREATE
router.post('/', (req, res) => {    
    checkUser(req.get('Authorization'))
        .then((idu) => {
            if (idu) {
                checkEvent(req.body.name)
                    .then((eventexist) => {
                        if (!eventexist) {
                            createEvent(req.body, idu)
                                .then(() => res.status(200).send())
                                .catch(() => res.status(400).send())
                        } else 
                            res.status(400).send('Error: name already exists');                
                    }) // checkEvent                      
            } else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()  
        })
});
// --------------------------------------------------------------------


// READ
router.get('/:id', (req, res) => {
    getEvent(req.params.id)
        .then((result) => {
            if (result.length > 0)
                res.status(200).json(result);
            else
                res.status(404).send('Event was not found');
        })
        .catch((error) => { res.status(404).send(error) })
});
// --------------------------------------------------------------------


// UPDATE
router.put('/:id', (req, res) => {
    checkUser(req.get('Authorization'))
        .then((result) => {
            if (result) {
                updateEvent(req.params.id, req.body)
                    .then(() => { res.status(200).send() })
                    .catch(() => { res.status(404).send('Event was not found') })
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
                removeEvent(req.params.id)
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