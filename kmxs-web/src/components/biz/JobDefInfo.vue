<template>
  <div id="jobDefInfo">
    <div class="steps-container">
      <div class="status">新增</div>
      <div class="step-content">
        <ul>
          <li
            v-for="(item, index) of steps"
            :key="index"
            :class="{active:activeIndex==index}"
          >
            <span>{{ index + 1 === 1 ? '①' : '②' }}</span>{{ item }}
          </li>
        </ul>
      </div>
    </div>
    <!-- 设置基础信息 -->
    <div v-show="showJobDef">
      <el-form
        ref="ruleForm"
        :model="jobDef"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-card class="box-card base-container">
          <div slot="header">
            <el-form-item
              label="岗位组名称："
              prop="name"
            >
              <!--自动补全 -->
              <div class="auto-complete-container">
                <el-input
                  v-model.trim="jobDef.name"
                  clearable
                  size="mini"
                  maxlength="30"
                  placeholder="请输入"
                  style="width: 180px;"
                  class="filter-item"
                  @blur="queryDefName"
                  @focus="remoteMethod"
                />
                <template v-if="jobDefList.length">
                  <ul class="my-auto-complete">
                    <li
                      v-for="items of jobDefList"
                      :key="items.id"
                    >
                      {{ items.label }}
                    </li>
                  </ul>
                </template>
                <el-popover
                  placement="top"
                  trigger="hover"
                >
                  <div class="rule-container">
                    <div class="rule-content">
                      <div class="rule-first">
                        <div class="rule-label">命名规则</div>
                        <div class="rule-value">
                          <p class="rule-bold">业务岗位=组织属性+职能/任务属性+角色属性</p>
                          <p><span class="rule-bold">组织属性：</span>集团、区域、城市、项目</p>
                          <p><span class="rule-bold">职能属性：</span>设计、营销、会计、资金、薪酬激励……</p>
                          <p><span class="rule-bold">任务属性：</span>薪酬核算、考勤、营销费控、营销招采、印章管理……</p>
                          <p><span class="rule-bold">角色属性：</span>负责人（针对二级职能负责人/项目PM）、专员（针对具体任务）、对接人（针对跨职能或区域对接工作的人员）</p>
                        </div>
                      </div>
                      <div class="rule-second">
                        <div class="rule-label">示例</div>
                        <div class="rule-value">
                          <p><span class="rule-bold">二级职能负责人：</span>区域建筑设计/营销综管负责人</p>
                          <p><span class="rule-bold">具体任务执行人：</span>区域营销招采/薪酬会计/考勤专员、集团授权管理专员</p>
                          <p><span class="rule-bold">跨职能或区域对接人：</span>集团区域成本对接人、集团培训协议对接人</p>
                          <p><span class="rule-bold">项目PM（由“经营主数据系统”录入）：</span>项目工程/营销/设计负责人</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span
                    slot="reference"
                    class="tip-content"
                  > <i class="el-icon-question" /></span>
                </el-popover>
                <span
                  v-if="showError"
                  class="el-form-item__error"
                >岗位组名称已存在！</span>
              </div>
            </el-form-item>
          </div>
          <el-form-item
            label="层级："
            prop="orgLevelName"
          >
            <el-select
              v-model="jobDef.orgLevelName"
              size="mini"
              placeholder="请选择"
              class="filter-item"
              @change="selectOrgLevelCode"
            >
              <el-option
                v-for="item in dict.jobdef_level.filter((items)=> items.label !== '项目')"
                :key="item.value"
                :label="item.label"
                :value="{value:item.value, label: item.label}"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="职能："
            prop="funcName"
          >
            <el-select
              v-model="jobDef.funcName"
              size="mini"
              placeholder="请选择"
              class="filter-item"
              @change="selectFuncCode"
            >
              <el-option
                v-for="item in dict.jobdef_func"
                :key="item.value"
                :label="item.label"
                :value="{value:item.value, label: item.label}"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="岗位组性质："
            prop="stdTypeCode"
          >
            <el-radio-group
              v-model="jobDef.stdTypeCode"
              @change="changeRadio"
            >
              <el-radio
                v-for="(item, index) in dict.jobdef_std.filter((items)=> items.label !== '非标岗')"
                :key="index"
                :value="item.label"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="业务系统："
            prop="bizSys"
          >
            <el-select
              v-model="multipleSysList"
              filterable
              style="width: 70%;"
              multiple
              placeholder="可多选"
              @change="selectBizSys"
            >
              <el-option
                v-for="item in sysList"
                :key="item.value"
                :label="item.label"
                :value="{value:item.value, label: item.label}"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="岗位组描述："
            prop="remark"
          >
            <el-input
              v-model.trim="jobDef.remark"
              clearable
              type="textarea"
              size="mini"
              maxlength="100"
              placeholder="请输入"
              style="resize:none;min-height: 50px;width: 90%;"
              rows="3"
              show-word-limit
              class="filter-item"
            />
          </el-form-item>
        </el-card>
      </el-form>
    </div>
    <!-- 设置组织人员 -->
    <!-- 基础数据的展示 -->
    <el-card
      v-show="showUserDefList"
      class="box-card"
      style="margin: 0 10px;"
    >
      <el-row>
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="24"
        >
          <div class="el-form-item el-form-item--mini">
            <label class="el-form-item__label el-form-item_title">{{ jobDef.name }}</label>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :xs="24"
          :sm="24"
          :md="8"
          :lg="8"
        >
          <div
            class="el-form-item el-form-item--mini"
            style="float:left"
          >
            <label
              class="el-form-item__label"
              style="width:120px"
            >层级：</label>
            <div class="el-form-item__content more-text">{{ jobDef.orgLevelName }}</div>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="8"
          :lg="8"
        >
          <div
            class="el-form-item el-form-item--mini"
            style="float:left"
          >
            <label
              class="el-form-item__label"
              style="width:120px"
            >职能：</label>
            <div class="el-form-item__content more-text">{{ jobDef.funcName }}</div>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="8"
          :lg="8"
        >
          <div
            class="el-form-item el-form-item--mini"
            style="float:left"
          >
            <label
              class="el-form-item__label"
              style="width:120px"
            >岗位组性质：</label>
            <div class="el-form-item__content">{{ jobDef.stdTypeName }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :xs="24"
          :sm="24"
          :md="8"
          :lg="8"
        >
          <div
            class="el-form-item el-form-item--mini"
            style="float:left"
          >
            <label
              class="el-form-item__label"
              style="width:120px"
            >业务系统：</label>
            <div class="el-form-item__content more-text">{{ jobDef.bizSys }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="24"
        >
          <div class="el-form-item el-form-item--mini">
            <label
              class="el-form-item__label"
              style="width:120px"
            >描述：</label>
            <div class="el-form-item__content">
              {{ jobDef.remark }}
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 人岗关系列表 -->
    <el-card
      v-show="showUserDefList"
      class="box-card user-list"
      style="margin: 12px 10px 0;"
    >
      <div slot="header">
        <span class="title">岗位人员</span>
      </div>
      <!--表格渲染-->
      <el-table
        :data="tableData"
        style="width:100%;margin-bottom: 20px;"
        border
      >
        <el-table-column
          type="index"
          width="50"
        />
        <el-table-column
          prop="areaName"
          width="220"
          class="name_container"
          :show-overflow-tooltip="showOverflowTooltip"
          :label="jobDef.orgLevelName.includes('直管城市') ? '区域/事业部' : jobDef.orgLevelName"
        />
        <el-table-column
          prop="name"
          width="220"
          label="岗位所在组织名称"
        >
          <template slot-scope="scope">
            <div
              class="tree-container"
              @click="clickRow(scope.row, scope.$index)"
            >
              <!-- 2区域和事业部 和 4城市公司  限定2级 每级可选 -->
              <template v-if="jobDef.orgLevelCode === '2' || jobDef.orgLevelCode === '4'">
                <!-- 禁用  disabled true-->
                <template v-if="!scope.row.disabled">
                  <template v-if="scope.row.selectOrgCode">
                    <treeselect
                      v-model="scope.row.id"
                      :no-options-text="noText"
                      :max-height="200"
                      :flat="true"
                      style="height: 26px;"
                      placeholder="请选择组织"
                      :options="scope.row.children && scope.row.children !== null ? scope.row.children : optionsList"
                      :clearable="false"
                      @select="selectFun"
                    />
                  </template>
                  <template v-else>
                    <treeselect
                      style="height: 26px;"
                      :no-options-text="noText"
                      placeholder="请选择组织"
                      :max-height="200"
                      :options="scope.row.children && scope.row.children !== null ? scope.row.children : optionsList"
                      :clearable="false"
                      @select="selectFun"
                    />
                  </template>
                </template>
                <template v-else>
                  <template v-if="scope.row.selectOrgCode">
                    {{ scope.row.selectOrgName }}
                  </template>
                </template>
              </template>
              <template v-else-if="jobDef.orgLevelCode === '1'">
                <template v-if="scope.row.selectOrgCode">
                  <treeselect
                    v-model="scope.row.code"
                    :disable-branch-nodes="true"
                    :no-options-text="noText"
                    :max-height="200"
                    :flat="true"
                    style="height: 26px;"
                    placeholder="请选择组织"
                    :options="scope.row.children && scope.row.children !== null ? scope.row.children : optionsList"
                    :clearable="false"
                    @select="selectFun"
                  />
                </template>
                <template v-else>
                  <treeselect
                    :disable-branch-nodes="true"
                    style="height: 26px;"
                    :no-options-text="noText"
                    placeholder="请选择组织"
                    :max-height="200"
                    :options="scope.row.children && scope.row.children !== null ? scope.row.children : optionsList"
                    :clearable="false"
                    @select="selectFun"
                  />
                </template>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="selectOrgCode"
          label="组织编号"
        />
        <el-table-column
          prop="nickname"
          label="员工姓名"
        >
          <template slot-scope="scope">
            <!-- 禁用  disabled true-->
            <template v-if="!scope.row.disabled">
              <template v-if="!scope.row.nickname">
                <div
                  class="userName"
                  @click="selectUserName(scope.$index)"
                >
                  <treeselect
                    style="height: 26px;"
                    :open-on-click="false"
                    :clearable="false"
                    placeholder="请选择用户"
                  />
                </div>
              </template>
              <template v-else>
                <div
                  class="userName"
                  @click="selectUserName(scope.$index)"
                >
                  {{ scope.row.nickname }}
                </div>
              </template>
            </template>
            <template v-else>
              <template v-if="scope.row.nickname">
                {{ scope.row.nickname }}
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="employNum"
          label="员工编号"
        />
        <el-table-column
          prop="username"
          label="员工账号"
        />
        <el-table-column
          v-if="Number(jobDef.stdTypeCode) === 1"
          label="操作"
          width="130px"
          align="center"
        >
          <template slot-scope="scope">
            <div class="btn-container">
              <el-button
                size="mini"
                type="text"
                style="display: inline-block"
                @click="copyJobDef(scope.$index)"
              >
                新增
              </el-button>
              <el-button
                size="mini"
                type="text"
                style="display: inline-block"
                @click="delJobDef(scope.$index)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
        {{ jobDef.orgLevelCode }}
        <el-table-column
          v-if="Number(jobDef.stdTypeCode) === 2 && ['2', '4'].includes(jobDef.orgLevelCode)"
          label="操作"
          width="130px"
          align="center"
        >
          <template slot-scope="scope">
            <div class="btn-container">
              <el-button
                v-if="!scope.row.disabled"
                size="mini"
                type="text"
                style="display: inline-block"
                @click="closeJobDef(scope.$index)"
              >
                关闭
              </el-button>
              <el-button
                v-if="scope.row.disabled"
                size="mini"
                type="text"
                style="display: inline-block"
                @click="openJobDef(scope.$index)"
              >
                启用
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--用户选择-->
    <el-dialog
      width="1000px"
      height="100vh"
      :visible.sync="userSelDialog.show"
      :append-to-body="true"
      :title="userSelDialog.title"
    >
      <user-selector
        ref="userSelector"
        :select-type="userListSelectType"
        :passed-in-param="userListQueryParam"
        :show-advanced-filter="userListAdvancedFilter"
        @selectChange="handleUserSelChange"
      />
    </el-dialog>
    <!-- 底部按钮 -->
    <div
      slot="footer"
      class="bottom-btn-groups"
    >
      <el-button
        v-if="activeIndex===0"
        type="primary"
        size="mini"
        @click="submitForm('ruleForm')"
      >下一步
      </el-button>
      <el-button
        v-if="activeIndex===1"
        type="primary"
        size="mini"
        @click="prev"
      >上一步
      </el-button>
      <el-button
        v-if="activeIndex !==0"
        type="primary"
        size="mini"
        @click="saveJobDef"
      >保存
      </el-button>
      <el-button
        v-if="activeIndex !==0"
        type="warning"
        size="mini"
        @click="doSubmitFlow"
      >预览并提交
      </el-button>
      <el-button
        size="mini"
        @click="goBack"
      >取消
      </el-button>
    </div>
    <!-- 草稿态关闭弹框 -->
    <el-dialog
      title="操作理由"
      :visible.sync="closeJobDefDialogVisible"
      width="50%"
      :append-to-body="true"
    >
      <div class="content">
        <div class="remark-content">
          <span class="label">理由: </span>
          <el-input
            v-model.trim="editAllRemark"
            class="remark-value"
            type="textarea"
            :rows="3"
            placeholder="请输入理由"
          />
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancelCloseJobDef">取 消</el-button>
        <el-button
          type="primary"
          @click="saveCloseJobDef"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const lodash = require("lodash");
import { header } from "@crud/crud";
import { getAreaDeptByFunc, validateDefName } from "@http/system/dept";
import UserSelector from "@/components/biz/UserSelector";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { addJobDef, submitFlow, getALLSys } from "@http/system/jobDef";
import { queryJobDefList } from "@http/system/usersJobs";
export default {
  name: "JobDefInfo",
  components: { UserSelector, Treeselect },
  mixins: [header()],
  props: {
    viewMode: {
      type: String,
      default: "add",
    },
    id: {
      type: String,
      default: "",
    },
  },
  dicts: [
    "jobdef_func",
    "jobdef_level",
    "biz_sys",
    "jobdef_type",
    "jobdef_source",
    "jobdef_status",
    "jobdef_std",
    "jobdef_firm",
    "jobdef_seq",
  ],
  data() {
    return {
      activeIndex: 0,
      steps: ["设置岗位属性", "设置组织人员"],
      showJobDef: true,
      showUserDefList: false,
      jobDef: {
        id: null,
        name: "",
        orgLevelCode: "",
        orgLevelName: "",
        funcCode: "",
        funcName: "",
        bizSys: null,
        stdTypeCode: "",
        stdTypeName: "",
        remark: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入岗位组名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        orgLevelName: [
          { required: true, message: "请选择层级", trigger: "change" },
        ],
        funcName: [
          { required: true, message: "请选择职能", trigger: "change" },
        ],
        stdTypeCode: [
          { required: true, message: "请选择岗位组性质", trigger: "change" },
        ],
        bizSys: [
          { required: true, message: "请选择业务系统", trigger: "change" },
        ],
        remark: [
          { required: true, message: "请输入岗位组描述", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur",
          },
        ],
      },
      usersJobApprovalVos: [],
      tableData: [],
      clickIndex: null,
      selectOrgObj: {},
      selectOrgCode: "",
      dialogVisible: false,
      selectUserIndex: "",
      selectUser: {},
      // 用户列表
      userListMode: "mgr",
      userListSelectType: "radio",
      currentSelectVal: "", // 当前选中的人员
      isSave: true,
      userListQueryParam: { deptCode: "", deptId: undefined },
      userListAdvancedFilter: false,
      orgLevelCode: null,
      showOverflowTooltip: true,
      flag: false,
      approvalId: null,
      multipleSysList: [], // 多选业务系统的列表
      sysList: [], // 业务系统列表
      noText: "暂无子部门数据！", // vue-treeselect 没有子部门显示的文字
      userSelDialog: { title: "选择用户", show: false },
      optionsList: [],
      showError: false,
      queryParam: {
        byOwner: true,
        orgLevelCodes: "1, 2, 4",
        typeCode: "2",
        stdTypeCodes: "1, 2",
        formCode: "CIFI",
        blurry: [],
      },
      jobDefList: [],
      closeJobDefDialogVisible: false,
      editAllRemark: null,
      currentIndex: null,
      saveStatus: null,
      funcCode: null,
    };
  },
  watch: {
    orgLevelCode() {
      // 调用人岗关系的接口
      if (this.funcCode !== null) {
        this.getAreaDeptByFunc(this.jobDef.orgLevelCode, this.funcCode);
      }
    },
    funcCode() {
      this.getAreaDeptByFunc(this.jobDef.orgLevelCode, this.funcCode);
    },
    tableData: {
      handler(newValue, oldValue) {
        if (newValue.length === 0 && this.activeIndex) {
          this.getAreaDeptByFunc(this.jobDef.orgLevelCode, this.funcCode);
        }
        for (let i = 0; i < newValue.length; i++) {
          if (!lodash.isEqual(oldValue[i], newValue[i])) {
            this.flag = false;
          }
        }
        this.flag = false;
      },
      deep: true,
    },
    jobDef: {
      handler(newValue, oldValue) {
        if (!Object.is(newValue, oldValue)) {
          this.flag = false;
        }
        this.remoteMethod();
      },
      deep: true,
    },
  },
  mounted() {
    this.getALLSys();
  },
  methods: {
    remoteMethod() {
      this.queryParam.blurry = this.jobDef.name;
      if (this.jobDef.name !== "") {
        this.loading = true;
        queryJobDefList(this.queryParam).then((res) => {
          this.loading = false;
          this.jobDefList = res.content.map((items) => {
            // 为了处理完全匹配的默认
            return { value: `val:${items.name}`, label: `${items.name}` };
          });
        });
      } else {
        this.options = [];
      }
    },
    queryDefName() {
      this.jobDefList = [];
      if (this.jobDef.name !== "") {
        this.validateDefName(this.jobDef.name);
      }
    },
    // 验证岗位组的名称
    validateDefName(argument) {
      validateDefName(argument).then((res) => {
        // 1 重复 0 不重复
        if (res === 1) {
          this.showError = true;
        } else {
          this.showError = false;
        }
      });
    },
    // 全部组织
    getALLSys() {
      getALLSys().then((res) => {
        res.forEach((item) => {
          item.label = item.name;
          item.value = item.name;
        });
        this.sysList = res;
      });
    },
    // 上一步
    prev() {
      this.activeIndex--;
      this.$emit("moreWidth", "550px");
      this.showJobDef = true;
      this.showUserDefList = false;
    },
    // 下一步 提交form信息
    submitForm(formName) {
      if (this.showError) {
        return false;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.activeIndex++;
          this.$emit("moreWidth", "1200px");
          this.showJobDef = false;
          this.showUserDefList = true;
        } else {
          this.showError = false;
          return false;
        }
      });
    },
    // 返回
    goBack() {
      this.$emit("click", false);
    },
    // 获取层级下的人岗关系
    getAreaDeptByFunc() {
      getAreaDeptByFunc(this.jobDef.orgLevelCode, this.funcCode).then((res) => {
        const code = this.jobDef.orgLevelCode;
        res.content.forEach((item, index) => {
          item.disabled = false;
          if (code === "4") {
            const nameList = item.fullName.split("-");
            const nameLen = item.fullName.split("-").length;
            // 城市公司需要带上一级 nameLen - 2
            item.areaName = nameList[nameLen - 2] + "-" + item.name;
          } else {
            item.areaName = item.name;
          }
          if (item.hasOwnProperty("defaultDept")) {
            if (item.defaultDept !== null) {
              item.id = item.defaultDept.id;
              item.code = item.defaultDept.code;
              item.name = item.defaultDept.name;
              item.selectOrgCode = item.defaultDept.code;
              item.selectOrgName = item.defaultDept.name;
              item.dept = item.defaultDept;
            }
          }
        });
        this.tableData = res.content.sort((a, b) => {
          return a.areaName.localeCompare(b.areaName, "zh");
        });
      });
    },
    checkTableData(value) {
      // 专用岗位每一个组织都需要填写
      if (value && value instanceof Array && value.length > 0) {
        if (this.jobDef.stdTypeCode === "2") {
          // 专用岗关闭按钮 不校验 岗位和人员
          const filterDisable = value.filter((item) => {
            return item.disabled !== true;
          });
          if (
            !filterDisable.every((item) => {
              return item.dept && item.user !== null;
            })
          ) {
            this.$message.error({
              message: "未关闭的专用岗位每一个组织和用户都需要填写",
              duration: 2000,
            });
            return false;
          }
        } else {
          for (let i = 0; i < value.length; i++) {
            // 至少存在一条有效数据
            const filterList = value.filter((item) => {
              return item.dept && item.user !== null;
            });
            if (!filterList.length > 0) {
              this.$message.error({
                message: "至少存在一条有效数据",
                duration: 2000,
              });
              return false;
            }
            const roles = Object.getOwnPropertyNames(value[i]);
            const hasDept = roles.includes("dept");
            // 不包含 dept
            if (!hasDept) {
              return -1;
            } else {
              // 包含dept 但是不包含user
              if (!roles.includes("user")) {
                this.$message.error({
                  message: "缺少用户信息",
                  duration: 2000,
                });
                return false;
              }
            }
            // 重复数据处理
            for (let j = i + 1; j < filterList.length; j++) {
              if (
                filterList[i].dept.code &&
                filterList[i].user.employNum &&
                filterList[j].dept.code &&
                filterList[j].user.employNum
              ) {
                if (
                  filterList[i].dept.code === filterList[j].dept.code &&
                  filterList[i].user.employNum === filterList[j].user.employNum
                ) {
                  this.$message.error({
                    message: "请勿重复添加",
                    duration: 2000,
                  });
                  return false;
                }
              }
            }
          }
        }
      }
    },
    // 关闭
    closeJobDef(index) {
      this.closeJobDefDialogVisible = true;
      this.currentIndex = index;
      this.saveStatus = "close";
    },
    cancelCloseJobDef() {
      this.closeJobDefDialogVisible = false;
      this.currentIndex = null;
      this.editAllRemark = null;
    },
    saveCloseJobDef() {
      if (this.editAllRemark === null || this.editAllRemark === "") {
        this.$message.error({
          message: "请填写理由！",
          duration: 2000,
        });
        return false;
      }
      const index = this.currentIndex;
      if (this.saveStatus === "close") {
        this.$set(this.$data.tableData[index], "disabled", true);
        if (this.$data.tableData[index].hasOwnProperty("dept")) {
          this.$set(
            this.$data.tableData[index],
            "dept",
            this.$data.tableData[index].dept
          );
        } else {
          const currentObj = JSON.parse(
            JSON.stringify(this.$data.tableData[index])
          );
          delete currentObj.children;
          this.$set(this.$data.tableData[index], "dept", currentObj);
        }
        this.$set(this.$data.tableData[index], "remark", this.editAllRemark);
      }
      this.cancelCloseJobDef();
    },
    // 启用
    openJobDef(index) {
      this.$set(this.$data.tableData[index], "disabled", false);
      delete this.$data.tableData[index].remark;
    },
    saveJobDef() {
      if (this.flag === true) {
        this.$message.error({
          message: "请勿重复提交",
          duration: 2000,
        });
        return false;
      }
      console.log("this.tableData:", this.tableData);
      if (this.checkTableData(this.tableData) === false) {
        return false;
      }
      const usersJobs = [];
      const formatJobsList = [];
      if (this.jobDef.stdTypeCode === "2") {
        // 专用岗
        for (let i = 0; i < this.tableData.length; i++) {
          const userJob = {};
          userJob.user = this.tableData[i].user ? this.tableData[i].user : null;
          userJob.dept = this.tableData[i].dept;
          if (this.tableData[i].remark) {
            userJob.remark = this.tableData[i].remark;
          }
          usersJobs.push(userJob);
        }
      } else {
        // 通用岗
        const usersJobsList = this.tableData.filter((newItem) => {
          return newItem.user && newItem.dept;
        });
        for (let i = 0; i < usersJobsList.length; i++) {
          const postData = {};
          if (usersJobsList[i].user && usersJobsList[i].dept) {
            postData.user = usersJobsList[i].user;
            postData.dept = usersJobsList[i].dept;
          }
          formatJobsList.push(postData);
        }
      }
      const usersJobsList =
        this.jobDef.stdTypeCode === "1" ? formatJobsList : usersJobs;
      usersJobsList.forEach((item) => {
        delete item.dept.children;
        delete item.dept.topDept;
      });
      const params = {
        jobDef: this.jobDef,
        usersJobsList: usersJobsList,
      };
      console.log(688, params);
      const temp1 = usersJobsList;
      // 一岗多人 同一区域下不同组织
      if (this.jobDef.stdTypeCode === "1") {
        // 通用岗
        for (let i = 0; i < temp1.length; i++) {
          for (let j = i + 1; j < temp1.length; j++) {
            if (temp1[i].dept) {
              if (
                temp1[i].dept.areaName === temp1[j].dept.areaName &&
                temp1[i].dept.name !== temp1[j].dept.name
              ) {
                this.$message.error({
                  message: "同一区域下,不能新增不同组织",
                  duration: 2000,
                });
                return false;
              }
            }
          }
        }
      }
      addJobDef(JSON.stringify(params))
        .then((res) => {
          this.$matomo.trackEvent(
            "岗位组新增保存按钮",
            "Click",
            "保存岗位组",
            params
          );
          this.$message.success({
            message: "保存岗位组工作台信息成功",
            duration: 2000,
          });
          // 新增以后的审批id
          this.flag = true;
          console.log("716>>>保存岗位组工作台信息成功", this.flag);
          this.approvalId = res.approval.id;
          this.jobDef.id = res.id;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error({
            message: "保存岗位信息失败",
            duration: 2000,
          });
        });
    },
    selectOrgLevelCode(params) {
      const { value, label } = params;
      this.jobDef.orgLevelCode = value;
      this.jobDef.orgLevelName = label;
      this.orgLevelCode = this.jobDef.orgLevelCode;
      this.selectUser = {};
      this.selectOrgObj = {};
    },
    selectFuncCode(params) {
      const { value, label } = params;
      this.jobDef.funcCode = value;
      this.jobDef.funcName = label;
      this.funcCode = value;
    },
    selectBizSys(params) {
      const valList = params.map((item) => {
        return item.label;
      });
      this.jobDef.bizSys = valList.length > 0 ? valList.join(",") : "";
    },
    changeRadio(params) {
      this.jobDef.stdTypeCode = params;
      if (params === "1") {
        this.jobDef.stdTypeName = "通用岗位（一岗多人）";
      } else if (params === "2") {
        this.jobDef.stdTypeName = "专用岗位（一岗一人）";
      }
      this.getAreaDeptByFunc(this.jobDef.orgLevelCode, this.funcCode);
    },
    // 新增一行人岗关系
    copyJobDef(index) {
      const user = JSON.parse(JSON.stringify(this.tableData[index]));
      if (this.tableData[index].nickname) {
        delete user.user;
        delete user.employNum;
        delete user.nickname;
        delete user.username;
      }
      this.tableData.splice(index + 1, 0, user);
    },
    // 删除
    delJobDef(index) {
      this.tableData.splice(index, 1);
    },
    // 编辑组织名称
    clickRow(val, index) {
      this.clickIndex = index;
    },
    // 点击部门搜索对应的岗位
    selectFun(data) {
      this.selectOrgObj = data;
      this.selectOrgObj.areaName =
        this.$data.tableData[this.clickIndex].areaName;
      this.selectOrgCode = data.code;
      this.$set(
        this.$data.tableData[this.clickIndex],
        "selectOrgCode",
        this.selectOrgCode
      );
      this.$set(
        this.$data.tableData[this.clickIndex],
        "selectOrgName",
        data.name
      );
      this.$set(
        this.$data.tableData[this.clickIndex],
        "dept",
        this.selectOrgObj
      );
    },
    // 点击用户选择
    selectUserName(index) {
      // 显示用户选择列表
      this.userSelDialog.show = true;
      this.selectUserIndex = index;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleTreeItemClick(data) {
      this.userListQueryParam.deptCode = data.code;
      this.userListQueryParam.deptId = data.id;
      this.$refs.userList.getUserData();
    },
    handleUserSelChange(params) {
      const data = params[0];
      this.selectUser = data;
      this.selectUser.nickname = data.nickName;
      this.selectUser.employNum = data.employNum;
      this.selectUser.username = data.username;
      this.$set(
        this.$data.tableData[this.selectUserIndex],
        "nickname",
        this.selectUser.nickname
      );
      this.$set(
        this.$data.tableData[this.selectUserIndex],
        "employNum",
        this.selectUser.employNum
      );
      this.$set(
        this.$data.tableData[this.selectUserIndex],
        "username",
        this.selectUser.username
      );
      this.$set(
        this.$data.tableData[this.selectUserIndex],
        "user",
        this.selectUser
      );
      console.log("选中用户的：", this.selectUser);
      this.userSelDialog.show = false;
      console.log("选中用户的：", this.selectUser);
    },
    // 预览审核并提交
    doSubmitFlow() {
      console.log(809, "预览并提交：：：", this.flag);
      if (this.flag) {
        submitFlow(this.approvalId, false)
          .then((res) => {
            window.location.href = res;
          })
          .catch(() => {
            this.$message.error({
              message: "提交流程失败",
              duration: 2000,
            });
          });
        return;
      } else {
        if (this.checkTableData(this.tableData) === false) {
          return false;
        }
        const usersJobs = [];
        const formatJobsList = [];
        if (this.jobDef.stdTypeCode === "2") {
          // 专用岗
          for (let i = 0; i < this.tableData.length; i++) {
            const userJob = {};
            userJob.user = this.tableData[i].user
              ? this.tableData[i].user
              : null;
            userJob.dept = this.tableData[i].dept;
            if (this.tableData[i].remark) {
              userJob.remark = this.tableData[i].remark;
            }
            usersJobs.push(userJob);
          }
        } else {
          // 通用岗
          const usersJobsList = this.tableData.filter((newItem) => {
            return newItem.user && newItem.dept;
          });
          for (let i = 0; i < usersJobsList.length; i++) {
            const postData = {};
            if (usersJobsList[i].user && usersJobsList[i].dept) {
              postData.user = usersJobsList[i].user;
              postData.dept = usersJobsList[i].dept;
            }
            formatJobsList.push(postData);
          }
        }
        const usersJobsList =
          this.jobDef.stdTypeCode === "1" ? formatJobsList : usersJobs;
        const params = {
          jobDef: this.jobDef,
          usersJobsList: usersJobsList,
        };
        console.log(854, params);
        const temp1 = usersJobsList;
        // 一岗多人 同一区域下不同组织
        if (this.jobDef.stdTypeCode === "1") {
          for (let i = 0; i < temp1.length; i++) {
            for (let j = i + 1; j < temp1.length; j++) {
              if (temp1[i].dept) {
                if (
                  temp1[i].dept.areaName === temp1[j].dept.areaName &&
                  temp1[i].dept.name !== temp1[j].dept.name
                ) {
                  this.$message.error({
                    message: "同一区域下,不能新增不同组织",
                    duration: 2000,
                  });
                  return false;
                }
              }
            }
          }
        }
        addJobDef(JSON.stringify(params))
          .then((res) => {
            this.$message.success({
              message: "保存岗位组工作台信息成功",
              duration: 2000,
            });
            // 新增以后的审批id
            // this.flag = true
            this.approvalId = res.approval.id;
            this.$matomo.trackEvent(
              "岗位组新增保存按钮",
              "Click",
              "保存岗位组",
              params
            );
            submitFlow(this.approvalId, false)
              .then((res) => {
                window.location.href = res;
                this.$matomo.trackEvent(
                  "岗位组新增预览审核按钮",
                  "Click",
                  "审核岗位组",
                  this.approvalId
                );
              })
              .catch(() => {
                this.$message.error({
                  message: "提交流程失败",
                  duration: 2000,
                });
              });
          })
          .catch((err) => {
            console.log(err);
            this.$message.error({
              message: "保存岗位信息失败",
              duration: 2000,
            });
          });
      }
    },
  },
};
</script>

<style scoped>
.rule-container {
  width: 500px;
  border: 1px solid #efefef;
}
.rule-container .rule-title {
  font-size: 16px;
  color: #333;
  line-height: 36px;
  text-align: center;
  border-bottom: 1px solid #efefef;
}
.rule-container .rule-content p {
  font-size: 14px;
  margin: 0;
  line-height: 26px;
}
.rule-first,
.rule-second {
  display: flex;
  align-items: center;
}
.rule-first {
  border-bottom: 1px solid #efefef;
}
.rule-container .rule-content .rule-label {
  flex-basis: 20px;
  width: 20px;
  color: #333;
  padding: 0 6px;
  text-align: center;
}
.rule-bold {
  font-weight: bold;
  color: #333;
}
.rule-value {
  flex: 1;
  margin-left: 10px;
  border-left: 1px solid #efefef;
  padding: 6px;
}
.tip-content {
  padding-left: 10px;
  cursor: pointer;
}
#jobDefList .crud-opts {
  position: relative;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  padding: 0 10px 10px 0;
}
#jobDefList .crud-opts .crud-opts-right {
  margin-left: auto;
}
#jobDefInfo {
  padding-bottom: 65px;
  background: #f5f5f5;
}
.bottom-btn-groups {
  position: absolute;
  left: 0;
  bottom: 0px;
  z-index: 9999;
  width: 100%;
}
.status {
  flex-basis: 60px;
  width: 60px;
  height: 40px;
  padding-left: 20px;
  line-height: 40px;
  color: #fff;
}
.steps-container {
  display: flex;
  margin-bottom: 10px;
  background: #2761ff;
}
.step-content {
  margin: 0 auto;
}
.steps-container ul {
  padding-left: 0;
}
.steps-container ul li {
  list-style-type: none;
}
.steps-container ul {
  display: flex;
  height: 40px;
  margin: 0 auto;
  line-height: 40px;
  color: rgba(255, 255, 255, 0.6);
}
.steps-container li {
  position: relative;
  margin-right: 10px;
}
.steps-container li span {
  display: inline-block;
  margin-top: -4px;
  padding-right: 6px;
  vertical-align: middle;
}
.steps-container li.active {
  position: relative;
  height: 40px;
  line-height: 40px;
  color: #fff;
}
.steps-container .active::before {
  position: absolute;
  bottom: 6px;
  left: 50%;
  display: block;
  width: 4px;
  height: 4px;
  overflow: hidden;
  content: "";
  background: #fff;
  border-radius: 50%;
}
.steps-container li:nth-child(1) {
  margin-right: 60px;
}
.steps-container li:nth-child(1)::after {
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 1px;
  margin-top: 20px;
  margin-right: -45px;
  content: "";
  background: rgba(255, 255, 255, 0.6);
}
.auto-complete-container {
  position: relative;
}
.my-auto-complete {
  position: absolute;
  top: 30px;
  left: 0;
  z-index: 9999;
  box-sizing: border-box;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  padding: 0 0 0 10px;
  margin: 0;
  background: #fff;
  border: 1px solid #efefef;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.my-auto-complete li {
  list-style-type: none;
}
.base-container {
  height: calc(100vh - 142px);
  margin: 10px;
  background: #fff;
}
/deep/ .base-container label,
/deep/ .base-container .el-form-item--mini.el-form-item {
  font-weight: normal;
}
/deep/ .base-container .el-card__header {
  padding-bottom: 0px;
}
.btn-groups {
  margin-left: 30px;
}

