  var assert = require('assert');
var adapter = require('sails-memory');
var _ = require('lodash');


describe('V1NotificationLog Model', function() {

  afterEach(function() {
    V1NotificationLog.destroy();
  });

  beforeEach(function() {
    // Drop existing collections
    
      adapter.drop('memory', 'NotificationLog', [], function() {})
    
      adapter.drop('memory', 'Order', [], function() {})
    
      adapter.drop('memory', 'SendGrid', [], function() {})
    
      adapter.drop('memory', 'Twilio', [], function() {})
    
      adapter.drop('memory', 'User', [], function() {})
    
    // Recreate collections
    
      adapter.define('memory', 'NotificationLog', V1NotificationLog.attributes, function() {})
    
      adapter.define('memory', 'Order', V1Order.attributes, function() {})
    
      adapter.define('memory', 'SendGrid', V1SendGrid.attributes, function() {})
    
      adapter.define('memory', 'Twilio', V1Twilio.attributes, function() {})
    
      adapter.define('memory', 'User', V1User.attributes, function() {})
    
  });

  it('should successfully create an instance of V1NotificationLog', function(done) {
    var beforeCount;

    V1NotificationLog.count()
      .then(function(count) {
        beforeCount = count;
        return V1NotificationLog.create({"id":"Other Spaniard","message":"Jenkins bricklayer","notificationType":"Synthesizing lattices","sentAt":"2014-12-06","userName":"Validates thoughtful"});
      })
      .then(function(obj) {
        assert(obj, 'Failed to create object.');
        return V1NotificationLog.count();
      })
      .then(function(count) {
        assert(count > beforeCount, 'Expected create to increase object count.');
        done();
      })
      .catch(function (exception) {
        done(exception);
      });
  });

  it('should successfully read an instance of V1NotificationLog', function(done) {

    var attributes = {"id":"Indestructible tanners","message":"Unthinkingly atherosclerosis","notificationType":"Recurrent homophone","sentAt":"2014-05-30","userName":"Circumcisions unattractive"};
    var id;

    if (attributes && Object.keys(attributes).length !== 0) {
      V1NotificationLog.findOne(attributes)
        .then(function(record) {
          assert(!record, 'Should not have found a record.');
          return V1NotificationLog.create(attributes);
        })
        .then(function(obj) {
          assert(obj, 'Failed to create object.');
          id = obj.id;
          return V1NotificationLog.findOne({'id':obj.id});
        })
        .then(function(obj) {
          assert(obj, 'Expected to find a model with id ' + id + '.');
          done();
        })
        .catch(function (exception) {
          done(exception);
        });
      } else {
        done();
      }
  });

  it('should successfully update an instance of V1NotificationLog', function(done) {
    var attributes = {"id":"Momentousness villainy","message":"Sedimentation supercilious","notificationType":"Prearranging slipped","sentAt":"2013-09-23","userName":"Horrify amour"};
    var updatedObject;

    V1NotificationLog.create(attributes)
      .then(function(obj) {
        assert(obj, 'Failed to create object.');
        var attributes = {"message":"Aggressiveness appropriately","notificationType":"Llewellyn radio","sentAt":"2016-03-07","userName":"Analytically disown"};
        return V1NotificationLog.update(obj.id, attributes);
      })
      .then(function(collection) {
        updatedObject = collection[0];
        assert(updatedObject, 'Failed to update object.');
        return V1NotificationLog.findOne({'id':updatedObject.id});
      })
      .then(function(obj) {
        assert(obj.id === updatedObject.id, 'Expected to find the instance just created.');
        done();
      })
      .catch(function (exception) {
        done(exception);
      });
  });

  it('should successfully destroy an instance of V1NotificationLog', function(done) {

    var attributes = {"id":"Intervening grubbiness","message":"Debating dispelled","notificationType":"Sandy sailboard","sentAt":"2013-08-22","userName":"Frets decontaminated"};

    if (attributes && Object.keys(attributes).length !== 0) {
      V1NotificationLog.findOne(attributes)
        .then(function(record) {
          assert(!record, 'Should not have found a record.');
          return V1NotificationLog.create(attributes);
        })
        .then(function(obj) {
          assert(obj, 'Failed to create object.');
          return V1NotificationLog.destroy(obj.id);
        })
        .then(function(collection) {
          assert(collection.length === 1, 'Expected to destroy the instance just created.');
          done();
        })
        .catch(function (exception) {
          done(exception);
        });
      } else{
          done();
      }
  });
  
  

  
  describe('custom callbacks', function() {
    it('should have a callbacks object', function() {
      assert(V1NotificationLog.callbacks, 'V1NotificationLog is missing the callbacks object');
    });

    
      

      it('should contain "beforeCreate" callback', function() {
        assert(V1NotificationLog.callbacks['beforeCreate'], 'beforeCreate is missing.');
      });

      it('"beforeCreate" callback should be a function', function() {
      assert(_.isFunction(V1NotificationLog.callbacks['beforeCreate']), 'beforeCreate should be a function.');
    });
    
      

      it('should contain "afterCreate" callback', function() {
        assert(V1NotificationLog.callbacks['afterCreate'], 'afterCreate is missing.');
      });

      it('"afterCreate" callback should be a function', function() {
      assert(_.isFunction(V1NotificationLog.callbacks['afterCreate']), 'afterCreate should be a function.');
    });
    
      

      it('should contain "beforeFind" callback', function() {
        assert(V1NotificationLog.callbacks['beforeFind'], 'beforeFind is missing.');
      });

      it('"beforeFind" callback should be a function', function() {
      assert(_.isFunction(V1NotificationLog.callbacks['beforeFind']), 'beforeFind should be a function.');
    });
    
      

      it('should contain "afterFind" callback', function() {
        assert(V1NotificationLog.callbacks['afterFind'], 'afterFind is missing.');
      });

      it('"afterFind" callback should be a function', function() {
      assert(_.isFunction(V1NotificationLog.callbacks['afterFind']), 'afterFind should be a function.');
    });
    
      

      it('should contain "beforeUpdate" callback', function() {
        assert(V1NotificationLog.callbacks['beforeUpdate'], 'beforeUpdate is missing.');
      });

      it('"beforeUpdate" callback should be a function', function() {
      assert(_.isFunction(V1NotificationLog.callbacks['beforeUpdate']), 'beforeUpdate should be a function.');
    });
    
      

      it('should contain "afterUpdate" callback', function() {
        assert(V1NotificationLog.callbacks['afterUpdate'], 'afterUpdate is missing.');
      });

      it('"afterUpdate" callback should be a function', function() {
      assert(_.isFunction(V1NotificationLog.callbacks['afterUpdate']), 'afterUpdate should be a function.');
    });
    
      

      it('should contain "beforeDestroy" callback', function() {
        assert(V1NotificationLog.callbacks['beforeDestroy'], 'beforeDestroy is missing.');
      });

      it('"beforeDestroy" callback should be a function', function() {
      assert(_.isFunction(V1NotificationLog.callbacks['beforeDestroy']), 'beforeDestroy should be a function.');
    });
    
      

      it('should contain "afterDestroy" callback', function() {
        assert(V1NotificationLog.callbacks['afterDestroy'], 'afterDestroy is missing.');
      });

      it('"afterDestroy" callback should be a function', function() {
      assert(_.isFunction(V1NotificationLog.callbacks['afterDestroy']), 'afterDestroy should be a function.');
    });
    
      
      
      
      
      
      
      
      
  });
});

