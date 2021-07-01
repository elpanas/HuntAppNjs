const { checkUser } = require('../middleware/userware'),
  auth = 'WWW-Authenticate',
  errorMessage = 'Basic realm: "Restricted Area"',
  config = require('../config/config'),
  bcrypt = require('bcrypt'),
  saltRounds = ({
    bcrypt: { saltRounds },
  } = config);

async function authHandler(req) {
  const idu = await checkUser(req.get('Authorization'));

  if (idu) {
    return idu;
  } else {
    res.status(401).setHeader(auth, errorMessage).send();
  }
}

function resultHandler(res, result) {
  result
    ? res.status(200).send()
    : res.status(401).setHeader(auth, errorMessage).send();
}

function credentialsHandler(auth) {
  const tmp = auth.split(' '); // Divido in base allo spazio  "Basic Y2hhcmxlczoxMjM0NQ==" per recuperare la 2a parte
  const buf = Buffer.from(tmp[1], 'base64').toString(); // creo un buffer e lo avviso che l'input e' in base64
  const [username, password] = buf.split(':'); // divido auth in base a ':'
  const hashPassword = await bcrypt.hashSync(password, saltRounds);
  return { username: username, password: hashPassword };
}

function createObj(nr, idsg, id) {
  return { prog_nr: nr, sgame: idsg, step: id, riddle: null };
}

// Fisher Yates shuffle method
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * i);
    k = arr[i];
    arr[i] = arr[j];
    arr[j] = k;
  }
  return arr;
}
// ------------------------------------------------------

module.exports.authHandler = authHandler;
module.exports.resultHandler = resultHandler;
module.exports.credentialsHandler = credentialsHandler;
module.exports.createObj = createObj;
module.exports.shuffle = shuffle;
