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
 * Types
 */
User.prototype.types = {
  id : String,
  name : String,
  username : String,
  email : String,
  password : String,
  groups : Array,
  salt : String
};

/*
 * Defaults
 */
User.prototype.defaults = {
  groups : []
};

/*
 * Initialize a user model
 */
User.prototype.initialize = function() {
  var attrs = this.toJSON();

  // Make all usernames lowercase
  attrs.username = attrs.username.toLowerCase();

  // Right now have the id be the username
  attrs.id = attrs.username;

  // Encrypt the password if given and we haven't already encrypted it.
  if(!attrs.salt && attrs.password) {
    var salt = this.makeSalt();

    attrs.password = this.encrypt(salt, attrs.password);
    attrs.salt = salt;
  }

  // Set up the index
  this.index('email:username', attrs.email, attrs.username);

  this.set(attrs, { silent : true });
};

/*
 * Authenticate
 */
User.prototype.authenticate = function(enteredPassword) {
  var attrs = this.toJSON();

  // Encrypt the entered password
  enteredPassword = this.encrypt(attrs.salt, enteredPassword);

  // Return true if authenticated, false otherwise
  return (enteredPassword === attrs.password);
};