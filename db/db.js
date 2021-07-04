const mongoose = require('mongoose'),
  redisMongoose = require('redis_mongoose'),
  config = require('../config/config'),
  {
    db: { uri, options },
    redis: { redisUri },
  } = config;

redisMongoose.init(mongoose, redisUri);

mongoose
  .connect(uri, options)
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));
