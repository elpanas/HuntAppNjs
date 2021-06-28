require('./db/db'); // DATABASE CONNECTIONS
const express = require('express'); // FRAMEWORK
const app = express(),
  config = require('./config/config'), // CONFIGURATIONS
  compression = require('compression'), // MIDDLEWARES
  helmet = require('helmet'),
  restaction = require('./routes/restaction'), // route paths
  restevent = require('./routes/restevent'), // route paths
  restgame = require('./routes/restgame'), // route game
  restsgame = require('./routes/restsgame'), // route group
  restcluster = require('./routes/restcluster'), // route group
  restloc = require('./routes/restloc'), // route location
  restriddle = require('./routes/restriddle'), // route riddle
  restuser = require('./routes/restuser'); // route user

// MIDDLEWARES ACTIVACTION
app.use(helmet());
app.use(compression());
app.use(express.json());

// in case of web request
app.get('/', (req, res) => res.send('Hunting Treasure Web Service'));

app.use(express.static(__dirname)); // static calls
app.use('/api/action', restaction);
app.use('/api/event', restevent);
app.use('/api/game', restgame);
app.use('/api/sgame', restsgame);
app.use('/api/cluster', restcluster);
app.use('/api/loc', restloc);
app.use('/api/riddle', restriddle);
app.use('/api/user', restuser);

app.listen(config.app.port, () =>
  console.log(`Listening on port ${config.app.port}...`)
);
