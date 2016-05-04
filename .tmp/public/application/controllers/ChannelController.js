'use strict';

/* Controllers */

angular.module('adminConsole.controllers.ChannelControllers', ['adminConsole.services'])

  .controller('ChannelListController', ['Channel', 'Device', '$scope', '$location', '$log', 'Utilities', 'httpErrorHandler', '$route', function (Channel, Device, scope, location, log, utilities, httpErrorHandler, route) {
    scope.error = false;
    scope.errorMessage = null;
    scope.linkClass = utilities.linkClass;
    scope.pagination = scope.channelPagination;
    scope.instances = scope.pagination.instances;
    scope.app_id = route.current.params.app_id;

    scope.destroy = function (channelId) {
      if (confirm('Are you sure?')) {
        Channel.delete({id: channelId, app_id: scope.app_id}).$promise
          .then(function(results) {
            scope.pagination.refresh();
            route.reload();
          })
          .catch(httpErrorHandler(scope));
      }
    };
  }])

  .controller('ChannelDetailController', ['Channel', 'Message', 'App', '$scope', '$location', '$log', '$routeParams', 'Utilities', 'httpErrorHandler', '$route', 'SetCurrentApp', function (Channel, Message, App, scope, location, log, routeParams, utilities, httpErrorHandler, route, setCurrentApp) {
    setCurrentApp(httpErrorHandler, scope, App);
    scope.linkClass = utilities.linkClass;
    scope.id = routeParams.id;
    scope.app_id = route.current.params.app_id;

    Channel.get({id: scope.id, app_id: scope.app_id}).$promise
      .then(function(results) {
        scope.instance = results;
      })
      .catch(httpErrorHandler(scope));
  }])

  .controller('ChannelCreateController', ['Channel', 'App', 'PaginationCache', '$scope', '$location', '$log', '$routeParams', 'Utilities', 'httpErrorHandler', '$route', 'SetCurrentApp', function (Channel, App, PaginationCache, scope, location, log, routeParams, utilities, httpErrorHandler, route, setCurrentApp) {
    setCurrentApp(httpErrorHandler, scope, App);
    scope.linkClass = utilities.linkClass;
    scope.instance = {};
    scope.app_id = route.current.params.app_id;

    scope.submit = function (instance) {
      Channel.save({app_id: scope.app_id}, instance).$promise
        .then(function(results) {
          // Get the current app's pagination cache and remove the channelCount from it,
          // forcing it to update when the location reloads.
          var cache = PaginationCache.get(scope.app_id);
          if (cache) delete cache['channelCount'];
          location.path('messaging/' + scope.app_id + '/index');
        })
        .catch(httpErrorHandler(scope));
    };
  }])

  .controller('ChannelEditController', ['Channel', 'App', '$scope', '$location', '$log', '$routeParams', 'Utilities', 'httpErrorHandler', '$route', 'SetCurrentApp', function (Channel, App, scope, location, log, routeParams, utilities, httpErrorHandler, route, setCurrentApp) {
    setCurrentApp(httpErrorHandler, scope, App);
    scope.linkClass = utilities.linkClass;
    scope.id = routeParams.id;
    scope.app_id = route.current.params.app_id;

    Channel.get({app_id: scope.app_id, id: scope.id}).$promise
      .then(function(results) {
        scope.instance = results;
      })
      .catch(httpErrorHandler(scope));

    scope.submit = function (instance) {
      Channel.update({id: scope.id, app_id: scope.app_id}, instance).$promise
        .then(function(results) {
          location.path('messaging/' + scope.app_id + '/index');
        })
        .catch(httpErrorHandler(scope));
    };

  }]);
