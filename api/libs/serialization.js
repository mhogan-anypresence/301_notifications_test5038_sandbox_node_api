module.exports = {
  deserializeCert: function(cert, encoding) {
    if (!cert) return undefined;
    if (!encoding) encoding = 'ascii';
    var b = new Buffer(cert, 'base64');
    return b.toString(encoding).replace(/\\n/gm, '\n');
  },
  serializeCert: function(cert) {
    if (!cert) return;
    var b = new Buffer(cert);
    return b.toString('base64');
  },
  deserializeCertToBuffer: function(cert) {
    if (!cert) return;
    return new Buffer(cert, 'base64');
  }
};