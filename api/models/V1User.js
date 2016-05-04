var extensions          = require('./custom/v1/userCustom'),
    callbacks           = require('./custom/v1/userCallbacks'),
    Promise             = require('bluebird'),
    Criteria            = require('../services/query/Criteria'),
    util                = require('util'),
    _                   = require('lodash'),
    customCodeContext = require('../libs/customCodeContext');

var bcrypt = require('bcrypt');

function hashPassword(values, next) {
  if (values.password) {
    bcrypt.hash(values.password, 10, function(err, res) {
      if (err) return next(err);

      values.passwordDigest = res;
      delete values.password;
      delete values.passwordConfirmation;
      next();
    });
  }
}

var transformAttributesForExactMatch = function(attributes) {
  var newAttributes = {};
  
  if(undefined != attributes['id']) {
    newAttributes['id'] = attributes['id'];
  }
  
  if(undefined != attributes['email_address']) {
    newAttributes['emailAddress'] = attributes['email_address'];
  }
  
  if(undefined != attributes['password']) {
    newAttributes['password'] = attributes['password'];
  }
  
  if(undefined != attributes['password_confirmation']) {
    newAttributes['passwordConfirmation'] = attributes['password_confirmation'];
  }
  
  if(undefined != attributes['password_digest']) {
    newAttributes['passwordDigest'] = attributes['password_digest'];
  }
  
  if(undefined != attributes['phone_number']) {
    newAttributes['phoneNumber'] = attributes['phone_number'];
  }
  
  if(undefined != attributes['role']) {
    newAttributes['role'] = attributes['role'];
  }
  
  if(undefined != attributes['send_push_notifications']) {
    newAttributes['sendPushNotifications'] = DataUtils.toBoolean(attributes['send_push_notifications']);
  }
  
  if(undefined != attributes['send_sendgrid_notifications']) {
    newAttributes['sendSendgridNotifications'] = DataUtils.toBoolean(attributes['send_sendgrid_notifications']);
  }
  
  if(undefined != attributes['send_twilio_notifications']) {
    newAttributes['sendTwilioNotifications'] = DataUtils.toBoolean(attributes['send_twilio_notifications']);
  }
  
  if(undefined != attributes['username']) {
    newAttributes['username'] = attributes['username'];
  }
  
  if(undefined != attributes['x_session_id']) {
    newAttributes['xSessionId'] = attributes['x_session_id'];
  }
  
  return newAttributes;
};

var adapter = (sails.config && sails.config.environment === 'test') ? 'memory' : 'local';

V1User = module.exports = {
  migrate: 'safe',
  tableName: 'User',
  connection: [ adapter ],
  types: {
      
      matchesConfirmation: function(password) {
        return password === this.passwordConfirmation;
      },
      
  },
  transientAttributes: [
    'password',
'passwordConfirmation',
'xSessionId'
  ],
  fileAttributes: [
    
  ],
  attributes: {
  
    
  
    
      
        emailAddress: {
          
          
          
          
          columnName: 'email_address',
          type: 'text',
          
        },
      
    
  
    
      
        getPassword:function () { return this.password; },
      
    
  
    
      
        getPasswordConfirmation:function () { return this.passwordConfirmation; },
      
    
  
    
      
        passwordDigest: {
          
          
          
          
          columnName: 'password_digest',
          type: 'text',
          
        },
      
    
  
    
      
        phoneNumber: {
          
          
          
          
          columnName: 'phone_number',
          type: 'text',
          
        },
      
    
  
    
      
        role: {
          
          
          
          
          columnName: 'role',
          type: 'text',
          
        },
      
    
  
    
      
        sendPushNotifications: {
          
          
          
          
          columnName: 'send_push_notifications',
          type: 'boolean',
          
        },
      
    
  
    
      
        sendSendgridNotifications: {
          
          
          
          
          columnName: 'send_sendgrid_notifications',
          type: 'boolean',
          
        },
      
    
  
    
      
        sendTwilioNotifications: {
          
          
          
          
          columnName: 'send_twilio_notifications',
          type: 'boolean',
          
        },
      
    
  
    
      
        username: {
          
          
          
          
          columnName: 'username',
          type: 'text',
          
        },
      
    
  
    
      
        getXSessionId:function () { return this.xSessionId; },
      
    
  

  toJSON: function () {
    var obj = this;
    
      
    
      
    
      
        obj.password = this.getPassword();
      
    
      
        obj.passwordConfirmation = this.getPasswordConfirmation();
      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
        obj.xSessionId = this.getXSessionId();
      
    
    return obj;
  },

  

  

  


  
    // user defined authenticatable objects are not system admins (unlike api/models/Admin)
    isAdmin: function() {
      return false;
    }
  
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

    var scope = V1User.find().where();
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

    var scope = V1User.find().where(transformAttributesForExactMatch(attributes));
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

    return V1User.count();

  }
  ,
    countExactMatchScope: function(attributes, userAttributes, offset, limit) {
      attributes = attributes || {};
      userAttributes = userAttributes || {};
      offset = offset || null;
      limit = limit || null;

    return V1User.count(transformAttributesForExactMatch(attributes));

  }
  ,
    myUserRecordScope: function(attributes, userAttributes, offset, limit) {
      attributes = attributes || {};
      userAttributes = userAttributes || {};
      offset = offset || null;
      limit = limit || null;

    var criteria = new Criteria(V1User);
    if(userAttributes['username'] && userAttributes['username'] != '') {
      criteria = criteria.and({ username: userAttributes['username'] }); 
    }
    criteria = criteria.orderBy('id ASC');
    if(offset) {
      criteria = criteria.offset(offset);
    }
    if(limit) {
      criteria = criteria.limit(limit);
    }
    sails.log.debug("Query scope was called with attributes " + util.inspect(attributes) + " and user attributes " + util.inspect(userAttributes));
    return criteria.query();
  },

  
  
  role: function(user) {
    var role = user['role'];
    if(role === undefined || _.isEmpty(role)) {
      return "Authenticated Without Role Default";
    }
    else {
      return role;
    }
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

// Augment/override definition of V1User using customizations provided via custom code
if(extensions) {
  extend(V1User, 'V1User', extensions, 'customCode');
}

if (callbacks) {
  extend(V1User, 'V1User', callbacks, 'callbacks');
}
