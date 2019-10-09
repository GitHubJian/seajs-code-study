define('start.js', function(require, exports, module) {
  debugger
  require.async(
    'invoker.js',
    function() {
      var bar = require('bar.js')
      console.log(bar.b)
    },
    function() {
      console.log('e')
    }
  )

  var foo = require('foo.js')

  return function() {
    console.log('Hello, foo.a = ' + foo.a)
  }
})
