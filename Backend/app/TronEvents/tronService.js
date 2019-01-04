'use strict';

const RecordLastTimestamp = require("../../tron/RecordLastTimestamp");
const TronWeb = require('tronweb');
//const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = 'https://api.trongrid.io';
const solidityNode = 'https://api.trongrid.io';
const eventServer = 'https://api.trongrid.io/';
const privateKey = 'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0';

const kittyCore = require('./KittyCore.json');
const saleAuction = require('./SaleClockAuction.json');
const siringAuction = require('./SiringClockAuction.json');
const EventBus = require('./eventBus');

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    privateKey
);

module.exports = {

    //初始化数据
    async initData(ctx) {
        let total = await this.getTotalSupply();
        for (let i = 1; i <= total; i++) {
            let idol = await this.getIdol(i);
            let address = await this.ownerOf(i);
            await ctx.service.idolService.update(i, idol, address);
        }
    },

    //监听idol更新事件
    async listenIdolUpdate() {
        EventBus.eventEmitter.on("idol_update", async (tokenId, ctx) => {
            //更新Idol
            console.log("listen event waiting_update tokenId = " + tokenId);
            let idol = await this.getIdol(tokenId);
            let address = await this.ownerOf(tokenId);
            await ctx.service.idolService.update(tokenId, idol, address);
        });
    },

    async getBalance() {
        const address = 'TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY';
        const balance = await tronWeb.trx.getBalance(address);
        // await tronWeb.trx.getBalance(address, (err, balance)=>{
        //     if (err)
        //         return console.error(err);
        //     console.log(balance);
        // });
        //console.log({balance});
    },

    //客户端签名
    async signMessage(message) {
        let hexStr = this.strToHex(message);
        let sign = await tronWeb.trx.signMessage(hexStr, privateKey);
        return sign;
    },

    //服务端验证签名
    async verifyMessage(message, sign, address) {
        return true;
        let hexStr = this.strToHex(message);
        let ret = false;
        await tronWeb.trx.verifyMessage(hexStr, sign, address, true, (err, res) => {
            if (!err)
                ret = true;
        });

        return ret;
    },

    async getCurrentBlock() {
        return await tronWeb.trx.getCurrentBlock();
    },

    async getCurrentBlockNumber() {
        let block = await tronWeb.trx.getCurrentBlock();
        return block.block_header.raw_data.number;
    },

    async ownerOf(tokenId) {
        let contract = await tronWeb.contract(kittyCore.abi, kittyCore.address);
        let result = await contract.ownerOf(tokenId).call();
        return tronWeb.address.fromHex(result.owner);
    },

    async getIdol(tokenId) {
        let contract = await tronWeb.contract(kittyCore.abi, kittyCore.address);
        let idol = await contract.getKitty(tokenId).call();
        return idol;
    },

    async getTotalSupply() {
        let contract = await tronWeb.contract(kittyCore.abi, kittyCore.address);
        let total = await contract.totalSupply().call();
        return parseInt(total);
    },

    async getSaleAuction(tokenId) {
        let contract = await tronWeb.contract(saleAuction.abi, saleAuction.address);
        let auction = await contract.getAuction(tokenId).call();
        return auction;
    },

    async getSiringAuction(tokenId) {
        let contract = await tronWeb.contract(siringAuction.abi, siringAuction.address);
        let auction = await contract.getAuction(tokenId).call();
        return auction;
    },

    async bid(tokenId) {
        let contract = await tronWeb.contract(saleAuction.abi, saleAuction.address);
        let auction = await contract.bid(tokenId).send({
            callValue: 11,
            shouldPollResponse: false
        });
        return auction;
    },

    async listenEvent(contract, eventName, dataPromise, ctx) {
        //获取上次监听的时间戳
        let lastTimestamp = await RecordLastTimestamp.read(contract, eventName);

        //查询事件
        await tronWeb.getEventResult(contract, lastTimestamp, eventName, false, 100, 1, async (err, events) => {
            if (err) {
                if (err.message != undefined)
                    return ctx.logger.error("contract: %j, eventName: %j, error: %j", contract, eventName, err.message);
                else
                    return ctx.logger.error("contract: %j, eventName: %j, error: %j", contract, eventName, "The page you are looking for is temporarily unavailable.  Please try again later.");
            }

            if (events && events.length > 0) {
                ctx.logger.info("监听到事件：contract: %j, eventName: %j, events: %j", contract, eventName, events);

                //保存数据
                await dataPromise(events, ctx);
                //更新本次监听的时间戳，第0个是最新的
                await RecordLastTimestamp.record(contract, eventName, (events[0].timestamp + 1).toString());
            }
        });
    },


    listenEventTest() {
        tronWeb.getEventResult('TSU62dQsgRML8J7sYim18QJD6L56UA7KmT', 0, 'Transfer', false, 10, 1, (err, events) => {
            if (err)
                return console.error(err);

            console.group('Event result');
            console.log('Contract Address: TSU62dQsgRML8J7sYim18QJD6L56UA7KmT');
            console.log('Event Name: Transfer');
            console.log('Block Number: false');
            console.log('- Events:\n' + JSON.stringify(events, null, 2), '\n');
            console.groupEnd();
        });

        tronWeb.getEventResult('TW63ChA2TFUrX7D9zpYuNa7pPb2RLXFGBZ', 0, 'DivideStep', false, 1000, 1, (err, events) => {
            if (err)
                return console.error(err);

            console.group('Event result');
            console.log('Contract Address: TW63ChA2TFUrX7D9zpYuNa7pPb2RLXFGBZ');
            console.log('Event Name: DivideStep');
            console.log('Block Number: false');
            console.log('- Events:\n' + JSON.stringify(events, null, 2), '\n');
            console.groupEnd();
        });

        // await tronWeb.getEventByTransactionID('2fb0c22a94ac4371303d8639d5b837232f38fb23f1a4bd2e09d2e242b7301656', (err, events) => {
        //     if(err)
        //         return console.error(err);

        //     console.group('Specific event result');
        //         console.log('Transaction: 2fb0c22a94ac4371303d8639d5b837232f38fb23f1a4bd2e09d2e242b7301656');
        //         console.log('- Events:\n' + JSON.stringify(events, null, 2), '\n');
        //     console.groupEnd();
        // });
    },

    toHex(str) {
        return tronWeb.address.toHex(str);
    },

    strToHex(str) {
        if (str === "")
            return "";
        var hexCharCode = [];
        hexCharCode.push("0x");
        for (var i = 0; i < str.length; i++) {
            hexCharCode.push((str.charCodeAt(i)).toString(16));
        }
        return hexCharCode.join("");
    }
}