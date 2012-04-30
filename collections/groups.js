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