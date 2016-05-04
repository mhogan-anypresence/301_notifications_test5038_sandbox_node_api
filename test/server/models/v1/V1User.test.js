  var assert = require('assert');
var adapter = require('sails-memory');
var _ = require('lodash');


describe('V1User Model', function() {

  afterEach(function() {
    V1User.destroy();
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

  it('should successfully create an instance of V1User', function(done) {
    var beforeCount;

    V1User.count()
      .then(function(count) {
        beforeCount = count;
        return V1User.create({"id":"Instrumentalist confirmations","emailAddress":"tracie.beatty41@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Discovered alluvial","phoneNumber":"Stagflation examination","role":"Abrogating bowed","sendPushNotifications":true,"sendSendgridNotifications":true,"sendTwilioNotifications":true,"username":"Franker calcite","xSessionId":"Substructures boyfriend"});
      })
      .then(function(obj) {
        assert(obj, 'Failed to create object.');
        return V1User.count();
      })
      .then(function(count) {
        assert(count > beforeCount, 'Expected create to increase object count.');
        done();
      })
      .catch(function (exception) {
        done(exception);
      });
  });

  it('should successfully read an instance of V1User', function(done) {

    var attributes = {"id":"Asphyxiations equipping","emailAddress":"theo.torp47@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Overestimating Wheatstone","phoneNumber":"Encouragement lampreys","role":"Invested bazillions","sendPushNotifications":true,"sendSendgridNotifications":false,"sendTwilioNotifications":true,"username":"Triplicating motivates","xSessionId":"Watertight favored"};
    var id;

    if (attributes && Object.keys(attributes).length !== 0) {
      V1User.findOne(attributes)
        .then(function(record) {
          assert(!record, 'Should not have found a record.');
          return V1User.create(attributes);
        })
        .then(function(obj) {
          assert(obj, 'Failed to create object.');
          id = obj.id;
          return V1User.findOne({'id':obj.id});
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

  it('should successfully update an instance of V1User', function(done) {
    var attributes = {"id":"Apace bating","emailAddress":"terrance.lemke79@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Manumitted around","phoneNumber":"Tycho encounters","role":"Barefooted erroneously","sendPushNotifications":true,"sendSendgridNotifications":true,"sendTwilioNotifications":false,"username":"Enthronements turns","xSessionId":"Thrusts shrive"};
    var updatedObject;

    V1User.create(attributes)
      .then(function(obj) {
        assert(obj, 'Failed to create object.');
        var attributes = {"emailAddress":"alfredo.schulist96@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Watch unmentionables","phoneNumber":"Lucked disorientation","role":"Illicitly foreordains","sendPushNotifications":false,"sendSendgridNotifications":true,"sendTwilioNotifications":true,"username":"Glacier conspiracies","xSessionId":"Hysterectomies ferociousness"};
        return V1User.update(obj.id, attributes);
      })
      .then(function(collection) {
        updatedObject = collection[0];
        assert(updatedObject, 'Failed to update object.');
        return V1User.findOne({'id':updatedObject.id});
      })
      .then(function(obj) {
        assert(obj.id === updatedObject.id, 'Expected to find the instance just created.');
        done();
      })
      .catch(function (exception) {
        done(exception);
      });
  });

  it('should successfully destroy an instance of V1User', function(done) {

    var attributes = {"id":"Lackluster immaculateness","emailAddress":"lenard.o'hara68@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Booties tenderizing","phoneNumber":"Freebasing Presbyterians","role":"Precipitation recompilation","sendPushNotifications":false,"sendSendgridNotifications":true,"sendTwilioNotifications":true,"username":"Phoniest tyrannical","xSessionId":"Realization southerlies"};

    if (attributes && Object.keys(attributes).length !== 0) {
      V1User.findOne(attributes)
        .then(function(record) {
          assert(!record, 'Should not have found a record.');
          return V1User.create(attributes);
        })
        .then(function(obj) {
          assert(obj, 'Failed to create object.');
          return V1User.destroy(obj.id);
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
  
    

  it('should have the correct transientAttributes', function() {
    assert(V1User.transientAttributes.indexOf('password') !== -1);
  });

  it('should have a getter', function() {
    assert(V1User.attributes['getPassword']);
  });

  

  it('should have the correct transientAttributes', function() {
    assert(V1User.transientAttributes.indexOf('passwordConfirmation') !== -1);
  });

  it('should have a getter', function() {
    assert(V1User.attributes['getPasswordConfirmation']);
  });

  

  it('should have the correct transientAttributes', function() {
    assert(V1User.transientAttributes.indexOf('xSessionId') !== -1);
  });

  it('should have a getter', function() {
    assert(V1User.attributes['getXSessionId']);
  });

  


    

  

  describe('custom callbacks', function() {
    it('should have a callbacks object', function() {
      assert(V1User.callbacks, 'V1User is missing the callbacks object');
    });

    
      

      it('should contain "beforeCreate" callback', function() {
        assert(V1User.callbacks['beforeCreate'], 'beforeCreate is missing.');
      });

      it('"beforeCreate" callback should be a function', function() {
      assert(_.isFunction(V1User.callbacks['beforeCreate']), 'beforeCreate should be a function.');
    });
    
      

      it('should contain "afterCreate" callback', function() {
        assert(V1User.callbacks['afterCreate'], 'afterCreate is missing.');
      });

      it('"afterCreate" callback should be a function', function() {
      assert(_.isFunction(V1User.callbacks['afterCreate']), 'afterCreate should be a function.');
    });
    
      

      it('should contain "beforeFind" callback', function() {
        assert(V1User.callbacks['beforeFind'], 'beforeFind is missing.');
      });

      it('"beforeFind" callback should be a function', function() {
      assert(_.isFunction(V1User.callbacks['beforeFind']), 'beforeFind should be a function.');
    });
    
      

      it('should contain "afterFind" callback', function() {
        assert(V1User.callbacks['afterFind'], 'afterFind is missing.');
      });

      it('"afterFind" callback should be a function', function() {
      assert(_.isFunction(V1User.callbacks['afterFind']), 'afterFind should be a function.');
    });
    
      

      it('should contain "beforeUpdate" callback', function() {
        assert(V1User.callbacks['beforeUpdate'], 'beforeUpdate is missing.');
      });

      it('"beforeUpdate" callback should be a function', function() {
      assert(_.isFunction(V1User.callbacks['beforeUpdate']), 'beforeUpdate should be a function.');
    });
    
      

      it('should contain "afterUpdate" callback', function() {
        assert(V1User.callbacks['afterUpdate'], 'afterUpdate is missing.');
      });

      it('"afterUpdate" callback should be a function', function() {
      assert(_.isFunction(V1User.callbacks['afterUpdate']), 'afterUpdate should be a function.');
    });
    
      

      it('should contain "beforeDestroy" callback', function() {
        assert(V1User.callbacks['beforeDestroy'], 'beforeDestroy is missing.');
      });

      it('"beforeDestroy" callback should be a function', function() {
      assert(_.isFunction(V1User.callbacks['beforeDestroy']), 'beforeDestroy should be a function.');
    });
    
      

      it('should contain "afterDestroy" callback', function() {
        assert(V1User.callbacks['afterDestroy'], 'afterDestroy is missing.');
      });

      it('"afterDestroy" callback should be a function', function() {
      assert(_.isFunction(V1User.callbacks['afterDestroy']), 'afterDestroy should be a function.');
    });
    
      
      
      
      
      
      
      
      
      
      
  });
});

