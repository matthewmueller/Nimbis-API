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

var groups = [
  { id : 123456, name : 'Javascript'},
  { id : 654321, name : 'Soccer'}
];

var user = {
  name : 'Matt',
  email : 'mattmuelle@gmail.com',
  password : 'test',
  groups : groups
};

describe('User Controller', function() {

  // Run before starting the suite
  before(function(done) {
    if(client.connected) return done();
    client.on('ready', done);

    groups = new Groups(groups),
    user = new User(user);

    groups.save(function(err, collection) {
      if(err) return done(err);
      user.save(function(err, model) {
        if(err) return done(err);
        return done();
      });
    });
  });

  describe('POST /messages', function() {

    it('should create a new message', function(done) {

      console.log(user);

    });
  });

});