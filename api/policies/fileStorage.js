var fileApi = require('../libs/fileApi');

module.exports = function(req,res,next) {
  fileApi.fileFacade(req, res, next);
};