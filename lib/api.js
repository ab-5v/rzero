var http = require('http');
var util = require('./util');

var proto = module.exports = {

    body: function(body) {
        this._params.body = body;
        return this;
    },

    type: function(res, req) {
        if (res) {
            this._typeRes = res;
        }
        if (req) {
            this._typeReq = req;
        }
        return this;
    },

    prms: function(query) {
        var args = arguments;
        var params = this.options;

        if (args.length === 2) {
            params[ args[0] ] = args[1];
        } else {
            util.extend(params, query);
        }
        return this;
    },

    head: function(headers) {
        var args = arguments;
        var params = this._params;

        if (args.length === 2) {
            headers = {};
            headers[ args[0] ] = args[1];
        }

        util.each(headers, function(name, value) {
            name = name.toLowerCase();
            value = headers[name].toLowerCase();

            params.headers[name] = value;

            that._head(name, value);

        });
        return this;
    },

    bind: function(name, callback) {
        this._params['on' + name] = callback;
    },

    done: function(callback) {
        this._callback = callback;

        if (this._error) { return this._done(); }

        var that = this;
        var body = this._body();
        var options = this._options();

        this._req = http.request(options, function(res) {
            var data = '';

            that._res = res;

            res.on('data', function (chunk) { data += chunk });
            res.on('end', function() {
                var ontext = that._params.ontext;
                that._text = ontext === 'function' ? ontext(data) : data;
                that._done();
            });
        });

        this._req.on('error', function(err) { that._error = err; });

        if (body) { this._req.write(body); }

        this._req.end();
    }
};

// aliases
proto.query = proto.params = proto.param = proto.prms;
proto.headers = proto.header = proto.head;

