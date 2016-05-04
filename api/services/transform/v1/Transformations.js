module.exports = {
	'v1notificationlog': {
		'in': {
			
				'id': 'id',
			
				'message': 'message',
			
				'notification_type': 'notificationType',
			
				'sent_at': 'sentAt',
			
				'user_name': 'userName',
			
		},
		'out': {
			
				'id': 'id',
			
				'message': 'message',
			
				'notificationType': 'notification_type',
			
				'sentAt': 'sent_at',
			
				'userName': 'user_name',
			
		}
	},
	'v1order': {
		'in': {
			
				'id': 'id',
			
				'desc': 'desc',
			
				'name': 'name',
			
		},
		'out': {
			
				'id': 'id',
			
				'desc': 'desc',
			
				'name': 'name',
			
		}
	},
	'v1sendgrid': {
		'in': {
			
				'id': 'id',
			
				'email_from': 'emailFrom',
			
				'email_to': 'emailTo',
			
				'message': 'message',
			
				'subject': 'subject',
			
		},
		'out': {
			
				'id': 'id',
			
				'emailFrom': 'email_from',
			
				'emailTo': 'email_to',
			
				'message': 'message',
			
				'subject': 'subject',
			
		}
	},
	'v1twilio': {
		'in': {
			
				'id': 'id',
			
				'message': 'message',
			
				'to_phone_number': 'toPhoneNumber',
			
		},
		'out': {
			
				'id': 'id',
			
				'message': 'message',
			
				'toPhoneNumber': 'to_phone_number',
			
		}
	},
	'v1user': {
		'in': {
			
				'id': 'id',
			
				'email_address': 'emailAddress',
			
				'password': 'password',
			
				'password_confirmation': 'passwordConfirmation',
			
				'password_digest': 'passwordDigest',
			
				'phone_number': 'phoneNumber',
			
				'role': 'role',
			
				'send_push_notifications': 'sendPushNotifications',
			
				'send_sendgrid_notifications': 'sendSendgridNotifications',
			
				'send_twilio_notifications': 'sendTwilioNotifications',
			
				'username': 'username',
			
				'x_session_id': 'xSessionId',
			
		},
		'out': {
			
				'id': 'id',
			
				'emailAddress': 'email_address',
			
				'password': 'password',
			
				'passwordConfirmation': 'password_confirmation',
			
				'passwordDigest': 'password_digest',
			
				'phoneNumber': 'phone_number',
			
				'role': 'role',
			
				'sendPushNotifications': 'send_push_notifications',
			
				'sendSendgridNotifications': 'send_sendgrid_notifications',
			
				'sendTwilioNotifications': 'send_twilio_notifications',
			
				'username': 'username',
			
				'xSessionId': 'x_session_id',
			
		}
	},
};
