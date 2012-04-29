var expect = require('expect.js'),
    request = require('./support/request'),
    client = require('../support/client'),
    app = require('../app.js');

function encodeBasicAuth(user, pass) {
  return 'Basic ' + new Buffer(user + ':' + pass).toString('base64');
}

describe('User Controller', function() {

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
          console.log(res.body);
          done();
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


//.set('Authorization', encodeBasicAuth('mattmuelle@gmail.com', 'test'))