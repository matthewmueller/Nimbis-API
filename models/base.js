var crypto = require('crypto'),
    redis = require('redis'),
    _ = require('underscore'),
    redisSync = require('../support/redis.sync'),
    Backbone = require('Backbone');

/*
 * Extend Backbone
 */
var Base = module.exports = Backbone.Model.extend({});

/*
 * Indexes
 */
Base.prototype.indexes = {};

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

Base.prototype.savedBefore = false;

Base.prototype.isNew = function() {
  return !this.savedBefore;
};

var _save = Base.prototype.save;
Base.prototype.save = function(options, fn) {
  if(_.isFunction(options)) fn = options;
  
  options = (options) ? _.clone(options) : {};

  // Add in the indexes
  options.indexes = this.indexes;

  // Pass the callback through to sync
  options._callback = function(err, model) {
    if(!err) this.savedBefore = true;
    return fn(err, model);
  };

  _save.call(this, {}, options);
};

/*
 * Sync with redis
 */
Base.prototype.sync = redisSync;