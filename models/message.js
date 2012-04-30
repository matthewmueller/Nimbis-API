var _ = require('underscore'),
    Base = require('./base'),
    List = require('../structures/list'),
    utils = require('../support/utils'),
    after = utils.after;

/*
 * Extend the base model
 */
var Message = module.exports = Base.extend();

/*
 * Name of the model
 */
Message.prototype.name = 'message';

/*
 * Required attributes
 */
Message.prototype.requires = ['author', 'groups', 'message'];

/*
 * Types
 */
Message.prototype.types = {
  id : String,
  message : String,
  groups : Array,
  author : Object
};

/*
 * Initialize a message model
 */
Message.prototype.initialize = function() {
  var attrs = this.toJSON();

  attrs.id = attrs.id || this.makeId(6);

  this.set(attrs, { silent : true });
};

/*
 * Extend save to add messages to group lists
 */
Message.prototype.onSave = function(model, fn) {

  var groups = model.get('groups'),
      list = new List(),
      messageId = model.get('id'),
      finished = after(groups.length);

  function done(err) {
    if(err) return fn(err);
    else if(finished()) {
      return fn(null, model);
    }
  }

  // Add messageID to each group
  _.each(groups, function(group) {
    // Example Key - list:group:sah123j:messages
    list.key = 'list:group:'+ group +':messages';
    list.unshift(messageId, done);
  });

};

