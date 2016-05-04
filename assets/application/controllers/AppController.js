'use strict';

/* Controllers */

function setupMultipartForm($scope, $location, $http, httpErrorHandler) {
  $scope.showCerts = true;

  $scope.toggleShowCerts = function(val) {
    $scope.showCerts = val;
  };

  $scope.submit = function(instance) {
    var fd = new FormData();

    for (var key in instance) {
      if (instance[key] !== undefined) fd.append(key, instance[key]);
    }

    $http.post($scope.postUrl, fd, {
      transformRequest: function(data) { return data; },
      headers: {'Content-Type': undefined}
    })
    .success(function(d) {
      $location.path('messaging');
    })
    .error(httpErrorHandler($scope));

  };
}

angular.module('adminConsole.controllers.AppControllers', ['adminConsole.services'])
  .controller('AppListController', ['App', '$scope', 'httpErrorHandler', '$route', function (App, $scope, httpErrorHandler, $route) {
    $scope.error = false;
    $scope.errorMessage = null;

    $scope.destroy = function(id) {
      if (confirm('Are you sure?')) {
        App.delete({id: id}).$promise
        .then(function(result) {
          $route.reload();
        })
        .catch(httpErrorHandler($scope));
      }
    };

    App.query().$promise
    .then(function(results) {
      $scope.instances = results;
    })
    .catch(httpErrorHandler($scope));
  }])

  .controller('AppEditController', ['App', '$scope', '$http', '$location', '$routeParams', 'httpErrorHandler', function (App, $scope, $http, $location, $routeParams, httpErrorHandler) {
    $scope.postUrl = '/api/push_notifications/apps/' + $routeParams.app_id;

    setupMultipartForm($scope, $location, $http, httpErrorHandler);

    App.get({id: $routeParams.app_id}).$promise
    .then(function(results) {
      $scope.instance = JSON.parse(angular.toJson(results)); // Hacky stuff to convert angular resource to POJO...
    })
    .catch(httpErrorHandler($scope));
  }])

  .controller('AppCreateController', ['App', '$scope', '$location', 'httpErrorHandler', '$http', function (App, $scope, $location, httpErrorHandler, $http) {
    $scope.instance = {
      production: false,
      adminPushOnly: true
    };
    $scope.postUrl = '/api/push_notifications/apps';

    setupMultipartForm($scope, $location, $http, httpErrorHandler);
  }]);
