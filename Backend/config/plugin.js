'use strict';

// had enabled by egg
// exports.static = true;
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize'
};

exports.cors = {
  enable: true,
  package: 'egg-cors'
};	

// exports.nunjucks = {
//   enable: true,
//   package: 'egg-view-nunjucks',
// };

//框架安全机制，测试阶段暂时停用
exports.security = {
  enable: false,
  xframe: {
    enable: false,
  },
};