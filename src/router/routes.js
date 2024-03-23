// 所有路由的配置信息

// 引入一级路由组件
// import MyHome from "@/pages/Home/MyHome"
// import MySearch from "@/pages/Search/MySearch"
// import MyLogin from "@/pages/Login/MyLogin"
// import MyRegister from "@/pages/Register/MyRegister"
// import MyDetail from '@/pages/Detail/MyDetail'
// import AddCartSuccess from '@/pages/AddCartSuccess/AddCartSuccess'
// import ShopCart from '@/pages/ShopCart/ShopCart'
// import MyTrade from '@/pages/Trade/MyTrade'
// import MyPay from '@/pages/Pay/MyPay'
// import PaySuccess from '@/pages/PaySuccess/PaySuccess'
// import MyCenter from '@/pages/Center/MyCenter'
// 引入二级路由组件
// import MyOrder from '@/pages/Center/myOrder/MyOrder'
// import GroupOrder from '@/pages/Center/groupOrder/GroupOrder'

// 将所有引入的路由组件变成路由懒加载模式
/* 
    路由懒加载：
        当打包构建应用时，JavaScript包会变得非常大，影响页面加载。
        如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。
*/

// 路由配置信息
export default [
    {
        name: 'center',
        path: '/center',
        // 路由懒加载
        component: ()=>import('@/pages/Center/MyCenter'),
        meta: { show: true },
        // 二级路由
        children: [
            {
                path: 'myorder',
                component: ()=>import('@/pages/Center/myOrder/MyOrder')
            },
            {
                path: 'grouporder',
                component: ()=>import('@/pages/Center/groupOrder/GroupOrder')
            },
            // 子路由重定向
            {
                path: '/center',
                redirect: '/center/myorder'
            }
        ]
    },
    {
        name: 'paysuccess',
        path: '/paysuccess',
        component: ()=>import('@/pages/PaySuccess/PaySuccess'),
        meta: { show: true }
    },
    {
        name: 'pay',
        path: '/pay',
        component: ()=>import('@/pages/Pay/MyPay'),
        meta: { show: true },
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            if(from.path == '/trade' || from.path == '/') {
                next()
            }else {
                next(false)
            }
        }
    },
    {
        name: 'trade',
        path: '/trade',
        component: ()=>import('@/pages/Trade/MyTrade'),
        meta: { show: true },
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            // 只允许从购物车页面跳到订单交易页面，不能从其他页面直接跳到
            if(from.path == '/shopcart' || from.path == '/') {
                next()
            }else {
                // 其他路由组件而来，停留到当前页面
                // next(false)：中断当前的导航。如果浏览器的URL改变了（可能是用户手动或者浏览器后退按钮），那么URL地址会重置到from路由对应的地址
                next(false)
            }
        }
    },
    {
        name: 'shopcart',
        path: '/shopcart',
        component: ()=>import('@/pages/ShopCart/ShopCart'),
        meta: { show: true }
    },
    {
        name: 'addcartsuccess',
        path: '/addcartsuccess',
        component: ()=>import('@/pages/AddCartSuccess/AddCartSuccess'),
        meta: { show: true }
    },
    {
        name: 'detail',
        path: '/detail/:skuid?',
        component: ()=>import('@/pages/Detail/MyDetail'),
        meta: { show: true }
    },
    {
        name: 'name',
        path: '/home',
        // 路由懒加载
        component: ()=>import('@/pages/Home/MyHome'),
        meta: { show: true }
    },
    {
        name: 'search',
        // 在占位的后面加上一个问号，就能实现指定params参数可传可不传
        path: '/search/:keyword?',
        component: ()=>import('@/pages/Search/MySearch'),
        meta: { show: true }
    },
    
    {
        path: '/login',
        component: ()=>import('@/pages/Login/MyLogin'),
        meta: { show: false }
    },
    {
        path: '/register',
        component: ()=>import('@/pages/Register/MyRegister'),
        meta: { show: false }
    },
    // 重定向：在项目跑起来的时候，访问/home，立马让它定向到首页
    {
        path: '*',
        redirect: '/home'
    }
]