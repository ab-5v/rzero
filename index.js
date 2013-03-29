var qs = require('querystring');

var reUrl = /^(?:(http|get|post|head|delete|put)(s)?:\/\/)?([^:/?]+)(?:\:(\d+))?(\/[^?]*)?(?:\?(.+))?$/;

module.exports = function(url) {
    var match = url.match(reUrl);

    if (!match) { return {}; }

    return {
        type: !match[1] || match[1] === 'http' ? 'get' : match[1],
        host: match[3],
        port: match[4] ? +match[4] : (match[2] === 's' ? 443 : 80),
        path: match[5] || '',
        query: qs.parse(match[6])
    };
};
