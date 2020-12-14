const { Location, Actions, SingleGame } = require('../models/schemas'),
    mongoose = require('mongoose'),
    QRCode = require('qrcode'),
    fs = require('fs'),
    Prince = require("prince"),
    util   = require("util"),
    rimraf = require("rimraf"),
    multiReplace = require('string-multiple-replace');

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
                    "%qrcontent%": loc._id
                }
                
                populateTemplate(tmppdf, dirtemplate2, matcherObj, loc._id, 2);  
                pathinputs.push(tmppdf + loc._id + 'page2.html');  
            })

            var options = {
                "princess": {
                    options: {
                        license: "license.dat",
                        size: 'A4'
                    }
                }
            };

            Prince(options)
                .inputs(pathinputs)
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

function populateTemplate(tmppdf, dirtemplate, matcherObj, idl, p) {      
    
    var base_file = fs.readFileSync(dirtemplate, {encoding: 'utf8', flag: 'r+'} );
    base_file = multiReplace(base_file, matcherObj); 
    fs.writeFileSync(tmppdf + idl + 'page' + p + '.html', base_file);
}

function generateCertPdf(idgs) {
    // time elapsed
    // team name
    // avatar name
    const millis_elapsed = Actions.aggregate([
        { $match: { sgame: idgs } },              
        { $group: { 
            _id: "$reachedOn",
            minDate: { $min: 1 },
            maxDate: { $max: 1 }
            }
        },
        { $project: { _id: 0, timeElapsed: { $substract: [maxDate, minDate] } } }  
    ]).exec();

    const team_avatar_names = SingleGame.findById(idsg)
        .populate('group_captain')
        .select('group_name group_captain.username');

    const time_elapsed = msConversion(millis_elapsed);
}

function msConversion(millis) {
    let sec = Math.floor(millis / 1000);
    let hrs = Math.floor(sec / 3600);
    sec -= hrs * 3600;
    let min = Math.floor(sec / 60);
    sec -= min * 60;
  
    sec = '' + sec;
    sec = ('00' + sec).substring(sec.length);
  
    if (hrs > 0) {
      min = '' + min;
      min = ('00' + min).substring(min.length);
      return hrs + ":" + min + ":" + sec;
    }
    else
      return min + ":" + sec;
}

module.exports.generateQrPdf = generateQrPdf;