'use strict';

var sails           = require('sails'),
    _               = require('lodash'),
    customLibLoader = require('./customLibraryLoader'),
    push            = require('./push-notifications/push');

/*
 * Module returns an object intended to be used as the 'this' context for a custom
 * function. It should include any helper methods, objects or values to assist a
 * developer in custom code.
 */

module.exports = {
  // version should be the api version of the custom code.
  // opts should contain any additional values you'd like to add to the generated context.
  createContext: function(apiVersion, opts) {
    var context = {};

    // models helper retrieves a specific model and may include a specific version.
    // If version is not supplied, it should return the most recent API version of the
    // model.
    context.models = function(name, version) {
      if (!version) version = apiVersion;
      var modelName = 'v' + version + _.camelCase(name).toLowerCase();
      return sails.models[modelName];
    };

    // Returns the corresponding versioned model of the current code being executed.
    context.matchingVersionOf = function(name) {
      return this.models(name, apiVersion);
    };

    context.customLibrary = customLibLoader.load;

    context.push = push;

    _.keys(opts).forEach(function(key) {
      context[key] = opts[key];
    });

    return context;
  }
};
