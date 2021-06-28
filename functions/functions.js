const { checkUser } = require('../middleware/userware'),
  auth = 'WWW-Authenticate',
  errorMessage = 'Basic realm: "Restricted Area"';

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

module.exports.authHandler = authHandler;
module.exports.resultHandler = resultHandler;
