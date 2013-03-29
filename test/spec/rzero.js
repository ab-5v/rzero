var _ = require('lodash');
var expect = require('expect.js');

var rzero = require('../../lib/rzero');

describe('rzero', function() {

    beforeEach(function() {
        this.request = rzero('');
    });

    describe('_parse', function() {
        _.forOwn( require('../mock/_parse'), function(res, url) {

            it('should parse "' + url + '"', function() {
                this.request._parse(url);

                expect( this.request._params ).to.eql(res);
            });

        });
    });

});
