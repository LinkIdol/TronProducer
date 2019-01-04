<template>
    <div class="idol">
        <div class="card-body" @click="toDetail">
            <div class="heart-icon-container" @click.stop v-if="canFav">
                <font-awesome-icon :icon="['far', 'heart']" v-if="idol.IsLike === 0" @click.stop="like"/>
                <font-awesome-icon :icon="['fas', 'heart']" v-if="idol.IsLike === 1" @click.stop="unlike"/>
            </div>
            <div class="body-top">
                <span>{{idol.NickName}}</span>
            </div>
            <div class="image-inner">
                <img :src="CONFIG.IMG_SERVER + idol.Pic" class="avatar-img">
            </div>
            <div class="body-middle">
                <span>{{$t('num_gen', {num:idol.Generation})}} · R</span>
            </div>
            <div class="body-bottom">
                <span>#{{idol.TokenId}}</span>
            </div>
        </div>
        <div class="buy" @click="buy" v-if="canBuy">
            <span>{{$t('buy')}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Card',
        props: {
            idol: {
                type: Object,
                default: function () {
                    return {
                        Bio:"1",
                        BirthTime:0,
                        Cooldown:0,
                        Generation:2,
                        Genes:"0",
                        MatronId:0,
                        NickName:"1",
                        Pic:"/idol/00a1f298bbe0.jpg",
                        SireId:0,
                        TokenId:2,
                        UserId:1
                    }
                }
            },
            canBuy: {
                type: Boolean,
                default: false
            },
            canFav: {
                type: Boolean,
                default: true,
            }
        },
        data() {
            return {
            }
        },
        mounted() {
        },
        methods: {
            toDetail() {
                this.$router.push({
                    path: `/card/${this.idol.TokenId}`
                })
            },
            like() {
                this.API.like({tokenId: this.idol.TokenId}).then(res => {
                    if (res.code === 0) {
                        console.log(res);
                        this.idol.IsLike = 1;
                    } else {
                        this.$notify({
                            type: 'error',
                            title: this.$t('tips'),
                            message: this.$t('like_failure'),
                            duration: 2000
                        });
                    }
                })
            },
            unlike() {
                this.API.unlike({tokenId: this.idol.TokenId}).then(res => {
                    if (res.code === 0) {
                        console.log(res);
                        this.idol.IsLike = 0;
                    }
                })
            },
            async buy() {
                /*this.API.buyIdol('1', '0.001').then((res) => {
                    console.log(res);
                })*/
                /*this.$store.state.web3.contractInstance().bid('2', {
                    gas: 300000,
                    value: this.$store.state.web3.web3.web3Instance().toWei('0.001', 'ether'),
                    from: this.$store.state.web3.web3.coinbase
                }, (err, result) => {
                    console.log(err, result);
                })*/
            }
        }
    }
</script>

<style lang="scss" scoped>
    $border-color: #656DF2;
    $width: 150px;
    .idol {
        position: relative;
        font-size: 14px;
        color: #fff;
    }

    .heart-icon-container {
        padding: 6px 25px 6px 15px;
        position: absolute;
        top: -4px;
        left: -4px;
        z-index: 2;
        background: linear-gradient(-45deg, transparent 10px, $border-color 0);
    }
    .body-top {
        height: 16px;
        background-color: #404040;
        font-size: 12px;
        text-align: right;
        padding: 4px 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
    }

    .body-bottom {
        padding: 2px 10px;
        color: #fff;
        line-height: 20px;
        height: 20px;
    }

    .body-middle {
        padding: 2px 10px;
        background: linear-gradient(-45deg, transparent 15px, $border-color 0);
        line-height: 20px;
        height: 20px;
    }

    .card-body {
        border: 2px solid $border-color;
        cursor: pointer;
    }
    .card-body:hover {
        box-shadow: 0 0 4px $border-color;
    }

    .buy {
        background-color: #0C071D;
        text-align: center;
        line-height: 24px;
        font-size: 14px;
        padding: 2px 0;
        width: $width;
        color: #fff;
        border: 2px solid $border-color;
        margin-top: 10px;
        cursor: pointer;
    }
    .buy:hover {
        box-shadow: 0 0 10px $border-color;
    }

    .image-inner {
        height: $width;
        width: $width;
        position: relative;
    }

    .avatar-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: auto;
        z-index: 1;
        transition-duration: .3s;
        transition-property: all;
        transition-timing-function: ease-out;
        transform: translateZ(0);
    }
</style>
