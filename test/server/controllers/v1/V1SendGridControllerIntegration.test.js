var Sails = require('sails');
var assert = require ('assert');
var passportStub = require ('passport-stub');
var superagent = require('superagent');
var util = require('util');
var _ = require('lodash');
var adapter = require('sails-memory');

var agent, objects = [];



describe('V1SendGrid', function() {
  
    beforeEach(function() {
      objects = [];
      agent = superagent.agent();
      
        objects.push({"id":11635,"emailFrom":"Revolutionize overestimate","emailTo":"Revilement interventions","message":"Restfulness subconscious","subject":"Gyros misspellings"});
      
        objects.push({"id":15922,"emailFrom":"Presupposition achieving","emailTo":"Crossness reverberation","message":"Novelettes haberdashers","subject":"Krista Gehenna"});
      
        objects.push({"id":64275,"emailFrom":"Indestructibly vocalizations","emailTo":"Bhopal enmity","message":"Defer upholstering","subject":"Validation reincarnations"});
      
        objects.push({"id":31936,"emailFrom":"Orating promiscuously","emailTo":"Inconsiderately beautification","message":"Novices overproduction","subject":"Pharmaceuticals measureless"});
      
        objects.push({"id":54771,"emailFrom":"Couch scabbiest","emailTo":"Computerizing Machiavellian","message":"Manifolded adjudicator","subject":"Blinkered raunchiest"});
      
        objects.push({"id":21886,"emailFrom":"Certificated acquisitiveness","emailTo":"Goethe Henson","message":"Fundamentalist comparison","subject":"Incommensurate reclines"});
      
        objects.push({"id":58690,"emailFrom":"Relabeling coronet","emailTo":"Communicative obstructiveness","message":"Particularizes ultrasonic","subject":"Ancillaries hospitalization"});
      
        objects.push({"id":27515,"emailFrom":"Pollutants Brian","emailTo":"Possessiveness toddy","message":"Pedestals embalm","subject":"Scrofula indispensables"});
      
        objects.push({"id":34325,"emailFrom":"Verbalizing tooting","emailTo":"Unnatural excommunicating","message":"Sextets interconnect","subject":"Polymerization laxest"});
      
        objects.push({"id":29100,"emailFrom":"Twists interns","emailTo":"Downloading Armstrong","message":"Reeds metastasizes","subject":"Configurations tyrannosauruses"});
      
      V1SendGrid.request = function(a, url, vals, context, cb) {
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


    it('should not be able to get index of send_grids', function (done) {
      agent.get("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/send_grids").set('Content-Type', 'application/json').end(function (err, res) {
        if (err) return done(err);
        assert.equal(res.status, 403);
        done(err);
      });
    });

    it('should not be able to create send_grid', function (done) {
      var newObj = {"id":96440,"email_from":"Sequestering septuagenarians","email_to":"Unconscionably Ijssel","message":"Commencements perspicacious","subject":"Felonious observatories"};
      delete newObj.id;
      agent.post("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/send_grids").send(newObj).set('Content-Type', 'application/json').end(function (err, res) {
        if (err) return done(err);
        assert.equal(res.status, 403);
        done(err);
      });
    });

    it('should not be able to show send_grid', function (done) {
      var id = objects[0].id;
      agent.get("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/send_grids/" + id).set('Content-Type', 'application/json').end(function (err, res) {
        assert(! err, "Received error " + util.inspect(err, {depth: null}));
        assert.equal(res.status, 403);
        done(err);
      });
    });

    it('should not be able to update send_grid', function (done) {
      var id = objects[0].id;
      var newObj = {"id":6965,"email_from":"Beekeeping unsubstantiated","email_to":"Prohibitionists bothersome","message":"Retrospectively excruciatingly","subject":"Decriminalizing Lithuanians"};
      newObj.id = id;
      agent.put("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/send_grids/" + id).send(newObj).set('Content-Type', 'application/json').end(function (err, res) {
        if (err) return done(err);
        assert.equal(res.status, 403);
        done(err);
      });
    });

    it('should not be able to destroy send_grid', function (done) {
      var id = objects[0].id;
      agent.del("http://localhost:" + (process.env.TEST_PORT || 1337) + "/api/v1/send_grids/" + id).end(function (err, res) {
        if (err) return done(err);
        assert.equal(res.status, 403);
        done(err);
      });
    });
  
});
