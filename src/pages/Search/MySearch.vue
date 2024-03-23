<template>
    <div>
        <!-- 商品分类三级联动 -->
        <TypeNav />
        <div class="main">
            <div class="py-container">
                <!--bread：面包屑导航-->
                <div class="bread">
                    <ul class="fl sui-breadcrumb">
                        <li>
                            <a href="javascript:;">全部结果</a>
                        </li>
                    </ul>
                    <ul class="fl sui-tag">
                        <!-- 分类的面包屑 -->
                        <li class="with-x" v-if="searchParams.categoryName">{{ searchParams.categoryName }}<i @click="removeCategoryName">×</i></li>
                        <!-- 关键字keyword的面包屑 -->
                        <li class="with-x" v-if="searchParams.keyword">{{ searchParams.keyword }}<i @click="removeKeyWord">×</i></li>
                        <!-- 品牌trademark的面包屑 -->
                        <li class="with-x" v-if="searchParams.trademark">{{ searchParams.trademark.split(':')[1] }}<i @click="removeTradeMark">×</i></li>
                        <!-- 平台售卖属性的面包屑 -->
                        <li class="with-x" v-for="(attrValue, index) in searchParams.props" :key="index">{{ attrValue.split(':')[1] }}<i @click="removeProps(index)">×</i></li>
                    </ul>
                </div>

                <!-- selector -->
                <!-- 绑定一个自定义事件，用于点击品牌时向服务器发请求获取数据并返回数据给子组件 -->
                <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo" />

                <!-- details -->
                <div class="details clearfix">
                    <div class="sui-navbar">
                        <div class="navbar-inner filter">
                            <!-- 排序的结构 -->
                            <ul class="sui-nav">
                                <li :class="{active: isOrderOne}" @click="changeOrder('1')">
                                    <a href="javascript:;">综合
                                        <span v-show="isOrderOne">{{ isOrder ? '↑' : '↓' }}</span>
                                    </a>
                                </li>
                                <li :class="{active: isOrderTwo}" @click="changeOrder('2')">
                                    <a href="javascript:;">价格
                                        <span v-show="isOrderTwo">{{ isOrder ? '↑' : '↓' }}</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- 销售产品列表 -->
                    <div class="goods-list">
                        <ul class="yui3-g">
                            <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                                <div class="list-wrap">
                                    <div class="p-img">
                                        <!-- 在进行路由跳转的时候切记别忘记带id（params参数） -->
                                        <router-link :to="`/detail/${good.id}`">
                                            <!-- 使用vue-lazyload插件中的v-lazy就可以实现图片懒加载了 -->
                                            <img v-lazy="good.defaultImg" />
                                        </router-link>
                                    </div>
                                    <div class="price">
                                        <strong>
                                            <em>¥ </em>
                                            <i>{{ good.price }}.00</i>
                                        </strong>
                                    </div>
                                    <div class="attr">
                                        <a target="_blank" href="item.html"
                                            title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">{{ good.title }}</a>
                                    </div>
                                    <div class="commit">
                                        <i class="command">已有<span>2000</span>人评价</i>
                                    </div>
                                    <div class="operate">
                                        <a href="success-cart.html" target="_blank"
                                            class="sui-btn btn-bordered btn-danger">加入购物车</a>
                                        <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <!-- 
                        分页器：
                            pageNo：表示当前第几页
                            pageSize：表示每一页展示多少数据
                            total：表示一共有多少数据
                            continues：表示分页连续页码个数
                     -->
                    <MyPagination
                        :pageNo="searchParams.pageNo"
                        :pageSize="searchParams.pageSize"
                        :total="total"
                        :continues="5"
                        @getPageNo="getPageNo"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchSelector from './SearchSelector/SearchSelector'
    import { mapGetters, mapState } from 'vuex'

    export default {
        name: 'MySearch',
        components: {
            SearchSelector
        },
        data() {
            return {
                // 带给服务器的参数
                searchParams: {
                    // 一级分类的id
                    category1id: '',
                    // 二级分类的id
                    category2id: '',
                    // 三级分类的id
                    category3id: '',
                    // 分类名称
                    categoryName: '',
                    // 关键字（用户输入的搜索关键字）
                    keyword: '',
                    // 排序：初始状态是综合且降序（1代表的是综合，2代表的是价格；asc代表的是升序，desc代表的是降序）
                    order: '1:desc',
                    // 分页器用的：代表的是当前的页码
                    pageNo: 1,
                    // 代表的是每一页展示数据个数
                    pageSize: 10,
                    // 平台售卖书写操作带的参数
                    props: [],
                    // 品牌
                    trademark: ''
                }
            }
        },
        // 当组件挂载完毕之前执行一次（先于mounted之前执行）
        beforeMount() {
            // 在给服务器发请求之前，把参数整理好再发请求，服务器就会返回查询的数据
            // Object.assign是ES6新增的语法，用于合并对象
            Object.assign(this.searchParams, this.$route.query, this.$route.params)
        },
        // 组件挂载完毕执行一次（仅仅执行一次）
        mounted() {
            // 在发请求之前带给服务器的参数（searchParams参数）要发生变化
            this.getData()
        },
        computed: {
            // 这里mapGetters的写法是数组，因为getters计算是没有划分模块的
            ...mapGetters(['goodsList']),
            isOrderOne() {
                return this.searchParams.order.indexOf('1') != -1
            },
            isOrderTwo() {
                return this.searchParams.order.indexOf('2') != -1
            },
            isOrder() {
                return this.searchParams.order.indexOf('asc') != -1
            },
            // 获取search模块展示产品一共有多少数据
            ...mapState({
                total: state => state.search.searchList.total
            })
        },
        methods: {
            // 向服务器发请求获取search模块数据（根据参数不同返回不同的数据进行展示）
            // 把这次请求封装成一个函数，当需要使用的时候，调用即可
            getData() {
                this.$store.dispatch('getSearchList', this.searchParams)
            },
            // 删除分类的名称和其相对应的id
            removeCategoryName() {
                // 把带给服务器的参数置空了，还需要再向服务器发请求
                // 带给服务器参数说明是可有可无的：如果属性值为空的字符串还是会把相应的字段带给服务器，但是你把相应的字段变为undefined，那么当前这个字段不会带给服务器
                this.searchParams.category1id = undefined
                this.searchParams.category2id = undefined
                this.searchParams.category3id = undefined
                this.searchParams.categoryName = undefined
                // 地址栏也需要更改：进行路由跳转（现在的路由跳转只是跳转到自己这里）
                // 本意是删除query，如果路径当中出现params参数不应该删除，路由跳转的时候应该带着
                if(this.$route.params) {
                    this.$router.push({name: 'search', params: this.$route.params})
                }
            },
            // 删除搜索关键字keyword
            removeKeyWord() {
                this.searchParams.keyword = undefined
                // 通知兄弟组件MyHeader清除关键字keyword
                this.$bus.$emit('clear')
                if(this.$route.query) {
                    this.$router.push({name: 'search', query: this.$route.query})
                }
            },
            // 品牌自定义事件的回调
            trademarkInfo(trademark) {
                // 整理参数为“"ID:品牌名称"”的形式
                this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
                this.getData()
            },
            // 删除品牌的信息
            removeTradeMark() {
                // 将品牌信息置空
                this.searchParams.trademark = undefined
                // 再次发请求
                this.getData()
            },
            // 收集平台属性自定义事件的回调
            attrInfo(attr, attrValue) {
                // 整理参数为“["属性ID:属性值:属性名"]”
                const sell = `${attr.attrId}:${attrValue}:${attr.attrName}`
                // 数组去重
                if(this.searchParams.props.indexOf(sell) == -1) {
                    this.searchParams.props.push(sell)
                }
                // 再次发请求
                this.getData()
            },
            // 删除平台售卖属性
            removeProps(index) {
                // 将指定的平台属性删除 --- 再次整理参数
                this.searchParams.props.splice(index, 1)
                // 再次发请求
                this.getData()
            },
            // 排序的操作
            // flag形参：它是一个标记，用来分辨用户点击的是【综合】还是【价格】（由其值是1还是2来决定）
            changeOrder(flag) {
                // originOrder代表是的默认order（获取起始状态的数据）
                const originOrder = this.searchParams.order
                // 分别获取到默认order的编号和排序标识
                const originFlag = originOrder.split(':')[0]
                const originSort = originOrder.split(':')[1]
                // 准备一个新的order属性值
                let newOrder = ''
                // 判断当前点的是【综合】还是【价格】（也就是判断多次点击的是不是同一个按钮）
                if(flag == originFlag) {
                    newOrder = `${flag}:${originSort == 'desc' ? 'asc' : 'desc'}`
                }else {
                    // 切换到另一个按钮时，默认都是降序
                    newOrder = `${flag}:${'desc'}`
                }
                // 将新的newOrder赋给order
                this.searchParams.order = newOrder
                // 再次发请求
                this.getData()
            },
            // 获取当前第几页 --- 自定义事件的回调函数
            getPageNo(pageNo) {
                // 整理分页器传过来的参数
                this.searchParams.pageNo = pageNo
                // 再次发请求
                this.getData()
            }
        },
        // 数据监听：监听组件实例对象上属性的属性值变化
        watch: {
            // 监听路由的信息是否发生变化，如果发生变化，就再次发起请求获取服务器数据
            $route() {
                // 再次发请求之时整理好带给服务器的参数
                Object.assign(this.searchParams, this.$route.query, this.$route.params)
                // 再次发起ajax请求
                this.getData()
                // 每次请求完毕后，要将相应的1、2、3级分类的id置空，让它接收下一次1、2、3级分类的id
                // 分类名称与关键字不用清除：因为每一次路由发生变化的时候，都会给它重新赋予新的数据
                this.searchParams.category1id = undefined
                this.searchParams.category2id = undefined
                this.searchParams.category3id = undefined
            }
        },
    }
