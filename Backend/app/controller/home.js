'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';

    //await this.ctx.render('index.html');
  }
}

module.exports = HomeController;
