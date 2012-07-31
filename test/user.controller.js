var expect = require('expect.js'),
    request = require('./support/request'),
    authorize = require('./support/authorize'),
    client = require('../support/client'),
    User = require('../models/user'),
    Group = require('../models/group'),
    app = require('../app.js');

var userAttrs = {
  name : 'Matt Mueller',
  email : 'matt@matt.com',
  password : 'test'
};

describe('User Controller', function() {
  var user, sessionId;

  // Create a test user and get their session ID
  before(function(done) {
    User.create(userAttrs, function(err, model) {
      if(err) return done(err);
      user = model;
      authorize(userAttrs.email, userAttrs.password, function(err, sid) {
        if(err) return done(err);
        sessionId = sid;
        done();
      });
    });
  });

  describe('POST /users', function() {

    it('should create a new user', function(done) {
      request(app)
        .post('/users')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .write('name=Matt Mueller&email=mattmuelle@gmail.com&password=test')
        .end(function(res) {
          var body = JSON.parse(res.body);
          expect(body.name).to.be('Matt Mueller');
          expect(body.email).to.be('mattmuelle@gmail.com');
          expect(body.id).to.be.ok();
          expect(body.salt).to.be.ok();
          expect(body.password).to.have.length(40);
          expect(body.groups).to.be.an(Array);
          expect(body.groups).to.be.empty();

          done();
        });

    });

  });

  describe('GET /users/:id', function() {
    it('should get a user by id', function(done) {
      var id = user.get('id');

      request(app)
        .get('/users/'+id)
        .end(function(res) {
          var body = JSON.parse(res.body);
          expect(body.name).to.be('Matt Mueller');
          expect(body.email).to.be('matt@matt.com');
          expect(body.id).to.be.ok();
          expect(body.username).to.not.be.ok();
          expect(body.groups).to.be.an(Array);
          done();
        });
    });

  });

  describe('POST /join', function() {
    var group = { id : '123abc', name : 'Javascript'},
        usergroup = { id : '123abc', color : 'purple', name : 'JS' };

    before(function(done) {
      Group.create(group, done);
    });

    it('should join a group that exists', function(done) {
        
      request(app)
        .post('/join')
        .set('Content-Type', 'application/json')
        .set('Cookie', 'sessionId=' + sessionId)
        .write(JSON.stringify(usergroup))
        .end(function(res) {
          var body = JSON.parse(res.body);
          expect(body.groups[0].id).to.be('123abc');
          expect(body.groups[0].name).to.be('JS');
          expect(body.groups[0].color).to.be('purple');
          done();
        });

    });


  });

  // Flush the database after the test set
  after(function(done) {
    client.flushdb(function(err) {
      if(err) return done(err);
      done();
    });
  });

});


//.set('Authorization', encodeBasicAuth('mattmuelle@gmail.com', 'test'))