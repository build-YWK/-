// 引入接口
import { reqGetCategoryList, reqGetBannerList, reqGetFloorList } from "@/api"

// home模块的小仓库
// actions是响应组件中用户的动作
const actions = {
    // 通过API里面的接口函数调用，向服务器发请求，获取服务器的数据
    async getCategoryList({commit}) {
        const result = await reqGetCategoryList()
        if(result.code == 200) {
            commit('GETCATEGORYLIST', result.data)
        }
    },
    // 获取首页轮播图的数据（ListContainer路由组件）
    async getBannerList({commit}) {
        const result = await reqGetBannerList()
        if(result.code == 200) {
            commit('GETBANNERLIST', result.data)
        }
    },
    // 获取floor轮播图的数据
    async getFloorList({commit}) {
        const result = await reqGetFloorList()
        if(result.code == 200) {
            commit('GETFLOORLIST', result.data)
        }
    }
}

// mutations是唯一修改state的地方
const mutations = {
    GETCATEGORYLIST(state, categoryList) {
        state.categoryList = categoryList
    },
    GETBANNERLIST(state, bannerList) {
        state.bannerList = bannerList
    },
    GETFLOORLIST(state, floorList) {
        state.floorList = floorList
    }
}

// state是保存具体的数据
const state = {
    // home仓库中存储三级菜单的数据
    categoryList: [],
    // 轮播图的数据（ListContainer路由组件）
    bannerList: [],
    // 轮播图的数据（MyFloor路由组件）
    floorList: []
}


export default {
    actions,
    mutations,
    state
}