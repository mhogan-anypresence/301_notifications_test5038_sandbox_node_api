var extensions          = require('./custom/v1/twilioCustom'),
    callbacks           = require('./custom/v1/twilioCallbacks'),
    Promise             = require('bluebird'),
    Criteria            = require('../services/query/Criteria'),
    util                = require('util'),
    _                   = require('lodash'),
    customCodeContext = require('../libs/customCodeContext');

var adapter = 'storage_adapter_8533';

V1Twilio = module.exports = {
  migrate: 'safe',
  connection : adapter,
  transientAttributes: [
    
  ],
  attributes: {
    
      
        id: {
          type: 'integer'
        },
      
    
      
        message: {
          type: 'text'
        },
      
    
      
        toPhoneNumber: {
          type: 'text'
        },
      
    
  },
  http: {
      read : {
    verb: 'GET',
    path: '',
    format: 'json',
    objectNameMapping: '',
    pathSelector: '$',
    bodyPayloadTemplate: "",
    limit: '',
    offset: '',
    headers: {
      
    },
    urlParameters: {
      
    },
    
    mapping: {
      request: {
        
          'id': 'id',
        
          'message': 'message',
        
          'toPhoneNumber': 'to_phone_number',
        
      },
      response: {
        
          'id': 'id',
        
          'toPhoneNumber': 'to_phone_number',
        
          'message': 'message',
        
      }
    }
  },

      update : {
    verb: 'PUT',
    path: '',
    format: 'json',
    objectNameMapping: '',
    pathSelector: '$',
    bodyPayloadTemplate: "",
    limit: '',
    offset: '',
    headers: {
      
    },
    urlParameters: {
      
    },
    
    mapping: {
      request: {
        
          'id': 'id',
        
          'message': 'message',
        
          'toPhoneNumber': 'to_phone_number',
        
      },
      response: {
        
          'id': 'id',
        
          'message': 'message',
        
          'toPhoneNumber': 'to_phone_number',
        
      }
    }
  },

      delete : {
    verb: 'DELETE',
    path: '',
    format: 'json',
    objectNameMapping: '',
    pathSelector: '',
    bodyPayloadTemplate: "",
    limit: '',
    offset: '',
    headers: {
      
    },
    urlParameters: {
      
    },
    
    mapping: {
      request: {
        
          'id': 'id',
        
          'message': 'message',
        
          'toPhoneNumber': 'to_phone_number',
        
      },
      response: {
        
          'id': 'id',
        
          'message': 'message',
        
          'toPhoneNumber': 'to_phone_number',
        
      }
    }
  },

      create : {
    verb: 'POST',
    path: '/Accounts/{{env.TWILIO_API_USERNAME}}/Messages.json',
    format: 'json',
    objectNameMapping: '',
    pathSelector: '$.*',
    bodyPayloadTemplate: "From={{body.twilio.fromNumber}}&To={{body.twilio.toNumber}}&Body={{body.twilio.message}}",
    limit: '',
    offset: '',
    headers: {
      
        'Accept': 'application/json',
      
        'Content-Type': 'application/x-www-form-urlencoded',
      
    },
    urlParameters: {
      
    },
    
    mapping: {
      request: {
        
      },
      response: {
        
      }
    }
  },

    
        allScope : {
    verb: 'GET',
    path: '',
    format: 'json',
    objectNameMapping: '',
    pathSelector: '$.*',
    bodyPayloadTemplate: "",
    limit: 'limit',
    offset: 'offset',
    headers: {
      
    },
    urlParameters: {
      
    },
    
    defaultParams: {
      
    },
    
    mapping: {
      request: {
        
          'id': 'id',
        
          'message': 'message',
        
          'toPhoneNumber': 'to_phone_number',
        
      },
      response: {
        
          'id': 'id',
        
          'message': 'message',
        
          'toPhoneNumber': 'to_phone_number',
        
      }
    }
  },

    
        exactMatchScope : {
    verb: 'GET',
    path: '',
    format: 'json',
    objectNameMapping: '',
    pathSelector: '$.*',
    bodyPayloadTemplate: "",
    limit: 'limit',
    offset: 'offset',
    headers: {
      
    },
    urlParameters: {
      
    },
    
    defaultParams: {
      
    },
    
    mapping: {
      request: {
        
          'id': 'id',
        
          'message': 'message',
        
          'toPhoneNumber': 'to_phone_number',
        
      },
      response: {
        
          'id': 'id',
        
          'message': 'message',
        
          'toPhoneNumber': 'to_phone_number',
        
      }
    }
  },

    
        countScope : {
    verb: 'GET',
    path: '',
    format: 'json',
    objectNameMapping: '',
    pathSelector: '$',
    bodyPayloadTemplate: "",
    limit: 'limit',
    offset: 'offset',
    headers: {
      
    },
    urlParameters: {
      
    },
    
    defaultParams: {
      
    },
    
    mapping: {
      request: {
        
          'id': 'id',
        
          'message': 'message',
        
          'toPhoneNumber': 'to_phone_number',
        
      },
      response: {
        
          'id': 'id',
        
          'toPhoneNumber': 'to_phone_number',
        
          'message': 'message',
        
      }
    }
  },

    
        countExactMatchScope : {
    verb: 'GET',
    path: '',
    format: 'json',
    objectNameMapping: '',
    pathSelector: '$',
    bodyPayloadTemplate: "",
    limit: 'limit',
    offset: 'offset',
    headers: {
      
    },
    urlParameters: {
      
    },
    
    defaultParams: {
      
    },
    
    mapping: {
      request: {
        
          'id': 'id',
        
          'message': 'message',
        
          'toPhoneNumber': 'to_phone_number',
        
      },
      response: {
        
          'id': 'id',
        
          'toPhoneNumber': 'to_phone_number',
        
          'message': 'message',
        
      }
    }
  },

    
  },
  autoCreatedAt: false,
  autoUpdatedAt: false,
  executeCallback: function() {
  var action = [].shift.call(arguments);
  var fn = this.callbacks[action];
  if (fn && _.isFunction(fn)) return fn.apply(null, arguments);
  return new Promise(function(resolve) { resolve(); });
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

// Augment/override definition of V1Twilio using customizations provided via custom code
if(extensions) {
  extend(V1Twilio, 'V1Twilio', extensions, 'customCode');
}

if (callbacks) {
  extend(V1Twilio, 'V1Twilio', callbacks, 'callbacks');
}
