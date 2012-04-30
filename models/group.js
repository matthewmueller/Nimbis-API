var Base = require('./base');

/*
 * Extend the Base model
 */
var Group = module.exports = Base.extend();

/*
 * Name of the model
 */
Group.prototype.name = 'group';

/*
 * Required values
 */
Group.prototype.requires = ['name', 'type'];

/*
 * Types of the attributes
 */
Group.prototype.types = {
  id : String,
  name : String,
  description : String,
  type : String
};

/*
 * Default values
 */
Group.prototype.defaults = {
  type : 'public'
};

/*
 * Initialize a group model
 */
Group.prototype.initialize = function() {
  var attrs = this.toJSON();

  attrs.id = attrs.id || this.makeId(6);

  this.set(attrs, { silent : true });
};

// Static Properties
// -----------------

Group.exists = function(id, fn) {
  Group.find(id, function(err, group) {
    // Normalize, kinda wierd for right now..
    if(group) group = group.get('id');
    fn(err, group);
  });
};