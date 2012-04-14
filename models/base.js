/**
 * Model.js - All models will extend the base model
 *
 * The point of this base model is to provide a low-level interface with the database,
 * allowing us to have a consistent save, delete, etc. from our models.
 *
 * This layer will be interacting directly with Redis.
 */

var crypto = require('crypto');

/**
 * Generate some salt
 */
var salt = exports.salt = function() {
  return Math.round((new Date().valueOf() * Math.random())).toString();
};

/**
 * Encrypt a string
 */
var encrypt = exports.encrypt = function(str) {
  return crypto.createHmac('sha1', salt()).update(str).digest('hex');
};

/**
 * Generate a id
 */
var id = exports.id = function(len) {
  return Math.random().toString(36).substr(2,len);
};