</script>

<style lang="less" scoped>
    .main {
        margin: 10px 0;

        .py-container {
            width: 1200px;
            margin: 0 auto;

            .bread {
                margin-bottom: 5px;
                overflow: hidden;

                .sui-breadcrumb {
                    padding: 3px 15px;
                    margin: 0;
                    font-weight: 400;
                    border-radius: 3px;
                    float: left;

                    li {
                        display: inline-block;
                        line-height: 18px;

                        a {
                            color: #666;
                            text-decoration: none;

                            &:hover {
                                color: #4cb9fc;
                            }
                        }
                    }
                }

                .sui-tag {
                    margin-top: -5px;
                    list-style: none;
                    font-size: 0;
                    line-height: 0;
                    padding: 5px 0 0;
                    margin-bottom: 18px;
                    float: left;

                    .with-x {
                        font-size: 12px;
                        margin: 0 5px 5px 0;
                        display: inline-block;
                        overflow: hidden;
                        color: #000;
                        background: #f7f7f7;
                        padding: 0 7px;
                        height: 20px;
                        line-height: 20px;
                        border: 1px solid #dedede;
                        white-space: nowrap;
                        transition: color 400ms;
                        cursor: pointer;

                        i {
                            margin-left: 10px;
                            cursor: pointer;
                            font: 400 14px tahoma;
                            display: inline-block;
                            height: 100%;
                            vertical-align: middle;
                        }

                        &:hover {
                            color: #28a3ef;
                        }
                    }
                }
            }

            .details {
                margin-bottom: 5px;

                .sui-navbar {
                    overflow: visible;
                    margin-bottom: 0;

                    .filter {
                        min-height: 40px;
                        padding-right: 20px;
                        background: #fbfbfb;
                        border: 1px solid #e2e2e2;
                        padding-left: 0;
                        border-radius: 0;
                        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

                        .sui-nav {
                            position: relative;
                            left: 0;
                            display: block;
                            float: left;
                            margin: 0 10px 0 0;

                            li {
                                float: left;
                                line-height: 18px;

                                a {
                                    display: block;
                                    cursor: pointer;
                                    padding: 11px 15px;
                                    color: #777;
                                    text-decoration: none;
                                }

                                &.active {
                                    a {
                                        background: #e1251b;
                                        color: #fff;
                                    }
                                }
                            }
                        }
                    }
                }

                .goods-list {
                    margin: 20px 0;

                    ul {
                        display: flex;
                        flex-wrap: wrap;

                        li {
                            height: 100%;
                            width: 20%;
                            margin-top: 10px;
                            line-height: 28px;

                            .list-wrap {
                                .p-img {
                                    padding-left: 15px;
                                    width: 215px;
                                    height: 255px;

                                    a {
                                        color: #666;

                                        img {
                                            max-width: 100%;
                                            height: auto;
                                            vertical-align: middle;
                                        }
                                    }
                                }

                                .price {
                                    padding-left: 15px;
                                    font-size: 18px;
                                    color: #c81623;

                                    strong {
                                        font-weight: 700;

                                        i {
                                            margin-left: -5px;
                                        }
                                    }
                                }

                                .attr {
                                    padding-left: 15px;
                                    width: 85%;
                                    overflow: hidden;
                                    margin-bottom: 8px;
                                    min-height: 38px;
                                    cursor: pointer;
                                    line-height: 1.8;
                                    display: -webkit-box;
                                    -webkit-box-orient: vertical;
                                    -webkit-line-clamp: 2;

                                    a {
                                        color: #333;
                                        text-decoration: none;
                                    }
                                }

                                .commit {
                                    padding-left: 15px;
                                    height: 22px;
                                    font-size: 13px;
                                    color: #a7a7a7;

                                    span {
                                        font-weight: 700;
                                        color: #646fb0;
                                    }
                                }

                                .operate {
                                    padding: 12px 15px;

                                    .sui-btn {
                                        display: inline-block;
                                        padding: 2px 14px;
                                        box-sizing: border-box;
                                        margin-bottom: 0;
                                        font-size: 12px;
                                        line-height: 18px;
                                        text-align: center;
                                        vertical-align: middle;
                                        cursor: pointer;
                                        border-radius: 0;
                                        background-color: transparent;
                                        margin-right: 15px;
                                    }

                                    .btn-bordered {
                                        min-width: 85px;
                                        background-color: transparent;
                                        border: 1px solid #8c8c8c;
                                        color: #8c8c8c;

                                        &:hover {
                                            border: 1px solid #666;
                                            color: #fff !important;
                                            background-color: #666;
                                            text-decoration: none;
                                        }
                                    }

                                    .btn-danger {
                                        border: 1px solid #e1251b;
                                        color: #e1251b;

                                        &:hover {
                                            border: 1px solid #e1251b;
                                            background-color: #e1251b;
                                            color: white !important;
                                            text-decoration: none;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                .page {
                    width: 830px;
                    height: 66px;
                    overflow: hidden;
                    float: right;

                    .sui-pagination {
                        margin: 18px 0;

                        ul {
                            margin-left: 0;
                            margin-bottom: 0;
                            vertical-align: middle;
                            width: 490px;
                            float: left;

                            li {
                                line-height: 18px;
                                display: inline-block;

                                a {
                                    position: relative;
                                    float: left;
                                    line-height: 18px;
                                    text-decoration: none;
                                    background-color: #fff;
                                    border: 1px solid #e0e9ee;
                                    margin-left: -1px;
                                    font-size: 14px;
                                    padding: 9px 18px;
                                    color: #333;
                                }

                                &.active {
                                    a {
                                        background-color: #fff;
                                        color: #e1251b;
                                        border-color: #fff;
                                        cursor: default;
                                    }
                                }

                                &.prev {
                                    a {
                                        background-color: #fafafa;
                                    }
                                }

                                &.disabled {
                                    a {
                                        color: #999;
                                        cursor: default;
                                    }
                                }

                                &.dotted {
                                    span {
                                        margin-left: -1px;
                                        position: relative;
                                        float: left;
                                        line-height: 18px;
                                        text-decoration: none;
                                        background-color: #fff;
                                        font-size: 14px;
                                        border: 0;
                                        padding: 9px 18px;
                                        color: #333;
                                    }
                                }

                                &.next {
                                    a {
                                        background-color: #fafafa;
                                    }
                                }
                            }
                        }

                        div {
                            color: #333;
                            font-size: 28px;
                            float: right;
                            width: 340px;
                        }
                    }
                }
            }
        }
    }
</style>