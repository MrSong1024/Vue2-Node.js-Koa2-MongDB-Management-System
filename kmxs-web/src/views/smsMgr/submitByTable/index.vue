<!--
 * @Author: Songjq
 * @Date: 2022-03-10 22:36:14
 * @Desscription: 表格提交
-->
<template>
  <div class="ui-pd-30">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="号码文件" prop="files">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="handleChange"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            (第一行默认为标题不被导入,第一列必须是手机号码。
            文件大小不超过2M，支持文件格式:Excel2003(xls),Excel2007(xlsx))
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label="短信内容" prop="smsContent">
        <el-input
          type="textarea"
          v-model="ruleForm.smsContent"
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="字数统计" prop="words">
        <p>0个字符 ,拆分 1 条短信</p>
      </el-form-item>
      <el-form-item label="定时发送" prop="timing">
        <el-date-picker
          v-model="ruleForm.timing"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
        <p class="ui-c-c6 ui-size-12">(不填为即时发送)</p>
      </el-form-item>
      <el-form-item label="注意" prop="remark">
        <p class="ui-c-red ui-size-12">
          包含签名短信小于等于70个字的按70个字一条计费，大于70个字按67字一条计费,
          短信内容总字数不能超过 500字
        </p>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer ui-pdl-150">
      <el-button @click="resetForm()" size="medium">取 消</el-button>
      <el-button size="medium" type="primary" @click="submit()"
        >确 定</el-button
      >
    </span>
  </div>
</template>

<script>
import publice from "@/mixins/publice.js";
export default {
  name: "sendMessage",
  mixins: [publice],
  data() {
    return {
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
      ruleForm: {
        files: "",
        smsContent: "",
        words: "",
        timing: "",
      },
      rules: {
        files: [{ required: true, message: "请输入", trigger: "blur" }],
        smsContent: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    /**
     * @Author: Songjq
     * @Date: 2021-12-08 23:27:27
     * @Fn: 获取所有数据
     */
    init() {},

    // 新增提交
    submit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 重置表单
    resetForm() {
      this.ruleForm = {
        files: "",
        smsContent: "",
        words: "",
        timing: "",
      };
    },
  },
};
</script>
<style lang="scss"></style>