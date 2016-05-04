var Sails = require('sails');
var assert = require ('assert');
var passportStub = require ('passport-stub');
var superagent = require('superagent');
var util = require('util');
var _ = require('lodash');
var adapter = require('sails-memory');

var agent, objects = [];



describe('V1Twilio', function() {
  
    beforeEach(function() {
      objects = [];
      agent = superagent.agent();
      
        objects.push({"id":11079,"message":"Uncomfortably admires","toPhoneNumber":"Snide extracurricular"});
      
        objects.push({"id":71013,"message":"Canoes Luxembourgers","toPhoneNumber":"Breather bacteriological"});
      
        objects.push({"id":73673,"message":"Mysteriousness authoritatively","toPhoneNumber":"Boole immaculately"});
      
        objects.push({"id":23426,"message":"Souping pallbearers","toPhoneNumber":"Accrediting medical"});
      
        objects.push({"id":33991,"message":"Imperilled understatement","toPhoneNumber":"Thackeray altruistic"});
      
        objects.push({"id":85801,"message":"Tabby theirs","toPhoneNumber":"Countdown queerer"});
      
        objects.push({"id":5888,"message":"Exterminators decriminalized","toPhoneNumber":"Rafael around"});
      
        objects.push({"id":9277,"message":"Mystically ambidextrously","toPhoneNumber":"Balling filibustering"});
      
        objects.push({"id":87431,"message":"Woodcarving mystification","toPhoneNumber":"Centenaries Dumbo"});
      
        objects.push({"id":11982,"message":"Volleyballs disconnections","toPhoneNumber":"Dryness Iceland"});
      
      V1Twilio.request = function(a, url, vals, context, cb) {
        cb(null, objects);
      };
    });

    afterEach(function() {
      passportStub.logout();
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


    it('should not be able to get index of twilios', function (done) {
      agent.get("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/twilios").set('Content-Type', 'application/json').end(function (err, res) {
        if (err) return done(err);
        assert.equal(res.status, 403);
        done(err);
      });
    });

    it('should not be able to create twilio', function (done) {
      var newObj = {"id":69096,"message":"Patronizingly mainmast","to_phone_number":"Phlox mentioned"};
      delete newObj.id;
      agent.post("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/twilios").send(newObj).set('Content-Type', 'application/json').end(function (err, res) {
        if (err) return done(err);
        assert.equal(res.status, 403);
        done(err);
      });
    });

    it('should not be able to show twilio', function (done) {
      var id = objects[0].id;
      agent.get("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/twilios/" + id).set('Content-Type', 'application/json').end(function (err, res) {
        assert(! err, "Received error " + util.inspect(err, {depth: null}));
        assert.equal(res.status, 403);
        done(err);
      });
    });

    it('should not be able to update twilio', function (done) {
      var id = objects[0].id;
      var newObj = {"id":87608,"message":"Bantamweights thwacks","to_phone_number":"Geckoes rivalling"};
      newObj.id = id;
      agent.put("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/twilios/" + id).send(newObj).set('Content-Type', 'application/json').end(function (err, res) {
        if (err) return done(err);
        assert.equal(res.status, 403);
        done(err);
      });
    });

    it('should not be able to destroy twilio', function (done) {
      var id = objects[0].id;
      agent.del("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/twilios/" + id).end(function (err, res) {
        if (err) return done(err);
        assert.equal(res.status, 403);
        done(err);
      });
    });
  
});
