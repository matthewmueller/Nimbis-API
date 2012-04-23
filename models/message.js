var Base = require('./base'),
    redis = require('../').redis,
    utils = require('../support/utils'),
    after = utils.after,
    _ = require('underscore');

/*
 * Extend the base model
 */
var Message = module.exports = Base.extend();

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
 * Name of the model
 */
Message.prototype.name = 'message';

/*
 * Initialize a message model
 */
Message.prototype.initialize = function() {
  var attrs = this.toJSON();

  attrs.id = attrs.id || this.makeId(6);

  if(attrs.groups)
    console.log('groups', attrs.groups);

  this.set(attrs, { silent : true });
};

/*
 * Save the message in group lists
 */
Message.prototype.save = function(options, fn) {
  if(!redis.connected) fn(new Error('Redis not connected'));

  var self = this,
      groups = self.toJSON().groups,
      _save  = Base.prototype.save;

  if(!groups.length) return fn(new Error('No groups specified'));

  var finished = after(groups.length);

  _(groups).each(function(group) {
    redis.lpush('l:group:'+ group +':messages', self.id, function(err) {
      if(err) return fn(err);

      // Pass on to base save
      if(finished()) return _save.call(self, options, fn);
    });
  });
};