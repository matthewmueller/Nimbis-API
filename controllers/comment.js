var Comment = require('../models/comment');

// POST /comments
exports.create = function(req, res) {
  var body = req.body,
      messageId = req.params.message,
      user = req.user.toJSON();

  // Add the author
  body.author = {
    id : user.id,
    name : user.name
  };

  // Add the message Id
  body.messageId = messageId;

  // Create a new comment
  var comment = new Comment(body);

  comment.save(function(err, model) {
    if(err) throw err;

    res.send(model);
  });
};

// GET /comments
exports.index = function(req, res) {};