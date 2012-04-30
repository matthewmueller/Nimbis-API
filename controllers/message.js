var _ = require('underscore'),
    Message = require('../models/message'),
    Messages = require('../collections/messages'),
    Group = require('../models/group'),
    List = require('../structures/List'),
    after = require('../support/utils').after;

// GET /messages
// curl localhost:8080/messages
// This will get messages available to specific user
exports.index = function(req, res) {
  var messageIds = [],
      user = req.user.toJSON(),
      ids = _(user.groups).pluck('id');

  if(!ids.length) return res.send([]);

  var finished = after(ids.length),
      list = new List();

  _.each(ids, function(id) {
    list.key = 'list:group:'+ id +':messages';
    list.get(0, 50, function(err, data) {
      if(err) return res.send(err);
      // Merge with other messageIds
      messageIds = messageIds.concat(data);
      if(finished()) fetchMessages(messageIds);
    });
  });

  function fetchMessages(messages) {
    messages = _.uniq(messages);
    Messages.find(messages, done);
  }

  function done(err, messages) {
    if(err) return res.send(err);
    res.send(messages);
  }

};

// POST /messages
exports.create = function(req, res) {
  var body = req.body,
      user = req.user.toJSON();

  // Add the author
  body.author = {
    id : user.id,
    name : user.name
  };

  Message.create(body, function(err, model) {
    if(err) return res.send(err);
    res.send(model);
  });
};




