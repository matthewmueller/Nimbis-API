/*
 * Module Dependencies
 */
var express = require('express'),
    passport = require('passport'),
    app = module.exports = express();

/*
 * Application environment
 */
var env = app.env = process.env.NODE_ENV || 'development';

/*
 * Passport support
 */
var strategies = require('./support/passport-strategies');

// Local session support
passport.use(strategies.local);

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.find(id, done);
});

/*
 * Configuration
 */
app.configure(function() {
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
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

/*
 * Basic authentication
 *
 * TODO: Replace with oAuth & browserID
 */
var basicAuth = function() {
  express.basicAuth(function(user, pass, fn) {
    User.authorize(user, pass, fn);
  }).apply(this, arguments);
};

/*
 * Controllers
 */
var authorize = require('./controllers/authorize'),
    user = require('./controllers/user'),
    group = require('./controllers/group'),
    message = require('./controllers/message'),
    comment = require('./controllers/comment');

// Authorization
app.post('/authorize', authorize);

// Group
app.get('/groups', basicAuth, group.index);
app.post('/groups', basicAuth, group.create);
app.get('/groups/:id', group.show);

// User
app.post('/users', user.create);
app.get('/users/:id', user.show);
app.post('/join', basicAuth, user.join);

// Messages
app.post('/messages', basicAuth, message.create);
app.get('/messages', basicAuth, message.index);

// Comments
app.post('/messages/:message/comments', basicAuth, comment.create);
app.get('/messages/:message/comments', basicAuth, comment.index);
