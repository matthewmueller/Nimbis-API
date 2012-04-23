var Message = require('../models/message');

// GET /messages
// curl localhost:8080/messages
// This will get messages available to specific user
exports.index = function(req, res) {
  var user = req.user.toJSON();

  console.log('groups', user.groups);

};

// POST /messages
exports.create = function(req, res) {
  var body = req.body,
      user = req.user.toJSON();

  // Split the group string
  body.groups = body.groups.split(',');

  // Add the author
  body.author = {
    id : user.id,
    name : user.name
  };

  // Create a new message
  var message = new Message(body);

  message.save(function(err, model) {
    if(err) throw err;

    res.send(model);
  });
};