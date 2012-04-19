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
 * Defaults
 */
Group.prototype.defaults = {
  type : 'public'
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
  group = _.defaults(group, this.defaults);

  // Generate groupID
  group.id = base.id(6);
  
  var queue = redis.multi();

  _.each(group, function(value, key) {
    queue.hset('group:' + group.id, key, value);
  });

  // Add to a public list for visibility - will probably need to be changed with search
  if(group.type === 'public') {
    queue.lpush('group:public', group.id);
  }

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

/*
 * Get a list of public groups
 */
Group.getPublic = function(fn) {
  redis.lrange('group:public', 0, 100, function(err, groups) {
    var len = groups.length,
        out = [];
    
    _.each(groups, function(id) {
      redis.hgetall('group:' + id, function(err, group) {
        if(err) return fn(err);
        out.push(group);

        if(!--len) return fn(null, out);
      });
    });
  });
};

