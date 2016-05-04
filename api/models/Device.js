var sails = require('sails'),
    _     = require('lodash'),
    util  = require('util');

var adapter = (sails.config && sails.config.environment === 'test') ? 'memory' : 'local';

module.exports = {
    tableName: 'Device',
    connection: [adapter],
    attributes: {
      identifier: {
        type: 'text',
        required: true
      },
      name: {
        type: 'text'
      },
      provider: {
        type: 'text',
        required: true,
        index: true,
        in: ['APPLE', 'GOOGLE']
      },
      compositeIdentifier: {
        type: 'text',
        required: true,
        unique: true
      },
      app: {
        model: 'App',
        required: true
      },
      channels: {
        collection: 'channel',
        via: 'devices'
      }
    },
    autoPK: true,
    autoCreatedAt: false,
    autoUpdatedAt: false,
    beforeValidate: function(values, cb) {
      values.compositeIdentifier = values.identifier + values.app;
      cb();
    },
    allScope: function(attributes, userAttributes, offset, limit) {
      var scope = Device.find({app: attributes.app_id});
      if(limit) {
        scope = scope.limit(limit);
      }
      if(offset) {
        scope = scope.skip(offset);
      }
      return scope;
    },
    countScope: function(attributes, userAttributes, offset, limit) {
      return Device.count({app: attributes.app_id});
    }
};
