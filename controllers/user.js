var User = require('../models/user'),
    Group = require('../models/group'),
    _ = require('underscore');

// GET /users
exports.index = function(req, res) {
  
};

// POST /users
// curl -d "name=matt&email=matt@matt.com&password=test" localhost:8080/users
exports.create = function(req, res) {
  var body = req.body;

  var user = new User(body);

  user.save(function(err, model) {
    if(err) throw err;

    res.send(model);
  });

};

// GET /users/:id
// curl -HAccept:text/json localhost:8080/users/matt
exports.show = function(req, res) {
  var params = req.params;

  var user = new User({ id : params.id });

  user.fetch(function(err, model) {
    if(err) throw err;

    res.send(model);
  });
};

// POST /join
exports.join = function(req, res) {
  var body = req.body,
      user = req.user,
      // Clone is important, otherwise it updates model on push (without set)
      // Because it's an array, (ie. copied by reference not value)
      groups = _.clone(user.get('groups'));

  var id = _(groups).find(function(group) {
    return (group.id === body.id);
  });

  // If already exists, just return
  if(id) {
    return res.send(200);
  }

  Group.exists(body.id, function(err, id) {
    if(err) return res.send(err);
    else if(!id) return res.send(new Error('Group: ' + body.id + ' doesnt exist!'));

    // Add group to groups
    groups.push(body);

    // Silent, because we don't want to trigger change event right away
    // Maybe later we can be more optimistic
    user.set({ groups : groups }, { silent : true });

    user.save(function(err, model) {
      if(err) return res.send(err);
      res.send(model);
    });
  });

};