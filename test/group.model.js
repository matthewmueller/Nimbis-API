var expect = require('expect.js'),
    Group = require('../models/group'),
    client = require('../support/client');

// Default user options
var attrs = {
  name : 'Javascript'
};

describe('Group Model', function() {
  var group;

  // Run before starting the suite
  before(function(done) {
    if(client.connected) return done();
    client.on('ready', done);
  });

  // Run before each
  beforeEach(function() {
    group = new Group(attrs);
  });

  // #initialize()
  describe('#initialize()', function() {
    it('should create an empty new group', function(done) {
      group = new Group(attrs);
      expect(group.get('id')).to.be.ok();
      expect(group.get('type')).to.be('public');
      return done();
    });
  });

  // #isNew()
  it('#isNew()', function(done) {
    expect(group.isNew()).to.be(true);
    group.save(function(err, model) {
      expect(model.isNew()).to.be(false);
      done();
    });
  });

  // #save(fn)
  describe('#save()', function() {
    it('should save a new group', function(done) {
      group.save(function(err, model) {
        if(err) return done(err);
        expect(model.get('name')).to.be('Javascript');
        expect(model.get('created_at')).to.be.a(Date);
        done();
      });
    });
  });

  // #fetch(fn)
  describe('#fetch', function() {
    it('should find a group by id', function(done) {
      // Save an initial model
      group.save(function(err, model) {
        group = new Group({id : model.id});
        expect(group.get('name')).to.be(undefined);

        // Fill in the rest
        group.fetch(function(err, group) {
          if(err) return done(err);
          expect(model.get('name')).to.be('Javascript');
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