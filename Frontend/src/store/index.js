import Vue from 'vue'
import Vuex from 'vuex'
import tron from './tron'
import web3 from './web3'

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        tron,
        web3
    }
})
