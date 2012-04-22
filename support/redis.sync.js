var redis = require('redis'),
    _ = require('underscore'),
    isConnected = false,
    client = null;

exports = module.exports = function(method, model, options) {
  // Yank out the callback
  var callback = options._callback;
  delete options._callback;

  // If we're not connected error out.
  if(!isConnected) return callback(new Error('Redis not ready'));

  // Delete unused options that backbone added
  delete options.success;
  delete options.error;

  // Call a method based on the type of save
  exports[method](model, options, callback);
};

exports.connect = function() {
  client = redis.createClient.apply(this, arguments);

  client.on('ready', function() {
    isConnected = true;
  });

  client.on('end', function() {
    isConnected = false;
  });

  return client;
};

/*
 * Create an entry
 */
exports.create = function(ds, options, fn) {
  var name = ds.name.toLowerCase(),
      data = ds.toJSON(),
      types = ds.types || {},
      key  = [name, data.id].join(':'),
      type;

  // Queue the writes
  var queue = client.multi();

  // Save the backbone model/collection
  _.each(data, function(value, attr) {
    type = types[attr];
    type = (type && type.name) ? type.name : 'String';

    // Stringify if we're working with a Object or Array
    if(type === 'Object' || type === 'Array') {
      value = JSON.stringify(value);
    }

    queue.hset(key, attr, value);
  });

  // Save the indexes
  _.each(options.indexes, function(attr, index) {
    
    // key : attr[0], value : attr[1]
    queue.hset(index, attr[0], attr[1]);
  
  });

  // Save to database
  queue.exec(function(err) {
    return fn(err, ds);
  });
};

/*
 * Read an entry
 */
exports.read = function(ds, options, fn) {
  var name = ds.name.toLowerCase(),
      data = ds.toJSON(),
      types = ds.types || {},
      key  = [name, data.id].join(':');

  client.hgetall(key, function(err, data) {
    if(err) return fn(err);
    if(_.isEmpty(data)) return fn(null, false);

    // Return proper types
    _.each(data, function(value, attr) {
      type = types[attr];
      type = (type && type.name) ? type.name : 'String';

      // Parse if we're working with a Object or Array
      if(type === 'Object' || type === 'Array') {
        data[attr] = JSON.parse(value);
      }
    });

    // Add in the data
    ds.set(data, { silent : true });
    
    return fn(null, ds);
  });
};