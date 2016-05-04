'use strict';


// Declare app level module which depends on filters, and services
angular.module('adminConsole', [
  'ngRoute',
  'adminConsole.services',
  'adminConsole.controllers',
  'adminConsole.controllers.AnalyticsControllers',
  'adminConsole.controllers.DeviceControllers',
  'adminConsole.controllers.MessageControllers',
  'adminConsole.controllers.ChannelControllers',
  'adminConsole.controllers.AppControllers',
  'adminConsole.controllers.V1NotificationLogControllers',
  'adminConsole.controllers.V1OrderControllers',
  'adminConsole.controllers.V1SendGridControllers',
  'adminConsole.controllers.V1TwilioControllers',
  'adminConsole.controllers.V1UserControllers',
  'adminConsole.directives'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/index', { templateUrl: 'templates/views/partials/mainIndex.html', controller: 'MainIndexController' });
  $routeProvider.when('/sign_in', { templateUrl: 'templates/views/partials/signIn.html', controller: 'LoginController' });
  $routeProvider.when('/docs', { templateUrl: 'templates/views/partials/docs.html' });
  $routeProvider.when('/sign_out', { template: '', controller: 'LogoutController' });
  $routeProvider.when('/notification_logs', {templateUrl: 'templates/views/partials/notification_logs/index.html', controller: 'V1NotificationLogListController', resolve: {
    pagination: ['PaginationService', 'V1NotificationLog', function(PaginationService, model) {
      var service = new PaginationService({model: model, modelName: 'notification_logs', supportsServerPagination: true});
      return service.paginate();
    }]
  }});
  $routeProvider.when('/notification_logs/index', {templateUrl: 'templates/views/partials/notification_logs/index.html', controller: 'V1NotificationLogListController'});
  $routeProvider.when('/notification_logs/new', {templateUrl: 'templates/views/partials/notification_logs/create.html', controller: 'V1NotificationLogCreateController'});
  $routeProvider.when('/notification_logs/:objectId/edit', {templateUrl: 'templates/views/partials/notification_logs/edit.html', controller: 'V1NotificationLogEditController'});
  $routeProvider.when('/notification_logs/:objectId', {templateUrl: 'templates/views/partials/notification_logs/show.html', controller: 'V1NotificationLogDetailController'});
  $routeProvider.when('/orders', {templateUrl: 'templates/views/partials/orders/index.html', controller: 'V1OrderListController', resolve: {
    pagination: ['PaginationService', 'V1Order', function(PaginationService, model) {
      var service = new PaginationService({model: model, modelName: 'orders', supportsServerPagination: true});
      return service.paginate();
    }]
  }});
  $routeProvider.when('/orders/index', {templateUrl: 'templates/views/partials/orders/index.html', controller: 'V1OrderListController'});
  $routeProvider.when('/orders/new', {templateUrl: 'templates/views/partials/orders/create.html', controller: 'V1OrderCreateController'});
  $routeProvider.when('/orders/:objectId/edit', {templateUrl: 'templates/views/partials/orders/edit.html', controller: 'V1OrderEditController'});
  $routeProvider.when('/orders/:objectId', {templateUrl: 'templates/views/partials/orders/show.html', controller: 'V1OrderDetailController'});
  $routeProvider.when('/send_grids', {templateUrl: 'templates/views/partials/send_grids/index.html', controller: 'V1SendGridListController', resolve: {
    pagination: ['PaginationService', 'V1SendGrid', function(PaginationService, model) {
      var service = new PaginationService({model: model, modelName: 'send_grids', supportsServerPagination: false});
      return service.paginate();
    }]
  }});
  $routeProvider.when('/send_grids/index', {templateUrl: 'templates/views/partials/send_grids/index.html', controller: 'V1SendGridListController'});
  $routeProvider.when('/send_grids/new', {templateUrl: 'templates/views/partials/send_grids/create.html', controller: 'V1SendGridCreateController'});
  $routeProvider.when('/send_grids/:objectId/edit', {templateUrl: 'templates/views/partials/send_grids/edit.html', controller: 'V1SendGridEditController'});
  $routeProvider.when('/send_grids/:objectId', {templateUrl: 'templates/views/partials/send_grids/show.html', controller: 'V1SendGridDetailController'});
  $routeProvider.when('/twilios', {templateUrl: 'templates/views/partials/twilios/index.html', controller: 'V1TwilioListController', resolve: {
    pagination: ['PaginationService', 'V1Twilio', function(PaginationService, model) {
      var service = new PaginationService({model: model, modelName: 'twilios', supportsServerPagination: false});
      return service.paginate();
    }]
  }});
  $routeProvider.when('/twilios/index', {templateUrl: 'templates/views/partials/twilios/index.html', controller: 'V1TwilioListController'});
  $routeProvider.when('/twilios/new', {templateUrl: 'templates/views/partials/twilios/create.html', controller: 'V1TwilioCreateController'});
  $routeProvider.when('/twilios/:objectId/edit', {templateUrl: 'templates/views/partials/twilios/edit.html', controller: 'V1TwilioEditController'});
  $routeProvider.when('/twilios/:objectId', {templateUrl: 'templates/views/partials/twilios/show.html', controller: 'V1TwilioDetailController'});
  $routeProvider.when('/users', {templateUrl: 'templates/views/partials/users/index.html', controller: 'V1UserListController', resolve: {
    pagination: ['PaginationService', 'V1User', function(PaginationService, model) {
      var service = new PaginationService({model: model, modelName: 'users', supportsServerPagination: true});
      return service.paginate();
    }]
  }});
  $routeProvider.when('/users/index', {templateUrl: 'templates/views/partials/users/index.html', controller: 'V1UserListController'});
  $routeProvider.when('/users/new', {templateUrl: 'templates/views/partials/users/create.html', controller: 'V1UserCreateController'});
  $routeProvider.when('/users/:objectId/edit', {templateUrl: 'templates/views/partials/users/edit.html', controller: 'V1UserEditController'});
  $routeProvider.when('/users/:objectId', {templateUrl: 'templates/views/partials/users/show.html', controller: 'V1UserDetailController'});
  $routeProvider.when('/messaging', { templateUrl: 'templates/views/partials/messaging/index.html', controller:'AppListController'});
 $routeProvider.when('/messaging/:app_id/index', { templateUrl: 'templates/views/partials/messaging/app/index_app.html', controller: 'MessagingIndexController', resolve: {
    channelPagination: ['PaginationService', 'Channel', '$route', function(PaginationService, model, $route) {
      var app_id = $route.current.params.app_id;
      var service = new PaginationService({model: model, limit: 5, pageParamName: 'channelPage', modelName: 'channel', params: {app_id: app_id}, supportsServerPagination: true});
      return service.paginate();
    }],
    devicePagination: ['PaginationService', 'Device', '$route', function(PaginationService, model, $route) {
      var app_id = $route.current.params.app_id;
      var service = new PaginationService({model: model, limit: 5, pageParamName: 'devicePage', modelName: 'device', params: {app_id: app_id}, supportsServerPagination: true});
      return service.paginate();
    }],
    messagePagination: ['PaginationService', 'Message', '$route', function(PaginationService, model, $route) {
      var app_id = $route.current.params.app_id;
      var service = new PaginationService({model: model, limit: 5, pageParamName: 'messagePage', modelName: 'message', params: {app_id: app_id}, supportsServerPagination: true });
      return service.paginate();
    }]
  }});
$routeProvider.when('/documentation', { templateUrl: 'templates/views/partials/documentation/documentation.html', controller: 'MainIndexController'});
  $routeProvider.when('/messaging/device/index', { templateUrl: 'templates/views/partials/messaging/device/index_device.html', controller: 'DeviceListController'});
  $routeProvider.when('/messaging/:app_id/device/new', { templateUrl: 'templates/views/partials/messaging/device/create_device.html', controller: 'DeviceCreateController'});
  $routeProvider.when('/messaging/new', { templateUrl: 'templates/views/partials/messaging/app/create_app.html', controller: 'AppCreateController'});
  $routeProvider.when('/messaging/:app_id/edit', { templateUrl: 'templates/views/partials/messaging/app/edit_app.html', controller: 'AppEditController'});
  $routeProvider.when('/messaging/:app_id/device/:id/edit', { templateUrl: 'templates/views/partials/messaging/device/edit_device.html', controller: 'DeviceEditController'});
  $routeProvider.when('/messaging/:app_id/device/:id', { templateUrl: 'templates/views/partials/messaging/device/show_device.html', controller: 'DeviceDetailController'});
  $routeProvider.when('/messaging/:app_id/channel/new', { templateUrl: 'templates/views/partials/messaging/channel/create_channel.html', controller: 'ChannelCreateController'});
  $routeProvider.when('/messaging/channel/index', { templateUrl: 'templates/views/partials/messaging/channel/index_channel.html', controller: 'ChannelListController'});
  $routeProvider.when('/messaging/:app_id/channel/:id/edit', { templateUrl: 'templates/views/partials/messaging/channel/edit_channel.html', controller: 'ChannelEditController'});
  $routeProvider.when('/messaging/:app_id/channel/:id', { templateUrl: 'templates/views/partials/messaging/channel/show_channel.html', controller: 'ChannelDetailController'});
  $routeProvider.when('/messaging/message/index', { templateUrl: 'templates/views/partials/messaging/message/index_message.html', controller: 'MessageListController'});
  $routeProvider.when('/messaging/message/new', { templateUrl: 'templates/views/partials/messaging/message/create_message.html', controller: 'MessageCreateController'});
  $routeProvider.when('/messaging/message/:objectId/edit', { templateUrl: 'templates/views/partials/messaging/message/edit_message.html', controller: 'MessageEditController'});
  $routeProvider.when('/messaging/message/:objectId', { templateUrl: 'templates/views/partials/messaging/message/show_message.html', controller: 'MessageDetailController'});
  $routeProvider.when('/analytics', { templateUrl: 'templates/views/partials/analytics/analytics.html', controller: 'AnalyticsMainController' });
  $routeProvider.otherwise({redirectTo: '/index'});
}])
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('ResponseInterceptor');
}])
.run(['$rootScope', '$location', 'UserService', function($rootScope, $location, UserService) {
  $rootScope.$on('$locationChangeStart', function(event, next, current) {
    if ( UserService.getCurrentUser() == null ) {
      // Only redirect to sign in page if not already going there
      if ( next.templateUrl !== "templates/views/partials/signIn.html" ) {
        $location.path( "sign_in" );
      }
    }
  });
}]);
