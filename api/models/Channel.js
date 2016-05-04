var sails = require('sails'),
    _     = require('lodash'),
    util  = require('util'),
    Promise = require('bluebird');

var adapter = (sails.config && sails.config.environment === 'test') ? 'memory' : 'local';

module.exports = {
  migrate: 'alter',
  tableName: 'Channel',
  connection: [adapter],
  attributes: {
    name: {
      type: 'text',
      required: true,
      index: true
    },
    app: {
      model: 'App',
      required: true
    },
    compositeName: {
      type: 'text',
      required: true,
      unique: true
    },
    devices: {
      collection: 'Device',
      via: 'channels',
      dominant: true
    },
    messages: {
      collection: 'Message',
      via: 'channel'
    }
  },
  autoPK: true,
  autoCreatedAt: false,
  autoUpdatedAt: false,
  beforeValidate: function(values, cb) {
    values.compositeName = values.name + values.app;
    cb();
  },
  allScope: function(attributes, userAttributes, offset, limit) {
      var scope = Channel.find({app: attributes.app_id}).populate('devices').populate('messages');
      if(limit) scope = scope.limit(limit);
      if(offset) scope = scope.skip(offset);
      return scope;
  },
  countScope: function(attributes, userAttributes, offset, limit) {
    return Channel.count({app: attributes.app_id});
  }
};
