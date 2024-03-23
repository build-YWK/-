//配置路由的地方

// 引入Vue
import Vue from "vue"
// 引入vue-router
import VueRouter from "vue-router"
// 引入store仓库
import store from "@/store"

// 使用插件
Vue.use(VueRouter)

// 引入路由配置信息routes.js
import routes from "./routes"

/* 
    编程式路由跳转到当前路由（参数不变），多次执行会抛出NavigationDuplicated的警告错误？
    方法二：重写VueRouter原型对象中的push|replace方法，通过在上面新增一个判断来处理程序抛出的异常信息（治本的方法）
    这种方式修改过后再跳转路由就不需要再像第一种方式那样传递回调了
*/
// 先把VueRouter原型对象上的push|replace方法保存一份
// 补充：在package.json文件中的rules中加入"no-unused-vars": "off"，就可以让定义但未使用的变量不再报错（切记要重启）
const originPush = VueRouter.prototype.push
const originReplace = VueRouter.prototype.replace

// 重写push|replace
// 第一个参数：告诉原来的push方法，你往哪里跳转（以及传递哪些参数）
// 第二个参数：成功回调
// 第三个参数：失败回调
VueRouter.prototype.push = function(location, resolve, reject) {
    if(resolve && reject) {     //如果传入了resolve和reject两个回调，则正常执行原来的push方法
        // call与apply的区别：
        // 相同点：都可以调用函数一次，都可以篡改函数的上下文一次
        // 不同点：call与apply传递参数 -- call传递参数用逗号隔开；apply方法执行，传递数组
        originPush.call(this, location, resolve, reject)
    }else {     //否则就执行指定的方法
        originPush.call(this, location, () => {}, () => {})
        /* originPush(this, location, ($router) => {}, (error) => {
            console.log(error)
        }) */
    }
}
VueRouter.prototype.replace = function(location, resolve, reject) {
    if(resolve && reject) {
        originReplace.call(this, location, resolve, reject)
    }else {
        originReplace.call(this, location, () => {}, () => {})
    }
}

// 配置路由
const router = new VueRouter({ 
    // 配置路由信息
    routes,
    // 滚动行为
    scrollBehavior (to, from, savedPosition) {
        // return 期望滚动到哪个的位置
        // 返回的这个y:0，代表的是滚动条在最上方（注意：vue3用的是top:0）
        return { y:0 }
    }
})

// 全局守卫：前置守卫（在路由跳转之前进行判断）
router.beforeEach(async (to, from, next) => {
    // to：可以获取到你要跳转到哪个路由的信息
    // from：可以获取到你从哪个路由而来的信息
    // next：放行函数（三种写法） --- next()：放行；next(path)：放行到指定路由；next(false)；
    // 用户登录了才会有token，未登录一定不会有token
    const token = store.state.user.token
    // 用户信息中的name
    const name = store.state.user.userInfo.name
    // 根据token来判断是否能去登录页面login（有代表已登录，不能去；没有代表未登录，可以去）
    if(token) {
        // 用户已经登录了
        if(to.path == '/login' || to.path == '/register') {
            // 当用户登录后，还想要去登录页面或注册页面，这是不可以的
            next('/home')
        }else {
            // 当用户登录后，去别的页面（正常操作）
            // 这里需要解决一个问题：在其他页面进行刷新操作后，用户的信息会消失（其实就是在其他页面刷新后，没有再次发请求）
            if(name) {
                // 如果用户名已有，放行
                next()
            }else {
                // 如果没有用户名，那么就派发action去获取用户信息
                try {
                    await store.dispatch('getUserInfo')
                    // 获取用户信息成功，放行
                    next()
                } catch (error) {
                    // token失效了获取不到用户信息，需要重新登陆
                    // 清除token并跳转到登录页面
                    alert('请重新登录')
                    await store.dispatch('userLogout')
                    next('/login')
                }
            }
        }
    }else {
        // 用户并未登录，不能去交易相关页面、不能去支付相关页面（pay|paysuccess）、不能去个人中心
        const toPath = to.path
        if(toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1) {
            // 未登录状态要去以上这些路由，就会跳转都登录页面
            // 把未登录的时候想去而没有去成的信息，存储于地址栏中【路由】
            next('/login?redirect=' + toPath)
        }else {
            // 如果去的不是这些路由，就放行（比如home、search等路由）
            next()
        }
    }
})

// 对外暴露
export default router