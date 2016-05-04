var apn = require('apn'),
    serialization = require('../../serialization');

function createApnMessage(message) {
  var n = new apn.Notification();

  n.expiry   = (Math.floor(Date.now() / 1000) + (message.appleExpiry * 60));
  n.badge    = message.appleBadge;
  n.sound    = message.appleSound;
  n.alert    = message.appleAlert;
  n.payload  = {'alert': message.payload};

  return n;
}

function createDeviceTokens(devices) {
  if (!devices || devices.length === 0) return [];
  return devices
         .filter(function(device) { return device.provider === 'APPLE' })
         .map(function(device) { return new apn.Device(device.identifier); });
}

function createApnConnectionOptions(app) {
  var options = {
    cert: serialization.deserializeCertToBuffer(app.cert),
    key: serialization.deserializeCertToBuffer(app.privateKey),
    pfx: serialization.deserializeCertToBuffer(app.pfx),
    passphrase: app.passphrase,
    production: app.production
  };
  return options;
}

module.exports = {
  send: function(message, channel) {
    var notification = createApnMessage(message);
    var devices = createDeviceTokens(channel.devices);

    // Setup the APN connection
    var options = createApnConnectionOptions(channel.app);
    if (!options.cert && !options.pfx) return; // No cert information, do not send any pushes.

    sails.log('Sending APN push to ' + devices.length + ' devices.');

    var connection = new apn.Connection(options);

    // Setup event handlers
    connection.on('completed', function() {
      // Resolve with some kind of information - not sure what would be appropriate?
      sails.log('Completed send to APN');
    });

    connection.on('timeout', function() {
      // This error _should_ occurr immediately, before any notifications are sent.
      sails.log.error('Timed out');
    });

    connection.on('error', function(err) {
      // Overall error? Not sure on this one...
      sails.log.error('Erroring sending to APN');
      sails.log.error(err);
    });

    connection.on('transmissionError', function(err, notification) {
      // This can be raised for _each_ device that has a failure, so this event could potentially
      // popup a lot.
      sails.log.error('transmissionError');
      sails.log.error(err);
      sails.log.error(notification);
    });

    // Send push notifications
    devices.forEach(function(device) { connection.pushNotification(notification, device); });
  }
};
