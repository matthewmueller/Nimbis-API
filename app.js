/*
 * Module Dependencies
 */
var express = require('express'),
    passport = require('passport'),
    RedisStore = require('connect-redis')(express),
    client = require('./support/client'),
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
passport.use(strategies.local());

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

var sessionOptions = {
  key : 'sessionId',
  secret : 'blah',
  store : new RedisStore({ client : client })
};

/*
 * Configuration
 */
app.configure(function() {
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session(sessionOptions));
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
 * Check if the user is authenticated
 */
var isAuthorized = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  return res.send(401);
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
app.get('/groups', isAuthorized, group.index);
app.post('/groups', isAuthorized, group.create);
app.get('/groups/:id', group.show);

// User
app.post('/users', user.create);
app.get('/users/:id', user.show);
app.post('/join', isAuthorized, user.join);

// Messages
app.post('/messages', isAuthorized, message.create);
app.get('/messages', isAuthorized, message.index);

// Comments
app.post('/messages/:message/comments', isAuthorized, comment.create);
app.get('/messages/:message/comments', isAuthorized, comment.index);
