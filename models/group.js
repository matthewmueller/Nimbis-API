var Backbone = require('Backbone'),
    Base = require('./base');

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