module.exports = {
//uses_authentication && has_object_role_authorizations	
  'v1notificationlog': {
    'requiresAuthentication': true,
		
    'Authenticated Without Role Default': {
      'permittedScopes': [ 'all', 'exactMatch', 'count', 'countExactMatch' ],
      'objectLevelPermissions': [ 'read' ],
      'fieldLevelPermissions': {
        'creatable': null,
        'updatable': null,
        'readable' : [ 'message', 'notificationType', 'sentAt', 'userName' ]
			}
		},
		
	},
	
  'v1order': {
    'requiresAuthentication': true,
		
    'Authenticated Without Role Default': {
      'permittedScopes': [ 'all', 'exactMatch', 'count', 'countExactMatch' ],
      'objectLevelPermissions': [ 'create', 'read' ],
      'fieldLevelPermissions': {
        'creatable': [ 'id', 'desc', 'name' ],
        'updatable': null,
        'readable' : [ 'id', 'desc', 'name' ]
			}
		},
		
	},
	
  'v1user': {
    'requiresAuthentication': true,
		
    'Authenticated Without Role Default': {
      'permittedScopes': [ 'exactMatch', 'myUserRecord' ],
      'objectLevelPermissions': [ 'read', 'update' ],
      'fieldLevelPermissions': {
        'creatable': null,
        'updatable': [ 'emailAddress', 'phoneNumber', 'sendPushNotifications', 'sendSendgridNotifications', 'sendTwilioNotifications', 'username' ],
        'readable' : [ 'id', 'emailAddress', 'phoneNumber', 'role', 'sendPushNotifications', 'sendSendgridNotifications', 'sendTwilioNotifications', 'username' ]
			}
		},
		
	},
	
};