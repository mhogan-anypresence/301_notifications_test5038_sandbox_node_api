  var assert = require('assert');
var adapter = require('sails-memory');
var _ = require('lodash');


describe('V1Order Model', function() {

  afterEach(function() {
    V1Order.destroy();
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

  it('should successfully create an instance of V1Order', function(done) {
    var beforeCount;

    V1Order.count()
      .then(function(count) {
        beforeCount = count;
        return V1Order.create({"id":"Insensibly Juana","desc":"Matured litigant","name":"Damian Kiehn"});
      })
      .then(function(obj) {
        assert(obj, 'Failed to create object.');
        return V1Order.count();
      })
      .then(function(count) {
        assert(count > beforeCount, 'Expected create to increase object count.');
        done();
      })
      .catch(function (exception) {
        done(exception);
      });
  });

  it('should successfully read an instance of V1Order', function(done) {

    var attributes = {"id":"Monosyllable renegotiating","desc":"Anaesthetist emasculates","name":"Maribel Runolfsson"};
    var id;

    if (attributes && Object.keys(attributes).length !== 0) {
      V1Order.findOne(attributes)
        .then(function(record) {
          assert(!record, 'Should not have found a record.');
          return V1Order.create(attributes);
        })
        .then(function(obj) {
          assert(obj, 'Failed to create object.');
          id = obj.id;
          return V1Order.findOne({'id':obj.id});
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

  it('should successfully update an instance of V1Order', function(done) {
    var attributes = {"id":"Hedonistic deterioration","desc":"Nicklaus phonological","name":"Kory O'Kon"};
    var updatedObject;

    V1Order.create(attributes)
      .then(function(obj) {
        assert(obj, 'Failed to create object.');
        var attributes = {"desc":"Indoctrinating pitchmen","name":"Margorie Mosciski"};
        return V1Order.update(obj.id, attributes);
      })
      .then(function(collection) {
        updatedObject = collection[0];
        assert(updatedObject, 'Failed to update object.');
        return V1Order.findOne({'id':updatedObject.id});
      })
      .then(function(obj) {
        assert(obj.id === updatedObject.id, 'Expected to find the instance just created.');
        done();
      })
      .catch(function (exception) {
        done(exception);
      });
  });

  it('should successfully destroy an instance of V1Order', function(done) {

    var attributes = {"id":"Welshing stool","desc":"Bafflement psychotherapy","name":"Selena Hilpert"};

    if (attributes && Object.keys(attributes).length !== 0) {
      V1Order.findOne(attributes)
        .then(function(record) {
          assert(!record, 'Should not have found a record.');
          return V1Order.create(attributes);
        })
        .then(function(obj) {
          assert(obj, 'Failed to create object.');
          return V1Order.destroy(obj.id);
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
      assert(V1Order.callbacks, 'V1Order is missing the callbacks object');
    });

    
      

      it('should contain "beforeCreate" callback', function() {
        assert(V1Order.callbacks['beforeCreate'], 'beforeCreate is missing.');
      });

      it('"beforeCreate" callback should be a function', function() {
      assert(_.isFunction(V1Order.callbacks['beforeCreate']), 'beforeCreate should be a function.');
    });
    
      

      it('should contain "afterCreate" callback', function() {
        assert(V1Order.callbacks['afterCreate'], 'afterCreate is missing.');
      });

      it('"afterCreate" callback should be a function', function() {
      assert(_.isFunction(V1Order.callbacks['afterCreate']), 'afterCreate should be a function.');
    });
    
      

      it('should contain "beforeFind" callback', function() {
        assert(V1Order.callbacks['beforeFind'], 'beforeFind is missing.');
      });

      it('"beforeFind" callback should be a function', function() {
      assert(_.isFunction(V1Order.callbacks['beforeFind']), 'beforeFind should be a function.');
    });
    
      

      it('should contain "afterFind" callback', function() {
        assert(V1Order.callbacks['afterFind'], 'afterFind is missing.');
      });

      it('"afterFind" callback should be a function', function() {
      assert(_.isFunction(V1Order.callbacks['afterFind']), 'afterFind should be a function.');
    });
    
      

      it('should contain "beforeUpdate" callback', function() {
        assert(V1Order.callbacks['beforeUpdate'], 'beforeUpdate is missing.');
      });

      it('"beforeUpdate" callback should be a function', function() {
      assert(_.isFunction(V1Order.callbacks['beforeUpdate']), 'beforeUpdate should be a function.');
    });
    
      

      it('should contain "afterUpdate" callback', function() {
        assert(V1Order.callbacks['afterUpdate'], 'afterUpdate is missing.');
      });

      it('"afterUpdate" callback should be a function', function() {
      assert(_.isFunction(V1Order.callbacks['afterUpdate']), 'afterUpdate should be a function.');
    });
    
      

      it('should contain "beforeDestroy" callback', function() {
        assert(V1Order.callbacks['beforeDestroy'], 'beforeDestroy is missing.');
      });

      it('"beforeDestroy" callback should be a function', function() {
      assert(_.isFunction(V1Order.callbacks['beforeDestroy']), 'beforeDestroy should be a function.');
    });
    
      

      it('should contain "afterDestroy" callback', function() {
        assert(V1Order.callbacks['afterDestroy'], 'afterDestroy is missing.');
      });

      it('"afterDestroy" callback should be a function', function() {
      assert(_.isFunction(V1Order.callbacks['afterDestroy']), 'afterDestroy should be a function.');
    });
    
      
      
      
      
      
      
      
      
  });
});

