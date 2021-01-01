const express = require('express'),
    { createRiddle,
    generateRiddle  } = require('../middleware/riddleware'),
    { checkUser } = require('../middleware/userware'),
    multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.cwd() + '/src/riddles');
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

router.post('/', upload.single('rphoto'), (req, res) => {
    checkUser(req.headers.authorization)
        .then(idu => {
            (idu) 
                ? createRiddle(req.body).then(() => res.status(200).send())            
                : res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send()
        })
        .catch(err => res.status(400).send(err))    
});

// CREATE
router.post('/', (req, res) => {
    checkUser(req.headers.authorization)
        .then(idu => {
            if (idu)
                createRiddle(req.body)
                    .then(result => (result) ? res.status(200).send() : res.status(400).send())
                    .catch(err => res.status(400).send(err))  
            else 
                res.status(400).send()
        })    
});
// --------------------------------------------------------------------


// READ
router.get('/:id', (req, res) => {
    generateRiddle(req.params.id)
        .then(result => {
            (result.length != 0)
                ? res.status(200).json(result)
                : res.status(404).send('Riddle was not found');
        })
        .catch(err => res.status(404).send(err))
});
// --------------------------------------------------------------------


module.exports = router;