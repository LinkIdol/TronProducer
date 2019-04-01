const tronEvents = require('../TronEvents');
module.exports = {
  schedule: {
    interval: '60s', // 1 分钟间隔
    type: 'worker', // all 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    await tronEvents.listen(ctx);

    // await ctx.service.tronwebService.listen();
  },
};
