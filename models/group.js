var redis = require('../').redis,
    _ = require('underscore');

var base = require('./base');

/*
 * Create a group instance
 */
var Group = module.exports = function(group) {
  this.attributes = group || {};
};

/*
 * Attributes
 */
Group.prototype.attributes = {};


/**
 * Create a group
 */
Group.prototype.create = function(group, fn) {
  group = _.extend(this.attributes, group);

  // Generate groupID
  group.id = base.id(6);
  
  var queue = redis.multi();

  _.each(group, function(value, key) {
    queue.hset('group:' + group.id, key, value);
  });

  // Index
  // FIXME: This doesn't take into account multiple groups with same name (ex. Family)
  queue.hset('i:group:id', group.name, group.id);

  // Save to database
  queue.exec(fn);
};

/*
 * Find a group by id
 */
Group.find = function(id, fn) {
  redis.hgetall('group:' + id, fn);
};