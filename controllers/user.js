var User = require('../models/user'),
    Group = require('../models/group'),
    _ = require('underscore');

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

// POST /join
exports.join = function(req, res) {
  var body = req.body,
      user = req.user,
      groups = user.get('groups');

  var id = _(groups).find(function(group) {
    return group.id === body.id;
  });

  // If already exists, just return
  if(id) {
    return res.send(200);
  }

  // Check if the group exists
  var group = new Group(body);
  group.fetch(function(err, model) {
    if(!model) {
      return res.send('Group: ' + body.id + ' doesnt exist!');
    }

    // Add to the group
    groups.push(body);
    user.set('groups', groups);

    // Save the user
    user.save(function(err, model) {
      if(err) throw err;
      res.send(user);
    });
  });

};