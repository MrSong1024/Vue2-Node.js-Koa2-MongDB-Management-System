<template>
  <div id="jobDefList">
    <!--工具栏-->
    <div class="head-container crud-opts">
      <slot name="left" />
      <div class="crud-opts-left">
        <template v-if="mode === 'query'">
          <el-input
            v-model="queryParam.syncObjUid"
            clearable
            size="mini"
            placeholder="同步标识"
            style="width: 140px"
            class="filter-item"
            @keyup.enter.native="queryData()"
          />
          <el-select
            v-model="queryParam.syncAlertStatus"
            clearable
            size="mini"
            placeholder="告警状态"
            class="filter-item"
            style="width: 100px"
            @change="queryData()"
          >
            <el-option
              v-for="item in dict.sync_sap_alerts_status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="queryParam.syncObjTypeCode"
            clearable
            size="mini"
            placeholder="对象类型"
            class="filter-item"
            style="width: 100px"
            @change="queryData()"
          >
            <el-option
              v-for="item in dict.sync_sap_obj_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!--          v-show="plateShow"-->
          <el-select
            v-model="queryParam.plate"
            clearable
            size="mini"
            placeholder="所属板块"
            class="filter-item"
            style="width: 100px"
            @change="queryData()"
          >
            <el-option
              v-for="item in dict.jobdef_firm"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-date-picker
            v-model="queryParam.updateTime"
            :default-time="['00:00:00', '23:59:59']"
            type="daterange"
            range-separator=":"
            size="small"
            class="date-item"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </template>
        <span>
          <el-button
            class="filter-item"
            size="mini"
            type="default"
            icon="el-icon-search"
            @click="queryData()"
            >搜索</el-button
          >
        </span>
      </div>
      <div v-if="mode === 'my'" class="crud-opts-right">
        <el-button
          :loading="crud.downloadLoading"
          :disabled="!crud.data.length"
          class="filter-item"
          size="mini"
          type="default"
          icon="el-icon-download"
          @click="crud.doExport"
          >导出
        </el-button>
        <el-button
          v-if="queryParam.formCode === 'CIFI'"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addJobDef"
          >新增
        </el-button>
      </div>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      size="small"
      style="width: 100%"
    >
      <el-table-column
        v-if="mode !== 'my' && selectType === 'checkbox' && mode !== 'query'"
        type="selection"
        width="55"
      />
      <el-table-column
        v-if="mode !== 'my' && selectType === 'radio' && mode !== 'query'"
        width="60px"
      >
        <template slot-scope="scope">
          <el-radio
            v-model="radio"
            class="select-raido"
            :label="radioIdx(scope.row)"
            @change.native="radioSelChange(scope.row)"
            >&nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="100px" />
      <el-table-column
        v-if="columns.visible('syncObjUid')"
        prop="syncObjUid"
        label="同步标识"
      />
      <el-table-column
        v-if="columns.visible('syncAlertMsg')"
        prop="syncAlertMsg"
        label="告警信息"
        :show-overflow-tooltip="showOverflowTooltip"
      />
      <el-table-column
        v-if="columns.visible('syncObjTypeName')"
        prop="syncObjTypeName"
        label="对象类型"
      />
      <el-table-column
        v-if="columns.visible('plate')"
        prop="plate"
        label="板块名称"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        label="创建日期"
      >
        <template slot-scope="scope">
          <span>{{ $utils.parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        label="修改日期"
      >
        <template slot-scope="scope">
          <span>{{ $utils.parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns.visible('syncAlertStatus')"
        label="状态"
        prop="syncAlertStatus"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.syncAlertStatus"
            active-value="1"
            :disabled="scope.row.id === 1"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeBizJobEnabled(scope.row, scope.row.syncAlertStatus)"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="mode === 'my'"
        label="操作"
        width="120px"
        fixed="right"
      />
      <el-table-column
        v-if="mode === 'query'"
        label="操作"
        width="120px"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            style="color: #2761ff"
            @click="getViewDetail(scope.row)"
            >查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />

    <!-- 查看右侧弹出 -->
    <el-drawer
      :append-to-body="true"
      :visible.sync="viewDrawer"
      :size="viewWidth"
      :show-close="false"
      :before-close="closeViewDrawer"
    >
      <div slot="title" class="view-drawer-title">
        <div class="my-title">查看</div>
        <div class="right-close" @click="closeViewDrawer">
          <i class="el-icon-close" />
        </div>
      </div>
      <div class="demo-drawer__content" style="padding: 10px">
        <SapSyncAlertsDetail
          v-if="hackResetView"
          :id="id"
          :view-mode="detailMode"
          @click="clickViewDrawer"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { postHrSyncAlerts } from "@http/mnt/sapSyncAlerts";
import SapSyncAlertsDetail from "@/components/biz/SapSyncAlertsApproval";
import pagination from "@crud/Pagination";
import CRUD, { presenter, header, crud } from "@crud/crud";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "HrSyncAlerts",
  url: "/api/hrSyncAlerts/",
  sort: "id,desc",
  crudMethod: {},
  queryOnPresenterCreated: false,
});
export default {
  name: "HrSyncAlerts",
  components: { pagination, SapSyncAlertsDetail },
  mixins: [presenter(defaultCrud), header(), crud()],
  props: {
    selectType: {
      type: String,
      default: "checkbox",
    },
    mode: {
      type: String,
      default: "my",
    },
    passedInParam: {
      type: Object,
      default: undefined,
    },
    role: {
      type: Boolean,
      default: false,
    },
  },
  dicts: [
    "sync_sap_obj_type",
    "sync_sap_alerts_status",
    "jobdef_func",
    "jobdef_level",
    "jobdef_std",
    "jobdef_firm",
    "jobdef_type",
    "jobdef_status",
    "approval_status",
  ],
  data() {
    return {
      queryParam: this.passedInParam,
      drawer: false,
      hackReset: false, // 强制刷新子组件
      hackResetView: false, // 强制刷新子组件
      norWidth: "600px",
      viewWidth: "1200px",
      viewDrawer: false,
      id: null,
      detailMode: null,
      showOverflowTooltip: true, // 表格每一列超出长度显示...显示文本提示tooltip
      unCIFIViewDrawer: false,
      unCIFIHackResetView: null,
      plateShow: true,
    };
  },
  created() {
    this.$nextTick(() => {
      this.queryData();
    });
  },
  methods: {
    queryData() {
      this.crud.query = this.queryParam;
      for (const k in this.crud.query) {
        if (this.crud.query[k] === "") {
          delete this.crud.query[k];
        }
      }
      this.crud.toQuery();
      this.$matomo.trackEvent(
        "回收sap错误搜索按钮",
        "Click",
        "搜索回收SAP错误信息",
        this.queryParam
      );
    },
    resetQueryParam() {
      this.queryParam = {};
      this.crud.resetQuery();
    },
    changeBizJobEnabled(data, val) {
      console.log(data, val);
      /* eslint-disable-next-line */
      if (val == 1) {
        val = 1;
      } else {
        val = 0;
      }
      this.$confirm(
        '此操作将 "' +
          data.syncObjUid +
          "标识进行" +
          this.dict.label.sync_sap_alerts_status[val] +
          "操作, 是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const params = {
            id: data.id,
            syncAlertStatus: val,
          };
          postHrSyncAlerts(params).then((res) => {});
          location.reload();
        })
        .catch(() => {
          data.bizJobEnabled = !data.bizJobEnabled;
        });
    },
    clickDrawer(val) {
      this.drawer = val;
      this.hackReset = val;
      this.norWidth = "550px";
    },
    closeDrawer() {
      this.drawer = false;
      this.hackReset = false;
    },
    getMoreWith(val) {
      this.norWidth = val;
    },
    getViewDetail(params) {
      this.id = params.id;
      this.viewDrawer = true;
      this.hackResetView = true;
    },

    handleClose() {
      this.viewDrawer = false;
      this.hackResetView = false;
    },
    clickViewDrawer(val) {
      this.viewDrawer = val;
      this.hackResetView = false;
    },
    closeViewDrawer() {
      this.viewDrawer = false;
      this.hackResetView = false;
    },
    closeUnCIFIViewDrawer() {
      this.unCIFIViewDrawer = false;
      this.unCIFIHackResetView = false;
    },
    clickUnCIFIViewDrawer(val) {
      this.unCIFIViewDrawer = val;
      this.unCIFIHackResetView = false;
    },
    radioIdx(row) {
      return row.name + "-" + row.id;
    },
    dataConversion() {},
    // 单选操作事件
    radioSelChange(data) {
      this.$emit("selectChange", data);
    },
  },
};
</script>

<style scoped>
#jobDefList .crud-opts {
  display: -webkit-flex;
  display: flex;
  align-items: center;
  padding: 0 10px 10px 0;
}

#jobDefList .crud-opts .crud-opts-right {
  margin-left: auto;
}

/deep/ .el-drawer__body {
  overflow-y: auto;
  background: #f5f5f5;
}

.more-text {
  width: 60px;
  overflow: hidden !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/deep/ .el-drawer__header {
  margin-bottom: 0px;
  padding-top: 16px;
  padding-left: 0px;
  color: #fff;
  background: #2761ff;
}

.view-drawer-title {
  display: flex;
  justify-content: space-between;
  padding: 0px 0px 16px 16px;
  text-align: justify;
}

.view-drawer-title .right-close {
  cursor: pointer;
}

.view-drawer-title .my-title,
/deep/ .demo-drawer__content {
  text-align: left;
}
</style>
