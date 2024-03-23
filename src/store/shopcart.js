// 引入接口
import { reqCartList, reqDeleteCartById, reqUpdateCheckedById } from "@/api"

// shopcart模块下的小仓库
const actions = {
    // 获取购物车列表数据
    async getCartList({commit}) {
        const result = await reqCartList()
        if(result.code == 200) {
            commit('GETCARTLIST', result.data)
        }
    },
    // 删除购物车某一个产品
    async deleteCartListBySkuId({commit}, skuId) {
        const result = await reqDeleteCartById(skuId)
        if(result.code == 200) {
            return 'ok'
        }else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 修改购物车某一个产品的选中状态
    async updateCheckedById({commit}, {skuId, isChecked}) {
        const result = await reqUpdateCheckedById(skuId, isChecked)
        if(result.code == 200) {
            return 'ok'
        }else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 删除全部勾选的产品
    deleteAllCheckedCart({dispatch, getters}) {
        // context：小仓库 --> commit（提交mutations修改state） getters（计算属性） dispatch（派发action） state（当前仓库的数据）
        // 获取购物车中全部的产品（数组）
        let promiseAll = []
        getters.cartList.cartInfoList.forEach(item => {
            let promise = item.isChecked == 1 ? dispatch('deleteCartListBySkuId', item.skuId) : ''
            promiseAll.push(promise)
        })
        // 只要全部的p1|p2...都成功，那么返回结果即为成功
        // 如果有一个失败了，那么返回结果即为失败
        return Promise.all(promiseAll)
    },
    // 修改全部产品的选中状态
    updateAllCartIsChecked({dispatch, state}, isChecked) {
        let promiseAll = []
        state.cartList[0].cartInfoList.forEach(item => {
            let promise = dispatch('updateCheckedById', {
                skuId: item.skuId,
                isChecked
            })
            promiseAll.push(promise)
        })
        return Promise.all(promiseAll)
    }
}

const mutations = {
    GETCARTLIST(state, cartList) {
        state.cartList = cartList
    }
}

const state = {
    cartList: []
}

const getters = {
    cartList(state) {
        return state.cartList[0] || {}
    }
}

export default {
    actions,
    mutations,
    state,
    getters
}