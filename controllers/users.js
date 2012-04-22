var User = require('../models/user');

// GET /users
exports.index = function(req, res) {
  
};

// POST /users
// curl -d "email=matt&pass=test" localhost:8080/users
exports.create = function(req, res) {
  var body = req.body;

  var user = new User(body);

  user.save(function(err, model) {
    if(err) throw err;

    res.send(model);
  });

};

// GET /users/:username
// curl -HAccept:text/json localhost:8080/users/matt
exports.show = function(req, res) {
  var params = req.params;

  var user = new User({ username : params.username });

  user.fetch(function(err, model) {
    if(err) throw err;

    res.send(model);
  });
};