const { User } = require('../models/schemas');

// CREATE USER
async function createUser(user_data) {

    // creazione dell'oggetto (o record) della collezione
    const user = new User({
        first_name: user_data.first_name,
        full_name: user_data.full_name,
        username: Buffer.from(user_data.username, 'base64').toString(),
        password: Buffer.from(user_data.password, 'base64').toString(),
        is_admin: user_data.is_admin
    });

    return await user.save();
}
// --------------------------------------------------------------------


// GET USER
async function getUser(id) {
    return await User.findById(id);
}
// --------------------------------------------------------------------


// UPDATE USER
async function updateUser(idu, user_data) {

    const user = await User.update({ _id: idu }, {
        $set: {
            first_name: user_data.first_name,
            full_name: user_data.full_name,
            username: user_data.username,
            password: user_data.password
        }
    }, { new: true });

    return user;
}
// --------------------------------------------------------------------


// REMOVE USER
async function removeUser(id) {
    return result = await User.findByIdAndDelete(id);
}
// --------------------------------------------------------------------


// CHECK USER
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
// --------------------------------------------------------------------


module.exports.createUser = createUser;
module.exports.getUser = getUser;
module.exports.updateUser = updateUser;
module.exports.removeUser = removeUser;
module.exports.checkUser = checkUser;