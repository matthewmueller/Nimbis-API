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

  // Sync the model with the database
  this.sync('read', options, function(err, model) {

    // Call hooks if available
    if(err && model.onError) {
      model.onError.call(model, err, fn);
    } else if(!err && model.onFetch) {
      model.onFetch.call(model, model, fn);
    } else {
      fn(err, model);
    }

  });
};
