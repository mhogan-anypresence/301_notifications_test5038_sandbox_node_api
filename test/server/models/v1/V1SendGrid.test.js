  var assert = require('assert'),
    nock = require('nock'),
    httpHelper = require('waterline-http').helper;

describe('V1SendGrid Model', function() {
  it('should contain HTTP adapter configurations', function() {
    assert(V1SendGrid.http, 'V1SendGrid is missing HTTP adapter configuration.');
    assert(V1SendGrid.http.read, 'V1SendGrid is missing "read" configuration.');
    assert(V1SendGrid.http.update, 'V1SendGrid is missing "update" configuration.');
    assert(V1SendGrid.http.delete, 'V1SendGrid is missing "delete" configuration.');
    assert(V1SendGrid.http.create, 'V1SendGrid is missing "create" configuration.');
  });

  

  
  describe('custom callbacks', function() {
    it('should have a callbacks object', function() {
      assert(V1SendGrid.callbacks, 'V1SendGrid is missing the callbacks object');
    });

    
      

      it('should contain "beforeCreate" callback', function() {
        assert(V1SendGrid.callbacks['beforeCreate'], 'beforeCreate is missing.');
      });

      it('"beforeCreate" callback should be a function', function() {
      assert(_.isFunction(V1SendGrid.callbacks['beforeCreate']), 'beforeCreate should be a function.');
    });
    
      

      it('should contain "afterCreate" callback', function() {
        assert(V1SendGrid.callbacks['afterCreate'], 'afterCreate is missing.');
      });

      it('"afterCreate" callback should be a function', function() {
      assert(_.isFunction(V1SendGrid.callbacks['afterCreate']), 'afterCreate should be a function.');
    });
    
      

      it('should contain "beforeFind" callback', function() {
        assert(V1SendGrid.callbacks['beforeFind'], 'beforeFind is missing.');
      });

      it('"beforeFind" callback should be a function', function() {
      assert(_.isFunction(V1SendGrid.callbacks['beforeFind']), 'beforeFind should be a function.');
    });
    
      

      it('should contain "afterFind" callback', function() {
        assert(V1SendGrid.callbacks['afterFind'], 'afterFind is missing.');
      });

      it('"afterFind" callback should be a function', function() {
      assert(_.isFunction(V1SendGrid.callbacks['afterFind']), 'afterFind should be a function.');
    });
    
      

      it('should contain "beforeUpdate" callback', function() {
        assert(V1SendGrid.callbacks['beforeUpdate'], 'beforeUpdate is missing.');
      });

      it('"beforeUpdate" callback should be a function', function() {
      assert(_.isFunction(V1SendGrid.callbacks['beforeUpdate']), 'beforeUpdate should be a function.');
    });
    
      

      it('should contain "afterUpdate" callback', function() {
        assert(V1SendGrid.callbacks['afterUpdate'], 'afterUpdate is missing.');
      });

      it('"afterUpdate" callback should be a function', function() {
      assert(_.isFunction(V1SendGrid.callbacks['afterUpdate']), 'afterUpdate should be a function.');
    });
    
      

      it('should contain "beforeDestroy" callback', function() {
        assert(V1SendGrid.callbacks['beforeDestroy'], 'beforeDestroy is missing.');
      });

      it('"beforeDestroy" callback should be a function', function() {
      assert(_.isFunction(V1SendGrid.callbacks['beforeDestroy']), 'beforeDestroy should be a function.');
    });
    
      

      it('should contain "afterDestroy" callback', function() {
        assert(V1SendGrid.callbacks['afterDestroy'], 'afterDestroy is missing.');
      });

      it('"afterDestroy" callback should be a function', function() {
      assert(_.isFunction(V1SendGrid.callbacks['afterDestroy']), 'afterDestroy should be a function.');
    });
    
      
      
      
      
      
      
      
      
  });
});

