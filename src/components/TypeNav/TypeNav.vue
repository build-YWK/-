<template>
    <!-- 商品分类导航（三级联动） -->
    <div class="type-nav">
        <div class="container">
            <!-- 事件委派|事件委托 —— 委托给父元素去处理鼠标移出事件 -->
            <div @mouseleave="leaveIndex" @mouseenter="enterShow">
                <h2 class="all">全部商品分类</h2>
                <!-- 
                    三级联动：如果使用声明式导航router-link，是可以实现路由的跳转与传递参数
                    但是需要注意的是，会出现卡顿现象。
                    原因：router-link是一个全局组件，那么当服务器的数据返回之后，会循环出很多的router-link组件【创建组件实例的】1000+
                    创建组件实例的时候，一瞬间创建1000+是很耗内存的，因此出现了卡顿现象。
                    所以这里需要使用编程式导航。
                -->
                <!-- 过渡动画 -->
                <transition name="sort">
                    <div class="sort" v-show="show">
                        <!-- 利用事件委派 + 编程式导航 + 自定义属性实现路由的跳转与传递参数 -->
                        <div class="all-sort-list2" @click="goSearch">
                            <!-- 一级分类 -->
                            <div class="item" v-for="(c1, index) in categoryList" :key="c1.categoryId"
                                :class="{ active: currentIndex == index }">
                                <h3 @mouseenter="changeIndex(index)">
                                    <!-- 在a标签中href属性设置为javascript:void(0)就可以取消默认行为，即本页面刷新 -->
                                    <!-- 给a标签加上自定义属性data-categoryName，这样根据有没有自定义属性data-categoryName来判断是否是a标签 -->
                                    <!-- 给a标签再加上一个自定义属性data-category1Id，用来分辨一级、二级和三级分类 -->
                                    <a href="javascript:void(0)" :data-categoryName="c1.categoryName"
                                        :data-category1Id="c1.categoryId">{{ c1.categoryName }}</a>
                                </h3>
                                <!-- 二级、三级分类 -->
                                <!-- 动态显示二级、三级分类（通过动态的绑定样式） -->
                                <div class="item-list clearfix"
                                    :style="{ display: currentIndex == index ? 'block' : 'none' }">
                                    <div class="subitem" v-for="c2 in c1.categoryChild" :key="c2.categoryId">
                                        <dl class="fore">
                                            <dt>
                                                <!-- 也可以通过设置href属性为javascript:;来取消默认行为 -->
                                                <a href="javascript:;" :data-categoryName="c2.categoryName"
                                                    :data-category2Id="c2.categoryId">{{ c2.categoryName
                                                    }}</a>
                                            </dt>
                                            <dd>
                                                <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                                                    <a href="javascript:;" :data-categoryName="c3.categoryName"
                                                        :data-category3Id="c3.categoryId">{{
                                                            c3.categoryName }}</a>
                                                </em>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <nav class="nav">
                <a href="javascript:;">服装城</a>
                <a href="javascript:;">美妆馆</a>
                <a href="javascript:;">尚品汇超市</a>
                <a href="javascript:;">全球购</a>
                <a href="javascript:;">闪购</a>
                <a href="javascript:;">团购</a>
                <a href="javascript:;">有趣</a>
                <a href="javascript:;">秒杀</a>
            </nav>
        </div>
    </div>
</template>
    
