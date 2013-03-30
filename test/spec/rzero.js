var _ = require('lodash');
var sinon = require('sinon');
var expect = require('expect.js');

var rzero = require('../../lib/rzero');

describe('rzero', function() {

    beforeEach(function() {
        this.r0 = rzero('artjock.ru');
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
                this.r0._data = '123';
                this.r0._body();

                expect( this.r0._data ).to.eql('123');
            });

            it('should stringify via JSON on json body type', function() {
                this.r0._typeReq = this.r0._TYPES.JSON;
                this.r0._data = {a: 1, b: 2};
                this.r0._body();

                expect( this.r0._data ).to.eql('{"a":1,"b":2}');
            });

            it('should stringify via qs on urlencoded body type', function() {
                this.r0._typeReq = this.r0._TYPES.URLENCODED;
                this.r0._data = {a: 1, b: 2};
                this.r0._body();

                expect( this.r0._data ).to.eql('a=1&b=2');
            });

            it('should stringify via qs by default', function() {
                this.r0._data = {a: 1, b: 2};
                this.r0._body();

                expect( this.r0._data ).to.eql('a=1&b=2');
            });

        });

        describe('_options', function() {

            it('should add content-length for body when exists', function() {
                this.r0._data = '123';

                expect( this.r0._options().headers['content-length'] ).to.eql(3);
            });

            it('should not add content-lenght when no body exists', function() {
                expect( this.r0._options().headers['content-length'] ).to.be(undefined);
            });

            it('should add query to path when exists', function() {
                this.r0._opts.path = '/test';
                this.r0._query = {a: 1, b: 2};

                expect( this.r0._options().path ).to.eql('/test?a=1&b=2');
            });

        });

        describe('_done', function() {

            beforeEach(function() {
                this.cb = sinon.spy();
                this.r0._req = 1;
                this.r0._res = { statusCode: 200 };
            });

            it('should run callback if error exists', function() {
                var err = this.r0._error = new Error('test');
                this.r0._done(this.cb);

                expect( this.cb.calledWith(err) ).to.be.ok();
            });

            it('should parse data if _typeRes exists', function() {
                this.r0._typeRes = rzero.JSON;
                this.r0._text = '{"a": 1, "b": 2}';
                this.r0._done(this.cb);

                expect( this.r0._data ).to.eql({a: 1, b: 2});
            });

            it('should run callback if parse error exists', function() {
                this.r0._typeRes = rzero.JSON;
                this.r0._text = '{foo}';
                this.r0._done(this.cb);

                expect( this.cb.getCall(0).args[0] ).to.be.an(Error);
            });

            it('should run callback with data', function() {
                this.r0._text = '123';
                this.r0._done(this.cb);

                expect( this.cb.getCall(0).args[0] ).to.be(null);
                expect( this.cb.getCall(0).args[1] ).to.eql({
                    req: 1,
                    res: {statusCode: 200},
                    status: 200,
                    data: undefined,
                    text: '123'
                });
            });

        });

    });

    describe('api', function() {

        describe('body', function() {

            it('should write body', function() {});

            it('should overwrite body', function() {});

        });

        describe('type', function() {

            it('should write _typeRes', function() {});

            it('should write _typeReq', function() {});

            it('should write _typeRes and _typeReq', function() {});

        });

        describe('prms', function() {

            it('should write (name, value)', function() {});

            it('should write (params)', function() {});

            it('should extend params', function() {});

        });

        describe('head', function() {

            it('should write (name, value)', function() {});

            it('should write (headers)', function() {});

            it('should extend headers', function() {});

            it('should call _head', function() {});

        });

        describe('bind', function() {

            it('should add callback', function() {
            });

        });

        describe('done', function() {

            it('should save callback', function() {});

            it('should return on error', function() {});

            it('should call _body', function() {});

            it('should call _options', function() {});

            it('should call _body before _options', function() {});

        });

    });

});
