module.exports = {
  beforeCreate: function(req, done) {
    
    done();

  },

  afterCreate: function(req, res, done) {
    var user = req.context.currentUser || {};
var orderName = req.body.name;
var orderDesc = req.body.desc;
var msgs = [];
if(user.sendSendgridNotifications) {
	msgs.push({
		model: 'sendGrid',
		body: {
			emailFrom: req.context.env.SEND_GRID_FROM,
			emailTo: user.emailAddress,
			subject: 'Order - ' + orderName,
			message: orderDesc
		}
	});
} else sails.log.debug('User does not have SendGrid messages enabled');
if(user.sendTwilioNotifications) {
	msgs.push({
		model: 'twilio',
		body: {
			fromNumber: req.context.env.TWILIO_FROM_NUMBER,
			toNumber: user.phoneNumber,
			message: 'Order - ' + orderName + ': ' + orderDesc
		}
	});
} else sails.log.debug('User does not have Twilio messages enabled');
if(user.sendPushNotifications) {
	msgs.push({
		receiver: { channel: { name: 'orders' }}, //Alternatively, use { device: { id: 'DEVICE ID' }},
		alert: 'Order - ' + orderName + ': ' + orderDesc,
		payload: '',
		google: {
			apiKey: req.context.env.GCM_API_KEY
		}
	});
} else sails.log.debug('User does not have Push Notifications enabled');
this.models('notificationLog').customCode.message(req, msgs).finally(done);
  },

  beforeFind: function(req, done) {
    
    done();

  },

  afterFind: function(req, res, done) {
    
    done();

  },

  beforeUpdate: function(req, done) {
    
    done();

  },

  afterUpdate: function(req, res, done) {
    
    done();

  },

  beforeDestroy: function(req, done) {
    
    done();

  },

  afterDestroy: function(req, res, done) {
    
    done();

  },

  beforeAllScope: function(req, done) {
    
    done();

  },

  afterAllScope: function(req, res, done) {
    
    done();

  },

  beforeExactMatchScope: function(req, done) {
    
    done();

  },

  afterExactMatchScope: function(req, res, done) {
    
    done();

  },

  beforeCountScope: function(req, done) {
    
    done();

  },

  afterCountScope: function(req, res, done) {
    
    done();

  },

  beforeCountExactMatchScope: function(req, done) {
    
    done();

  },

  afterCountExactMatchScope: function(req, res, done) {
    
    done();

  },

};