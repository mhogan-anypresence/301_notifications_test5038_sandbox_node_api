'use strict';

let co = require('co');

module.exports = function(sails) {
  return {
    initialize: function(done) {
      sails.on('hook:orm:loaded', function() {
        if (process.env.NODE_ENV !== 'production') return done();

        App.native(co.wrap(function*(err, collection) {
          yield collection.ensureIndex('name', { unique: true });
        }));

        Channel.native(co.wrap(function*(err, collection) {
          yield collection.ensureIndex('compositeName', { unique: true });
        }));

        Device.native(co.wrap(function*(err, collection) {
          yield collection.ensureIndex('compositeIdentifier', { unique: true });
        }));

        done();

      });
    }
  };
};
