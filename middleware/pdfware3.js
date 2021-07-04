const { Actions } = require('../models/action'),
  mongoose = require('mongoose'),
  QRCode = require('qrcode'),
  fs = require('fs'),
  Prince = require('prince'),
  util = require('util'),
  millisec = require('millisec'),
  rimraf = require('rimraf'),
  multiReplace = require('string-multiple-replace'),
  dateFormat = require('dateformat'),
  { setQrCode } = require('./gameware');

function generateQrHtml(loc) {
  const tmpqrc = `${process.cwd()}/html2pdf/temp/qrcodes/${idg}/`,
    tmphtml = `${process.cwd()}/html2pdf/temp/templates/${idg}/`,
    dirpdf = `${process.cwd()}/html2pdf/pdfs/`,
    dirimg = `${process.cwd()}/html2pdf/images/`,
    dirtemplate1 = `${process.cwd()}/html2pdf/template1.ejs`,
    dirtemplate2 = `${process.cwd()}/html2pdf/template2.ejs`,
    qrfilename = `${tmpqrc}${loc._id}.png`;

  let matcherObj;

  if (!fs.existsSync(tmpqrc)) fs.mkdirSync(tmpqrc, { recursive: true });
  if (!fs.existsSync(tmphtml)) fs.mkdirSync(tmphtml, { recursive: true });
  if (!fs.existsSync(dirpdf)) fs.mkdirSync(dirpdf, { recursive: true });

  QRCode.toFile(qrfilename, `${loc._id}`);

  matcherObj = {
    header: `${dirimg}header.png`,
    qrcode: qrfilename,
  };

  populateTemplate(tmphtml, dirtemplate1, matcherObj, loc._id, 1);

  matcherObj = {
    header: `${dirimg}header.png`,
    loclatitude: loc.location.coordinates[0],
    loclongitude: loc.location.coordinates[1],
    locid: loc._id,
    qrcontent: loc._id,
    locname: loc.name,
  };

  populateTemplate(tmphtml, dirtemplate2, matcherObj, loc._id, 2);
}

// create the pdf file with qrcodes and related infos
function generateQrPdf(idg) {
  const tmpqrc = `${process.cwd()}/html2pdf/temp/qrcodes/${idg}/`,
    tmphtml = `${process.cwd()}/html2pdf/temp/templates/${idg}/`,
    dirpdf = `${process.cwd()}/html2pdf/pdfs/`,
    pathinputs = fs.readdirSync(tmphtml);

  if (!fs.existsSync(dirpdf)) fs.mkdirSync(dirpdf, { recursive: true });

  Prince()
    .inputs(pathinputs)
    .option('page-size', 'A4')
    .output(`${dirpdf}${idg}-file.pdf`)
    .execute()
    .then(
      () => {
        console.log('OK: done');
        setQrCode(idg);
        rimraf(tmpqrc);
        rimraf(tmphtml);
      },
      (error) => console.log('ERROR: ', util.inspect(error))
    );
}

// support generalization function to the previous one
async function populateTemplate(tmphtml, dirtemplate, matcherObj, idl, p) {
  let template = await ejs.renderFile(
    dirtemplate,
    { data: matcherObj },
    { async: true }
  );
  fs.writeFileSync(`${tmphtml}${idl}page${p}.html`, template);
}

// create a certificate pdf file
async function generateCertPdf(idsg) {
  const tmppdf = `${process.cwd()}/html2pdf/temp/templates/${idsg}/`,
    dirpdf = `${process.cwd()}/html2pdf/pdfs/`,
    dirimg = `${process.cwd()}/html2pdf/images/`,
    dirtemplate = `${process.cwd()}/html2pdf/template-certificate.html`,
    newidg = mongoose.Types.ObjectId(idsg);

  if (!fs.existsSync(`${dirpdf}${idsg}-cert.pdf`)) {
    if (!fs.existsSync(tmppdf)) fs.mkdirSync(tmppdf);
    if (!fs.existsSync(dirpdf)) fs.mkdirSync(dirpdf);

    let base_file = fs.readFileSync(dirtemplate, {
      encoding: 'utf8',
      flag: 'r+',
    });
    const loadtime = await getTime(newidg),
      loadgroup = await getGroup(idsg);
    const time_elapsed = millisec(loadtime[0].timeElapsed).format('mm');
    const matcherObj = {
      '%backimage%': `${dirimg}codeweek_certificate.jpg`,
      '%bubble%': `${dirimg}bubbles-50.png`,
      '%TEAM_NAME%': loadgroup.group_name,
      '%DATE%': dateFormat(Date.now(), 'd/m/yyyy'),
      '%ELAPSED_MINS%': time_elapsed,
      '%AVATAR_NAME%': `${dirimg}default_user.jpg`,
    };

    base_file = multiReplace(base_file, matcherObj);

    fs.writeFileSync(`${tmppdf}${idsg}tmp.html`, base_file);

    Prince()
      .inputs(`${tmppdf}${idsg}tmp.html`)
      .option('page-size', 'A4 landscape')
      .output(`${dirpdf}${idsg}-cert.pdf`)
      .execute()
      .then(
        () => {
          console.log('OK: done');
          rimraf.sync(tmppdf);
        },
        (error) => console.log('ERROR: ', util.inspect(error))
      );
  }
}

// get the session game duration
async function getTime(idg) {
  return await Actions.aggregate([
    { $match: { sgame: idg } },
    {
      $group: {
        _id: null,
        minDate: { $min: '$reachedOn' },
        maxDate: { $max: '$reachedOn' },
      },
    },
    { $addFields: { timeElapsed: { $subtract: ['$maxDate', '$minDate'] } } },
    { $project: { _id: 0, timeElapsed: 1 } },
  ]);
}

async function getGroup(idsg) {
  return await SingleGame.findById(idsg).select('group_name').lean();
}

module.exports.generateQrHtml = generateQrHtml;
module.exports.generateQrPdf = generateQrPdf;
module.exports.generateCertPdf = generateCertPdf;
