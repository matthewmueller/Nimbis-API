var Backbone = require('Backbone'),
    _ = require('underscore'),
    after = require('../support/utils').after;

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

/*
 * Save a collection
 *
 * Note: In order to not have to queue actions (update vs. create),
 * we will loop through the models and call their save methods
 *
 */
Base.prototype.save = function(fn) {
  var collection = this,
      finished = after(collection.length);

  collection.each(function(model, i) {
    model.save(function(err, dataModel) {
      if(err) return fn(err);
      collection[i] = dataModel;
      if(finished()) return fn(null, collection);
    });
  });
};

// Static Properties
// -----------------
Base.create = function(collection, fn) {
  collection = new this(collection);
  collection.save(fn);
};

Base.find = function(ids, fn) {
  ids = ids.map(function(id) { return { id : id }; });
  var collection = new this(ids);
  collection.fetch(fn);
};