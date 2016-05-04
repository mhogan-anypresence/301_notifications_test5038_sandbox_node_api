// Middleware will allow anyone that is a user - "standard" user or an admin.
module.exports = function(req, res, next) {
  if (req.user) return next();
  res.send(403, {"message": "Forbidden"});
};