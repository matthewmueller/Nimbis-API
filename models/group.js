var Base = require('./base'),
    redis = require('../support/client');

var Group = module.exports = Base.extend();

/*
 * Name of the model
 */
Group.prototype.name = 'group';

/*
 * Initialize a group model
 */
Group.prototype.initialize = function() {
  var attrs = this.toJSON();

  attrs.id = attrs.id || this.makeId(6);

  // Set up the index
  this.index('group:id', attrs.name, attrs.id);

  this.set(attrs, { silent : true });
};

/*
 * Static: Get messages by group
 */
Group.getMessagesById = function(groupID, options, fn) {
  option = options || {};

  // Number of messages to return
  options.limit = options.limit || 50;

  // Offset
  options.offset = options.offset || 0;

  // List
  var list = 'l:group:' + groupID + ':messages';

  // Run the redis query
  redis.lrange(list, options.offset, options.limit, fn);

};
