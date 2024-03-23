<template>
    <!-- 头部 -->
    <header class="header">
        <!-- 头部的第一行 -->
        <div class="top">
            <div class="container">
                <div class="loginList">
                    <p>尚品汇欢迎您！</p>
                    <!-- 无用户名：未登录状态 -->
                    <p v-if="!userName">
                        <span>请</span>
                        <!-- 声明式导航：务必要有to属性 -->
                        <router-link to="/login">登录</router-link>
                        <router-link class="register" to="/register">免费注册</router-link>
                    </p>
                    <!-- 有用户名：登录状态 -->
                    <p v-else>
                        <a href="javascript:;">{{ userName }}</a>
                        <a href="javascript:;" class="register" @click="logout">退出登录</a>
                    </p>
                </div>
                <div class="typeList">
                    <router-link to="/center/myorder">我的订单</router-link>
                    <router-link to="/shopcart">我的购物车</router-link>
                    <a href="javascript:;">我的尚品汇</a>
                    <a href="javascript:;">尚品汇会员</a>
                    <a href="javascript:;">企业采购</a>
                    <a href="javascript:;">关注尚品汇</a>
                    <a href="javascript:;">合作招商</a>
                    <a href="javascript:;">商家后台</a>
                </div>
            </div>
        </div>
        <!--头部第二行 搜索区域-->
        <div class="bottom">
            <h1 class="logoArea">
                <router-link class="logo" to="/home">
                    <img src="./images/logo.png" alt="">
                </router-link>
            </h1>
            <div class="searchArea">
                <form action="###" class="searchForm">
                    <input type="text" id="autocomplete" class="input-error input-xxlarge" v-model="keyword" />
                    <button class="sui-btn
                            btn-xlarge btn-danger" type="button" @click="goSearch">
                        搜索
                    </button>
                </form>
            </div>
        </div>
    </header>
</template>
    
