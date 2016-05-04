var assert            = require('assert'),
    push = require('../../../api/libs/push-notifications/push');

describe('push lib', function() {
  var channel, device, app;

    var channelAttributes = {name: 'foo'},
        appAttributes = {name: 'App'},
        deviceAttributes = {identifier: 'barbaz', provider: 'APPLE'};


    beforeEach(function(done) {
      device = null;
      App.create(appAttributes)
      .then(function(result) {
        app = result;
        channelAttributes.app = deviceAttributes.app = result.id;
        return Device.create(deviceAttributes);
      })
      .then(function(result) {
        device = result;
        channelAttributes.devices = [result.id];
        return Channel.create(channelAttributes);
      })
      .then(function(result) {
        channel = result;
        done();
      })
      .catch(done);
    });

    afterEach(function(done) {
      App.destroy()
      .then(function() {
        return Channel.destroy();
      })
      .then(function() {
        return Device.destroy(done);
      })
      .catch(done);
    });

  describe('subscribe', function() {
    it('should create a channel and associate it with the app if it does not exist', function(done) {
      var name = 'channel';
      push.subscribe('foo', 'APPLE', "Someone's Phone", app.id, name, function(err) {
        if (err) return done(err);
        Channel.findOne({name: name})
        .then(function(result) {
          assert(result);
          assert.equal(result.name, name);
          assert.equal(result.app, app.id);
          done();
        })
        .catch(done);
      });
    });

    it('should create a device and associate it with the existing channel', function(done) {
      var identifier  = 'device',
          provider    = 'APPLE';

      push.subscribe(identifier, provider, "Someone's Phone", app.id, channel.name, function(err, newDevice) {
        if (err) return done(err);

        assert.equal(newDevice.identifier, identifier);
        // Assert that the channel is contained in the device's channel collection.
        assert.equal(newDevice.channels[0].id, channel.id);

        Channel.findOne({id: channel.id}).populate('devices')
        .then(function(result) {
          assert(result);
          assert.equal(result.id, channel.id);
          // Assert that the device is contained in the channel's device collection.
          // It will be the second device since the channel has already been created and
          // another device subscribed.
          assert.equal(result.devices[1].id, newDevice.id);
          done();
        })
        .catch(done);
      });
    });

    it('should create a new device, create a new channel and associate them if neither exist', function(done) {
      var identifier  = 'device',
          provider    = 'APPLE',
          channelName = 'channel';

      var newChannel;

      push.subscribe(identifier, provider, "Someone's Phone", app.id, channelName, function(err, newDevice) {
        if (err) return done(err);
        Channel.findOne({name: channelName, app: app.id}).populate('devices')
        .then(function(result) {
          assert(result);
          newChannel = result;
          // Assert device exists in the channel's device collection.
          assert.equal(newDevice.id, newChannel.devices[0].id);
          // Assert channel exists in the device's channel collection.
          assert.equal(newChannel.id, newDevice.channels[0].id);
          done();
        })
        .catch(done);
      });
    });

    it('should create a new channel and associate an existing device', function(done) {
      var channelName = 'bar';

      var newChannel;
      push.subscribe(device.identifier, device.provider,  "Someone's Phone", app.id, channelName, function(err, newDevice) {
        if (err) return done(err);
        Channel.findOne({name: channelName, app: app.id}).populate('devices')
        .then(function(result) {
          assert(result);
          newChannel = result;
          // Assert existing device is in the channel's device collection.
          assert.equal(newDevice.id, newChannel.devices[0].id);
          // Assert channel is in device's channel collection. Will be the second channel in the
          // collection since it was already created and subbed to another channel.
          assert.equal(newChannel.id, newDevice.channels[1].id);
          done();
        });
      });
    });
  });

  describe('unsubscribe', function() {
    it('should remove an existing device from an existing channel device list', function(done) {
      push.unsubscribe(device.identifier, channel.name, app.id, function(err) {
        Channel.findOne({id: channel.id}).populate('devices')
        .then(function(result) {
          assert.equal(result.devices.length, 0);
          return Device.findOne({id: device.id}).populate('channels');
        })
        .then(function(result) {
          assert.equal(result.channels.length, 0);
          done();
        })
        .catch(done);
      });
    });

    it('should return an error if the channel does not exist', function(done) {
      var channelName = 'notFound';

      push.unsubscribe(device.identifier, channelName, app.id, function(err) {
        assert(err);
        assert.equal(err.message, 'Channel not found');
        done();
      });
    });

    it('should return an error if the device is not subscribed to the channel', function(done) {
      var token = 'notFound';

      push.unsubscribe(token, channel.name, app.id, function(err) {
        assert(err);
        assert.equal(err.message, 'Device not subscribed to channel');
        done();
      });
    });
  });
});
