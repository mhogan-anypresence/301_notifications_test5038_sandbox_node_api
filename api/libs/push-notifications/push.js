var apn       = require('./providers/apple'),
    gcm       = require('./providers/google');

module.exports = {
  subscribe: function(token, provider, deviceName, appId, channelName, cb) {
    var channel, device;
    // Find or create a new channel.
    Channel.findOrCreate({name: channelName, app: appId}, {name: channelName, app: appId})
    .then(function(result) {
      // Query and populate devices collection.
      return Channel.findOne({id: result.id}).populate('devices');
    })
    .then(function(result) {
      channel = result;
      // Find or create a new device.
      return Device.findOrCreate({identifier: token, app: appId}, {name: deviceName, identifier: token, app: appId, provider: provider, channels: [result.id]});
    })
    .then(function(result) {
      device = result;
    })
    .then(function(result) {
      // Update channel's devices collection by pushing the device.
      channel.devices.add(device.id);
      return channel.save().catch(function(err) {
        // No way to ignore error for duplicate key being added with .add so manually catch all errors and if it's the
        // duplicate error ignore it, otherwise re-throw any valid errors.
        if (err[0] && err[0].err && err[0].err.message === "Trying to '.add()' an instance which already exists!") return;
        throw err;
      });
    })
    .then(function(result) {
      channel = result;
      return Device.findOne({id: device.id}).populate('channels');
    })
    .then(function(result) {
      device = result;
      cb(null, device);
    })
    .catch(cb);
  },
  unsubscribe: function(token, channelName, appId, cb) {
    var channel, device;
    Channel.findOne({name: channelName, app: appId}).populate('devices')
    .then(function(result) {
      if (!result) throw new Error('Channel not found');
      channel = result;
      return channel.devices.filter(function(device) { return device.identifier === token; });
    })
    .then(function(result) {
      if (result.length === 0) throw new Error('Device not subscribed to channel');
      device = result[0];
      channel.devices.remove(device.id);
      return channel.save();
    })
    .then(function(result) {
      return Device.findOne({id: device.id}).populate('channels');
    })
    .then(function(result) {
      cb(null, result);
    })
    .catch(cb);
  },
  sendMessage: function(message, channelName, appId, cb) {
    var channel;

    Channel.findOne({name: channelName, app: appId}).populate('app').populate('devices')
    .then(function(result) {
      if (!result) throw new Error('Channel not found');
      channel = result;
      gcm.send(message, channel);
      apn.send(message, channel);
      cb();
    })
    .catch(cb);
  }
};
