var utilities = require('../../../config/utilities');
var assert = require("assert");

describe('#isMessaging(model)', function(){
    it('should return null if the model value is null', function(){
        assert.equal(utilities.isMessaging(null), false);
    });

    it('should return true if the model value is device', function(){
        assert.equal(utilities.isMessaging("device"), true);
    });

    it('should return true if the model value is channel', function(){
        assert.equal(utilities.isMessaging("channel"), true);
    });

    it('should return true if the model value is message', function(){
        assert.equal(utilities.isMessaging("message"), true);
    });

    it('should return false if the model value is not device, channel or message', function(){
        assert.equal(utilities.isMessaging("not_messaging_name"), false);
    });

});


describe('#getApplicationModelNames(version,models)', function () {
  beforeEach(function() {
    utilities.clearModelCache();
  });
  
  it('should return the versioned models', function() {
    var m = utilities.getApplicationModelNames('v1', { 'v1dog': {}, 'v1cat' : {} });
    assert.equal(m.length, 2);
    assert(m.indexOf('dogs') !== -1);
    assert(m.indexOf('cats') !== -1);
  });
  
  it('should return the appropriate version of the models', function() {
    var m = utilities.getApplicationModelNames('v1', { 'v1dog': {}, 'v1cat' : {}, 'v2dog' : {}, 'v11dog': {} });
    assert.equal(m.length, 2);
  });
});


describe('#removeExtraSlashesFromUrlPath(url)', function () {

    it('should return an empty string if provided url is null', function () {
        assert.equal(utilities.removeExtraSlashesFromUrlPath(null).length, 0);
    });

    it('should return an empty string if provided url is an empty string', function () {
        assert.equal(utilities.removeExtraSlashesFromUrlPath("").length, 0);
    });

    it('should return an empty string if provided url is undefined', function () {
        assert.equal(utilities.removeExtraSlashesFromUrlPath(undefined).length, 0);
    });

    it('should return an empty string if provided url is not an string', function () {
        assert.equal(utilities.removeExtraSlashesFromUrlPath([]).length, 0);
    });

    it('should remove slash right after url domain', function () {
        assert.equal(utilities.removeExtraSlashesFromUrlPath('http://myurl.com//mypath'), 'http://myurl.com/mypath');
    });

    it('should not remove trailing slash', function () {
        assert.equal(utilities.removeExtraSlashesFromUrlPath('http://myurl.com/'), 'http://myurl.com/');
    });

    it('should remove extra trailing slashes', function () {
        assert.equal(utilities.removeExtraSlashesFromUrlPath('http://myurl.com//'), 'http://myurl.com');
    });

    it('should remove extra slashes in url path', function () {
        assert.equal(utilities.removeExtraSlashesFromUrlPath('http://myurl.com/mypath//path'), 'http://myurl.com/mypath/path');
    });

    it('should remove extra slashes in url path', function () {
        assert.equal(utilities.removeExtraSlashesFromUrlPath('http://myurl.com/mypath//////path'), 'http://myurl.com/mypath/path');
    });

    it('should remove extra slashes in url path', function () {
        assert.equal(utilities.removeExtraSlashesFromUrlPath('http://myurl.com////mypath//////path//'), 'http://myurl.com/mypath/path');
    });

    it('should handle cases where only the path is provided, and protocol is missed', function () {
        assert.equal(utilities.removeExtraSlashesFromUrlPath('/mypath//////path//'), '/mypath/path');
    });

    it('should handle cases where only the path is provided, and protocol is missed', function () {
        assert.equal(utilities.removeExtraSlashesFromUrlPath('///mypath/path'), '/mypath/path');
    });

    it('should handle cases where only the path is provided, and protocol is missed', function () {
        assert.equal(utilities.removeExtraSlashesFromUrlPath('mypath///path'), '/mypath/path');
    });

    it('should handle cases where only the path is provided, and protocol is missed', function () {
        assert.equal(utilities.removeExtraSlashesFromUrlPath('mypath///path//'), '/mypath/path');
    });

    it('should handle cases where only the path is provided, and protocol is missed', function () {
        assert.equal(utilities.removeExtraSlashesFromUrlPath('mypath///path//otherPath/morePath'), '/mypath/path/otherPath/morePath');
    });

});


