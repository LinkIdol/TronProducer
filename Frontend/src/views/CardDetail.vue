<template>
    <div class="card" v-loading="loading" element-loading-background="rgba(25,20,40, 0.8)">
        <div v-if="hasIdol">
            <div class="fixed-width" style="display: flex;align-items: center;justify-content: space-between;">
                <!--<button class="idol-button">
                    <span>{{$t('edit')}}</span>
                </button>-->
                <div>
                    <a class="btn btn-plain" @click="showEditDialog" v-if="isOwner">
                        <font-awesome-icon :icon="['far', 'edit']" />
                        <span>{{$t('edit')}}</span>
                    </a>
                </div>
                <div>
                    <a class="btn btn-plain" @click="buyIdol" v-if="canBuy">
                        <span>{{$t('buy')}}</span>
                    </a>
                    <a class="btn btn-plain" @click="showSale=true" v-if="isOwner">
                        <span>{{$t('sell')}}</span>
                    </a>
                    <a class="btn btn-plain" @click="showGift=true" v-if="isOwner">
                        <span>{{$t('gift')}}</span>
                    </a>
                    <a class="btn btn-plain" @click="giveBirth" v-if="isPregnant && isReady">
                        <span>{{$t('giveBirth')}}</span>
                    </a>
                    <a class="btn btn-plain" @click="showRent = true" v-if="isForRental && isOwner">
                        <span>{{$t('rent')}}</span>
                    </a>
                    <a class="btn btn-plain" @click="cancelRent" v-if="isRental && isOwner">
                        <span>{{$t('cancel_rent')}}</span>
                    </a>
                    <a class="btn btn-plain" @click="showBreed = true" v-if="!isOwner && isRental">
                        <span>{{$t('breed')}}</span>
                    </a>
                </div>
            </div>
            <div class="detail fixed-width">
                <div class="detail-container">
                    <div class="detail-main">
                        <div style="margin-right: 40px;">
                            <div class="share" @click="showShare=true">
                                <span>{{$t('share')}}</span>
                            </div>
                        </div>
                        <!--<div class="detail-info">-->

                        <!--</div>-->
                        <div style="z-index: 2;display: flex;">
                            <div style="display: inline-block;margin-right: 16px;width: 256px;box-sizing: border-box;">
                                <div style="height: 47px;margin-bottom: 14px;display: flex;align-items: center;justify-content: center;">
                                    <span>{{idol.NickName}}</span>
                                </div>
                                <div style="height: 346px;display: flex;flex-direction: column;align-items: center;justify-content: center;">
                                    <div class="image-outer">
                                        <img :src="CONFIG.IMG_SERVER+idol.Pic" style="width: 100%;">
                                    </div>
                                    <div style="margin-top: 20px;">
                                        <span>{{$t('num_gen',{num: idol.Generation})}}#{{idol.TokenId}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="profileBox panel">
                                <div class="idolProfile">
                                    <div>
                                        <div>
                                            <span>{{$t('self_introduction')}}</span>
                                        </div>
                                        <div>
                                            <p>{{idol.Bio || $t('no_data')}}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <span>{{$t('label')}}</span>
                                        </div>
                                        <div style="display: flex;flex-wrap: wrap;align-items: flex-start;">
                                            <span class="labelContent" v-for="(item, i) in labels" :key="i">{{item}}</span>
                                            <span v-if="labels.length <= 0">{{$t('no_label')}}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <span>{{$t('attribute')}}</span>
                                        </div>
                                        <div style="display: flex;flex-wrap: wrap;align-items: flex-start;">
                                            <span class="labelContent" v-for="(item, i) in attributes" :key="i">{{$t(item)}}</span>
                                            <span class="labelContent">{{$t(idol.HairColor)}} {{$t('hair')}}</span>
                                            <span class="labelContent">{{$t(idol.HairStyle)}} {{$t('hair')}}</span>
                                            <span class="labelContent">{{$t(idol.EyeColor)}} {{$t('eye')}}</span>
                                        </div>
                                    </div>
                                    <div :class="{'dn': !canBuy}">
                                        <div style="margin-bottom: 10px;">
                                            <span>{{$t('price')}}</span>
                                        </div>
                                        <div style="display: flex;align-items: center;justify-content: flex-start;">
                                            <div id="price-chart" style="width: 150px;height: 50px;"></div>
                                            <div style="margin-left: 20px;"><span>{{$t('current')}}:</span><span>{{currentPrice}} TRX</span></div>
                                        </div>
                                        <!--<canvas id="price-chart" width="250" height="100"></canvas>-->
                                    </div>
                                    <div style="display: flex;">
                                        <!--<div style="margin-right: 10px;">
                                            <div>{{$t('coding')}}</div>
                                            <div>...</div>
                                        </div>-->
                                        <div>
                                            <div>{{$t('cooling_state')}}</div>
                                            <div>{{cooldown}}</div>
                                        </div>
                                        <div style="margin-left: 20px;">
                                            <div>{{$t('other_state')}}</div>
                                            <div>{{otherState}}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <font-awesome-icon style="cursor: pointer;" :icon="['far', 'heart']" v-if="idol.IsLike === 0" @click="like"/>
                                        <font-awesome-icon style="cursor: pointer;" :icon="['fas', 'heart']" v-if="idol.IsLike === 1" @click="unlike"/>
                                        <span style="margin-left: 10px;">{{idol.LikeCount}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="detail-bg">
                            <img src="../assets/detail-bg.png" alt="">
                        </div>
                    </div>
                    <div class="line">
                        <img src="../assets/detail-bg2.png" alt="">
                        <p class="owner">{{$t('owner')}}：{{idol.UserName || idol.Address}}</p>
                    </div>
                </div>
            </div>
            <el-dialog :title="$t('share')+'idol'" :visible.sync="showShare" width="400px" class="shareDialog">
                <div style="padding-bottom: 10px;border-bottom: 1px solid #ccc;">
                    <input type="text" class="copyInput" :value="currentHref" readonly="readonly">
                    <font-awesome-icon size="lg" class="copyIcon" :icon="['far', 'copy']" @click="copyText"/>
                </div>
                <div style="margin-top: 20px;">
                    <el-button type="danger" size="mini" @click="share('weibo')"><font-awesome-icon size="lg" :icon="['fab', 'weibo']" /></el-button>
                    <el-button type="success" size="mini" @click="share('wechat')"><font-awesome-icon size="lg" :icon="['fab', 'weixin']" /></el-button>
                    <el-button type="warning" size="mini" @click="share('twitter')"><font-awesome-icon size="lg" :icon="['fab', 'twitter']" /></el-button>
                    <el-button type="primary" size="mini" @click="share('facebook')"><font-awesome-icon size="lg" :icon="['fab', 'facebook-f']" /></el-button>
                </div>
            </el-dialog>
            <el-dialog :title="$t('edit')+'idol'" :visible.sync="showEdit" width="350px">
                <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="80px">
                    <el-form-item :label="$t('name')" prop="name">
                        <el-input v-model="editForm.name"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('introduction')" prop="bio">
                        <el-input v-model="editForm.bio" type="textarea" :rows="2"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="showEdit = false">{{$t('cancel')}}</el-button>
                <el-button type="primary" @click="editIdol">{{$t('determine')}}</el-button>
            </span>
            </el-dialog>
            <el-dialog :title="$t('sale')+'idol'" :visible.sync="showSale" width="400px">
                <el-form :model="saleParams" :rules="saleRules" ref="saleParams" label-width="80px">
                    <el-form-item :label="$t('start_price')" prop="startPrice">
                        <el-input-number style="width: 100%;" v-model="saleParams.startPrice" controls-position="right" :min="1">
                        </el-input-number>
                        <!--<el-input v-model="saleParams.startPrice">
                            <template slot="append">trx</template>
                        </el-input>-->
                    </el-form-item>
                    <el-form-item :label="$t('end_price')" prop="endPrice">
                        <el-input-number style="width: 100%;" v-model="saleParams.endPrice" controls-position="right" :min="1">
                        </el-input-number>
                        <!--<el-input v-model="saleParams.endPrice">
                            <template slot="append">trx</template>
                        </el-input>-->
                    </el-form-item>
                    <el-form-item :label="$t('duration')" prop="duration">
                        <el-input v-model="saleParams.duration">
                            <template slot="append">{{$t('day')}}</template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="showSale = false">{{$t('cancel')}}</el-button>
                <el-button type="primary" @click="saleIdol">{{$t('determine')}}</el-button>
              </span>
            </el-dialog>
            <el-dialog :title="$t('gift')+'idol'" :visible.sync="showGift" width="500px">
                <el-form :model="giftForm" :rules="giftRules" ref="giftForm" label-width="80px">
                    <el-form-item label="Address" prop="address">
                        <el-input v-model="giftForm.address"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="showGift = false">{{$t('cancel')}}</el-button>
                <el-button type="primary" @click="giftIdol">{{$t('determine')}}</el-button>
            </span>
            </el-dialog>
            <el-dialog :title="$t('rent')+'idol'" :visible.sync="showRent" width="400px">
                <el-form :model="saleParams" :rules="saleRules" ref="saleParams" label-width="80px">
                    <el-form-item :label="$t('start_price')" prop="startPrice">
                        <el-input-number style="width: 100%;" v-model="saleParams.startPrice" controls-position="right" :min="1">
                        </el-input-number>
                        <!--<el-input v-model="saleParams.startPrice">
                            <template slot="append">trx</template>
                        </el-input>-->
                    </el-form-item>
                    <el-form-item :label="$t('end_price')" prop="endPrice">
                        <el-input-number style="width: 100%;" v-model="saleParams.endPrice" controls-position="right" :min="1">
                        </el-input-number>
                        <!--<el-input v-model="saleParams.endPrice">
                            <template slot="append">trx</template>
                        </el-input>-->
                    </el-form-item>
                    <el-form-item :label="$t('rent_duration')" prop="duration">
                        <el-input v-model="saleParams.duration">
                            <template slot="append">{{$t('day')}}</template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="showRent = false">{{$t('cancel')}}</el-button>
                <el-button type="primary" @click="rentIdol">{{$t('determine')}}</el-button>
              </span>
            </el-dialog>
            <el-dialog :title="$t('breed') + 'Idol'" :visible.sync="showBreed" width="500px">
                <el-form :model="breedForm" :rules="breedRules" ref="breedForm" label-width="80px" label-position="top">
                    <el-form-item :label="$t('Please choose your own idol')" prop="matronId">
                        <el-select v-model="breedForm.matronId" :placeholder="$t('Please choose father')">
                            <el-option
                                    v-for="item in myIdolList"
                                    :key="item.TokenId"
                                    :label="item.NickName"
                                    :value="item.TokenId">
                                <div style="display: flex;align-items: center;justify-content: space-between">
                                    <img :src="CONFIG.IMG_SERVER + item.Pic" alt="" style="width:30px;">
                                    <span>{{ item.NickName }}</span>
                                </div>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showBreed = false">{{$t('cancel')}}</el-button>
                    <el-button type="primary" @click="rentBreed">{{$t('determine')}}</el-button>
                </span>
            </el-dialog>
        </div>
        <div style="color: #fff;min-height: 400px;text-align: center" v-else>
            <p style="line-height: 400px;">{{$t('not_find_data')}}~~</p>
        </div>
    </div>
</template>
<script>
    import * as echarts from 'echarts/lib/echarts';
    import 'echarts/lib/chart/line';
    import 'echarts/lib/component/tooltip';

    export default {
        name: 'Detail',
        data() {
            let checkAddress = (rule, value, callback) => {
                if (!window.tronWeb.isAddress(value)) {
                    callback(new Error(this.$t('invalid_address')));
                } else {
                    callback();
                }
            };
            return {
                idol: {},
                id: '',
                loading: false,
                /*coolDown: {
                    "4":"Ultra Rapid",
                    "3":"Specially Super Rapid",
                    "2":"Super Rapid",
                    "1":"Rapid",
                    "0":"Normal",
                },*/
                currentHref: window.location.href,
                showShare: false,
                showEdit: false,
                showSale: false,
                showGift: false,
                showRent: false,
                showBreed: false,
                editForm: {
                    name: '',
                    bio: ''
                },
                editRules: {
                    name: [
                        { required: true, message: this.$t('Please enter a name'), trigger: 'blur' },
                        { min: 3, max: 10, message: this.$t('check_length', [3, 10]), trigger: 'blur' }
                    ],
                    bio: { min: 0, max: 40, message: this.$t('check_length', [0, 40]), trigger: 'blur' }
                },
                saleParams: {
                    startPrice: null,
                    endPrice: null,
                    duration: null
                },
                saleRules: {
                    startPrice: { required: true, message: this.$t('Please enter the starting price'), trigger: 'blur' },
                    endPrice: { required: true, message: this.$t('Please enter the ending price'), trigger: 'blur' },
                    duration: [
                        { required: true, message: this.$t('Please enter the duration'), trigger: 'blur' },
                        /*{ type: 'number', message: '拍卖周期必须为数字值'}*/
                    ]
                },
                giftRules: {
                    address: [{ validator: checkAddress, trigger: 'blur' }]
                },
                giftForm: {
                    address: ''
                },
                breedForm: {
                    matronId: ''
                },
                breedRules: {
                    matronId: [{ required: true, message: this.$t('Please choose father'), trigger: 'change' }]
                },
                owner: 'TLxQvu9k12tvXt8XzDXHqRRv2wSXp3kpw7',
                currentAddress: '',
                currentPrice: '',
                hasIdol: false,
                myIdolList: []
            }
        },
        created() {
            this.id = this.$route.params.id;
        },
        methods: {
            rentBreed() {
                this.$refs['breedForm'].validate((valid) => {
                    if (valid) {
                        this.showBreed = false;
                        const loading = this.$loading({
                            lock: true,
                            text: this.$t('operation_progress'),
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        let price = window.tronWeb.toSun(this.currentPrice);
                        this.API.bidOnSiringAuction(this.id, this.breedForm.matronId, price).then((res) => {
                            console.log(res);
                            loading.close();
                            this.$message({
                                message: this.$t('operation_success'),
                                type: 'success'
                            });
                            this.getList();
                        }).catch(err => {
                            console.log(err);
                            loading.close();
                            this.$message({
                                message: `${this.$t('operation_failed')}，${err}`,
                                type: 'error'
                            });
                        })
                    } else {
                        return;
                    }
                })
            },
            rentIdol() {
                this.$refs['saleParams'].validate((valid) => {
                    if (valid) {
                        this.showSale = false;
                        const loading = this.$loading({
                            lock: true,
                            text: this.$t('operation_progress'),
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        this.API.createSiringAuction(this.id, this.saleParams.startPrice, this.saleParams.endPrice, this.saleParams.duration).then((res) => {
                            console.log(res);
                            loading.close();
                            this.$message({
                                message: this.$t('operation_success'),
                                type: 'success'
                            });
                            this.getDetail();
                        }).catch(err => {
                            console.log(err);
                            loading.close();
                            this.$message({
                                message: `${this.$t('operation_failed')}，${err}`,
                                type: 'error'
                            });
                        })
                    } else {
                        return;
                    }
                });
            },
            cancelRent() {
                const loading = this.$loading({
                    lock: true,
                    text: this.$t('operation_progress'),
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.API.cancelAuction(this.id).then((res) => {
                    console.log(res);
                    loading.close();
                    this.$message({
                        message: this.$t('operation_success'),
                        type: 'success'
                    });
                    this.getDetail();
                }).catch(err => {
                    console.log(err);
                    loading.close();
                    this.$message({
                        message: `${this.$t('operation_failed')}，${err}`,
                        type: 'error'
                    });
                })
            },
            giveBirth() {
                const loading = this.$loading({
                    lock: true,
                    text: this.$t('operation_progress'),
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.API.giveBirth(this.id).then((res) => {
                    console.log(res);
                    loading.close();
                    this.$message({
                        message: this.$t('operation_success'),
                        type: 'success'
                    });
                    this.getDetail();
                }).catch(err => {
                    console.log(err);
                    loading.close();
                    this.$message({
                        message: `${this.$t('operation_failed')}，${err}`,
                        type: 'error'
                    });
                })
            },
            async buyIdol() {
                let price = window.tronWeb.toSun(this.currentPrice);
                const loading = this.$loading({
                    lock: true,
                    text: this.$t('confirmation_transaction'),
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.API.buyIdol(this.id, price).then((res) => {
                    console.log(res);
                    loading.close();
                    this.$message({
                        message: this.$t('transaction_success'),
                        type: 'success'
                    });
                    this.getDetail();
                }).catch(err => {
                    console.log(err);
                    loading.close();
                    this.$message({
                        message: `${this.$t('transaction_failed')}，${err}`,
                        type: 'error'
                    });
                })
            },
            async saleIdol() {
                this.$refs['saleParams'].validate((valid) => {
                    if (valid) {
                        this.showSale = false;
                        const loading = this.$loading({
                            lock: true,
                            text: this.$t('operation_progress'),
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        this.API.saleIdol(this.id, this.saleParams.startPrice, this.saleParams.endPrice, this.saleParams.duration).then((res) => {
                            console.log(res);
                            loading.close();
                            this.$message({
                                message: this.$t('operation_success'),
                                type: 'success'
                            });
                            this.getDetail();
                        }).catch(err => {
                            console.log(err);
                            loading.close();
                            this.$message({
                                message: `${this.$t('operation_failed')}，${err}`,
                                type: 'error'
                            });
                        })
                    } else {
                        return;
                    }
                });
            },
            async giftIdol() {
                this.$refs['giftForm'].validate((valid) => {
                    if (valid) {
                        this.showGift = false;
                        const loading = this.$loading({
                            lock: true,
                            text: this.$t('operation_progress'),
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        this.API.giftIdol(this.giftForm.address, this.id).then((res) => {
                            console.log(res);
                            loading.close();
                            this.$message({
                                message: this.$t('operation_success'),
                                type: 'success'
                            });
                            this.getDetail();
                        }).catch(err => {
                            console.log(err);
                            loading.close();
                            this.$message({
                                message: `${this.$t('operation_failed')}，${err}`,
                                type: 'error'
                            });
                        })
                    } else {
                        return false;
                    }
                })
            },
            async editIdol() {
                this.$refs['editForm'].validate(async (valid) => {
                    if (valid) {
                        this.showEdit = false;
                        this.loading = true;
                        await this.API.setName({'tokenId': this.id, 'name': this.editForm.name}).then((res) => {
                            if (res.code === 0) {
                                this.$message({
                                    message: this.$t('edit_success'),
                                    type: 'success'
                                });
                            } else {
                                this.$message.error(this.$t('edit_failed'));
                            }
                        })
                        await this.API.setBio({'tokenId': this.id, 'bio': this.editForm.bio}).then((res) => {
                            if (res.code === 0) {
                                this.$message({
                                    message: this.$t('edit_success'),
                                    type: 'success'
                                });
                            } else {
                                this.$message.error(this.$t('edit_failed'));
                            }
                        })
                        this.loading = false;
                        this.getDetail();
                    } else {
                        return false;
                    }
                });
            },
            showEditDialog() {
                this.showEdit = true;
                this.editForm.name = this.idol.NickName;
                this.editForm.bio = this.idol.Bio;
            },
            copyText() {
                let e = document.querySelector('.copyInput');
                e.select();
                document.execCommand('Copy');
                this.$message({
                    message: this.$t('copy_success'),
                    type: 'success'
                });
            },
            getDetail() {
                this.loading = true;
                this.API.getIdol({tokenId: this.id}).then(res => {
                    this.loading = false;
                    if (res.code === 0) {
                        this.hasIdol = true;
                        this.idol = res.data;
                        if (res.data.IsForSale === 1 || res.data.IsRental === 1) {
                            this.draw();
                        }
                    } else {
                        this.hasIdol = false
                    }
                })
            },
            like() {
                this.API.like({tokenId: this.idol.TokenId}).then(res => {
                    if (res.code === 0) {
                        this.idol.IsLike = 1;
                        this.getDetail();
                    }
                })
            },
            unlike() {
                this.API.unlike({tokenId: this.idol.TokenId}).then(res => {
                    if (res.code === 0) {
                        this.idol.IsLike = 0;
                        this.getDetail();
                    }
                })
            },
            share(social) {
                var win = window.open(this.shareUrl(social), '_tab');
                win.focus();
            },
            // https://codepen.io/discountry/pen/WxkLmJ?editors=1010
            shareUrl(social) {
                const encodeURL = encodeURIComponent(this.currentHref);
                const url = this.currentHref;
                let shareURL = '';
                switch (social) {
                    case 'weibo': {
                        shareURL = `http://service.weibo.com/share/share.php?url=${url}&title=${encodeURL}`;
                        break;
                    }
                    case 'wechat': {
                        shareURL = `https://cli.im/api/qrcode/code?mhid=sRHEDAjmzMkhMHcvL9BQPKg&text=${url}?taici='${encodeURL}'`
                        break;
                    }
                    case 'twitter': {
                        shareURL = `https://twitter.com/intent/tweet?text=${encodeURL}`
                        break;
                    }
                    case 'facebook': {
                        shareURL = `https://www.facebook.com/dialog/feed?app_id=145634995501895&display=page&description=${encodeURL}&link=${url}&redirect_uri=https://www.facebook.com/`
                        break;
                    }
                    default:
                        break;
                }
                return shareURL;
            },
            draw() {
                let { StartedAt, Duration, StartingPrice, EndingPrice } = this.idol;
                let xData = [];
                let yData = [];
                xData.push(this.util.formatDateTime(new Date(StartedAt), 'yyyy-MM-dd hh:mm:ss'));
                yData.push(window.tronWeb.fromSun(StartingPrice));
                // per minute
                for (let i = StartedAt + 60000; i < StartedAt + Duration; i+=60000) {
                    xData.push(this.util.formatDateTime(new Date(i), 'yyyy-MM-dd hh:mm:ss'));
                    yData.push(window.tronWeb.fromSun(StartingPrice+Math.floor(((EndingPrice-StartingPrice)/Duration)*(i-StartedAt-60000))));
                }
                xData.push(this.util.formatDateTime(new Date(StartedAt + Duration), 'yyyy-MM-dd hh:mm:ss'));
                yData.push(window.tronWeb.fromSun(EndingPrice));
                console.log(xData, yData);
                let timestamp = new Date().getTime();
                if (timestamp >= StartedAt + Duration) {
                    this.currentPrice = EndingPrice
                } else {
                    this.currentPrice = StartingPrice + Math.floor(((EndingPrice-StartingPrice)/Duration) * (timestamp-StartedAt));
                }
                this.currentPrice = window.tronWeb.fromSun(this.currentPrice);
                echarts.init(document.getElementById('price-chart')).setOption({
                    xAxis: {
                        type: 'category',
                        show: false,
                        boundaryGap: false,
                        interval: 1,
                        data:xData
                    },
                    yAxis: {
                        type: 'value',
                        show: false
                    },
                    tooltip: {
                        confine: true,
                        trigger: 'axis',
                        backgroundColor: '#333077',
                        formatter: '{b0} <br />{c0} TRX',
                        textStyle: {
                            fontSize: 10
                        }
                    },
                    grid: [{
                        top: 0,
                        width: '100%',
                        bottom: '0%',
                        left: 0
                    }],
                    series: [{
                        data: yData,
                        type: 'line',
                        symbol: 'none',
                        lineStyle: {
                            color: '#333077'
                        },
                        areaStyle: {
                            color: '#333077'
                        }
                    }]
                });
            },
            getCooldown(i) {
                if (i>=0 && i<=3) return 'Ultra Rapid'
                if (i>=4 && i<=6) return 'Specially Super Rapid'
                if (i>=7 && i<=9) return 'Super Rapid'
                if (i>=10 && i<=11) return 'Rapid'
                if (i>=12 && i<=13) return 'Normal'
            },
            getMyIdolList() {
                this.API.getMyIdols({
                    page: 1,
                    pageSize: 100,
                    category: 'all',
                    sort: '+id'
                }).then(res => {
                    if (res.code === 0) {
                        this.myIdolList = res.data.rows;
                    }
                })
            }
        },
        computed: {
            cooldown() {
                let i = this.idol.CooldownIndex;
                if (i>=0 && i<=3) return this.$t('Ultra Rapid');
                if (i>=4 && i<=6) return this.$t('Specially Super Rapid');
                if (i>=7 && i<=9) return this.$t('Super Rapid');
                if (i>=10 && i<=11) return this.$t('Rapid');
                if (i>=12 && i<=13) return this.$t('Normal');
                return ''
            },
            labels() {
                return this.idol.Labels ? this.idol.Labels.split(',') : [];
            },
            attributes() {
                return this.idol.Attributes ? this.idol.Attributes.split(',') : [];
            },
            canBuy() {
                return this.idol.IsForSale === 1
            },
            isOwner() {
                return this.currentAddress === this.idol.Address
            },
            isPregnant() {
                return this.idol.IsPregnant === 1
            },
            isReady() {
                return this.idol.IsReady === 1
            },
            otherState() {
                if (this.isReady) {
                    if (this.isPregnant) {
                        return this.$t('can be delivered')
                    } else {
                        return this.$t('cooling ready')
                    }
                } else {
                    return this.$t('cooling')
                }
            },
            // 可出租
            isForRental() {
                return this.idol.IsPregnant === 0 && this.idol.IsReady === 1 && this.idol.IsRental === 0 && this.idol.IsForSale === 0
            },
            // 已被出租
            isRental() {
                return this.idol.IsRental === 1
            }
        },
        mounted() {
            this.getDetail();
            this.getMyIdolList();
            this.currentAddress = window.tronWeb.defaultAddress.base58;
            /*this.API.getIdolPrice(this.id).then(res => {
                console.log(res);
            });*/
        }
    }
</script>
<style lang="scss" scoped>
    .dn {
        display: none;
    }
    #price-chart {
        cursor: pointer;
    }
    .owner {
        min-width: 300px;
        color: #fff;
        margin-left: 10px;
        font-size: 14px;
        line-height: 24px;
    }
    .profileBox {
        display: inline-block;
        width: 476px;
        padding: 20px;
        box-sizing: border-box;
        height: 407px;
        overflow-y: auto;
    }
    .copyIcon {
        cursor: pointer;
        margin-left: 10px;
        &:hover {
            color: #656DF0;
        }
    }
    .idolProfile {
        height: 100%;
    }
    .idolProfile>div {
        margin-bottom: 30px;
    }
    .copyInput {
        border: none;
        font-size: 16px;
        color: #606266;
        width: 90%;
        outline: none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
    }
    .labelContent+.labelContent {
        margin-left: 10px;
    }
    .labelContent {
        padding: 2px 8px;
        border: 1px solid #ffffff;
        color: #ffffff;
        line-height: 20px;
        margin-top: 10px;
    }
    .image-outer {
        height: 150px;
        width: 150px;
        position: relative;
    }
    .card {
        margin: 15px 0;
        min-height: 400px;
    }

    .detail-container {
        position: relative;
    }
    .detail {
        position: relative;
        height: 500px;
    }
    .line {
        width: 600px;
        position: absolute;
        bottom: -80px;
        left: 30px;
        display: flex;
        align-items: flex-end;
    }
    .detail-bg {
        width: 750px;
        position: absolute;
        top: 0;
        right: 0;
    }
    .share {
        color: #656DF0;
        background: url("../assets/share-bg.png") center no-repeat,
        url("../assets/earth1.png") center center no-repeat;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 191px;
        height: 155px;
        cursor: pointer;
    }
    .share:hover {
        color: #ffffff;
    }
    .detail-info {
        color: #656DF0;
        background: url("../assets/detail-bg.png");
        width: 787px;
        height: 448px;
    }
    .detail-main {
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        font-size: 14px;
    }
    .earth-img {
        width: 120px;
    }
    .share-bg {
        width: 160px;
    }
    img {
        width: 100%;
    }
    p {
        margin: 0;
    }
    .panel::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: transparent;
    }
    .panel::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 3px;
    }
    ::selection {
        background-color: #b3d4fc;
        color: #000;
        text-shadow: none;
    }
    .idol-button {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        border: none;
        -webkit-appearance: none;
        text-align: center;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        outline: 0;
        margin: 0;
        -webkit-transition: .1s;
        transition: .1s;
        font-weight: 500;
        padding: 10px 20px;
        font-size: 14px;
        color: #fff;
        background: linear-gradient(-45deg, transparent 10px, #333077 0);
        &:hover {
            background: linear-gradient(-45deg, transparent 10px, #656DF2 0);
        }
    }


    .btn {
        color: #fff;
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        padding: 6px 20px;
        max-width: 160px;
        position: relative;
        text-decoration: none;
        width: 100%;
        background-color: rgba(50,47,98, .5);
    }
    .btn+.btn {
        margin-left: 10px;
    }
    .btn-plain {
        border: 1px solid #333077;
        box-shadow: inset 0 0 20px rgba(101,109,242, 0);
        outline: 1px solid;
        outline-color: rgba(101,109,242, .5);
        outline-offset: 0px;
        text-shadow: none;
        transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
        box-sizing: border-box;
        &:hover {
            border: 1px solid #656DF2;
            box-shadow: inset 0 0 20px rgba(101,109,242, .5), 0 0 20px rgba(101,109,242, .2);
            outline-color: rgba(101,109,242, 0);
            outline-offset: 15px;
            text-shadow: 1px 1px 2px #427388;
        }
    }
    .share-btn {
        min-width: 40px;
        color: #fff;
        background-color: #337ab7;
        border-color: #2e6da4;
        display: inline-block;
        padding: 6px 6px;
        margin-bottom: 0;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.42857143;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-image: none;
        border: 1px solid transparent;
        border-radius: 4px;
    }
    .share-btn:hover {
        color: #fff;
        background-color: #286090;
        border-color: #204d74;
    }
</style>