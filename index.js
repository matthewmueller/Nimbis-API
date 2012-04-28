/*
 * Module Dependencies
 */
var express = require('express'),
    client = require('./support/client'),
    app = module.exports = express();

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
console.log("Server listening on port 8080");

/*
 * Connect to redis
 */

// Redis events
client.on('ready', function() {
  console.log('Redis listening on port: %d', client.port);
})

client.on('error', function() {
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
var User = require('./models/user');

var loadUser = function(username, password, fn) {
  user = new User({ username : username });

  user.fetch(function(err, user) {
    if(err) return fn(err);
    
    if(user.authenticate(password)) {
      return fn(null, user);
    } else {
      return fn(null, false);
    }

  });
};

/*
 * Basic authentication
 *
 * Kind of messy - will probably need to be refactored
 */
var basicAuth = function(req, res, next) {
  express.basicAuth(function(user, pass, fn) {
    loadUser(user, pass, fn);
  }).apply(this, arguments);
};

/*
 * Controllers
 */
var user = require('./controllers/users'),
    group = require('./controllers/groups');
    message = require('./controllers/messages'),
    comment = require('./controllers/comments');

// Group
app.get('/groups', basicAuth, group.index);
app.post('/groups', basicAuth, group.create);
app.get('/groups/:id', group.show);

// User
app.post('/users', user.create);
app.get('/users/:username', user.show);
app.post('/join', basicAuth, user.join);

// Messages
app.post('/messages', basicAuth, message.create);
app.get('/messages', basicAuth, message.index);

// Comments
app.post('/messages/:message/comments', basicAuth, comment.create);
app.get('/messages/:message/comments', basicAuth, comment.index);
