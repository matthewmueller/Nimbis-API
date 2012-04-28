var expect = require('expect.js'),
    Messages = require('../collections/messages'),
    client = require('../support/client');

var collection = [
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
    messages = new Messages(collection);
  });

  // #initialize()
  describe('#initialize()', function() {
    it('should create a new message collection', function(done) {
      messages = new Messages(collection);

      var msgs = messages.pluck('message'),
          ids = messages.pluck('id');

      expect(ids[0]).to.be.ok();
      expect(msgs[1]).to.be('Hi back!');
      expect(ids[1]).to.be.ok();
      return done();
    });
  });



});