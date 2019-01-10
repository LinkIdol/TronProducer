<template>
    <el-main class="home-page">
        <div>
            <div class="line">
                <img style="width: 100%;" src="../assets/line2@2x.png" alt="">
            </div>
            <div class="home-header fixed-width cryptoTab">
                <div style="display: flex;align-items: center">
                    <el-menu
                            :default-active="category"
                            mode="horizontal"
                            background-color="#191428"
                            text-color="#BDBDBD"
                            active-text-color="#ffffff"
                            @select="handleSelect">
                        <el-menu-item index="all">{{$t('all')}}</el-menu-item>
                        <el-menu-item index="forsale">{{$t('for_sale')}}</el-menu-item>
                        <!--<el-menu-item index="rental">{{$t('rental')}}</el-menu-item>-->
                        <el-menu-item index="new">{{$t('new')}}</el-menu-item>
                    </el-menu>
                    <div class="c-input">
                        <el-input
                                ref="SearchInput"
                                :placeholder="$t('number') + ' 、' + $t('name') + ' 、#' + $t('label') + '…'"
                                v-model="searchInput"
                                @focus="showSearchBox = true"
                                @blur="blurInput"
                                prefix-icon="el-icon-search" clearable>
                        </el-input>
                        <div class="search-box" v-if="showSearchBox && searchInput.length > 0">
                            <div v-if="/^[\d]+$/.test(searchInput)" @click="toDetail">ID: {{searchInput}}</div>
                            <div @click="searchName">Name: {{searchInput}}</div>
                        </div>
                    </div>
                </div>
                <div class="menu-container" onselectstart="return false;" >
                    <!--<div class="menu-btn" :class="{'menu-btn-active': filterActive}" @click="filterActive=!filterActive">
                        <font-awesome-icon :icon="['fas', 'filter']" style="margin-right: 8px;"/>
                        <span>{{$t('filter')}}</span>
                    </div>-->
                    <div class="menu-btn" @click="sortBoxActive = !sortBoxActive">
                        <font-awesome-icon :icon="['fas', 'bars']" style="margin-right: 8px;"/>
                        <span>{{sort.name}}</span>
                    </div>
                    <div class="sort-box" v-if="sortBoxActive">
                        <div v-for="(item, i) in sorts" :key="i" @click="sortChange(item)">{{item.name}}</div>
                    </div>
                </div>
            </div>
            <div v-if="filterActive" class="filterContainer fixed-width">
                <div class="filterRow">
                    <span style="margin-right: 10px">{{$t('hair_color')}}：</span>
                    <span class="a-tag"
                          v-for="(item, i) in hairColors"
                          :class="{'a-tag-active': item.active}"
                          :key="i"
                          @click="activeAttr('hairColors', i)">{{item.name}}
                    </span>
                </div>
                <div class="filterRow">
                    <span style="margin-right: 10px">{{$t('eye_color')}}：</span>
                    <span class="a-tag"
                          v-for="(item, i) in eyeColors"
                          :class="{'a-tag-active': item.active}"
                          :key="i"
                          @click="activeAttr('eyeColors', i)">{{item.name}}
                    </span>
                </div>
                <div class="filterRow">
                    <span style="margin-right: 10px">{{$t('hair_style')}}：</span>
                    <span class="a-tag"
                          v-for="(item, i) in hairStyles"
                          :class="{'a-tag-active': item.active}"
                          :key="i"
                          @click="activeAttr('hairStyles', i)">{{item.name}}
                    </span>
                </div>
                <div class="filterRow">
                    <span style="margin-right: 10px">{{$t('feature')}}：</span>
                    <span class="a-tag"
                          v-for="(item, i) in attributes"
                          :class="{'a-tag-active': item.active}"
                          :key="i"
                          @click="activeAttr('attributes', i)">{{item.name}}
                    </span>
                </div>
                <!--<div class="filterRow">
                    <span style="margin-right: 10px">{{$t('cooldown')}}：</span>
                    <span class="a-tag"
                          v-for="(item, i) in cooldowns"
                          :class="{'a-tag-active': item.active}"
                          :key="i"
                          @click="activeAttr('cooldowns', i)">{{item.name}}
                    </span>
                </div>-->
            </div>
        </div>
        <div class="fixed-width cardContainer" v-loading="loading" element-loading-background="#191428">
            <Card v-for="(item, i) in idolList" :key="i" class="idolCard" :idol="item" :class="{'idolCard-noMargin': (i+1)%4 === 0}"></Card>
            <div class="no-data" v-if="idolList.length <= 0">
                (|||ﾟдﾟ) {{$t('not_find_data')}}~~
            </div>
        </div>
        <div class="pagination" v-if="pageCount > 0">
            <el-pagination background
                    layout="prev, pager, next"
                    :page-size="pageSize"
                    :current-page="pageIndex"
                    :total="pageCount" @current-change="handlePageChange">
            </el-pagination>
        </div>
    </el-main>
