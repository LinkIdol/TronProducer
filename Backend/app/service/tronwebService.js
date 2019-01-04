'use strict';
const Service = require('egg').Service;
const RecordLastTimestamp = require("../../tron/RecordLastTimestamp");
const TronWeb = require('tronweb');
//const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = 'https://api.trongrid.io';
const solidityNode = 'https://api.trongrid.io';
const eventServer = 'https://api.trongrid.io/';
const privateKey = 'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0';

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    privateKey
);

class TronwebService extends Service {

    async listen() {
        let idolCore = this.config.contracts.idolCore;
        await this.listenEvents(idolCore, 'Transfer', this.Transfer);
    };

    async listenEvents(contract, eventName, dataPromise) {
        //获取上次监听的时间戳
        let lastTimestamp = await RecordLastTimestamp.read(contract, eventName);
        //查询事件
        await tronWeb.getEventResult(contract, lastTimestamp, eventName, false, 100, 1, async (err, events) => {
            if (err)
                return console.error(err);

            await dataPromise("");

            if (events && events.length > 0) {
                //保存数据
                await dataPromise(events);
                //更新本次监听的时间戳，第0个是最新的
                await RecordLastTimestamp.record(contract, eventName, (events[0].timestamp + 1).toString());
            }
        });
    };


    //ERC721中事件
    //资产转移
    //修改owner
    async Transfer(events) {
        let a = 0;
    };
}

module.exports = TronwebService;