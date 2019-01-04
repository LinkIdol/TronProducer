let tronService = require("../TronEvents/tronService");
module.exports = {
    schedule: {
        interval: '120s', // 1 分钟间隔
        type: 'all', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        await tronService.initData(ctx);

        let idols = await ctx.service.idolService.getAuctionIdols();
        await idols.forEach(async idol => {
            if (idol.UserId == 27) //拍卖合约
            {
                let auction = await tronService.getSaleAuction(idol.TokenId);
                await ctx.service.idolService.updateAuction(idol.TokenId, auction, 1);
            }
            else { //租赁合约
                let auction = await tronService.getSiringAuction(idol.TokenId);
                await this.service.idolService.updateAuction(idol.TokenId, auction, 2);
            }
        });
    },
};