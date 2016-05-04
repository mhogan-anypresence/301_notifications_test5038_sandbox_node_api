'use strict';

var passport = require('passport');
var util = require('util');
var _ = require('lodash');
var analyse = require('../../api/analytics/analytics').analyse;

function scrubUser(user) {
  delete user.passwordDigest;
  delete user._principleType;
}

module.exports = {
  login: function (req, res, next) {
    req.logout();

    // var version = req.param('version') || 'v1';
    // var qualifedStrategy = version + req.param('strategy');
    var qualifedStrategy = req.param('strategy');

    if (!passport._strategies[qualifedStrategy]) return res.send({ success: false, errors: ['Invalid route.'] }, 404);

    passport.authenticate(qualifedStrategy, function(err, user, info) {
      var error = err || info;
      if (error) {
        sails.log.error(error);
        return res.json(401, error);
      }

      sails.log.debug('Established new session : ' + util.inspect(req.session));
      user.xSessionId = req.session.id;
      res.setHeader('Access-Control-Expose-Headers', 'X-Session-Id');
      res.setHeader('X-Session-Id', user.xSessionId);

      req.login(user, function(err) {
        /* 
         To scrub user object without affecting the reference in the session
         store, we clone it and remove the fields we do not want to expose to
         the client. This leaves the session store object alone, but returns
         a subset of fields to the client.
        */
        if (err) {
          sails.log.error(err);
          return res.json(500, {message: "An error occurred during login"});
        }

        function final() {
          var responseUser = _.cloneDeep(user);
          scrubUser(responseUser);
          analyse(req,res);
          return res.json(200, responseUser);
        }

        
        final();
      });
    })(req, res, next);
	},

  logout: function(req, res) {
    function final() {
      req.logout();
      sails.log.debug("Destroyed session : " + util.inspect(req.session));
      analyse(req,res);
      res.send(200);
    }

    var strategy;
    if (req.session && req.session.passport && req.session.passport.user) {
      strategy = req.session.passport.user._principleType;
    }

    
    final();
	},
  
};
