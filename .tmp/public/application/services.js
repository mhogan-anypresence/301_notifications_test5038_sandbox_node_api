'use strict';

/* Services */

var adminServices = angular.module('adminConsole.services', ['ngResource', 'ngCookies']);

adminServices.factory('V1NotificationLog', ['$resource',
    function($resource) {
        return $resource('/api/v1/notification_logs/:id', { id: '@id' }, {
          'update': { method: 'PUT' }, 
          'save': {method: 'POST', url:'/api/v1/notification_logs', isArray:false},
          'count': {method: 'GET', params: {'scope': 'count'}, isArray: false, transformResponse: function(d) {
            var parsed = JSON.parse(d);
            return {count: parsed[0]};
          }}
        });
    }
]);
adminServices.factory('V1Order', ['$resource',
    function($resource) {
        return $resource('/api/v1/orders/:id', { id: '@id' }, {
          'update': { method: 'PUT' }, 
          'save': {method: 'POST', url:'/api/v1/orders', isArray:false},
          'count': {method: 'GET', params: {'scope': 'count'}, isArray: false, transformResponse: function(d) {
            var parsed = JSON.parse(d);
            return {count: parsed[0]};
          }}
        });
    }
]);
adminServices.factory('V1SendGrid', ['$resource',
    function($resource) {
        return $resource('/api/v1/send_grids/:id', { id: '@id' }, {
          'update': { method: 'PUT' }, 
          'save': {method: 'POST', url:'/api/v1/send_grids', isArray:false},
          'count': {method: 'GET', params: {'scope': 'count'}, isArray: false, transformResponse: function(d) {
            var parsed = JSON.parse(d);
            return {count: parsed[0]};
          }}
        });
    }
]);
adminServices.factory('V1Twilio', ['$resource',
    function($resource) {
        return $resource('/api/v1/twilios/:id', { id: '@id' }, {
          'update': { method: 'PUT' }, 
          'save': {method: 'POST', url:'/api/v1/twilios', isArray:false},
          'count': {method: 'GET', params: {'scope': 'count'}, isArray: false, transformResponse: function(d) {
            var parsed = JSON.parse(d);
            return {count: parsed[0]};
          }}
        });
    }
]);
adminServices.factory('V1User', ['$resource',
    function($resource) {
        return $resource('/api/v1/users/:id', { id: '@id' }, {
          'update': { method: 'PUT' }, 
          'save': {method: 'POST', url:'/api/v1/users', isArray:false},
          'count': {method: 'GET', params: {'scope': 'count'}, isArray: false, transformResponse: function(d) {
            var parsed = JSON.parse(d);
            return {count: parsed[0]};
          }}
        });
    }
]);

adminServices.factory('App', ['$resource', '$route', function($resource) {
  return $resource('/api/push_notifications/apps/:id', {id: '@id'}, {
    'update': {method: 'PUT', url: '/api/push_notifications/apps/:id'}
  });
}]);

adminServices.factory('Channel', ['$resource', function($resource) {
  return $resource('/api/push_notifications/apps/:app_id/channels/:id', { app_id: '@app_id', id: '@id' }, {
    'update': {method: 'PUT', url: '/api/push_notifications/apps/:app_id/channels/:id'},
    'subscribe': {method: 'POST', url: '/api/push_notifications/channel/subscribe'},
    'unsubscribe': {method: 'POST', url: '/api/push_notifications/channel/unsubscribe'},
    'findDeviceChannels': {method: 'GET', url: '/api/push_notifications/apps/:app_id/devices/:id/channels', isArray: true},
    'count': {method: 'GET', params: {'scope': 'count'}, isArray: false, transformResponse: function(d) {
      var parsed = JSON.parse(d);
      return {count: parsed[0]};
    }}
  });
}]);

adminServices.factory('Device', ['$resource', '$route', function($resource, $route) {
  return $resource('/api/push_notifications/apps/:app_id/devices/:id', { app_id: '@app_id', id: '@id' }, {
    'update': {method: 'PUT', url: '/api/push_notifications/apps/:app_id/devices/:id'},
    'count': {method: 'GET', params: {'scope': 'count'}, isArray: false, transformResponse: function(d) {
      var parsed = JSON.parse(d);
      return {count: parsed[0]};
    }}
  });
}]);

adminServices.factory('Message', ['$resource', '$route', function($resource, $route) {
  return $resource('/api/push_notifications/apps/:app_id/messages/:id', { app_id: '@app_id', id: '@id' }, {
    'send': {method: 'POST', url: '/api/push_notifications/message'},
    'findChannelMessages': {method: 'GET', url: '/api/push_notifications/channels/:channel_id/messages', isArray: true},
    'count': {method: 'GET', params: {'scope': 'count'}, isArray: false, transformResponse: function(d) {
      var parsed = JSON.parse(d);
      return {count: parsed[0]};
    }}
  });
}]);

