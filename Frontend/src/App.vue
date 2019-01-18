<template>
    <div id="app">
        <el-container>
            <el-header class="page-header" style="height: auto;">
                <AppHeader></AppHeader>
            </el-header>
            <router-view></router-view>
            <el-footer style="background-color: #0C071C;height: auto;">
                <AppFooter></AppFooter>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import AppHeader from './components/layout/AppHeader'
    import AppFooter from './components/layout/AppFooter'

    export default {
        name: 'app',
        components: {
            AppHeader,
            AppFooter
        },
        created() {
        },
        async mounted() {
            /*let loadingInstance = this.$loading({
                lock: true,
                text: 'In the TronPay wallet detection, please install first',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })*/
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
                        //loadingInstance.close();
                        await this.$store.dispatch('registerTronWeb')
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
            /*await new Promise(async resolve => {
                const tronWebState = {
                    installed: !!window.tronWeb,
                    loggedIn: window.tronWeb && window.tronWeb.ready
                };
                console.log(window.tronWeb);
                if (tronWebState.installed) {
                    await this.$store.dispatch('registerTronWeb')
                    return resolve();
                }
            })*/
            /*if (!window.tronWeb.ready) {
                this.$notify.info({
                    title: this.$t('tips'),
                    message: this.$t('unlock_first'),
                    duration: 0
                });
            }*/
        },
        methods: {
        }
    }
</script>

<style lang="scss">
    html, body {
        padding: 0;
        margin: 0;
        background-color: $bgColor;
        /*background-image: url("./assets/background.png");
        background-repeat: no-repeat;
        background-clip: content-box;*/
    }
    .page-header {
        position: relative;
        width: $innerWidth;
        margin: 0 auto;
    }
    .fixed-width {
        max-width: $fixedWidth;
        padding: 20px;
        width: 100%;
        margin: 0 auto;
    }
    a {
        color: #656DF2;
    }
    @media screen and (max-width: $mediaWidth) {
        .fixed-width {
            max-width: 100%;
            padding: 20px;
            width: 100%;
            margin: 0 auto;
            box-sizing: border-box;
        }
        .page-header {
            width: 100%;
        }
    }
</style>
