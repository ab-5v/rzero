var qs = require('querystring');

var TYPES = {
    JSON: 1,
    MULTIPART: 2,
    URLENCODED: 3
};

module.exports = {

    _reurl: /^(?:(http|get|post|head|delete|put)(s)?:\/\/)?([^:/?]+)(?:\:(\d+))?(\/[^?]*)?(?:\?(.+))?$/,

    _parse: function(url) {
        var match = url.match(this._reurl);

        if (!match) {
            this._error = new Error('Can\'t parse url "' + url + '"');
            return;
        }

        this._params = {
            method: !match[1] || match[1] === 'http' ? 'get' : match[1],
            host: match[3],
            port: match[4] ? +match[4] : (match[2] === 's' ? 443 : 80),
            path: match[5] || '/',
            query: qs.parse(match[6])
        };
    },

    _create: function(url) {
        this._params = {};
        this._parse(url);
        return this;
    },

    _types: {
        'application/json': TYPES.JSON,
        'multipart/form-data': TYPES.MULTIPART,
        'application/x-www-form-urlencoded': TYPES.URLENCODED,
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
        var params = this._params;

        if (typeof params.body === 'object') {
            switch (this._typeReq) {
                case 'json':
                    params.body = JSON.stringify(body);
                    break;

                case 'multipart':
                    // TODO: multipart
                case 'urlencoded':
                default:
                    params.body = qs.stringify(body);
            }
        }
    },

    _options: function(body) {
        var options = {};

        var params = this._params;
        var body = params.body
        var query = qs.stringify(params.query);

        if (body) { this.head('content-length', body.length); }

        ['method', 'host', 'port', 'headers', 'path'].forEach(function(key) {
            options[key] = params[key];
        });

        if (query) { options.path += '?' + query; }

        return options;
    },


    _done: function(callback) {
        var params = this._params;

        if (this._error) {
            return callback(err);
        }

        if (params._typeRes === 'json') {
            try {
                this._data = JSON.parse(this._text);
            } catch (err) {
                return callback(new Error('Can\'t parse response as a JSON.'))
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
