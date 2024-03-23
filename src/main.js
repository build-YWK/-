import Vue from 'vue'
import App from './App.vue'

// 引入三级联动组件 --- 注册为全局组件
import TypeNav from '@/components/TypeNav/TypeNav'
// 第一个参数：全局组件的名字；第二个参数：哪一个组件
Vue.component(TypeNav.name, TypeNav)

// 引入轮播图组件 --- 注册为全局组件
import MyCarousel from '@/components/Carousel/MyCarousel'
Vue.component(MyCarousel.name, MyCarousel)

// 引入分页组件 --- 注册为全局组件
import MyPagination from '@/components/Pagination/MyPagination'
Vue.component(MyPagination.name, MyPagination)

// 引入路由
import router from './router'
// 引入仓库
import store from './store'
// 引入mockServer.js —— mock数据
import '@/mock/mockServer'
// 引入swiper样式
import 'swiper/css/swiper.css'
// 引入vue-lazyload插件 --- 安装方式：npm i vue-lazyload@1.3.3（安装这个版本的有用）
import VueLazyload from 'vue-lazyload'
// 引入图片（懒加载）
import atm from '@/assets/atm.jpg'

// 使用vue-lazyload插件
Vue.use(VueLazyload, {
  // 懒加载默认的图片
  loading: atm
})

// 统一接口api文件夹里面的全部请求函数
// 统一引入
import * as API from '@/api'

// element-Ui的使用
import { MessageBox } from 'element-ui'
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert

// 引入自定义插件
import myPlugins from '@/plugins/myPlugins'
Vue.use(myPlugins, {
  name: 'upper'
})

// 引入表单校验插件
import '@/plugins/validate'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 全局事件总线$bus配置
  beforeCreate() {
    Vue.prototype.$bus = this,
    Vue.prototype.$API = API
  },
  // 注册路由
  router,
  // 注册仓库
  store
}).$mount('#app')