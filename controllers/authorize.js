var passport = require('passport');

// Default authorization
exports = module.exports = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if(err) return next(err);
    else if(!user) return res.send(401);
    console.log('lol');
  })(req, res, next);
};
