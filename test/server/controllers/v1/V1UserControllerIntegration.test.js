var Sails = require('sails');
var assert = require ('assert');
var passportStub = require ('passport-stub');
var superagent = require('superagent');
var util = require('util');
var _ = require('lodash');
var adapter = require('sails-memory');

var agent, objects = [];


var fakeUsers = {
  'Authenticated Without Role Default': {"emailAddress":"milo.kling7@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Dogfight mends","phoneNumber":"Commercialism tabloid","role":"Authenticated Without Role Default","sendPushNotifications":false,"sendSendgridNotifications":false,"sendTwilioNotifications":false,"username":"Peeled interweave","xSessionId":"Rescinds Bultmann"},
};
_.forEach(_.keys(fakeUsers), function (key) {
  fakeUsers[key].isAdmin = function(){
    return false;
  };
});

describe('V1User', function() {
  
    beforeEach(function (done){
      agent = superagent.agent();
      objects = [];
var testObjects = [];
  testObjects.push({"id":"Ghana Balanchine","emailAddress":"belinda.green45@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Implementations underdeveloped","phoneNumber":"Webern idolized","role":"Palettes scrubby","sendPushNotifications":true,"sendSendgridNotifications":true,"sendTwilioNotifications":true,"username":"Amphetamines auditors","xSessionId":"Delibes brontosaurus"});
  testObjects.push({"id":"Sedating advantages","emailAddress":"jone.beatty84@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Militarizing supplicates","phoneNumber":"Trailblazers uplands","role":"Lacuna idealistically","sendPushNotifications":true,"sendSendgridNotifications":true,"sendTwilioNotifications":false,"username":"Intentional renegotiated","xSessionId":"Charade contractually"});
  testObjects.push({"id":"Mobilization breastplates","emailAddress":"royal.daugherty85@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Ringleader preconditioned","phoneNumber":"Snarl rhymed","role":"Expires psychologically","sendPushNotifications":false,"sendSendgridNotifications":false,"sendTwilioNotifications":true,"username":"Haggai webmistresses","xSessionId":"Stints retrospectives"});
  testObjects.push({"id":"Differentials preposterous","emailAddress":"branden.herman97@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Izaak grubbed","phoneNumber":"Divorced dysfunctions","role":"Compartments halfheartedness","sendPushNotifications":false,"sendSendgridNotifications":true,"sendTwilioNotifications":true,"username":"Paired Zambia","xSessionId":"Binnacle supercomputers"});
  testObjects.push({"id":"Roosevelt exhortation","emailAddress":"willia.zboncak42@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Psychoanalysts confections","phoneNumber":"Gumbel cooperatives","role":"Wearily upperclassman","sendPushNotifications":true,"sendSendgridNotifications":true,"sendTwilioNotifications":false,"username":"Transmigration moppets","xSessionId":"Forthrightness digested"});
  testObjects.push({"id":"Debriefs annexation","emailAddress":"stefan.batz17@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Pertinacity pluckiest","phoneNumber":"Descriptions dustpans","role":"Nazareth embellishment","sendPushNotifications":false,"sendSendgridNotifications":true,"sendTwilioNotifications":false,"username":"Misprinting drifters","xSessionId":"Rejuvenates correlations"});
  testObjects.push({"id":"Manly connecters","emailAddress":"fidela.turner5@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Breakpoints naval","phoneNumber":"Mencken generously","role":"Humorlessness couplets","sendPushNotifications":false,"sendSendgridNotifications":false,"sendTwilioNotifications":false,"username":"Violin soldiering","xSessionId":"Visionary concentrically"});
  testObjects.push({"id":"Elanor outwearing","emailAddress":"ian.keeling15@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Receptiveness Estela","phoneNumber":"Anthropological agribusinesses","role":"Athletic encampments","sendPushNotifications":true,"sendSendgridNotifications":false,"sendTwilioNotifications":false,"username":"Diversification catalpas","xSessionId":"Hatch reestablished"});
  testObjects.push({"id":"Bouillabaisses disorderliness","emailAddress":"kristen.stanton60@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Polygraphed vandals","phoneNumber":"Peach enterprising","role":"Infrastructures prohibitionist","sendPushNotifications":true,"sendSendgridNotifications":false,"sendTwilioNotifications":true,"username":"Stringing connotations","xSessionId":"Laying discountenances"});
  testObjects.push({"id":"Occasioned contraventions","emailAddress":"kelvin.volkman71@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Gingkos nitrogenous","phoneNumber":"Footlights infiltration","role":"Rests Bessel","sendPushNotifications":false,"sendSendgridNotifications":false,"sendTwilioNotifications":true,"username":"Unwed omniscience","xSessionId":"Ricochet prostrations"});

V1User.createEach(testObjects).exec(function(err, obj) {
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
      V1User.destroy().exec(function(err, result) {
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

  
  
    it('should attempt to get index of users for authenticated_without_role', function (done) {
  
      passportStub.login(fakeUsers['Authenticated Without Role Default']);
  
      agent.get("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/users").set('Content-Type', 'application/json').end(function (err, res) {
        if (err) return done(err);
  
        assert.equal(res.status, 403);
        done(err);
  
      });
    });

    it('should attempt to create user for authenticated_without_role', function (done) {
      var newObj = {"id":"Brittle Mikhail","email_address":"jamey.wisoky89@notificationstest.com","password":"password","password_confirmation":"password","password_digest":"Intercessors encrypt","phone_number":"Nonprofessional determinations","role":"Pollywog butte","send_push_notifications":false,"send_sendgrid_notifications":true,"send_twilio_notifications":true,"username":"Spuming seeds","x_session_id":"Innate wrongdoers"};
  
      passportStub.login(fakeUsers['Authenticated Without Role Default']);
  
      agent.post("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/users").send(newObj).set('Content-Type', 'application/json').end(function (err, res) {
  
        assert.equal(res.status, 403);
        done(err);
  
      });
    });

    it('should attempt to show user for authenticated_without_role', function(done) {
      var id = objects[0].id;
  
      passportStub.login(fakeUsers['Authenticated Without Role Default']);
  
      agent.get("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/users/" + id).set('Content-Type', 'application/json').end(function (err, res) {
  
        if (err) return done(err);
        assert.equal(res.status, 200);
        done(err);
  
      });
    });

    it('should attempt to update user for authenticated_without_role', function (done) {
      var id = objects[0].id;
      var newObj = {"id":"Inefficiencies radioisotope","email_address":"eugenia.christiansen87@notificationstest.com","password":"password","password_confirmation":"password","password_digest":"Jocks fallowed","phone_number":"Squirting inconspicuously","role":"Statistically teleconferences","send_push_notifications":true,"send_sendgrid_notifications":false,"send_twilio_notifications":true,"username":"Trader synchronization","x_session_id":"Victualling extinguishing"};
      newObj.id = id;
  
      passportStub.login(fakeUsers['Authenticated Without Role Default']);
  
      agent.put("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/users/" + id).send(newObj).set('Content-Type', 'application/json').end(function (err, res) {
  
        if (err) return done(err);
        assert.equal(res.status, 204);
        
          V1User.findOne({id: id}).exec(function(err, obj) {
            if (err) return done(err);
            assert(obj, 'Expected to get V1User with id ' + id);
            done();
          });
        
  
      });
    });

    it('should attempt to destroy user for authenticated_without_role', function (done) {
      var id = objects[0].id;
  
      passportStub.login(fakeUsers['Authenticated Without Role Default']);
  
      agent.del("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/users/" + id).end(function (err, res) {
        if (err) return done(err);
  
        assert.equal(res.status, 403);
        done(err);
  
      });
    });

  
  
});
