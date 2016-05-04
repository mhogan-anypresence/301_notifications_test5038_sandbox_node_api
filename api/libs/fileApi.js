"use strict";

var utilities = require('../../config/utilities');
var inflection = require('inflection');
var GridFsAdapter = require('skipper-gridfs');
var config = require('../../config/connections');
var dbUrl = config.connections.local.url;
var dbName = dbUrl.split("/")[dbUrl.split("/").length - 1];
var adapter = new GridFsAdapter({"dbname": dbName, "bucket": "files", uri: dbUrl});
var _ = require('lodash');

/**
 * Uploads all files attached to the given HTTP request
 * @param req the HTTP request
 * @param model the API model
 * @param cb the callback function
 * @returns {*}
 */
function upload(req, model, cb) {
  if (_isMultipartForm(req) && model.fileAttributes.length > 0) {
    
    var GRIDFS_STORAGE = {
      maxTimeToBuffer: 60000,
      adapter: GridFsAdapter,
      uri: dbUrl + '.files'
    };
    
    var executions = 0;
    for (var i = 0; i < model.fileAttributes.length; i++) {
    var fileAttribute = model.fileAttributes[i];
    var snakeFileAttribute = _.snakeCase(fileAttribute); // Support for file fields with an underscore
    req.file(snakeFileAttribute).upload(GRIDFS_STORAGE, function whenDone(err, uploadedFiles) {
        if (err) {
        return cb(err);
        } else {
        executions++;
        if (uploadedFiles.length > 0) {
            var _createFileUrl = function (url, fd) {
                url = req.originalUrl.split("/").slice(0, 4).join("/");
                
                // Match and remove the version portion of the URL, i.e. /v1/, /v2/
                var exp = new RegExp("\/v\\d\/");
                var matches = url.match(exp);
                if (matches && matches.length === 1) url = url.replace(matches[0], '/');
                
                return `${url}/files/${fileAttribute}/${uploadedFiles[0].fd}`
            };
            var fileUrl = _createFileUrl(req.originalUrl, uploadedFiles[0].fd);
            req.body[uploadedFiles[0].field] = fileUrl;
        }
        if (executions == model.fileAttributes.length) return cb();
        }
    });
    }
      
  } else {
    return cb();
  }
}


/**
 * Given a file name, returns the file
 * @param fileName the name of the file to be retrieved
 * @param cb the callback function
 * @returns {*}
 */
function find(fileName, cb) {
  adapter.read(fileName, function (err, file) {
    if (err) return cb(err, null);
    return cb(null, new Buffer(file));
  });
}

/**
 * Updates a model that contains files
 *
 * @param req the HTTP request
 * @param updatedInstance the updated model instance
 * @param model the model of the instance
 * @param id the id of the model instance
 * @param cb callback function
 *
 */
function update(req, updatedInstance, model, id, cb) {
  var _isFileRemoved = function (updatedInstance, fileAttribute) {
    return updatedInstance[fileAttribute] == "" || updatedInstance[fileAttribute] == null;
  };


  var _getFilesToBeRemoved = function (updatedInstance, model, instance) {
    var filesToBeRemoved = [];
    model.fileAttributes.forEach(function (fileAttribute) {
      var file = _getFileName(instance[fileAttribute]);
      if (_isFileRemoved(updatedInstance, fileAttribute)) {
        updatedInstance[fileAttribute] = null;
        if (file) filesToBeRemoved.push(file);
      }
    });
    return filesToBeRemoved;
  };

  model.findOne(id, function (err, instance) {
    if (err) return cb(err);
    if (model.fileAttributes && instance) {
      var filesToBeRemoved = _getFilesToBeRemoved(updatedInstance, model, instance);
      remove(model, id, filesToBeRemoved, function (err, res) {
        if (err) return cb(err);
        upload(req, model, function (err, res) {
          if (err) return cb(err);
          return cb();
        });
      })
    } else {
      return cb();
    }
  })
}

/**
 * Removes all files associated to a particular model instance
 * @param model the model
 * @param id the id of the model instance
 * @param cb the callback function
 * @returns {*}
 */
