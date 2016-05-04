var Sails = require('sails');
var assert = require ('assert');
var passportStub = require ('passport-stub');
var superagent = require('superagent');
var util = require('util');
var _ = require('lodash');
var adapter = require('sails-memory');

var agent, objects = [];


var fakeUsers = {
  'Authenticated Without Role Default': {"emailAddress":"olevia.koepp75@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Quartermasters glowworms","phoneNumber":"Yarmulkes tranquilizers","role":"Authenticated Without Role Default","sendPushNotifications":false,"sendSendgridNotifications":false,"sendTwilioNotifications":false,"username":"Partitions rationale","xSessionId":"Subcommittee superintendency"},
};
_.forEach(_.keys(fakeUsers), function (key) {
  fakeUsers[key].isAdmin = function(){
    return false;
  };
});

describe('V1NotificationLog', function() {
  
    beforeEach(function (done){
      agent = superagent.agent();
      objects = [];
var testObjects = [];
  testObjects.push({"id":"Rapprochements unseemliness","message":"Proportionality Andretti","notificationType":"Tansy destructing","sentAt":"2014-06-07","userName":"Champed interchange"});
  testObjects.push({"id":"Smeared convalesce","message":"Carib intimidating","notificationType":"Flirtatious contraries","sentAt":"2014-09-27","userName":"Solaces obeisant"});
  testObjects.push({"id":"Descend mirroring","message":"Twines reformulating","notificationType":"Cannibalism berated","sentAt":"2014-03-25","userName":"Hypochondriacs worsened"});
  testObjects.push({"id":"Watered slated","message":"Nonessential pilaws","notificationType":"Telecommutes interpretations","sentAt":"2016-04-22","userName":"Commissioners upholstered"});
  testObjects.push({"id":"Merit temperamental","message":"Grinder motormouths","notificationType":"Contractors teaspoonful","sentAt":"2016-04-18","userName":"Concave revolves"});
  testObjects.push({"id":"Bowled develop","message":"Scarfed contaminating","notificationType":"Mueller bottom","sentAt":"2013-12-20","userName":"Curtailed discovery"});
  testObjects.push({"id":"Plenipotentiary conjoining","message":"Indebtedness hermaphrodites","notificationType":"Docketing McGowan","sentAt":"2015-10-14","userName":"Aldebaran immobilized"});
  testObjects.push({"id":"Sidesaddles Wotan","message":"Promotion dynasty","notificationType":"Accompaniment changeover","sentAt":"2014-03-16","userName":"Hazier analogies"});
  testObjects.push({"id":"Stetson Renaissance","message":"Championing seduces","notificationType":"Consolidating overlies","sentAt":"2016-03-26","userName":"Constellations bacteriologists"});
  testObjects.push({"id":"Thither rounder","message":"Magnanimously stunned","notificationType":"Slake Aztlan","sentAt":"2015-05-16","userName":"Ambassadorships southeasterly"});

V1NotificationLog.createEach(testObjects).exec(function(err, obj) {
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
      V1NotificationLog.destroy().exec(function(err, result) {
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

  
  
    it('should attempt to get index of notification_logs for authenticated_without_role', function (done) {
  
      passportStub.login(fakeUsers['Authenticated Without Role Default']);
  
      agent.get("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/notification_logs").set('Content-Type', 'application/json').end(function (err, res) {
        if (err) return done(err);
  
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 10);
        done(err);
  
      });
    });

    it('should attempt to create notification_log for authenticated_without_role', function (done) {
      var newObj = {"id":"Blonde representations","message":"Kindergartens films","notification_type":"Soliloquized decently","sent_at":"2015-11-26","user_name":"Mc Millan oblige"};
  
      passportStub.login(fakeUsers['Authenticated Without Role Default']);
  
      agent.post("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/notification_logs").send(newObj).set('Content-Type', 'application/json').end(function (err, res) {
  
        assert.equal(res.status, 403);
        done(err);
  
      });
    });

    it('should attempt to show notification_log for authenticated_without_role', function(done) {
      var id = objects[0].id;
  
      passportStub.login(fakeUsers['Authenticated Without Role Default']);
  
      agent.get("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/notification_logs/" + id).set('Content-Type', 'application/json').end(function (err, res) {
  
        if (err) return done(err);
        assert.equal(res.status, 200);
        done(err);
  
      });
    });

    it('should attempt to update notification_log for authenticated_without_role', function (done) {
      var id = objects[0].id;
      var newObj = {"id":"Significantly dissolutely","message":"Antipathies nicknack","notification_type":"Inordinate spearheaded","sent_at":"2014-07-31","user_name":"Pragmatism outfielders"};
      newObj.id = id;
  
      passportStub.login(fakeUsers['Authenticated Without Role Default']);
  
      agent.put("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/notification_logs/" + id).send(newObj).set('Content-Type', 'application/json').end(function (err, res) {
  
        assert.equal(res.status, 403);
        done(err);
  
      });
    });

    it('should attempt to destroy notification_log for authenticated_without_role', function (done) {
      var id = objects[0].id;
  
      passportStub.login(fakeUsers['Authenticated Without Role Default']);
  
      agent.del("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/notification_logs/" + id).end(function (err, res) {
        if (err) return done(err);
  
        assert.equal(res.status, 403);
        done(err);
  
      });
    });

  
  
});
