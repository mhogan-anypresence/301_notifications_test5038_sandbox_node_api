var sails             = require('sails'),
    fs                = require('fs'),
    path              = require('path'),
    customCodeContext = require('../api/libs/customCodeContext');

var job, version, logLevel;

job       = process.argv[2];
version   = process.argv[3] || '1';
logLevel  = process.env.JOB_LOGGING_LEVEL || 'info';

var jobsDirectory = path.join(__dirname, 'v' + version);
var filePath = path.join(jobsDirectory, job + '.js');

fs.access(filePath, function(err) {
  if (err) return console.log('File not found or inaccessible.');

  var job = require(filePath);
  sails.lift({ log: { level: logLevel }, hooks: { grunt: false, http: false, sockets: false, views: false, pubsub: false }}, function(sailsErr, server) {
    var context = customCodeContext.createContext(version);
    var wrapper = new WrapperService(job.fn, context, sails.log.info);
    wrapper.invoke.bind(wrapper)(function() {
      server.lower(function() {
        process.exit(0);
      });
    });
  });
});
