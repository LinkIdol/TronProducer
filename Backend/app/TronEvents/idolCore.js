const tronService = require("./tronService");

module.exports = {

    async listen(ctx) {
        let idolCore = ctx.app.config.contracts.idolCore;
        await tronService.listenEvent(idolCore, 'Transfer', this.Transfer, ctx);
        await tronService.listenEvent(idolCore, 'Pregnant', this.Pregnant, ctx);
        await tronService.listenEvent(idolCore, 'Birth', this.Birth, ctx);
    },

    //转账
    async Transfer(events, ctx) {
        await ctx.service.idolService.Transfer(events);
    },

    //怀孕
    async Pregnant(events, ctx) {
        await ctx.service.idolService.Pregnant(events);
    },

    //出生
    async Birth(events, ctx) {
        // let event = {};
        // event.transaction = "1";
        // event.block = 2;
        // event.contract = '3';
        // event.name = '4';
        // event.timestamp = 5;
        // event.result = {};
        // event.result.owner = "0x5a54f012297ae49551e59f95bff16862f85a9803";
        // event.result.kittyId = '13';
        // event.result.matronId = "6";
        // event.result.sireId = "5";
        // let events = [];
        // events.push(event);

        await ctx.service.idolService.Birth(events);
    }
}