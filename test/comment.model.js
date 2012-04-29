var expect = require('expect.js'),
    Comment = require('../models/comment'),
    List = require('../structures/list'),
    client = require('../support/client');

// Default user options
var attrs = {
  comment : 'Cool story bro',
  messageId : 'abc123',
  author : {
    name : 'Matt Mueller',
    id : '123abc'
  }
};

describe('Comment Model', function() {
  var comment;

  // Run before starting the suite
  before(function(done) {
    if(client.connected) return done();
    client.on('ready', done);
  });

  // Run before each
  beforeEach(function() {
    comment = new Comment(attrs);
  });

  // #initialize()
  describe('#initialize()', function() {
    it('should create an empty new comment', function(done) {
      comment = new Comment(attrs);
      expect(comment.get('id')).to.be.ok();
      expect(comment.get('id')).to.have.length(12);
      expect(comment.get('messageId')).to.be('abc123');
      return done();
    });
  });

  // #save(fn)
  describe('#save()', function() {
    it('should save a new comment', function(done) {
      comment.save(function(err, model) {
        if(err) return done(err);
        expect(model.get('comment')).to.be('Cool story bro');
        expect(model.get('created_at')).to.be.a(Date);
        done();
      });
    });

    it('should create a list of comments per messageId', function(done) {
      var list = new List();
      comment.save(function(err, model) {
        if(err) return done(err);
        var messageId = model.get('messageId');
        list.key = 'list:message:'+ messageId +':comments';
        list.get(0, function(err, comment) {
          expect(comment).to.be(model.id);
          done();
        });
      });
    });
  });

  // #fetch(fn)
  describe('#fetch', function() {
    it('should find a comment by id', function(done) {
      // Save an initial model
      comment.save(function(err, model) {
        comment = new Comment({id : model.id});
        expect(comment.get('coment')).to.be(undefined);

        // Fill in the rest
        comment.fetch(function(err, comment) {
          if(err) return done(err);
          expect(model.get('comment')).to.be('Cool story bro');
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
    })
  });
});