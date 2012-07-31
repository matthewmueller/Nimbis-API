var expect = require('expect.js'),
    _ = require('underscore'),
    request = require('./support/request'),
    authorize = require('./support/authorize'),
    client = require('../support/client'),
    User = require('../models/user'),
    Groups = require('../collections/groups'),
    Message = require('../models/message'),
    Messages = require('../collections/messages'),
    app = require('../app.js');

var groups = [
  { id : '123456', name : 'Javascript'},
  { id : '654321', name : 'Soccer'}
];

var user = {
  name : 'Matt',
  email : 'mattmuelle@gmail.com',
  password : 'test',
  groups : groups
};

describe('Message Controller', function() {
  var sessionId;

  // TODO: Clean up.. this is so ugly
  before(function(done) {

    // Create the groups then create the user
    Groups.create(groups, function(err) {
      if(err) return done(err);
      User.create(user, function(err, model) {
        if(err) return done(err);
        authorize(user.email, user.password, function(err, sid) {
          if(err) return done(err);
          sessionId = sid;
          done();
        });
      });
    });

  });

  describe('GET /messages', function() {
    it('should retrieve a users messages', function(done) {
      var messages = [
        { message : 'hi world!',
          groups : ['123456'],
          author : { name : 'Martha Stewart', id : '098654'}
        },
        {
          message : 'hello there',
          groups : ['654321', '123456'],
          author: { name : 'Jim Bean', id : 'abcdefg'}
        },
        {
          message : 'I shouldnt be found',
          groups : ['abc123'],
          author: { name : 'Jim Bean', id : 'abcdefg'}
        }
      ];

      Messages.create(messages, function(err, models) {
        if(err) return done(err);

        request(app)
        .get('/messages')
        .set('Cookie', 'sessionId=' + sessionId)
        .end(function(res) {
          var body = JSON.parse(res.body),
              msgs = _(body).pluck('message'),
              ids = _(body).pluck('id');

          expect(msgs).to.contain('hi world!');
          expect(msgs).to.contain('hello there');
          expect(msgs).to.not.contain('I shouldnt be found');
          expect(ids).to.have.length(2);
          done();
        });

      });
    });
  });

  describe('POST /messages', function() {

    it('should create a new message', function(done) {
      var message = {
        message : 'Hi world!',
        groups : ['123456', '654321']
      };

      request(app)
        .post('/messages')
        .set('Cookie', 'sessionId=' + sessionId)
        .set('Content-Type', 'application/json')
        .write(JSON.stringify(message))
        .end(function(res) {
          var body = JSON.parse(res.body);
          expect(body.id).to.be.ok();
          // FIXME:  This should be converted back to a date
          expect(body.created_at).to.be.a('string');
          expect(body.message).to.be('Hi world!');
          return done();
        });

    });
  });

  // Flush the database after the test set
  after(function(done) {
    client.flushdb(function(err) {
      if(err) return done(err);
      done();
    });
  });

});