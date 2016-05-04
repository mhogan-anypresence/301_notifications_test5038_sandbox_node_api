'use strict';

var extensions          = require('./custom/v1/twilioCustom'),
    callbacks           = require('./custom/v1/twilioCallbacks'),
    utilities           = require('../../config/utilities'),
    _                   = require('lodash'),
    util                = require('util'),
    analytics           = require('../../api/analytics/analytics'),
    DataProxy           = require('../libs/data-proxies/httpDataProxy'),
    WrapperService      = require('../services/WrapperService'),
    sails               = require('sails'),
    fileApi             = require('../libs/fileApi'),
    customCodeContext   = require('../libs/customCodeContext'),
    AuthService         = require('../services/auth/AuthService');

var V1TwilioController = module.exports = {
  find: function(req, res) {
    sails.log.debug("V1TwilioController.find");
    var results, model, dataProxy, scope;

    model = sails.models['v1twilio'];
    dataProxy = new DataProxy({model: model, req: req});

    scope = dataProxy.scope(req);

    if (scope) {
      model.executeCallback(scope.beforeCallback, scope.params, req)
        .then(function() {
          return scope.fn();
        })
        .then(function(obj) {
          results = obj;
          return model.executeCallback(scope.afterCallback, results, req);
        })
        .then(function() {
          sails.log.debug('responding with: \n' + util.inspect(results) + '\n');
          res.send(results);
        })
        .catch(function(err) {
          sails.log.error('error: \n' + util.inspect(err) + '\n');
          dataProxy.handleError(err, req, res);
        })
        .finally(function() {
          if (results) return analytics.analyse(req, res, utilities.sizeOf(results));
          return analytics.analyse(req, res);
        });
    } else {
      var id = req.params['id'];
      model.executeCallback('beforeFind', id, req)
        .then(function() {
          return dataProxy.findOne({'id': id});
        })
        .then(function(obj) {
          if (!obj) throw new Error('Not Found');
          results = obj;
          return model.executeCallback('afterFind', results, req);
        })
        .then(function() {
          sails.log.debug('responding with object \n'  + util.inspect(results) + '\n');
          res.send(results[0]);
        })
        .catch(function(err) {
          sails.log.error('error: \n' + util.inspect(err) + '\n');
          dataProxy.handleError(err, req, res);
        })
        .finally(function() {
          if (results) return analytics.analyse(req, res, utilities.sizeOf(results[0]));
          return analytics.analyse(req, res);
        });
    }
  },
  destroy: function(req, res) {
    sails.log.debug("V1TwilioController.destroy");

    var results, model, dataProxy, id;

    id = req.params['id'];
    model = sails.models['v1twilio'];
    dataProxy = new DataProxy({model: model, req: req});

    model.executeCallback('beforeDestroy', id, req)
      .then(function() {
        return dataProxy.findOne({'id': id});
      })
      .then(function(obj) {
        results = obj;
        if (!results) throw new Error('Not found');
        sails.log.debug('Destroying object: ' + util.inspect(obj));
        return dataProxy.destroy(id);
      })
      .then(function() {
        model.executeCallback('afterDestroy', results, req);
      })
      .then(function() {
        res.send(204);
      })
      .catch(function(err) {
        sails.log.error('error: \n' + util.inspect(err) + '\n');
        dataProxy.handleError(err, req, res);
      })
      .finally(function() {
        if (results) return analytics.analyse(req, res, utilities.sizeOf(results));
        return analytics.analyse(req, res);
      });
  },
  update: function(req, res) {
    sails.log.debug("V1TwilioController.update");

    var model, dataProxy;

    model = sails.models['v1twilio'];
    dataProxy = new DataProxy({model: model, req: req});

    model.executeCallback('beforeUpdate', req.body, req)
      .then(function() {
        delete req.body['id'];
        
        return dataProxy.update({id: req.params['id']}, req.body);
      })
      .then(function(obj) {
        return model.executeCallback('afterUpdate', obj, req);
      })
      .then(function() {
        res.send(204);
      })
      .catch(function(err) {
        sails.log.error('error: \n' + util.inspect(err) + '\n');
        dataProxy.handleError(err, req, res);
      })
      .finally(function() {
        analytics.analyse(req, res);
      });
  },
  create: function(req, res) {
    sails.log.debug("V1TwilioController.create");
    var results, model, dataProxy;

    model = sails.models['v1twilio'];
    dataProxy = new DataProxy({model: model, req: req});

    model.executeCallback('beforeCreate', req.body, req)
      .then(function() {
        
        return dataProxy.create(req.body);
      })
      .then(function(obj) {
        results = obj;
        return model.executeCallback('afterCreate', obj, req);
      })
      .then(function() {
        sails.log.debug('responding with: \n' + util.inspect(results) + '\n');
        res.send(201, results[0]);
      })
      .catch(function(err) {
        sails.log.error('error: ' + util.inspect(err));
        dataProxy.handleError(err, req, res);
      })
      .finally(function() {
        analytics.analyse(req, res);
      });
  },
  file: function(req, res) {
    sails.log.debug("V1DogController.file");
    let fileName = req.params['id'];
    
    if (!AuthService.allowedToReadFile(req)) return res.send(403);
    
    fileApi.find(fileName, function (err, file){
      if (err) {
        sails.log.error('error: ' + util.inspect(err));
        res.send(404);
      } else {
        sails.log.debug('responding with file\n');
        res.setHeader('content-type', '*/*');
        res.send(file);
      }
    });
  }
};

// TODO (JP): Break this partial out into its own lib and require it in the controllers/models
function extend(baseObject, baseName, extensionObject, subObject) {
  // If no subObject is supplied, extend the baseObject.
  var sub = baseObject;
  if (subObject) sub = baseObject[subObject] = {};

  _.keys(extensionObject).forEach(function(key) {

    if (_.isFunction(extensionObject[key])) {
      var _this = customCodeContext.createContext(1);

      var wrapper = new WrapperService(extensionObject[key], _this, sails.log.error);

      // Generic customCode does not return a promise. Model/Controller callbacks do.
      if (subObject === 'customCode') {
        sub[key] = wrapper.invoke.bind(wrapper);
      } else {
        sub[key] = wrapper.invokeAsPromise.bind(wrapper);
      }
    } else {
      sub[key] = extensionObject[key];
    }
  });
}

if(extensions) {
  extend(V1TwilioController, 'V1TwilioController', extensions, 'customCode');
}

if (callbacks) {
  extend(V1TwilioController, 'V1TwilioController', callbacks, 'callbacks');
}
