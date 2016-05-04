
module.exports = {
  message: function(req, msgs) {
    var Promise = require('bluebird');
    var util = require('util');
    console.log('msgs: ' + util.inspect(msgs));
    var NotificationLog = this.models('notificationLog');
		var _this = this;
		var actions = [];
		
		function push(msg) {
			if(msg.receiver.channel) {
				msg.is_channel = true;
				if(msg.receiver.channel.name) {
					msg.channelName = msg.receiver.channel.name;
					delete msg.receiver;
				}
				else if(msg.receiver.channel.id) msg.receiver = msg.receiver.channel.id;
			} 
			else if(msg.receiver.device) msg.receiver = msg.receiver.device.id;
			
			if(msg.apple !== undefined) {
				msg.apple_badge = msg.apple.badge;
				msg.apple_sound = msg.apple.sound;
				msg.apple_expiry = msg.apple.expiry;
			}
			if(msg.google !== undefined) {
				msg.google_apiKey = msg.google.apiKey;
				msg.google_collapseKey = msg.google.collapseKey;
				msg.google_delayWhileIdle = msg.google.delayWhileIdle;
				msg.google_timeToLive = msg.google.timeToLive;
			}
			return AP.message.create(msg, function(err, rsp){
				if(err || rsp.code !== 201) sails.log.debug('error creating Push Notifictions: ' + util.inspect(err || rsp));
      	else {
					NotificationLog.create({
						message: msg.alert,
						notification_type: 'Push Notification',
						user_name: req.context.currentUser.username,
						sent_at: new Date()
					})
					.then(function(resultNotificationLog) { sails.log.debug('NotificationLog created, responding with: ' + util.inspect(resultNotificationLog)); })
					.catch(function(err) { sails.log.debug('error creating NotificationLog for Push Notifications: ' + util.inspect(err)); });
				}
    	});
		}
		
		function send(message) {
			var Model = message.model ? _this.models(message.model) : undefined;
			if(Model !== undefined && Model.request) {
				return Promise.promisify(Model.request)('create', {}, {}, { body: message.body })
					.then(function(resultMessage) {
						sails.log.debug(message.model + ' responding with: ' + util.inspect(resultMessage));
						NotificationLog.create({
							message: req.context.body[message.model].message,
							notification_type: message.model,
							user_name: req.context.currentUser.username,
							sent_at: new Date()
						})
						.then(function(resultNotificationLog) { sails.log.debug('Notification created, responding with: ' + util.inspect(resultNotificationLog)); })
						.catch(function(err) { sails.log.debug('error Notification ' + message.model + ': ' + util.inspect(err)); });
					})
					.catch(function(err) { sails.log.debug('error ' + message.model + ': ' + util.inspect(err)); });
			}
		}
		
		msgs.forEach(function(msg) {
			if(msg.model) actions.push(send(msg));
			else if(msg.receiver) actions.push(push(msg));
		});
		console.log(actions);
		return Promise.all(actions);
	}
}