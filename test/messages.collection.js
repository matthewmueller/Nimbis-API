var expect = require('expect.js'),
    _ = require('underscore'),
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

      expect(msgs[0]).to.be('Hi world!');
      expect(ids[0]).to.be.ok();
      expect(msgs[1]).to.be('Hi back!');
      expect(ids[1]).to.be.ok();
      return done();
    });
  });

  // #fetch(fn)
  describe('#fetch', function() {
    it('should find a message by id', function(done) {
      saveMessages(messages, function(err, models) {
        if(err) return done(err);
        var ids = _(models).pluck('id'),
            col = [];

        // Turn ids array into array of objects [{ id : id }, ...]
        _.each(ids, function(id) {
          col.push({ id : id });
        });

        messages = new Messages(col);
        messages.fetch(function(err, collection) {
          if(err) return done(err);
          var msgs = collection.pluck('message');
          expect(msgs).to.contain('Hi world!');
          expect(msgs).to.contain('Hi back!');
          done();
        });
      });
    });
  });

  // Utility: Save some messages
  var saveMessages = function(messages, fn) {
    var wait = messages.length,
        out = [];
    messages.each(function(message) {
      message.save(function(err, model) {
        if(err) return fn(err);
        out.push(model.toJSON());
        if(--wait <= 0) return fn(null, out);
      });
    });
  };

  describe('#save()', function() {
    it('should save a new message', function(done) {
      messages.save(function(err, collection) {
        if(err) return done(err);
        
        collection.each(function(message) {
          expect(message.get('created_at')).to.be.a(Date);
        });

        done();
      });
    });
  });

});