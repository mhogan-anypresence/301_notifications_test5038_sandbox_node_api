var assert = require('assert');

describe('Channel model', function() {
  var attributes, app, channel;

  beforeEach(function(done) {
    attributes = { name: 'test' };
    App.create(attributes)
      .then(function(result) {
        app = result;
        attributes.app = app.id;
        return Channel.create(attributes);
      })
      .then(function(result) {
        return Channel.findOne({id: result.id}).populateAll();
      })
      .then(function(result) {
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

  it('should not allow a channel name that already exists within in app to be created', function(done) {
    Channel.create(attributes)
      .then(function(result) {
        assert(!result, 'Should not have been able to create duplicate app');
      })
      .catch(function(err) {
        assert(err.ValidationError['compositeName']);
        assert.equal(err.ValidationError['compositeName'][0].rule, 'unique');
        done();
      });
  });

  it('should not allow an empty channel name', function(done) {
    delete attributes.name;
    Channel.create(attributes)
      .then(function(result) {
        assert(!result, 'Should not have been able to create channel with an empty name');
      })
      .catch(function(err) {
        assert(err.ValidationError['name']);
        assert.equal(err.ValidationError['name'][0].rule, 'text', 'Expected broken "text" validation rule.');
        assert.equal(err.ValidationError['name'][1].rule, 'required', 'Expected broken "required" validation rule.');
        done();
      });
  });

  it('should not be invalid when updating a model', function(done) {
    // uniqueName validation could result in a false when updating an object, since the app
    // being updated and the attributes for the updating app have the same name. This should
    // properly test the workaround.
    Channel.update({name: channel.name}, {name: 'foo'})
      .then(function(result) {
        result = result[0];
        assert.equal(result.id, channel.id);
        assert.equal(result.name, 'foo');
        done();
      })
      .catch(done);
  });

  it('should have a reference to an "app"', function() {
    assert(channel.app);
  });

  it('should have a reference to the correct app', function() {
    assert(channel.app.id === app.id);
  });

  it('should have a "devices" collection', function() {
    assert(channel.devices);
  });

  it('should have a "messages" collection', function() {
    assert(channel.messages);
  });

  it('should hold a reference to a created message', function(done) {
    var message;
    Message.create({payload: 'message', channel: channel.id})
      .then(function(result) {
        assert(result);
        message = result;
        return Channel.findOne({id: channel. id}).populateAll();
      })
      .then(function(result) {
        assert(result);
        assert.equal(result.messages.length, 1);
        assert.equal(result.messages[0].payload, 'message');
        done();
      })
      .catch(done);
  });

  it('should hold a reference to a created device', function(done) {
    var device;
    Device.create({identifier: 'foobar', app: app.id, provider: 'APPLE', channels: [channel.id]})
      .then(function(result) {
        device = result;
        return Channel.findOne({id: channel.id}).populate('devices');
      })
      .then(function(result) {
        assert.equal(result.devices.length, 1);
        assert.equal(result.devices[0].id, device.id);
        done();
      })
      .catch(done);
  });

  it('should no longer have a reference to a destroyed device', function(done) {
    var device;
    Device.create({identifier: 'foobar', app: app.id, provider: 'APPLE', channels: [channel.id]})
      .then(function(result) {
        assert(result);
        device = result;
        return Channel.findOne({id: channel.id}).populate('devices');
      })
      .then(function(result) {
        assert.equal(result.devices.length, 1);
        assert.equal(result.devices[0].id, device.id);
        return device.destroy();
      })
      .then(function(result) {
        assert(result);
        return Channel.findOne({id: channel.id}).populate('devices');
      })
      .then(function(result) {
        assert.equal(result.devices.length, 0);
        done();
      })
      .catch(done);
  });

});
