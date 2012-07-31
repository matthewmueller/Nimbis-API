var Backbone = require('Backbone'),
    Base = require('./base'),
    Index = require('../structures/Hash');

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
 * Required values
 */
User.prototype.requires = ['name', 'email', 'password'];

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
  var attrs = this.attributes;

  // Make all usernames lowercase
  if(attrs.username) {
    attrs.username = attrs.username.toLowerCase();
  }

  // If username is set, use that, otherwise generate one
  if(!attrs.id) {
    attrs.id = attrs.username || this.makeId(6);
  }

  // Encrypt the password if given and we haven't already encrypted it.
  if(!attrs.salt && attrs.password) {
    var salt = this.makeSalt();

    attrs.password = Base.encrypt(salt, attrs.password);
    attrs.salt = salt;
  }

  this.set(attrs, { silent : true });
};

/*
 * Save the index after save
 *
 * fn - callback function
 *
 */
User.prototype.onSave = function(model, fn) {
  var index,
      wait = 0,
      username = model.get('username'),
      email = model.get('email');

  function done(err) {
    if(err) return fn(err);

    else if(--wait <= 0) {
      return fn(err, model);
    }
  }

  if(username) {
    wait++;
    index = new Index('index:username:id');
    index.set(username, model.id, done);
  }

  if(email) {
    wait++;
    index = new Index('index:email:id');
    index.set(email, model.id, done);
  }

};

/*
 * Authenticate
 */
// User.prototype.authenticate = function(enteredPassword) {
//   var attrs = this.toJSON();

//   // Encrypt the entered password
//   enteredPassword = this.encrypt(attrs.salt, enteredPassword);

//   // Return true if authenticated, false otherwise
//   return (enteredPassword === attrs.password);
// };

// Static Properties
// -----------------

/*
 * Checks if an email or username exists
 *
 * Returns a callback fn(err, user)
 *
 * If the user doesn't exist, user will be false
 */
User.exists = function(val, fn) {
  var rEmail = /^[+a-zA-Z0-9_.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,6}$/,
      index = new Index();

  // Is this an email address or username?
  if(rEmail.test(val)) {
    index.key = 'index:email:id';
  } else {
    index.key = 'index:username:id';
  }

  index.get(val, function(err, id) {
    if(err) return fn(err);
    else if(!id) return fn(null, false);

    return fn(null, id);
  });

};

User.authorize = function(username, pass, fn) {
  User.exists(username, function(err, id) {
    if(err || !id) return fn(err, id);
    // Find the user by id
    User.find(id, function(err, model) {
      if(err) return fn(err);
      var attrs = model.toJSON();

      // Encrypt then check the password
      if(Base.encrypt(attrs.salt, pass) === attrs.password) {
        return fn(null, model);
      } else {
        return fn(null, false);
      }

    });
  });
};


