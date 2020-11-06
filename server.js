const express = require('express'), // framework nodejs
      mongoose = require('mongoose'), // framework mongoDB
      restevent = require('./routes/restevent'), // router paths
      restuser = require('./routes/restuser'),
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

// every request calls a different script, based on its path
app.use('/api/event', restevent); 
app.use('/api/user', restuser);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));