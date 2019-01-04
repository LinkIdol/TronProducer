const tronService = require("./tronService");

module.exports = {

    async listen(ctx) {
        let saleAuction = ctx.app.config.contracts.saleAuction;
        await tronService.listenEvent(saleAuction, 'AuctionCreated', this.AuctionCreated, ctx);
        await tronService.listenEvent(saleAuction, 'AuctionSuccessful', this.AuctionSuccessful, ctx);
        await tronService.listenEvent(saleAuction, 'AuctionCancelled', this.AuctionCancelled, ctx);
    },

    //拍卖创建
    async AuctionCreated(events, ctx) {
        await ctx.service.idolService.AuctionCreated(events, 1);
    },

    //拍卖成功
    async AuctionSuccessful(events, ctx) {
        await ctx.service.idolService.AuctionSuccessful(events, 1);
    },

    //拍卖取消
    async AuctionCancelled(events, ctx) {
        await ctx.service.idolService.AuctionCancelled(events, 1);
    }
}