<template>
    <div class="pagination">
        <!-- 上 -->
        <button :disabled="pageNo == 1" @click="returnPageNo(pageNo - 1)">上一页</button>
        <button v-show="startNumAndEndNum.start > 1" @click="returnPageNo(1)">1</button>
        <button v-show="startNumAndEndNum.start > 2">···</button>

        <!-- 中 -->
        <button
            v-for="(pageNum, index) in startNumAndEndNum.end"
            :key="index"
            v-show="pageNum >= startNumAndEndNum.start"
            @click="returnPageNo(pageNum)"
            :class="{active: pageNo == pageNum}"
        >
            {{ pageNum }}
        </button>

        <!-- 下 -->
        <button v-show="startNumAndEndNum.end < totalPage - 1">···</button>
        <button v-show="startNumAndEndNum.end < totalPage" @click="returnPageNo(totalPage)">{{ totalPage }}</button>
        <button :disabled="pageNo == totalPage" @click="returnPageNo(pageNo + 1)">下一页</button>

        <button style="margin-left: 30px">共 {{ total }} 条</button>
    </div>
</template>
    
<script>
export default {
    name: 'MyPagination',
    // 父组件传递给子组件的数据：当前页码、每一页展示多少条数据、数据的总个数、连续页码数
    props: ['pageNo', 'pageSize', 'total', 'continues'],
    computed: {
        // 总共多少页
        totalPage() {
            // 向上取整（Math.ceil）
            return Math.ceil(this.total / this.pageSize)
        },
        // 计算出连续的页码的起始数字与结束数字[连续页码的数字：至少是5]
        startNumAndEndNum() {
            // 解构赋值
            const { pageNo, totalPage, continues } = this
            // 先定义两个变量存储起始数字与结束数字
            let start = 0, end = 0
            // 连续页码数字是5【总页数至少五页】，如果出现不正常的现象【就是总页数不够五页】
            if(totalPage < continues) {
                // 不支持现象【总页数小于连续页码】
                start = 1
                end = totalPage
            }else {
                // 正常现象【总页数一定大于等于连续页码】
                // 起始数字
                start = pageNo - parseInt(continues / 2)
                // 结束数字
                end = pageNo + parseInt(continues / 2)
                // 把出现不正常的现象【start出现0|负数】纠正
                if(start < 1) {
                    start = 1
                    end =  continues
                }
                // 把出现不正常的现象【end数字大于总页数】纠正
                if(end > totalPage) {
                    end = totalPage
                    start = totalPage - continues + 1
                }
            }
            return { start, end }
        }
    },
    methods: {
        returnPageNo(pageNum) {
            this.$emit('getPageNo', pageNum)
        }
    }
}
</script>

<style lang="less" scoped>
    .pagination {
        text-align: center;
        button {
            margin: 0 5px;
            background-color: #f4f4f5;
            color: #606266;
            outline: none;
            border-radius: 2px;
            padding: 0 4px;
            vertical-align: top;
            display: inline-block;
            font-size: 13px;
            min-width: 35.5px;
            height: 28px;
            line-height: 28px;
            cursor: pointer;
            box-sizing: border-box;
            text-align: center;
            border: 0;

            &[disabled] {
                color: #c0c4cc;
                cursor: not-allowed;
            }

            &.active {
                cursor: not-allowed;
                background-color: #409eff;
                color: #fff;
            }
        }
    }

    .active {
        background: skyblue;
    }
</style>