var expect = require('expect.js'),
    Messages = require('../collections/messages'),
    client = require('../support/client');

var messages = [
  {
    message : 'Hi world!',
    groups : ['abc123', '123abc'],
    author : {
      id : '654321',
      name : 'Matt Mueller'
    }
  },
  {
    message : 'Hi back!',
    groups : ['123abc'],
    author : {
      id : '123456',
      name : 'Jim Bean'
    }
  }
];

describe('Messages Collection', function() {
  var messages = undefined;

  // Run before starting the suite
  before(function(done) {
    if(client.connected) return done();
    client.on('ready', done);
  });

  // Run before each
  beforeEach(function() {
    messages = new Messages(attrs);
  });

  // #initialize()
  describe('#initialize()', function() {
    it('should create a new message collection', function(done) {
      messages = new Messages(attrs);

      console.log(messages);
      return done();
    });
  });



});