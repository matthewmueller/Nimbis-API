var Base = require('./base');

/*
 * Extend the Base collection
 */
var Messages = module.exports = Base.extend();

/*
 * Name the collection
 */
Messages.prototype.name = 'messages';

/*
 * Set the model
 */
Messages.prototype.model = require('../models/message');

// Static Properties
// -----------------
Messages.create = function(messages, fn) {
  messages = new Messages(messages);
  messages.save(fn);
};

Messages.find = function(ids, fn) {
  ids = ids.map(function(id) { return { id : id }; });
  var messages = new Messages(ids);
  messages.fetch(fn);
};