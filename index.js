const koa = require('koa')
const app = new koa()

app.use(async (ctx, next) => {
  ctx.body = {
    a: 1
  }

  // await next()

  console.log('2')
})

app.use(async (ctx, next) => {
  console.log('1')
  ctx.body = Object.assign({}, ctx.body, { b: 1 })
  console.log(3)
})

app.listen(8422, function() {
  console.log('✨ Server Run on -> http://localhost:8422')
})
