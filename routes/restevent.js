const express = require('express'),
    { checkUser } = require('../middleware/userware'),
    { createEvent,
    getAllEvents,
    checkEvent} = require('../middleware/eventware');    
const router = express.Router();

// CREATE
router.post('/', (req, res) => {    
    checkUser(req.headers.authorization)
        .then(idu => {
            if (idu) {
                checkEvent(req.body.name)
                    .then(eventexist => {
                        if (!eventexist) {
                            createEvent(req.body, idu)
                                .then(() => res.status(200).send())
                                .catch(err => res.status(400).send(err))
                        } else 
                            res.status(400).send('Error: name already exists');                
                    }) // checkEvent                      
            } else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()  
        })
});
// --------------------------------------------------------------------


// READ
router.get('/lat/:lat/long/:long', (req, res) => {
    checkUser(req.headers.authorization)
        .then(idu => {
            if (idu) 
                getAllEvents(req.params.lat, req.params.long)
                    .then(result => {
                        (result.length > 0)
                            ? res.status(200).json(result)                       
                            : res.status(404).send('Events not found');
                    })
                    .catch(err => res.status(400).send(err))
            else 
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()   
        })
        .catch(err => res.status(400).send(err))
});
// --------------------------------------------------------------------


module.exports = router;