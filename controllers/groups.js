var Group = require('../models/group');

// GET /groups
// curl localhost:8080/groups
exports.index = function(req, res) {
  console.log(req.user);
};

// POST /groups
// curl -d "name=Family&type=private&description=Family%20Time" localhost:8080/groups
exports.create = function(req, res) {
  var body = req.body,
      group = new Group();

  group.create(body, function(err) {
    if(err) {
      res.send(err);
    } else {
      res.send('Successfully created group: ' + body.name);
    }
  });
};

// GET /groups/:id
exports.show = function(req, res) {
  var params = req.params,
      id = params.id;

  Group.find(id, function(err, group) {
    if(err) res.send(err);
    else if(!group) res.send('Group doesn\'t exist!');

    // Found it, send json
    res.json(group);
  });
};