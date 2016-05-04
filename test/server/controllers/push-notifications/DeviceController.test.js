var assert      = require('assert'),
    rewire      = require('rewire'),
    stubs       = require('../../stubs'),
    controller  = rewire('../../../../api/controllers/DeviceController');

controller.__set__('analytics', stubs.analytics);

describe('Device Controller', function() {
  var app, device, channel, req, res;

  var appAttributes = {name: 'test'},
      channelAttributes = {name: 'testChannel'},
      deviceAttributes = {identifier: 'abc', provider: 'APPLE'};

  beforeEach(function(done) {
    req = {
      params: {},
      query: {}
    };

    res = {};

    App.create(appAttributes)
    .then(function(result) {
      app = result;
      deviceAttributes.app = app.id;
      channelAttributes.app = app.id;
      return Channel.create(channelAttributes);
    })
    .then(function(result) {
      channel = result;
      deviceAttributes.channels = [result.id];
      return Device.create(deviceAttributes);
    })
    .then(function(result) {
      device = result;
      channel.devices = [device.id];
      return channel.save();
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
      return Device.destroy();
    })
    .then(function() {
      return Channel.destroy(done);
    })
    .catch(done);
  });

  describe('find', function() {
    it('should find the device with the correct id', function(done) {
      res.send = function(payload) {
        assert.equal(payload.id, device.id);
        done();
      };

      req.params['id'] = device.id;
      req.params['app_id'] = app.id;

      controller.find(req, res);
    });

    it('should execute the count scope', function(done) {
      res.send = function(payload) {
        assert(Array.isArray(payload));
        assert.equal(payload.length, 1);
        assert.equal(payload[0], 1);
        done();
      };

      req.query['scope'] = 'count';
      req.params['app_id'] = app.id;

      controller.find(req, res);
    });

    it('should execute the all scope', function(done) {
      res.send = function(payload) {
        assert(Array.isArray(payload));
        assert.equal(payload.length, 1);
        assert.equal(payload[0].id, device.id);
        done();
      };

      req.params['app_id'] = app.id;

      controller.find(req, res);
    });

    it('should always call analyse', function(done) {
      var tempFn = stubs.analytics.analyse;
      stubs.analytics.analyse = function(req, res) {
        stubs.analytics.analyse = tempFn;
        done();
      };

      res.send = function(payload) {
        assert(payload);
      };

      req.params['id'] = device.id;

      controller.find(req, res);
    });
  });

  describe('findDeviceChannels', function() {
    it('should find the device channels by identifier', function(done) {
      res.send = function(payload) {
        assert(Array.isArray(payload));
        assert.equal(payload.length, 1);
        done();
      };

      req.params['identifier'] = device.identifier;
      req.params['app_id'] = app.id;

      controller.findDeviceChannels(req, res);
    });

    it('should fine the device channels by identifier if no app_id is in the url', function(done) {
      res.send = function(payload) {
        assert(Array.isArray(payload));
        assert.equal(payload.length, 1);
        done();
      };

      req.params['identifier'] = device.identifier;
      // A middleware will supply the defaultAppId during the request, simulate here
      // to prove controller will correctly use it when route does not contain app_id
      req.options = {defaultAppId: app.id};

      controller.findDeviceChannels(req, res);
    });

    it('should always call analyse', function(done) {
      var tempFn = stubs.analytics.analyse;
      stubs.analytics.analyse = function(req, res) {
        stubs.analytics.analyse = tempFn;
        done();
      };

      res.send = function(payload) {
        assert(payload);
      };

      req.params['identifier'] = device.identifier;
      req.params['app_id'] = app.id;

      controller.findDeviceChannels(req, res);
    });
  });

  describe('destroy', function() {
    it('should destroy the device', function(done) {
      res.send = function(status) {
        assert.equal(status, 204);
        Device.count()
        .then(function(result) {
          assert.equal(result, 0);
          done();
        })
        .catch(done);
      };

      req.params['id'] = device.id;

      controller.destroy(req, res);
    });

    it('should always call analyse', function(done) {
      var tempFn = stubs.analytics.analyse;
      stubs.analytics.analyse = function(req, res) {
        stubs.analytics.analyse = tempFn;
        done();
      };

      res.send = function(payload) {
        assert(payload);
      };

      req.params['id'] = device.id;

      controller.destroy(req, res);
    });
  });

  describe('update', function() {
    it('should update an device', function(done) {
      res.send = function(status) {
        assert.equal(status, 204);
        Device.findOne({id: device.id})
        .then(function(result) {
          assert(result);
          assert.equal(result.identifier, 'foobar');
          done();
        });
      };

      req.params['id'] = device.id;
      req.body = {identifier: 'foobar'};

      controller.update(req, res);
    });

    it('should always call analyse', function(done) {
      var tempFn = stubs.analytics.analyse;
      stubs.analytics.analyse = function(req, res) {
        stubs.analytics.analyse = tempFn;
        done();
      };

      res.send = function(status) {
        assert(status);
      };

      req.params['id'] = device.id;
      req.body = {identifier: 'foobar'};

      controller.update(req, res);
    });
  });

  describe('create', function() {
    it('should create a new device', function(done) {
      res.send = function(status, payload) {
        assert.equal(status, 201);
        assert(payload);
        Device.find()
        .then(function(result) {
          assert.equal(result.length, 2);
          done();
        });
      };

      req.body = {identifier: 'foobar', provider: 'APPLE', app: app.id};
      req.params['app_id'] = app.id;

      controller.create(req, res);
    });

    it('should use the app_id in the route if no app is contained in the body', function(done) {
      res.send = function(status, payload) {
        assert.equal(status, 201);
        assert.equal(payload.app, 99);
        done();
      };

      req.body = {identifier: 'foobar', provider: 'APPLE'};
      req.params['app_id'] = 99;

      controller.create(req, res);
    });

    it('should use the default app_id if nothing else is supplied', function(done) {
      res.send = function(status, payload) {
        assert.equal(status, 201);
        assert.equal(payload.app, 89);
        done();
      };

      req.options = {
        defaultAppId: 89
      };

      req.body = {identifier: 'foobar', provider: 'APPLE'};

      controller.create(req, res);
    });

    it('should always call analyse', function(done) {
      var tempFn = stubs.analytics.analyse;
      stubs.analytics.analyse = function(req, res) {
        stubs.analytics.analyse = tempFn;
        done();
      };

      res.send = function(status) {
        assert(status);
      };

      req.body = {identifier: 'foobar', provider: 'APPLE', app: app.id};

      controller.create(req, res);
    });
  });
});
