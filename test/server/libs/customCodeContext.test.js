var _                   = require('lodash'),
    assert              = require('assert'),
    rewire              = require('rewire');

var customCodeContext;

describe('customCodeContext lib', function() {
  describe('createContext', function() {
    var context;

    beforeEach(function() {
      customCodeContext = rewire("../../../api/libs/customCodeContext.js");
      context = customCodeContext.createContext(1);
    });

    it('should be a function', function() {
      assert(_.isFunction(customCodeContext.createContext));
    });

    it('should return an object containing "models" function', function() {
      assert(_.isFunction(context.models));
    });

    it('should get the version of a model from the version passed to the createContext method if no version is supplied', function() {
      var dogStub = {name: 'fred'};

      customCodeContext.__set__('sails', {
        models: {
          'v1dog': dogStub
        }
      });

      // No version is passed to context.models
      var dog = context.models('dog');
      assert.equal(dog, dogStub);
    });

    it('should get a specific version of a model if version is supplied', function() {
      var dogStub = {name: 'fred'};

      customCodeContext.__set__('sails', {
        models: {
          'v2dog': dogStub
        }
      });

      // Version is passed to context.models
      var dog = context.models('dog', 2);
      assert.equal(dog, dogStub);
    });

    it('should handle camel cased model names', function() {
      var dogStub = {name: "clifford"};
      
      customCodeContext.__set__('sails', {
        models: {
          'v1largedog': dogStub
        }
      });

      var dog = context.models('largeDog');
      var alsoDog = context.models('large_dog');
      assert.equal(dog, dogStub);
      assert.equal(alsoDog, dogStub);
    });
  });

  describe('matchingVersionOf', function() {
    var context;

    beforeEach(function() {
      customCodeContext = rewire("../../../api/libs/customCodeContext.js");
      context = customCodeContext.createContext(1);
    });

    it('should be a function', function() {
      assert(_.isFunction(context.matchingVersionOf));
    });

    it('should call the models function with the model name and the version supplied to the createContext method', function() {
      context.models = function(model, version) {
        assert.equal(model, 'dog');
        assert.equal(version, 1);
      };

      var dog = context.matchingVersionOf('dog');
    });
  });

  describe('additional options', function() {
    var context;

    var additionalValues = {
      value: 'test'
    };

    beforeEach(function() {
      customCodeContext = rewire("../../../api/libs/customCodeContext.js");
      context = customCodeContext.createContext(1, additionalValues);
    });

    it('context should include the supplied options', function() {
      assert.equal(context.value, additionalValues.value);
    });
  });

  describe('push', () => {
    var context;

    beforeEach(() => {
      customCodeContext = rewire("../../../api/libs/customCodeContext.js");
      context = customCodeContext.createContext(1);
    });

    it('should include the "push" API', () => {
      assert.ok(context.push);
    });
  });
});
