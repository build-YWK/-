<template>
    <div>
        <!-- 三级联动全局组件：三级联动组件已经注册为全局组件，因此不需要再引入注册了 -->
        <TypeNav/>
        <!-- 轮播图列表 -->
        <ListContainer/>
        <!-- 今日推荐 -->
        <TodayRecommend/>
        <!-- 商品排行 -->
        <MyRank/>
        <!-- 猜你喜欢 -->
        <MyLike/>
        <!-- 楼层 -->
        <!-- MyFloor这个组件：自己在组件内部是没有发请求的，请求是父组件发的，数据是父组件传递的 -->
        <MyFloor v-for="floorObj in floorList" :key="floorObj.id" :floorObj="floorObj"/>
        <!-- 商标 -->
        <MyBrand/>
    </div>
</template>
    
<script>
    // 引入其余的组件
    import ListContainer from '@/pages/Home/ListContainer/ListContainer'
    import TodayRecommend from '@/pages/Home/Recommend/TodayRecommend'
    import MyRank from '@/pages/Home/Rank/MyRank'
    import MyLike from '@/pages/Home/Like/MyLike'
    import MyFloor from '@/pages/Home/Floor/MyFloor'
    import MyBrand from '@/pages/Home/Brand/MyBrand'

    import { mapState } from 'vuex'

    export default {
        name: 'MyHome',
        components: {
            ListContainer,
            TodayRecommend,
            MyRank,
            MyLike,
            MyFloor,
            MyBrand
        },
        mounted() {
            // 派发action，获取floor组件的数据
            this.$store.dispatch('getFloorList')
        },
        computed: {
            ...mapState({
                floorList: state => state.home.floorList
            })
        },
    }
</script>