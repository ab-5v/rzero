var _ = require('lodash');

var defaults = {
    method: 'get',
    host: 'yandex.ru',
    path: '/',
    port: 80,
    headers: {}
};

var def = function(obj) { return _.extend({}, defaults, {query: {}}, obj); };

module.exports = {
    'yandex.ru':    def(),
    'yandex.ru/':   def(),

    'http://yandex.ru':     def(),
    'https://yandex.ru':    def({port: 443}),

    'get://yandex.ru':      def({method: 'get'}),
    'put://yandex.ru':      def({method: 'put'}),
    'post://yandex.ru':     def({method: 'post'}),
    'head://yandex.ru':     def({method: 'head'}),
    'delete://yandex.ru':   def({method: 'delete'}),

    'gets://yandex.ru':     def({method: 'get',   port: 443}),
    'puts://yandex.ru':     def({method: 'put',   port: 443}),
    'posts://yandex.ru':    def({method: 'post',  port: 443}),
    'heads://yandex.ru':    def({method: 'head',  port: 443}),
    'deletes://yandex.ru':  def({method: 'delete', port: 443}),

    'yandex.ru:8080':           def({port: 8080}),
    'http://yandex.ru:8080':    def({port: 8080}),
    'https://yandex.ru:8080':   def({port: 8080}),
    'head://yandex.ru:8080':    def({port: 8080, method: 'head'}),
    'heads://yandex.ru:8080':   def({port: 8080, method: 'head'}),

    'yandex.ru?a=1&b=2':                def({query: {a: '1', b: '2'}}),
    'yandex.ru/?a=1&b=2':               def({query: {a: '1', b: '2'}}),
    'http://yandex.ru?a=1&b=2':         def({query: {a: '1', b: '2'}}),
    'https://yandex.ru?a=1&b=2':        def({query: {a: '1', b: '2'}, port: 443}),
    'posts://yandex.ru:8080?a=1&b=2':   def({query: {a: '1', b: '2'}, port: 8080, method: 'post'}),

    'yandex.ru/api':                                def({path: '/api'}),
    'yandex.ru/api/index.html':                     def({path: '/api/index.html'}),
    'http://yandex.ru/api/v1/index.html?aa=1&bb=2': def({path: '/api/v1/index.html', query: {aa: '1', bb: '2'}}),
    'posts://yandex.ru:8080/api?aa=1&bb=2':         def({path: '/api', port: '8080', method: 'post', query: {aa: '1', bb: '2'}})
};
