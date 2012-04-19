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

exports.create = function(model, options, fn) {
  var name = model.name.toLowerCase(),
      data = model.toJSON(),
      id  = [name, data.id].join(':');

  // Queue up writes
  var queue = client.multi();

  _.each(data, function(key, value) {
    client.hset(id, key, value);
  });

  // Save the indexes
  _.each(options.indexes, function(index, attr) {
    var key = attr[0],
        value = attr[1];

    client.hset(index, key, value);
  });

  // Save to database
  queue.exec(function(err) {
    return fn(err, model);
  });
};