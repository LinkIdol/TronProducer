import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './plugins/element.js'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faHeart, faFilter, faBars, faUserCircle} from '@fortawesome/free-solid-svg-icons'
import {faHeart as farHeart, faCopy, faEdit} from '@fortawesome/free-regular-svg-icons'
import {faWeibo, faWeixin, faFacebookF, faTwitter} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import config from '@/api/config'
import util from '@/util/util'
import API from '@/api'
import i18n from '@/i18n';
import AButton from './components/a-button'
import { Loading } from 'element-ui';

library.add(faHeart, farHeart, faFilter, faBars, faUserCircle, faCopy, faEdit, faWeibo, faWeixin, faFacebookF, faTwitter)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('a-button', AButton)

Vue.config.productionTip = false

Vue.prototype.CONFIG = config;
Vue.prototype.util = util;
Vue.prototype.API = API;

const app = new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
});

let loadingInstance = Loading.service({
    lock: true,
    text: 'In the TronPay wallet detection, please install first',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
})
const waitForGlobal = async () => {
    if (window.tronWeb) {
        const nodes = await window.tronWeb.isConnected();
        console.log(nodes);
        const connected = !Object.entries(nodes).map(([key, value]) => {
            if (!value) {
                console.error(`Error: ${key} is not connected`)
            }
            return value
        }).includes(false)
        if (connected) {
            loadingInstance.close();
            app.$mount('#app')
            await store.dispatch('registerTronWeb')
        } else {
            console.error('Error: TRON node is not connected')
            console.error('wait for tronLink')
            setTimeout(async () => {
                await waitForGlobal()
            }, 100)
        }
    } else {
        console.error('wait for tronLink')
        setTimeout(async () => {
            await waitForGlobal()
        }, 100)
    }
}

waitForGlobal().then()
