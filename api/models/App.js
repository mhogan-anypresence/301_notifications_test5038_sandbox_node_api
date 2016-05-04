var sails           = require('sails'),
    _               = require('lodash'),
    util            = require('util'),
    serialization   = require('../libs/serialization'),
    certValidation  = require('../libs/appleCertValidation'),
    gcmValidation   = require('../libs/gcmKeyValidation');

var adapter = (sails.config && sails.config.environment === 'test') ? 'memory' : 'local';

module.exports = {
  migrate: 'alter',
  tableName: 'App',
  connection: [adapter],
  types: {
    singleDefaultApp: function(isDefault, value) {
      if (!isDefault) return true;
      return value.unique;
    },
    validGcmKey: function(key, value) {
      if (!key) return true;
      return value.valid;
    },
    validAppleCert: function(cert, value) {
      if (!cert) return true;
      return value.valid;
    },
    certOrPfx: function(cert, value) {
      if(!cert) return true;
      return value.valid;
    },
    requiresKey: function(cert, value) {
      return value;
    },
    requiresCert: function(key, value) {
      return value;
    }
  },
  attributes: {
    name: {
      type: 'text',
      required: true,
      unique: true
    },
    gcmkey: {
      type: 'text',
      validGcmKey: function(cb) {
        var self = this;
        gcmValidation(self.gcmkey, function(err) {
          if (!err) {
            cb({valid: true});
          } else {
            cb({valid: false});
          }
        });
      }
    },
    isDefault: {
      type: 'boolean',
      defaultsTo: false,
      singleDefaultApp: function(cb) {
        var self = this;
        App.findOne({isDefault: true}).exec(function(err, result) {
          if (result && result.id === self.id) {
            cb({unique: true});
          } else {
            cb({unique: !result});
          }
        });
      }
    },
    production: {
      type: 'boolean',
      defaultsTo: false
    },
    adminPushOnly: {
      type: 'boolean',
      defaultsTo: true
    },
    cert: {
      type: 'text',
      requiresKey: function() {
        return (this.cert && this.privateKey);
      },
      certOrPfx: function() {
        if (this.cert && this.pfx) return {valid: false};
        return {valid: true};
      },
      validAppleCert: function(cb) {
        var options = {};
        if (this.cert) options.cert = serialization.deserializeCertToBuffer(this.cert);
        if (this.privateKey) options.key = serialization.deserializeCertToBuffer(this.privateKey);
        if (this.passphrase) options.passphrase = this.passphrase;

        certValidation(options, function(err) {
          if (err) {
            sails.log.debug(err);
            cb({valid: false});
          } else {
            cb({valid: true});
          }
        });
      }
    },
    privateKey: {
      type: 'text',
      requiresCert: function() {
        return (this.cert && this.privateKey);
      }
    },
    pfx: {
      type: 'text',
      certOrPfx: function() {
        if (this.cert && this.pfx) return {valid: false};
        return {valid: true};
      },
      validAppleCert: function(cb) {
        var options = {};

        if (this.pfx) options.pfx = serialization.deserializeCertToBuffer(this.pfx);
        if (this.passphrase) options.passphrase = this.passphrase;

        certValidation(options, function(err) {
          if (err) {
            sails.log.debug(err);
            cb({valid: false});
          } else {
            cb({valid: true});
          }
        });
      }
    },
    passphrase: {
      type: 'text'
    },
    channels: {
      collection: 'Channel',
      via: 'app'
    },
    devices: {
      collection: 'Device',
      via: 'app'
    }
  },
  autoPK: true,
  autoCreatedAt: true,
  autoUpdatedAt: false,
  allScope: function(attributes, userAttributes, offset, limit) {
    var scope = App.find().where();
    if(limit) {
      scope = scope.limit(limit);
    }
    if(offset) {
      scope = scope.skip(offset);
    }
    return scope;
  },
  countScope: function(attributes, userAttributes, offset, limit) {
    return App.count();
  }
};
