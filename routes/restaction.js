const express = require('express'),
    { getActionLoc,
        setReached,
        getRiddleFromAction,
        setSolved, 
        setPhoto } = require("../middleware/actionware"),
    { generateRiddle, 
        checkRiddle, 
        getRiddle } = require('../middleware/riddleware'),
    { checkUser } = require('../middleware/userware'),
    { setCompleted } = require('../middleware/sgameware');

const multer = require('multer');

const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './data/gamephoto');
        },
        filename: (req, file, cb) => {
            var ext = file.originalname.split('.');
            cb(null, file.fieldname + req.body.ida + '.' + ext[1]);
        }
    }),
    imgFilter = (req, file, cb) => {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
var upload = multer({ storage: storage, fileFilter: imgFilter });

const router = express.Router();

// POST
// Upload photo
router.post('/gphoto', upload.single('selfie'), (req, res) => {
    try {
        checkUser(req.headers.authorization)
        .then((idu) => {
            if (idu) 
                setPhoto(req.body.ida, req.body.img).then(() => res.status(200).send())            
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Restricted Area"').send();
        })
    }catch(err) {
      res.status(400).send(err);
    }
});

// GET
// get the location info
router.get('/sgame/:idsg', (req, res) => { // recupera l'ultimo step
    checkUser(req.headers.authorization)
        .then((idu) => {
            if (idu) {
                getActionLoc(req.params.idsg)
                    .then((result) => res.status(200).json(result) )
                    .catch((err) => res.status(400).send(err));
            }           
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Area Riservata"').send();
        })
        .catch((err) => res.status(400).send(err));
});

router.get('/riddle/:ida', (req, res) => { 
    checkUser(req.headers.authorization)
        .then((idu) => {
            if (idu) {
                getRiddleFromAction(req.params.ida) // get the riddle id
                    .then((result) => { 
                        getRiddle(result.riddle)
                            .then((riddle) => {                                
                                generateRiddle(riddle, 'it', function (riddledata) {  
                                    res.status(200).json(riddledata);
                                    })                                            
                            })   
                    }) 
            }
        })
});

// PUT
// qrcode checked when a location is reached
router.put('/reached/:ida', (req, res) => { 
    checkUser(req.headers.authorization)
        .then((idu) => {
            if (idu) 
                setReached(req.params.ida) // after qrcode scan
                    .then(() => res.status(200).send());                            
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Area Riservata"').send();
        })    
});

// when a riddle is solved
router.put('/solution', (req, res) => { // recupera l'ultimo step
    checkUser(req.headers.authorization)
        .then((idu) => {
            if (idu) {
                checkRiddle(req.body)
                    .then((solok) => {
                        if (solok) 
                            setSolved(req.body.ida)
                                .then(() => res.status(200).send())
                                .catch((err) => res.status(400).send(err));                   
                        else
                            res.status(400).send();
                    })
                    .catch((err) => res.status(400).send(err))
            }                
            else
                res.status(401).setHeader('WWW-Authenticate', 'Basic realm: "Area Riservata"').send();
        })  
        .catch((err) => res.status(400).send(err))  
});
// --------------------------------------------------------------------

module.exports = router;