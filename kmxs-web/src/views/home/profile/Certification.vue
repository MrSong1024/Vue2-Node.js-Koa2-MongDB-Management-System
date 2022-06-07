<!--
 * @Author: Songjq
 * @Date: 2022-02-09 17:15:51
 * @Desscription: 实名认证
-->
<template>
  <el-dialog
    title="实名认证"
    :visible.sync="dialogVisible"
    :before-close="reset"
    :close-on-click-modal="false"
    width="720px"
    append-to-body
  >
    <el-form
      ref="form"
      :model="form"
      label-width="0px"
      :rules="loginRules"
      :inline="true"
    >
      <el-form-item
        prop="positiveImg"
        style="margin-right:46px"
      >
        <span class="ui-flex ui-cont-center">证件正面照片</span>
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :http-request="requestUpload"
          :before-upload="beforeAvatarUploadPositive"
        >
          <img
            v-if="form.positiveImg"
            :src="form.positiveImg"
            class="avatar"
          >
          <img
            v-else
            src="../../../assets/images/sfz_03.jpg"
            class="avatar"
          >
        </el-upload>
      </el-form-item>
      <el-form-item prop="backImg">
        <span class="ui-flex ui-cont-center">证件背面照片</span>
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :http-request="requestUpload"
          :before-upload="beforeAvatarUploadBack"
        >
          <img
            v-if="form.backImg"
            :src="form.backImg"
            class="avatar"
          >
          <img
            v-else
            src="../../../assets/images/sfz_06.jpg"
            class="avatar"
          >
        </el-upload>

      </el-form-item>
    </el-form>
    <div class="careful">
      注意：<br />
      1. 请务必使用您本人证件进行认证，如因盗用他人证件进行认证导致的一切后果，责任自负！
    </div>
    <div class="tip">
      认证说明：<br>
      1、请提交证件正反面照片进行身份认证(有效期内的证件)，照片请勿加水印；<br>
      2、单张图片大小不得超过2M，宽高限制不超过480px，允许上传的图片类型：jpg/gif/png；<br>
      3、请提交清晰可辨别的证件原件彩色扫描件。；<br>
      4、提交完成后，请等待专员进行审核，审核结果会以邮件方式通知用户；<br>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="reset">取消</el-button>
      <el-button
        type="primary"
        @click="submit"
        :loading="loading"
      >保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postUsersCertification } from "@http/system/user.js";
export default {
  data() {
    return {
      dialogVisible: false, // 更换密码
      form: {
        positiveImg: "",
        backImg: "",
      },
      loginRules: {
        positiveImg: [
          {
            required: true,
            trigger: "change",
            message: "身份证正面图不能为空",
          },
        ],
        backImg: [
          {
            required: true,
            trigger: "change",
            message: "身份证背面图不能为空",
          },
        ],
      },
      loading: false,
    };
  },
  methods: {
    init(user) {
      this.form = {
        positiveImg: user.authInfo.positiveImg,
        backImg: user.authInfo.backImg,
      };
    },
    // 覆盖默认的上传行为
    requestUpload() {},

    // 上传正面图
    beforeAvatarUploadPositive(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.positiveImg = reader.result;
      };
    },

    // 上传背面图
    beforeAvatarUploadBack(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.backImg = reader.result;
      };
    },

    /**
     * @Author: Songjq
     * @Date: 2022-02-09 18:07:35
     * @Fn: 重置表单
     */
    reset() {
      this.dialogVisible = false;
      this.form = {
        positiveImg: "",
        backImg: "",
      };
    },

    /**
     * @Author: Songjq
     * @Date: 2022-01-19 15:49:17
     * @Fn: 实名认证
     */
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.loading) return;
          this.loading = true;
          postUsersCertification(this.form)
            .then((res) => {
              this.$notify({
                title: res.message,
                type: "success",
              });
              this.dialogVisible = false;
              this.loading = false;
              this.$emit("init");
              this.reset();
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
        }
      });
    },
  },
};
</script>
<style scope>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 308px;
  height: 196px;
  line-height: 196px;
  text-align: center;
}
.avatar {
  width: 308px;
  height: 196px;
  display: block;
}
.careful {
  margin-top: 25px;
  color: #dd3c10;
  font-weight: 700;
  line-height: 20px;
}
.tip {
  margin-top: 20px;
  line-height: 20px;
}
</style>