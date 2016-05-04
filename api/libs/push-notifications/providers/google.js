var Promise = require('bluebird'),
    async   = require('async'),
    Message = require('node-gcm').Message,
    Sender  = require('node-gcm').Sender,
    util    = require('util');

function createGcmMessage(message) {
  var options = {
    data: {}
  };

  options.data.message    = message.payload;
  options.delayWhileIdle  = message.googleDelayWhileIdle || false;
  options.timeToLive      = message.googleTimeToLive;
  options.collapseKey     = message.collapseKey || "New notifications!"; // Not so sure about the default message?

  return new Message(options);
}

module.exports = {
  send: function(message, channel) {
    var devices = channel.devices.filter(function(device) { return device.provider === 'GOOGLE'; });
    if (devices.length === 0) return;

    // Create a GCM representation of the message
    var m = createGcmMessage(message);
    var sender = new Sender(channel.app.gcmkey);
    if (!sender) return; // No GCM key, do not send.

    // Create an array of device tokens ("identifiers")
    var tokens = devices.map(function(device) { return device.identifier; });
    sails.log('Sending GCM push to ' + tokens.length + ' devices.');

    // There's a hard 1000 device ID limit per message. This will break the tokens into groups of 1000
    // and create an array of "send" functions, each send function will be a different set of 1000 messages.
    var fns = [];
    while(tokens.length > 0) {
      var t = tokens.splice(0, 1000);
      // Add the "send" function to the array of functions.
      fns.push(function(cb) {
        sender.send(m, {registrationTokens: t}, cb);
      });
    }

    // Create an async parallel execution of all the "send" functions. The maximum number of connections
    // to GCM is 100, so we limit it to 100 executions at a time.
    async.parallelLimit(fns, 100, function(err, result) {
      if (err) {
        return sails.log.error(err);
      }
      sails.log('GCM push results:', util.inspect(result, {depth: null}));
    });
  }
};
