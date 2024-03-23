// 引入接口
import { reqAddressInfo, reqOrderInfo } from "@/api"

// trade模块的小仓库
const actions = {
    // 获取用户地址信息
    async getUserAddress({commit}) {
        const result = await reqAddressInfo()
        if(result.code == 200) {
            commit('GETUSERADDRESS', result.data)
        }
    },
    // 获取订单交易页信息
    async getOrderInfo({commit}) {
        const result = await reqOrderInfo()
        if(result.code == 200) {
            commit('GETORDERINFO', result.data)
        }
    }
}

const mutations = {
    GETUSERADDRESS(state, address) {
        state.address = address
    },
    GETORDERINFO(state, orderInfo) {
        state.orderInfo = orderInfo
    }
}

const state = {
    // 用户地址信息
    address: [],
    // 订单交易页信息
    orderInfo: {}
}

export default {
    actions,
    mutations,
    state
}