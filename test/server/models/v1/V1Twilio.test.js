  var assert = require('assert'),
    nock = require('nock'),
    httpHelper = require('waterline-http').helper;

describe('V1Twilio Model', function() {
  it('should contain HTTP adapter configurations', function() {
    assert(V1Twilio.http, 'V1Twilio is missing HTTP adapter configuration.');
    assert(V1Twilio.http.read, 'V1Twilio is missing "read" configuration.');
    assert(V1Twilio.http.update, 'V1Twilio is missing "update" configuration.');
    assert(V1Twilio.http.delete, 'V1Twilio is missing "delete" configuration.');
    assert(V1Twilio.http.create, 'V1Twilio is missing "create" configuration.');
  });

  

  
  describe('custom callbacks', function() {
    it('should have a callbacks object', function() {
      assert(V1Twilio.callbacks, 'V1Twilio is missing the callbacks object');
    });

    
      

      it('should contain "beforeCreate" callback', function() {
        assert(V1Twilio.callbacks['beforeCreate'], 'beforeCreate is missing.');
      });

      it('"beforeCreate" callback should be a function', function() {
      assert(_.isFunction(V1Twilio.callbacks['beforeCreate']), 'beforeCreate should be a function.');
    });
    
      

      it('should contain "afterCreate" callback', function() {
        assert(V1Twilio.callbacks['afterCreate'], 'afterCreate is missing.');
      });

      it('"afterCreate" callback should be a function', function() {
      assert(_.isFunction(V1Twilio.callbacks['afterCreate']), 'afterCreate should be a function.');
    });
    
      

      it('should contain "beforeFind" callback', function() {
        assert(V1Twilio.callbacks['beforeFind'], 'beforeFind is missing.');
      });

      it('"beforeFind" callback should be a function', function() {
      assert(_.isFunction(V1Twilio.callbacks['beforeFind']), 'beforeFind should be a function.');
    });
    
      

      it('should contain "afterFind" callback', function() {
        assert(V1Twilio.callbacks['afterFind'], 'afterFind is missing.');
      });

      it('"afterFind" callback should be a function', function() {
      assert(_.isFunction(V1Twilio.callbacks['afterFind']), 'afterFind should be a function.');
    });
    
      

      it('should contain "beforeUpdate" callback', function() {
        assert(V1Twilio.callbacks['beforeUpdate'], 'beforeUpdate is missing.');
      });

      it('"beforeUpdate" callback should be a function', function() {
      assert(_.isFunction(V1Twilio.callbacks['beforeUpdate']), 'beforeUpdate should be a function.');
    });
    
      

      it('should contain "afterUpdate" callback', function() {
        assert(V1Twilio.callbacks['afterUpdate'], 'afterUpdate is missing.');
      });

      it('"afterUpdate" callback should be a function', function() {
      assert(_.isFunction(V1Twilio.callbacks['afterUpdate']), 'afterUpdate should be a function.');
    });
    
      

      it('should contain "beforeDestroy" callback', function() {
        assert(V1Twilio.callbacks['beforeDestroy'], 'beforeDestroy is missing.');
      });

      it('"beforeDestroy" callback should be a function', function() {
      assert(_.isFunction(V1Twilio.callbacks['beforeDestroy']), 'beforeDestroy should be a function.');
    });
    
      

      it('should contain "afterDestroy" callback', function() {
        assert(V1Twilio.callbacks['afterDestroy'], 'afterDestroy is missing.');
      });

      it('"afterDestroy" callback should be a function', function() {
      assert(_.isFunction(V1Twilio.callbacks['afterDestroy']), 'afterDestroy should be a function.');
    });
    
      
      
      
      
      
      
      
      
  });
});

