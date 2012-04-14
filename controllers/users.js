var User = require('../models/user');

// GET /users
exports.index = function(req, res) {
  
};

// POST /users
// curl -d "email=matt&pass=test" localhost:8080/users
exports.create = function(req, res) {
  var body = req.body;

  User.exists(body.username, function(err, exists) {
    if(err) res.send(err);
    if(exists) res.send("This user already exists!");

    var user = new User();
    user.create(body, function(err) {
      if(err) res.send(err);
      res.send('Successfully created group: ' + body.username);
    }); 
  });
};

// GET /users/:username
// curl -HAccept:text/json localhost:8080/users/matt
exports.show = function(req, res) {
  var params = req.params;

  User.find(params.username, function(err, user) {
    if(err) res.send(err);
    else if(!user) res.send('Couldn\'t find user');

    res.json(user);
  });
};