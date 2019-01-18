<template>
    <el-main class="home-page">
        <div class="fixed-width" style="display: flex;align-items: center;">
            <div>
                <!--<div style="font-size: 14px;margin-left: 20px;">
                    <span style="color: #aaa;">{{$t('nickName')}}: </span>
                    <span>{{ userName || $t('no_data')}}</span>
                    <span v-if="userName === ''" style="cursor: pointer;margin-left: 20px;" @click="showEditNickName = true;">{{$t('go_setting')}}</span>
                </div>-->
                <div style="font-size: 14px;margin-left: 20px;">
                    <span style="color: #aaa;">tron {{$t('address')}}: </span>
                    <span style="cursor: pointer">{{address}}</span>
                </div>
            </div>
        </div>
        <div class="fixed-width cardContainer" v-loading="loading" element-loading-background="#191428" style="margin-top: -20px;">
            <Card v-for="(item, i) in idolList"
                  :key="i" class="idolCard"
                  :idol="item"
                  :canBuy="false"
                  :canFav="false"
                  :class="{'idolCard-noMargin': (i+1)%4 === 0}">
            </Card>
            <div class="no-data" v-if="idolList.length <= 0">
                <span>(|||ﾟдﾟ) {{$t('not_find_data')}}~~{{$t('go')}} </span><router-link to="/market">{{$t('market')}}</router-link><span> {{$t('have_look')}}~~</span>
            </div>
        </div>
        <div class="pagination" v-if="pageCount > 0">
            <el-pagination background
                           layout="prev, pager, next"
                           :page-size="pageSize"
                           :total="pageCount" @current-change="handlePageChange">
            </el-pagination>
        </div>
    </el-main>
</template>

<script>
    import Card from '@/components/Card'
    export default {
        name: 'User',
        components: {
            Card
        },
        data() {
            return {
                idolList: [],
                pageIndex: 1,
                pageSize: 12,
                pageCount: 0,
                loading: false,
                address: '',
                userName: ''
            }
        },
        methods: {
            getList() {
                this.loading = true;
                this.API.getUserIdols(this.address).then(res => {
                    this.loading = false;
                    if (res.code === 0) {
                        this.idolList = res.data.rows;
                        this.pageCount = res.data.count;
                        this.userName = res.data.userName || '';
                    }
                })
            },
            handlePageChange(i) {
                console.log(i);
                this.pageIndex = i;
                this.getList();
            }
        },
        mounted() {
            this.getList();
        },
        created() {
            this.address = this.$route.params.address;
        }
    }
</script>
<style lang="scss" scoped>
    .idol-avatar {
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
    a {
        text-decoration: none;
        color: #409EFF;
    }
    .no-data {
        width: 100%;
        text-align: center;
        color: #BDBDBD;
    }
    .sort-box {
        position: absolute;
        right: 0;
        top: 25px;
        z-index: 10;
        color: #BDBDBD;
        font-size: 14px;
        background-color: #191428;
        box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);
    }
    .sort-box div {
        padding: 10px;
        min-width: 100px;
    }
    .sort-box div:hover {
        background-color: #383838;
        color: #fff;
        cursor: pointer;
    }
    .a-tag {
        color: rgb(189, 189, 189);
        background-color: $bgColor;
        border: 1px solid rgb(189, 189, 189);
        height: 24px;
        padding: 0 8px;
        line-height: 22px;
        cursor: pointer;
        font-size: 12px;
        box-sizing: border-box;
        white-space: nowrap;
        display: inline-block;
    }
    .a-tag+.a-tag {
        margin-left: 10px;
    }
    .a-tag-active {
        color: #fff;
        background-color: #656DF2;
        border-color: #656DF2;
    }
    .filterRow+.filterRow {
        margin-top: 10px;
    }
    .filterContainer {
        color: #ffffff;
        font-size: 12px;
    }
    .idolCard {
        margin-bottom: 4rem;
        margin-right: 128px;
    }
    .idolCard-noMargin {
        margin-right: 0;
    }
    .cardContainer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin: 3rem auto 1rem auto;
    }

    .line {
        width: $innerWidth;
        position: absolute;
        top: 9px;
    }

    .home-page {
        position: relative;
        width: $innerWidth;
        padding: 0 0 100px 0;
        margin: 0 auto;
        color: #fff;
    }

    .home-header {
        display: flex;
        flex-direction: row;
        padding: 0 20px;
        align-items: center;
        justify-content: space-between;
    }

    .c-input {
        align-self: stretch;
        display: flex;
        align-items: center;
        margin-left: 40px;
    }
    .menu-container {
        display: flex;
        margin-top: 10px;
        position: relative;
    }
    .menu-btn {
        color: #BDBDBD;
        font-size: 15px;
        z-index: 2;
        cursor: pointer;
    }
    .menu-btn-active, .menu-btn:hover {
        color: #fff;
    }
    .menu-btn + .menu-btn {
        margin-left: 20px;
    }
    .filter-icon {
        width: 10px;
        display: inline-block;
        margin-right: 8px;
    }
    .pagination {
        background-color: $bgColor;
        text-align: center;
    }

    @media screen and (max-width: $mediaWidth) {
        .home-page {
            width: 100%;
        }
        .line {
            display: none;
        }
        .c-input {
            display: none;
        }
        .idolCard {
            margin-bottom: 2rem;
            margin-right: 0;
        }
        .cardContainer {
            margin-top: 1rem;
            max-width: 400px;
            margin-right: auto;
            margin-left: auto;
            justify-content: space-between;
            padding: 30px;
        }
        .menu-container {
            margin-top: 0;
        }
    }
</style>
