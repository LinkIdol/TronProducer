'use strict';
const jwt = require('jsonwebtoken');
const message = require('../../config/message');
const tronService = require('../TronEvents/tronService');
const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    const ctx = this.ctx;
    const { address, timestamp, sign } = ctx.request.body;
    const msg = message.returnObj('zh');

    const signMessage = 'address=' + address + '&timestamp=' + timestamp;
    if (!await tronService.verifyMessage(signMessage, sign, address)) { // 签名验证失败
      ctx.body = msg.signError;
      return;
    }

    const user = await ctx.service.userService.login(address);
    if (user == null || user.UserId <= 0) {
      ctx.body = msg.addressNotFound;
      return;
    }

    await this.jwtSign(user);
  }

  async jwtSign(user) {
    const content = { UserId: user.UserId, UserName: user.UserName, Address: user.Address };
    // 生成token
    const token = jwt.sign(content, this.config.login.secretKey, {
      expiresIn: this.config.login.expires,
    });

    await this.ctx.cookies.set(this.config.keys, token);
    const msg = message.returnObj('zh');
    const retObj = msg.success;
    retObj.data = {
      access_token: token,
      expires_in: Math.floor(Date.now() / 1000) + this.config.login.expires,
      token_type: 'Bearer',
    };

    this.ctx.body = retObj;
  }

  async register() {
    const ctx = this.ctx;
    const { address, name, timestamp, sign } = ctx.request.body;
    const msg = message.returnObj('zh');

    const signMessage = 'address=' + address + '&timestamp=' + timestamp;
    if (!await tronService.verifyMessage(signMessage, sign, address)) { // 签名验证失败
      ctx.body = msg.signError;
      return;
    }

    const result = await ctx.service.userService.register(address, name);
    if (result) { ctx.body = msg.success; } else { ctx.body = msg.registerError; }
  }

  async getUserInfo() {

    // await tronService.getBalance();
    // const str1 = "tron idol 111";
    // const str2 = "tron idol 222";

    // const address1 = "TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY";
    // const address2 = "TVjmtiAVdbox9LYtZ7eu8Bq7mHJFZCZ3dg";

    // let signValue = await tronService.signMessage(str1);
    // let a = await tronService.verifyMessage(str1, signValue, address1);
    // let b = await tronService.verifyMessage(str2, signValue, address1);
    // let c = await tronService.verifyMessage(str1, signValue, address2);

    // console.log("a=" + a);
    // console.log("b=" + b);
    // console.log("c=" + c);
  }

  async setUserName() {
    const { userName } = this.ctx.request.body;
    const msg = message.returnObj('zh');

    if (this.ctx.user.UserId <= 0) {
      this.ctx.body = msg.notLogin;
      return;
    }

    if (userName == undefined || userName == '') {
      this.ctx.body = msg.parameterError;
      return;
    }

    const ret = await this.service.userService.setUserName(this.ctx.user.UserId, userName);
    if (ret == 0) {
      const user = await this.ctx.model.UserModel.findOne({ where: { UserId: this.ctx.user.UserId } });
      await this.jwtSign(user);
    } else { this.ctx.body = msg.userUpdateError; }
  }


  async signtest() {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const address = 'TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY';
    const signMessage = 'address=' + address + '&timestamp=' + timestamp;
    const sign = await tronService.signMessage(signMessage);

    this.ctx.body = {
      address: 'TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY',
      timestamp,
      signMessage,
      sign,
    };
  }
}

module.exports = UserController;
