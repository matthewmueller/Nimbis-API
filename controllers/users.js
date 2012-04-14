var User = require('../models/user');

// GET /users
exports.index = function(req, res) {
  
};

// POST /users
// curl -d "email=matt&pass=test" localhost:8080/users
exports.create = function(req, res) {
  var body = req.body;

  User.find(body.username, function(err, user) {
    if(err) res.send(err);
    else if(user) res.send("This user already exists!");

    user = new User();
    user.create(body, function(err) {
      if(err) res.send(err);
      res.send('created a new user');
    }); 
  });
};

// GET /users/:username
// curl -HAccept:text/json localhost:8080/users/matt
exports.show = function(req, res) {
  var body = req.body;

  User.find(body.username, function(err, user) {
    if(err) res.send(err);
    else if(!user) res.send('Couldn\'t find user');

    res.json(user);
  });
};