var request = require("request");

module.exports = function(apiKey, cb) {
  var options = {
    method: 'POST',
    json: true,
    url: ' https://gcm-http.googleapis.com/gcm/send',
    headers: {
      'Authorization': 'key=' + apiKey
    },
    body: {
      "registration_ids": ['ABC']
    }
  };

  request(options, function(err, response) {
    if (err) return cb(err);
    if (response && response.statusCode !== 200) return cb(new Error('Invalid GCM key'));
    return cb();
  });
};
