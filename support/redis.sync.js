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

exports.create = function(ds, options, fn) {
  var name = ds.name.toLowerCase(),
      data = ds.toJSON(),
      key  = [name, data.id].join(':');

  // Queue the writes
  var queue = client.multi();

  // Save the backbone model/collection
  _.each(data, function(value, attr) {
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

exports.read = function(ds, options, fn) {
  var name = ds.name.toLowerCase(),
      data = ds.toJSON(),
      key  = [name, data.id].join(':');

  client.hgetall(key, function(err, data) {
    if(err) return fn(err);

    // Add in the data
    ds.set(data, { silent : true });
    
    return fn(null, ds);
  });
};