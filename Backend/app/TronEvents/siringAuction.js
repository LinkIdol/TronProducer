const tronService = require("./tronService");

module.exports = {

    async listen(ctx) {
        let siringAuction = ctx.app.config.contracts.siringAuction;
        await tronService.listenEvent(siringAuction, 'AuctionCreated', this.AuctionCreated, ctx);
        await tronService.listenEvent(siringAuction, 'AuctionSuccessful', this.AuctionSuccessful, ctx);
        await tronService.listenEvent(siringAuction, 'AuctionCancelled', this.AuctionCancelled, ctx);
    },

    //拍卖创建
    async AuctionCreated(events, ctx) {
        await ctx.service.idolService.AuctionCreated(events, 2);
    },

    //拍卖成功
    async AuctionSuccessful(events, ctx) {
        await ctx.service.idolService.AuctionSuccessful(events, 2);
    },

    //拍卖取消
    async AuctionCancelled(events, ctx) {
        await ctx.service.idolService.AuctionCancelled(events, 2);
    }
}