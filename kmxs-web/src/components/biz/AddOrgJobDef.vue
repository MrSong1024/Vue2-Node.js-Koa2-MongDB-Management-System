<template>
  <div>
    <!--工具栏-->
    <div class="head-container crud-opts">
      <slot name="left" />
      <div class="crud-opts-left">
        <template v-if="mode==='my'">
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
          <!--          <el-select-->
          <!--            v-model="queryParam.stdTypeCode"-->
          <!--            clearable-->
          <!--            size="mini"-->
          <!--            placeholder="岗位组性质"-->
          <!--            class="filter-item"-->
          <!--            style="width: 110px"-->
          <!--            @change="queryData()"-->
          <!--          >-->
          <!--            <el-option-->
          <!--              v-for="item in dict.jobdef_std.filter((items)=> items.label !== '非标岗')"-->
          <!--              :key="item.value"-->
          <!--              :label="item.label"-->
          <!--              :value="item.value"-->
          <!--            />-->
          <!--          </el-select>-->
          <!--          <el-select-->
          <!--            v-model="queryParam.approvalStatus"-->
          <!--            clearable-->
          <!--            size="mini"-->
          <!--            placeholder="状态"-->
          <!--            class="filter-item"-->
          <!--            style="width: 100px"-->
          <!--            @change="queryData()"-->
          <!--          >-->
          <!--            <el-option-->
          <!--              v-for="item in dict.approval_status"-->
          <!--              :key="item.value"-->
          <!--              :label="item.label"-->
          <!--              :value="item.value"-->
          <!--            />-->
          <!--          </el-select>-->
          <!--          <el-select-->
          <!--            v-model="queryParam.typeCode"-->
          <!--            clearable-->
          <!--            size="mini"-->
          <!--            placeholder="类型"-->
          <!--            class="filter-item"-->
          <!--            style="width: 100px"-->
          <!--            @change="queryData()"-->
          <!--          >-->
          <!--            <el-option-->
          <!--              v-for="item in dict.jobdef_type"-->
          <!--              :key="item.value"-->
          <!--              :label="item.label"-->
          <!--              :value="item.value"-->
          <!--            />-->
          <!--          </el-select>-->
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
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      size="small"
      style="width: 100%;"
    >
      <el-table-column width="60px">
        <template slot-scope="scope">
          <el-radio
            v-model="radio"
            class="select-radio"
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
        v-if="columns.visible('funcName')"
        prop="funcName"
        label="职能名称"
        width="100px"
      />
      <el-table-column
        v-if="columns.visible('funcCode')"
        prop="funcCode"
        label="职能编码"
      />
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
        v-if="columns.visible('orgLevelName')"
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
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--    <div class="selector-oper">-->
    <!--      <el-button-->
    <!--        slot="reference"-->
    <!--        class="filter-item"-->
    <!--        type="primary"-->
    <!--        icon-->
    <!--        size="mini"-->
    <!--        @click="selectJobDef()"-->
    <!--      >确认选择</el-button>-->
    <!--    </div>-->
  </div>
</template>

<script>
import crudJobDef from "@http/system/jobDef";
import CRUD, { presenter, header, crud } from "@crud/crud";
import pagination from "@crud/Pagination";
// crud交由presenter持有
const defaultCrud = CRUD({
  title: "JobDef",
  url: "api/jobDef",
  sort: "id,desc",
  crudMethod: { ...crudJobDef },
  queryOnPresenterCreated: false,
});
export default {
  name: "AddOrgJobDef",
  components: { pagination },
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
      radio: null,
      queryParam: this.passedInParam,
      showOverflowTooltip: true, // 表格每一列超出长度显示...显示文本提示tooltip
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
          : "1, 2, 3, 4";
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
    radioIdx(row) {
      return row.name + "-" + row.id;
    },
    // 单选操作事件
    radioSelChange(data) {
      console.log(448, "data>>", data);
      this.$emit("selectChange", data);
      // this.selectJobDef(data)
    },
    selectJobDef(data) {
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
</style>
