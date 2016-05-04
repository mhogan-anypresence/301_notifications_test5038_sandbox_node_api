var extensions          = require('./custom/v1/sendGridCustom'),
    callbacks           = require('./custom/v1/sendGridCallbacks'),
    Promise             = require('bluebird'),
    Criteria            = require('../services/query/Criteria'),
    util                = require('util'),
    _                   = require('lodash'),
    customCodeContext = require('../libs/customCodeContext');

var adapter = 'storage_adapter_8534';

V1SendGrid = module.exports = {
  migrate: 'safe',
  connection : adapter,
  transientAttributes: [
    
  ],
  attributes: {
    
      
        id: {
          type: 'integer'
        },
      
    
      
        emailFrom: {
          type: 'text'
        },
      
    
      
        emailTo: {
          type: 'text'
        },
      
    
      
        message: {
          type: 'text'
        },
      
    
      
        subject: {
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
        
          'emailTo': 'to',
        
          'emailFrom': 'from',
        
          'subject': 'subject',
        
          'message': 'text',
        
      },
      response: {
        
          'id': 'id',
        
          'emailTo': 'to',
        
          'emailFrom': 'from',
        
          'subject': 'subject',
        
          'message': 'text',
        
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
        
          'emailTo': 'to',
        
          'emailFrom': 'from',
        
          'subject': 'subject',
        
          'message': 'text',
        
      },
      response: {
        
          'id': 'id',
        
          'emailTo': 'to',
        
          'emailFrom': 'from',
        
          'subject': 'subject',
        
          'message': 'text',
        
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
        
          'emailTo': 'to',
        
          'emailFrom': 'from',
        
          'subject': 'subject',
        
          'message': 'text',
        
      },
      response: {
        
          'id': 'id',
        
          'emailTo': 'to',
        
          'emailFrom': 'from',
        
          'subject': 'subject',
        
          'message': 'text',
        
      }
    }
  },

      create : {
    verb: 'POST',
    path: '/mail.send.json',
    format: 'json',
    objectNameMapping: '',
    pathSelector: '$.*',
    bodyPayloadTemplate: "to={{body.sendGrid.emailTo}}&extraPayload={{body.sendGrid.extraPayload}}",
    limit: '',
    offset: '',
    headers: {
      
        'Content-Type': 'application/x-www-form-urlencoded',
      
        'Accept': 'application/json',
      
    },
    urlParameters: {
      
        'api_user': '{{env.SEND_GRID_API_USERNAME}}',
      
        'api_key': '{{env.SEND_GRID_API_PASSWORD_PLAIN_TEXT}}',
      
        'subject': '{{body.sendGrid.subject}}',
      
        'text': '{{body.sendGrid.message}}',
      
        'from': '{{body.sendGrid.emailFrom}}',
      
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
        
          'emailTo': 'to',
        
          'emailFrom': 'from',
        
          'subject': 'subject',
        
          'message': 'text',
        
      },
      response: {
        
          'id': 'id',
        
          'emailTo': 'to',
        
          'emailFrom': 'from',
        
          'subject': 'subject',
        
          'message': 'text',
        
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
        
          'emailTo': 'to',
        
          'emailFrom': 'from',
        
          'subject': 'subject',
        
          'message': 'text',
        
      },
      response: {
        
          'id': 'id',
        
          'emailTo': 'to',
        
          'emailFrom': 'from',
        
          'subject': 'subject',
        
          'message': 'text',
        
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
        
          'emailTo': 'to',
        
          'emailFrom': 'from',
        
          'subject': 'subject',
        
          'message': 'text',
        
      },
      response: {
        
          'id': 'id',
        
          'emailTo': 'to',
        
          'emailFrom': 'from',
        
          'subject': 'subject',
        
          'message': 'text',
        
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
        
          'emailTo': 'to',
        
          'emailFrom': 'from',
        
          'subject': 'subject',
        
          'message': 'text',
        
      },
      response: {
        
          'id': 'id',
        
          'emailTo': 'to',
        
          'emailFrom': 'from',
        
          'subject': 'subject',
        
          'message': 'text',
        
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

// Augment/override definition of V1SendGrid using customizations provided via custom code
if(extensions) {
  extend(V1SendGrid, 'V1SendGrid', extensions, 'customCode');
}

if (callbacks) {
  extend(V1SendGrid, 'V1SendGrid', callbacks, 'callbacks');
}