<script>
    import { mapState } from 'vuex'
    // 引入lodash（该引入方式，是把lodash全部功能函数都引入了）
    // import _ from 'lodash'
    // 最好的方式就是：按需加载
    import throttle from 'lodash/throttle'

    export default {
        name: 'TypeNav',
        data() {
            return {
                // 存储用户鼠标移上哪一个一级分类
                currentIndex: -1,
                // 三级联动是否显示（默认显示）
                show: true
            }
        },
        // 发请求经常在mounted生命周期函数中进行
        // 组件挂载完毕：可以向服务器发请求
        mounted() {
            // 当组件挂载完毕后，让show属性值变为false
            this.show = this.$route.path == '/home' ? true : false
        },
        computed: {
            // 对象的写法
            ...mapState({
                // 右侧需要的是一个函数，当使用这个计算属性的时候，右侧函数会立即执行一次
                // 注入一个参数state，其实就是大仓库中的数据
                // 这里获取的数据多了一条，如果不截取掉，对页面整体布局有影响（不好看）
                categoryList: state => state.home.categoryList.slice(0, 16)
            })
        },
        methods: {
            // 鼠标进入修改响应式数据currentIndex属性
            // 使用节流：通过节流让频繁触发变为少量触发
            // 注意：throttle回调函数别用箭头函数，可能出现上下文this指向问题
            changeIndex: throttle(function (index) {
                // index：鼠标移上某一个一级分类的元素的索引值
                // 正常情况（用户慢慢的操作）：鼠标进入，每一个一级分类h3，都会触发鼠标进入事件
                // 非正常情况（用户操作很快）：本身全部的一级分类都应该触发鼠标进入事件，但是经过测试，只有部分h3触发了
                // 就是由于用户行为过快，导致浏览器反应不过来。如果当前回调函数中有一些大量业务，有可能出现卡顿现象
                this.currentIndex = index
            }, 10),
            // 一级分类鼠标移出的事件回调
            leaveIndex() {
                this.currentIndex = -1
                // 在search页面时，当鼠标离开的时候，就隐藏商品列表
                if (this.$route.path != '/home') {
                    this.show = false
                }
            },
            // 进行路由跳转并传递参数
            goSearch(event) {
                // 如果将事件都绑定在a标签中，那么就可能会有很多的goSearch事件，这就很耗内存了
                // 最好的解决方案：编程式导航 + 事件委派
                /*
                    存在一些问题：
                        1.事件委派，是把全部的子节点【h3、dt、dl、em、a等】的事件委派给父节点
                        2.实际需求：点击a标签的时候，才会进行路由跳转
                            【问题1：如何能确定点击的就一定是a标签呢？】
                            【问题2：即便能够确定点击的是a标签，那么又该如何区分是一级、二级还是三级分类的标签呢？】
                */
                // 第一个问题：把子节点中的a标签，加上自定义属性data-categoryName，其余的子节点是没有的
                // 获取到当前触发这个事件的节点（比如h3、dt、dl等），但带有data-categoryname（浏览器编译后变为小写）这样的节点才是一定是a标签
                const element = event.target
                // 节点有一个dataset属性，可以获取到节点的自定义属性与属性值（新知识点）
                const { categoryname, category1id, category2id, category3id } = element.dataset
                // 判断：如果标签身上有categoryname就一定是a标签
                if (categoryname) {
                    // 整理路由传递的参数
                    const location = { name: 'search' }
                    const query = { categoryName: categoryname }
                    // 第二个问题：给a标签再加一个自定义属性，不同的分类不同的自定义属性就可以区分出了
                    // 用户点击哪个分类，就传递哪个分类的id
                    if (category1id) {
                        query.category1id = category1id
                    } else if (category2id) {
                        query.category2id = category2id
                    } else {
                        query.category3id = category3id
                    }
                    // 判断是否有param参数，如果有就一起传递过去
                    if(this.$route.params) {
                        // 整理完参数，全部汇总到location
                        location.query = query
                        location.params = this.$route.params
                    }
                    // 路由跳转并传递参数
                    this.$router.push(location)
                }
            },
            // 在search页面鼠标一移入就显示三级联动
            enterShow() {
                if (this.$route.path != '/home') {
                    this.show = true
                }
            }
        },
    }
</script>

<style scoped lang="less">
    .type-nav {
        border-bottom: 2px solid #e1251b;

        .container {
            width: 1200px;
            margin: 0 auto;
            display: flex;
            position: relative;

            .all {
                width: 210px;
                height: 45px;
                background-color: #e1251b;
                line-height: 45px;
                text-align: center;
                color: #fff;
                font-size: 14px;
                font-weight: bold;
            }

            .nav {
                a {
                    height: 45px;
                    margin: 0 22px;
                    line-height: 45px;
                    font-size: 16px;
                    color: #333;
                }
            }

            .sort {
                position: absolute;
                left: 0;
                top: 45px;
                width: 210px;
                height: 462px;
                position: absolute;
                background: #fafafa;
                z-index: 999;

                .all-sort-list2 {
                    .item {
                        h3 {
                            line-height: 30px;
                            font-size: 14px;
                            font-weight: 400;
                            overflow: hidden;
                            padding: 0 20px;
                            margin: 0;

                            a {
                                color: #333;
                            }
                        }

                        .item-list {
                            display: none;
                            position: absolute;
                            width: 734px;
                            min-height: 460px;
                            background: #f7f7f7;
                            left: 210px;
                            border: 1px solid #ddd;
                            top: 0;
                            z-index: 9999 !important;

                            .subitem {
                                float: left;
                                width: 650px;
                                padding: 0 4px 0 8px;

                                dl {
                                    border-top: 1px solid #eee;
                                    padding: 6px 0;
                                    overflow: hidden;
                                    zoom: 1;

                                    &.fore {
                                        border-top: 0;
                                    }

                                    dt {
                                        float: left;
                                        width: 54px;
                                        line-height: 22px;
                                        text-align: right;
                                        padding: 3px 6px 0 0;
                                        font-weight: 700;
                                    }

                                    dd {
                                        float: left;
                                        width: 415px;
                                        padding: 3px 0 0;
                                        overflow: hidden;

                                        em {
                                            float: left;
                                            height: 14px;
                                            line-height: 14px;
                                            padding: 0 8px;
                                            margin-top: 5px;
                                            border-left: 1px solid #ccc;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // 第一种方式：采用样式完成
                    /* .item:hover {
                                    background: skyblue;
                                } */

                    // 第二种方式：使用JS来实现（动态的添加样式）
                    .active {
                        background: skyblue;
                    }
                }
            }
            // 过渡动画的样式
            // 过渡动画进入的起点、离开的终点
            .sort-enter, .sort-leave-to {
                height: 0px;
                opacity: 0;
            }

            .sort-enter-active, .sort-leave-active {
                overflow: hidden;
                transition: all 0.5s linear;
            }

            // 过渡动画进入的终点、离开的起点
            .sort-enter-to, .sort-leave {
                height: 461px;
                opacity: 1;
            }
        }
    }
</style>