var _ = require('underscore'),
    Message = require('../models/message'),
    Group = require('../models/group'),
    utils = require('../support/utils'),
    after = utils.after;

// GET /messages
// curl localhost:8080/messages
// This will get messages available to specific user
exports.index = function(req, res) {
  var messages = [],
      user = req.user.toJSON(),
      ids = _(user.groups).pluck('id'),
      finished = after(ids.length);

  if(!ids.length) return res.send([]);

  var done = function(err, messages) {
    if(err) throw err;
    res.send(messages);
  };

  _.each(ids, function(id) {

    Group.getMessagesById(id, {}, function(err, msgs) {
      if(err) throw err;
      messages = messages.concat(msgs);

      if(finished()) {
        return fetchMessages(messages, done);
      }
    });
  });

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

/*
 * Helper - Fetch messages
 */
function fetchMessages(messages, fn) {
  messages = _.uniq(messages),
  finished = after(messages.length),
  message;

  _.each(messages, function(msg, i) {
    message = new Message({ id : msg });

    message.fetch(function(err, model) {
      if(err) return fn(err);

      messages[i] = model;

      if(finished()) return fn(null, messages);

    });

  });
}