function removeAll(model, id, cb) {
  model.findOne(id, function (err, instance) {
    if (err) return cb(err);
    if (model.fileAttributes.length > 0 && instance) {
      model.fileAttributes.forEach(function (fileAttribute) {
        var fileId = _getFileName(instance[fileAttribute]);
        if (!fileId) return cb();
        adapter.rm(fileId, function (err, res) {
          cb(err);
        });
      });
    } else {
      return cb();
    }
  })
}

/**
 * Removes the given file fields of a model instance
 * @param model the model
 * @param id the id of the model instance
 * @param files array of files to be removed
 * @param cb the callback function
 * @returns {*}
 */
function remove(model, id, files, cb) {
  if (!files || files.length == 0) return cb();
  model.findOne(id, function (err, instance) {
    if (err) return cb(err);
    var executions = 0;
    for (var i = 0; i < files.length; i++) {
      adapter.rm(files[i], function (err, res) {
        executions++;
        if (err) return cb(err);
        if (executions == files.length) return cb();
      });
    }
  })
}

/**
 * Facade function that encapsulates all the file related operations. If its provided the HTTP request and response,
 * facade will take care of determine if the request requires a file operation (upload, update or removal) and how to
 * properly handle it.
 * @param req the HTTP request
 * @param res the HTTP response
 * @param cb the callback function
 * @returns {*}
 */
function fileFacade(req, res, cb) {
  var model = getModelFromRequest(req);

  if (_isAFileOperation(req) && model) {
    // Hacky - file support only exists on the local storage adapter,
    // all other adapters should just skip over the file middleware.
    if (!model.adapter.connections['local']) return cb();

    switch (req.method) {
      case "POST":
        upload(req, model, function (err) {
          if (err) {
            return cb(err);
          } else {
            return cb();
          }
        });
        break;

      case "PUT" :
      case "PATCH":
        var id = req.params['id'];
        var updatedInstance = req.body;
        update(req, updatedInstance, model, id, cb);
        break;

      case "DELETE":
        var id = req.params['id'];
        removeAll(model, id, cb);
        break;
    }
  } else {
    return cb();
  }
}


/**
 * Checks if the incoming request contains necessary -nor sufficient- condition reqs to be a file related operation
 * In detail:
 *
 * If its a POST / PUT operation, it must be a multipart/form HTTP request
 * If its a DELETE operation, just simply needs to be an HTTP DELETE request
 *
 * @param req HTTP request
 * @returns TRUE if it
 */
function _isAFileOperation(req) {
  return _isMultipartForm(req) || _isADeleteRequest(req);
}

/**
 * Checks whether an incoming request is a DELETE request
 * @param HTTP request
 * @returns TRUE if its a DELETE request, otherwise FALSE
 */
function _isADeleteRequest(req) {
  return req && req.method == "DELETE";
}

/**
 * Checks whether or not a given HTTP request contains files
 * @param req the HTTP request to be analysed
 * @returns {req.headers|{}|{Accept}|*|boolean} TRUE if the request contain files, otherwise FALSE
 * @private
 */
function _isMultipartForm(req) {
  return req.headers && req.headers['content-type'] && req.headers['content-type'].indexOf("multipart/form-data") >= 0;
}

/**
 * From a file url string (In example, /api/v1/employees/files/26f273e8-a44d-499b-b5fa-1bc6cef7ef3c.png) extracts the
 * last part of it (the name of the file, in this case 26f273e8-a44d-499b-b5fa-1bc6cef7ef3c.png)
 *
 * @param fileUrl the file url string
 * @returns the file name
 */
function _getFileName(fileUrl) {
  if (fileUrl) {
    return fileUrl.split("/")[fileUrl.split("/").length - 1];
  }
}

/**
 * Given a request object, returns the model name
 * @param req the HTTP request
 * @returns {string} the model name extracted from the request
 */
function getModelFromRequest(req){
  var version = utilities.requestApiVersion(req);
  var n = req.originalUrl.split('/')[3];

  if (!n) return;

  var name = _.camelCase(inflection.singularize(n)).toLowerCase();
  if(version && name) return sails.models[version + name];
}

/**
 * Public functions
 * @type {{upload: upload, find: find, removeAll: removeAll, remove: remove, fileFacade: fileFacade}}
 */
module.exports = {
  upload: upload,
  find: find,
  removeAll: removeAll,
  remove: remove,
  fileFacade: fileFacade
};
