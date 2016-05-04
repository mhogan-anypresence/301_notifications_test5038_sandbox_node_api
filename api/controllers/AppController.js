var analytics = require('../../api/analytics/analytics'),
    utilities = require('../../config/utilities'),
    util      = require('util');

function handleError(res) {
  return function(e) {
    if (e.originalError && e.originalError.code === 11000) e = utilities.validationErrorFromMongoError(e);
    if (e.ValidationError) return res.send(422, e);
    sails.log.error('error: \n' + util.inspect(e) + '\n');
    res.send(500, e);
  };
}

function getScope(req) {
  var scopeName =req.query['scope'] || 'all';
  var limit = parseInt(req.query['limit']) || null;
  var offset = parseInt(req.query['offset']) || null;
  var fn = App[scopeName + 'Scope'];
  return fn({}, {}, offset, limit);
}

module.exports = {
  find: function (req, res) {
    sails.log.debug('AppController.find');
    var id = req.params['id'];
    var results;

    (function() {
      if (id) {
        return App.findOne({id: id});
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
  findAll: function(req, res) {
    sails.log.debug('AppController.findAll');
    var results;
    App.find()
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
    sails.log.debug('AppController.destroy');
    var id = req.params['id'];
    var results;
    App.destroy({id: id})
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
    sails.log.debug('AppController.update');
    var id = req.params['id'];
    var results;
    App.update({id: id}, req.body)
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
    sails.log.debug('AppController.create');
    var results;
    App.create(req.body)
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
