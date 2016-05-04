var sails = require('sails');

var adapter = (sails.config && sails.config.environment === 'test') ? 'memory' : 'local';

module.exports = {
  tableName: 'Message',
  connection: [adapter],
  attributes: {
    appleBadge: {
      type: 'integer',
      defaultsTo: 1
    },
    appleAlert: {
      type: 'text',
      defaultsTo: "\uD83D\uDCE7 You have a new notification!"
    },
    appleSound: {
      type: 'text',
      defaultsTo: 'ping.aiff'
    },
    appleExpiry: {
      type: 'integer', //Minutes
      defaultsTo: 60
    },
    appleContentAvailable: {
      type: 'integer',
      in: [0, 1],
      defaultsTo: 0
    },
    googleCollapseKey: {
      type: 'text'
    },
    googleDelayWhileIdle: {
      type: 'boolean'
    },
    googleTimeToLive: {
      type: 'integer'
    },
    payload: {
      type: 'text',
      required: true
    },
    channel: {
      model: 'Channel',
      required: true
    }
  },
  autoPK: true,
  autoCreatedAt: true,
  autoUpdatedAt: false,
  allScope: function(attributes, userAttributes, offset, limit) {
    var scope = Message.find({app: attributes.app_id}).sort({createdAt: 'desc'}).populate('channel');
    if(limit) {
      scope = scope.limit(limit);
    }
    if(offset) {
      scope = scope.skip(offset);
    }
    return scope;
  },
  countScope: function(attributes, userAttributes, offset, limit) {
    return Message.count({app: attributes.app_id});
  }
};
