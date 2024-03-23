// 引入接口
import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqLogout } from "@/api"
// 引入函数
import { setToken, getToken, removeToken } from "@/utils/token"

// 登录与注册的模块
const actions = {
    // 获取验证码
    async getCode({commit}, phone) {
        const result = await reqGetCode(phone)
        if(result.code == 200) {
            commit('GETCODE', result.data)
            return 'ok'
        }else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 用户注册
    async userRegister({commit}, userInfo) {
        const result = await reqUserRegister(userInfo)
        if(result.code == 200) {
            return 'ok'
        }else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 用户登录
    async userLogin({commit}, userInfo) {
        const result = await reqUserLogin(userInfo)
        // 服务器下发token，代表用户唯一的标识符（uuid）
        // 将来经常通过带token找服务器要用户信息进行展示
        if(result.code == 200) {
            // 用户已经成功登录且获取到token
            commit('USERLOGIN', result.data.token)
            // 持久化存储token
            setToken(result.data.token)
            return 'ok'
        }else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 获取用户信息
    async getUserInfo({commit}) {
        const result = await reqUserInfo()
        if(result.code == 200) {
            commit('GETUSERINFO', result.data)
            return 'ok'
        }else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 退出登录
    async userLogout({commit}) {
        // 只是向服务器发起了一次请求，通知服务器清除token
        const result = await reqLogout()
        if(result.code == 200) {
            commit('CLEARUSERINFO')
            return 'ok'
        }else {
            return Promise.reject(new Error('faile'))
        }
    }
}

const mutations = {
    GETCODE(state, code) {
        state.code = code
    },
    USERLOGIN(state, token) {
        state.token = token
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo
    },
    // 清除本地数据
    CLEARUSERINFO(state) {
        // 将仓库中关于用户信息的数据清空
        state.token = ''
        state.userInfo = {}
        // 将本地存储的数据清空
        removeToken()
    }
}

const state = {
    // 验证码
    code: '',
    token: getToken(),
    userInfo: {}
}

export default {
    actions,
    mutations,
    state
}