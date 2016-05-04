'use strict';

/* Controllers */

angular.module('adminConsole.controllers.MessageControllers', ['adminConsole.services'])

  .controller('MessageListController', ['Message', '$scope', '$location', '$log', 'Utilities', 'httpErrorHandler', '$http', '$route', '$rootScope', function (Message, scope, location, log, utilities, httpErrorHandler, http, route, $rootScope) {
    scope.linkClass = utilities.linkClass;
    scope.pagination = scope.messagePagination;
    scope.instances = scope.pagination.instances;

    $rootScope.$on('rootScope:messageSent', function(event, data) {
      scope.pagination.fetchAndRefresh(function(err, instances) {
        scope.instances = instances;
      });
    });

    scope.formatDate = function(d) {
      var date = new Date(d);
      return (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear() + ' ' + date.toLocaleTimeString();
    };

  }])
  .controller('MessageCreateController', ['Message', 'App', 'PaginationCache', 'Channel', '$scope', '$location', '$log', '$routeParams', 'Utilities', '$http', '$route', 'SetCurrentApp', '$rootScope', function (Message, App, PaginationCache, Channel, scope, location, log, routeParams, utilities, http, route, setCurrentApp, $rootScope) {
    setCurrentApp(function() {}, scope, App);
    scope.linkClass = utilities.linkClass;
    scope.instance = {};
    scope.message = {
      googleDelayWhileIdle: "false",
      appleContentAvailable: 0
    };
    scope.app_id = route.current.params.app_id;

    Channel.query({app_id: scope.app_id}).$promise
      .then(function (results) {
        scope.channels = results;
        if(results.length > 0) scope.message.channelName = results[0].name;
      })
      .catch(function(err) {
        console.log(err);
      });

    scope.send = function() {
      scope.message.appName = scope.currentApp.name;
      scope.success = false;
      scope.error = false;
      scope.errors = {};
      scope.errorMessage = null;

      Message.send(scope.message).$promise
      .then(function(result) {
        scope.success = true;
        $rootScope.$broadcast('rootScope:messageSent');
      })
      .catch(function(err) {
        err = err.data;
        scope.error = true;
        scope.errors = {};

        if (err.error === 'E_VALIDATION') {
          var invalidAttributes = err.invalidAttributes;
          Object.keys(invalidAttributes).forEach(function(key) {
            scope.errors[key] = [];
            invalidAttributes[key].forEach(function(validationError) {
              scope.errors[key].push(validationError);
            });
          });
        } else {
          scope.errorMessage = err.message;
        }
      });
    };
  }]);
