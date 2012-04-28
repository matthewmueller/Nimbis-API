var slice = Array.prototype.slice,
    _ = require('underscore');

/*
 * User generator
 */
// Model
exports['user:model'] = require('../../models/user');

// Basic user
exports['user:matt'] = function(model, fn) {
  var attrs = {
    name : 'Matt Mueller',
    email : 'mattmuelle@gmail.com',
    pass : 'test'
  };
    
  model = new model(attrs);
  model.save(fn);
};

// Random user
exports['user:random'] = function(model, fn) {};

/*
 * Group generator
 */
// Model
exports['group:model'] = require('../../models/group');

// Basic group
exports['group:javascript'] = function(model, fn) {
  var attrs = {
    name : 'Javascript'
  };

  model = new model(attrs);
  model.save(fn);
};

// Soccer group
exports['group:soccer'] = function(model, fn) {
  var attrs = {
    name : 'Javascript'
  };

  model = new model(attrs);
  model.save(fn);
};

// Random group
exports['group:random'] = function(model, fn) {};


// Generate function
// Usage: data.generate('user.basic', 'user.random', fn)
var generate = exports.generate = function(args, fn) {
  var out = {},
      wait = args.length;

  function done(err, key, model) {
    if(err) return fn(err);
    out[key].push(model);
    if(--wait <= 0) fn(null, out);
  }

  _.each(args, function(arg) {
    var model = arg.split(':')
    model.pop();
    var key = model.join(':');
    out[key] = [];
    model.push('model');
    model = exports[model.join(':')];

    exports[arg](model, function(err, model) {
      done(err, key, model);
    });
  });
};

generate(['user:matt', 'group:javascript'], function(err, data) {
  console.log(data);;
});