var util = require('./util');

var rzero, proto;

rzero = module.exports = function(url) {
    return new proto._create(url);
};

proto = util.extend( require('./api'), require('./private') );

proto._create.prototype = proto;
