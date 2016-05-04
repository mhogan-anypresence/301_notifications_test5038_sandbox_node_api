var assert = require('assert');
var util = require('util');

var objects = null;

describe('V1NotificationLog query scopes', function() {

  beforeEach( function(done){
	objects = [];
var testObjects = [];
  testObjects.push({"id":"Paddy entreats","message":"Quadrilaterals realistically","notificationType":"Undergo Quintilian","sentAt":"2014-04-17","userName":"Psalm yesterday"});
  testObjects.push({"id":"Composites Wollstonecraft","message":"Pursuant newlywed","notificationType":"Effusiveness incrustations","sentAt":"2015-07-08","userName":"Continental aliening"});
  testObjects.push({"id":"Cameos unoffensive","message":"Lowness remissions","notificationType":"Psych Fisher","sentAt":"2014-08-30","userName":"Dimes condensation"});

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
		V1NotificationLog.destroy().exec(function(err, result) {
  assert(! err, "Received error " + util.inspect(err, {depth: null}));
});

		done();
	});


	it('should successfully execute all query scope', function(done) {
    var value = V1NotificationLog.allScope().exec(function (err, results){
      assert(!err, "Received error " + util.inspect(err, {depth: null}));
		
      assert(results, "Received undefined results " + util.inspect(results));
      assert(util.isArray(results), "Expected array for results " + util.inspect(results));
		
      done(err);
		});
	});
	it('should successfully execute exact_match query scope', function(done) {
    var value = V1NotificationLog.exactMatchScope().exec(function (err, results){
      assert(!err, "Received error " + util.inspect(err, {depth: null}));
		
      assert(results, "Received undefined results " + util.inspect(results));
      assert(util.isArray(results), "Expected array for results " + util.inspect(results));
		
      done(err);
		});
	});
	it('should successfully execute count query scope', function(done) {
    var value = V1NotificationLog.countScope().exec(function (err, results){
      assert(!err, "Received error " + util.inspect(err, {depth: null}));
		
      assert(results, "Received undefined results " + util.inspect(results));
		
      done(err);
		});
	});
	it('should successfully execute count_exact_match query scope', function(done) {
    var value = V1NotificationLog.countExactMatchScope().exec(function (err, results){
      assert(!err, "Received error " + util.inspect(err, {depth: null}));
		
      assert(results, "Received undefined results " + util.inspect(results));
		
      done(err);
		});
	});

});
