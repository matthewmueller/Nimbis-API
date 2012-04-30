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