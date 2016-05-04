var BaseDataProxy  = require('./baseDataProxy'),
    _              = require('lodash'),
    Promise        = require('bluebird');

function getScopeParams(req) {
  return {
    scopeName: req.query['scope'] || 'all',
    limit: parseInt(req.query['limit']) || null,
    offset: parseInt(req.query['offset']) || null,
    query: req.query
  };
}

/*
 *  Constructor
 */
function StandardDataProxy(options) {
  BaseDataProxy.call(this, options);
}
BaseDataProxy._extend(StandardDataProxy);

StandardDataProxy.prototype.create = function(values) {
  return this.model.create(values);
};

StandardDataProxy.prototype.findOne = function(options) {
  return this.model.findOne(options);
};

StandardDataProxy.prototype.update = function(params, values) {
  return this.model.update(params, values);
};

StandardDataProxy.prototype.destroy = function(id) {
  return this.model.destroy(id);
};

StandardDataProxy.prototype.scope = function(req) {
  var self = this;
  if (!req.params['id']) {
    var scopeParams = getScopeParams(req);
    var name = scopeParams.scopeName.charAt(0).toUpperCase() + scopeParams.scopeName.slice(1);
    var beforeCallback = 'before' + name + 'Scope';
    var afterCallback = 'after' + name + 'Scope';
    var fn = self.handleTransientFieldsReturnArray(self.model[scopeParams.scopeName + 'Scope'](req.query.query || {}, req.user || {}, scopeParams.offset, scopeParams.limit));

    return {
      scopeParams: getScopeParams(req),
      beforeCallback: beforeCallback,
      afterCallback: afterCallback,
      fn: function() {
        return fn;
      }
    };
  }
};

StandardDataProxy.prototype.handleError = function(err, req, res) {
  if (err.originalError) err = err.originalError;
  if (err.ValidationError) return res.send(422, err);
  if (err.message === 'Not Found') return res.send(404);
  return res.send(500);
};

module.exports = StandardDataProxy;
