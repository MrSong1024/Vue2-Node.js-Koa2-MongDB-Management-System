<!--
 * @Author: Songjq
 * @Date: 2021-12-24 22:28:08
 * @Desscription: 
-->
<template>
  <el-dialog
    title="详细"
    :visible.sync="dialogVisible"
    width="600px"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
    >
      <el-form-item label="登录信息：">
        <div class="ui-flex">
          <span class="ui-pdr-10">{{form.username}}</span>/<span class="ui-pdr-10 ui-pdl-10">{{form.userno}}</span>/<span class="ui-pdl-10 ui-pdr-10">{{form.ipaddr}}</span>/<span class="ui-pdl-10">{{form.location}}</span>
        </div>
      </el-form-item>
      <el-form-item label="请求方式：">
        <span>{{form.method}}</span>
      </el-form-item>
      <el-form-item label="请求参数：">
        <el-input
          type="textarea"
          :rows="8"
          placeholder="请输入内容"
          v-model="form.params"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="返回参数：">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          v-model="form.body"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="操作状态：">
        <span>{{form.status}}</span>
      </el-form-item>
      <el-form-item label="操作时间：">
        <span>{{form.date}}</span>
      </el-form-item>
      <el-form-item label="描述：">
        <span>{{form.desc}}</span>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="dialogVisible = false"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "dns",

  data() {
    return {
      dialogVisible: false,
      form: {},
    };
  },

  methods: {
    /**
     * @Author: Songjq
     * @Date: 2021-12-08 23:27:27
     * @Fn: 获取所有数据
     */
    init(row) {
      this.form = row;
    },
  },
};
</script>
<style lang="scss">
.el-dialog__header {
  background-color: #f0f0f0;
}
.el-form-item__content,
.el-form-item__label {
  font-size: 14px;
}
</style>
