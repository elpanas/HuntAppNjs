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
router.get('/', (req, res) => {
    checkUser(req.headers.authorization)
        .then(idu => {
            if (idu) 
                getAllEvents()
                    .then(result => {
                        if (result.length > 0)
                            res.status(200).json(result);
                        else
                            res.status(404).send('Events not found');
                    })
                    .catch((error) => res.status(400).send(error))
            else 
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()   
        })
        .catch(err => res.status(400).send(err))
});
// --------------------------------------------------------------------


module.exports = router;