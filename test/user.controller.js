var expect = require('expect.js'),
    request = require('./support/request'),
    client = require('../support/client'),
    User = require('../models/user'),
    Group = require('../models/group'),
    app = require('../app.js');

function encodeBasicAuth(user, pass) {
  return 'Basic ' + new Buffer(user + ':' + pass).toString('base64');
}

describe('User Controller', function() {
  var user = undefined;

  // Run before starting the suite
  before(function(done) {
    if(client.connected) return done();
    client.on('ready', done);
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
          // Set the user for the rest of the tests
          user = new User(body);

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
          expect(body.email).to.be('mattmuelle@gmail.com');
          expect(body.id).to.be.ok();
          expect(body.username).to.not.be.ok();
          expect(body.groups).to.be.an(Array);
          done();
        });
    });

  });

  describe('POST /join', function() {
    var group = { id : '123abc', name : 'Javascript'},
        usergroup = { id : '123bc', color : 'purple', name : 'JS' };

    it('should join a group that exists', function(done) {
      Group.create(group, function(err, model) {
        
        request(app)
          .post('/join')
          .set('Content-Type', 'application/json')
          .set('Authorization', encodeBasicAuth('mattmuelle@gmail.com', 'test'))
          .write(JSON.stringify(usergroup))
          .end(function(res) {
            console.log(res.body);
            done();
          });

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