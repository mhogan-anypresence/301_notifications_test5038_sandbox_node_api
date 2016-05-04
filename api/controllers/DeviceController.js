var util      = require('util'),
    Promise   = require('bluebird'),
    analytics = require('../../api/analytics/analytics'),
    utilities = require('../../config/utilities');

function handleError(res) {
  return function(e) {
    if (e.originalError && e.originalError.code === 11000) e = utilities.validationErrorFromMongoError(e);
    if (e.ValidationError) return res.send(422, e);
    sails.log.error('error: \n' + util.inspect(e) + '\n');
    res.send(500, e);
  };
}

function getScope(req) {
  var scopeName = req.query['scope'] || 'all';
  var limit = parseInt(req.query['limit']) || null;
  var offset = parseInt(req.query['offset']) || null;
  var fn = Device[scopeName + 'Scope'];
  return fn(req.params, {}, offset, limit);
}

var DeviceController = {
  find: function (req, res) {
    sails.log.debug('DeviceController.find');
    var id = req.params['id'];
    var results;

    (function() {
      if (id) {
        return Device.findOne({id: id});
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
  findDeviceChannels: function(req, res) {
    sails.log.debug('DeviceController.findDeviceChannels');
    var criteria = {};

    if (req.params['id']) criteria['id'] = req.params['id'];
    if (req.params['identifier']) criteria['identifier'] = req.params['identifier'];

    if (req.params['app_id']) criteria['app'] = req.params['app_id'];
    
    var results = [];
    Device.findOne(criteria).populate('channels')
      .then(function(result) {
        var channelIds = result.channels.map(function(c) { return c.id; });
        // Select only the name of the nested app models to not expose gcmkey, etc
        return Channel.find({ id: channelIds }).populate('app', { select: ["name"] });
      })
      .then(function(result) {
        results = result;
        res.send(result);
      })
      .catch(handleError(res))
      .finally(function() {
        if (results) return analytics.analyse(req, res, utilities.sizeOf(results));
        return analytics.analyse(req, res);
      });
  },
  destroy: function (req, res) {
    sails.log.debug('DeviceController.destroy');
    var id = req.params['id'];

    var results;
    Device.destroy({id: id})
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
    sails.log.debug('DeviceController.update');
    var id = req.params['id'];

    var results;
    Device.update({id: id}, req.body)
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
  create: function (req, res) {
    sails.log.debug('DeviceController.create');
    var appId = req.body.app || req.params['app_id'] || req.options.defaultAppId;

    var values = req.body;
    values.app = appId;

    var results;
    Device.create(values)
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

module.exports = DeviceController;
