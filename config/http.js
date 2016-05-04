var Analytics = require('../api/analytics/analytics');
var utilities = require('./utilities');
var skipper = require('../node_modules/sails/node_modules/skipper');

module.exports.http = {
    middleware: {
        order: [
            'normalizeUrl',
            'analytics',
            'startRequestTimer',
            'cookieParser',
            'session',
            'myRequestLogger',
            'bodyparser',
            'handleBodyParserError',
            'compress',
            'methodOverride',
            'poweredBy',
            '$custom',
            'router',
            'www',
            'favicon',
            '404',
            '500'
        ],
        normalizeUrl : function(req,res,next){
            req.url = require('./utilities').removeExtraSlashesFromUrlPath(req.url);
            return next();
        },
        analytics : function(req,res,next){
          Analytics.analytics(req, res); return next();
        },
        bodyparser: function(req,res, next){
          return skipper({limit:"50mb"})(req, res, next);
        }
    }
};
