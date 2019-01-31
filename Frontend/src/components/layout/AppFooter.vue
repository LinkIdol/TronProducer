<template>
    <div>
        <div class="fixed-width myFooter">
            <div>
                <p><a href="https://discord.gg/mEFKYA9">Discord</a></p>
                <p><a href="https://twitter.com/link_idol_">Twitter</a></p>
                <p><a href="https://weibo.com/linkidol/">{{$t('weibo')}}</a></p>
                <p>
                    <el-popover placement="right" width="160" trigger="hover">
                        <img src="../../assets/qq-qrcode.jpg" alt="QQ QR code" style="width: 100%;">
                        <a slot="reference" style="cursor: pointer;">{{$t('qq_group')}}</a>
                    </el-popover>
                </p>
                <p>
                    <el-popover placement="right-start" width="160" trigger="hover">
                        <div>
                            <img src="../../assets/wx-qrcode.jpg" alt="WeChat QR code" style="width: 100%;">
                        </div>
                        <a slot="reference" style="cursor: pointer;">{{$t('wechat_id')}}</a>
                    </el-popover>
                </p>
            </div>
            <div>
                <p>
                    <router-link to="/market">{{$t('market')}}</router-link>
                </p>
                <p>
                    <router-link to="/market">{{$t('common_problem')}}</router-link>
                </p>
                <p>
                    <router-link to="/market">{{$t('tutorial')}}</router-link>
                </p>
            </div>
            <div>
                <p>
                    <router-link to="/about">{{$t('about')}}</router-link>
                </p>
                <p>
                    <router-link to="/whitepaper">{{$t('white_paper')}}</router-link>
                </p>
                <p>
                    <router-link to="/market">{{$t('privacy_policy')}}</router-link>
                </p>
            </div>
            <div class="langContainer">
                <el-select v-model="lang" :placeholder="$t('please_select')" @change="langChange">
                    <el-option
                            v-for="item in LangOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="langContainer mobile-lang">
            <el-select v-model="lang" :placeholder="$t('please_select')" @change="langChange">
                <el-option
                        v-for="item in LangOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div style="display: flex;align-items: center;justify-content: center;">
            <a class="partner" :title="$t('math_wallet')" target="_blank" href="http://www.mathwallet.org"><img style="height: 100%;" src="@/assets/partner/math.png" alt="math"></a>
            <a class="partner" :title="$t('vena_wallet')" target="_blank" href="https://pi.vena.app/"><img style="height: 100%;" src="@/assets/partner/venapi.png" alt="venapi"></a>
            <a class="partner" title="BiMoney" target="_blank" href="http://bimoney.io/index"><img style="height: 100%;" src="@/assets/partner/bimoney.png" alt="bimoney"></a>
            <a class="partner" title="Cobo" target="_blank" href="https://cobo.com/"><img style="height: 100%;" src="@/assets/partner/cobo.png" alt="cobo"></a>
        </div>
        <div class="copyRight">
            <span> Copyright © 2018 Tron Producer Team </span> <span class="dot-char">,</span> <span class="poweredBy">  Powered by <a href="https://snark.ai/">Snark AI</a> </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AppFooter',
        data() {
            return {
                LangOptions: [{
                    value: 'en',
                    label: 'English'
                }, {
                    value: 'zh',
                    label: '简体中文'
                }, /*{
                    value: 'zh_tw',
                    label: '繁體中文'
                }*/],
                lang: 'zh'
            }
        },
        mounted() {
            this.lang = this.util.getCookie('lang') || 'zh'
            this.$i18n.locale = this.util.getCookie('lang') || 'zh';
        },
        methods: {
            langChange(lang) {
                this.$i18n.locale = lang;
                this.util.setCookie('lang', lang);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .partner {
        height: 30px;
        position: relative;
        display: inline-block;
        margin: 10px;
    }
    .myFooter {
        display: flex;
        padding: 20px;
        flex-direction: row;
        justify-content: space-between;
        font-size: 14px;
        color: #BDBDBD;
    }

    .myFooter p {
        line-height: 14px;
    }

    .myFooter a {
        color: #BDBDBD;
    }

    .myFooter a:hover {
        color: #ffffff;
    }

    .copyRight {
        width: 1100px;
        text-align: center;
        margin: 0 auto;
        color: #BDBDBD;
        font-size: 14px;
        padding: 40px;
        border-top: 1px solid #191428;
    }

    .mobile-lang {
        display: none;
    }
    a {
        text-decoration: none;
    }
    @media screen and (max-width: $mediaWidth) {
        .partner {
            height: 25px;
        }
        .copyRight {
            width: 100%;
            box-sizing: border-box;
            padding: 20px 0;
        }
        .poweredBy {
            display: block;
        }
        .langContainer {
            display: none;
        }
        .mobile-lang {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: -20px;
            margin-bottom: 20px;
        }
        .dot-char {
            display: none;
        }
    }
</style>
<style lang="scss">
    .langContainer .el-input__inner {
        background-color: rgb(12, 7, 28) !important;
        color: #BDBDBD;
        border: none;
    }

    .langContainer .el-select {
        border-bottom: 1px solid #BDBDBD;
    }
</style>
