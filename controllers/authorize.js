var passport = require('passport');

// Default authorization
exports = module.exports = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if(err) return next(err);
    else if(!user) return res.send(401);
    
    req.login(user, function(err) {
      if (err) { return next(err); }
      return res.send(user);
    });

  })(req, res, next);
};
