var fs                          = require('fs'),
    sails                       = require('sails'),
    propertiesFileReader        = require('properties-reader'),
    defaultPropertiesFilePath   = ".env";

var properties;
if (fileExists(defaultPropertiesFilePath)) {
  properties = propertiesFileReader(defaultPropertiesFilePath);
}

function getPropertyWithFn(key, fn) {
  if (!key) return null;

  var val = process.env[key];
  if (val === undefined && properties) val = properties[fn](key);
  return val;
}

/**
 * given a property key, returns its paired value
 * @param key the property key
 * @returns {*} the property value
 */
function getProperty(key){
  return getPropertyWithFn(key, 'get');
}

function getRawProperty(key) {
  return getPropertyWithFn(key, 'getRaw');
}

/**
 * sets file path of properties file
 * @param propertiesFilePath the path of the properties file
 */
function setPropertiesFilePath(propertiesFilePath){
  if(fileExists(propertiesFilePath)) {
    properties = propertiesFileReader(propertiesFilePath);
  }
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

module.exports = {
  getProperty: getProperty,
  getRawProperty: getRawProperty,
  setPropertiesFilePath: setPropertiesFilePath
};
