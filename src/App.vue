<template>
  <div>
    <MyHeader/>
    <!-- 路由组件出口的地方 -->
    <router-view></router-view>
    <!-- 在首页、搜索页上是显示的，但是在登录、注册页上是隐藏的 -->
    <MyFooter v-show="$route.meta.show"/>
  </div>
</template>

<script>
  import MyHeader from './components/Header/MyHeader'
  import MyFooter from './components/Footer/MyFooter'

  export default {
    name: 'App',
    components: { MyHeader, MyFooter },
    mounted() {
      // 派发一个action：获取商品分类的三级列表的数据
      // 将获取接口数据的语句放在App组件中的mounted方法中，这样就可以实现从头到尾只获取一次接口数据
      this.$store.dispatch('getCategoryList')
    },
  }
</script>