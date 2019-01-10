'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = '';

  config.isDebug = true;

  //合约地址
  config.contracts = {
    idolCore: "TSU62dQsgRML8J7sYim18QJD6L56UA7KmT",
    saleAuction: "TQmnHnW7yqfPrVEDLzf4RdA7W6wKiJjsXE",
    siringAuction: "TKNpyPVZFzYVaERHG8RzakZNfG6yfXenG9",
    geneScience: "TDJWBp4H15zNAuLCfJjJx5NKdwhhMZABHh"
  };

  config.oss = {
    region: "",
    accessKeyId: "",
    accessKeySecret: "",
    bucket: ""
  };

  config.tron = {
    privateKey: '',
  };

  config.currentBlockNumber = 0;

  // 请修改jwt密钥和失效时间
  config.login = {
    secretKey: '', // jwt密钥
    expires: 60 * 60 * 24, // 超时时间24小时
  };

  config.cors = {
    origin: 'https://tron.linkidol.pro',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true
  };

  // add your config here
  config.middleware = [];

  // 配置端口号，主机名
  config.cluster = {
    listen: {
      path: '',
      port: 7001,
      hostname: '',
      https: true,
    },
  };

  // 请修改日志路径
  exports.logger = {
    dir: appInfo.root + '/logs/' + appInfo.name,
  };

  // exports.view = {
  //   defaultViewEngine: 'nunjucks',
  // };

  // 请修改数据库配置
  config.sequelize = {
    dialect: 'mysql',
    hostname: '',
    host: '',
    port: 3306,
    database: '',
    username: '',
    // 密码
    password: '',
    dialectOptions: {
      multipleStatements: true,
    },
  };

  return config;
};
