var dotenv  = require('dotenv'),
    sails   = require('sails'),
    fs      = require('fs');

var env;

if (fileExists('.env')) {
  env = fs.readFileSync(".env");
  module.exports.env = dotenv.parse(env);
} else {
  module.exports.env = null;
}

function fileExists(filePath) {
  if (!filePath) return;
  try {
    fs.accessSync(filePath, fs.R_OK)
    return true;
  } catch(err) {
    sails.log.warn("File '" + filePath + "' not found or process does not have read permission.");
    return false
  }
}
