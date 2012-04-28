var expect = require('expect.js'),
    User = require('../models/user'),
    client = require('../support/client');

// Default user options
var attrs = {
  name : 'Matt Mueller',
  email : 'mattmuelle@gmail.com',
  password : 'test'
}

describe('User Model', function() {
  var user = undefined;

  beforeEach(function(done) {
    user = new User(attrs);
    if(client.connected) return done();
    client.on('ready', done);
  });

  // #initialize()
  describe('#initialize()', function() {
    it('should create an empty new user', function(done) {
      return done();
    });
  });

  // #isNew()
  it('#isNew()', function(done) {
    expect(user.isNew()).to.be(true);
    user.save(function(err, model) {
      expect(model.isNew()).to.be(false);
      done();
    });
  });

  // #save(fn)
  describe('#save()', function() {
    it('should save a new user', function(done) {
      user.save(function(err, model) {
        if(err) return done(err);
        expect(model.get('email')).to.be('mattmuelle@gmail.com');
        expect(model.get('created_at')).to.be.a(Date);
        done();
      });
    });
  });

  // #fetch(fn)
  describe('#fetch', function() {
    it('should find a user by id', function(done) {
      // Save an initial model
      user.save(function(err, model) {
        user = new User({id : model.id});
        expect(user.get('email')).to.be(undefined);

        // Fill in the rest
        user.fetch(function(err, user) {
          if(err) return done(err);
          expect(model.get('email')).to.be('mattmuelle@gmail.com');
          done();
        });
      });

    });
  });

  // .exists(id, fn)
  describe('.exists', function() {
    it('should check existence of a user by his email', function(done) {
      user.save(function(err, model) {
        User.exists(model.get('email'), function(err, id) {
          if(err) return done(err);
          expect(id).to.be.ok();
          expect(id).to.be(model.id);
          done();
        });
      });
    });

  });

  // Flush the database after each test
  // afterEach(function(done) {
  //   client.flushdb(function(err) {
  //     if(err) return done(err);
  //     done();
  //   })
  // });



});