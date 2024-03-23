// 引入Vue
import Vue from 'vue'
// 引入Vuex
import Vuex from 'vuex'
// 使用Vuex插件
Vue.use(Vuex)

// 引入不同模块的小仓库
import home from './home'
import search from './search'
import detail from './detail'
import shopcart from './shopcart'
import user from './user'
import trade from './trade'

// 对外暴露Store类的一个实例
export default new Vuex.Store({
    // Vuex的模块化开发 ———— 其实就是将原本由一个大仓库管理所有的数据变为一个大仓库管理一个个小仓库，而小仓库管理相对应的模块数据
    modules: {
        home,
        search,
        detail,
        shopcart,
        user,
        trade
    }
})