describe('#requestOperation(req)', function(){

    it('should return READ if its a GET request where its path prefix is api', function(){
        var req = {
            path : "api",
            method : 'GET'
        };
        assert.equal(utilities.requestOperation(req), 'READ');
    });

    it('should return UPDATE if its a PUT request where its path prefix is api', function(){
        var req = {
            path : "api",
            method : 'PUT'
        };
        assert.equal(utilities.requestOperation(req), 'UPDATE');
    });

    it('should return DELETE if its a DELETE request where its path prefix is api', function(){
        var req = {
            path : "api",
            method : 'DELETE'
        };
        assert.equal(utilities.requestOperation(req), 'DELETE');
    });

    it('should return CREATE if its a POST request where its path prefix is api', function(){
        var req = {
            path : "api",
            method : 'POST'
        };
        assert.equal(utilities.requestOperation(req), 'CREATE');
    });

    it('should return null if its a POST request where its path is not prefixed with api (its an create op but not an api create)', function(){
        var req = {
            path : "somePathThatIsNotPrefixedWithApiSoItDoesNotAnApiCall",
            method : 'POST'
        };
        assert.equal(utilities.requestOperation(req), null);
    });

    it('should return null if its a DELETE request where its path is not prefixed with api (its a delete op but not an api delete)', function(){
        var req = {
            path : "somePathThatIsNotPrefixedWithApiSoItDoesNotAnApiCall",
            method : 'DELETE'
        };
        assert.equal(utilities.requestOperation(req), null);
    });

    it('should return null if its an UPDATE request where its path is not prefixed with api (its an update op but not an api update)', function(){
        var req = {
            path : "somePathThatIsNotPrefixedWithApiSoItDoesNotAnApiCall",
            method : 'UPDATE'
        };
        assert.equal(utilities.requestOperation(req), null);
    });

    it('should return null if its a GET request where its path is not prefixed with api (its a read op but not an api read)', function(){
        var req = {
            path : "somePathThatIsNotPrefixedWithApiSoItDoesNotAnApiCall",
            method : 'GET'
        };
        assert.equal(utilities.requestOperation(req), null);
    });

    it('should return null if its not a CRUD, sign out, or sign in operation', function(){
        var req = {
            path : "not_register_operation"
        };
        assert.equal(utilities.requestOperation(req), null);
    });

});

describe('#sizeOf(object)', function(){
    it('should return 0 (bytes) if its an empty object', function(){
        assert.equal(utilities.sizeOf({}), 0);
    });

    it('should return 2 (bytes) since it has only 1 character', function(){
        assert.equal(utilities.sizeOf({prop1:"a"}), 2);
    });

    it('should return 4 (bytes) since it has 2 character', function(){
        assert.equal(utilities.sizeOf({prop1:"aa"}), 4);
    });

    it('should return 4 (bytes) since it has two separate props of 1 character each one', function(){
        assert.equal(utilities.sizeOf({prop1:"a", prop2:"a"}), 4);
    });

    it('should return 8 (bytes) since it has two separate props of 1 character each one', function(){
        assert.equal(utilities.sizeOf({prop1:"aa", prop2:"aa"}), 8);
    });

    it('should return 8 (bytes) since first prop has 4 chars, and second property is null', function(){
        assert.equal(utilities.sizeOf({prop1:"aaaa", prop2:null}), 8);
    });

    it('should return 8 (bytes) since first prop is an array containing 4 single char items', function(){
        assert.equal(utilities.sizeOf({prop1:['a','a','a','a']}), 8);
    });

    it('should return 8 (bytes) since first prop contains a single digit', function(){
        assert.equal(utilities.sizeOf({prop1:1}), 8);
    });

    it('should return 16 (bytes) since first and second props contains a single digit', function(){
        assert.equal(utilities.sizeOf({prop1:1, prop2:1}), 16);
    });

    it('should return 4 (bytes) since first prop is a boolean (true)', function(){
        assert.equal(utilities.sizeOf({prop1:true}), 4);
    });

    it('should return 4 (bytes) since first prop is a boolean (false)', function(){
        assert.equal(utilities.sizeOf({prop1:false}), 4);
    });

});

describe('#isAnalytics(model)', function(){
    it('should return false if its not a valid analytics model', function(){
        assert.equal(utilities.isAnalytics("INVALID_ANALYTICS_MODEL_NAME"), false);
    });

    it('should return true if its provided a valid analytics model name', function(){
        utilities.ANALYTICS_MODELS.forEach(function(analyticsModel){
            assert.equal(utilities.isAnalytics(analyticsModel), true);
        });
    });
});


describe('#IPV4_OR_IPV6_PATTERN', function(){
    it('should return true if its provided a valid IPV4 IP', function(){
        assert.notEqual("::ffff:127.0.0.1".match(utilities.IPV4_OR_IPV6_PATTERN), null);
        assert.notEqual("127.0.0.1".match(utilities.IPV4_OR_IPV6_PATTERN), null);
        assert.notEqual("192.168.0.1".match(utilities.IPV4_OR_IPV6_PATTERN), null);
        assert.notEqual("10.10.0.1".match(utilities.IPV4_OR_IPV6_PATTERN), null);
        assert.notEqual("0.0.0.0".match(utilities.IPV4_OR_IPV6_PATTERN), null);

        assert.equal("99.323.2.12".match(utilities.IPV4_OR_IPV6_PATTERN), null);
        assert.equal("1.1.1.1200".match(utilities.IPV4_OR_IPV6_PATTERN), null);
    });
});


describe('#VERSION_PATTERN', function(){
    it('should return not null matching result if its provided a valid version string', function(){
        assert.notEqual("v1".match(utilities.VERSION_PATTERN), null);
        assert.notEqual("v12".match(utilities.VERSION_PATTERN), null);
        assert.notEqual("v124".match(utilities.VERSION_PATTERN), null);
    });

    it('should return null if its provided an invalid version string', function(){
        assert.equal("v-1".match(utilities.VERSION_PATTERN), null);
        assert.equal("1".match(utilities.VERSION_PATTERN), null);
        assert.equal("version1".match(utilities.VERSION_PATTERN), null);
    });
});
