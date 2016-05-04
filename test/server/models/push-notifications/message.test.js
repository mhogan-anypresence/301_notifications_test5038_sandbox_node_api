var assert = require('assert');

describe('Message model', function() {
  var attributes, channel, message;

  beforeEach(function(done) {
    attributes = {payload: 'test'};
    App.create({name: 'test'})
      .then(function(result) {
        return Channel.create({name: 'foobar', app: result});
      })
      .then(function(result) {
        assert(result);
        channel = result;
        attributes.channel = channel.id;
        return Message.create(attributes);
      })
      .then(function(result) {
        assert(result);
        message = result;
        return Channel.findOne({id: channel.id}).populateAll();
      })
      .then(function(result) {
        assert(result);
        channel = result;
        done();
      })
      .catch(done);
  });

  afterEach(function(done) {
    Channel.destroy()
      .then(function(result) {
        return Message.destroy();
      })
      .then(function(result) {
        return App.destroy(done);
      })
      .catch(done);
  });

  it('should have a createdAt date field', function(done) {
    assert(message.createdAt);
    try{
      assert((new Date(message.createdAt).toString() !== 'Invalid Date'), 'Expected createdAt to be a date');
      done();
    } catch(err) {
      done(err);
    }
  });

  it('should have an id', function() {
    assert(message.id);
  });

  it('should have a reference to a "channel"', function() {
    assert(message.channel);
  });

  it('should have a reference to the correct "channel"', function() {
    assert.equal(message.channel, channel.id);
  });

  it('should not allow an empty payload', function(done) {
    delete attributes.payload;
    Message.create(attributes)
      .then(function(result) {
        assert(!result, 'Should not have been able to create a message with an empty payload');
      })
      .catch(function(err) {
        assert(err);
        assert(err.ValidationError['payload']);
        assert.equal(err.ValidationError['payload'][0].rule, 'text', 'Expected broken "text" validation rule');
        assert.equal(err.ValidationError['payload'][1].rule, 'required', 'Expected broken "required" validation rule');
        done();
      });
  });
});
