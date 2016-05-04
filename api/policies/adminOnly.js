'use strict';

module.exports = (req, res, next) => {
  if (req.options.defaultApp.adminPushOnly) {
    if (req.user && req.user.isAdmin()) return next();
    return res.send(403, { message: 'Forbidden' });
  }

  return next();

};
