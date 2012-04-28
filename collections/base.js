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
Base.prototype.fetch = function(options, fn) {
  if(_.isFunction(options)) fn = options;

  // Sync the collection with the database
  this.sync('read', options, function(err, collection) {

    // Call hooks if available
    if(err && collection.onError) {
      collection.onError.call(collection, err, fn);
    } else if(!err && collection.onFetch) {
      collection.onFetch.call(collection, collection, fn);
    } else {
      fn(err, collection);
    }

  });
};
