<template>
    <!-- 轮播图封装 -->
    <div class="swiper-container" ref="MySwiper">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="carousel in carouselList" :key="carousel.id">
                <img :src="carousel.imgUrl">
            </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>

        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    </div>
</template>
    
<script>
    // 引包
    import Swiper from 'swiper'

    // 该组件用于MyFloor和ListContainer路由组件中的轮播图（可以用在任何需要轮播图的组件上）
    export default {
        name: 'MyCarousel',
        props: ['carouselList'],
        watch: {
            carouselList: {
                // 立即监听：不管数据有没有变化，一上来就立即监听一次
                immediate: true,
                handler() {
                    // 虽然监听到数据已经有了，但是v-for动态渲染结构还是没有办法确定，因此还是需要用到nextTick
                    this.$nextTick(() => {
                        new Swiper(this.$refs.MySwiper, {
                            loop: true, //循环模式选项
                            // 如果需要分页器
                            pagination: {
                                el: '.swiper-pagination',
                                // 点击分页器下的小球也可以切换图片
                                clickable: true
                            },
                            // 如果需要前进后退按钮
                            navigation: {
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev'
                            }
                        })
                    })
                }
            }
        }
    }
</script>