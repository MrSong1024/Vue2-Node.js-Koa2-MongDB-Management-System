<!--
 * @Author: Songjq
 * @Date: 2022-01-25 08:54:59
 * @Desscription: 
-->
<template>
  <div :class="status == '0' ? 'qiyong' : 'jinyong'">
    <i /><span>{{ $utils.getAlias(status, options) }}</span>
  </div>
</template>

<script>
import publice from "@/mixins/publice.js";
export default {
  name: "DisabledTag",
  mixins: [publice],
  props: {
    status: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.qiyong,
.jinyong {
  display: flex;
  align-items: center;
  i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 5px;
    display: block;
  }
}
.qiyong {
  i {
    background: #13ce66;
  }
}
.jinyong {
  i {
    background: #ff4949;
  }
}
</style>
