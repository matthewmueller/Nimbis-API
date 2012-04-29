var _ = require('underscore'),
    expect = require('expect.js'),
    Message = require('../models/message'),
    List = require('../structures/List'),
    client = require('../support/client');

// Default user options
var attrs = {
  message : 'Hi world!',
  groups : ['abc123', '123abc'],
  author : {
    id : '654321',
    name : 'Matt Mueller'
  }
};

describe('Message Model', function() {
  var message;

  // Run before starting the suite
  before(function(done) {
    if(client.connected) return done();
    client.on('ready', done);
  });

  // Run before each
  beforeEach(function() {
    message = new Message(attrs);
  });

  // #initialize()
  describe('#initialize()', function() {
    it('should create an empty new message', function(done) {
      message = new Message(attrs);
      expect(message.get('id')).to.be.ok();
      return done();
    });
  });

  // #isNew()
  it('#isNew()', function(done) {
    expect(message.isNew()).to.be(true);
    message.save(function(err, model) {
      expect(model.isNew()).to.be(false);
      done();
    });
  });

  // #save(fn)
  describe('#save()', function() {
    it('should save a new message', function(done) {
      message.save(function(err, model) {
        if(err) return done(err);
        expect(model.get('message')).to.be('Hi world!');
        expect(model.get('created_at')).to.be.a(Date);
        done();
      });
    });

    it('should create a list of group IDs to messages', function(done) {
      var list = new List();
      message.save(function(err, model) {
        var groups = model.get('groups'),
            wait = groups.length;

        _.each(groups, function(group) {
          list.key = 'list:group:'+ group +':messages';
          list.get(0, function(err, message) {
            if(err) return done(err);
            expect(message).to.be(model.id);
            if(--wait <= 0) return done();
          });
        });

      });
    });
  });

  // #fetch(fn)
  describe('#fetch', function() {
    it('should find a message by id', function(done) {
      // Save an initial model
      message.save(function(err, model) {
        message = new Message({id : model.id});
        expect(message.get('message')).to.be(undefined);

        // Fill in the rest
        message.fetch(function(err, message) {
          if(err) return done(err);
          expect(model.get('message')).to.be('Hi world!');
          done();
        });
      });

    });
  });

  // Flush the database after each test
  after(function(done) {
    client.flushdb(function(err) {
      if(err) return done(err);
      done();
    });
  });

});