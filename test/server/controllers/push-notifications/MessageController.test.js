var assert      = require('assert'),
    rewire      = require('rewire'),
    stubs       = require('../../stubs'),
    controller  = rewire('../../../../api/controllers/MessageController');

controller.__set__('analytics', stubs.analytics);


describe('Message Controller', function() {
  var app, device, channel, message, req, res;

  var appAttributes = {name: 'test'},
      channelAttributes = {name: 'testChannel'},
      deviceAttributes = {identifier: 'abc', provider: 'APPLE'},
      messageAttributes = {payload: 'blah blah blah'};

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
      messageAttributes.app = app.id;
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
      messageAttributes.channel = channel.id;
      return Message.create(messageAttributes);
    })
    .then(function(result) {
      message = result;
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
      return Channel.destroy();
    })
    .then(function() {
      return Message.destroy(done);
    })
    .catch(done);
  });

  describe('find', function() {
    it('should find the message with the correct id', function(done) {
      res.send = function(payload) {
        assert.equal(payload.id, message.id);
        done();
      };

      req.params['id'] = message.id;

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
        assert.equal(payload[0].id, message.id);
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

      req.params['id'] = message.id;

      controller.find(req, res);
    });
  });

  describe('create', function() {

  });
});
