var expect = require('expect.js'),
    request = require('./support/request'),
    app = require('../app.js');

function encodeBasicAuth(user, pass) {
  return 'Basic ' + new Buffer(user + ':' + pass).toString('base64');
}

describe('User Controller', function() {



  describe('POST /users', function() {

    it('should create a new user', function(done) {
      
      request(app)
        .get('/groups')
        .set('Authorization', encodeBasicAuth('matt', 'test'))
        .end(function(res) {
          console.log(res);
          done();
        });

    });

  }); 


});


