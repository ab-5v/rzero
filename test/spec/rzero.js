var _ = require('lodash');
var expect = require('expect.js');

var rzero = require('../../lib/rzero');

describe('rzero', function() {

    beforeEach(function() {
        this.r0 = rzero('');
    });

    describe('private', function() {

        describe('_parse', function() {

            _.forOwn( require('../mock/_parse'), function(res, url) {

                it('should parse "' + url + '"', function() {
                    var query = res.query; delete res.query;

                    this.r0._parse(url);

                    expect( this.r0._opts ).to.eql(res);
                    expect( this.r0._query ).to.eql(query);
                });

            });

            it('should set an error when can\'t parse url', function() {
                this.r0._parse('');

                expect(this.r0._error).to.be.an(Error);
            });

        });

        describe('_create', function() {

            it('should ensure _query', function() {
                this.r0._create('');

                expect(this.r0._query).to.eql({});
            });

            it('should ensure _opts with headers', function() {
                this.r0._create('');

                expect(this.r0._opts).to.eql({headers: {}});
            });

        });

        describe('_head', function() {

            it('should set response type for "accept: application/json"', function() {
                this.r0._head('accept', 'application/json');

                expect( this.r0._typeRes ).to.eql( this.r0._TYPES.JSON );
            });

            it('should set request type for "content-type: application/json; charset=utf-8"', function() {
                this.r0._head('content-type', 'application/json; charset=utf-8');

                expect( this.r0._typeReq ).to.eql( this.r0._TYPES.JSON );
            });

            it('should not overwrite existing type', function() {
                this.r0._typeRes = this.r0._TYPES.URLENCODED;
                this.r0._head('accept', 'application/json');

                expect( this.r0._typeRes ).to.eql( this.r0._TYPES.URLENCODED );
            });

        });

        describe('_body', function() {

            it('should not modify body string', function() {
                this.r0._opts.body = '123';
                this.r0._body();

                expect( this.r0._opts.body ).to.eql('123');
            });

            it('should stringify via JSON on json body type', function() {
                this.r0._typeReq = this.r0._TYPES.JSON;
                this.r0._opts.body = {a: 1, b: 2};
                this.r0._body();

                expect( this.r0._opts.body ).to.eql('{"a":1,"b":2}');
            });

            it('should stringify via qs on urlencoded body type', function() {
                this.r0._typeReq = this.r0._TYPES.URLENCODED;
                this.r0._opts.body = {a: 1, b: 2};
                this.r0._body();

                expect( this.r0._opts.body ).to.eql('a=1&b=2');
            });

            it('should stringify via qs by default', function() {
                this.r0._opts.body = {a: 1, b: 2};
                this.r0._body();

                expect( this.r0._opts.body ).to.eql('a=1&b=2');
            });

        });

        describe('_options', function() {

            it('should add content-length for body when exists', function() {
                this.r0._opts.body = '123';

                expect( this.r0._options().headers['content-length'] ).to.eql(3);
            });
        });

    });

});
