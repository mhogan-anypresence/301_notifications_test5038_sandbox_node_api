var LocalStrategy = require('passport-local').Strategy,
    bcrypt        = require('bcrypt'),
    custom        = require('./custom/Password');

var customFn;

if (custom && custom.authCallback) customFn = custom.authCallback;

module.exports = function(sails, passport, deserializers) {
  sails.log.debug('Registering auth strategy v1 "Password"');

  deserializers['password'] = function(obj, cb) {
    V1User.findOne({id: obj.id}, cb);
  };

  passport.use('password', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, done) {
    V1User.findOne({'username': username}, function(err, authObj) {
      if (err) return done(err);
      if (!authObj) return done(null, false, {message: 'Unknown user ' + username});
      bcrypt.compare(password, authObj.passwordDigest, function(err, res) {
        if (err) return done(err);
        if (!res) return done(null, false, {message: 'Invalid password'});

        function final(err) {
          if (err) return done(err);
          authObj._principleType = 'password';
          return done(null, authObj);
        }

        if (customFn) return customFn(req, authObj, final);
        final();
      });
    });
  }));
};
