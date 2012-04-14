/*
 * Module Dependencies
 */
var express = require('express'),
    redis = require('redis'),
    app = module.exports = express.createServer();

/*
 * Configure
 */
app.configure(function() {
  app.use(express.bodyParser());
});

/*
 * Application environment
 */
var env = app.env = process.env.NODE_ENV || 'development';

/*
 * Listen
 */
app.listen(8080);
console.log("Server listening on port", app.address().port);

/*
 * Connect to redis
 */
var redis = app.redis = redis.createClient(null, null, { detect_buffers : true });

// Redis events
redis.on('ready', function() {
  console.log('Redis listening on port: %d', redis.port);

  // Select which database we want to use
  if(env === 'production')
    redis.select(1);
  else if (env === 'development')
    redis.select(0);

});

redis.on('error', function() {
  console.log('Redis: Unable to connect to redis database');
});

/*
 * API:
 *
 * GET     /                 ->  index
 * GET     /new              ->  new
 * POST    /                 ->  create
 * GET     /:id              ->  show
 * GET     /:id/edit         ->  edit
 * PUT     /:id              ->  update
 * DELETE  /:id              ->  destroy
 *
 */

var user = require('./controllers/users');

// User
app.post('/users', user.create);
app.get('/users/:username', user.show);

