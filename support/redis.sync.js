var _ = require('underscore'),
    Hash = require('../structures/hash'),
    after = require('./utils').after,
    isObject = _.isObject,
    isArray  = Array.isArray,
    stringify = JSON.stringify,
    parse = JSON.parse;

exports = module.exports = function(method, options, fn) {
  options = options || {};

  var datastore = this;

  // Call a method based on the type of save
  exports[method](datastore, options, function(err) {
    if(err) return fn(err);
    return fn(null, datastore);
  });
};

/*
 * Create an entry
 */
exports.create = function(ds, options, fn) {
  var name = ds.name.toLowerCase(),
      data = ds.toJSON(),
      key  = [name, data.id].join(':');

  // Create a new hash
  var hash = new Hash(key);

  // Any objects 2 levels deep, stringify
  _.each(data, function(value, attr) {

    if(isArray(value)) {
      data[attr] = value.toString();
    }
    if(isObject(value)) {
      data[attr] = stringify(value);
    }

  });

  // Save the hash
  hash.set(data, fn);
};

/*
 * Update an entry
 */
exports.update = function(ds, options, fn) {
  var name = ds.name.toLowerCase(),
      data = ds.changedAttributes(),
      key  = [name, data.id].join(':');

  // Create a new hash
  var hash = new Hash(key);

  // Any objects 2 levels deep, stringify
  _.each(data, function(value, attr) {

    if(isArray(value)) {
      data[attr] = value.toString();
    }
    if(isObject(value)) {
      data[attr] = stringify(value);
    }

  });

  // Save the hash
  hash.set(data, fn);
};

/*
 * Read an entry or two
 */
exports.read = function(ds, options, fn) {
  // convert everything into an array
  var models = (ds.models) ? ds.models : [ds],
      finished = after(models.length),
      json = [],
      hash = new Hash();

  function done() {
    // If its a model, use set, if collection use reset
    if(ds.set) ds.set(json[0]);
    else ds.reset(json);

    return fn();
  }

  _(models).each(function(model) {
    var name = model.name.toLowerCase(),
        key  = [name, model.id].join(':'),
        rArray = /^\[.*\]$/;

    // Update the hash key
    hash.key = key;
    
    hash.get(function(err, data) {
      if(err) return fn(err);
      else if(_.isEmpty(data)) return fn(null, false);

      _.each(data, function(value, attr) {
        // Hacky way to get stringified array back to an array
        if(rArray.test(value)) {
          data[attr] = parse(value);
        }
      });

      // Recursive JSON.parse
      json.push(parse(stringify(data)));

      if(finished()) return done();
    });

  });
};
