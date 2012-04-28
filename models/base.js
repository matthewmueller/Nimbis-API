var crypto = require('crypto'),
    _ = require('underscore'),
    Backbone = require('Backbone');

/*
 * Extend Backbone
 */
var Base = module.exports = Backbone.Model.extend();

/*
 * Sync with redis
 */
Base.prototype.sync = require('../support/redis.sync');

/*
 * Public: Generate Salt
 */
Base.prototype.makeSalt = function() {
  return Math.round((new Date().valueOf() * Math.random())).toString();
};

/*
 * Encrypt a string
 */
Base.prototype.encrypt = function(salt, str) {
  return crypto.createHmac('sha1', salt).update(str).digest('hex');
};

/*
 * Generate a id
 */
Base.prototype.makeId = function(len) {
  return Math.random().toString(36).substr(2,len);
};

/*
 * Index an attribute
 */
Base.prototype.index = function(i, key, value) {
  this.indexes = (this.indexes) ? this.indexes : {};

  // Prepend with i:
  i = 'i:' + i;

  // Add as an array. Ex. i:email:username = ['mattmuelle@gmail.com', 'matt'];
  this.indexes[i] = [key, value];
};

Base.prototype.isNew = function() {
  return !this.attributes.created_at;
};

/*
 * Validate Types
 */
Base.validateTypes = function() {
  _.each(this.types, function(type, attr) {
    // _.isNumber, _.isString, etc.
    if(!_['is' + type.name](attr)) {
      return new Error(attr + ' is not a ' + type.name);
    }
  });

  return null;
};

/*
 * Save a model
 */
Base.prototype.save = function(options, fn) {
  var date = new Date(),
      method = 'update';

  // Add timestamps
  if(this.isNew()) {
    method = 'create';
    this.set('created_at', date, { silent : true });
  }

  this.set('modified_at', date, { silent : true });

  if(_.isFunction(options)) {
    fn = options;
    options = {};
  } else {
    options = _.clone(options);
  }

  this.sync(method, options, function(err, model) {
    
    // Call hooks if available
    if(err && model.onError) {
      model.onError.call(model, err, fn);
    } else if(!err && model.onSave) {
      model.onSave.call(model, model, fn);
    } else {
      fn(err, model);
    }

  });
};

/*
 * Fetch a particular model
 */
Base.prototype.fetch = function(options, fn) {
  if(_.isFunction(options)) fn = options;
  this.sync('read', options, fn)
};



