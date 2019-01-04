const tronService = require("./tronService");
const idolCore = require("./idolCore");
const saleAuction = require("./saleAuction");
const siringAuction = require("./siringAuction");
//require("./saleAuction");
//require("./siringAuction");

module.exports = {
    async listen(ctx) {
        //当前区块高度
        ctx.app.config.currentBlockNumber = await tronService.getCurrentBlockNumber();
        
        await idolCore.listen(ctx);
        await saleAuction.listen(ctx);
        await siringAuction.listen(ctx);
    }
}