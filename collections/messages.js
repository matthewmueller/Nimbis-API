var Base = require('./base');

/*
 * Extend the Base collection
 */
var Messages = module.exports = Base.extend();

/*
 * Set the model
 */
Messages.prototype.model = require('../models/message');