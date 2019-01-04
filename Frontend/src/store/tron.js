import API from '@/api'
import util from '@/util/util'
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
            console.log('registerTronWeb Action being executed')
            let tronWeb = window.tronWeb;
            let result = {
                injectedTronWeb: tronWeb.ready,
                coinbase: tronWeb.defaultAddress.base58,
                balance: null,
                tronWeb
            };
            await API.login({
                address: result.coinbase
            }).then(res => {
                if (res.code === 0) {
                    util.setCookie('access_token', res.data.access_token);
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