</template>

<script>
    import Card from '@/components/Card'
    import { mapState } from 'vuex'
    export default {
        name: 'Market',
        components: {
            Card
        },
        created() {},
        data() {
            return {
                idolList: [],
                pageIndex: 1,
                pageSize: 12,
                pageCount: 0,
                loading: false,
                category: 'all',
                //hairColors: [],
                //eyeColors: [],
                //hairStyles: [],
                //attributes: [],
                cooldowns: [
                    {id: 'ur', name: 'Ultra Rapid', active: false},
                    {id: 'ssr', name: 'Specially Super Rapid', active: false},
                    {id: 'sr', name: 'Super Rapid', active: false},
                    {id: 'r', name: 'Rapid', active: false},
                    {id: 'n', name: 'Normal', active: false},
                ],
                sorts: [
                    {id: '-id', name : this.$t('ID_desc')},
                    {id: '+id', name : this.$t('ID_asc')},
                    /*{id: '-price', name : this.$t('price_desc')},
                    {id: '+price', name : this.$t('price_asc')}*/
                ],
                sort: {id: '+id', name : this.$t('ID_asc')},
                filterActive: false,
                sortBoxActive: false,
                searchInput: '',
                showSearchBox: false,
                filterName: ''
            }
        },
        methods: {
            blurInput() {
                /*console.log('blur');
                setTimeout(() => {
                    this.showSearchBox = false
                },1000);*/
            },
            toDetail() {
                /*this.$refs.SearchInput.focus();
                const { href } = this.$router.resolve({
                    path: `/card/${this.searchInput}`
                });
                window.open(href, '_blank');*/
                this.showSearchBox = false;
                this.$router.push({
                    path: `/card/${this.searchInput}`
                })
            },
            searchName() {
                this.showSearchBox = false;
                this.pageIndex = 1;
                this.getList();
            },
            activeAttr(attr, i) {
                this[attr][i].active = !this[attr][i].active;
                this.pageIndex = 1;
                this.getList();
            },
            handleSelect(key) {
                this.category = key;
                this.pageIndex = 1;
                this.$router.push({ path: 'market', query: { page: 1, category: key, sort: this.$route.query.sort || '+id'}});
                this.getList();
            },
            getList() {
                this.loading = true;
                let hairColors = [];
                this.hairColors.forEach(item => {if (item.active) hairColors.push(item.id)})
                let eyeColors = [];
                this.eyeColors.forEach(item => {if (item.active) eyeColors.push(item.id)})
                let hairStyles = [];
                this.hairStyles.forEach(item => {if (item.active) hairStyles.push(item.id)})
                let attributes = [];
                this.attributes.forEach(item => {if (item.active) attributes.push(item.id)})
                let cooldowns = [];
                this.cooldowns.forEach(item => {if (item.active) cooldowns.push(item.id)})
                let filter = '';
                if (cooldowns.length > 0) {
                    filter = `cooldown:${cooldowns.join('|')}`
                }
                if (this.searchInput.length > 0) {
                    if (filter.length > 0) {
                        filter += `,name:${this.searchInput}`
                    } else {
                        filter += `name:${this.searchInput}`
                    }
                }
                let params = {
                    page: this.pageIndex,
                    pageSize: this.pageSize,
                    category: this.category,
                    hairColors: hairColors.join(','),
                    eyeColors: eyeColors.join(','),
                    hairStyles: hairStyles.join(','),
                    attributes: attributes.join(','),
                    filters: filter,
                    sort: this.sort.id
                };
                let requestParams = {};
                for (let item in params) {if (params[item]) requestParams[item] = params[item]}
                this.API.getMarketIdols(requestParams).then(res => {
                    this.loading = false;
                    if (res.code === 0) {
                        this.idolList = res.data.rows;
                        this.pageCount = res.data.count;
                    }
                })
            },
            handlePageChange(i) {
                console.log(i);
                this.pageIndex = i;
                this.$router.push({ path: 'market', query: {
                    page: i,
                    category: this.$route.query.category || 'all' ,
                    sort: this.$route.query.sort || '+id'
                }});
                this.getList();
            },
            sortChange(item) {
                this.sortBoxActive = false;
                this.$router.push({ path: 'market', query: {
                    page: this.$route.query.page || 1,
                    category: this.$route.query.category || 'all' ,
                    sort: item.id
                }});
                this.sort = item;
                this.getList();
            }
        },
        mounted() {
            this.category = this.$route.query.category || 'all';
            this.pageIndex = this.$route.query.page || 1;
            let sortId = this.$route.query.sort || '+id';
            this.sorts.forEach((item) => {
                if(item.id === sortId) {
                    this.sort = item
                }
            })
            this.getList();
        },
        beforeCreate () {
            //this.$store.dispatch('registerWeb3')
        },
        computed: {
            ...mapState({
                isInjected: state => state.tron.tron.isInjected,
                coinbase: state => state.tron.tron.coinbase,
                balance: state => state.tron.tron.balance
            }),
            hairColors() {
                let result = [];
                let hairColors = ['blonde', 'brown', 'black', 'blue', 'pink', 'purple', 'green', 'red', 'silver', 'white', 'orange', 'aqua', 'grey']
                for(let item of hairColors) {
                    result.push({
                        id: item,
                        name: this.$t(item),
                        active: false
                    })
                }
                return result;
            },
            eyeColors() {
                let result = [];
                let eyeColors = ['blue', 'red', 'brown', 'green', 'purple', 'yellow', 'pink', 'aqua', 'black', 'orange'];
                for(let item of eyeColors) {
                    result.push({
                        id: item,
                        name: this.$t(item),
                        active: false
                    })
                }
                return result;
            },
            hairStyles() {
                let result = [];
                let hairStyles = ['long hair', 'short hair', 'twintails', 'drill hair', 'ponytail'];
                for(let item of hairStyles) {
                    result.push({
                        id: item,
                        name: this.$t(item),
                        active: false
                    })
                }
                return result;
            },
            attributes() {
                let result = [];
                let attributes =  ['dark skin', 'blush', 'smile', 'open mouth', 'hat', 'ribbon', 'glasses'];
                for(let item of attributes) {
                    result.push({
                        id: item,
                        name: this.$t(item),
                        active: false
                    })
                }
                return result;
            }
        },
    }
</script>
<style lang="scss" scoped>
    .no-data {
        width: 100%;
        text-align: center;
        color: #BDBDBD;
    }
    .search-box {
        position: absolute;
        left: 30px;
        top: 50px;
        z-index: 10;
        color: #BDBDBD;
        font-size: 14px;
        background-color: #191428;
        box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);
    }
    .search-box div {
        padding: 10px;
        min-width: 100px;
    }
    .search-box div:hover {
        background-color: #383838;
        color: #fff;
        cursor: pointer;
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
    }

    .home-header {
        display: flex;
        flex-direction: row;
        padding: 0 20px;
        align-items: center;
        justify-content: space-between;
    }

    .c-input {
        position: relative;
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
</style>
<style lang="scss">
    .c-input .el-input__inner {
        background-color: $bgColor;
        border: none;
        color: #ffffff;
    }

    input::-webkit-input-placeholder {
        color: #989898 !important;
    }

    input::-moz-placeholder {
        color: #989898 !important;
    }

    input:-ms-input-placeholder {
        color: #989898 !important;
    }

    .el-input__prefix, .el-input__suffix {
        color: #989898 !important;
    }
</style>
