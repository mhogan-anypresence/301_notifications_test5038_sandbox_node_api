var util = require('util');
var sails = require('sails');
var fs = require('fs');
var inflection = require('inflection');
var utilities = require('./utilities');


module.exports.routes = function () {
    var routes = {
        'GET /': 'AdminController.index',
        'GET /admin': 'AdminController.index',
        'GET /admin/index': 'AdminController.index',
        'GET /admin/objectCounts': 'AdminController.countAll',
        'GET /health-check': 'APHealthCheckController.healthcheck',
        // Unversioned authentication routes
        'POST /auth/:strategy/callback': 'APAuthenticatedSessionsController.login',
        'PUT /auth/:strategy/callback': 'APAuthenticatedSessionsController.login',
        'GET /auth/:strategy/callback': 'APAuthenticatedSessionsController.login',
        'PATCH /auth/:strategy/callback': 'APAuthenticatedSessionsController.login',
        'DELETE /auth/:strategy/callback': 'APAuthenticatedSessionsController.login',
        
        // Versioned authentication routes
        'POST /auth/:version/:strategy/callback': 'APAuthenticatedSessionsController.login',
        'PUT /auth/:version/:strategy/callback': 'APAuthenticatedSessionsController.login',
        'GET /auth/:version/:strategy/callback': 'APAuthenticatedSessionsController.login',
        'PATCH /auth/:version/:strategy/callback': 'APAuthenticatedSessionsController.login',
        'DELETE /auth/:version/:strategy/callback': 'APAuthenticatedSessionsController.login',
        

        'POST /auth/signout': 'APAuthenticatedSessionsController.logout',
        'GET /api/activity' : 'ActivityController.find',
        'DELETE /api/activity/:id' : 'ActivityController.destroy',
        'POST /api/activity' : 'ActivityController.create',
        'PUT /api/activity' : 'ActivityController.update',
        'GET /api/activity/:id' : 'ActivityController.findById',
        'POST /api/activity/aggregate' : 'ActivityController.aggregate',
        'GET /api/info' : 'InfoController.find',

        'POST /api/push_notifications/channel/subscribe' : 'ChannelController.subscribe',
        'POST /api/push_notifications/channel/unsubscribe' : 'ChannelController.unsubscribe',
        'GET /api/push_notifications/device/:identifier/channels' : 'DeviceController.findDeviceChannels',
        'POST /api/push_notifications/message' : 'MessageController.create',

        'GET /api/push_notifications/apps' : 'AppController.find',
        'GET /api/push_notifications/apps/:id' : 'AppController.find',
        'DELETE /api/push_notifications/apps/:id' : 'AppController.destroy',
        'PUT /api/push_notifications/apps/:id' : 'AppController.update',
        'POST /api/push_notifications/apps/:id' : 'AppController.update',
        'POST /api/push_notifications/apps' : 'AppController.create',

        'GET /api/push_notifications/apps/:app_id/devices' : 'DeviceController.find',
        'GET /api/push_notifications/apps/:app_id/devices/:id' : 'DeviceController.find',
        'DELETE /api/push_notifications/apps/:app_id/devices/:id' : 'DeviceController.destroy',
        'POST /api/push_notifications/apps/:app_id/devices' : 'DeviceController.create',
        'PUT /api/push_notifications/apps/:app_id/devices' : 'DeviceController.update',
        'PUT /api/push_notifications/apps/:app_id/devices/:id' : 'DeviceController.update',
        'GET /api/push_notifications/apps/:app_id/devices/:id/channels' : 'DeviceController.findDeviceChannels',
        
        'GET /api/push_notifications/apps/:app_id/channels' : 'ChannelController.find',
        'GET /api/push_notifications/apps/:app_id/channels/:id' : 'ChannelController.find',
        'DELETE /api/push_notifications/apps/:app_id/channels' : 'ChannelController.destroy',
        'DELETE /api/push_notifications/apps/:app_id/channels/:id' : 'ChannelController.destroy',
        'POST /api/push_notifications/apps/:app_id/channels' : 'ChannelController.create',
        'PUT /api/push_notifications/apps/:app_id/channels' : 'ChannelController.update',
        'PUT /api/push_notifications/apps/:app_id/channels/:id' : 'ChannelController.update',
        'POST /api/push_notifications/apps/:app_id/channels/:id/subscribe' : 'ChannelController.subscribe',
        'POST /api/push_notifications/apps/:app_id/channels/unsubscribe' : 'ChannelController.unsubscribe',

        'GET /api/push_notifications/apps/:app_id/messages' : 'MessageController.find',
        'GET /api/push_notifications/apps/:app_id/messages/:id' : 'MessageController.find',
        'GET /api/push_notifications/channels/:channel_id/messages' : 'MessageController.findChannelMessages',

        

        // Begin Version 1
        
        "GET /api/v1/notification_logs/:id?.?(json)?": "V1NotificationLogController.find",
        "GET /api/v1/notification_logs/files/:type/:id": "V1NotificationLogController.file",
        "POST /api/v1/notification_logs(.json)?": "V1NotificationLogController.create",
        "PATCH /api/v1/notification_logs/:id.?(json)?": "V1NotificationLogController.update",
        "PUT /api/v1/notification_logs/:id.?(json)?": "V1NotificationLogController.update",
        "DELETE /api/v1/notification_logs/:id.?(json)?": "V1NotificationLogController.destroy",
        
        "GET /api/v1/orders/:id?.?(json)?": "V1OrderController.find",
        "GET /api/v1/orders/files/:type/:id": "V1OrderController.file",
        "POST /api/v1/orders(.json)?": "V1OrderController.create",
        "PATCH /api/v1/orders/:id.?(json)?": "V1OrderController.update",
        "PUT /api/v1/orders/:id.?(json)?": "V1OrderController.update",
        "DELETE /api/v1/orders/:id.?(json)?": "V1OrderController.destroy",
        
        "GET /api/v1/send_grids/:id?.?(json)?": "V1SendGridController.find",
        "GET /api/v1/send_grids/files/:type/:id": "V1SendGridController.file",
        "POST /api/v1/send_grids(.json)?": "V1SendGridController.create",
        "PATCH /api/v1/send_grids/:id.?(json)?": "V1SendGridController.update",
        "PUT /api/v1/send_grids/:id.?(json)?": "V1SendGridController.update",
        "DELETE /api/v1/send_grids/:id.?(json)?": "V1SendGridController.destroy",
        
        "GET /api/v1/twilios/:id?.?(json)?": "V1TwilioController.find",
        "GET /api/v1/twilios/files/:type/:id": "V1TwilioController.file",
        "POST /api/v1/twilios(.json)?": "V1TwilioController.create",
        "PATCH /api/v1/twilios/:id.?(json)?": "V1TwilioController.update",
        "PUT /api/v1/twilios/:id.?(json)?": "V1TwilioController.update",
        "DELETE /api/v1/twilios/:id.?(json)?": "V1TwilioController.destroy",
        
        "GET /api/v1/users/:id?.?(json)?": "V1UserController.find",
        "GET /api/v1/users/files/:type/:id": "V1UserController.file",
        "POST /api/v1/users(.json)?": "V1UserController.create",
        "PATCH /api/v1/users/:id.?(json)?": "V1UserController.update",
        "PUT /api/v1/users/:id.?(json)?": "V1UserController.update",
        "DELETE /api/v1/users/:id.?(json)?": "V1UserController.destroy",
        

        // Non RESTful API routes
        'POST /api/v1/push_notifications/push_notifications/channel/subscribe' : 'ChannelController.subscribe',
        'POST /api/v1/push_notifications/push_notifications/channel/unsubscribe' : 'ChannelController.unsubscribe',
        'GET /api/v1/push_notifications/device/:identifier/channels' : 'DeviceController.findDeviceChannels',

        // RESTful API routes, mostly used by the admin UI
        'GET /api/v1/push_notifications/apps' : 'AppController.find',
        'GET /api/v1/push_notifications/apps/:id' : 'AppController.find',
        'DELETE /api/v1/push_notifications/apps/:id' : 'AppController.destroy',
        'PUT /api/v1/push_notifications/apps/:id' : 'AppController.update',
        'POST /api/v1/push_notifications/apps/:id' : 'AppController.update',
        'POST /api/v1/push_notifications/apps' : 'AppController.create',

        'GET /api/v1/push_notifications/apps/:app_id/devices' : 'DeviceController.find',
        'GET /api/v1/push_notifications/apps/:app_id/devices/:id' : 'DeviceController.find',
        'DELETE /api/v1/push_notifications/apps/:app_id/devices/:id' : 'DeviceController.destroy',
        'POST /api/v1/push_notifications/apps/:app_id/devices' : 'DeviceController.create',
        'PUT /api/v1/push_notifications/apps/:app_id/devices' : 'DeviceController.update',
        'PUT /api/v1/push_notifications/apps/:app_id/devices/:id' : 'DeviceController.update',
        'GET /api/v1/push_notifications/apps/:app_id/devices/:id/channels' : 'DeviceController.findDeviceChannels',

        'GET /api/v1/push_notifications/apps/:app_id/channels' : 'ChannelController.find',
        'GET /api/v1/push_notifications/apps/:app_id/channels/:id' : 'ChannelController.find',
        'DELETE /api/v1/push_notifications/apps/:app_id/channels' : 'ChannelController.destroy',
        'DELETE /api/v1/push_notifications/apps/:app_id/channels/:id' : 'ChannelController.destroy',
        'POST /api/v1/push_notifications/apps/:app_id/channels' : 'ChannelController.create',
        'PUT /api/v1/push_notifications/apps/:app_id/channels' : 'ChannelController.update',
        'PUT /api/v1/push_notifications/apps/:app_id/channels/:id' : 'ChannelController.update',
        'POST /api/v1/push_notifications/apps/:app_id/channels/:id/subscribe' : 'ChannelController.subscribe',
        'POST /api/v1/push_notifications/apps/:app_id/channels/unsubscribe' : 'ChannelController.unsubscribe',

        'GET /api/v1/push_notifications/apps/:app_id/messages' : 'MessageController.find',
        'GET /api/v1/push_notifications/apps/:app_id/messages/:id' : 'MessageController.find',
        'GET /api/v1/push_notifications/channels/:channel_id/messages' : 'MessageController.findChannelMessages',
        // End Version 1

        // Begin Version Latest
        
        "GET /api/notification_logs/:id?.?(json)?": "V1NotificationLogController.find",
        "GET /api/notification_logs/files/:type/:id": "V1NotificationLogController.file",
        "POST /api/notification_logs(.json)?": "V1NotificationLogController.create",
        "PATCH /api/notification_logs/:id.?(json)?": "V1NotificationLogController.update",
        "PUT /api/notification_logs/:id.?(json)?": "V1NotificationLogController.update",
        "DELETE /api/notification_logs/:id.?(json)?": "V1NotificationLogController.destroy",
        
        "GET /api/orders/:id?.?(json)?": "V1OrderController.find",
        "GET /api/orders/files/:type/:id": "V1OrderController.file",
        "POST /api/orders(.json)?": "V1OrderController.create",
        "PATCH /api/orders/:id.?(json)?": "V1OrderController.update",
        "PUT /api/orders/:id.?(json)?": "V1OrderController.update",
        "DELETE /api/orders/:id.?(json)?": "V1OrderController.destroy",
        
        "GET /api/send_grids/:id?.?(json)?": "V1SendGridController.find",
        "GET /api/send_grids/files/:type/:id": "V1SendGridController.file",
        "POST /api/send_grids(.json)?": "V1SendGridController.create",
        "PATCH /api/send_grids/:id.?(json)?": "V1SendGridController.update",
        "PUT /api/send_grids/:id.?(json)?": "V1SendGridController.update",
        "DELETE /api/send_grids/:id.?(json)?": "V1SendGridController.destroy",
        
        "GET /api/twilios/:id?.?(json)?": "V1TwilioController.find",
        "GET /api/twilios/files/:type/:id": "V1TwilioController.file",
        "POST /api/twilios(.json)?": "V1TwilioController.create",
        "PATCH /api/twilios/:id.?(json)?": "V1TwilioController.update",
        "PUT /api/twilios/:id.?(json)?": "V1TwilioController.update",
        "DELETE /api/twilios/:id.?(json)?": "V1TwilioController.destroy",
        
        "GET /api/users/:id?.?(json)?": "V1UserController.find",
        "GET /api/users/files/:type/:id": "V1UserController.file",
        "POST /api/users(.json)?": "V1UserController.create",
        "PATCH /api/users/:id.?(json)?": "V1UserController.update",
        "PUT /api/users/:id.?(json)?": "V1UserController.update",
        "DELETE /api/users/:id.?(json)?": "V1UserController.destroy",
        
        
        // End Version Latest

    };

    return routes;

}();
