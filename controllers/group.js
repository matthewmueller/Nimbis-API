var Group = require('../models/group');

// GET /groups
// curl localhost:8080/groups
// TODO: Should get all the information about the groups I'm in
exports.index = function(req, res) {
  var user = req.user,
      groups = user.get('groups');

  res.send(groups);
};

// POST /groups
// curl -d "name=Family&type=private&description=Family%20Time" localhost:8080/groups
exports.create = function(req, res) {
  var body = req.body,

  group = new Group(body);

  group.save(function(err, model) {
    if(err) throw err;

    res.send(model);
  });
};

// GET /groups/:id
exports.show = function(req, res) {
  var params = req.params,
      group = new Group({ id : params.id });

  group.fetch(function(err, model) {
    if(err) throw err;

    res.send(model);
  });
};