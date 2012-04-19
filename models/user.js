var Backbone = require('Backbone'),
    Base = require('./base');

var User = module.exports = Base.extend();

/*
 * Name of the model
 */
User.prototype.name = 'user';

/*
 * Access settings
 */
User.prototype.access = {
  password : 'private',
  salt : 'private'
};

/*
 * Initialize a new user
 */
User.prototype.initialize = function() {
  var attrs = this.toJSON(),
      salt = this.makeSalt();

  attrs.password = this.encrypt(salt, attrs.password);
  attrs.salt = salt;

  // Right now have the id be the username
  attrs.id = attrs.username;

  // Set up the index
  this.index('email:username', attrs.email, attrs.username);

  this.set(attrs, { silent : true });
};