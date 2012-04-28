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

  var client = redis.createClient(null, null, { detect_buffers : true });

  client.on('connect', function() {
    client.select(options.db || db);
  })

  return client;
};


module.exports = create();