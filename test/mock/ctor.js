var _ = require('lodash');

var defaults = {
    type: 'get',
    host: 'yandex.ru',
    path: '',
    port: 80,
    query: {}
};

var def = function(obj) { return _.defaults(obj || {}, defaults); };

module.exports = {
    'yandex.ru':    def(),
    'yandex.ru/':   def({path: '/'}),

    'http://yandex.ru':     def(),
    'https://yandex.ru':    def({port: 443}),

    'get://yandex.ru':      def({type: 'get'}),
    'put://yandex.ru':      def({type: 'put'}),
    'post://yandex.ru':     def({type: 'post'}),
    'head://yandex.ru':     def({type: 'head'}),
    'delete://yandex.ru':   def({type: 'delete'}),

    'gets://yandex.ru':     def({type: 'get',   port: 443}),
    'puts://yandex.ru':     def({type: 'put',   port: 443}),
    'posts://yandex.ru':    def({type: 'post',  port: 443}),
    'heads://yandex.ru':    def({type: 'head',  port: 443}),
    'deletes://yandex.ru':  def({type: 'delete', port: 443}),

    'yandex.ru:8080':           def({port: 8080}),
    'http://yandex.ru:8080':    def({port: 8080}),
    'https://yandex.ru:8080':   def({port: 8080}),
    'head://yandex.ru:8080':    def({port: 8080, type: 'head'}),
    'heads://yandex.ru:8080':   def({port: 8080, type: 'head'}),

    'yandex.ru?a=1&b=2':                def({query: {a: '1', b: '2'}}),
    'yandex.ru/?a=1&b=2':               def({query: {a: '1', b: '2'}, path: '/'}),
    'http://yandex.ru?a=1&b=2':         def({query: {a: '1', b: '2'}}),
    'https://yandex.ru?a=1&b=2':        def({query: {a: '1', b: '2'}, port: 443}),
    'posts://yandex.ru:8080?a=1&b=2':  def({query: {a: '1', b: '2'}, port: 8080, type: 'post'}),

    'yandex.ru/api':                                def({path: '/api'}),
    'yandex.ru/api/index.html':                     def({path: '/api/index.html'}),
    'http://yandex.ru/api/v1/index.html?aa=1&bb=2': def({path: '/api/v1/index.html', query: {aa: '1', bb: '2'}}),
    'posts://yandex.ru:8080/api?aa=1&bb=2':         def({path: '/api', port: '8080', type: 'post', query: {aa: '1', bb: '2'}})
};
