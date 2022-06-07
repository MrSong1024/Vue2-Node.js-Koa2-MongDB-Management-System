<template>
  <div>
    <OrgUserList
      :dept-id="deptId"
      :dept-code="deptCode"
    />
  </div>
</template>

<script>
import OrgUserList from './OrgUserLists'
export default {
  name: 'OrgList',
  components: {
    OrgUserList
  },
  props: {
    deptId: {
      type: Number,
      default: null
    },
    deptCode: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped>
</style>
