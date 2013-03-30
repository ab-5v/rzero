var util = module.exports = {
    each: function(obj, cb) {
        Object.keys(obj).forEach(cb);
    },
    extend: function(to, from) {
        util.each(from, function(key) { to[key] = from[key]; });
        return to;
    }
};
