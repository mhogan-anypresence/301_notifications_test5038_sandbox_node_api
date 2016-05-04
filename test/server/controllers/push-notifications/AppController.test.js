var assert      = require('assert'),
    rewire      = require('rewire'),
    stubs       = require('../../stubs'),
    controller  = rewire('../../../../api/controllers/AppController');

controller.__set__('analytics', stubs.analytics);

describe('App Controller', function() {
  var app, req, res;

  var attributes = {name: 'test'};

  beforeEach(function(done) {
    req = {
      params: {},
      query: {}
    };

    res = {};

    App.create(attributes)
    .then(function(result) {
      app = result;
      done();
    })
    .catch(done);
  });

  afterEach(function(done) {
    App.destroy(done);
  });

  describe('find', function() {
    it('should find the app with the correct id', function(done) {
      res.send = function(payload) {
        assert.equal(payload.id, app.id);
        done();
      };

      req.params['id'] = app.id;

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

      controller.find(req, res);
    });

    it('should execute the all scope', function(done) {
      res.send = function(payload) {
        assert(Array.isArray(payload));
        assert.equal(payload.length, 1);
        assert.equal(payload[0].id, app.id);
        done();
      };

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

      req.params['id'] = app.id;

      controller.find(req, res);
    });
  });

  describe('destroy', function() {
    it('should destroy the app', function(done) {
      res.send = function(status) {
        assert.equal(status, 204);
        App.count()
        .then(function(result) {
          assert.equal(result, 0);
          done();
        })
        .catch(done);
      };

      req.params['id'] = app.id;

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

      req.params['id'] = app.id;

      controller.destroy(req, res);
    });
  });

  describe('update', function() {
    it('should update an app', function(done) {
      res.send = function(status) {
        assert.equal(status, 204);
        App.findOne({id: app.id})
        .then(function(result) {
          assert(result);
          assert.equal(result.name, 'barbaz');
          done();
        });
      };

      req.params['id'] = app.id;
      req.body = {name: 'barbaz'};

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

      req.params['id'] = app.id;
      req.body = {name: 'barbaz'};

      controller.update(req, res);
    });
  });

  describe('create', function() {
    it('should create a new app', function(done) {
      res.send = function(status, payload) {
        assert.equal(status, 201);
        assert(payload);
        App.find()
        .then(function(result) {
          assert.equal(result.length, 2);
          done();
        });
      };

      req.body = {name: 'newApp'};

      controller.create(req, res);
    });
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

    req.body = {name: 'newApp'};

    controller.create(req, res);
  });
});
