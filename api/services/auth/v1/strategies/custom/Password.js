// This module can be used to provide custom functionality to the authentication strategy.
// You can include libraries in this module. Ex:
// var http = require('http');

module.exports = {
 // Custom authentication code goes here.
 // Supplied parameters:
 //    req   : The incoming request object. http://expressjs.com/3x/api.html#request
 //    user  : The result of the authentication strategy, properties may differ
 //            between strategies. This object and any changes you make to it
 //            will be persisted to the session.
 //    done  : Callback. Needs to be invoked when finished. Accepts an error
 //            as the first parameter.
 // authCallback: function(req, user, done) {
 //  user.secretToken = 'ABC123';
 //  if (!user.active) {
 //    done(new Error('Inactive User!'));
 //  }
 //  http.get('http://mysite.com/path', function(res) {
 //    Custom logic...
 //    done();
 //  });
 //  Always call done when finished.
 //  done();
 // }
};
