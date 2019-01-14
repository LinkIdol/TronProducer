// 错误码统一编码，提示信息多语言
module.exports = {

  success: 0,
  failure: 1,
  accessDenied: 2,

  registerError: 10000,
  addressNotFound: 10001,
  notLogin: 10002,
  parameterError: 10003,
  signError: 10004,
  userUpdateError: 10005,
  userNotFound: 10006,

  idolNotFound: 20001,
  idolUpdateDenied: 20002,
  idolUpdateFailure: 20003,

  returnObj(lang) {

    en = {
      lang: 'en',
      success: { code: this.success, message: 'success' },
      failure: { code: this.failure, message: 'failure' },
      accessDenied: { code: this.accessDenied, message: 'access denied' },

      registerError: { code: this.registerError, message: 'register error' },
      addressNotFound: { code: this.addressNotFound, message: 'address not found' },
      notLogin: { code: this.notLogin, message: "not login" },
      parameterError: { code: this.parameterError, message: "parameter error" },
      signError: { code: this.signError, message: "sign error" },
      userUpdateError: { code: this.userUpdateError, message: 'update user error' },
      userNotFound: { code: this.userNotFound, message: 'user not found' },

      idolNotFound: { code: this.idolNotFound, message: "idol not found" },
      idolUpdateDenied: { code: this.idolUpdateDenied, message: "no permission" },
      idolUpdateFailure: { code: this.idolUpdateFailure, message: "idol update failure" },
    };

    zh = {
      lang: 'zh',
      success: { code: this.success, message: '成功' },
      failure: { code: this.failure, message: '失败' },
      accessDenied: { code: this.accessDenied, message: '访问拒绝' },

      registerError: { code: this.registerError, message: '注册失败' },
      addressNotFound: { code: this.addressNotFound, message: '未注册' },
      notLogin: { code: this.notLogin, message: "未登录，请先登录" },
      parameterError: { code: this.parameterError, message: "参数错误" },
      signError: { code: this.signError, message: "签名错误" },
      userUpdateError: { code: this.userUpdateError, message: '修改用户错误' },
      userNotFound: { code: this.userNotFound, message: '找不到该用户' },

      idolNotFound: { code: this.idolNotFound, message: "找不到数据" },
      idolUpdateDenied: { code: this.idolUpdateDenied, message: "没有权限" },
      idolUpdateFailure: { code: this.idolUpdateFailure, message: "更新失败" },
    };

    let message;

    switch (lang) {
      case 'en':
        message = en;
        break;
      case 'zh':
      case 'zh-Hans':
        message = zh;
        break;
      default:
        message = zh;
        break;
    }

    return message;
  },

};
