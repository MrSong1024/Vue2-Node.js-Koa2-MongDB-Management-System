<!--
 * @Author: Songjq
 * @Date: 2022-03-10 22:36:14
 * @Desscription: 发送短信
-->
<template>
  <div class="ui-pd-30">
    <el-form :model="smsForm" :rules="rules" ref="smsForm" label-width="150px">
      <el-form-item label="手机号码" prop="phones">
        <el-input
          type="textarea"
          placeholder="请输入"
          v-model="smsForm.phones"
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="" prop="files">
        <el-upload
          class="upload-demo"
          action
          :on-change="handleChange"
          :show-file-list="false"
          accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :auto-upload="false"
        >
          <el-button size="small" type="primary">导入 Excel</el-button>
          <div slot="tip" class="el-upload__tip">
            (支持通过.xls .xlsx文件批量导入，最多200个)
            <el-button type="text" @click="downTemplate()">下载模板</el-button>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="短信模板" prop="templateId">
        <el-select
          v-model="smsForm.templateId"
          placeholder="请选择"
          @change="setTemplateContent"
        >
          <el-option
            v-for="item in templateOptions"
            :key="item.templateId"
            :label="item.templateName"
            :value="item.templateId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="短信内容" prop="smsContent">
        <el-input
          type="textarea"
          v-model="smsForm.smsContent"
          rows="4"
          placeholder="请选择模板"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="字数统计" prop="smsInfo">
        <p>
          {{ `${smsForm.smsLength}个字符，拆分${smsForm.smsCounts}条短信` }}
        </p>
      </el-form-item>
      <el-form-item label="定时发送" prop="timing">
        <el-date-picker
          v-model="smsForm.timing"
          :picker-options="pickerOptions"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
        <p class="ui-c-c6 ui-size-12">(不填为即时发送)</p>
      </el-form-item>
      <el-form-item label="注意" prop="tips">
        <p class="ui-c-red ui-size-12">
          包含签名短信小于等于60个字的按60个字一条计费，大于60个字按57字一条计费,
          短信内容总字数不能超过500字
        </p>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer ui-pdl-150">
      <el-button @click="resetForm()" size="medium">重 置</el-button>
      <el-button
        size="medium"
        type="primary"
        @click="submit()"
        v-loading="btnLoading"
        >确 定</el-button
      >
    </span>
  </div>
</template>

<script>
import { getSmsSendRecord } from "@http/sms/sendRecord.js";
import { sendMessage, getDownTemplate } from "@http/sms/sms.js";
import { getSmsTemplateAll } from "@http/sms/template.js";
import publice from "@/mixins/publice.js";
export default {
  name: "sendMessage",
  mixins: [publice],
  data() {
    return {
      smsForm: {
        _id: null, // 订单ID
        phones: "", // 手机号
        templateId: "", // 模板ID
        templateType: "", // 模板类型
        smsContent: "", // 短信内容
        smsInfo: "", // 短息详情
        smsLength: "0", // 字符长度
        smsCounts: "0", // 短信条数
        isTiming: false, // 是否定时
        timing: "", // 定时
        variable: "", // 模板变量
      },
      rules: {
        phones: [{ required: true, message: "请录入号码", trigger: "blur" }],
        templateId: [
          { required: true, message: "请选择模板", trigger: "change" },
        ],
      },
      templateOptions: [], // 模板列表
      fileTemp: null,
      btnLoading: false,
      pickerOptions: {
        // 可选日期范围
        disabledDate(time) {
          return time < new Date();
        },
      },
    };
  },
  created() {
    this.init();

    // 有ID则为重新发送
    let id = this.$route.query.id;
    if (id) {
      getSmsSendRecord({
        _id: id,
      }).then((res) => {
        this.smsForm = res.data;
      });
    }
  },
  methods: {
    /**
     * @Author: Songjq
     * @Date: 2021-12-08 23:27:27
     * @Fn: 获取所有数据
     */
    init() {
      // 获取模板数据
      getSmsTemplateAll({
        status: 2,
      }).then((res) => {
        this.templateOptions = res.data;
      });
    },

    // 设置模板内容
    setTemplateContent(item) {
      const content = this.templateOptions.find((val) => {
        return item == val.templateId;
      });
      let keys = {
        templateId: "", // 模板ID
        templateType: "", // 模板类型
        smsInfo: "", // 短息详情
        smsLength: "0", // 字符长度
        smsCounts: "0", // 短信条数
        variable: "", // 模板变量
      };
      Object.keys(keys).forEach((key) => {
        this.$set(this.smsForm, key, content[key]);
      });

      this.$set(this.smsForm, "smsContent", content.templateContent);
    },

    /**
     * @Author: Songjq6
     * @Date: 2020-04-30 15:49:11
     * @Function: 导入
     */
    // excel表上传
    handleChange(file, fileList) {
      this.fileTemp = file.raw;
      const fileName = file.raw.name;
      const fileType = fileName.substring(fileName.lastIndexOf(".") + 1);
      // 判断上传文件格式
      if (this.fileTemp) {
        if (fileType == "xlsx" || fileType == "xls") {
          this.importfxx(this.fileTemp);
        } else {
          this.$message({
            type: "warning",
            message: "附件格式错误，请删除后重新上传！",
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "请上传附件！",
        });
      }
    },

    // 导入数据
    importfxx() {
      // 通过DOM取文件数据
      this.file = event.currentTarget.files[0];
      const rABS = false; // 是否将文件读取为二进制字符串
      const f = this.file;
      const reader = new FileReader();
      FileReader.prototype.readAsBinaryString = (f) => {
        let binary = "";
        const rABS = false; // 是否将文件读取为二进制字符串
        const pt = this;
        let wb; // 读取完成的数据
        const reader = new FileReader();
        reader.onload = (e) => {
          const bytes = new Uint8Array(reader.result);
          const length = bytes.byteLength;
          for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const XLSX = require("xlsx");
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              // 手动转化
              type: "base64",
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary",
            });
          }
          let outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); // outdata 数组里面  这里面就是你想要的数据

          if (outdata.length > 0 && !outdata[0].tel) {
            this.$message.error("模板格式不正确");
            return;
          }
          outdata.forEach((val) => {
            this.smsForm.phones = this.smsForm.phones.concat(val.tel + ",");
          });
        };
        reader.readAsArrayBuffer(f);
      };

      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },

    // 下载发送短信模板
    downTemplate() {
      getDownTemplate().then((res) => {
        let uploadExcel = (fileName) => {
          const blob = new Blob([res], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
          });
          const url = URL.createObjectURL(blob);
          const aLink = document.createElement("a");
          aLink.setAttribute("download", fileName);
          aLink.setAttribute("href", url);
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          URL.revokeObjectURL(blob);
        };
        uploadExcel("发送短信模板样例.xlsx");
      });
    },

    // 新增提交
    submit() {
      this.$refs["smsForm"].validate((valid) => {
        this.btnLoading = true;
        if (valid) {
          this.smsForm.isTiming = this.smsForm.timing ? true : false;
          sendMessage(this.smsForm)
            .then((res) => {
              this.btnLoading = false;
              this.$message.success(res.message);
              this.resetForm();

              // 如果是重发，发送完成以后，回到发送列表
              if (this.$route.query.id) {
                this.$router.push({
                  path: "/smsMgr/sendRecord",
                });
              }
            })
            .catch((err) => {
              this.btnLoading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 重置表单
    resetForm() {
      this.$refs.smsForm.resetFields();
    },
  },
};
</script>
<style lang="scss"></style>