const express = require('express'),
  {
    createUser,
    checkLogin,
    makeLogin,
    makeLogout,
  } = require('../middleware/userware'),
  auth = 'WWW-Authenticate',
  errorMessage = 'Basic realm: "Restricted Area"',
  router = express.Router();

// CREATE
router.post('/', (req, res) => {
  const result = await createUser(req.body);
  result ? res.status(201).json(result) : res.status(400).send(err);
});
// --------------------------------------------------------------------

// READ
// login
router.get('/chklogin', async (req, res) => {
  const result = await checkLogin(req.get('Authorization'));
  resultHandler(res, result);
});
// --------------------------------------------------------------------

router.patch('/login', async (req, res) => {
  const result = await makeLogin(req.get('Authorization'));
  if (!result) res.status(401).setHeader(auth, errorMessage).send();
  res.status(200).send(result.is_admin);
});

router.patch('/logout', async (req, res) => {
  const result = await makeLogout(req.get('Authorization'));
  resultHandler(res, result);
});

module.exports = router;
