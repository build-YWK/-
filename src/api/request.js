// 引入axios
import axios from "axios"
// 引入进度条nprogress ———— start：进度条开始；done：进度条结束
import nProgress from "nprogress"
// 引入进度条样式
import "nprogress/nprogress.css"
// 引入store
import store from "@/store"

// 对axios进行二次封装
// 1.利用axios对象的方法create，去创建一个axios实例
// requests其实就是axios，只不过可以稍微配置一下
const requests = axios.create({
    // 配置对象
    // 基础路径，发请求的时候，路径当中会出现api（默认）
    baseURL: "/api",
    // 代表请求超时的时间（5s）
    timeout: 5000
})

// 2.配置请求拦截器：在发请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些事情
requests.interceptors.request.use((config) => {
    // config：配置对象。对象里面有一个属性很重要 --- header请求头
    // 进度条开始动
    if(store.state.detail.uuid_token) {
        // 请求头添加一个字段（userTempId）：该字段是和后台商量好的
        config.headers.userTempId = store.state.detail.uuid_token
    }
    // 需要携带token给服务器
    if(store.state.user.token) {
        config.headers.token = store.state.user.token
    }
    nProgress.start()
    return config
})

// 3.配置响应拦截器
requests.interceptors.response.use((res) => {
    // 成功的回调函数：服务器响应数据回来以后，响应拦截器可以检测到，可以做一些事情
    // 进度条结束
    nProgress.done()
    return res.data
}, (error) => {
    // 响应失败的回调函数
    return Promise.reject(new Error('faile'))
})

// 4.对外暴露
export default requests