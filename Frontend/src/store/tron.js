import API from '@/api'
import util from '@/util/util'
import { Loading, Notification  } from 'element-ui';
import i18n from '@/i18n';
const tron = {
    state: {
        tron: {
            isInjected: false,
            tronWebInstance: null,
            coinbase: null,
            balance: null
        }
    },
    mutations: {
        registerTronWebInstance (state, payload) {
            console.log('registerTronWebinstance Mutation being executed', payload)
            let result = payload
            let copy = state.tron
            copy.coinbase = result.coinbase
            copy.balance = parseInt(result.balance, 10)
            copy.isInjected = result.injectedTronWeb
            copy.tronWebInstance = result.tronWeb
            state.tron = copy
        },
        updateState(state, data) {
            state = {...state, data}
        },
        pollTronWebInstance (state, payload) {
            console.log('pollTronWebInstance mutation being executed', payload)
            state.tron.coinbase = payload.coinbase
            state.tron.balance = parseInt(payload.balance, 10)
        },
    },
    actions: {
        async registerTronWeb ({commit}) {
            let loadingInstance = Loading.service({
                lock: true,
                text: 'The wallet detection...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            let tronWeb = window.tronWeb;
            let result = {
                injectedTronWeb: tronWeb.ready,
                coinbase: tronWeb.defaultAddress.base58,
                balance: null,
                tronWeb
            };
            /*let timestamp = Math.round(new Date().getTime() / 1000);
            let address = tronWeb.defaultAddress.base58;
            let signMessage = "address=" + address + "&timestamp=" + timestamp;

            let hexStr = tronWeb.toHex(signMessage);
            console.log(timestamp, address, hexStr);
            tronWeb.trx.sign(hexStr).then(res => {
                console.log(res);
            });*/
            await API.login({
                address: result.coinbase
            }).then(res => {
                loadingInstance.close();
                Notification({
                    type: 'success',
                    title: i18n.t('tips'),
                    message: i18n.t('login_success')
                });
                if (res.code === 0) {
                    util.setCookie('access_token', res.data.access_token);
                    localStorage.setItem('Authorization', 'Bearer ' + res.data.access_token)
                }
            });
            result.balance = await tronWeb.trx.getBalance(result.coinbase);
            commit('registerTronWebInstance', result);
        },
        pollTronWeb ({commit}, payload) {
            console.log('pollTronWeb action being executed')
            commit('pollTronWebInstance', payload)
        },
    },
    getters: {}
}
export default tron
