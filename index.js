var app = require('./app'),
    client = require('./support/client');

/*
 * Listen
 */
app.listen(8000);
console.log("Server listening on port 8000");

/*
 * Connect to redis
 */

// Redis events
client.on('ready', function() {
  console.log('Redis listening on port: %d', client.port);
});

client.on('error', function() {
  console.log('Redis: Unable to connect to redis database');
});