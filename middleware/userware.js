const { User } = require('../models/schemas');

// CREATE USER
async function createUser(user_data) {
    return await User.create({
        first_name: user_data.first_name,
        full_name: user_data.full_name,
        username: Buffer.from(user_data.username, 'base64').toString(),
        password: Buffer.from(user_data.password, 'base64').toString(),
        is_admin: user_data.is_admin
    });
}
// --------------------------------------------------------------------

// GET
async function getUser(id) {
    return await User.findById(id).lean();
}
// --------------------------------------------------------------------


// check credentials
async function checkUser(auth) {
    const result = await User.findById(auth).lean() // criteri di ricerca         

    if (result)
        return auth;
    else
        return false;
}

// check the same thing but it returns the whole document
async function checkLogin(auth) {

    const user = await User.aggregate([
        { $match: { _id: auth } },              
        { $addFields : { logStatus: { $subtract: [ "$$NOW", '$logged' ] } } },
        { $project: { _id: 0, logStatus: 1 } } 
    ])

    if (user[0].logStatus < (60*60000)) {
        return await User.findOneAndUpdate(
            { _id: auth },
            { logged: Date.now() },
            { new: true }).lean();
    }
    else 
        return false;       
}
// --------------------------------------------------------------------

async function makeLogin(auth) {

    const tmp = auth.split(' ');   // Divido in base allo spazio  "Basic Y2hhcmxlczoxMjM0NQ==" per recuperare la 2a parte
    const buf = Buffer.from(tmp[1], 'base64').toString(); // creo un buffer e lo avviso che l'input e' in base64
    const [username, password] = buf.split(':');      // divido auth in base a ':'
    
    return await User.findOneAndUpdate({
        username: username,
        password: password
        },
        { logged: Date.now() },
        { new: true }).lean();      
}

async function makeLogout(auth) {    
    return await User.findOneAndUpdate(
        { _id: auth },
        { logged: null },
        { new: true }).lean();      
}


module.exports.createUser = createUser;
module.exports.getUser = getUser;
module.exports.checkUser = checkUser;
module.exports.checkLogin = checkLogin;
module.exports.makeLogin = makeLogin;
module.exports.makeLogout = makeLogout;