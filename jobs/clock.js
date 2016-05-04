var sails             = require('sails'),
    fs                = require('fs'),
    _                 = require('lodash'),
    path              = require('path'),
    CronJob           = require('cron').CronJob,
    customCodeContext = require('../api/libs/customCodeContext');

var version       = 'v1',
    jobsDirectory = path.join(__dirname, version);

function onComplete(job) {
  return function() {
    console.log('Completed job "' + job.name + '"');
  };
}

sails.lift({ log: { level: 'silent' }, hooks: { grunt: false, http: false, sockets: false, views: false, pubsub: false }}, function(sailsErr, server) {
  if (sailsErr) return console.error(sailsErr);

  fs.access(jobsDirectory, function(err) {
    if (err) return console.error("No job files found or couldn't access jobs directory.");

    fs.readdirSync(jobsDirectory).forEach(function(file) {
      var job = require(path.join(__dirname, version, file));
      console.log(`Registered job ${version} "${job.name}" `);
      
      job.schedules.forEach(function(schedule) {
        var context = customCodeContext.createContext('1');
        var wrapper = new WrapperService(job.fn, context, console.log);
        (new CronJob(schedule, wrapper.invoke.bind(wrapper), onComplete(job))).start();
      });
    });
  });
});
