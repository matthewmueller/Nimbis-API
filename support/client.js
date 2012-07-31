var redis = require('redis'),
    env = process.env.NODE_ENV || 'development',
    db = 0;

// Select which database we want to use
if(env === 'production')
  db = 1;
else if(env === 'test')
  db = 2;

var create = exports.create = function(options) {
  options = options || {};
  options.db = options.db || db;

  var client = redis.createClient(null, null, { detect_buffers : true });

  // Prevents any operations from happening in between creating the client
  // and selecting the database. Was running into a situation where I would
  // create data on db = 0, and try to read it on db = 2.
  //
  // https://github.com/visionmedia/connect-redis/blob/master/lib/connect-redis.js#L61
  client.select(options.db);
  client.on('connect', function() {
    client.send_anyways = true;
    client.select(options.db);
    client.send_anyways = false;
  });

  return client;
};


module.exports = create();