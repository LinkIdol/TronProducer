import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/home',
            redirect: '/'
        },
        {
            path: '/',
            name: 'home',
            component: () => import(/* webpackChunkName: "market" */ './views/Home.vue')
        },
        {
            path: '/market',
            name: 'market',
            component: () => import(/* webpackChunkName: "market" */ './views/Market.vue')
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        },
        {
            path: '/card/:id',
            name: 'card',
            component: () => import(/* webpackChunkName: "card" */ './views/CardDetail.vue')
        },
        {
            path: '/user',
            name: 'user',
            component: () => import(/* webpackChunkName: "user" */ './views/User.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import(/* webpackChunkName: "register" */ './views/Register.vue')
        },
        {
            path: '/whitepaper',
            name: 'whitepaper',
            component: () => import(/* webpackChunkName: "register" */ './views/WhitePaper.vue')
        }
    ]
})
