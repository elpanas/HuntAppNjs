require('./db/db'); // DATABASE CONNECTIONS
const express = require('express'); // FRAMEWORK
const app = express(),
  config = require('./config/config'), // CONFIGURATIONS
  compression = require('compression'), // MIDDLEWARES
  helmet = require('helmet'),
  restAction = require('./routes/restaction'), // route paths
  restEvent = require('./routes/restevent'), // route paths
  restGame = require('./routes/restgame'), // route game
  restSgame = require('./routes/restsgame'), // route group
  restCluster = require('./routes/restcluster'), // route group
  restLoc = require('./routes/restloc'), // route location
  restRiddle = require('./routes/restriddle'), // route riddle
  restUser = require('./routes/restuser'); // route user

// MIDDLEWARES ACTIVACTION
app.use(helmet());
app.use(compression());
app.use(express.json());

// in case of web request
app.get('/', (req, res) => res.send('Hunting Treasure Web Service'));

app.use(express.static(__dirname)); // static calls
app.use('/api/action', restAction);
app.use('/api/event', restEvent);
app.use('/api/game', restGame);
app.use('/api/sgame', restSgame);
app.use('/api/cluster', restCluster);
app.use('/api/loc', restLoc);
app.use('/api/riddle', restRiddle);
app.use('/api/user', restUser);

app.listen(config.app.port, () =>
  console.log(`Listening on port ${config.app.port}...`)
);
