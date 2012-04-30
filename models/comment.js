var Base = require('./base'),
    List = require('../structures/list');

var Comment = module.exports = Base.extend();

/*
 * Name of the model
 */
Comment.prototype.name = 'comment';

/*
 * Required values
 */
Comment.prototype.requires = ['comment', 'author', 'messageId'];

/*
 * Attribute types
 */
Comment.prototype.types = {
  id : String,
  comment : String,
  author : Object,
  messageId : String
};

/*
 * Initialize a comment model
 */
Comment.prototype.initialize = function() {
  var attrs = this.toJSON();

  attrs.id = attrs.id || this.makeId(12);

  this.set(attrs, { silent : true });
};

/*
 * Add comment to the list after we save
 */
Comment.prototype.onSave = function(model, fn) {
  var list = new List(),
      messageId = model.get('messageId');

  // Example - list:message:123abc:comments
  list.key = 'list:message:'+ messageId +':comments';
  list.unshift(model.id, function(err) {
    return fn(err, model);
  });

};
