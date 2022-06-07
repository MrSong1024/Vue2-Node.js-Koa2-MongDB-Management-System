<!--
 * @Author: Songjq
 * @Date: 2022-02-26 23:46:50
 * @Desscription: 选择用户
-->
<template>
  <el-select
    :size="size"
    v-model="queryParam.user"
    :placeholder="placeholder"
    @change="resetPage()"
    clearable
    filterable
    :class="classStyle"
  >
    <el-option
      v-for="item in userOptions"
      :key="item.userno"
      :label="item.username"
      :value="item.userno"
    >
      <span style="font-size: 12px"
        >{{ item.username
        }}<span style="color: #8492a6; padding-left: 5px">{{
          item.userno
        }}</span></span
      >
      <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{
        item.userno
      }}</span> -->
    </el-option>
  </el-select>
</template>

<script>
import { getUserAll } from "@http/system/user.js";
export default {
  name: "UserSelect",
  props: {
    queryParam: {
      type: Object,
      default: () => {
        return {};
      },
    },
    placeholder: {
      type: String,
      default: "申请人",
    },
    classStyle: {
      type: String,
      defult: "ui-w-160",
    },
    size: {
      type: String,
      default: "mini",
    },
  },
  data() {
    return {
      userOptions: [], // 所有用户
    };
  },
  created() {
    // 获取所有用户
    getUserAll({
      page: 0, // 页码
      size: 100, // 每页数据条数
    }).then((res) => {
      this.userOptions = res.data;
    });
  },
  methods: {
    // 切换用户
    resetPage() {
      this.$emit("resetPage");
    },
  },
};
</script>
<style scoped lang="scss">
</style>