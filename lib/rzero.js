var util = require('./util');

var api = require('./api');
var private = require('./private');

var rzero, proto;

rzero = module.exports = function(url) {
    return new proto._create(url);
};

proto = util.extend( api, private );

proto._create.prototype = proto;

util.extend(rzero, private._TYPES);
