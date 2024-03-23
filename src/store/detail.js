// 引入接口
import { reqGoodsInfo, reqAddOrUpdateShopCart } from "@/api"
// 封装的游客身份模块uuid ---> 生成一个随机的字符串（生成后就不能再变了）
import { getUUID } from "@/utils/uuid_token"

// detail模块的小仓库
const actions = {
    // 获取产品信息的action
    async getGoodsInfo({commit}, skuId) {
        const result = await reqGoodsInfo(skuId)
        if(result.code == 200) {
            commit('GETGOODSINFO', result.data)
        }
    },
    // 添加产品到购物车（或更新某个产品的个数）
    async addOrUpdateShopCart({commit}, {skuId, skuNum}) {
        // 加入购物车（发请求）之后，前台将参数带给服务器
        // 服务器写入数据成功后，并没有返回其他的数据，只是返回code = 200，来代表这次操作成功了
        // 因为服务器没有返回其余数据，所以并不需要三连环存储数据
        const result = await reqAddOrUpdateShopCart(skuId, skuNum)
        // 当前这个函数如果执行返回的是Promise
        if(result.code == 200) {
            // 代表服务器加入购物车成功
            return 'ok'
        }else {
            // 代表服务器加入购物车失败
            return Promise.reject(new Error('faile'))
        }
    }
}

const mutations = {
    GETGOODSINFO(state, goodsInfo) {
        state.goodsInfo = goodsInfo
    }
}

const state = {
    goodsInfo: {},
    // 游客的临时身份
    uuid_token: getUUID()
}

const getters = {
    // 路径导航简化的数据
    categoryView(state) {
        return state.goodsInfo.categoryView || {}
    },
    // 商品信息简化的数据
    skuInfo(state) {
        return state.goodsInfo.skuInfo || {}
    },
    // 商品售卖属性简化的数据
    spuSaleAttrList(state) {
        return state.goodsInfo.spuSaleAttrList || []
    }
}

export default {
    actions,
    mutations,
    state,
    getters
}