<template>
  <div>
    <el-button v-permission="permission.edit" :disabled="disabledEdit" size="mini" type="text" @click="crud.toEdit(data)">编辑</el-button>
    <el-popover v-if="data.status ==='-1' && data.approval === null" v-model="pop" v-permission="permission.del" placement="top" width="180" trigger="manual" @show="onPopoverShow" @hide="onPopoverHide">
      <p>{{ msg }}</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="doCancel">取消</el-button>
        <el-button :loading="crud.dataStatus[data.id].delete === 2" type="primary" size="mini" @click="crud.doDelete(data)">确定</el-button>
      </div>
      <el-button slot="reference" :disabled="disabledDle" type="text" size="mini" @click="toDelete" >删除</el-button>
    </el-popover>
    <el-button v-if="data.approval !== null" v-permission="permission.approval" slot="reference" type="text" size="mini" @click="toViewApproval(data.approval.id)" >查看审批</el-button>
  </div>
</template>
<script>
import CRUD, { crud } from '@crud/crud'
import { viewUserApproval } from '@/api/system/approval'
export default {
  mixins: [crud()],
  props: {
    data: {
      type: Object,
      required: true
    },
    permission: {
      type: Object,
      required: true
    },
    disabledEdit: {
      type: Boolean,
      default: false
    },
    disabledDle: {
      type: Boolean,
      default: false
    },
    msg: {
      type: String,
      default: '确定删除本条数据吗？'
    }
  },
  data() {
    return {
      pop: false
    }
  },
  methods: {
    doCancel() {
      this.pop = false
      this.crud.cancelDelete(this.data)
    },
    toDelete() {
      this.pop = true
    },
    toViewApproval(id) {
      let viewUrl = this.viewUserApproval(id);
      window.open(viewUrl)
    },
    [CRUD.HOOK.afterDelete](crud, data) {
      if (data === this.data) {
        this.pop = false
      }
    },
    onPopoverShow() {
      setTimeout(() => {
        document.addEventListener('click', this.handleDocumentClick)
      }, 0)
    },
    onPopoverHide() {
      document.removeEventListener('click', this.handleDocumentClick)
    },
    handleDocumentClick(event) {
      this.pop = false
    }
  }
}
</script>
