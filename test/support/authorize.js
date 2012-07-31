var app = require('../../app'),
    request = require('./request');

function sid(res) {
  var val = res.headers['set-cookie'];
  if(!val) return '';
  return (/^sessionId=([^;]+);/).exec(val[0])[1];
}

module.exports = function(email, password, fn) {
  request(app)
    .post('/authorize')
    .set('Content-Type', 'application/json')
    .write(JSON.stringify({ email : email, password : password }))
    .end(function(res) {
      var id = sid(res);
      fn(null, id);
    });
};