const { User } = require('../models/schemas');

// CREATE USER
async function createUser(user_data) {

    // creazione dell'oggetto (o record) della collezione
    const user = new User({
        first_name: user_data.first_name,
        full_name: user_data.full_name,
        username: user_data.username, // Buffer.from(user_data.username, 'base64').toString(),
        password: user_data.password, // Buffer.from(user_data.password, 'base64').toString(),
        is_admin: user_data.is_admin
    });

    return await user.save();
}
// --------------------------------------------------------------------


// get user
async function getUser(id) {
    return await User.findById(id);
}
// --------------------------------------------------------------------


// check credentials
async function checkUser(auth) {

    const tmp = auth.split(' ');   // Divido in base allo spazio  "Basic Y2hhcmxlczoxMjM0NQ==" per recuperare la 2a parte
    const buf = Buffer.from(tmp[1], 'base64').toString(); // creo un buffer e lo avviso che l'input e' in base64
    const [username, password] = buf.split(':');      // divido auth in base a ':'

    const result = await User.findOne({
        username: username,
        password: password
    }) // criteri di ricerca         

    if (result)
        return result._id;
    else
        return false;
}

// check the same thing but it returns the whole document
async function checkLogin(auth) {

    const tmp = auth.split(' ');   // Divido in base allo spazio  "Basic Y2hhcmxlczoxMjM0NQ==" per recuperare la 2a parte
    const buf = Buffer.from(tmp[1], 'base64').toString(); // creo un buffer e lo avviso che l'input e' in base64
    const [username, password] = buf.split(':');      // divido auth in base a ':'

    return await User.findOne({
        username: username,
        password: password
    }) // criteri di ricerca         
}
// --------------------------------------------------------------------


module.exports.createUser = createUser;
module.exports.getUser = getUser;
module.exports.checkUser = checkUser;
module.exports.checkLogin = checkLogin;