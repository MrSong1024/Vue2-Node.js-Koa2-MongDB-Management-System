<template>
  <div id="jobDefSelector">
    <!-- user select dialog -->
    <el-row :gutter="25" style="height: 100%;">
      <!--侧边岗位组数据-->
      <el-col :span="18" class="user-list-col">
        <jobDef-list
          ref="list"
          :select-type="selectType"
          :mode="mode"
          :passed-in-param="dataListQueryParam"
          @selectChange="handleDataSelChange"
        />
      </el-col>
      <el-col :span="6" class="selected-user-col">
        <div class="selected-header">
          <span>已选择岗位组</span>
          <span>
            <el-button
              slot="reference"
              class="filter-item"
              type="text"
              size="mini"
              @click="clearData()"
            >清空</el-button>
          </span>
        </div>
        <template v-if="selectedData && selectedData.length > 0">
          <p v-for="(item,index) in selectedData" :key="item.id">
            <span>
              {{ item.name }}
              <el-button size="mini" type="text" @click="deleteData(index, item.id)">移除</el-button>
            </span>
          </p>
        </template>
      </el-col>
    </el-row>
    <!--选择操作-->
    <div class="selector-oper">
      <el-button
        slot="reference"
        class="filter-item"
        type="primary"
        icon
        size="mini"
        @click="selectData()"
      >确认选择</el-button>
    </div>
  </div>
</template>

<script>
import JobDefList from '@/components/biz/JobDefList'

export default {
  name: 'JobDefSelector',
  components: { JobDefList },
  props: {
    selectType: {
      type: String,
      default: 'checkbox'
    },
    passedInParam: {
      type: Object,
      default: undefined
    },
    passedSelectedData: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      dataListQueryParam: this.passedInParam,
      mode: "view",
      selectedData: this.passedSelectedData ? this.passedSelectedData : [],
      timeout: null
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
    handleDataSelChange(data) {
      if (this.selectType === 'checkbox') {
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            let exist = false
            for (let j = 0; j < this.selectedData.length; j++) {
              if (data[i].id === this.selectedData[j].id) {
                exist = true
                break
              }
            }
            if (!exist) {
              const data1 = JSON.parse(JSON.stringify(data[i]))
              this.selectedData.push(data1)
            }
          }
        }
      } else {
        if (data) {
          this.selectedData = []
          this.selectedData.push(data)
        }
      }
    },
    // 选择事件
    selectData() {
      this.$emit('selectChange', this.selectedData)
    },
    deleteData(index, id) {
      // 移除已选择列表中的用户
      this.selectedData.splice(index, 1)
      // 移除userList selection
      if (this.selectType === 'checkbox') {
        this.$refs.list.crud.selections.forEach((item, index) => {
          if (item.id === id) {
            this.$refs.list.$refs.table.toggleRowSelection(item, false)
          }
        })
      } else {
        this.$refs.list.radio = ''
      }
    },
    clearData() {
      this.selectedData = []
      if (this.selectType === 'checkbox') {
        this.$refs.list.crud.selections = []
        this.$refs.list.$refs.table.clearSelection()
      } else {
        this.$refs.list.radio = ''
      }
    }
  }
}
</script>

<style>
#jobDefSelector .crud-opts {
  /*padding: 6px 0;*/
  padding: 0 0 10px 0;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
#jobDefSelector .crud-opts .crud-opts-right {
  margin-left: auto;
}
#jobDefSelector .org-tree-col {
  /*border-right: 1px solid #f5f5f5;*/
  height: 100%;
}
#jobDefSelector .user-list-col {
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
