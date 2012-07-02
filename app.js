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

// Automatically create a session for the user:
// id: emum2q, email: matt@matt.com, password: test
var autologin = function(req, res, next) {
  if(env !== 'development' || req.session.passport.user) return next();
  req.session.passport.user = 'emum2q';
  return next();
};

/*
 * Configuration
 */
app.configure(function() {
  app.use(express.logger('dev'));
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(autologin); // Automatically login
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
var isLoggedIn = function(req, res, next) {
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
app.get('/groups', isLoggedIn, group.index);
app.post('/groups', isLoggedIn, group.create);
app.get('/groups/:id', group.show);

// User
app.post('/users', user.create);
app.get('/users/:id', user.show);
app.post('/join', isLoggedIn, user.join);

// Messages
app.post('/messages', isLoggedIn, message.create);
app.get('/messages', isLoggedIn, message.index);

// Comments
app.post('/messages/:message/comments', isLoggedIn, comment.create);
app.get('/messages/:message/comments', isLoggedIn, comment.index);
