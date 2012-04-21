var redis = require('../').redis,
    Group = require('./group'),
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

  // Generate salt
  var salt = base.salt();
  
  // Save for later //
  user.password = base.encrypt(salt, user.password);
  user.salt = salt;

  var queue = redis.multi();

  _.each(user, function(value, key) {
    queue.hset('user:' + user.username, key, value);
  });

  // Index
  queue.hset('i:email:username', user.email, user.username);

  // Save to database
  queue.exec(fn);
};

/*
 * Join a group
 *
 * id : group id
 * settings : stuff like color, and other user-specific settings
 *
 */
User.prototype.join = function(id, settings, fn) {

  // FIXME: We would need to make sure this person has permissions.
  Group.find(id, function(err, group) {
    if(err) return fn(err);
    if(!group) return fn(null, false);

    settings.id = id;
    settings.name = group.name;

    // Put a hash inside user:_username_ groups

  });
};

/*
 * Check if a user exists
 */
User.exists = function(username, fn) {
  redis.hget('user:' + username, 'email', function(err, email) {
    if(err) return fn(err);
    else if(email) return fn(null, true);

    return fn(null, false);
  });
};

/*
 * Authenticate a user
 */
User.authenticate = function(username, password, fn) {
  redis.hgetall('user:' + username, function(err, user) {
    if(err) return fn(err);
    // TODO, maybe use User.exists
    if(!user.username) return fn(null);

    // Encrypt the supplied password
    password = base.encrypted(user.salt, password);

    // Does it match?
    if(password === user.password) {
      return fn(null, user);
    } else {
      return fn(null);
    }
  });
};