var qs = require('querystring');

var TYPES = {
    JSON: 1,
    MULTIPART: 2,
    URLENCODED: 3
};

var proto = module.exports = {

    _reurl: /^(?:(http|get|post|head|delete|put)(s)?:\/\/)?([^:/?]+)(?:\:(\d+))?(\/[^?]*)?(?:\?(.+))?$/,

    _parse: function(url) {
        var match = url.match(this._reurl);

        if (!match) {
            this._error = new Error('Can\'t parse url "' + url + '"');
            return;
        }

        this._opts = {
            host: match[3],
            path: match[5] || '/',
            port: match[4] ? +match[4] : (match[2] === 's' ? 443 : 80),
            method: !match[1] || match[1] === 'http' ? 'get' : match[1],
            headers: {}
        };

        this._query = qs.parse(match[6]);
    },

    _create: function(url) {
        this._opts = { headers: {} };
        this._parse(url);
        this._query = this._query || {};

        return this;
    },

    _TYPES: TYPES,

    _types: {
        'application/json': TYPES.JSON,
        'multipart/form-data': TYPES.MULTIPART,
        'application/x-www-form-urlencoded': TYPES.URLENCODED
    },

    _head: function(name, value) {
        // remove encoding if one
        value = value.split(';')[0];

        var type = this._types[value];

        if (type) {
            if (name === 'accept' && !this._typeRes) { this._typeRes = type; }
            if (name === 'content-type' && !this._typeReq) { this._typeReq = type; }
        }
    },

    _body: function() {
        var opts = this._opts;
        var type = this._typeReq || TYPES.MULTIPART;

        if (typeof opts.body === 'object') {
            switch (type) {
                case TYPES.JSON:
                    opts.body = JSON.stringify(opts.body);
                break;

                case TYPES.MULTIPART:
                    // TODO: multipart
                case TYPES.URLENCODED:
                    opts.body = qs.stringify(opts.body);
                break;
            }
        }
    },

    _options: function() {
        var options = {};

        var opts = this._opts;
        var body = opts.body;
        var query = qs.stringify(opts.query);

        if (body) { this.head('content-length', ''+body.length); }

        ['method', 'host', 'port', 'headers', 'path'].forEach(function(key) {
            options[key] = opts[key];
        });

        if (query) { options.path += '?' + query; }

        return options;
    },


    _done: function(callback) {
        var opts = this._opts;

        if (this._error) {
            return callback(this._error);
        }

        if (opts._typeRes === 'json') {
            try {
                this._data = JSON.parse(this._text);
            } catch (err) {
                return callback(new Error('Can\'t parse response as a JSON.'));
            }
        } else {
            this._data = this._text;
        }

        callback(null, {
            req: this._req,
            res: this._res,
            text: this._text,
            data: this._data,
            status: this._res.statusCode
        });
    }
};
