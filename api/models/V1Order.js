var extensions          = require('./custom/v1/orderCustom'),
    callbacks           = require('./custom/v1/orderCallbacks'),
    Promise             = require('bluebird'),
    Criteria            = require('../services/query/Criteria'),
    util                = require('util'),
    _                   = require('lodash'),
    customCodeContext = require('../libs/customCodeContext');


var transformAttributesForExactMatch = function(attributes) {
  var newAttributes = {};
  
  if(undefined != attributes['id']) {
    newAttributes['id'] = attributes['id'];
  }
  
  if(undefined != attributes['desc']) {
    newAttributes['desc'] = attributes['desc'];
  }
  
  if(undefined != attributes['name']) {
    newAttributes['name'] = attributes['name'];
  }
  
  return newAttributes;
};

var adapter = (sails.config && sails.config.environment === 'test') ? 'memory' : 'local';

V1Order = module.exports = {
  migrate: 'safe',
  tableName: 'Order',
  connection: [ adapter ],
  types: {
      
  },
  transientAttributes: [
    
  ],
  fileAttributes: [
    
  ],
  attributes: {
  
    
  
    
      
        desc: {
          
          
          
          
          columnName: 'desc',
          type: 'text',
          
        },
      
    
  
    
      
        name: {
          
          
          
          
          columnName: 'name',
          type: 'text',
          
        },
      
    
  

  toJSON: function () {
    var obj = this;
    
      
    
      
    
      
    
    return obj;
  },

  

  

  


  
  },
  autoPK: true,
  autoCreatedAt: false,
  autoUpdatedAt: false,
    executeCallback: function() {
    var action = [].shift.call(arguments);
    var fn = this.callbacks[action];
    if (fn && _.isFunction(fn)) return fn.apply(null, arguments);
    return new Promise(function(resolve) { resolve(); });
  },
    // Scopes for data access
      allScope: function(attributes, userAttributes, offset, limit) {
      attributes = attributes || {};
      userAttributes = userAttributes || {};
      offset = offset || null;
      limit = limit || null;

    var scope = V1Order.find().where();
    if(limit) {
      scope = scope.limit(limit);
    }
    if(offset) {
      scope = scope.skip(offset);
    }
    return scope;

  }
  ,
    exactMatchScope: function(attributes, userAttributes, offset, limit) {
      attributes = attributes || {};
      userAttributes = userAttributes || {};
      offset = offset || null;
      limit = limit || null;

    var scope = V1Order.find().where(transformAttributesForExactMatch(attributes));
    if(limit) {
      scope = scope.limit(limit);
    }
    if(offset) {
      scope = scope.skip(offset);
    }
    return scope;

  }
  ,
    countScope: function(attributes, userAttributes, offset, limit) {
      attributes = attributes || {};
      userAttributes = userAttributes || {};
      offset = offset || null;
      limit = limit || null;

    return V1Order.count();

  }
  ,
    countExactMatchScope: function(attributes, userAttributes, offset, limit) {
      attributes = attributes || {};
      userAttributes = userAttributes || {};
      offset = offset || null;
      limit = limit || null;

    return V1Order.count(transformAttributesForExactMatch(attributes));

  },

};

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

// Augment/override definition of V1Order using customizations provided via custom code
if(extensions) {
  extend(V1Order, 'V1Order', extensions, 'customCode');
}

if (callbacks) {
  extend(V1Order, 'V1Order', callbacks, 'callbacks');
}
