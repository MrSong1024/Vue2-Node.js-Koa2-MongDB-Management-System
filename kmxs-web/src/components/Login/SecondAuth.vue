<!--
 * @Author: Songjq
 * @Date: 2022-05-02 22:58:54
 * @Desscription: 二次验证
-->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialog"
    title="操作保护"
    width="480px"
    :append-to-body="true"
    destroy-on-close
  >
    <div class="tips">
      <i class="el-icon-info"></i> 为了您的账户安全，请进行二次验证
    </div>

    <div class="ui-mgb-20">
      <template v-if="isSecondAuthTypeOptions.length">
        <el-select
          v-model="type"
          placeholder="验证方式"
          size="medium"
          class="w-100 ui-mgt-20"
        >
          <el-option
            v-for="item in isSecondAuthTypeOptions"
            :disabled="!item.valueAlias"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </template>
      <template v-else>
        <div class="ui-mgt-10 ui-mgb-10">
          平台已开启安全验证，请先
          <el-button type="text" size="medium"> 绑定邮箱 </el-button
          >，通过认证后即可访问
        </div>

        <Email
          :isShowTitle="false"
          btnShowText="验证并提交"
          :isChangeEmail="true"
          ref="email"
          :valueAlias="valueAlias"
        />
      </template>
    </div>

    <!-- 对应验证方式 -->
    <template v-if="type === '3'">
      <Phone
        ref="phone"
        :isShowTitle="false"
        :isDisabled="true"
        btnShowText="验证并提交"
        :valueAlias="valueAlias"
      />
    </template>
    <template v-else-if="type === '4'">
      <Email
        ref="email"
        :isShowTitle="false"
        :isDisabled="true"
        btnShowText="验证并提交"
        :valueAlias="valueAlias"
      />
    </template>
  </el-dialog>
</template>

<script>
import Email from "@/components/Login/Email.vue";
import Phone from "@/components/Login/Phone.vue";
export default {
  name: "SecondAuth",
  props: {
    isSecondAuthTypeOptions: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: { Email, Phone },
  data() {
    return {
      // 验证方式
      type: "",
      // 展示弹窗
      dialog: false,
      // 账号取值
      valueAlias: "",
    };
  },
  watch: {
    type: {
      handler(val) {
        let obj = this.isSecondAuthTypeOptions.find((v) => {
          return v.value === val;
        });
        this.valueAlias = obj.valueAlias;
      },
      deep: true,
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.tips {
  height: 36px;
  line-height: 36px;
  padding-left: 20px;
  box-sizing: border-box;
  background: #fff3eb;
  color: #ffa366;
  border: 1px solid #ffa366;
}
</style>
