<template>
    <div>
        <div class="line">
            <img src="@/assets/line1@2x.png" alt="" style="width: 100%">
        </div>
        <div class="fixed-width logoDiv cryptoTab">
            <router-link to="/">
                <img src="@/assets/CryptoGirls@2x.png" class="logo-icon">
            </router-link>
            <div style="display: flex;">
                <el-menu
                        :default-active="currentPage"
                        mode="horizontal"
                        background-color="#191428"
                        text-color="#BDBDBD"
                        select="loginSelect"
                        router
                        active-text-color="#ffffff">
                    <el-menu-item index="market" route="/market">
                        {{$t('market')}}
                    </el-menu-item>
                    <!--<el-menu-item index="register" route="/register" v-if="!isInjected">
                        {{$t('register')}}
                    </el-menu-item>-->
                    <el-menu-item index="user" route="/user" v-if="isInjected">
                        <font-awesome-icon :icon="['fas', 'user-circle']" size="lg"/>
                    </el-menu-item>
                </el-menu>
                <div v-if="!isInjected" class="menuItem" @click="login">{{$t('login')}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        name: 'AppHeader',
        data() {
            return {
                currentPage: ''
            }
        },
        mounted() {
            let href = window.location.href;
            this.currentPage = href.substring(href.lastIndexOf('/') + 1, href.length);
        },
        methods: {
            async login() {
                if (!window.tronWeb) {
                    this.$notify({
                        type: 'info',
                        title: this.$t('tips'),
                        message: this.$t('wallet_plugin_first')
                    });
                } else {
                    if (!window.tronWeb.ready) {
                        this.$notify({
                            type: 'info',
                            title: this.$t('tips'),
                            message: this.$t('unlock_first')
                        });
                    } else {
                        this.$notify({
                            type: 'success',
                            title: this.$t('tips'),
                            message: this.$t('login_success')
                        });
                        this.$store.dispatch('registerTronWeb');
                    }
                }
            },
            register() {
                this.API.register({
                    address: 'TVjmtiAVdbox9LYtZ7eu8Bq7mHJFZCZ3dg',
                    name: 'chenhao',
                    sign: 'eff7d5dba32b4da32d9a67a519434d3f'
                }).then(res => {
                    console.log(res);
                })
            }
        },
        computed: {
            ...mapState({
                isInjected: state => state.tron.tron.isInjected,
                coinbase: state => state.tron.tron.coinbase,
                balance: state => state.tron.tron.balance
            })
        },
        watch: {
            '$router'(val) {
                console.log(val)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .avatar {
        color: rgb(189, 189, 189);
        display: inline-block;
        height: 50px;
        line-height: 50px;
        cursor: pointer;
        padding: 0 8px;
    }
    .avatar:hover {
        color: #fff;
    }
    .menuItem {
        display: inline-block;
        height: 50px!important;
        line-height: 50px!important;
        padding: 0 8px;
        font-size: 15px;
        color: rgb(189, 189, 189);
        border-bottom: 2px solid transparent;
        box-sizing: border-box;
        cursor: pointer;
    }
    .menuItem:hover {
        background-color: #141020;
    }
    .page-header {
        position: relative;
        width: $innerWidth;
        margin: 0 auto;
    }
    .line {
        position: absolute;
        bottom: 9px;
        right: 0;
        width: 220px;
        z-index: 2;
    }
    .logo-icon {
        width: 180px;
    }
    .logoDiv {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
        margin-top: 20px;
    }

    .myTab {
        height: 100%;
        display: flex;
        align-items: center;
    }
    a {
        text-decoration: none!important;
    }
</style>
<style>
    .cryptoTab .el-menu-item {
        padding: 0 8px;
        font-size: 15px;
    }
    .el-menu.el-menu--horizontal {
        border-bottom: none!important;
    }
    .el-menu-item.is-active {
        border-bottom-color: #656DF0!important;
    }
    .el-menu--horizontal>.el-menu-item {
        height: 50px!important;
        line-height: 50px!important;
    }
</style>
