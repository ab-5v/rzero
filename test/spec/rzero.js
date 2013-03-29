var _ = require('lodash');
var expect = require('expect.js');

var pzero = require('../../index');

describe('ctor', function() {

    _.forOwn( require('../mock/ctor'), function(res, url) {

        it('should parse "' + url + '"', function() {
            expect( pzero(url) ).to.eql(res);
        });

    });

});
