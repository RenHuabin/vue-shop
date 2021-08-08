<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearabl>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="80px"
        ></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="80px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="80px"
        ></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="200px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogCloosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%">
       <el-timeline :reverse="reverse">
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
    </el-dialog>
  </div>
</template>b

<script>
import cityData from './citydata'

export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单列表
      orderList: [],
      // 总数据条数
      total: 0,
      // 控制修改地址对话框的显示与隐藏
      addressVisible: false,
      // 修改地址表单的数据对象
      addressForm: {
        address1: [],
        address2: ''
      },
      // 修改地址表单数据的验证规则对象
      addressFormRules: {
        address1: [
          {
            required: true,
            message: '请选择省市区/县',
            trigger: 'blur'
          }
        ],
        address2: [
          {
            required: true,
            message: '请填写详细地址',
            trigger: 'blur'
          }
        ]
      },
      cityData,
      // 控制展示物流进度对话框的显示与隐藏
      progressVisible: false,
      progressInfo: [

        { time: '2021-08-04 09:58:25', ftime: '2021-08-04 09:58:25', context: '[深圳市]您的快件已签收，如有疑问请电联快递员【欧西平，电话：15818689904】。疫情期间顺丰每日对网点消毒、快递员每日测温、配戴口罩，感谢您使用顺丰，期待再次为您服务。（主单总件数：1件）', location: '深圳市' },
        { time: '2021-08-04 08:19:47', ftime: '2021-08-04 08:19:47', context: '[深圳市]快件交给欧西平,正在派送途中（联系电话：15818689904,顺丰已开启“安全呼叫”保护您的电话隐私,请放心接听！）（主单总件数：1件）', location: '深圳市' },
        { time: '2021-08-04 07:19:12', ftime: '2021-08-04 07:19:12', context: '[深圳市]快件到达 【深圳宝安固戍村营业点】', location: '深圳市' },
        { time: '2021-08-04 06:16:42', ftime: '2021-08-04 06:16:42', context: '[深圳市]快件已发车', location: '深圳市' },
        { time: '2021-08-04 05:58:59', ftime: '2021-08-04 05:58:59', context: '[深圳市]快件在【深圳福永中转场】完成分拣,准备发往 【深圳宝安固戍村营业点】', location: '深圳市' },
        { time: '2021-08-04 05:27:49', ftime: '2021-08-04 05:27:49', context: '[深圳市]快件到达 【深圳福永中转场】', location: '深圳市' },
        { time: '2021-08-04 05:05:23', ftime: '2021-08-04 05:05:23', context: '[深圳市]快件已发车', location: '深圳市' },
        { time: '2021-08-04 04:53:56', ftime: '2021-08-04 04:53:56', context: '[深圳市]快件在【深圳黄田中转场】完成分拣,准备发往 【深圳福永中转场】', location: '深圳市' },
        { time: '2021-08-04 04:53:56', ftime: '2021-08-04 04:53:56', context: '[深圳市]快件到达 【深圳黄田中转场】', location: '深圳市' },
        { time: '2021-08-03 04:25:49', ftime: '2021-08-03 04:25:49', context: '[郑州市]快件已发车', location: '郑州市' },
        { time: '2021-08-03 03:40:00', ftime: '2021-08-03 03:40:00', location: '郑州市', context: '[郑州市]快件在【郑州经开中转场】完成分拣,准备发往 【深圳黄田中转场】' },
        { time: '2021-08-03 03:08:56', ftime: '2021-08-03 03:08:56', context: '[郑州市]快件到达 【郑州经开中转场】', location: '郑州市' },
        { time: '2021-08-03 02:20:01', ftime: '2021-08-03 02:20:01', context: '[郑州市]快件已发车', location: '郑州市' },
        { time: '2021-08-03 02:17:43', ftime: '2021-08-03 02:17:43', location: '郑州市', context: '[郑州市]快件在【郑州航空集散中心】完成分拣,准备发往 【郑州经开中转场】' },
        { time: '2021-08-03 00:49:17', ftime: '2021-08-03 00:49:17', context: '[郑州市]快件到达 【郑州航空集散中心】', location: '郑州市' },
        { time: '2021-08-02 22:16:20', ftime: '2021-08-02 22:16:20', context: '[周口市]快件已发车', location: '周口市' },
        { time: '2021-08-02 21:35:26', ftime: '2021-08-02 21:35:26', location: '周口市', context: '[周口市]快件在【周口开元集散点】完成分拣,准备发往 【郑州航空集散中心】' },
        { time: '2021-08-02 21:23:45', ftime: '2021-08-02 21:23:45', context: '[周口市]快件到达 【周口开元集散点】', location: '周口市' },
        { time: '2021-08-02 20:10:48', ftime: '2021-08-02 20:10:48', context: '[周口市]快件已发车', location: '周口市' },
        { time: '2021-08-02 19:48:45', ftime: '2021-08-02 19:48:45', location: '深圳市', context: '[周口市]快件在【项城西大街营业点】完成分拣,准备发往 【周口开元集散点】' },
        { time: '2021-08-02 19:29:31', ftime: '2021-08-02 19:29:31', context: '[周口市]顺丰速运 已收取快件', location: '周口市' }
      ]
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败!')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(this.orderList)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 点击展示修改地址的对话框
    showBox () {
      this.addressVisible = true
    },
    // 监听修改地址对话框的关闭事件
    addressDialogCloosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 点击展示物流进度的对话框
    async showProgressBox () {
      //
      // const { data: res } = await this.$http.post('query/', {
      //   postid: 'SF1098316539784', type: 'shunfeng', phone: '7683'
      // })
      // const { data: res } = await this.$http.post('/result.jsp?nu=SF1098316539784')
      // // if (res.meta.status !== 200) return this.$message.error('获取物流信息失败！')
      // if (res.meta.status !== 200) {
      //   return console.log(res)
      // }
      // this.$message.success('获取物流信息成功')
      // console.log(res.data)
      this.progressVisible = true
    }
  }
}
</script>

<style Lang="less" scoped>
</style>
