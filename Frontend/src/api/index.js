import axios from 'axios'
import config from './config'
import SaleClockAuction from '../util/json/SaleClockAuction.json'
import KittyCore from '../util/json/KittyCore.json'
import SiringClockAuction from '../util/json/SiringClockAuction.json'
//axios.defaults.withCredentials = true;
const instance = axios.create({
    baseURL: config.BASE_URL
});
/*const SaleClockAuctionContract = window.web3 ? window.web3.eth.contract(SaleClockAuction.abi).at(SaleClockAuction.address) : {};
const KittyCoreContract = window.web3 ? window.web3.eth.contract(KittyCore.abi).at(KittyCore.address) : {};*/


/*const tronWeb_SaleClockAuctionContract = window.tronWeb ? window.tronWeb.contract(SaleClockAuction.abi, config.TronWeb_SaleClockAuction) : {};
const tronWeb_KittyCoreContract = window.tronWeb ? window.tronWeb.contract(KittyCore.abi, config.TronWeb_KittyCore) : {};*/

// api Interface document : https://github.com/cnchenhao/idol-server/blob/master/specification.md
export default {
    /* {
    "address":"TVjmtiAVdbox9LYtZ7eu8Bq7mHJFZCZ3dg",
    "name":"chenhao",
    "sign":"eff7d5dba32b4da32d9a67a519434d3f"
    }*/
    register(data) {
        return instance.request({
            url:'/user/register',
            method: 'post',
            withCredentials: true,
            data
        }).then(function (response) {
            return response.data;
        })
    },
    /*{
    "address":"TVjmtiAVdbox9LYtZ7eu8Bq7mHJFZCZ3dg",
    "sign":"ab56b4d92b40713acc5af89985d4b786"
    }*/
    async login(data) {
        return await instance.request({
            url:'/user/login',
            method: 'post',
            withCredentials: true,
            data
        }).then(function (response) {
            return response.data;
        })
    },
    /* ?page=1&pageSize=2&category=forsale&hairColors=blonde,brown,black,blue&eyeColors=brown,black&hairStyles=long hair,short hair&attributes=hasname,hasbio,cooldownready,dark skin,blush,smile,open mouth,hat,ribbon,glasses&filters=iteration:1~2,cooldown:ur|ssr|sr|r|n,price:1~2&sort=-id
    */
    getMarketIdols(params) {
        return instance.request({
            url:'/idol/getMarketIdols',
            method: 'get',
            withCredentials: true,
            params
        }).then(function (response) {
            return response.data;
        })
    },
    getMyIdols(params) {
        return instance.request({
            url:'/idol/getMyIdols',
            method: 'get',
            withCredentials: true,
            params
        }).then(function (response) {
            return response.data;
        })
    },
    /* detail
    * request data: ?tokenId=1
    * request header: Cookie:csrfToken=IHoPCGBkcxULU7tpQOXl2Zyr; locale=en-us; tron_Idol_1544608605980_4384=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjUsIkFkZHJlc3MiOiJhZHNmZHNmZHNmZHMxMWRmc2RzZmEiLCJpYXQiOjE1NDUyODY2NzEsImV4cCI6MTU0NTM3MzA3MX0.cPKzSnTw96zoQFAldR1Vkma0HLG2nGgdgdpxjFgo1lY; undefined_1544608605980_4384.sig=Pqqz-SZgb5Fzm3jA7BvbZsRu016fWhPHtDhlvXW7SnI
    * */
    getIdol(params) {
        return instance.request({
            url:'/idol/getIdol',
            method: 'get',
            withCredentials: true,
            params
        }).then(function (response) {
            return response.data;
        })
    },
    /*
    * request data: "tokenId":1
    * request header: Cookie
    * */
    like(data) {
        return instance.request({
            url:'/idol/like',
            method: 'post',
            withCredentials: true,
            data
        }).then(function (response) {
            return response.data;
        })
    },
    /*
    * request data: "tokenId":1
    * request header: Cookie
    * */
    unlike(data) {
        return instance.request({
            url:'/idol/unlike',
            method: 'post',
            withCredentials: true,
            data
        }).then(function (response) {
            return response.data;
        })
    },
    /*
    * set idol name
    * request data: {
    *   "tokenId":1,
    *   "name":"chenhao"
    * }
    * request header: Cookie
    * */
    async setName(data) {
        return await instance.request({
            url:'/idol/setName',
            method: 'post',
            withCredentials: true,
            data
        }).then(function (response) {
            return response.data;
        })
    },
    /*
    * request data: {
    *     "tokenId":1,
    *     "bio":"chenhao test"
    * }
    * request header: Cookie
    * */
    async setBio(data) {
        return await instance.request({
            url:'/idol/setBio',
            method: 'post',
            withCredentials: true,
            data
        }).then(function (response) {
            return response.data;
        })
    },
    buyIdol(id, price) {
        return window.tronWeb.contract(SaleClockAuction.abi, config.TronWeb_SaleClockAuction).bid(id).send({
            callValue: price,
            shouldPollResponse: false
        });
        /*return new Promise((resolve, reject) => {
            SaleClockAuctionContract.bid(id, {
                    value: price, // web3.toWei(Number(price), 'ether'),
                    gas: 300000
                },
                (err, result) => (err ? reject(err) : resolve(result)));
        });*/
    },
    saleIdol(id, startPrice, endPrice, duration) {
        return window.tronWeb.contract(KittyCore.abi, config.TronWeb_KittyCore).createSaleAuction(id, startPrice, endPrice, duration).send({
            callValue: 0,
            shouldPollResponse: false
        });
        /*return new Promise((resolve, reject) => {
            KittyCoreContract.createSaleAuction(id, startPrice, endPrice, duration, {
                    gas: 300000
                },
                (err, result) => (err ? reject(err) : resolve(result)));
        });*/
    },
    giftIdol(toAddress, id) {
        return window.tronWeb.contract(KittyCore.abi, config.TronWeb_KittyCore).transfer(toAddress, id).send({
            callValue: 0,
            shouldPollResponse: false
        });
        /*return new Promise((resolve, reject) => {
            KittyCoreContract.transfer(toAddress, id, {
                    gas: 300000
                },
                (err, result) => (err ? reject(err) : resolve(result)));
        });*/
    },
    breedIdol(matronId, sireId) {
        return window.tronWeb.contract(KittyCore.abi, config.TronWeb_KittyCore).breedWithAuto(matronId, sireId).send({
            callValue: 0,
            shouldPollResponse: false
        });
    },
    getIdolPrice(id) {
        return window.tronWeb.contract(SiringClockAuction.abi, config.TronWeb_SiringClockAuction).getCurrentPrice(id).call();
    },
    giveBirth(matronId) {
        return window.tronWeb.contract(KittyCore.abi, config.TronWeb_KittyCore).giveBirth(matronId).send({
            callValue: 0,
            shouldPollResponse: false
        });
    },
    // 创建出租
    createSiringAuction(id, startingPrice, endingPrice, duration) {
        return window.tronWeb.contract(KittyCore.abi, config.TronWeb_KittyCore).createSiringAuction(id, startingPrice, endingPrice, duration).send({
            callValue: 0,
            shouldPollResponse: false
        });
    },
    // 取消出租
    cancelAuction(id) {
        return window.tronWeb.contract(SiringClockAuction.abi, config.TronWeb_SiringClockAuction).cancelAuction(2).send({
            callValue: 0,
            shouldPollResponse: false
        });
    },
    // 和租出的繁殖
    bidOnSiringAuction(sireId, matronId, price) {
        return window.tronWeb.contract(KittyCore.abi, config.TronWeb_KittyCore).bidOnSiringAuction(sireId, matronId).send({
            callValue: price,
            shouldPollResponse: false
        });
    },
}