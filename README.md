[![build status](https://secure.travis-ci.org/artjock/rzero.png)](http://travis-ci.org/artjock/rzero)

rzero
=====

Simple request client.

## API

```javascript
rzero( handler.url )
  .head( 'Content-Type: application/json' )
  .head( {'X-Api-Version': '2.1.0', 'X-Req-Id': 'asd'} )
  .prms( 'login', 'artjock' )
  .prms( {name: 'Artur', gender: 'male'} )
  .body( body )
  .type( 'response type', 'request- type' )
  .bind( 'text', function(text) { return text.replace(/'/g, '"'); } )
  .bind( 'json', function(json) { return json.users[0].name; } )
  .done(function(err, result) {
    err;
    result.req;
    result.res;
    result.text;
    result.data;
    result.status;
  });
```
