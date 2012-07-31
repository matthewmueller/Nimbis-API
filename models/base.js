var crypto = require('crypto'),
    _ = require('underscore'),
    Backbone = require('Backbone');

/*
 * Extend Backbone
 */
var Base = module.exports = Backbone.Model.extend();

/*
 * Sync with redis
 */
Base.prototype.sync = require('../support/redis.sync');

/*
 * Public: Generate Salt
 */
Base.prototype.makeSalt = function() {
  return Math.round((new Date().valueOf() * Math.random())).toString();
};

/*
 * Generate a id
 */
Base.prototype.makeId = function(len) {
  return Math.random().toString(36).substr(2,len);
};

Base.prototype.isNew = function() {
  return !this.attributes.created_at;
};

/*
 * Validate Types
 */
Base.prototype.checkTypes = function(types) {
  var model = this;

  _.each(types, function(type, attr) {
    // console.log(attr, type.name);
    // console.log(model.toJSON());
    attr = model.get(attr);
    if(!(attr instanceof type)) {
      console.log('error');
      return new Error('Invalid attribute: ' + attr + ' expected to be ' + type.name);
    }
  });

  // No problems
  return false;
};

var _validate = Base.prototype._validate;
Base.prototype._validate = function(attrs, options) {
  options = options || {};

  var error = false; //this.checkTypes(this.types || {});
  if (!error) return _validate.call(this, attrs, options);

  if (options && options.error) {
    options.error(this, error, options);
  } else {
    this.trigger('error', this, error, options);
  }

  return false;
};

Base.prototype.isValid = function() {
  return !!this._validate();
};

/*
 * Save a model
 */
Base.prototype.save = function(options, fn) {
  var date = new Date(),
      method = 'update';

  // Allow options to be callback function
  if(_.isFunction(options)) {
    fn = options;
    options = {};
  } else {
    options = _.clone(options);
  }

  // Add timestamps
  if(this.isNew()) {
    method = 'create';
    this.set('created_at', date, { silent : true });
  }
  this.set('modified_at', date, { silent : true });


  // Sync the model with the database
  this.sync(method, options, function(err, model) {

    // Call hooks if available
    if(err && model.onError) {
      model.onError.call(model, err, fn);
    } else if(!err && model.onSave) {
      model.onSave.call(model, model, fn);
    } else {
      fn(err, model);
    }

  });
};

/*
 * Fetch a particular model
 */
Base.prototype.fetch = function(options, fn) {
  if(_.isFunction(options)) fn = options;

  // Sync the model with the database
  this.sync('read', options, function(err, model) {

    // Call hooks if available
    if(err && model.onError) {
      model.onError.call(model, err, fn);
    } else if(!err && model.onFetch) {
      model.onFetch.call(model, model, fn);
    } else {
      fn(err, model);
    }

  });
};

/*
 * Destroy a particular model
 */
Base.prototype.destroy = function(options, fn) {
  if(_.isFunction(options)) fn = options;

  // Sync the model with the database
  this.sync('delete', options, function(err, model) {
    // Call hooks if available
    if(err && model.onError) {
      model.onError.call(model, err, fn);
    } else if(!err && model.onDestroy) {
      model.onDestroy.call(model, model, fn);
    } else {
      fn(err, model);
    }
  });
};

// Static Properties
// -----------------

/*
 * Encrypt a string
 */
Base.encrypt = function(salt, str) {
  return crypto.createHmac('sha1', salt).update(str).digest('hex');
};

Base.create = function(attrs, fn) {
  var model = new this(attrs);
  model.save(fn);
};

Base.find = function(id, fn) {
  var model = new this({ id : id });
  model.fetch(fn);
};

