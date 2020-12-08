const { Location } = require('../models/schemas');
const mongoose = require('mongoose');
const bwipjs = require('bwip-js');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// CREATE 
async function createLocations(locs_data) {
    await Location.insertMany(locs_data);
}

async function createLocation(loc_data) {

    const loc = new Location({
        game: loc_data.game_id,
        cluster: loc_data.cluster,
        location: loc_data.location,
        description: loc_data.description,
        image_path: loc_data.imagepath,
        hint: loc_data.hint,
        is_start: loc_data.is_start,
        is_final: loc_data.is_final
    });

    // salva il documento
    return await loc.save();
}
// --------------------------------------------------------------------


// GET
// get locations of a cluster
function getCluster(idg, cluster_nr) {
    return Location.find({ game: idg, cluster: cluster_nr }).sort('cluster');
}

function checkStartFinal(idg) {
    newidg = mongoose.Types.ObjectId(idg);
    return Location.find({ game: newidg, $or: [{is_start: true}, {is_final: true}] })
        .select('is_start is_final');
}

// get the game cluster list
async function getClusterList(idg) {
    newidg = mongoose.Types.ObjectId(idg);
    return await Location.aggregate([        
        { $match: { game: newidg } },   
        { $project: { _id: 0, cluster: 1 } },     
        { $group: { _id: "$cluster" } },         
        { $sort: { _id: 1 } }
    ])
}

// get locations nr
function getNrLocations(idg) {
    newidg = mongoose.Types.ObjectId(idg);
    return Location.estimatedDocumentCount({ game: newidg });
}

function checkDistance(event_dist, locdata) {    
    const distanceAVG = Location.aggregate([
            { $match: { game: locdata.game_id } },
            { $geoNear: {
                near: locdata.location,
                distanceField: "distance"
                } 
            },
            { $project: { distAvg: { $avg: '$distance' } } }
        ]);
    
    if (distanceAVG.distAvg >= event_dist)
        return true;
    else
        return false;
}

function getAllLocations(idg) {
    return Location.find({ game: idg }).sort('cluster');
}
// --------------------------------------------------------------------

function createImg(idg, idl) {    

    const dir = './tmpdata' + idg +'/';
    if(!fs.existsSync(dir)) fs.mkdirSync(dir);

    bwipjs.toBuffer({
        bcid:        'qrcode',       // Barcode type
        text:        idl,    // Text to encode
        scale:       3,               // 3x scaling factor
        height:      10,              // Bar height, in millimeters
        includetext: true,            // Show human-readable text
        textxalign:  'center',        // Always good to set this
    })
    .then(png => {
        fs.writeFile(dir + loc._id + '.png', png, () => {});                                      
    })
    .catch(err => console.log(err));
    /*fs.rmdirSync(dir, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
    })*/      
}

function createPdf(idg) {    
    const dir = './tmpdata' + idg +'/';
    fs.readdir(dir, (err, files) => {
    var pdfDoc = new PDFDocument;
    pdfDoc.pipe(fs.createWriteStream('./data/cw_qrcodes.pdf'));
       files.forEach(name => {
            pdfDoc  
            .fontSize(25)          
            .text('CodeWeek')
            .image(dir + name, {
                fit:[400,500],
                align: 'center',
                valign: 'center'
                })
            .addPage()
            
       });
       pdfDoc.end();   
    }) 
}

module.exports.createLocation = createLocation;
module.exports.createLocations = createLocations;
module.exports.getCluster = getCluster;
module.exports.getClusterList = getClusterList;
module.exports.checkStartFinal = checkStartFinal;
module.exports.getNrLocations = getNrLocations;
module.exports.checkDistance = checkDistance;
module.exports.getAllLocations = getAllLocations;
module.exports.createImg = createImg;
module.exports.createPdf = createPdf;
