'use strict';
const jwt = require('jsonwebtoken');
//const config = require('../../config/config.default')('');
const message = require('../../config/message');

module.exports = {

  async verify(ctx, next) {
    // 获取cookies信息
    const token = ctx.cookies.get(ctx.app.config.keys);
    ctx.user = { UserId: 0 };
    if (token != undefined) {
      try {
        let user = jwt.verify(token, ctx.app.config.login.secretKey);
        ctx.user = user;
      } catch (err) {
      }
    }
    await next();
  },

  // 验证jwt
  async authorize(ctx, next) {
    // 获取cookies信息
    const token = ctx.cookies.get(ctx.app.config.keys);
    let user;
    try {
      user = jwt.verify(token, ctx.app.config.login.secretKey);
      ctx.user = user;
    } catch (err) {
      // jwt expired
      console.log(err);
      ctx.throw(401, 'The token is error.');
      //ctx.redirect('/login');
    }

    console.log(user);
    await next();
  },

};
