require('./db/db'); // DATABASE CONNECTIONS
const express = require('express'), // FRAMEWORKs
  app = express(),
  config = require('./config/config'), // CONFIGURATIONS
  {
    app: { port },
  } = config,
  compression = require('compression'), // MIDDLEWARES
  helmet = require('helmet'),
  restAction = require('./routes/restaction'), // ROUTES
  restEvent = require('./routes/restevent'),
  restGame = require('./routes/restgame'),
  restSgame = require('./routes/restsgame'),
  restCluster = require('./routes/restcluster'),
  restLoc = require('./routes/restloc'),
  restRiddle = require('./routes/restriddle'),
  restUser = require('./routes/restuser');

// MIDDLEWARES ACTIVACTION
app.use(helmet());
app.use(compression());
app.use(express.json());
app.set('view engine', 'ejs');

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

app.listen(port, () => console.log(`Listening on port ${port}...`));
