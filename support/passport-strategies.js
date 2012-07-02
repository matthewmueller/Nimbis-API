var User = require('../models/user');

exports.local = function() {
  var strategy = require('passport-local').Strategy;
  return new strategy({ usernameField : 'email' }, function(user, pass, done) {
    User.authorize(user, pass, done);
  });
};

/*
 * Basic HTTP Authentication - auth sent through every header
 *
 * Example - http://matt:pass@localhost:80/users
 */
exports.basic = function() {
  var strategy = require('passport-http').BasicStrategy;
  return new strategy(function(user, pass, done) {
    User.authorize(user, pass, done);
  });
};