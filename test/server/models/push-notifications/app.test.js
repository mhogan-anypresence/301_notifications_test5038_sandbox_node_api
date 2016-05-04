var assert = require('assert');

describe('App model', function() {
  var attributes, app;

  beforeEach(function(done) {
    attributes = {name: 'foobar', isDefault: true};

    App.create(attributes, function(err, result) {
      app = result;
      done(err);
    });
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

  it('should not allow an app name that already exists to be created', function(done) {
    var existingNameAttributes = {name: 'foobar'};
    App.create(existingNameAttributes)
      .then(function(result) {
        assert(!result, 'Should not have been able to create duplicate app');
      })
      .catch(function(err) {
        assert(err.ValidationError['name']);
        assert.equal(err.ValidationError['name'][0].rule, 'unique');
        done();
      });
  });

  it('should not allow an empty app name', function(done) {
    var newAttributes = {isDefault: false};
    App.create(newAttributes)
      .then(function(result) {
        assert(!result, 'Should not have been able to create duplicate app');
      })
      .catch(function(err) {
        assert(err.ValidationError['name']);
        assert.equal(err.ValidationError['name'][0].rule, 'text', 'Expected broken "text" validation rule.');
        assert.equal(err.ValidationError['name'][1].rule, 'required', 'Expected broken "required" validation rule.');
        done();
      });
  });

  it('should not allow for more than 1 default application', function(done) {
    var anotherDefaultAttributes = {name: 'test', isDefault: true};
    App.create(anotherDefaultAttributes)
    .then(function(result) {
      assert(!result, 'Should not have been able to create another default app');
    })
    .catch(function(err) {
      assert(err.ValidationError['isDefault']);
      assert.equal(err.ValidationError['isDefault'][0].rule, 'singleDefaultApp', 'Expected broken "singleDefaultApp" validation rule.');
      done();
    });
  });

  it('should not be invalid when updating a model', function(done) {
    // uniqueName validation could result in a false when updating an object, since the app
    // being updated and the attributes for the updating app have the same name. This should
    // properly test the workaround.
    App.update({id: app.id}, {isDefault: false, name: 'bazbar'})
      .then(function(result) {
        result = result[0];
        assert.equal(result.id, app.id);
        done();
      })
      .catch(done);
  });

  it('should set isDefault to false by default', function(done) {
    var defaultAttributes = {name: 'barbaz'};
    App.create(defaultAttributes)
    .then(function(result) {
      assert.equal(result.isDefault, false);
      done();
    })
    .catch(done);
  });

  it('should have a createdAt date field', function(done) {
    assert(app.createdAt);
    try{
      assert((new Date(app.createdAt).toString() !== 'Invalid Date'), 'Expected createdAt to be a date');
      done();
    } catch(err) {
      done(err);
    }
  });

  it('should have an id field created automatically', function() {
    assert(app.id);
  });

  it('should have a "channels" collection', function() {
    assert(app.channels);
  });

  it('should have a "devices" collection', function() {
    assert(app.devices);
  });

  it('should hold a reference to a created channel', function(done) {
    var channel;
    Channel.create({name: 'test', app: app.id})
      .then(function(result) {
        assert(result);
        channel = result;
        return App.findOne({id: app.id}).populateAll();
      })
      .then(function(result) {
        assert(result);
        assert.equal(result.channels.length, 1);
        assert.equal(result.channels[0].id, channel.id);
        done();
      })
      .catch(done);
  });

  it('should no longer have a reference to the destroyed channel', function(done) {
    var channel;
    Channel.create({name: 'test', app: app.id})
      .then(function(result) {
        assert(result);
        channel = result;
        return App.findOne({id: app.id}).populateAll();
      })
      .then(function(result) {
        assert(result);
        assert.equal(result.channels.length, 1);
        assert.equal(result.channels[0].id, channel.id);
        return channel.destroy();
      })
      .then(function(result) {
        assert(result);
        return App.findOne({id: app.id}).populateAll();
      })
      .then(function(result) {
        assert.equal(result.channels.length, 0);
        done();
      })
      .catch(done);
  });

  it('should hold a reference to a created device', function(done) {
    var device;
    Device.create({identifier: 'foobar', provider: 'APPLE', app: app.id})
      .then(function(result) {
        device = result;
        return App.findOne({id: app.id}).populate('devices');
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
    Device.create({identifier: 'foobar', provider: 'APPLE', app: app.id})
      .then(function(result) {
        assert(result);
        device = result;
        return App.findOne({id: app.id}).populate('devices');
      })
      .then(function(result) {
        assert.equal(result.devices.length, 1);
        assert.equal(result.devices[0].id, device.id);
        return device.destroy();
      })
      .then(function(result) {
        assert(result);
        return App.findOne({id: app.id}).populate('devices');
      })
      .then(function(result) {
        assert.equal(result.devices.length, 0);
        done();
      })
      .catch(done);
  });
});
