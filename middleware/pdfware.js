const { Location } = require('../models/schemas');
const QRCode = require('qrcode');
const mongoose = require('mongoose');
var fs = require('fs');
var pdf = require("pdf-creator-node");
const merge = require('easy-pdf-merge');
const path = require('path');


function createQrCode(resloc) {  
    const dirqrc = './html2pdf/qrcodes/' + resloc.game +'/';
    if(!fs.existsSync(dirqrc)) fs.mkdirSync(dirqrc);
    
    QRCode.toFile(dirqrc + resloc._id + '.png', 'ID:' + resloc._id);
    convertToPdf(resloc.game, loc_id);
}

/*
function createQrCode(idg) {  
    const dirqrc = './html2pdf/qrcodes/' + idg +'/';
    const newidg = mongoose.Types.ObjectId(idg);
    if(!fs.existsSync(dirqrc)) fs.mkdirSync(dirqrc);

    Location.find({game: newidg}).sort('cluster')
        .then(locations => {
            locations.forEach(loc => {
                QRCode.toFile(dirqrc + loc._id + '.png', 'ID:' + loc._id);
            })

            //createPdf(idg);
        })
  
}*/

    

// pdf creator node
function convertToPdf(idg, idl) {
    const dirqrc = './html2pdf/qrcodes/' + idg +'/';
    const dirpdf = './html2pdf/pdfs/' + idg +'/';
    var base_file = fs.readFileSync('./html2pdf/template1.html', {encoding: 'utf8', flag: 'r+'} );

    var options = {
        format: "A4",
        orientation: "portrait",
    };

    var document = {
        html: base_file,
        data: { 
            qrcode: path.join(process.cwd(), '/html2pdf/qrcodes/' + idg + '/' + idl + '.png') 
        },
        path: dirpdf + idl + '.pdf'
    };
    
    pdf.create(document, options)
        .then(res => {
            // console.log(res)
        })
        .catch(error => {
            console.error(error)
        });
} 

function generatePdf() {
    merge(paths, dirpdf + 'mergedfile.pdf', async (err) => {
        if (err) return console.log(err);
        console.log('Successfully merged!');
    });
}

module.exports.createQrCode = createQrCode;
module.exports.generatePdf = generatePdf;