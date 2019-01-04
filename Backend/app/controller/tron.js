
'use strict';
const message = require('../../config/message');
const tronService = require("../TronEvents/tronService");
const TronWeb = require('tronweb');
const Controller = require('egg').Controller;

class TronController extends Controller {

    async initIdol() {
        let msg = message.returnObj('zh');
        await tronService.initData(this.ctx);
        this.ctx.body = msg.success;
    }

    async initAuction() {
        let idols = await this.service.idolService.getAuctionIdols();
        await idols.forEach(async idol => {
            if (idol.UserId == 27) //拍卖合约
            {
                let auction = await tronService.getSaleAuction(idol.TokenId);
                await this.service.idolService.updateAuction(idol.TokenId, auction, 1);
            }
            else { //租赁合约
                let auction = await tronService.getSiringAuction(idol.TokenId);
                await this.service.idolService.updateAuction(idol.TokenId, auction, 2);
            }
        });

        let msg = message.returnObj('zh');
        this.ctx.body = msg.success;
    }

    async getSaleAuction() {
        const { tokenId } = this.ctx.request.body;
        let auction = await tronService.getSaleAuction(tokenId);
        this.ctx.body = auction;
    }

    async getIdol() {
        const { tokenId } = this.ctx.request.body;
        let idol = await tronService.getIdol(tokenId);
        this.ctx.body = idol;
    }

    async ownerOf() {
        const { tokenId } = this.ctx.request.body;
        let idol = await tronService.ownerOf(tokenId);
        this.ctx.body = idol;
    }

    async getTotalSupply() {
        let total = await tronService.getTotalSupply();
        this.ctx.body = total;
    }

    async Birth() {
        const { tokenId } = this.ctx.request.body;
        let idol = await tronService.getIdol(tokenId);
        let address = await tronService.ownerOf(tokenId);
        let event = {};
        event.transaction = "1-" + tokenId + "-" + idol.birthTime; //随机数
        event.block = 1;
        event.contract = this.config.contracts.idolCore;
        event.name = 'Birth';
        event.timestamp = TronWeb.toDecimal(idol.birthTime._hex);
        event.result = {};
        event.result.owner = tronService.toHex(address); //转化为十六进制
        event.result.kittyId = tokenId;
        event.result.matronId =TronWeb.toDecimal(idol.matronId._hex);
        event.result.sireId = TronWeb.toDecimal(idol.sireId._hex);
        let events = [];
        events.push(event);

        await this.ctx.service.idolService.Birth(events);
    }

    async trontest() {
        const tokenId = this.ctx.request.body.tokenId;
        let a = await tronService.ownerOf(1);
        let b = await tronService.getKitty(tokenId);

        let auction1 = await tronService.bid(tokenId);

        this.ctx.body = auction;
    }

}

module.exports = TronController;