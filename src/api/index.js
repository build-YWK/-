// 当前这个模块：对所有的API接口进行统一管理
// 引入二次封装的axios（带有请求、响应的拦截器）
import requests from "./request"
import mockRequests from '@/api/mockRequest'

// 三级联动接口
// 请求地址：/api/product/getBaseCategoryList   get请求   无参数
export const reqGetCategoryList = () => {
    // 发请求：axios发请求返回结果为Promise对象
    return requests({
        // 这里的url就不再需要加上api，因为axios二次封装已经设置了
        url: '/product/getBaseCategoryList',
        method: 'get'
    })
}


// 获取banner（Home首页轮播图接口）
export const reqGetBannerList = () => mockRequests.get('/banner')
// 获取floor数据
export const reqGetFloorList = () => mockRequests.get('/floor')


// 获取搜索模块的数据
// 请求地址：/api/list    请求方式：post    需要带参数
// 当前这个接口，给服务器传递一个默认参数（至少是一个空对象）———— 如果不传一个默认参数，将获取不到服务器数据（code=201）
export const reqGetSearchInfo = (params) => requests({
    url: '/list',
    method: 'post',
    data: params
})


// 获取产品详情信息的接口
// 请求地址：/api/item/{skuId}    请求方式：get    必须带参数
export const reqGoodsInfo = (skuId) => requests({
    url: `/item/${skuId}`,
    method: 'get'
})


// 将产品添加到购物车中（或者更新某一个产品的个数）
// 请求地址：/api/cart/addToCart/{skuId}/{skuNum}   请求方式：post   必须带参数
export const reqAddOrUpdateShopCart = (skuId, skuNum) => requests({
    url: `/cart/addToCart/${skuId}/${skuNum}`,
    method: 'post'
})


// 获取购物车列表数据的接口
// 请求地址：/api/cart/cartList     请求方式：get      无参数
export const reqCartList = () => requests({
    url: '/cart/cartList',
    method: 'get'
})


// 删除购物车产品的接口
// 请求地址：/api/cart/deleteCart/{skuId}       请求方式：DELETE        必须带参数
export const reqDeleteCartById = (skuId) => requests({
    url: `/cart/deleteCart/${skuId}`,
    method: 'delete'
})


// 修改商品的选中状态的接口
// 请求地址：/api/cart/checkCart/{skuId}/{isChecked}        请求方式：get       必须带参数
export const reqUpdateCheckedById = (skuId, isChecked) => requests({
    url: `/cart/checkCart/${skuId}/${isChecked}`,
    method: 'get'
})


// 获取验证码的接口
// 请求地址：/api/user/passport/sendCode/{phone}     请求方式：get     必须带参数
export const reqGetCode = (phone) => requests({
    url: `/user/passport/sendCode/${phone}`,
    method: 'get'
})


// 用户注册的接口
// 请求地址：/api/user/passport/register      请求方式：post       必须带参数（phone、password、code）
export const reqUserRegister = (data) => requests({
    url: '/user/passport/register',
    method: 'post',
    data
})


// 用户登录的接口
// 请求地址：/api/user/passport/login       请求方式：post      必须带参数（phone、password）
export const reqUserLogin = (data) => requests({
    url: '/user/passport/login',
    method: 'post',
    data
})


// 获取用户信息的接口（根据用户的token向服务器要用户信息）
// 请求地址：/api/user/passport/auth/getUserInfo        请求方式：get
export const reqUserInfo = () => requests({
    url: '/user/passport/auth/getUserInfo',
    method: 'get'
})


// 退出登录的接口
// 请求地址：/api/user/passport/logout      请求方式：get
export const reqLogout = () => requests({
    url: '/user/passport/logout',
    method: 'get'
})


// 获取用户地址信息的接口
// 请求地址：/api/user/userAddress/auth/findUserAddressList         请求方式：get
export const reqAddressInfo = () => requests({
    url: '/user/userAddress/auth/findUserAddressList',
    method: 'get'
})


// 获取订单交易页信息的接口
// 请求地址：/api/order/auth/trade      请求方式：get
export const reqOrderInfo = () => requests({
    url: '/order/auth/trade',
    method: 'get'
})


// 提交订单的接口
// 请求地址：/api/order/auth/submitOrder?tradeNo={tradeNo}      请求方式：post      必须带参数
export const reqSubmitOrder = (tradeNo, data) => requests({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
    method: 'post',
    data
})


// 获取订单支付信息的接口
// 请求地址：/api/payment/weixin/createNative/{orderId}     请求方式：get       必须带参数
export const reqPayInfo = (orderId) => requests({
    url: `/payment/weixin/createNative/${orderId}`,
    method: 'get'
})


// 获取支付订单状态的接口
// 请求地址：/api/payment/weixin/queryPayStatus/{orderId}       请求方式：get       必须带参数
export const reqPayStatus = (orderId) => requests({
    url: `/payment/weixin/queryPayStatus/${orderId}`,
    method: 'get'
})


// 获取个人中心的数据（我的订单）的接口
// 请求地址：/api/order/auth/{page}/{limit}     请求方式：get       必须带参数
export const reqMyOrderList = (page, limit) => requests({
    url: `/order/auth/${page}/${limit}`,
    method: 'get'
})