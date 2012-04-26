var Backbone = require('Backbone'),
    _ = require('underscore');

/*
 * Extend the Backbone Collection
 */
var Base = module.exports = Backbone.Collection.extend();

/*
 * Overwrite sync
 */
Base.prototype.sync = require('../support/redis.sync');

/*
 * Fetch a collection
 */
var _fetch = Base.prototype.fetch;
Base.prototype.fetch = function(options, fn) {
  if(_.isFunction(options)) fn = options;

  // Pass the callback through to sync
  options._callback = fn;

  _fetch.call(this, options);
};
