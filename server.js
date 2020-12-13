const dotenv = require('dotenv').config();
const express = require('express'), // framework nodejs
      mongoose = require('mongoose'), // framework mongoDB 
      restaction = require('./routes/restaction'), // router paths
      restevent = require('./routes/restevent'), // router paths
      restgame = require('./routes/restgame'), // router game
      restsgame = require('./routes/restsgame'), // router group
      restloc = require('./routes/restloc'), // router location
      restriddle = require('./routes/restriddle'), // router riddle
      restuser = require('./routes/restuser'), // router user
      resttest = require('./testing/test'), // router test
      restutility = require('./utility/loadRiddles'),
      path = require('path'), // router test
      url = process.env.DB_LOC_URI; // local db
// const url = process.env.DB_URI; // remote db connection string

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
app.use(express.static(__dirname));
app.use('/api/action', restaction); 
app.use('/api/event', restevent); 
app.use('/api/game', restgame); 
app.use('/api/sgame', restsgame); 
app.use('/api/loc', restloc); 
app.use('/api/riddle', restriddle); 
app.use('/api/user', restuser);
app.use('/api/test', resttest);
app.use('/api/loadrid', restutility);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));