const express = require('express'), // framework nodejs
      mongoose = require('mongoose'), // framework mongoDB 
      restevent = require('./routes/restevent'), // router paths
      restgame = require('./routes/restgame'), // router game
      restgroup = require('./routes/restgroup'), // router group
      restloc = require('./routes/restloc'), // router location
      restriddle = require('./routes/restriddle'), // router riddle
      restuser = require('./routes/restuser'), // router user
      resttest = require('./testing/test'), // router test
      url = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false'; // local db
// const url = process.env.DB_URI; // remote db connection string

const app = express();

mongoose.set('useCreateIndex', true); // mongoose will use CreateIndex (new) instead of ensureIndexis

app.use(express.json()); // built-in middleware

// connection to db
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// in case of web request
app.get('/', (req, res) => {
    res.send('Hunting Treasure Web Service');
});

// every request calls a different script based on its path
app.use('/api/event', restevent); 
app.use('/api/game', restgame); 
app.use('/api/group', restgroup); 
app.use('/api/loc', restloc); 
app.use('/api/riddle', restriddle); 
app.use('/api/user', restuser);
app.use('/api/test', resttest);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));