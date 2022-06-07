<template>
  <div class="introduction">
    <p v-if="showTip">{{ tip }}</p>
    <div v-if="!showTip" class="introduction-content">
      <el-table
        highlight-current-row
        :data="list"
        style="width: 100%"
      >
        <el-table-column type="index" />
        <el-table-column
          prop="jobDefName"
          label="岗位组名称"
          width="220"
          :show-overflow-tooltip="showOverflowTooltip"
        />
        <el-table-column
          prop="jobDefCode"
          label="岗位组编码"
          width="82"
          :show-overflow-tooltip="showOverflowTooltip"
        />
        <el-table-column
          prop="typeCode"
          label="岗位组类型"
          width="82"
          :show-overflow-tooltip="showOverflowTooltip"
        />
        <el-table-column
          prop="relType"
          label="岗位类型"
          width="70"
        />
        <el-table-column
          prop="deptName"
          label="岗位所在组织"
          width="260"
          :show-overflow-tooltip="showOverflowTooltip"
        />
        <el-table-column
          prop="deptCode"
          width="120"
          label="组织编号"
        />
        <el-table-column
          prop="nickname"
          label="员工姓名"
          width="120"
          :show-overflow-tooltip="showOverflowTooltip"
        />
        <el-table-column
          prop="username"
          label="员工账号"
          width="120"
        />
        <el-table-column
          prop="jobCode"
          label="岗位编码"
          width="86"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrgUserList',
  props: {
    list: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      tip: ' 请先选择组织',
      showTip: true,
      showOverflowTooltip: true
    }
  },
  watch: {
    list(n) {
      if (n.length) {
        this.showTip = false
      } else {
        this.tip = '当前组织下没有人岗关系'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.introduction{
  font-size: 12px;
}
</style>
