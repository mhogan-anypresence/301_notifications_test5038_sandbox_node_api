'use strict';

/* Controllers */

angular.module('adminConsole.controllers.DeviceControllers', ['adminConsole.services'])
  .controller('DeviceListController', ['Device', 'Channel', '$scope', '$location', '$log', 'Utilities', 'httpErrorHandler', '$route', function (Device, Channel, scope, location, log, utilities, httpErrorHandler, route) {
    scope.linkClass = utilities.linkClass;
    scope.pagination = scope.devicePagination;
    scope.instances = scope.pagination.instances;
    scope.app_id = route.current.params.app_id;

    scope.destroy = function (deviceId) {
      if (confirm('Are you sure?')) {
        Device.delete({id: deviceId, app_id: scope.app_id}).$promise
          .then(function(results) {
            scope.pagination.refresh();
            route.reload();
          })
          .catch(httpErrorHandler(scope));
        }
    };
  }])

  .controller('DeviceDetailController', ['Device', 'Channel', 'App', '$scope', '$location', '$log', '$routeParams', 'Utilities', 'httpErrorHandler', '$http', '$route', 'SetCurrentApp', function (Device, Channel, App, scope, location, log, routeParams, utilities, httpErrorHandler, http, route, setCurrentApp) {
    setCurrentApp(httpErrorHandler, scope, App);
    scope.linkClass = utilities.linkClass;
    scope.id = routeParams.id;
    scope.app_id = route.current.params.app_id;
    scope.channels = [];

    scope.subscribe = function() {
      if (!scope.selectedChannel) return;
      var payload = {};
      payload.token = scope.instance.identifier;
      payload.provider = scope.instance.provider;
      payload.appName = scope.currentApp.name;
      payload.channelName = scope.selectedChannel.name;

      Channel.subscribe(payload).$promise
      .then(function(result) {
        scope.instance = result;
      })
      .catch(httpErrorHandler(scope));
    };

    scope.unsubscribe = function(channelName) {
      var payload = {};
      payload.token = scope.instance.identifier;
      payload.channelName = channelName;
      payload.appName = scope.currentApp.name;

      Channel.unsubscribe(payload).$promise
      .then(function(result) {
        scope.instance = result;
      })
      .catch(httpErrorHandler(scope));
    };

    var device;
    Device.get({id: routeParams.id, app_id: scope.app_id}).$promise
      .then(function(results) {
        scope.instance = results;
      })
      .then(function() {
        return Channel.findDeviceChannels({id: scope.id, app_id: scope.app_id}).$promise;
      })
      .then(function(channels) {
        scope.instance.channels = channels;
        return Channel.query({app_id: scope.app_id}).$promise;
      })
      .then(function(results) {
        scope.channels = results;
      })
      .catch(httpErrorHandler(scope));
  }])

  .controller('DeviceCreateController', ['Device', 'App', 'PaginationCache', '$scope', '$location', '$log', '$routeParams', 'Utilities', 'httpErrorHandler','$route', 'SetCurrentApp', function (Device, App, PaginationCache, scope, location, log, routeParams, utilities, httpErrorHandler, route, setCurrentApp) {
    setCurrentApp(httpErrorHandler, scope, App);
    scope.linkClass = utilities.linkClass;
    scope.instance = {provider: 'APPLE'};
    scope.app_id = route.current.params.app_id;

    scope.submit = function (instance) {
      Device.save({app_id: scope.app_id}, instance).$promise
        .then(function(results) {
          var cache = PaginationCache.get(scope.app_id);
          if (cache) delete cache['deviceCount'];
          location.path('messaging/' + scope.app_id + '/index');
        })
        .catch(httpErrorHandler(scope));
    };
  }])

  .controller('DeviceEditController', ['Device', 'App', '$scope', '$location', '$log', '$routeParams', 'Utilities', 'httpErrorHandler', '$route', 'SetCurrentApp', function (Device, App, scope, location, log, routeParams, utilities, httpErrorHandler, route, setCurrentApp) {
    setCurrentApp(httpErrorHandler, scope, App);
    scope.linkClass = utilities.linkClass;
    scope.id = routeParams.id;
    scope.app_id = route.current.params.app_id;

    Device.get({id: scope.id, app_id: scope.app_id}).$promise
      .then(function(results) {
        scope.instance = results;
      })
      .catch(httpErrorHandler(scope));

    scope.submit = function (instance) {
      Device.update({id: scope.id, app_id: scope.app_id}, instance).$promise
        .then(function(results) {
          scope.instance = results;
          location.path('messaging/' + scope.app_id + '/index');
        })
        .catch(httpErrorHandler(scope));
    };
  }]);
