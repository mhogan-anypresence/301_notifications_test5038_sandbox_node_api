var assert = require('assert');

describe('Device model', function() {
  var attributes, app, channel, device;

  beforeEach(function(done) {
    attributes = {identifier: 'abc', provider: 'APPLE'};
    App.create({name: 'foobar'})
      .then(function(result) {
        assert(result);
        app = result;
        attributes.app = app.id;
        return Channel.create({name: 'test', app: app.id});
      })
      .then(function(result) {
        assert(result);
        channel = result;
        attributes.channels = [channel.id];
        return Device.create(attributes);
      })
      .then(function(result) {
        assert(result);
        device = result;
        channel.devices = [device.id];
        return channel.save();
      })
      .then(function(result) {
        assert(result);
        channel = result;
        return Device.findOne({id: device.id}).populate('channels');
      })
      .then(function(result) {
        device = result;
        return App.findOne({id: app.id}).populateAll();
      })
      .then(function(result) {
        assert(result);
        app = result;
        return Channel.findOne({name: 'test'}).populateAll();
      })
      .then(function(result) {
        assert(result);
        channel = result;
        done();
      })
      .catch(done);
  });

  afterEach(function(done) {
    App.destroy()
      .then(function(result) {
        return Device.destroy();
      })
      .then(function(result) {
        return Channel.destroy(done);
      })
      .catch(done);
  });

  it('should not allow an empty identifier', function(done) {
    delete attributes.identifier;
    Device.create(attributes)
      .then(function(result) {
        assert(!result, 'Should not have been able to create a device with an empty identifier');
      })
      .catch(function(err) {
        assert(err);
        assert(err.ValidationError['identifier']);
        assert.equal(err.ValidationError['identifier'][0].rule, 'text', 'Expected broken "text" validation rule');
        assert.equal(err.ValidationError['identifier'][1].rule, 'required', 'Expected broken "required" validation rule');
        done();
      });
  });

  it('should allow an optional "name" attribute', function(done) {
    var _attributes = {identifier: 'aaaaa', provider: 'APPLE', name: 'foo_device', app: app.id};
    Device.create(_attributes)
      .then(function(result) {
        assert.equal(result.name, _attributes.name);
        done();
      })
      .catch(done);
  });

  it('should have a reference to an "app"', function() {
    assert(device.app);
  });

  it('should have a reference to the correct "app"', function() {
    assert.equal(device.app, app.id);
  });

  it('should have a reference to "channels"', function() {
    assert(device.channels);
  });

  it('should have a reference to the correct "channel"', function() {
    assert(device.channels[0].id, channel.id);
  });

  it('should be referenced in the app devices', function() {
    assert(app.devices.length === 1);
    assert(app.devices[0].identifier === device.identifier);
  });

  it('should be referenced in the channel devices', function() {
    assert(channel.devices.length === 1);
    assert(channel.devices[0].identifier === device.identifier);
  });
});
