var redis = require('../').redis,
    _ = require('underscore');

var base = require('./base');

/*
 * Create a user instance
 */
var User = module.exports = function(user) {
  this.attributes = user || {};
};

/*
 * Attributes
 */
User.prototype.attributes = {};

/**
 * Create a user
 */
User.prototype.create = function(user, fn) {

  user = _.extend(this.attributes, user);
  
  // Add a userID
  // user.id = user.id || base.id(6);

  // Save for later //
  // user.password = this.encrypt(salt, user.password);
  // user.salt = salt;

  var queue = redis.multi();

  _.each(user, function(value, key) {
    queue.hset('user:' + user.username, key, value);
  });

  // Index
  queue.hset('i:email:username', user.email, user.username);

  // Save to database
  queue.exec(function(err) {
    return fn(err);
  });
};

/*
 * Find a user
 */
User.find = function(username, fn) {
  redis.hgetall('user:' + username, function(err, user) {
    if(err) return fn(err);
    if(!user) return fn(null);

    return fn(null, user);
  });
};