adminServices.factory('SetCurrentApp', ['$route', function($route) {
  return function(httpErrorHandler, scope, App) {
    var app_id = $route.current.params.app_id;
    App.get({id: app_id}).$promise
    .then(function(result) {
      scope.currentApp = result;
    })
    .catch(httpErrorHandler(scope));
  };
}]);

adminServices.factory('PaginationCache', ['$cacheFactory', function($cacheFactory) {
  return $cacheFactory('paginationCache');
}]);

adminServices.factory('PaginationService', ['$q', '$route', '$location', 'PaginationCache', function($q, $route, $location, paginationCache) {
  function Service(options) {
    this.supportsServerPagination = options.supportsServerPagination === undefined ? true : options.supportsServerPagination;
    this.limit = options.limit || 10;
    this.model = options.model;
    this.modelName = options.modelName;
    this.params = options.params || {};
    this.cacheKey = this.params.app_id ? this.params.app_id : options.modelName;

    this.cacheObject = {};
    if (paginationCache.get(this.cacheKey)) this.cacheObject = paginationCache.get(this.cacheKey);

    this.pageParamName = options.pageParamName || 'page';
    paginationCache.put(this.cacheKey, this.cacheObject);
  }

  Service.prototype.slicePage = function(page, collection) {
    var startIndex = (page - 1) * this.limit;
    var coll = collection.slice(startIndex, startIndex + this.limit);
    return coll;
  };

  Service.prototype.paginate = function() {
    var self = this;
    var deferred = $q.defer();

    var countKey = this.modelName + 'Count';
    var modelKey = this.modelName;

    var pagination = {
      service: this,
      page: parseInt($route.current.params[this.pageParamName]) || 1,
      modelName: this.modelName,
      refresh: function(cb) {
        $location.search(self.pageParamName, 1);
      },
      fetchAndRefresh: function(cb) {
        fetch(cb);
      },
      clearCache: function() {
        self.cacheObject[modelKey] = null;
        return this;
      },
      nextPage: function() {
        var maxPage = this.totalPages[this.totalPages.length - 1];
        if (this.page + 1 > maxPage) return;
        $location.search(self.pageParamName, this.page + 1);
      },
      prevPage: function() {
        if (this.page !== 1) {
          $location.search(self.pageParamName, this.page - 1);
        }
      },
      setPage: function(pageNumber) {
        $location.search(self.pageParamName, pageNumber);
      }
    };

    var offset = (pagination.page - 1) * this.limit;
    function fetch(cb) {
      var promises = [];

      //Hacky clone of the params objects
      var _params = JSON.parse(JSON.stringify(self.params));
      _params.limit = self.limit;
      _params.offset = offset;


      promises.push(self.model.query(_params).$promise);

      if (self.cacheObject[countKey]) {
        pagination.count = self.cacheObject[countKey];
      } else {
        promises.push(self.model.count(self.params).$promise);
      }

      $q.all(promises)
        .then(function(results) {
          if (!pagination.count) pagination.count = results[1].count || 0;
          self.cacheObject[countKey] = pagination.count;

          pagination.instances = results[0];
          self.cacheObject[modelKey] = pagination.instances;

          var pageCount = Math.ceil(pagination.count / self.limit);
          // Make a range to iterate across in the view/controller
          pagination.totalPages = [];
          for(var i = 1; i <= pageCount; i++) {
            pagination.totalPages.push(i);
          }

          if (cb) cb(null, pagination.instances);

          deferred.resolve(pagination);
        })
        .catch(function(err) {
          deferred.reject(err);
        });
    }


    if (this.supportsServerPagination) {
      fetch();
    }
    else {
      if (self.cacheObject[countKey] && self.cacheObject[modelKey]) {
        var collection = self.cacheObject[modelKey];
        pagination.instances = self.slicePage(pagination.page, collection);
        pagination.count = self.cacheObject[countKey];
        var pageCount = Math.ceil(pagination.count / self.limit);
        pagination.totalPages = [];
        for(var i = 1; i <= pageCount; i++) {
          pagination.totalPages.push(i);
        }

        deferred.resolve(pagination);
      } else {
        this.model.query().$promise
          .then(function(results) {
            self.cacheObject[countKey] = results.length;
            self.cacheObject[modelKey] = results;
            pagination.instances = self.slicePage(pagination.page, results);

            pagination.count = results.length;
            var pageCount = Math.ceil(pagination.count / self.limit);
            pagination.totalPages = [];
            for(var i = 1; i <= pageCount; i++) {
              pagination.totalPages.push(i);
            }

            deferred.resolve(pagination);
          })
          .catch(function(err) {
            deferred.reject(err);
          });
      }
    }

    return deferred.promise;
  };

  return Service;
}]);


adminServices.factory('SessionService', ['$cookies',
  function($cookies) {
    return {
      clearSession: function() {
        delete $cookies['sails.sid'];
        delete $cookies['adminConsole.currentUser'];
      },
      setCurrentUser: function(userId) {
        $cookies['adminConsole.currentUser'] = userId;
      },
      currentUser: function() {
        return $cookies['adminConsole.currentUser'];
      },
      sessionExists: function() {
        return (typeof $cookies['sails.sid'] !== 'undefined' && $cookies['sails.sid'] !== null);
      }
    };
  }
]);

