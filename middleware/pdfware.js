const { Location, Actions, SingleGame } = require('../models/schemas'),
    mongoose = require('mongoose'),
    QRCode = require('qrcode'),
    fs = require('fs'),
    Prince = require("prince"),
    util   = require("util"),
    millisec = require('millisec');
    rimraf = require("rimraf"),
    multiReplace = require('string-multiple-replace'),
    dateFormat = require("dateformat");

// create the pdf file with qrcodes and related infos
function generateQrPdf(idg) {  
    const tmpqrc = process.cwd() + '/html2pdf/temp/qrcodes/' + idg +'/',
        tmppdf = process.cwd() + '/html2pdf/temp/templates/' + idg +'/',
        dirpdf = process.cwd() + '/html2pdf/pdfs/',
        dirimg = process.cwd() + '/html2pdf/images/',
        dirtemplate1 = process.cwd() + '/html2pdf/template1.html',
        dirtemplate2 = process.cwd() + '/html2pdf/template2.html',
        newidg = mongoose.Types.ObjectId(idg);
    
    var matcherObj,
        qrfilename,
        pathinputs = [];
    if(!fs.existsSync(tmpqrc)) fs.mkdirSync(tmpqrc);
    if(!fs.existsSync(tmppdf)) fs.mkdirSync(tmppdf);
    if(!fs.existsSync(dirpdf)) fs.mkdirSync(dirpdf);    

    Location.find({game: newidg}).sort('cluster')
        .then((locations) => {
            locations.forEach(loc => {

                // qrocode creation
                qrfilename = tmpqrc + loc._id + '.png';
                QRCode.toFile(qrfilename, '' + loc._id);
                
                matcherObj = {
                    "%header%": dirimg + "header.png",
                    "%qrcode%": qrfilename
                }

                populateTemplate(tmppdf, dirtemplate1, matcherObj, loc._id, 1);  
                pathinputs.push(tmppdf + loc._id + 'page1.html');
                
                matcherObj = {
                    "%header%": dirimg + "header.png",
                    "%loclatitude%": loc.location.coordinates[0],
                    "%loclongitude%": loc.location.coordinates[1],
                    "%locid%": loc._id,
                    "%qrcontent%": loc._id,
                    "%locname%": loc.name
                }
                
                populateTemplate(tmppdf, dirtemplate2, matcherObj, loc._id, 2);  
                pathinputs.push(tmppdf + loc._id + 'page2.html');  
            })

            Prince()
                .inputs(pathinputs)
                .option('page-size', 'A4')
                .output(dirpdf + idg + '-file.pdf')                
                .execute()
                .then(function () {
                    console.log("OK: done");
                    rimraf.sync(tmpqrc);
                    rimraf.sync(tmppdf);
                }, function (error) {
                    console.log("ERROR: ", util.inspect(error))
                })
        })
}

// support generalization function to the previous one
function populateTemplate(tmppdf, dirtemplate, matcherObj, idl, p) {      
    
    var base_file = fs.readFileSync(dirtemplate, {encoding: 'utf8', flag: 'r+'} );
    base_file = multiReplace(base_file, matcherObj); 
    fs.writeFileSync(tmppdf + idl + 'page' + p + '.html', base_file);
}

// create a certificate pdf file
async function generateCertPdf(idsg) {
    const tmppdf = process.cwd() + '/html2pdf/temp/templates/' + idsg +'/',
        dirpdf = process.cwd() + '/html2pdf/pdfs/',
        dirimg = process.cwd() + '/html2pdf/images/',
        dirtemplate = process.cwd() + '/html2pdf/template-certificate.html',
        newidg = mongoose.Types.ObjectId(idsg);

    if(!fs.existsSync(dirpdf + idsg + '-cert.pdf')) { 
        if(!fs.existsSync(tmppdf)) fs.mkdirSync(tmppdf);
        if(!fs.existsSync(dirpdf)) fs.mkdirSync(dirpdf);

        var base_file = fs.readFileSync(dirtemplate, {encoding: 'utf8', flag: 'r+'} );

        const loadtime = await Actions.aggregate([
            { $match: { sgame: newidg } },              
            { 
                $group: { 
                _id: null,
                minDate: { $min: "$reachedOn" },
                maxDate: { $max: "$reachedOn" }
                }  
            },
            {
                $addFields : { timeElapsed : { $subtract: [ "$maxDate", "$minDate" ] } }
            },
            { $project: { _id: 0, timeElapsed: 1 } } 
        ])


        const loadgroup = SingleGame.findById(idsg).select('group_name').exec();

        const time_elapsed = millisec(loadtime[0].timeElapsed).format('mm');

        loadgroup.then(group => {       

            const matcherObj = {
                "%backimage%": dirimg + "codeweek_certificate.jpg",
                "%bubble%": dirimg + "bubbles-50.png",
                "%TEAM_NAME%": group.group_name,
                "%DATE%": dateFormat(Date.now(), "d/m/yyyy"),
                "%ELAPSED_MINS%": time_elapsed,
                "%AVATAR_NAME%": dirimg + "default_user.jpg"
            }

            base_file = multiReplace(base_file, matcherObj); 

            fs.writeFileSync(tmppdf + idsg + 'tmp.html', base_file);

            Prince()
                .inputs(tmppdf + idsg + 'tmp.html')
                .option("page-size", 'A4 landscape')
                .output(dirpdf + idsg + '-cert.pdf')
                .execute()
                .then(function () {
                    console.log("OK: done");
                    rimraf.sync(tmppdf);
                }, function (error) {
                    console.log("ERROR: ", util.inspect(error))
                })
        }); 
    }  
}

module.exports.generateQrPdf = generateQrPdf;
module.exports.generateCertPdf = generateCertPdf;