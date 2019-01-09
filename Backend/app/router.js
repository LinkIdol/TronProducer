'use strict';
const Passport = require('./service/passport');
const tronService = require("./TronEvents/tronService");

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, service } = app;
  router.opts.sensitive = false;
  router.get('/', controller.home.index);

  router.post('/user/login', controller.user.login);
  router.post('/user/register', controller.user.register);
  router.post('/user/getUserInfo', controller.user.getUserInfo);
  router.post('/user/signtest', controller.user.signtest);

  router.post('/tron/trontest', controller.tron.trontest);
  router.post('/tron/syncIdols', controller.tron.syncIdols);
  router.post('/tron/syncAuctions', controller.tron.syncAuctions);
  router.post('/tron/getIdol', controller.tron.getIdol);
  router.post('/tron/getTotalSupply', controller.tron.getTotalSupply);
  router.post('/tron/Birth', controller.tron.Birth);
  router.post('/tron/getSaleAuction', controller.tron.getSaleAuction);
  router.post('/tron/ownerOf', controller.tron.ownerOf);
  router.post('/tron/getSaleCurrentPrice', controller.tron.getSaleCurrentPrice);

  
  router.post('/idol/upload', Passport.verify, controller.idol.upload);
  router.post('/idol/setIdol', Passport.verify, controller.idol.setIdol);

  router.post('/idol/setName', Passport.verify, controller.idol.setName);
  router.post('/idol/setBio', Passport.verify, controller.idol.setBio);

  router.get('/idol/getIdol', Passport.verify, controller.idol.getIdol);
  router.get('/idol/getMyIdols', Passport.authorize, controller.idol.getMyIdols);
  router.get('/idol/getMarketIdols', Passport.verify, controller.idol.getMarketIdols);

  router.post('/idol/like', Passport.verify, controller.idol.like);
  router.post('/idol/unlike', Passport.verify, controller.idol.unlike);

  //启动事件监听，"idol_update"
  tronService.listenIdolUpdate();
};
