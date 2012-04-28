var _ = require('underscore'),
    Hash = require('../structures/hash'),
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

    if(isArray(value) || isObject(value)) {
      data[attr] = stringify(value);
    }

  });

  // Save the hash
  hash.set(data, fn);
};



/*
 * Read an entry
 */
exports.read = function(ds, options, fn) {
  var name = ds.name.toLowerCase(),
      data = ds.toJSON(),
      key  = [name, data.id].join(':');

  var hash = new Hash(key);
  hash.get(function(err, data) {
    if(err) return fn(err);
    else if(_.isEmpty(data)) return fn(null, false);

    // Recursive JSON.parse
    data = parse(stringify(data));

    // Set the data
    ds.set(data);

    return fn(null, data);

  });
};