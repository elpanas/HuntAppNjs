const dotenv = require('dotenv').config(); // do not delete this
const express = require('express'), // framework nodejs
      mongoose = require('mongoose'), // framework mongoDB 
      restaction = require('./routes/restaction'), // route paths
      restevent = require('./routes/restevent'), // route paths
      restgame = require('./routes/restgame'), // route game
      restsgame = require('./routes/restsgame'), // route group
      restcluster = require('./routes/restcluster'), // route group
      restloc = require('./routes/restloc'), // route location
      restriddle = require('./routes/restriddle'), // route riddle
      restuser = require('./routes/restuser'), // route user
      resttest = require('./testing/test'), // route test
      //restutility = require('./utility/loadRiddles'), // route riddles
      url = process.env.DB_LOC_URI; // local db
// url = process.env.DB_URI; // remote db connection string

const app = express();

app.use(express.json()); // built-in middleware

// connection to db
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// in case of web request
app.get('/', (req, res) => {
    res.send('Hunting Treasure Web Service');
});

// every request calls a different script based on its path
app.use(express.static(__dirname)); // static calls
app.use('/api/action', restaction); 
app.use('/api/event', restevent); 
app.use('/api/game', restgame); 
app.use('/api/sgame', restsgame); 
app.use('/api/cluster', restcluster);
app.use('/api/loc', restloc); 
app.use('/api/riddle', restriddle); 
app.use('/api/user', restuser);
app.use('/api/test', resttest);
// app.use('/api/loadrid', restutility);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));