//
// regarding the $timeout calls below:
//
//   in order to get the freshest copy of the sails.sid cookie,
//   we need to wait 100 milliseconds before accessing it after a
//   request is made using $http.  for whatever reason, angularjs
//   refreshes the stored cookies using it's own timeout function, which
//   runs every 100 milliseconds, rather than refreshing them immediately
//   when they are received. this means that the cookies may not have been
//   refreshed if we access them immediately inside a '.succes' or '.error'
//   method.  if we wait 100 milliseconds, our timeout is guaranteed to
//   fire after the cookies have been set, and the sails.sid cookie should
//   be the freshest value.
//
// for reference, see the following links:
//
//   google group discussion:  https://groups.google.com/forum/#!msg/angular/yc8tODmDm18/X8KYFGlW0QkJ
//   github code snippet:  https://github.com/angular/angular.js/blob/1bb33cccbe12bda4c397ddabab35ba1df85d5137/src/ngCookies/cookies.js#L58-L66
//   github code snippet:  https://github.com/angular/angular.js/blob/1bb33cccbe12bda4c397ddabab35ba1df85d5137/src/ng/browser.js#L102
//

adminServices.factory('UserService', ['$http', '$timeout', 'SessionService',
  function($http, $timeout, SessionService) {
    return {
      login: function(credentials, next) {
        $http.post('/auth/admin/callback', credentials)
          .success(function(data, status, headers) {
            // see comment above for purpose of this timeout
            $timeout(function() {
              if (!SessionService.sessionExists()) {
                SessionService.clearSession();
                next("Unable to extract session id");
              } else {
                SessionService.setCurrentUser(data.email);
                next();
              }
            }, 100);
          }).error(function(data, status) {
            SessionService.clearSession();
            if (status === 401) {
              next('Invalid email/password combination');
            } else {
              next('Unexpected error encountered. HTTP status ' + status + '; data ' + JSON.stringify(data));
            }
          });
      },
      isLoggedIn: function() {
        var current = SessionService.currentUser();
        return (typeof current !== 'undefined' && current !== null);
      },
      getCurrentUser: function() {
        return SessionService.currentUser();
      },
      logout: function(next) {
        $http.post('/auth/signout')
          .success(function(data,status) {
            // see comment above for purpose of this timeout
            $timeout(function() {
              SessionService.clearSession();
              next();
            }, 100);
          }).error(function(data, status) {
            // see comment above for purpose of this timeout
            $timeout(function() {
              SessionService.clearSession();
              next('Failed to invoke signout');
            }, 100);
          });
      }
    };
  }
]);

adminServices.factory('ResponseInterceptor', [ '$q', '$location', 'SessionService',
  function($q, $location, SessionService) {
    return {
      responseError: function(rejection) {
        if ((rejection.status === 401 || rejection.status === 403) && $location.path !== '/sign_in') {
          SessionService.clearSession();
          $location.path('/sign_in');
        }
        // do something on error
        return $q.reject(rejection);
      }
    };
  }
]);

adminServices.factory('Utilities', [ '$location',
  function($location) {
    return {
      linkClass: function(path) {
        return $location.path().substr(0, path.length) === path ? 'active' : '';
      }
    };
  }
]);

adminServices.factory('httpErrorHandler', ['$log', function($log) {
  return function(scope) {
    return function(response) {
      if (response.error && response.error === 'E_VALIDATION') response.data = response;
      $log.error('Received from server: status ' + response.status + ', data ' + response.data);
      scope.loading = false;
      scope.error = true;
      if(response.data && response.data.error === 'E_VALIDATION') {
        scope.errors = {};
        Object.keys(response.data.invalidAttributes).forEach(function(key) {
          scope.errors[key] = [];
          response.data.invalidAttributes[key].forEach(function(validationError) {
            scope.errors[key].push(validationError);
          });
        });
      } else {
        scope.errorMessage = "An unexpected error was encountered.  Response from server was " + response.status;
      }
    };
  };
}]);

adminServices.factory('errorFormatter', [function() {
  return function(error) {
      switch (error.rule) {
        case 'boolean':
        case 'date':
        case 'float':
        case 'integer':
        case 'text':
        case 'datetime':
          return error.data + " is not a valid " + error.rule + " value";
        case 'unique':
          return 'Must be unique';
        case 'required':
          return 'Field is required';
        case 'singleDefaultApp':
          return 'Only a single default application is allowed';
        case 'validGcmKey':
          return 'Invalid GCM key';
        case 'certOrPfx':
          return 'Upload a Cert and Key OR a PFX file - not both';
        case 'validAppleCert':
          return 'Invalid Apple cert or passphrase';
        case 'requiresKey':
          return 'Must supply a private key, too';
        case 'requiresCert':
          return 'Must supply a cert, too';
        default:
          return error.message;
    }
  };
}]);

adminServices.value('version', '0.1');
