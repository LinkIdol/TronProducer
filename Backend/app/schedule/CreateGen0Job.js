let tronService = require("../TronEvents/tronService");
module.exports = {
    schedule: {
         type: 'worker',
         cron: '0 0 */6 * * *',  //每6小时一次
        // interval: '60s', // 1 分钟间隔
        // type: 'worker', // all 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        //await tronService.createGen0Auction(ctx);
    },
};