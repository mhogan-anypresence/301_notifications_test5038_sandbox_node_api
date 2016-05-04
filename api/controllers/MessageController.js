var util      = require('util'),
    Promise   = require('bluebird'),
    analytics = require('../../api/analytics/analytics'),
    utilities = require('../../config/utilities'),
    push      = require('../libs/push-notifications/push'),
    _         = require('lodash');

function handleError(res) {
  return function(e) {
    if (e.ValidationError) return res.send(422, e);
    sails.log.error(util.inspect(e) + '\n');
    res.send(500, e);
  };
}

function getScope(req) {
  var scopeName = req.query['scope'] || 'all';
  var limit = parseInt(req.query['limit']) || null;
  var offset = parseInt(req.query['offset']) || null;
  var fn = Message[scopeName + 'Scope'];
  return fn(req.params, {}, offset, limit);
}

var MessageController = {
  find: function (req, res) {
    sails.log.debug('MessageController.find');
    var id = req.params['id'];
    var results;

    (function() {
      if (id) {
        return Message.findOne({id: id});
      } else {
        return getScope(req);
      }
    })()
    .then(function(result) {
      if (!id && !Array.isArray(result)) result = [result];
      results = result;
      sails.log.debug('responding with: \n' + util.inspect(results) + '\n');
      res.send(result);
    })
    .catch(handleError(res))
    .finally(function() {
      if (results) return analytics.analyse(req, res, utilities.sizeOf(results));
      return analytics.analyse(req, res);
    });
  },
  findChannelMessages: function(req, res) {
    var channelId = req.params['channel_id'];

    Message.find({channel: channelId})
    .then(function(result) {
      res.send(result);
    })
    .catch(handleError(res));
  },
  create: function (req, res) {
    var channelName = req.body.channelName,
        app         = req.options.defaultApp;

    var channel, app, message;

    var copyToPersist = _.cloneDeep(req.body);
    delete copyToPersist.channelName;
    delete copyToPersist.appName;
    copyToPersist.app = app.id;

    Channel.findOne({name: channelName})
    .then(function(result) {
      channel = result;
      if (channel) copyToPersist.channel = channel.id;
    })
    .then(function() {
      return Message.create(copyToPersist);
    })
    .then(function(result) {
      message = result;
      return Promise.promisify(push.sendMessage)(result, channelName, app.id);
    })
    .then(function() {
      res.send(message);
    })
    .catch(handleError(res));
  }
};

module.exports = MessageController;
