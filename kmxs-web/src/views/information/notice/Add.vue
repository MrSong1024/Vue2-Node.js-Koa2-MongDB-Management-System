<!--
 * @Author: Songjq
 * @Date: 2022-01-24 11:28:21
 * @Desscription: 
-->
<template>
  <!--表单渲染-->
  <el-dialog
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible.sync="crud.status.cu > 0"
    :title="crud.status.title"
    width="660px"
    :append-to-body="true"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="100px"
    >
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input
          size="small"
          v-model="form.noticeTitle"
          placeholder="请输入公告标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="公告类型" prop="noticeType">
        <el-select
          v-model="form.noticeType"
          placeholder="请选择公告类型"
          class="w-100"
        >
          <el-option
            v-for="item in dict.sys_notice_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <template v-for="(item, idx) in dict.sys_disabled_status">
          <el-radio :key="idx" v-model="form.status" :label="item.value">{{
            item.label
          }}</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="内容" prop="noticeContent">
        <editor
          ref="editor"
          @change="setNoticeContent"
          :editorContent="form.noticeContent"
          :isMenu="false"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="text" @click="crud.cancelCU">取消</el-button>
      <el-button
        :loading="crud.btnLoading"
        type="primary"
        @click="crud.submitCU"
        >确认</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { postNotice } from "@http/information/notice.js";
import Editor from "../../components/Editor.vue";
export default {
  components: { Editor },
  name: "notice",
  props: ["isEdit"],
  dicts: ["sys_disabled_status", "sys_notice_type"],
  data() {
    return {
      form: {
        noticeTitle: "",
        noticeType: "",
        status: "",
        noticeContent: "",
      },

      dialogVisible: false,
      btnLoading: false,
    };
  },
  methods: {
    init(row) {
      if (row) {
        this.form = row;
      }
      this.$nextTick(() => {
        this.$refs.editor.init();
      });
    },

    // 设置公告内容
    setNoticeContent(html) {
      this.form.noticeContent = html;
    },

    // 新增提交
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          postNotice(this.form).then((res) => {
            this.dialogVisible = false;
            this.$message.success("操作成功");
            this.resetForm();
            this.$emit("init");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    resetForm() {
      this.dialogVisible = false;
      this.btnLoading = false;
      this.form = {
        noticeTitle: "",
        noticeType: "",
        status: "",
        noticeContent: "",
      };
    },
  },
};
</script>
<style lang="scss"></style>