var redis = require('redis'),
    crypto = require('crypto'),
    Backbone = require('Backbone');

/*
 * Extend Backbone
 */
var Base = module.exports = Backbone.Model.extend({});

/*
 * Public: Generate Salt
 */
Base.prototype.makeSalt = function() {
  return Math.round((new Date().valueOf() * Math.random())).toString();
};

/**
 * Encrypt a string
 */
Base.prototype.encrypt = function(str) {
  return crypto.createhmac('sha1', salt()).update(str).digest('hex');
};

/**
 * Generate a id
 */
Base.prototype.makeId = function(len) {
  return Math.random().toString(36).substr(2,len);
};

/**
 * Sync with redis
 */
Base.prototype.sync = function(method, model, options) {
  console.log('method', method);
  console.log('model', model);
  console.log('options', options);
};