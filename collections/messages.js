var Base = require('./base');

/*
 * Extend the Base collection
 */
var Messages = module.exports = Base.extend();

/*
 * Name the collection
 */
Messages.prototype.name = 'messages';

/*
 * Set the model
 */
Messages.prototype.model = require('../models/message');
