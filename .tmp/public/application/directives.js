'use strict';

angular.module('adminConsole.directives', [])
  .directive('formInput', ['errorFormatter', function(errorFormatter) {
    return {
      restrict: 'E',
      templateUrl: 'templates/views/partials/formInputDirective.html',
      scope: {
        label: '@',
        name: '@',
        required: '@',
        type: '@',
        property: '=',
        errors: '='
      },
      link: function(scope, iElement, iAttrs) {
        scope.optionalValue = iAttrs.required === 'true' ? 'required' : 'optional';
        scope.formatError = errorFormatter;
      }
    };
  }])
  .directive('fileInput', ['errorFormatter', '$log', function(errorFormatter, $log) {
    return {
      restrict: 'E',
      templateUrl: 'templates/views/partials/fileInputDirective.html',
      scope: {
        label: '@',
        name: '@',
        required: '@',
        property: '=',
        errors: '=',
        transform: '='
      },
      link: function(scope, iElement, iAttrs) {
        scope.optionalValue = iAttrs.required === 'true' ? 'required' : 'optional';
        scope.formatError = errorFormatter;
        scope.appendFile = function($files) {
          if (scope.transform) {
            scope.transform($files[0], function(err, result) {
              if (err) return $log.error(err);
              scope.property = result;
              scope.$apply();
            });
          }
          else {
            scope.property = $files[0];
            scope.$apply();
          }
        };

        scope.removeFile = function() {
          scope.property = "";
        };
      }
    };
  }])
  .directive('paginator', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/views/partials/paginator.html',
      transclude: true
    };
  })
  .directive('ngFiles', ['$parse', function($parse) {

    return {
      link: function(scope, element, attrs) {
        var handler = $parse(attrs.ngFiles);
        element.on('change', function(event) {
          handler(scope, { $files: event.target.files });
        });
      }
    };

  }]);
