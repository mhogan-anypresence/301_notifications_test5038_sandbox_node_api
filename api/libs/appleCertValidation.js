'use strict';

var tls = require('tls');

module.exports = function(options, done) {
  var tlsOptions = {};

  if (options.pfx) tlsOptions.pfx = options.pfx;
  if (options.passphrase) tlsOptions.passphrase = options.passphrase;

  if (options.cert && options.key) {
    tlsOptions.cert = options.cert;
    tlsOptions.key = options.key;
  }

  tlsOptions.rejectUnauthorized = true;
  tlsOptions.host = "gateway.sandbox.push.apple.com";
  tlsOptions.port = 2195;

  try {
    var error;

    var socket = tls.connect(tlsOptions, function() {
      if (!socket.authorized) error = new Error('Not authorized');
      socket.end();
    });

    socket.on('error', function(err) {
      error = err;
    });

    socket.setEncoding('utf8');
    socket.on('data', function(data) {
      sails.log.debug(data);
    });

    socket.on('end', function() {
      done(error);
    });

  } catch (err) {
    done(err);
  }
};
