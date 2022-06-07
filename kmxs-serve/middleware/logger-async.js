/**
 * @desc: 开发 logger 中间件
 * @koa-version: v2+
 * @path: ./middleware/logger-async.js
 * @author: lianpf
 * @date: 2021-02-12
 * */

function log(ctx) {
  console.log("logger-async:", ctx.method, ctx.header.host + ctx.url);
  // console.log("logger-async:", ctx);
}

module.exports = function () {
  return async function (ctx, next) {
    log(ctx);
    await next();
  };
};
