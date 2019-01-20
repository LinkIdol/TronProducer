'use strict';
const jwt = require('jsonwebtoken');
//const config = require('../../config/config.default')('');
const message = require('../../config/message');

module.exports = {

  async verify(ctx, next) {
    // 获取cookies信息
    let token = ctx.cookies.get(ctx.app.config.keys);

    const { authorization } = ctx.headers;

    if (token == undefined && authorization != undefined) {
      const auths = authorization.split(' ');
      if (auths[0] == 'Bearer' && auths.length == 2) {
        token = auths[1];
      }
    }

    ctx.user = { UserId: 0, UserName: '' };
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
    let token = ctx.cookies.get(ctx.app.config.keys);

    const { authorization } = ctx.headers;

    if (token == undefined) {
      if (authorization == undefined)
        ctx.throw(401, 'The token is error.');

      const auths = authorization.split(' ');

      if (auths[0] != 'Bearer' || auths.length != 2) {
        ctx.throw(401, 'The authorization is error.');
      }

      token = auths[1];
    }

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

    await next();
  },

};
