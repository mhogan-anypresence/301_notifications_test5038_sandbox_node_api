var stream        = require('stream'),
    util          = require('util'),
    serialization = require('../libs/serialization'),
    async         = require('async'),
    toArray       = require('stream-to-array');

var fileFields = ['cert', 'privateKey', 'pfx'];

// Null reciever to push non-existing streams out.
function Null() {
  stream.Writable.call(this, {});
}

util.inherits(Null, stream.Writable);

Null.prototype._write = function(chunk, encoding, done) {
  setTimeout(done, 0);
};

function nullReceiver() {
  var _receiver = stream.Writable({ objectMode: true });

  _receiver._write = function(file, encoding, done) {
    var output = new Null();

    output.on('finish', function() {
      done();
    });

    file.pipe(output);
  };

  return _receiver;
}
// end Null receiver

function RequestStream(options) {
  this.options = options;
  this.data = [];
  stream.Writable.call(this, {});
}

util.inherits(RequestStream, stream.Writable);

RequestStream.prototype._write = function(chunk, next) {
  this.data.push(chunk);
  setTimeout(next, 0);
};

function requestReceiver(options, cb) {
  var _receiver = stream.Writable({ objectMode: true });

  _receiver._write = function(file, encoding, done) {
    toArray(file)
    .then(function(parts) {
      var buffers = [];
      for (var i = 0, l = parts.length; i < l ; ++i) {
        var part = parts[i];
        buffers.push((part instanceof Buffer) ? part : new Buffer(part));
      }
      return Buffer.concat(buffers);
    })
    .then(function(result) {
      options.req.body[options.field] = result.toString('base64');
      done();
      cb();
    });
  };

  return _receiver;
}

module.exports = function(req, res, next) {
  var fnArr = [];
  fileFields.forEach(function(field) {
    var file = req.file(field);

    if (file._files.length > 0) {
      fnArr.push(function(cb) {
        file.pipe(requestReceiver({req: req, field: field}, cb));
      });
    } else {
      file.pipe(nullReceiver());
    }
  });

  async.parallel(fnArr, next);
};
