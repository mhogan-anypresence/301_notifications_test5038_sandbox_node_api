var util      = require('util'),
    Promise   = require('bluebird'),
    analytics = require('../../api/analytics/analytics'),
    utilities = require('../../config/utilities'),
    push      = require('../libs/push-notifications/push');

function handleError(res) {
  return function(e) {
    if (e.originalError && e.originalError.code === 11000) e = utilities.validationErrorFromMongoError(e);
    if (e.ValidationError) return res.send(422, e);
    if (e.isOperational) return res.send(422, { message: e.message });
    sails.log.error('error: \n' + util.inspect(e) + '\n');
    res.send(500, e);
  };
}

function getScope(req) {
  var scopeName = req.query['scope'] || 'all';
  var limit = parseInt(req.query['limit']) || null;
  var offset = parseInt(req.query['offset']) || null;
  var fn = Channel[scopeName + 'Scope'];
  sails.log.debug('Scope: ' + scopeName);
  return fn(req.params, {}, offset, limit);
}

var ChannelController = {
  find: function (req, res) {
    sails.log.debug('ChannelController.find');
    var id = req.params['id'];
    var results;

    (function() {
      if (id) {
        return Channel.findOne({id: id});
      } else {
        return getScope(req);
      }
    })()
    .then(function(result) {
      if (!id && !Array.isArray(result)) result = [result];
      results = result;
      sails.log.debug('responding with: \n' + util.inspect(results) + '\n');
      res.send(result);
    })
    .catch(handleError(res))
    .finally(function() {
      if (results) return analytics.analyse(req, res, utilities.sizeOf(results));
      return analytics.analyse(req, res);
    });
  },
  destroy: function (req, res) {
    sails.log.debug('ChannelController.destroy');
    var id = req.params['id'];

    var results;
    Channel.destroy({id: id})
      .then(function(result) {
        results = result;
        res.send(204);
      })
      .catch(handleError(res))
      .finally(function() {
        if (results) return analytics.analyse(req, res, utilities.sizeOf(results));
        return analytics.analyse(req, res);
      });
  },
  update: function (req, res) {
    sails.log.debug('ChannelController.update');
    var id = req.params['id'];

    var results;
    Channel.update({id: id}, req.body)
      .then(function(result) {
        results = result;
        res.send(204);
      })
      .catch(handleError(res))
      .finally(function() {
        if (results) return analytics.analyse(req, res, utilities.sizeOf(results));
        return analytics.analyse(req, res);
      });
  },
  subscribe: function (req, res) {
    var token       = req.body.token,
        provider    = req.body.provider,
        deviceName  = req.body.deviceName,
        channelName = req.body.channelName,
        appName     = req.body.appName,
        app         = req.options.defaultApp;

    Promise.promisify(push.subscribe)(token, provider, deviceName, app.id, channelName)
    .then(function(result) {
      res.send(result);
    })
    .catch(handleError(res));
  },
  unsubscribe: function (req, res) {
    var token       = req.body.token,
        channelName = req.body.channelName,
        app         = req.options.defaultApp;
        
    Promise.promisify(push.unsubscribe)(token, channelName, app.id)
    .then(function(result) {
      res.send(result);
    })
    .catch(handleError(res));
  },
  create: function (req, res) {
    sails.log.debug('ChannelController.create');
    var appId = req.body.app || req.params['app_id'] || req.options.defaultAppId;

    var values = req.body;
    values.app = appId;

    var results;
    Channel.create(values)
      .then(function(result) {
        results = result;
        res.send(201, result);
      })
      .catch(handleError(res))
      .finally(function() {
        if (results) return analytics.analyse(req, res, utilities.sizeOf(results));
        return analytics.analyse(req, res);
      });
  }
};

module.exports = ChannelController;
