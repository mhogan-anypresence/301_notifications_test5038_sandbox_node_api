'use strict';

let co = require('co');

module.exports = co.wrap(function*(req, res, next) {
  try {
    if (req.params['app_id']) {
      req.options.defaultApp = yield App.findOne({ id: req.params['app_id'] });
    } else if (req.body && req.body.appName) {
      req.options.defaultApp = yield App.findOne({ name: req.body.appName });
    } else {
      req.options.defaultApp = yield App.findOne({ isDefault: true });
    }
  } catch(e) {
    sails.log.error("Error finding default push application.");
    sails.log.error(e);
    next();
  }

  next();
});