<script>
    export default {
        name: 'MyHeader',
        data() {
            return {
                keyword: ''
            }
        },
        methods: {
            // 搜索按钮的回调函数：需要向MySearch路由进行跳转
            goSearch() {
                const location = {
                    name: 'search',
                    params: {
                        keyword: this.keyword || undefined
                    }
                }
                // 判断是否有query参数，如果有就一起传递过去
                if(this.$route.query) {
                    location.query = this.$route.query
                }
                // 路由跳转并传递参数
                this.$router.push(location)

                // 路由传递参数：
                // 第一种：字符串形式
                // this.$router.push('/search/' + this.keyword + "?k=" + this.keyword.toUpperCase())

                // 第二种：模板字符串
                // this.$router.push(`/search/${this.keyword}?k=${this.keyword.toUpperCase()}`)

                // 第三种：对象的写法
                /* this.$router.push({
                    name: 'search',
                    params: {
                        keyword: this.keyword
                    }
                }) */

                /* 
                    编程式路由跳转到当前路由（参数不变），多次执行会抛出NavigationDuplicated的警告错误？
                        1.路由跳转有两种形式：声明式导航、编程式导航。
                        2.声明式导航没有这类问题的，因为vue-router底层已经处理好了。
                    为什么编程式导航进行路由跳转的时候，会有这种情况呢？
                        原因：触发这种情况是因为vue-router中引入了primise，当传递了多次重复的参数就会抛出异常。
                    解决方法：
                        路由的push和replace都是VueRouter原型对象上的一个方法，所以每次路由跳转的时候都是通过这两个方法
                        来实现，而这两个方法提供了三个参数，即VueRouter.prototype.push(location,resolve,reject)：
                            1.包含了路由以及携带参数的location
                            2.成功回调resolve
                            3.失败回调reject
                    那么方法一是：
                        通过给push|replace方法传递相应的成功与失败回调函数来处理异常，可以捕获到当前错误，可以解决。
                    具体代码如下所示：

                    注意：这种写法“治标不治本”，将来在别的组件当中push|replace，编程式导航还是有类似的错误。
                    缺点：每次调用都需要传递成功与失败的回调（组件数量少还行，但是如果组件数量过多，就显得很麻烦了）
                */
                /* this.$router.push(
                    {   //第一个参数包含了路由跳转的一些信息，也就是router-link中的to，push方法中的location
                        name: 'search',
                        params: {
                            keyword: this.keyword
                        },
                        query: {
                            k: this.keyword.toUpperCase()
                        },
                    },
                    //第二个参数是成功后的回调，可以通过第一个参数接收到$router对象
                    ($router) => {console.log($router)},
                    //第三个参数是失败后的回调，导航重复执行会在此处抛出异常
                    (error) => {console.log(error)}
                ) */

                /* 面试题1：路由传递参数（对象写法）path是否可以结合params参数一起使用？
                答：路由跳转传参的时候，对象的写法可以是name、path形式，但是需要注意的是，path这种写法不能与params参数一起使用
                this.$router.push({
                    path: '/search',
                    params: {
                        keyword: this.keyword
                    },
                    query: {
                        k: this.keyword.toUpperCase()
                    }
                }) */

                /* 面试题2：如何指定params参数可传可不传？
                如果路由要求传递params参数，但是你就不传递params参数，此时会发现一件事情，URL会有问题的。
                我们预想的路径是http://localhost:8080/#/search?k=ABC，可结果其路径却变为了http://localhost:8080/#/?k=ABC，这很明显是出问题了
                答：如何指定params参数可以传递或不传递 -- 在配置路由的时候，在占位的后面加上一个问号【?表示params可传可不传】
                this.$router.push({
                    name: 'search',
                    query: {
                        k: this.keyword.toUpperCase()
                    }
                }) */

                /* 面试题3：params参数可以传递也可以不传递，但是如果传递的是空串，如何解决？
                同样的，其路径发生了问题，缺少了search（http://localhost:8080/#/?k=ABC）
                答：使用undefined解决 -- params参数可以传递也可不传递（传递时为空的字符串）
                this.$router.push({
                    name: 'search',
                    params: {
                        // 传递一个空串
                        keyword: '' || undefined
                    },
                    query: {
                        k: this.keyword.toUpperCase()
                    }
                }) */

                /* 面试题4：路由组件能不能传递props数据？
                答：是可以的，且有三种写法（布尔值、对象、函数）
                this.$router.push({
                    name: 'search',
                    params: {
                        keyword: this.keyword
                    },
                    query: {
                        k: this.keyword.toUpperCase()
                    }
                }) */
            },
            // 退出登录的回调
            async logout() {
                // 退出登录需要做的事情
                // 1.发请求：通知服务器退出登录（清除一些数据，比如：token）
                // 2.清除项目当中的数据【userInfo、token】
                try {
                    await this.$store.dispatch('userLogout')
                    // 如果退出登录成功，就回到首页
                    this.$router.push('/home')
                } catch (error) {
                    alert(error.message)
                }
            }
        },
        mounted() {
            // 通过全局事件总线清除关键字
            this.$bus.$on('clear', () => {
                this.keyword = ''
            })
        },
        computed: {
            userName() {
                return this.$store.state.user.userInfo.name
            }
        },
    }
</script>

<style scoped lang="less">
    .header {
        &>.top {
            background-color: #eaeaea;
            height: 30px;
            line-height: 30px;

            .container {
                width: 1200px;
                margin: 0 auto;
                overflow: hidden;

                .loginList {
                    float: left;

                    p {
                        float: left;
                        margin-right: 10px;

                        .register {
                            border-left: 1px solid #b3aeae;
                            padding: 0 5px;
                            margin-left: 5px;
                        }
                    }
                }

                .typeList {
                    float: right;

                    a {
                        padding: 0 10px;

                        &+a {
                            border-left: 1px solid #b3aeae;
                        }
                    }

                }

            }
        }

        &>.bottom {
            width: 1200px;
            margin: 0 auto;
            overflow: hidden;

            .logoArea {
                float: left;

                .logo {
                    img {
                        width: 175px;
                        margin: 25px 45px;
                    }
                }
            }

            .searchArea {
                float: right;
                margin-top: 35px;

                .searchForm {
                    overflow: hidden;

                    input {
                        box-sizing: border-box;
                        width: 490px;
                        height: 32px;
                        padding: 0px 4px;
                        border: 2px solid #ea4a36;
                        float: left;

                        &:focus {
                            outline: none;
                        }
                    }

                    button {
                        height: 32px;
                        width: 68px;
                        background-color: #ea4a36;
                        border: none;
                        color: #fff;
                        float: left;
                        cursor: pointer;

                        &:focus {
                            outline: none;
                        }
                    }
                }
            }
        }
    }
</style>