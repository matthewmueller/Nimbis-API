var Base = require('./base');

/*
 * Extend the Base collection
 */
var Groups = module.exports = Base.extend();

/*
 * Name the collection
 */
Groups.prototype.name = 'groups';

/*
 * Set the model
 */
Groups.prototype.model = require('../models/group');

// Static Properties
// -----------------
Groups.create = function(groups, fn) {
  groups = new Groups(groups);
  groups.save(fn);
};

Groups.find = function(ids, fn) {
  ids = ids.map(function(id) { return { id : id }; });
  var groups = new Groups(ids);
  groups.fetch(fn);
};