/*!
 * Redback
 * Copyright(c) 2011 Chris O'Hara <cohara87@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var client = require('../support/client');

/**
 * A wrapper for the Redis hash type.
 *
 * Usage:
 *    `redback.createHash(key);`
 *
 * Reference:
 *    http://redis.io/topics/data-types#hashes
 *
 * Redis Structure:
 *    `(namespace:)key = hash(key => value)`
 */

var Hash = module.exports = function(key) {
  this.key = key;
};

/**
 * Get an array of hash keys.
 *
 * @param {Function} callback
 * @return this
 * @api public
 */

Hash.prototype.keys = function (callback) {
    client.hkeys(this.key, callback);
    return this;
};

/**
 * Get an array of hash values.
 *
 * @param {Function} callback
 * @return this
 * @api public
 */

Hash.prototype.values = function (callback) {
    client.hvals(this.key, callback);
    return this;
};

/**
 * Get the number of hash keys.
 *
 * @param {Function} callback
 * @return this
 * @api public
 */

Hash.prototype.length = function (callback) {
    client.hlen(this.key, callback);
    return this;
};

/**
 * Delete a hash key.
 *
 * @param {string} hash_key
 * @param {Function} callback (optional)
 * @return this
 * @api public
 */

Hash.prototype['delete'] = Hash.prototype.del = function (hash_key, callback) {
  callback = callback || function() {};
  if(!hash_key) return this;

  if(typeof hash_key === 'function') {
    client.del(this.key, hash_key);
  } else {
    client.hdel(this.key, hash_key, callback);
  }

  return this;
};

/**
 * Checks whether a hash key exists.
 *
 * @param {string} hash_key
 * @param {Function} callback
 * @return this
 * @api public
 */

Hash.prototype.exists = function (hash_key, callback) {
    client.hexists(this.key, hash_key, callback);
    return this;
};

/**
 * Sets one or more key/value pairs.
 *
 * To set one key/value pair:
 *    `hash.set('foo', 'bar', callback);`
 *
 * To set multiple:
 *    `hash.set({key1:'value1', key2:'value2}, callback);`
 *
 * @param {string|Object} hash_key
 * @param {string} value (optional)
 * @param {Function} callback (optional)
 * @return this
 * @api public
 */

Hash.prototype.set = function (hash_key, value, callback) {
    if (typeof hash_key === 'object') {
        callback = value || function () {};
        client.hmset(this.key, hash_key, callback);
    } else {
        callback = callback || function () {};
        client.hset(this.key, hash_key, value, callback);
    }
    return this;
};

/**
 * Sets a key/value pair if the key doesn't already exist.
 *
 * @param {string} hash_key
 * @param {string} value
 * @param {Function} callback
 * @return this
 * @api public
 */

Hash.prototype.add = function (hash_key, value, callback) {
    callback = callback || function () {};
    client.hsetnx(this.key, hash_key, value, callback);
    return this;
};

/**
 * Gets one or more key/value pairs.
 *
 * To get all key/value pairs in the hash:
 *    `hash.get('foo', callback);`
 *
 * To get certain key/value pairs:
 *    `hash.get(['foo','bar'], callback);`
 *    `hash.get('foo', callback);`
 *
 * @param {string} hash_key (optional)
 * @param {Function} callback
 * @return this
 * @api public
 */

Hash.prototype.get = function (hash_key, callback) {
    if (typeof hash_key === 'function') {
        callback = hash_key;
        client.hgetall(this.key, callback);
    } else if (Array.isArray(hash_key)) {
        client.hmget(this.key, hash_key, callback);
    } else {
        client.hget(this.key, hash_key, callback);
    }
    return this;
};

/**
 * Increment the specified hash value.
 *
 * @param {string} hash_key
 * @param {int} amount (optional - default is 1)
 * @param {Function} callback (optional)
 * @return this
 * @api public
 */

Hash.prototype.increment =
Hash.prototype.incrBy = function (hash_key, amount, callback) {
    callback = callback || function () {};
    if (typeof amount === 'function') {
        callback = amount;
        amount = 1;
    }
    client.hincrby(this.key, hash_key, amount, callback);
    return this;
};

/**
 * Decrement the specified hash value.
 *
 * @param {string} hash_key
 * @param {int} amount (optional - default is 1)
 * @param {Function} callback (optional)
 * @return this
 * @api public
 */

Hash.prototype.decrement =
Hash.prototype.decrBy = function (hash_key, amount, callback) {
    callback = callback || function () {};
    if (typeof amount === 'function') {
        callback = amount;
        amount = 1;
    }
    client.hincrby(this.key, hash_key, -1 * amount, callback);
    return this;
};