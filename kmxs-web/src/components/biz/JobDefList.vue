<template>
  <div id="jobDefList">
    <!--工具栏-->
    <div class="head-container crud-opts">
      <slot name="left" />
      <div class="crud-opts-left">
        <template v-if="mode==='my'">
          <template v-if="role">
            <el-select
              v-model="queryParam.formCode"
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
          </template>
          <template v-else>
            <el-select
              v-model="queryParam.formCode"
              clearable
              size="mini"
              placeholder="所属板块"
              class="filter-item"
              style="width: 100px"
              disabled
            >
              <el-option
                v-for="item in dict.jobdef_firm"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <el-input
            v-model="queryParam.blurry"
            clearable
            size="mini"
            placeholder="请输入名称"
            style="width: 140px;"
            class="filter-item"
            @keyup.enter.native="queryData()"
          />
          <template v-if="queryParam.formCode === 'CIFI'">
            <el-select
              v-model="queryParam.funcCode"
              clearable
              size="mini"
              placeholder="职能名称"
              class="filter-item"
              style="width: 100px"
              @change="queryData()"
            >
              <el-option
                v-for="item in dict.jobdef_func"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-model="queryParam.orgLevelCode"
              clearable
              size="mini"
              placeholder="层级分类"
              class="filter-item"
              style="width: 100px"
              @change="queryData()"
            >
              <el-option
                v-for="item in dict.jobdef_level.filter((items)=> items.label !== '项目')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <el-select
            v-model="queryParam.stdTypeCode"
            clearable
            size="mini"
            placeholder="岗位组性质"
            class="filter-item"
            style="width: 110px"
            @change="queryData()"
          >
            <el-option
              v-for="item in dict.jobdef_std.filter((items)=> items.label !== '非标岗')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="queryParam.approvalStatus"
            clearable
            size="mini"
            placeholder="状态"
            class="filter-item"
            style="width: 100px"
            @change="queryData()"
          >
            <el-option
              v-for="item in dict.approval_status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="queryParam.typeCode"
            clearable
            size="mini"
            placeholder="类型"
            class="filter-item"
            style="width: 100px"
            @change="queryData()"
          >
            <el-option
              v-for="item in dict.jobdef_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <template v-else-if="mode==='view'">
          <el-select
            v-model="queryParam.formCode"
            clearable
            size="mini"
            placeholder="所属板块"
            class="filter-item"
            style="width: 100px"
          >
            <el-option
              v-for="item in dict.jobdef_firm"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="queryParam.blurry"
            clearable
            size="mini"
            placeholder="请输入名称"
            style="width: 140px;"
            class="filter-item"
            @keyup.enter.native="queryData()"
          />
          <el-select
            v-model="queryParam.funcCode"
            clearable
            size="mini"
            placeholder="职能名称"
            class="filter-item"
            style="width: 100px"
            @change="queryData()"
          >
            <el-option
              v-for="item in dict.jobdef_func"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="queryParam.orgLevelCode"
            clearable
            size="mini"
            placeholder="层级分类"
            class="filter-item"
            style="width: 100px"
            @change="queryData()"
          >
            <el-option
              v-for="item in dict.jobdef_level"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="queryParam.stdTypeCode"
            clearable
            size="mini"
            placeholder="岗位组性质"
            class="filter-item"
            style="width: 110px"
            @change="queryData()"
          >
            <el-option
              v-for="item in dict.jobdef_std"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <template v-if="mode === 'query'">
          <el-input
            v-model="queryParam.blurry"
            clearable
            size="mini"
            placeholder="请输入名称"
            style="width: 140px;"
            class="filter-item"
            @keyup.enter.native="queryData()"
          />
          <el-select
            v-model="queryParam.typeCode"
            clearable
            size="mini"
            placeholder="类型"
            class="filter-item"
            style="width: 100px"
            @change="queryData()"
          >
            <el-option
              v-for="item in dict.jobdef_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="queryParam.funcCode"
            clearable
            size="mini"
            placeholder="职能名称"
            class="filter-item"
            style="width: 100px"
            @change="queryData()"
          >
            <el-option
              v-for="item in dict.jobdef_func"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="queryParam.orgLevelCode"
            clearable
            size="mini"
            placeholder="层级分类"
            class="filter-item"
            style="width: 100px"
            @change="queryData()"
          >
            <el-option
              v-for="item in dict.jobdef_level"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="queryParam.stdTypeCode"
            clearable
            size="mini"
            placeholder="性质"
            class="filter-item"
            style="width: 110px"
            @change="queryData()"
          >
            <el-option
              v-for="item in dict.jobdef_std"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="queryParam.formCode"
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
        </template>
        <span>
          <el-button
            class="filter-item"
            size="mini"
            type="default"
            icon="el-icon-search"
            @click="queryData()"
          >搜索</el-button>
        </span>
      </div>
      <div
        v-if="mode === 'my'"
        class="crud-opts-right"
      >
        <el-button
          :loading="crud.downloadLoading"
          :disabled="!crud.data.length"
          class="filter-item"
          size="mini"
          type="default"
          icon="el-icon-download"
          @click="crud.doExport"
        >导出</el-button>
        <el-button
          v-if="queryParam.formCode === 'CIFI'"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addJobDef"
        >新增</el-button>
      </div>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      size="small"
      style="width: 100%;"
      @selection-change="checkboxSelChange"
    >
      <el-table-column
        v-if="mode !=='my' && selectType === 'checkbox' && mode !== 'query'"
        type="selection"
        width="55"
      />
      <el-table-column
        v-if="mode !=='my' && selectType === 'radio' && mode !== 'query'"
        width="60px"
      >
        <template slot-scope="scope">
          <el-radio
            v-model="radio"
            class="select-raido"
            :label="radioIdx(scope.row)"
            @change.native="radioSelChange(scope.row)"
          >&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        v-if="columns.visible('code')"
        prop="code"
        label="岗位组编码"
      />
      <el-table-column
        v-if="columns.visible('name')"
        prop="name"
        label="岗位组名称"
        width="180px"
        :show-overflow-tooltip="showOverflowTooltip"
      />
      <el-table-column
        v-if="columns.visible('stdTypeCode')"
        prop="stdTypeCode"
        label="岗位组性质"
        width="80px"
      >
        <template slot-scope="scope">
          <el-tooltip>
            <template v-if="!queryParam.stdTypeCode">
              <template v-if="scope.row.stdTypeCode === '1'">
                <div slot="content">通用岗位(一岗多人)</div>
                <div class="more-text">通用岗位(一岗多人)</div>
              </template>
              <template v-else-if="scope.row.stdTypeCode==='2'">
                <div slot="content">专用岗位(一岗一人)</div>
                <div class="more-text">专用岗位(一岗一人)</div>
              </template>
            </template>
            <template v-else>
              <template v-if="scope.row.stdTypeCode === '0'">
                <div slot="content">非标岗位</div>
                <div class="more-text">非标岗位</div>
              </template>
              <template v-else-if="scope.row.stdTypeCode === '1'">
                <div slot="content">通用岗位(一岗多人)</div>
                <div class="more-text">通用岗位(一岗多人)</div>
              </template>
              <template v-else-if="scope.row.stdTypeCode === '2'">
                <div slot="content">专用岗位(一岗一人)</div>
                <div class="more-text">专用岗位(一岗一人)</div>
              </template>
            </template>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column
        v-if="columns.visible('typeCode')"
        prop="typeCode"
        label="岗位类型"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.typeCode === '1'">行政岗</span>
          <span v-else-if="scope.row.typeCode==='2'">业务岗</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns.visible('bizSys')"
        prop="bizSys"
        label="业务系统"
        width="100px"
      >
        <template slot-scope="scope">
          <el-tooltip>
            <div slot="content">{{ scope.row.bizSys }}</div>
            <div class="more-text">{{ scope.row.bizSys }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns.visible('funcName') && queryParam.formCode === 'CIFI'"
        prop="funcName"
        label="职能名称"
        width="100px"
      />
      <el-table-column
        v-if="columns.visible('funcCode') && queryParam.formCode === 'CIFI'"
        prop="funcCode"
        label="职能编码"
      />
      <el-table-column
        v-if="columns.visible('orgLevelName') && queryParam.formCode === 'CIFI'"
        prop="orgLevelName"
        label="层级分类"
        width="120px"
        :show-overflow-tooltip="showOverflowTooltip"
      />
      <el-table-column
        v-if="columns.visible('approval')"
        prop="approval"
        label="状态"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.approval && scope.row.approval.status === '1'">草稿</span>
          <span v-if="scope.row.approval && scope.row.approval.status === '2'">流程草稿</span>
          <span
            v-if="scope.row.approval && scope.row.approval.status === '3'"
            style="color: #e6a23c;"
          >审核中</span>
          <span
            v-if="scope.row.approval && scope.row.approval.status === '4'"
            style="color: #67c23a;"
          >已生效</span>
          <span v-if="scope.row.approval && scope.row.approval.status === '5'">已驳回</span>
          <span v-if="scope.row.approval && scope.row.approval.status === '6'">已撤回</span>
          <span v-if="scope.row.approval && scope.row.approval.status === '7'">已废弃</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="mode==='my'"
        label="操作"
        width="120px"
        fixed="right"
      >
        <template slot-scope="scope">
          <template v-if="queryParam.formCode === 'CIFI'">
            <el-button
              size="mini"
              type="text"
              style="color: #2761FF;"
              @click="getViewDetail(scope.row)"
            >查看</el-button>
            <el-button
              v-show="scope.row.approval && scope.row.approval.status === '4' && scope.row.typeCode === '2'"
              size="mini"
              type="text"
              style="color: #F56C6C;"
              @click="disableJobDef(scope.row)"
            >禁用</el-button>
          </template>
          <template v-if="queryParam.formCode !== 'CIFI'">
            <el-button
              size="mini"
              type="text"
              style="color: #2761FF;"
              @click="getUnCIFIViewDetail(scope.row)"
            >查看</el-button>
          </template>
          <el-button
            v-show="scope.row.approval && scope.row.approval.status !== '4' && scope.row.approval.status !== '3'"
            size="mini"
            type="text"
            style="color: #909399;"
            @click="invalidJobDef(scope.row)"
          >作废</el-button>
        </template>
      </el-table-column>
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
            style="color: #2761FF;"
            @click="getViewDetail(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--新增 -->
    <el-drawer
      :append-to-body="true"
      :visible.sync="drawer"
      :size="norWidth"
      :with-header="false"
      :before-close="closeDrawer"
    >
      <div class="demo-drawer__content">
        <JobDefInfo
          v-if="hackReset"
          @click="clickDrawer"
          @moreWidth="getMoreWith"
        />
      </div>
    </el-drawer>
    <!-- 查看右侧弹出 -->
    <el-drawer
      :append-to-body="true"
      :visible.sync="viewDrawer"
      :size="viewWidth"
      :show-close="false"
      :before-close="closeViewDrawer"
    >
      <div
        slot="title"
        class="view-drawer-title"
      >
        <div class="my-title">查看</div>
        <div
          class="right-close"
          @click="closeViewDrawer"
        ><i class="el-icon-close" /></div>
      </div>
      <div
        class="demo-drawer__content"
        style="padding: 10px;"
      >
        <JobDefDetail
          v-if="hackResetView"
          :id="currentId"
          :view-mode="detailMode"
          @click="clickViewDrawer"
        />
      </div>
    </el-drawer>
    <!-- 非CIFI模块的查看 -->
    <el-drawer
      :append-to-body="true"
      :visible.sync="unCIFIViewDrawer"
      :size="viewWidth"
      :show-close="false"
      :before-close="closeUnCIFIViewDrawer"
    >
      <div
        slot="title"
        class="view-drawer-title"
      >
        <div class="my-title">查看</div>
        <div
          class="right-close"
          @click="closeUnCIFIViewDrawer"
        ><i class="el-icon-close" /></div>
      </div>
      <div
        class="demo-drawer__content"
        style="padding: 10px;"
      >
        <UnCIFIJobDef
          v-if="unCIFIHackResetView"
          :id="currentId"
          :from-code="detailMode"
          @click="clickUnCIFIViewDrawer"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import crudJobDef from "@http/system/jobDef";
import JobDefInfo from "@/components/biz/JobDefInfo";
import JobDefDetail from "@/components/biz/JobDefApproval";
import UnCIFIJobDef from "@/components/biz/UnCIFIJobDef";
import pagination from "@crud/Pagination";
import { disableJobDef, invalidJobDef } from "@http/system/jobDef";
import CRUD, { presenter, header, crud } from "@crud/crud";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "JobDef",
  url: "api/jobDef",
  sort: "id,desc",
  crudMethod: { ...crudJobDef },
  queryOnPresenterCreated: false,
});
export default {
  name: "JobDefList",
  components: { pagination, JobDefInfo, JobDefDetail, UnCIFIJobDef },
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
      currentId: null,
      detailMode: null,
      showOverflowTooltip: true, // 表格每一列超出长度显示...显示文本提示tooltip
      unCIFIViewDrawer: false,
      unCIFIHackResetView: null,
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
      if (this.mode === "my") {
        this.crud.query.orgLevelCodes = this.crud.query.orgLevelCode
          ? this.crud.query.orgLevelCode.split("")
          : "1, 2, 4";
        this.crud.query.stdTypeCodes = this.crud.query.stdTypeCode
          ? this.crud.query.stdTypeCode.split("")
          : "1, 2";
      } else {
        this.crud.query.orgLevelCodes = this.crud.query.orgLevelCode
          ? this.crud.query.orgLevelCode.split("")
          : "";
        this.crud.query.stdTypeCodes = this.crud.query.stdTypeCode
          ? this.crud.query.stdTypeCode.split("")
          : "0, 1, 2";
      }
      for (const k in this.crud.query) {
        if (this.crud.query[k] === "") {
          delete this.crud.query[k];
        }
      }
      this.crud.toQuery();
      this.$matomo.trackEvent(
        "岗位组搜索按钮",
        "Click",
        "搜索岗位组",
        this.queryParam
      );
    },
    resetQueryParam() {
      this.queryParam = {};
      this.crud.resetQuery();
    },
    // 新增
    addJobDef() {
      this.hackReset = true;
      this.drawer = true;
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
      this.currentId = params.id;
      if (this.mode === "query") {
        this.detailMode = "query";
        this.viewDrawer = true;
        this.hackResetView = true;
        return;
      }
      // 1 草稿 3 审核中 4 已审核 7 已废弃
      // 审核中 只能查看页面
      // 审核通过 只能修改基础信息
      // 草稿和其他 不存在code 的时候都可以修改 存在code只能修改基础信息
      const status = params.approval ? Number(params.approval.status) : "";
      const code = params.code;
      if ((status === 1 && code) || status === 4) {
        // 只能修改基础信息
        this.detailMode = "editBase";
      } else if (status === 1 || status === 5 || status === 6) {
        // 都可以修改
        this.detailMode = "editAll";
      } else if (status === 3) {
        // 只能查看
        this.detailMode = "view";
      } else {
        // 只能查看
        this.detailMode = "view";
      }
      this.viewDrawer = true;
      this.hackResetView = true;
    },
    // 非CIFI模块的查看页面
    getUnCIFIViewDetail(params) {
      this.currentId = params.id;
      this.unCIFIViewDrawer = true;
      this.unCIFIHackResetView = true;
      this.detailMode = this.queryParam.formCode;
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
    // 多选按钮事件
    checkboxSelChange(selection) {
      this.crud.selectionChangeHandler(selection);
      const data = [];
      if (selection && selection.length > 0) {
        for (let i = 0; i < selection.length; i++) {
          for (let j = 0; j < this.crud.data.length; j++) {
            if (selection[i].id === this.crud.data[j].id) {
              data.push(this.crud.data[j]);
              break;
            }
          }
        }
        this.$emit("selectChange", data);
      }
    },
    // 单选操作事件
    radioSelChange(data) {
      this.$emit("selectChange", data);
    },
    // 禁用
    disableJobDef(data) {
      this.$confirm("确定要禁用吗？")
        .then((_) => {
          disableJobDef(data.id)
            .then((res) => {
              console.log("禁用", res);
              this.$matomo.trackEvent(
                "禁用按钮",
                "Click",
                "岗位组禁用",
                data.id
              );
              this.$message.success({
                message: "禁用成功!",
                duration: 2000,
              });
              window.location.href = res;
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((_) => {});
    },
    // 作废
    invalidJobDef(data) {
      this.$confirm("确定要作废吗？")
        .then((_) => {
          invalidJobDef(data.id)
            .then((res) => {
              console.log("作废", res);
              this.$matomo.trackEvent(
                "作废按钮",
                "Click",
                "岗位组作废",
                data.id
              );
              this.$message.success({
                message: "作废成功!",
                duration: 2000,
              });
              this.queryData();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((_) => {});
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
