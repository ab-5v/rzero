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
        var type = this._typeReq || TYPES.MULTIPART;

        if (typeof this._data === 'object') {
            switch (type) {
                case TYPES.JSON:
                    this._data = JSON.stringify(this._data);
                break;

                case TYPES.MULTIPART:
                    // TODO: multipart
                case TYPES.URLENCODED:
                    this._data = qs.stringify(this._data);
                break;
            }
        }

        return this._data;
    },

    _options: function() {
        var options = this._opts;

        var query = qs.stringify(this._query);

        if (this._data) { this.head('content-length', '' + this._data.length); }

        if (query) { options.path += '?' + query; }

        return options;
    },


    _done: function() {
        var data;
        var text = this._text;
        var onjson = this._onjson;
        var callback = this._callback;

        if (this._error) {
            return callback(this._error);
        }

        if (this._typeRes === TYPES.JSON) {
            try {
                data = JSON.parse(text);
                if (typeof onjson === 'function') {
                    data = onjson(data);
                }
            } catch (err) {
                return callback(new Error('Can\'t parse response as a JSON.'));
            }
        }

        callback(null, {
            req: this._req,
            res: this._res,
            text: text,
            data: data,
            status: this._res.statusCode
        });
    }
};
