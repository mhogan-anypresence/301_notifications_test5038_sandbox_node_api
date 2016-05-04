var assert = require('assert');
var util = require('util');

var objects = null;

describe('V1User query scopes', function() {

  beforeEach( function(done){
	objects = [];
var testObjects = [];
  testObjects.push({"id":"Foreordains parapsychology","emailAddress":"osvaldo.boehm34@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Pinwheeling tills","phoneNumber":"Levelheadedness discontented","role":"Subcontracting tachometers","sendPushNotifications":true,"sendSendgridNotifications":false,"sendTwilioNotifications":false,"username":"Overemphasizes indivisibility","xSessionId":"Predicament deletes"});
  testObjects.push({"id":"Televangelist Baluchistan","emailAddress":"florentina.johnson66@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Brazilians acceleration","phoneNumber":"Harries espoused","role":"Dieticians nominating","sendPushNotifications":true,"sendSendgridNotifications":true,"sendTwilioNotifications":true,"username":"Vituperated Altai","xSessionId":"Executives rightfully"});
  testObjects.push({"id":"Lopes mentors","emailAddress":"evita.orn8@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Divorced moistness","phoneNumber":"Likenesses disarranging","role":"Glorious guarantors","sendPushNotifications":false,"sendSendgridNotifications":false,"sendTwilioNotifications":true,"username":"Ostentatious pancreas","xSessionId":"Subordinates Hiroshima"});

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
		V1User.destroy().exec(function(err, result) {
  assert(! err, "Received error " + util.inspect(err, {depth: null}));
});

		done();
	});


	it('should successfully execute all query scope', function(done) {
    var value = V1User.allScope().exec(function (err, results){
      assert(!err, "Received error " + util.inspect(err, {depth: null}));
		
      assert(results, "Received undefined results " + util.inspect(results));
      assert(util.isArray(results), "Expected array for results " + util.inspect(results));
		
      done(err);
		});
	});
	it('should successfully execute exact_match query scope', function(done) {
    var value = V1User.exactMatchScope().exec(function (err, results){
      assert(!err, "Received error " + util.inspect(err, {depth: null}));
		
      assert(results, "Received undefined results " + util.inspect(results));
      assert(util.isArray(results), "Expected array for results " + util.inspect(results));
		
      done(err);
		});
	});
	it('should successfully execute count query scope', function(done) {
    var value = V1User.countScope().exec(function (err, results){
      assert(!err, "Received error " + util.inspect(err, {depth: null}));
		
      assert(results, "Received undefined results " + util.inspect(results));
		
      done(err);
		});
	});
	it('should successfully execute count_exact_match query scope', function(done) {
    var value = V1User.countExactMatchScope().exec(function (err, results){
      assert(!err, "Received error " + util.inspect(err, {depth: null}));
		
      assert(results, "Received undefined results " + util.inspect(results));
		
      done(err);
		});
	});

  it('should successfully execute my_user_record query scope with fields', function(done){
		
    V1User.create({"id":"Delmonico immoral","emailAddress":"theola.raynor28@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Sandwiched moody","phoneNumber":"Homeopathic nonempty","role":"Humility concentrates","sendPushNotifications":false,"sendSendgridNotifications":false,"sendTwilioNotifications":false,"username":"Reorganizations eyestrain","xSessionId":"Disinterestedly Colombia"}).exec(function(err, obj) {
      assert(!err, "Received error " + util.inspect(err, {depth: null}));
			assert(obj,"Failed to create object " + util.inspect(obj));
			
      V1User.myUserRecordScope({}, {"username":"Reorganizations eyestrain"}).exec(function(err, results) {
        assert(!err, "Received error " + util.inspect(err, {depth: null}));
        assert(results, "Expected results not to be null");
        done(err);
			});
		});
  });

});
