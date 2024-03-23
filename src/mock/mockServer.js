// 先引入mockjs模块
import Mock from "mockjs"
// 把JSON数据格式引入进来（JSON数据格式根本没有对外暴露，但是可以引入）
// 原因：webpack默认对外暴露的是图片和JSON数据格式
import banner from '@/mock/banner'
import floor from '@/mock/floor'

// mock数据：第一个参数是请求地址；第二个参数是请求数据
Mock.mock('/mock/banner', {code:200, data:banner})  //轮播图的模拟数据
Mock.mock('/mock/floor', {code:200, data:floor})    //楼层的模拟数据