var request = require('request'),
    qs = require('querystring');



var body = {
  email : "blah@gmail.com",
  first : "Matt",
  last : "Mueller",
  password : "test"
};

var options = {
  uri : '/users',
  port : 8080,
  method : 'post'
  // body : qs.stringify(body)
};

request(options, function(err, res, body) {
  if(err) throw err;

  console.log(body);
});