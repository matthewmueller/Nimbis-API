var Base = require('./base');

var Comment = module.exports = Base.extend();

/*
 * Name of the model
 */
Comment.prototype.name = 'comment';

/*
 * Initialize a comment model
 */
Comment.prototype.initialize = function() {
  var attrs = this.toJSON();

  attrs.id = attrs.id || this.makeId(10);

  this.set(attrs, { silent : true });
};


