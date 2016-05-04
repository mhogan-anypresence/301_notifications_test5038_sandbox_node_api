var Sails = require('sails');
var assert = require ('assert');
var passportStub = require ('passport-stub');
var superagent = require('superagent');
var util = require('util');
var _ = require('lodash');
var adapter = require('sails-memory');

var agent, objects = [];


var fakeUsers = {
  'Authenticated Without Role Default': {"emailAddress":"nydia.green3@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Unjustifiable marginalia","phoneNumber":"Hellenistic encapsulations","role":"Authenticated Without Role Default","sendPushNotifications":false,"sendSendgridNotifications":true,"sendTwilioNotifications":true,"username":"Noddy adorn","xSessionId":"Ecclesiastical pianists"},
};
_.forEach(_.keys(fakeUsers), function (key) {
  fakeUsers[key].isAdmin = function(){
    return false;
  };
});

describe('V1Order', function() {
  
    beforeEach(function (done){
      agent = superagent.agent();
      objects = [];
var testObjects = [];
  testObjects.push({"id":"Obviousness blight","desc":"Disinterestedly warbling","name":"Nakisha Franecki"});
  testObjects.push({"id":"Queering constituencies","desc":"Equestrians sarsaparillas","name":"Arnoldo Koss"});
  testObjects.push({"id":"Bowing rumor","desc":"Taper radiotelephones","name":"Lindsay Sanford"});
  testObjects.push({"id":"Toileted zapping","desc":"Discountenanced oracle","name":"Asa Lesch"});
  testObjects.push({"id":"Agglomerated questioned","desc":"Deadbeat encrustations","name":"Jonah Kuhn"});
  testObjects.push({"id":"Speculation Malcolm","desc":"Salaciously misquotation","name":"Chantay Lueilwitz"});
  testObjects.push({"id":"Claps Hopewell","desc":"Aquamarines doping","name":"Devin Jewess"});
  testObjects.push({"id":"Transmigrates kowtowed","desc":"Argon excretory","name":"Noah Little"});
  testObjects.push({"id":"Seraglios retrograding","desc":"Enunciate hatched","name":"Vida Lakin"});
  testObjects.push({"id":"Interspersing slithery","desc":"Wholeheartedly rattlings","name":"Lenny Hilpert"});

V1Order.createEach(testObjects).exec(function(err, obj) {
  obj.forEach(function(element) {
    objects.push(element);
  });
  assert(! err, "Received error " + util.inspect(err));

  if (objects.length === testObjects.length) {
    done();
  }
});

    });

    afterEach(function(done) {
      passportStub.logout();
      V1Order.destroy().exec(function(err, result) {
  assert(! err, "Received error " + util.inspect(err, {depth: null}));
});

      done();
    });
  

  before(function() {
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

  
  
    it('should attempt to get index of orders for authenticated_without_role', function (done) {
  
      passportStub.login(fakeUsers['Authenticated Without Role Default']);
  
      agent.get("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/orders").set('Content-Type', 'application/json').end(function (err, res) {
        if (err) return done(err);
  
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 10);
        done(err);
  
      });
    });

    it('should attempt to create order for authenticated_without_role', function (done) {
      var newObj = {"id":"Revolutionaries erectile","desc":"Ogling consultants","name":"Lula Hamill"};
  
      passportStub.login(fakeUsers['Authenticated Without Role Default']);
  
      agent.post("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/orders").send(newObj).set('Content-Type', 'application/json').end(function (err, res) {
  
        if (err) return done(err);
        assert.equal(res.status, 201);
        
          V1Order.count().exec(function (err, count) {
            assert(!err, "Received error " + util.inspect(err, {depth: null}));
            assert.equal(count, 11);
            done(err);
          });
        
  
      });
    });

    it('should attempt to show order for authenticated_without_role', function(done) {
      var id = objects[0].id;
  
      passportStub.login(fakeUsers['Authenticated Without Role Default']);
  
      agent.get("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/orders/" + id).set('Content-Type', 'application/json').end(function (err, res) {
  
        if (err) return done(err);
        assert.equal(res.status, 200);
        done(err);
  
      });
    });

    it('should attempt to update order for authenticated_without_role', function (done) {
      var id = objects[0].id;
      var newObj = {"id":"Large rawboned","desc":"Demoralize doctrinal","name":"Samira Ward"};
      newObj.id = id;
  
      passportStub.login(fakeUsers['Authenticated Without Role Default']);
  
      agent.put("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/orders/" + id).send(newObj).set('Content-Type', 'application/json').end(function (err, res) {
  
        assert.equal(res.status, 403);
        done(err);
  
      });
    });

    it('should attempt to destroy order for authenticated_without_role', function (done) {
      var id = objects[0].id;
  
      passportStub.login(fakeUsers['Authenticated Without Role Default']);
  
      agent.del("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/orders/" + id).end(function (err, res) {
        if (err) return done(err);
  
        assert.equal(res.status, 403);
        done(err);
  
      });
    });

  
  
});
