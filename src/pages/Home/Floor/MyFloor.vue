<template>
    <!--楼层-->
    <div class="floor">
        <div class="py-container">
            <div class="title clearfix">
                <h3 class="fl">{{ floorObj.name }}</h3>
                <div class="fr">
                    <ul class="nav-tabs clearfix">
                        <li :class="index == 0 ? 'active' : ''" v-for="(nav, index) in floorObj.navList" :key="index">
                            <a :href="nav.url" data-toggle="tab">{{ nav.text }}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="tab-content">
                <div class="tab-pane">
                    <div class="floor-1">
                        <div class="blockgary">
                            <ul class="jd-list">
                                <li v-for="(keyword, index) in floorObj.keywords" :key="index">{{ keyword }}</li>
                            </ul>
                            <img :src="floorObj.imgUrl" />
                        </div>
                        <div class="floorBanner">
                            <!-- 轮播图 -->
                            <MyCarousel :carouselList="floorObj.carouselList"/>
                        </div>
                        <div class="split">
                            <span class="floor-x-line"></span>
                            <div class="floor-conver-pit">
                                <img :src="floorObj.recommendList[0]" />
                            </div>
                            <div class="floor-conver-pit">
                                <img :src="floorObj.recommendList[1]" />
                            </div>
                        </div>
                        <div class="split center">
                            <img :src="floorObj.bigImg" />
                        </div>
                        <div class="split">
                            <span class="floor-x-line"></span>
                            <div class="floor-conver-pit">
                                <img :src="floorObj.recommendList[2]" />
                            </div>
                            <div class="floor-conver-pit">
                                <img :src="floorObj.recommendList[3]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script>
    export default {
        name: 'MyFloor',
        props: ['floorObj'],
        // 组件挂载完毕的地方
        mounted() {
            // 之前在ListContainer路由组件中书写Swiper时：在mounted当中书写是不可以的，但是为什么现在这里可以呢？
            // 之前书写轮播图的时候：是在当前组件内部中发请求、动态渲染解构（前台至少服务器数据需要回来），因此不能在mounted中书写
            // 而这里可以这样写的原因是：因为请求是父组件发的，数据是父组件通过props传递过来的，而且在结构已经有了的情况下执行mounted
        }
    }
</script>

<style scoped lang="less">
    .floor {
        margin-top: 15px;

        .py-container {
            width: 1200px;
            margin: 0 auto;

            .title {
                .fl {
                    float: left;
                    color: #c81623;
                    font-size: 20px;
                    line-height: 30px;
                    margin: 9px 0;
                    font-weight: 700;
                }

                .fr {
                    float: right;

                    .nav-tabs {
                        margin: 10px 0 0;
                        display: inline-block;

                        li {
                            float: left;
                            line-height: 18px;

                            a {
                                padding-top: 1px;
                                font-weight: 400;
                                background-color: #fff;

                                &::after {
                                    content: "|";
                                    padding: 0 10px;
                                }
                            }

                            &:nth-child(7) {
                                a {
                                    &::after {
                                        content: "";
                                    }
                                }
                            }

                            &.active {
                                a {
                                    color: #e1251b;
                                }
                            }
                        }
                    }
                }
            }

            .tab-content {
                border-top: 2px solid #c81623;
                border-bottom: 1px solid #e4e4e4;

                .tab-pane {
                    .floor-1 {
                        height: 360px;
                        display: flex;

                        .blockgary {
                            width: 210px;
                            height: 100%;
                            background: #f7f7f7;

                            .jd-list {
                                padding: 15px 0;
                                overflow: hidden;

                                li {
                                    list-style-type: none;
                                    float: left;
                                    width: 40%;
                                    margin: 0 10px;
                                    border-bottom: 1px solid #e4e4e4;
                                    text-align: center;
                                    line-height: 26px;
                                }
                            }

                            img {
                                width: 100%;
                            }
                        }

                        .floorBanner {
                            width: 330px;
                            height: 100%;
                        }

                        .split {
                            width: 220px;
                            height: 100%;
                            position: relative;

                            .floor-x-line {
                                position: absolute;
                                background: #e4e4e4;
                                width: 220px;
                                height: 1px;
                                top: 180px;
                            }

                            .floor-conver-pit {
                                width: 100%;
                                height: 50%;

                                img {
                                    width: 100%;
                                    height: 100%;
                                    transition: all 400ms;

                                    &:hover {
                                        opacity: 0.8;
                                    }
                                }
                            }
                        }

                        .center {
                            border: 1px solid #e4e4e4;
                        }
                    }
                }
            }
        }
    }
</style>