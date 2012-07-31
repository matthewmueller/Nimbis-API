var expect = require('expect.js'),
    User = require('../models/user'),
    client = require('../support/client'),
    Index = require('../structures/hash');

// Default user options
var attrs = {
  name : 'Matt Mueller',
  email : 'mattmuelle@gmail.com',
  password : 'test'
};

describe('User Model', function() {
  var user;

  // Run before starting the suite
  before(function(done) {
    if(client.connected) return done();
    client.on('ready', done);
  });

  // Run before each
  beforeEach(function() {
    user = new User(attrs);
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

    it('should save an email index', function(done) {
      user.save(function(err, model) {
        if(err) return done(err);
        var index = new Index('index:email:id');
        index.get(model.get('email'), function(err, data) {
          if(err) return done(err);
          expect(data).to.be(model.id);
          done();
        });
      });
    });

    it('should save a username index if a username is set', function(done) {
      user.set('username', 'matt');
      user.save(function(err, model) {
        if(err) return done(err);
        var index = new Index('index:username:id');
        index.get(model.get('username'), function(err, data) {
          if(err) return done(err);
          expect(data).to.be(model.id);
          done();
        });
      });
    });

  });

  describe('#destroy(fn)', function() {

    beforeEach(function(done) {
      user.save(done);
    });

    it('should remove a user by id', function(done) {
      var id = user.get('id');
      User.find(id, function(err, model) {
        expect(err).to.be(null);
        expect(model.get('id')).to.equal(id);

        user.destroy(function(err) {
          expect(err).to.be(null);

          User.find(id, function(err, model) {
            expect(err).to.be(null);
            expect(model).to.be(false);
            done();
          });
        });

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
    it('should check existence of a user by email', function(done) {
      user.save(function(err, model) {
        User.exists(model.get('email'), function(err, id) {
          if(err) return done(err);
          expect(id).to.be.ok();
          expect(id).to.be(model.id);
          done();
        });
      });
    });

    it('should check existence of a user by username', function(done) {
      user.set({
        email : 'lol@lol.com',
        username : 'matt'
      });
      user.save(function(err, model) {
        User.exists(model.get('username'), function(err, id) {
          if(err) return done(err);
          expect(id).to.be.ok();
          expect(id).to.be(model.id);
          done();
        });
      });
    });

    it('should fail on a random email', function(done) {
      user = new User({ email : 'haha@haha.com' });
      User.exists(user.get('email'), function(err, id) {
        if(err) return done(err);
        expect(id).to.be(false);
        done();
      });
    });

    it('should fail on a random username', function(done) {
      user = new User({ username : 'test' });
      User.exists(user.get('username'), function(err, id) {
        if(err) return done(err);
        expect(id).to.be(false);
        done();
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