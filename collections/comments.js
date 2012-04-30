var Base = require('./base');

/*
 * Extend the Base collection
 */
var Comments = module.exports = Base.extend();

/*
 * Name the collection
 */
Comments.prototype.name = 'comments';

/*
 * Set the model
 */
Comments.prototype.model = require('../models/comment');

// Static Properties
// -----------------
Comments.create = function(comments, fn) {
  comments = new Comments(comments);
  comments.save(fn);
};

Comments.find = function(ids, fn) {
  ids = ids.map(function(id) { return { id : id }; });
  var comments = new Comments(ids);
  comments.fetch(fn);
};