.el-form-item_title {
  padding-left: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
/deep/ .user-list,
/deep/ .user-list .el-table .cell,
/deep/ .user-list .el-table__body-wrapper {
  overflow: visible;
}
.tree-container {
  overflow: visible;
}
.user-list .el-table {
  overflow: visible;
}
/deep/ .user-list .vue-treeselect__control {
  height: 26px;
  line-height: 26px;
}
.user-list .title {
  padding-left: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
.name_container {
  overflow: hidden !important;
}
.remark-content {
  position: relative;
  padding-bottom: 10px;
}
.remark-content .label {
  position: absolute;
  top: 8px;
  left: 0;
  width: 50px;
  display: inline-block;
  text-align: center;
}
.remark-value {
  margin-left: 50px;
  display: inline-block;
  width: calc(100% - 80px);
  line-height: 36px;
}
/deep/ .el-table__row td {
  height: 40px;
  line-height: 40px;
}
/deep/ .el-table__row td:nth-child(1) .cell {
  overflow: hidden !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/ .el-dialog__wrapper {
  z-index: 9999 !important;
}
/deep/ .user-list {
  height: 360px;
  overflow-y: auto;
}
/deep/ .vue-treeselect__menu {
  z-index: 9999;
}
.hide {
  display: none;
}
/deep/ .vue-treeselect__single-value,
/deep/ .vue-treeselect__placeholder {
  margin-top: -4px;
}
.more-text {
  width: 120px;
  overflow: hidden !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/*重置样式*/
/deep/ .base-container .el-form-item__label {
  padding-right: 0px;
  font-size: 14px;
  color: #333;
}
</style>
