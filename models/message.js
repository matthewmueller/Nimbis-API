var Base = require('./base'),
    _ = require('underscore');

/*
 * Extend the base model
 */
var Message = module.exports = _.extend(Base, {});

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

  this.set(attrs, { silent : true });
};