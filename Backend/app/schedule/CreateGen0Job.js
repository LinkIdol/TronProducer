let tronService = require("../TronEvents/tronService");
module.exports = {
    schedule: {
         type: 'worker',
         cron: '0 42 */1 * * *',
        //interval: '30s', // 1 分钟间隔
        //type: 'all', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        //await tronService.createGen0Auction();
    },
};