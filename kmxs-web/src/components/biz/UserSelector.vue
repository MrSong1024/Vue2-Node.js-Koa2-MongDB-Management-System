<template>
  <div id="userSelector">
    <!-- user select dialog -->
    <el-row :gutter="25" style="height: 50vh;">
      <!--侧边部门数据-->
      <el-col :span="5" class="org-tree-col" style="height:50vh;overflow-y: hidden;">
        <org-tree @treeItemClick="handleTreeItemClick" />
      </el-col>
      <!--用户数据-->
      <el-col :span="15" class="user-list-col">
        <user-list
          v-if="update"
          ref="userList"
          style="height:50vh;overflow-y: auto;"
          :show-advanced-filter="userListAdvancedFilter"
          :select-type="selectType"
          :passed-in-param="userListQueryParam"
          @selectChange="handleUserSelChange"
        />
      </el-col>
      <el-col :span="4" class="selected-user-col">
        <div class="selected-header">
          <span>已选择用户</span>
          <span>
            <el-button
              slot="reference"
              class="filter-item"
              type="text"
              size="mini"
              @click="clearUser()"
            >清空</el-button>
          </span>
        </div>
        <template v-if="selectedUsers && selectedUsers.length > 0">
          <p v-for="(item,index) in selectedUsers" :key="item.id">
            <span>
              {{ item.nickName }}
              <el-button size="mini" type="text" @click="deleteUser(index, item.id)">移除</el-button>
            </span>
          </p>
        </template>
      </el-col>
    </el-row>
    <!--选择操作-->
    <div v-if="showSaveButton" class="selector-oper">
      <el-button
        slot="reference"
        class="filter-item"
        type="primary"
        icon
        size="mini"
        @click="selectUsers()"
      >确认选择</el-button>
    </div>
  </div>
</template>

<script>
import OrgTree from '@/components/biz/OrgTree'
import UserList from '@/components/biz/UserList'

export default {
  name: 'UserSelector',
  components: { OrgTree, UserList },
  props: {
    selectType: {
      type: String,
      default: 'radio'
    },
    passedInParam: {
      type: Object,
      default: undefined
    },
    passedSelectedUser: {
      type: Array,
      default: undefined
    },
    showAdvancedFilter: {
      type: Boolean,
      default: true
    },
    showButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      userListQueryParam: this.passedInParam,
      userListAdvancedFilter: this.showAdvancedFilter,
      selectedUsers: this.passedSelectedUser ? this.passedSelectedUser : [],
      timeout: null,
      userSelDialog: { title: '选择用户', show: false },
      update: true,
      showSaveButton: this.showButton ? this.showButton : false
    }
  },
  computed: {},
  created() {},
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    handleTreeItemClick(data) {
      this.update = false
      this.$nextTick(() => {
        this.update = true
        this.userListQueryParam.deptCode = data.code
        this.userListQueryParam.deptIds = data.id
        this.userListQueryParam.deptId = data.id
        this.$refs.userList.getUserData()
      })
    },
    handleUserSelChange(data) {
      if (this.selectType === 'checkbox') {
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            let exist = false
            for (let j = 0; j < this.selectedUsers.length; j++) {
              if (data[i].id === this.selectedUsers[j].id) {
                exist = true
                break
              }
            }
            if (!exist) {
              const user = JSON.parse(JSON.stringify(data[i]))
              this.selectedUsers.push(user)
            }
          }
        }
      } else {
        if (data) {
          this.selectedUsers = []
          this.selectedUsers.push(data)
        }
      }
      if (!this.showSaveButton) {
        this.selectUsers()
      }
    },
    // 选择事件
    selectUsers() {
      this.$emit('selectChange', this.selectedUsers)
    },
    deleteUser(index, id) {
      // 移除已选择列表中的用户
      this.selectedUsers.splice(index, 1)
      // 移除userList selection
      if (this.selectType === 'checkbox') {
        this.$refs.userList.crud.selections.forEach((item, index) => {
          if (item.id === id) {
            this.$refs.userList.$refs.table.toggleRowSelection(item, false)
          }
        })
      } else {
        this.$refs.userList.radio = ''
      }
    },
    clearUser() {
      this.selectedUsers = []
      // todo: 清空userList selection
      if (this.selectType === 'checkbox') {
        this.$refs.userList.crud.selections = []
        this.$refs.userList.$refs.table.clearSelection()
      } else {
        this.$refs.userList.radio = ''
      }
    }
  }
}
</script>

<style>
#userSelector .crud-opts {
  /*padding: 6px 0;*/
  padding: 0 0 10px 0;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
#userSelector .crud-opts .crud-opts-right {
  margin-left: auto;
}
#userSelector .org-tree-col {
  /*border-right: 1px solid #f5f5f5;*/
  height: 100%;
}
#userSelector .user-list-col {
  border-left: 1px solid #f5f5f5;
  border-right: 1px solid #f5f5f5;
  height: 100%;
}
.selected-header {
    border-bottom: 1px solid #f5f5f5;
}
.selector-oper {
    margin-top: 10px;
    padding: 15px 0;
    text-align: center;
    border-top: 1px solid #f5f5f5;
}
</style>
