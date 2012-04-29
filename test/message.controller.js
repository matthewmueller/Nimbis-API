var expect = require('expect.js'),
    request = require('./support/request'),
    client = require('../support/client'),
    User = require('../models/user'),
    Group = require('../models/group'),
    Message = require('../models/message'),
    app = require('../app.js');

function encodeBasicAuth(user, pass) {
  return 'Basic ' + new Buffer(user + ':' + pass).toString('base64');
}

describe('User Controller', function() {
  var user;

  // Run before starting the suite
  before(function(done) {
    if(client.connected) return done();
    client.on('ready', done);
  });


});