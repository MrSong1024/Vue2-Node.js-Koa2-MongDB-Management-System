<template>
  <div class="view-container">
    <el-form ref="form">
      <el-card class="box-card">
        <!--查看 岗位组基础信息-->
        <template v-if="mode==='view' || mode==='modify' || mode==='editBase' && showOrganization || mode === 'query'">
          <div class="base-info my-title">{{ jobDef.name }}({{ jobDef.code }})
            <el-button
              v-if="mode==='editBase' && jobDef.typeCode !== '1'"
              style="float: right"
              @click="editBaseInfo"
            >
              编辑
            </el-button>
          </div>
          <el-row :gutter="10">
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
              :xl="6"
            >
              <div class="el-form-item el-form-item--mini">
                <label
                  class="el-form-item__label"
                  style="width:120px"
                >层级：</label>
                <label class="el-form-item__content">{{ jobDef.orgLevelName }}</label>
              </div>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
              :xl="6"
            >
              <div class="el-form-item el-form-item--mini">
                <label
                  class="el-form-item__label"
                  style="width:120px"
                >职能：</label>
                <label class="el-form-item__content">{{ jobDef.funcName }}</label>
              </div>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
              :xl="6"
            >
              <div class="el-form-item el-form-item--mini">
                <label
                  class="el-form-item__label"
                  style="width:120px"
                >职能编码：</label>
                <label class="el-form-item__content">{{ jobDef.funcCode }}</label>
              </div>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
              :xl="6"
            >
              <div class="el-form-item el-form-item--mini">
                <label
                  class="el-form-item__label"
                  style="width:120px"
                >岗位组性质：</label>
                <label class="el-form-item__content"> {{ jobDef.stdTypeCode === '1' ? '通用岗(一岗多人)' : '专用岗(一岗一人)' }}</label>
              </div>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="16"
              :lg="16"
              :xl="12"
            >
              <div class="el-form-item el-form-item--mini">
                <label
                  class="el-form-item__label"
                  style="width:120px"
                >业务系统：</label>
                <label class="el-form-item__content line-text-more">
                  <el-popover
                    class="my-popover"
                    placement="top-start"
                    :content="jobDef.bizSys"
                    trigger="hover"
                  >
                    <div
                      slot="reference"
                      class="ellipsis-class"
                    >{{ jobDef.bizSys }}</div>
                  </el-popover>
                </label>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col
              :xs="24"
              :sm="12"
              :md="24"
              :lg="24"
              :xl="24"
            >
              <div class="el-form-item el-form-item--mini">
                <label
                  class="el-form-item__label"
                  style="width:120px"
                >岗位组描述：</label>
                <label class="el-form-item__content line-text-more">
                  <el-popover
                    placement="top-start"
                    :content="jobDef.remark"
                    trigger="hover"
                  >
                    <div
                      slot="reference"
                      class="ellipsis-class"
                    >{{ jobDef.remark }}</div>
                  </el-popover>
                </label>
              </div>
            </el-col>
          </el-row>
        </template>
        <!-- 编辑基础信息 -->
        <template v-if="showEditBaseCont || mode==='editAll'">
          <div class="edit-base-container clearfix">
            <div
              class="el-form-item is-required el-form-item--mini"
              style="float:left"
            >
              <label
                class="el-form-item__label"
                style="width:120px"
              >岗位组名称：</label>
              <el-input
                v-model.trim="jobDef.name"
                clearable
                size="mini"
                maxlength="30"
                placeholder
                style="width: 180px;"
                class="filter-item"
                @blur="queryDefName"
              />
            </div>
            <div
              class="el-form-item is-required el-form-item--mini"
              style="float:left"
            >
              <template v-if="mode==='editBase' || mode==='returnEditBase'">
                <label
                  class="el-form-item__label"
                  style="width:120px"
                >层级：</label>
                <label class="el-form-item__content">{{ jobDef.orgLevelName }}</label>
              </template>
              <template v-else>
                <label
                  class="el-form-item__label"
                  style="width:120px"
                >层级：</label>
                <el-select
                  v-model="jobDef.orgLevelName"
                  clearable
                  size="mini"
                  placeholder="层级分类"
                  class="filter-item"
                  style="width: 100px"
                  @change="selectOrgLevelCode"
                >
                  <el-option
                    v-for="item in dict.jobdef_level.filter((items)=> items.label !== '项目')"
                    :key="item.value"
                    :label="item.label"
                    :value="{value:item.value, label: item.label}"
                  />
                </el-select>
              </template>
            </div>
            <div
              class="el-form-item is-required el-form-item--mini"
              style="float:left"
            >
              <label
                class="el-form-item__label"
                style="width:120px"
              >职能：</label>
              <el-select
                v-model="jobDef.funcName"
                clearable
                size="mini"
                placeholder="请选择"
                class="filter-item"
                style="width: 100px"
                @change="selectFuncCode"
              >
                <el-option
                  v-for="item in dict.jobdef_func"
                  :key="item.value"
                  :label="item.label"
                  :value="{value:item.value, label: item.label}"
                />
              </el-select>
            </div>
            <div
              class="el-form-item is-required el-form-item--mini"
              style="float:left;"
            >
              <template v-if="mode==='editBase' || mode==='returnEditBase'">
                <label
                  class="el-form-item__label"
                  style="width:120px"
                >岗位组性质：</label>
                <div class="el-form-item__content">
                  <el-radio-group
                    v-model="jobDef.stdTypeCode"
                    disabled
                  >
                    <el-radio
                      v-for="(item, index) in dict.jobdef_std.filter((items)=> items.label !== '非标岗')"
                      :key="index"
                      :value="item.label"
                      :label="item.value"
                    >{{ item.label }}</el-radio>
                  </el-radio-group>
                </div>
              </template>
              <template v-else>
                <label
                  class="el-form-item__label"
                  style="width:120px"
                >岗位组性质：</label>
                <div class="el-form-item__content">
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
                </div>
              </template>
            </div>
            <div
              class="el-form-item is-required el-form-item--mini"
              style="float:left;width:70%"
            >
              <label
                class="el-form-item__label"
                style="width:120px"
              >业务系统：</label>
              <el-select
                v-model="value5"
                style="width:70%"
                multiple
                filterable
                placeholder="请选择"
                @change="selectBizSys"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </div>
            <div
              class="el-form-item is-required el-form-item--mini"
              style="float:left;width:70%"
            >
              <label
                class="el-form-item__label"
                style="width:120px"
              >岗位组描述：</label>
              <div
                class="el-form-item__content"
                style="width: 70%;"
              >
                <el-input
                  v-model.trim="jobDef.remark"
                  clearable
                  type="textarea"
                  size="mini"
                  maxlength="100"
                  placeholder="请填写岗位组描述"
                  style="resize:none;min-height: 50px;"
                  rows="3"
                  show-word-limit
                  class="filter-item"
                />
              </div>
            </div>
          </div>
        </template>
        <!--基本信息-->
        <template v-if="mode==='add'">
          <template v-if="showOrganization">
            <div slot="header">
              <span class="my-title">设置组织人员</span>
            </div>
            <div class="el-form-item el-form-item--mini">
              <label class="el-form-item__label el-form-item_title">{{ jobDef.name }}</label>
              <el-button
                style="float: right"
                @click="editBaseInfo"
              >
                编辑
              </el-button>
            </div>
            <div
              class="el-form-item el-form-item--mini"
              style="float:left"
            >
              <label
                class="el-form-item__label"
                style="width:120px"
              >层级：</label>
              <div class="el-form-item__content">{{ jobDef.orgLevelName }}</div>
            </div>
            <div
              class="el-form-item el-form-item--mini"
              style="float:left"
            >
              <label
                class="el-form-item__label"
                style="width:120px"
              >职能：</label>
              <div class="el-form-item__content">{{ jobDef.funcName }}</div>
            </div>
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
            <div
              class="el-form-item el-form-item--mini"
              style="float:left;width:100%"
            >
              <label
                class="el-form-item__label"
                style="width:120px"
              >描述：</label>
              <div
                class="el-form-item__content"
                style="width: 90%;"
              >
                {{ jobDef.remark }}
              </div>
            </div>
          </template>
        </template>
      </el-card>
      <!--审核通过的用户列表-->
      <template v-if="showUserList && mode !== 'returnEditBase' && mode !== 'modify'">
        <el-card
          class="box-card user-list"
          style="margin-top: 12px;"
        >
          <div slot="header">
            <span class="my-title">岗位人员</span>
          </div>
          <!--表格渲染-->
          <!-- 切换城市等级会出现的列表 -->
          <el-table
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            border
          >
            <el-table-column
              type="index"
              width="50"
            />
            <el-table-column
              prop="areaName"
              width="220"
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
              width="120"
              label="组织编号"
            />
            <el-table-column
              prop="nickname"
              label="员工姓名"
            >
              <template slot-scope="scope">
                <template v-if="jobDef.orgLevelCode === '2' && scope.row.disabled === false || jobDef.orgLevelCode === '4' && scope.row.disabled === false || jobDef.orgLevelCode === '1'">
                  <template v-if="!scope.row.nickname">
                    <div
                      class="userNameContainer"
                      @click="selectUserName(scope.$index)"
                    >
                      <treeselect
                        :open-on-click="false"
                        style="height:26px;"
                        :clearable="false"
                        placeholder="请选择用户"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="userNameContainer"
                      @click="selectUserName(scope.$index)"
                    >
                      <treeselect
                        class="holder-value"
                        :open-on-click="false"
                        style="height:26px;"
                        :clearable="false"
                        :placeholder="scope.row.nickname"
                      />
                    </div>
                  </template>
                </template>
                <template v-if="jobDef.orgLevelCode === '2' && scope.row.disabled === true || jobDef.orgLevelCode === '4' && scope.row.disabled === true">
                  {{ scope.row.nickname }}
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
              fixed="right"
            >
              <template slot-scope="scope">
                <div class="btn-container">
                  <el-button
                    size="mini"
                    type="text"
                    style="display: inline-block"
                    @click="copyTableJobDef(scope.$index)"
                  >
                    新增
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    style="display: inline-block"
                    @click="delTableJobDef(scope.$index, tableData)"
                  >
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <!-- 关闭和开启 -->
            <el-table-column
              v-if="Number(jobDef.stdTypeCode) === 2"
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
                    @click="closeTableJobDef(scope.$index)"
                  >
                    关闭
                  </el-button>
                  <el-button
                    v-if="scope.row.disabled"
                    size="mini"
                    type="text"
                    style="display: inline-block"
                    @click="openTableJobDef(scope.$index)"
                  >
                    启用
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-dialog
          class="custom_el_dialog"
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
            @selectChange="handleRadioSelChange"
          />
        </el-dialog>
      </template>
      <template v-if="showEditDialog">
        <el-dialog
          class="custom_el_dialog"
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
            @selectChange="editHandleRadioSelChange"
          />
        </el-dialog>
      </template>
      <!-- 查看的时候 人岗关系列表 -->
      <template v-if="mode=== 'view' || mode==='modify' && showApprovalList || mode ==='editBase' && showOrganization || mode==='editAll' && !showUserList">
        <el-card
          class="box-card user-list"
          style="margin-top: 12px;"
        >
          <div slot="header">
            <span class="title my-title">岗位人员</span>
            <el-button
              v-if="mode=== 'editBase' && !showEditUserListBtn && jobDef.typeCode !== '1'"
              style="float: right"
              @click="editUserList"
            >
              编辑
            </el-button>
            <el-button
              v-if="mode=== 'editBase' && !showEditUserListBtn && jobDef.typeCode === '1' && jobDef.stdTypeCode === '2'"
              style="float: right"
              @click="editUserList"
            >
              编辑
            </el-button>
          </div>
          <!--表格渲染-->
          <el-table
            :data="userTableData"
            style="width: 100%;margin-bottom: 20px;"
            border
          >
            <el-table-column
              type="index"
              width="50"
            />
            <el-table-column
              prop="areaName"
              width="220"
              :show-overflow-tooltip="showOverflowTooltip"
              :label="jobDef.orgLevelName.includes('直管城市') ? '区域/事业部' : jobDef.orgLevelName"
            />
            <el-table-column
              prop="selectOrgName"
              width="220"
              label="岗位所在组织名称"
            >
              <template slot-scope="scope">
                <!-- 审核通过 和 调整人岗关系 -->
                <template v-if="mode === 'view' || mode==='modify' || mode=== 'query'">
                  <span>{{ scope.row.selectOrgName }}</span>
                </template>
                <div
                  class="userName"
                  @click="editOrgRow(scope.$index, scope.row)"
                >
                  <template v-if="mode === 'editBase'">
                    <span v-if="!editColOrgName">{{ scope.row.selectOrgName }}</span>
                    <template v-if="jobDef.stdTypeCode === '2' && scope.row.isClosed === '1' || jobDef.stdTypeCode === '1'">
                      <template v-if="editColOrgName && scope.row.dept.topDept">
                        <template v-if="jobDef.orgLevelCode === '2' || jobDef.orgLevelCode === '4'">
                          <treeselect
                            v-model="scope.row.dept.id"
                            :no-options-text="noChildrenText"
                            :max-height="200"
                            style="height:26px;"
                            :options="scope.row.dept.children !== null ? scope.row.dept.children : optionsList"
                            :clearable="false"
                            @select="editHandleNodeClick"
                          />
                        </template>
                        <template v-else-if="jobDef.orgLevelCode === '1'">
                          <treeselect
                            v-model="scope.row.dept.id"
                            :disable-branch-nodes="true"
                            :no-options-text="noChildrenText"
                            :max-height="200"
                            style="height:26px;"
                            :options="scope.row.dept.children !== null ? scope.row.dept.children : optionsList"
                            :clearable="false"
                            @select="editHandleNodeClick"
                          />
                        </template>
                      </template>
                      <template v-if="editColOrgName && scope.row.dept.topDept === null">
                        <template v-if="jobDef.orgLevelCode === '2' || jobDef.orgLevelCode === '4'">
                          <treeselect
                            style="height:26px;"
                            :no-options-text="noChildrenText"
                            :options="scope.row.dept.children !== null ? scope.row.dept.children : optionsList"
                            :max-height="200"
                            :clearable="false"
                            placeholder="请选择组织"
                            @select="editHandleNodeClick"
                          />
                        </template>
                        <template v-else-if="jobDef.orgLevelCode === '1'">
                          <treeselect
                            :disable-branch-nodes="true"
                            style="height:26px;"
                            :no-options-text="noChildrenText"
                            :options="scope.row.dept.children !== null ? scope.row.dept.children : optionsList"
                            :max-height="200"
                            :clearable="false"
                            placeholder="请选择组织"
                            @select="editHandleNodeClick"
                          />
                        </template>
                      </template>
                    </template>
                    <template v-if="jobDef.stdTypeCode === '2' && scope.row.isClosed === '0'">
                      {{ scope.row.selectOrgName }}
                    </template>
                  </template>
                  <!-- 草稿状态 -->
                  <template v-if="mode === 'editAll'">
                    <template v-if="jobDef.stdTypeCode === '2' && scope.row.isClosed === '1' || jobDef.stdTypeCode === '1'">
                      <template v-if="scope.row.dept.topDept !== null">
                        <template v-if="jobDef.orgLevelCode === '2' || jobDef.orgLevelCode === '4'">
                          <treeselect
                            v-model="scope.row.dept.id"
                            :max-height="200"
                            :no-options-text="noChildrenText"
                            style="height:26px;"
                            :options="scope.row.dept.children !== null ? scope.row.dept.children : optionsList"
                            :clearable="false"
                            @select="editHandleNodeClick"
                          />
                        </template>
                        <template v-else-if="jobDef.orgLevelCode === '1'">
                          <treeselect
                            v-model="scope.row.dept.id"
                            class="holder-value"
                            :disable-branch-nodes="true"
                            :max-height="200"
                            :no-options-text="noChildrenText"
                            style="height:26px;"
                            :options="scope.row.dept.children !== null ? scope.row.dept.children : optionsList"
                            :clearable="false"
                            @select="editHandleNodeClick"
                          />
                        </template>
                      </template>
                      <template v-else>
                        <template v-if="jobDef.orgLevelCode === '2' || jobDef.orgLevelCode === '4'">
                          <treeselect
                            style="height:26px;"
                            :options="scope.row.dept.children !== null ? scope.row.dept.children : optionsList"
                            :no-options-text="noChildrenText"
                            :max-height="200"
                            :clearable="false"
                            placeholder="请选择组织"
                            @select="editHandleNodeClick"
                          />
                        </template>
                        <template v-else-if="jobDef.orgLevelCode === '1'">
                          <treeselect
                            :disable-branch-nodes="true"
                            style="height:26px;"
                            :options="scope.row.dept.children !== null ? scope.row.dept.children : optionsList"
                            :no-options-text="noChildrenText"
                            :max-height="200"
                            :clearable="false"
                            placeholder="请选择组织"
                            @select="editHandleNodeClick"
                          />
                        </template>
                      </template>
                    </template>
                    <template v-if="jobDef.stdTypeCode === '2' && scope.row.isClosed === '0'">
                      {{ scope.row.selectOrgName }}
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
                <template v-if="mode==='view' || mode==='modify' || mode=== 'query'">
                  <span>{{ scope.row.nickname }}</span>
                </template>
                <div @click="editOrgRow(scope.$index, scope.row)">
                  <template v-if="mode === 'editBase'">
                    <template v-if="jobDef.stdTypeCode === '2' && scope.row.isClosed === '1' || jobDef.stdTypeCode === '1'">
                      <span v-if="!editNickName">{{ scope.row.nickname }}</span>
                      <template v-else>
                        <div
                          class="userNameContainer"
                          @click="editSelectUserName(scope.$index, scope.row)"
                        >
                          <template v-if="scope.row.nickname">
                            <treeselect
                              class="holder-value"
                              :open-on-click="false"
                              style="height:26px;"
                              :clearable="false"
                              :placeholder="scope.row.nickname"
                            />
                          </template>
                          <template v-else>
                            <treeselect
                              style="height:26px;"
                              :open-on-click="false"
                              :clearable="false"
                              placeholder="请选择用户"
                            />
                          </template>
                        </div>
                      </template>
                    </template>
                    <!-- 0已关闭状态 -->
                    <template v-if="jobDef.stdTypeCode === '2' && scope.row.isClosed === '0'">
                      {{ scope.row.nickname }}
                    </template>
                  </template>
                  <template v-if="mode === 'editAll'">
                    <!--通用岗位1 专用岗位2  关闭和开启状态-->
                    <template v-if="jobDef.stdTypeCode === '2' && scope.row.isClosed === '1' || jobDef.stdTypeCode === '1'">
                      <div
                        class="userNameContainer"
                        @click="editSelectUserName(scope.$index, scope.row)"
                      >
                        <template v-if="scope.row.nickname">
                          <treeselect
                            class="holder-value"
                            :open-on-click="false"
                            style="height:26px;"
                            :clearable="false"
                            :placeholder="scope.row.nickname"
                          />
                        </template>
                        <template v-else>
                          <treeselect
                            style="height:26px;"
                            :open-on-click="false"
                            :clearable="false"
                            placeholder="请选择用户"
                          />
                        </template>
                      </div>
                    </template>
                    <!-- 0已关闭状态 -->
                    <template v-if="jobDef.stdTypeCode === '2' && scope.row.isClosed === '0'">
                      {{ scope.row.nickname }}
                    </template>
                  </template>
                </div>
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
              prop="jobCode"
              label="岗位编码"
            />
            <!--            <el-table-column v-if="mode==='editBase' && showEditUserListBtn" label="操作" width="130px" align="center" fixed="right">-->
            <el-table-column
              v-if="mode==='editBase' && showEditUserListBtn || mode==='editAll' && Number(jobDef.stdTypeCode) === 1 || mode==='editAll' && Number(jobDef.stdTypeCode) === 2 && jobDef.approval!== null && jobDef.approval.status === '4'"
              label="操作"
              width="130px"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <div class="btn-container">
                  <el-button
                    v-if="Number(jobDef.stdTypeCode) === 1"
                    size="mini"
                    type="text"
                    style="display: inline-block"
                    @click="copyJobDef(scope.$index)"
                  >
                    新增
                  </el-button>
                  <el-button
                    v-if="Number(jobDef.stdTypeCode) === 1"
                    size="mini"
                    type="text"
                    style="display: inline-block"
                    @click="delJobDef(scope.$index)"
                  >
                    删除
                  </el-button>
                  <!-- 专用岗位 已生效状态 typeCode 1行政岗 stdTypeCode1 通用岗-->
                  <el-button
                    v-if="Number(jobDef.typeCode) === 2 && Number(jobDef.stdTypeCode) === 2 && jobDef.approval!== null && jobDef.approval.status === '4' && scope.row.isClosed === '1' && scope.row.isDelete === true"
                    size="mini"
                    type="text"
                    style="display: inline-block"
                    @click="delJobDef(scope.$index)"
                  >
                    删除
                  </el-button>
                  <el-button
                    v-if="Number(jobDef.typeCode) === 1 && Number(jobDef.stdTypeCode) === 2 && jobDef.approval!== null && jobDef.approval.status === '4' && scope.row.isClosed === '1' && scope.row.isDelete === true && scope.row.user === null"
                    size="mini"
                    type="text"
                    style="display: inline-block"
                    @click="delJobDef(scope.$index)"
                  >
                    删除
                  </el-button>
                  <el-button
                    v-if="Number(jobDef.typeCode) === 1 && Number(jobDef.stdTypeCode) === 2 && jobDef.approval!== null && jobDef.approval.status === '4' && scope.row.isClosed === '1' && scope.row.isDelete === false && scope.row.user === null && scope.row.jobCode === null"
                    size="mini"
                    type="text"
                    style="display: inline-block"
                    @click="closeJobDef(scope.$index)"
                  >
                    关闭
                  </el-button>
                  <el-button
                    v-if="Number(jobDef.typeCode) === 2 && Number(jobDef.stdTypeCode) === 2 && jobDef.approval!== null && jobDef.approval.status === '4' && scope.row.isClosed === '1' && scope.row.isDelete === false"
                    size="mini"
                    type="text"
                    style="display: inline-block"
                    @click="closeJobDef(scope.$index)"
                  >
                    关闭
                  </el-button>
                  <el-button
                    v-if="Number(jobDef.stdTypeCode) === 2 && jobDef.approval!== null && jobDef.approval.status === '4' && scope.row.isClosed === '0'"
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
            <!-- 专用岗的关闭 -->
            <el-table-column
              v-if="mode==='editAll' && Number(jobDef.stdTypeCode) === 2 || mode==='editAll' && Number(jobDef.stdTypeCode) === 2 && jobDef.approval!== null && jobDef.approval.status === '4'"
              label="操作"
              width="130px"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <div class="btn-container">
                  <!-- isClosed:0-已关闭状态显示为启用按钮;1-启用状态显示关闭按钮 -->
                  <el-button
                    v-if="!scope.row.disabled && scope.row.isClosed === '1'"
                    size="mini"
                    type="text"
                    style="display: inline-block"
                    @click="closeJobDef(scope.$index)"
                  >
                    关闭
                  </el-button>
                  <el-button
                    v-if="scope.row.disabled || scope.row.isClosed === '0'"
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
      </template>
      <!-- 查询中心 岗位查询显示的列表 -->
      <div
        v-if="mode === 'query'"
        class="job-list"
      >
        <el-card
          style="margin-top: 12px;"
          class="job-card"
        >
          <div
            v-if="jobDef.typeCode === '2' && jobDef.orgLevelCode === '3'"
            class="query-container"
          >
            <div class="query-content">
              <el-select
                v-model="queryUserParams.divisionCode"
                size="mini"
                filterable
                placeholder="所属区域"
                @change="selectArea"
              >
                <el-option
                  v-for="item in areaList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div
              v-if="level >= 1"
              class="query-content"
            >
              <el-select
                v-model="queryUserParams.compCode"
                size="mini"
                filterable
                placeholder="所属城市公司"
                @change="selectComp"
              >
                <el-option
                  v-for="item in compList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div
              v-if="level >= 2"
              class="query-content"
            >
              <el-select
                v-model="queryUserParams.projCode"
                size="mini"
                filterable
                placeholder="所属项目"
                @change="selectProject"
              >
                <el-option
                  v-for="item in projectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div
              v-if="level >= 3"
              class="query-content"
            >
              <el-select
                v-model="queryUserParams.divideCode"
                size="mini"
                filterable
                placeholder="分期查询"
                @change="selectDivide"
              >
                <el-option
                  v-for="item in divideList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <el-button
              size="mini"
              class="reset-btn"
              @click="resetQueryParams"
            >重置</el-button>
          </div>
          <el-table
            v-loading="loading"
            highlight-current-row
            :data="queryTableData"
            element-loading-text="拼命加载中"
            border
            style="width: 100%;margin-top:20px;"
          >
            <el-table-column type="index" />
            <el-table-column
              prop="deptName"
              label="岗位所在组织"
              :show-overflow-tooltip="showOverflowTooltip"
            />
            <el-table-column
              prop="deptCode"
              width="180"
              label="组织编号"
            />
            <el-table-column
              prop="nickname"
              label="员工姓名"
              width="180"
            />
            <el-table-column
              prop="username"
              label="员工账号"
              width="180"
            />
            <el-table-column
              prop="jobCode"
              label="岗位编码"
            />
          </el-table>
        </el-card>
      </div>
    </el-form>
    <div
      slot="footer"
      class="bottom-btn-groups"
    >
      <template v-if="mode !== 'view'">
        <el-button
          v-if="mode === 'add' && !showJobDef || showEditBtn || mode==='editAll'"
          type="primary"
          size="mini"
          @click="doSave()"
        >保存
        </el-button>
        <el-button
          v-if="mode === 'add' && !showJobDef || showEditBtn || mode==='editAll'"
          type="warning"
          size="mini"
          @click="doSubmitFlow()"
        >预览并提交
        </el-button>
        <!-- 草稿态、驳回、撤回 审批状态显示 查看审批状态和作废按钮-->
        <template v-if="approvalId !== '' && mode === 'editAll'">
          <el-button
            type="primary"
            size="mini"
            @click="toViewFlow()"
          >查看审批状态</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="invalidJobDef"
          >作废</el-button>
        </template>
        <el-button
          v-if="mode==='editAll'"
          type="default"
          size="mini"
          @click="goBack()"
        >返回</el-button>
      </template>
      <!--已审核编辑的时候 直接审批-->
      <template v-if="mode=== 'editBase' && !showOrganization">
        <el-button
          type="warning"
          size="mini"
          @click="saveEditBase"
        >预览并提交
        </el-button>
      </template>
      <template v-if="mode=== 'returnEditBase' || mode === 'modify' && showDisableBtn">
        <el-button
          type="danger"
          size="mini"
          @click="approvalDelete"
        >作废</el-button>
      </template>
      <!--编辑人岗关系列表保存和取消 -->
      <template v-if="showEditFooterBtn && jobDef.typeCode !== '1'">
        <el-button
          type="primary"
          size="mini"
          @click="saveEditJobDefList"
        >保存
        </el-button>
      </template>
      <template v-if="mode === 'view' || mode==='modify'">
        <el-button
          type="primary"
          size="mini"
          @click="toViewFlow()"
        >查看审批状态</el-button>
        <el-button
          type="default"
          size="mini"
          @click="goBack()"
        >返回</el-button>
      </template>
      <template v-if="mode==='editBase' || mode==='returnEditBase' || mode==='query'">
        <el-button
          type="default"
          size="mini"
          @click="goBack()"
        >返回</el-button>
      </template>
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
        <div class="remark-list">
          <h3>操作历史：</h3>
          <el-table
            border
            :data="records"
          >
            <el-table-column
              prop="remark"
              label="历史理由"
            />
            <el-table-column
              prop="lastModifyUserName"
              label="操作人"
              :show-overflow-tooltip="showOverflowTooltip"
              width="160"
            />
            <el-table-column
              label="操作时间"
              width="150"
            >
              <template slot-scope="scope">
                {{ timestampToDate(scope.row.createTime) }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作类型"
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.status === '0' ? '启用' : '关闭' }}
              </template>
            </el-table-column>
          </el-table>
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
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { header } from "@crud/crud";
import {
  getDepts,
  getAreaDepts,
  getDivisionCode,
  getAllProject,
  validateDefName,
  getAreaDeptByFunc,
} from "@http/system/dept";
import {
  addJobDef,
  getJobDef,
  editJobDef,
  submitFlow,
  getALLSys,
} from "@http/system/jobDef";
import { viewFlow, edit } from "@http/system/approval";
import { getUsersJobs, editUsersJobs } from "@http/system/user";
import {
  getPreviewJobDef,
  invalidJobDef,
  approvalDelete,
  getJobDefsDeptRecord,
} from "@http/system/jobDef";
import {
  getUsersJobById,
  getUsersJobByIdFirst,
  openUsersJobs,
  closeUsersJobs,
} from "@http/system/usersJobs";
import UserSelector from "@/components/biz/UserSelector";
// crud交由presenter持有
export default {
  name: "JobDefApproval",
  //  udOperation,
  components: { UserSelector, Treeselect },
  mixins: [header()],
  props: {
    viewMode: {
      type: String,
      default: "",
    },
    id: {
      type: Number,
      default: null,
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
      value: null,
      optionsList: [],
      showEditBtn: false,
      showEditUserListBtn: false,
      editColOrgName: false,
      showEditDialog: false,
      editNickName: false,
      editIndex: null,
      editVal: null,
      editInfo: {},
      showJobDef: true,
      firstAdd: true,
      showEditBaseCont: false,
      userListMode: "mgr",
      userListSelectType: "radio",
      currentSelectVal: "", // 当前选中的人员
      userListQueryParam: { deptCode: "", deptId: undefined },
      userListAdvancedFilter: false,
      userSelDialog: { title: "选择用户", show: false },
      jobDef: {
        name: "",
        orgLevelCode: "",
        orgLevelName: "",
        funcCode: "",
        funcName: "",
        bizSys: "",
        stdTypeCode: "",
        stdTypeName: "",
        remark: "",
      },
      showOrganization: false,
      showUserList: false,
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
        bizSys: [
          { required: true, message: "请选择业务系统", trigger: "blur" },
        ],
        orgLevelName: [
          { required: true, message: "请选择层级", trigger: "blur" },
        ],
        stdTypeName: [
          { required: true, message: "请选择岗位组性质", trigger: "blur" },
        ],
      },
      permission: {
        add: ["admin", "dept:add"],
        edit: ["admin", "dept:edit"],
        del: ["admin", "dept:del"],
      },
      // enabledTypeOptions: [
      //   { key: 'true', display_name: '正常' },
      //   { key: 'false', display_name: '禁用' }
      // ],
      expandNodes: [],
      depts: [],
      dialogVisible: false,
      tableData: [],
      selectTabOrgName: "",
      selectTabOrgCode: "",
      deptName: "",
      defaultProps: {
        children: "children",
        label: "name",
      },
      clickIndex: "",
      selectOrgObj: {},
      selectOrgCode: "",
      selectUserIndex: "",
      selectUser: {},
      mode: this.$props.viewMode,
      userTableData: [],
      usersJobApprovalVos: [],
      oldUsersJobApprovalVos: [],
      previewStatus: false,
      showOverflowTooltip: true,
      approvalId: this.$route.query.approvalId
        ? this.$route.query.approvalId
        : "",
      action: this.$route.query.action ? this.$route.query.action : "",
      bizAction: this.$route.query.bizAction ? this.$route.query.bizAction : "",
      commentApprovalId: this.$route.query.approvalId
        ? this.$route.query.approvalId
        : null,
      showEditFooterBtn: false,
      catchList: [],
      newList: [],
      value5: [],
      options: [],
      flag: false,
      noChildrenText: "暂无子部门数据！",
      noText: "暂无子部门数据！", // vue-treeselect 没有子部门显示的文字
      showApprovalList: false,
      queryTableData: [],
      loading: true,
      areaList: [],
      compList: [],
      projectList: [],
      divideList: [],
      queryUserParams: {
        divisionCode: null,
        compCode: null,
        projCode: null,
        divideCode: null,
      },
      level: null,
      showDisableBtn: false,
      closeJobDefDialogVisible: false,
      editAllRemark: null,
      currentIndex: null,
      saveStatus: null,
      records: null,
      originJobDefName: null,
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
    deptName(val) {
      this.$refs.deptTree.filter(val);
    },
    selectTabOrgName(val, oldVal) {
      console.log(664, val, oldVal);
    },
    oldUsersJobApprovalVos(val) {
      console.log(671, "watch oldUsersJobApprovalVos", val);
    },
    tableData(val) {
      // 用户删除所有的信息返回上一步 重新加载组织列表
      if (val.length === 0) {
        this.getAreaDepts(this.jobDef.orgLevelCode);
      }
    },
    userTableData(val) {
      // 用户删除所有的信息返回上一步 重新加载列表
      if (val.length === 0) {
        this.getUsersJobs();
      }
    },
    jobDef: {
      handler(newValue, oldValue) {
        if (!Object.is(newValue, oldValue)) {
          this.flag = false;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.getALLSys();
    this.getDepts();
    if (this.$props.id) {
      // 基本信息 和 人岗关系列表
      this.getJobDef();
    } else {
      this.showJobDef = true;
    }
    if (this.$props.viewMode === "editBase") {
      this.showOrganization = true;
    } else if (this.$props.viewMode === "query") {
      // 查询人岗关系接口
      const query = {
        hrTypeCodes: 20,
      };
      this.getUsersJobByIdFirst();
      this.getAreaList(query);
    }
    if (this.approvalId && this.bizAction === "11") {
      this.mode = "editAll";
      this.getPreviewJobDef();
      return;
    } else if (this.approvalId && this.bizAction === "12") {
      // 已审核的编辑基础信息 返回修改
      this.mode = "returnEditBase";
      this.getPreviewJobDef();
      this.showEditBaseCont = true;
      this.showOrganization = false;
      this.showUserList = false;
      this.showEditFooterBtn = false;
      return;
    } else if (this.approvalId && this.bizAction === "13") {
      this.mode = "modify";
      this.showDisableBtn = true;
      this.getPreviewJobDef();
      return;
    } else if (this.approvalId) {
      this.mode = "modify";
      this.getPreviewJobDef();
      return;
    }
  },
  methods: {
    // 查询所有区域组织
    getAreaList(argument) {
      getDivisionCode(argument).then((res) => {
        res.forEach((item) => {
          item.label = item.name;
          item.value = item.code;
        });
        this.areaList = res;
      });
    },
    getDivisionCode(argument) {
      getDivisionCode(argument).then((res) => {
        res.forEach((item) => {
          item.label = item.name;
          item.value = item.code;
        });
        if (this.level === 1) {
          this.compList = res;
        } else if (this.level === 3) {
          this.divideList = res;
        }
      });
    },
    // 查询所有的项目
    getAllProject(argument) {
      getAllProject(argument).then((res) => {
        res.forEach((item) => {
          item.label = item.name;
          item.value = item.code;
        });
        this.projectList = res;
      });
    },
    selectArea(node) {
      console.log("node", node);
      const params = {
        PCode: node,
        hrTypeCodes: 21,
      };
      this.level = 0;
      this.level++;
      this.queryUserParams = {
        divisionCode: node,
        compCode: null,
        projCode: null,
        divideCode: null,
      };
      this.getDivisionCode(params);
      this.getUsersJobById({
        jobDefId: this.$props.id,
        divisionCode: node,
      });
    },
    selectComp(node) {
      console.log("城市code:", node);
      const params = {
        PCode: node,
        types: "P1",
      };
      this.level = 1;
      this.level++;
      this.queryUserParams.compCode = node;
      this.queryUserParams.projCode = null;
      this.queryUserParams.divideCode = null;
      // 获取项目的列表
      this.getUsersJobById({
        jobDefId: this.$props.id,
        compCode: node,
      });
      this.getAllProject(params);
    },
    selectProject(node) {
      const params = {
        PCode: node,
      };
      this.queryUserParams.projCode = node;
      this.queryUserParams.divideCode = null;
      this.level = 2;
      this.level++;
      this.getDivisionCode(params);
      this.getUsersJobById({
        jobDefId: this.$props.id,
        projCode: node,
      });
    },
    selectDivide(node) {
      this.queryUserParams.divideCode = node;
      this.getUsersJobById({
        jobDefId: this.$props.id,
        divideCode: node,
      });
    },
    resetQueryParams() {
      this.queryUserParams = {
        divisionCode: null,
        compCode: null,
        projCode: null,
        divideCode: null,
      };
      this.level = -1;
      this.areaList = [];
      this.compList = [];
      this.compList = [];
      this.divideList = [];
      const query = {
        hrTypeCodes: 20,
      };
      this.getAreaList(query);
      this.getUsersJobByIdFirst();
    },
    getUsersJobByIdFirst() {
      this.loading = true;
      getUsersJobByIdFirst(this.$props.id).then((res) => {
        const resData = res;
        resData.forEach((item) => {
          item.deptName = item.dept.fullName;
          item.deptCode = item.dept.code;
          if (item.user) {
            item.nickname = item.user.nickName;
            item.username = item.user.username;
          } else {
            item.nickname = "";
            item.username = "";
          }
        });
        this.queryTableData = resData;
        this.loading = false;
      });
    },
    getUsersJobById(argument) {
      const params = {
        jobDefId: this.$props.id,
      };
      this.loading = true;
      getUsersJobById(argument || params).then((res) => {
        const resData = res;
        resData.forEach((item) => {
          item.deptName = item.dept.fullName;
          item.deptCode = item.dept.code;
          if (item.user) {
            item.nickname = item.user.nickName;
            item.username = item.user.username;
          } else {
            item.nickname = "";
            item.username = "";
          }
        });
        this.queryTableData = resData;
        this.loading = false;
      });
    },
    // 全部组织
    getALLSys() {
      getALLSys().then((res) => {
        res.forEach((item) => {
          item.label = item.name;
          item.value = item.name;
        });
        this.options = res;
      });
    },
    getJobDef() {
      getJobDef(this.$props.id)
        .then((res) => {
          this.jobDef = {
            id: res.id,
            name: res.name,
            orgLevelCode: res.orgLevelCode,
            orgLevelName: res.orgLevelName,
            funcCode: res.funcCode,
            funcName: res.funcName,
            bizSys: res.bizSys === null ? "" : res.bizSys,
            stdTypeCode: res.stdTypeCode,
            stdTypeName: res.stdTypeName,
            remark: res.remark,
            approval: JSON.parse(JSON.stringify(res.approval)),
          };
          this.value5 =
            this.jobDef.bizSys !== "" ? this.jobDef.bizSys.split(",") : [];
          this.jobDef = res;
          this.orgLevelCode = this.jobDef.orgLevelCode;
          this.funcCode = this.jobDef.funcCode;
          this.originJobDefName = res.name;
          this.commentApprovalId = res.approval.id;
          if (this.$props.mode !== "add") {
            // 人岗关系列表
            this.showOrganization = true;
            this.getUsersJobs(this.jobDef.id);
          } else {
            this.showJobDef = true;
          }
          if (this.previewStatus === true) {
            this.showEditBaseCont = false;
            this.showOrganization = true;
            submitFlow(this.jobDef.approval.id, false)
              .then((res) => {
                window.location.href = res;
              })
              .catch(() => {
                this.$message.error({
                  message: "提交流程失败",
                  duration: 2000,
                });
              });
          }
        })
        .catch((err) => {
          console.log(391, "工作台岗位信息", err);
        });
    },
    // 查看的时候 人岗关系
    getUsersJobs() {
      getUsersJobs(this.jobDef.id)
        .then((res) => {
          // 人岗关系的编辑 数组里面的dept
          const resData = res.filter((items) => {
            return items.dept !== null;
          });
          const code = this.jobDef.orgLevelCode;
          resData.forEach((item) => {
            item.disabled = false;
            item.isDelete = false;
            item.key = parseInt(Math.random() * 90000000000);
            if (!item.user) {
              // 没有用户
              item.nickname = "";
              item.employNum = "";
              item.username = "";
            } else {
              item.nickname = item.user.nickName;
              item.employNum = item.user.employNum;
              item.username = item.user.username;
            }
            if (item.dept && item.dept.topDept !== null) {
              if (code === "4") {
                const nameList = item.dept.topDept.fullName.split("-");
                const nameLen = item.dept.topDept.fullName.split("-").length;
                // 城市公司需要带上一级 nameLen - 2
                item.areaName =
                  nameList[nameLen - 2] + "-" + item.dept.topDept.name;
              } else {
                item.areaName = item.dept.topDept.name;
              }
              item.dept.areaName = item.dept.topDept.name;
              item.dept.children = item.dept.topDept.children;
              item.selectOrgCode = item.dept.code;
              item.selectOrgName = item.dept.name;
            } else {
              // 没有用户和组织的 补数据
              if (code === "4") {
                const nameList = item.dept.fullName.split("-");
                const nameLen = item.dept.fullName.split("-").length;
                // 城市公司需要带上一级 nameLen - 2
                item.areaName = nameList[nameLen - 2] + "-" + item.dept.name;
              } else {
                item.areaName = item.dept.name;
              }
            }
            if (item.dept.hasOwnProperty("defaultDept")) {
              if (item.dept.defaultDept !== null) {
                if (item.id === null && item.isClosed === "1") {
                  item.dept.id = item.dept.defaultDept.id;
                  item.dept.label = item.dept.defaultDept.label;
                  // item.dept.topDept = item.dept
                  // item.selectOrgCode = item.dept.topDept.code
                  // item.selectOrgName = item.dept.topDept.name
                }
              }
            }
          });
          this.userTableData = resData;
          this.newList = resData;
          this.catchList = JSON.parse(JSON.stringify(resData));
          this.userTableData = this.userTableData.sort((a, b) => {
            return a.areaName.localeCompare(b.areaName, "zh");
          });
          // 区域 一样的时候 就是显示为删除 否则为 关闭
          console.log(1231, this.userTableData);
          for (let i = 0; i < this.userTableData.length; i++) {
            for (let j = i + 1; j < this.userTableData.length; j++) {
              if (
                this.userTableData[i].areaName ===
                  this.userTableData[j].areaName &&
                this.jobDef.typeCode === "2"
              ) {
                this.$set(this.$data.userTableData[i], "isDelete", true);
                this.$set(this.$data.userTableData[j], "isDelete", true);
              }
            }
          }
          console.log(1241, this.userTableData);
        })
        .catch((err) => {
          console.log("工作台岗位信息: err", err);
        });
    },
    // 编辑基础信息
    editBaseInfo() {
      // 这个已审核状态 返回修改的内容
      this.showEditBaseCont = true;
      this.showOrganization = false;
      this.showUserList = false;
      this.showEditFooterBtn = false;
    },
    handleNodeClick(data) {
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
        "dept",
        this.selectOrgObj
      );
      // 专业岗
      if (this.jobDef.stdTypeCode === "2") {
        this.tableData.forEach((item) => {
          delete item.selectOrgCode;
        });
      } else if (this.jobDef.stdTypeCode === "1") {
        this.$set(
          this.$data.usersJobApprovalVos[this.clickIndex],
          "dept",
          this.selectOrgObj
        );
      }
    },
    clickRow(val, index) {
      this.clickIndex = index;
      const len = this.usersJobApprovalVos.length;
      if (index === len) {
        this.usersJobApprovalVos.splice(index, 0, { dept: {}, user: {} });
      }
      if (index > len) {
        // 向数组中添加一个空对象
        this.usersJobApprovalVos.splice(index, 0, { dept: {}, user: {} });
      }
      // 如果新增的数据 小于后端返回的用户长度 添加一个新对象
      if (index < len) {
        // 向数组中添加一个空对象
        this.usersJobApprovalVos.splice(index, 0, { dept: {}, user: {} });
      }
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
      this.$set(
        this.$data.usersJobApprovalVos[this.clickIndex],
        "dept",
        this.selectOrgObj
      );
    },
    //
    copyTableJobDef(index) {
      const user = JSON.parse(JSON.stringify(this.tableData[index]));
      delete user.key;
      delete user.id;
      if (this.tableData[index].nickname) {
        delete user.employNum;
        delete user.nickname;
        delete user.username;
      }
      this.tableData.splice(index + 1, 0, user);
    },
    // 删除一行人岗关系
    delTableJobDef(index, rows) {
      console.log("delTableJobDef: ", index, rows);
      rows.splice(index, 1);
      console.log("del after:", rows);
    },
    // 新增一行人岗关系
    copyJobDef(index) {
      const user = JSON.parse(JSON.stringify(this.userTableData[index]));
      delete user.key;
      delete user.id;
      if (this.userTableData[index].nickname) {
        delete user.user;
        delete user.employNum;
        delete user.nickname;
        delete user.username;
      }
      this.userTableData.splice(index + 1, 0, user);
      console.log(939, "userTableData: ", this.userTableData);
    },
    // 删除一行人岗关系
    delJobDef(index) {
      console.log("delJobDef : ", index, this.userTableData);
      this.userTableData.splice(index, 1);
      console.log("del after:", this.userTableData);
      this.userTableData.forEach((item) => {
        item.isDelete = false;
      });
      for (let i = 0; i < this.userTableData.length; i++) {
        for (let j = i + 1; j < this.userTableData.length; j++) {
          if (
            this.userTableData[i].areaName === this.userTableData[j].areaName
          ) {
            this.$set(this.$data.userTableData[i], "isDelete", true);
            this.$set(this.$data.userTableData[j], "isDelete", true);
          }
        }
      }
      console.log(1241, this.userTableData);
    },
    selectOrgLevelCode(params) {
      const { value, label } = params;
      this.jobDef.orgLevelCode = value;
      this.jobDef.orgLevelName = label;
      if (!this.firstAdd) {
        this.getAreaDepts(this.jobDef.orgLevelCode);
      }
      if (this.mode === "editAll") {
        // this.getAreaDepts(this.jobDef.orgLevelCode)
        this.getAreaDeptByFunc();
        // 切换层级之后 通过职能配置自动生成岗位所在组织
        this.userTableData = [];
      } else if (this.mode === "editBase") {
        this.getAreaDepts(this.jobDef.orgLevelCode);
      }
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
        console.log(1495, "this.tableData:", this.tableData);
        this.showUserList = true;
      });
    },
    selectFuncCode(params) {
      const { value, label } = params;
      this.jobDef.funcCode = value;
      this.jobDef.funcName = label;
      this.funcCode = value;
      this.getAreaDeptByFunc();
    },
    selectBizSys(params) {
      this.jobDef.bizSys = params.join(",");
    },
    saveJobDefBase() {
      if (!this.jobDef.name) {
        this.$message.error({
          message: "请输入岗位组名称",
          duration: 2000,
        });
        return false;
      } else if (!this.jobDef.bizSys) {
        this.$message.error({
          message: "请选择业务系统",
          duration: 2000,
        });
        return false;
      } else if (!this.jobDef.funcName) {
        this.$message.error({
          message: "请选择职能",
          duration: 2000,
        });
        return false;
      } else if (!this.jobDef.remark) {
        this.$message.error({
          message: "请输入岗位组描述",
          duration: 2000,
        });
        return false;
      }
      const params = JSON.stringify({ jobDef: this.jobDef });
      editJobDef(params).then((res) => {
        this.$message.success({
          message: "修改基础信息成功",
          duration: 2000,
        });
        window.location.href = res;
      });
    },
    queryDefName() {
      if (this.originJobDefName !== this.jobDef.name) {
        this.validateDefName(this.jobDef.name);
      }
    },
    // 验证岗位组的名称
    validateDefName(argument) {
      validateDefName(argument).then((res) => {
        // 1 重复 0 不重复
        if (res === 1) {
          this.$message.error({
            message: "岗位组名称已存在",
            duration: 2000,
          });
          return false;
        }
      });
    },
    // 已审核通过 编辑状态
    saveEditBase() {
      this.saveJobDefBase();
    },
    cancelJobDefBase() {
      this.showEditBaseCont = false;
      this.showOrganization = true;
      this.getJobDef();
    },
    // 编辑基础信息状态下的 取消
    editBaseCancel() {
      this.showEditBaseCont = false;
      this.showOrganization = true;
    },
    getAreaDepts(argument) {
      getAreaDepts(argument).then((res) => {
        const code = this.jobDef.orgLevelCode;
        res.content.forEach((item) => {
          item.disabled = false;
          if (code === "4") {
            const nameList = item.fullName.split("-");
            const nameLen = item.fullName.split("-").length;
            // 城市公司需要带上一级 nameLen - 2
            item.areaName = nameList[nameLen - 2] + "-" + item.name;
          } else {
            item.areaName = item.name;
          }
        });
        this.tableData = res.content;
        this.tableData = this.tableData.sort((a, b) => {
          return a.areaName.localeCompare(b.areaName, "zh");
        });
        this.showUserList = true;
      });
    },
    changeRadio(params) {
      this.jobDef.stdTypeCode = params;
      if (params === "1") {
        this.jobDef.stdTypeName = "通用岗位（一岗多人）";
      } else if (params === "2") {
        this.jobDef.stdTypeName = "专用岗位（一岗一人）";
      }
      this.getAreaDepts(this.jobDef.orgLevelCode);
      this.userTableData = [];
    },
    // 获取弹窗内部门数据
    getDepts() {
      getDepts({ enabled: true }).then((res) => {
        this.expandNodes = res.content.length > 0 ? [res.content[0].id] : [];
        this.depts = res.content;
      });
    },
    // 点击用户选择
    selectUserName(index) {
      // 显示用户选择列表
      this.userSelDialog.show = true;
      this.selectUserIndex = index;
      const len = this.usersJobApprovalVos.length;
      if (index === len) {
        this.usersJobApprovalVos.splice(index, 0, { dept: {}, user: {} });
      }
      if (index > len) {
        // 向数组中添加多个空对象 索引大于选中的数组长度
        const padStart = new Array(index).fill({ dept: {}, user: {} });
        this.usersJobApprovalVos = this.usersJobApprovalVos.concat(padStart);
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleTreeItemClick(data) {
      this.userListQueryParam.deptCode = data.code;
      this.userListQueryParam.deptId = data.id;
      this.$refs.userList.getUserData();
    },
    handleRadioSelChange(params) {
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
      if (this.jobDef.stdTypeCode === "2") {
        this.$set(
          this.$data.usersJobApprovalVos[this.selectUserIndex],
          "user",
          this.selectUser
        );
      } else if (this.jobDef.stdTypeCode === "1") {
        this.$set(
          this.$data.usersJobApprovalVos[this.selectUserIndex],
          "user",
          this.selectUser
        );
      }
      this.userSelDialog.show = false;
    },
    // 取消
    resetAllInfo() {
      // 重置所有内容
      if (this.mode === "editBase") {
        this.cancelJobDefBase();
      } else if (this.mode === "editAll") {
        this.cancelJobDefBase();
        this.resetEditJobDef();
      }
    },
    resetEditJobDef() {
      this.editColOrgName = false;
      this.editNickName = false;
    },
    goBack() {
      this.$emit("click", false);
      if (this.mode === "query") {
        this.$router.push({ path: "/query/jobDef" });
      } else {
        this.$router.push({ path: "/workbench/jobDef" });
      }
    },
    // 提交前的校验
    validate() {
      if (!this.jobDef.name) {
        this.$message.error({
          message: "请输入岗位组名称",
          duration: 2000,
        });
        return false;
      } else if (!this.jobDef.orgLevelName) {
        this.$message.error({
          message: "请选择层级",
          duration: 2000,
        });
        return false;
      } else if (!this.jobDef.stdTypeName) {
        this.$message.error({
          message: "请选择岗位组性质",
          duration: 2000,
        });
        return false;
      } else if (!this.jobDef.remark) {
        this.$message.error({
          message: "请输入岗位组描述",
          duration: 2000,
        });
        return false;
      } else if (!this.jobDef.bizSys) {
        this.$message.error({
          message: "请选择业务系统",
          duration: 2000,
        });
        return false;
      }
    },
    checkTableData(value) {
      // 专用岗位每一个组织都需要填写
      if (value && value instanceof Array && value.length > 0) {
        if (this.jobDef.stdTypeCode === "2") {
          console.log(1519, value);
          // 专用岗关闭按钮 不校验 岗位和人员
          // const filterDisable = value.filter((item) => {
          //   return item.disabled !== true
          // })
          const filterDisable = value.filter((item) => {
            return item.disabled === true || item.isClosed === "1";
          });

          // value.filter((item) => {
          //   return item.disabled === true || item.isClosed === '1'
          // })
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
              return item.dept && item.user;
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
    // 保存
    doSave() {
      if (this.validate() === false) {
        return;
      }
      if (this.queryDefName() === false) {
        return;
      }
      const formatJobsList1 = [];
      const formatJobsList2 = [];
      if (this.jobDef.stdTypeCode === "1") {
        let usersJobsList = [];
        // 草稿状态 切换层级的话 tableData的值不为空
        const changeTableData = this.tableData.filter((newItem) => {
          return newItem.user;
        });
        if (changeTableData.length === 0 && this.userTableData.length !== 0) {
          // 直接在人岗关系列表上修改
          usersJobsList = this.userTableData.filter((newItem) => {
            return newItem.user;
          });
        } else {
          // 切换层级或者是岗位性质的基础上修改
          usersJobsList = changeTableData;
        }
        if (usersJobsList.length === 0 && this.userTableData.length === 0) {
          this.$message.error({
            message: "没有人岗关系",
            duration: 2000,
          });
          return false;
        }

        for (let i = 0; i < usersJobsList.length; i++) {
          const postData = {};
          if (usersJobsList[i].id && changeTableData.length === 0) {
            postData.id = usersJobsList[i].id;
          }
          if (usersJobsList[i].user) {
            postData.user = usersJobsList[i].user;
          }
          if (usersJobsList[i].newDept) {
            postData.dept = usersJobsList[i].newDept;
          } else if (usersJobsList[i].dept) {
            postData.dept = usersJobsList[i].dept;
          }
          formatJobsList1.push(postData);
        }
      } else if (this.jobDef.stdTypeCode === "2") {
        let usersJobsList = [];
        // 草稿状态 切换层级的话 tableData的值不为空
        const changeTableData = this.tableData;
        if (changeTableData.length === 0 && this.userTableData.length !== 0) {
          // 直接在人岗关系列表上修改
          usersJobsList = this.userTableData;
        } else {
          // 切换层级或者是岗位性质的基础上修改
          usersJobsList = changeTableData;
        }
        if (usersJobsList.length === 0 && this.userTableData.length === 0) {
          this.$message.error({
            message: "没有人岗关系",
            duration: 2000,
          });
          return false;
        }

        for (let i = 0; i < usersJobsList.length; i++) {
          const postData = {};
          if (usersJobsList[i].id && changeTableData.length === 0) {
            postData.id = usersJobsList[i].id;
          }
          postData.user = usersJobsList[i].user ? usersJobsList[i].user : null;
          if (usersJobsList[i].newDept) {
            postData.dept = usersJobsList[i].newDept;
          } else if (usersJobsList[i].dept) {
            postData.dept = usersJobsList[i].dept;
          }
          if (usersJobsList[i].remark) {
            postData.remark = usersJobsList[i].remark;
          }
          formatJobsList2.push(postData);
        }
      }
      const formatJobsList =
        this.jobDef.stdTypeCode === "1" ? formatJobsList1 : formatJobsList2;
      formatJobsList.forEach((item) => {
        delete item.dept.children;
        delete item.dept.topDept;
      });
      const params = {
        jobDef: this.jobDef,
        usersJobsList: formatJobsList,
      };
      console.log("formatJobsList>>>", formatJobsList);
      if (this.checkTableData(formatJobsList) === false) {
        return false;
      }
      const temp1 = formatJobsList;
      console.log("新增的时候：", params);
      // 一岗多人 同一区域下不同组织
      if (temp1.length > 1 && this.jobDef.stdTypeCode === "1") {
        for (let i = 0; i < temp1.length; i++) {
          for (let j = i + 1; j < temp1.length; j++) {
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
      if (formatJobsList.length === 0) {
        this.$message.error({
          message: "请选择相关人员和组织",
          duration: 2000,
        });
        return;
      }
      addJobDef(JSON.stringify(params))
        .then((res) => {
          this.$message.success({
            message: "保存岗位组工作台信息成功",
            duration: 2000,
          });
          this.flag = true;
          console.log("保存工作台岗位信息成功", res.id);
          this.jobDef = res;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error({
            message: "保存岗位信息失败",
            duration: 2000,
          });
        });
    },
    // 预览审核并提交
    doSubmitFlow() {
      if (this.validate() === false) {
        return;
      }
      if (this.$props.id && this.flag) {
        // this.doSave()
        if (this.jobDef.approval && this.jobDef.approval.id) {
          edit(this.jobDef.approval)
            .then((response) => {
              console.log(1349, "response", response);
              submitFlow(String(this.jobDef.approval.id), false)
                .then((res) => {
                  window.location.href = res;
                })
                .catch(() => {
                  this.$message.error({
                    message: "提交流程失败",
                    duration: 2000,
                  });
                });
            })
            .catch(() => {
              this.$message.error({
                message: "保存审批信息失败",
                duration: 2000,
              });
            });
        }
        return;
      }
      const formatJobsList1 = [];
      const formatJobsList2 = [];
      if (this.jobDef.stdTypeCode === "1") {
        let usersJobsList = [];
        // 草稿状态 切换层级的话 tableData的值不为空
        const changeTableData = this.tableData.filter((newItem) => {
          return newItem.user;
        });
        if (changeTableData.length === 0 && this.userTableData.length !== 0) {
          // 直接在人岗关系列表上修改
          usersJobsList = this.userTableData.filter((newItem) => {
            return newItem.user;
          });
        } else {
          // 切换层级或者是岗位性质的基础上修改
          usersJobsList = changeTableData;
        }
        if (usersJobsList.length === 0 && this.userTableData.length === 0) {
          this.$message.error({
            message: "没有人岗关系",
            duration: 2000,
          });
          return false;
        }

        for (let i = 0; i < usersJobsList.length; i++) {
          const postData = {};
          if (usersJobsList[i].id && changeTableData.length === 0) {
            postData.id = usersJobsList[i].id;
          }
          if (usersJobsList[i].user) {
            postData.user = usersJobsList[i].user;
          }
          if (usersJobsList[i].newDept) {
            postData.dept = usersJobsList[i].newDept;
          } else if (usersJobsList[i].dept) {
            postData.dept = usersJobsList[i].dept;
          }
          formatJobsList1.push(postData);
        }
      } else if (this.jobDef.stdTypeCode === "2") {
        let usersJobsList = [];
        // 草稿状态 切换层级的话 tableData的值不为空
        const changeTableData = this.tableData;
        if (changeTableData.length === 0 && this.userTableData.length !== 0) {
          // 直接在人岗关系列表上修改
          usersJobsList = this.userTableData;
        } else {
          // 切换层级或者是岗位性质的基础上修改
          usersJobsList = changeTableData;
        }
        if (usersJobsList.length === 0 && this.userTableData.length === 0) {
          this.$message.error({
            message: "没有人岗关系",
            duration: 2000,
          });
          return false;
        }

        for (let i = 0; i < usersJobsList.length; i++) {
          const postData = {};
          if (usersJobsList[i].id && changeTableData.length === 0) {
            postData.id = usersJobsList[i].id;
          }
          postData.user = usersJobsList[i].user ? usersJobsList[i].user : null;
          if (usersJobsList[i].newDept) {
            postData.dept = usersJobsList[i].newDept;
          } else if (usersJobsList[i].dept) {
            postData.dept = usersJobsList[i].dept;
          }
          if (usersJobsList[i].remark) {
            postData.remark = usersJobsList[i].remark;
          }
          formatJobsList2.push(postData);
        }
      }
      const formatJobsList =
        this.jobDef.stdTypeCode === "1" ? formatJobsList1 : formatJobsList2;
      const params = {
        jobDef: this.jobDef,
        usersJobsList: formatJobsList,
      };
      console.log(1814, params);
      const temp1 = formatJobsList;
      if (temp1.length > 1 && this.jobDef.stdTypeCode === "1") {
        for (let i = 0; i < temp1.length; i++) {
          for (let j = i + 1; j < temp1.length; j++) {
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
      if (formatJobsList.length === 0) {
        this.$message.error({
          message: "请选择相关人员和组织",
          duration: 2000,
        });
        return;
      }
      if (this.checkTableData(formatJobsList) === false) {
        return false;
      }
      addJobDef(JSON.stringify(params))
        .then((res) => {
          console.log("新增工作台岗位信息成功", res.id);
          console.log("新增工作台岗位信息成功", res);
          // 新增审核
          if (res.approval && res.approval.id) {
            edit(res.approval)
              .then((response) => {
                console.log(1349, "response", response);
                submitFlow(String(res.approval.id), false)
                  .then((res) => {
                    console.log(1349, "res", res);
                    window.location.href = res;
                  })
                  .catch(() => {
                    this.$message.error({
                      message: "提交流程失败",
                      duration: 2000,
                    });
                  });
              })
              .catch(() => {
                this.$message.error({
                  message: "保存审批信息失败",
                  duration: 2000,
                });
              });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error({
            message: "新增岗位信息失败",
            duration: 2000,
          });
        });
    },
    // 编辑人岗关系
    editRowInfo(val, index) {
      console.log("编辑人岗关系列表：", val, index);
      this.getCurrentOrgList(this.jobDef.orgLevelCode);
      this.editIndex = index;
      this.editInfo = JSON.parse(JSON.stringify(val));
      console.log("点击编辑的时候：当前数据", this.editInfo);
      this.showEditBtn = true;
    },
    // 调整人岗关系列表
    editUserList() {
      this.showEditUserListBtn = !this.showEditUserListBtn;
      this.editColOrgName = true;
      this.editNickName = true;
      this.showEditFooterBtn = true;
    },
    // 获取当前所在行的组织列表
    getCurrentOrgList(argument) {
      getAreaDepts(argument).then((res) => {
        res.content.forEach((item) => {
          item.areaName = item.name;
        });
        this.userTableData = res.content;
        this.editVal = this.userTableData[this.editIndex];
        const arr = [];
        arr.push(this.editVal);
        this.$set(this.$data.userTableData[this.editIndex], "nameList", arr);
        this.$set(
          this.$data.userTableData[this.editIndex],
          "selectOrgCode",
          this.editInfo.selectOrgCode
        );
        this.$set(
          this.$data.userTableData[this.editIndex],
          "selectOrgName",
          this.editInfo.selectOrgName
        );
        this.$set(
          this.$data.userTableData[this.editIndex],
          "nickname",
          this.editInfo.nickname
        );
        this.$set(
          this.$data.userTableData[this.editIndex],
          "employNum",
          this.editInfo.employNum
        );
        this.$set(
          this.$data.userTableData[this.editIndex],
          "username",
          this.editInfo.username
        );
        this.editColOrgName = true;
        this.editNickName = true;
      });
    },
    editOrgRow(index) {
      this.editIndex = index;
      const len = this.usersJobApprovalVos.length;
      if (index === len) {
        this.usersJobApprovalVos.splice(index, 0, { dept: {}, user: {} });
      }
      if (index > len) {
        // 向数组中添加多个空对象 索引大于选中的数组长度
        const padStart = new Array(index).fill({ dept: {}, user: {} });
        this.usersJobApprovalVos = this.usersJobApprovalVos.concat(padStart);
      }
    },
    editHandleNodeClick(data) {
      console.log("编辑的时候 选中的组织信息:", data, this.editIndex);
      this.selectOrgObj = data;
      this.selectOrgObj.areaName =
        this.$data.userTableData[this.editIndex].areaName;
      this.selectOrgCode = data.code;
      this.selectOrgName = data.name;
      this.editInfo.dept = this.selectOrgObj;
      this.$set(
        this.$data.userTableData[this.editIndex],
        "selectOrgCode",
        this.selectOrgCode
      );
      this.$set(
        this.$data.userTableData[this.editIndex],
        "selectOrgName",
        this.selectOrgName
      );
      this.$set(
        this.$data.userTableData[this.editIndex],
        "newDept",
        this.editInfo.dept
      );
      const target = this.$data.userTableData[this.editIndex].dept;
      const source = {
        topDept: JSON.parse(
          JSON.stringify(this.$data.userTableData[this.editIndex].dept)
        ),
      };
      const returnedTarget = Object.assign(target, source);
      this.$set(
        this.$data.userTableData[this.editIndex],
        "dept",
        returnedTarget
      );
    },
    // showEditDialog
    editSelectUserName(index, data) {
      this.editIndex = index;
      const len = this.usersJobApprovalVos.length;
      if (index === len) {
        this.usersJobApprovalVos.splice(index, 0, { dept: {}, user: {} });
      }
      if (index > len) {
        // 向数组中添加多个空对象 索引大于选中的数组长度
        const padStart = new Array(index).fill({ dept: {}, user: {} });
        this.usersJobApprovalVos = this.usersJobApprovalVos.concat(padStart);
      }
      this.showEditDialog = true;
      this.selectUserName(index);
      // 需要传递的nickname scope.row.nickname
      this.currentSelectVal = data.nickname;
    },
    editHandleRadioSelChange(params) {
      console.log("修改的时候， 选中的用户信息", params, this.editIndex);
      const data = params[0];
      this.selectUser = data;
      this.selectUser.nickname = data.nickName;
      this.selectUser.employNum = data.employNum;
      this.selectUser.username = data.username;
      this.$set(
        this.$data.userTableData[this.editIndex],
        "nickname",
        this.selectUser.nickname
      );
      this.$set(
        this.$data.userTableData[this.editIndex],
        "employNum",
        this.selectUser.employNum
      );
      this.$set(
        this.$data.userTableData[this.editIndex],
        "username",
        this.selectUser.username
      );
      this.$set(
        this.$data.userTableData[this.editIndex],
        "user",
        this.selectUser
      );
      this.editInfo.user = this.selectUser;
      this.$set(
        this.$data.usersJobApprovalVos[this.editIndex],
        "user",
        this.selectUser
      );
      this.userSelDialog.show = false;
      this.showEditDialog = false;
    },
    toViewFlow() {
      if (!this.commentApprovalId) {
        return;
      }
      viewFlow(this.commentApprovalId)
        .then((res) => {
          if (res) {
            window.open(res);
          }
        })
        .catch(() => {});
    },
    // 作废
    approvalDelete() {
      this.$confirm("确定要作废吗？")
        .then((_) => {
          console.log("作废", this.approvalId);
          approvalDelete(new Array(this.approvalId))
            .then((res) => {
              console.log("作废", res);
              this.$message.success({
                message: "作废成功!",
                duration: 2000,
              });
              this.$router.push({ path: "/workbench/jobDef" });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((_) => {});
    },
    // 作废
    invalidJobDef() {
      this.$confirm("确定要作废吗？")
        .then((_) => {
          console.log("作废", this.jobDef.id);
          invalidJobDef(this.jobDef.id)
            .then((res) => {
              console.log("作废", res);
              this.$message.success({
                message: "作废成功!",
                duration: 2000,
              });
              this.$router.push({ path: "/workbench/jobDef" });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((_) => {});
    },
    getPreviewJobDef() {
      getPreviewJobDef(this.approvalId)
        .then((res) => {
          console.log("getPreviewJobDef 基础信息", res);
          this.jobDef = res.jobDefDto;
          const resData = res.usersJobsList;
          if (resData.length > 0) {
            this.showApprovalList = true;
          }
          this.value5 =
            this.jobDef.bizSys !== "" ? this.jobDef.bizSys.split(",") : [];
          resData.forEach((item) => {
            item.key = parseInt(Math.random() * 90000000000);
            if (!item.user) {
              // 没有用户
              item.nickname = "";
              item.employNum = "";
              item.username = "";
            } else {
              item.nickname = item.user.nickName;
              item.employNum = item.user.employNum;
              item.username = item.user.username;
            }
            if (item.dept && item.dept.topDept && item.dept.topDept !== null) {
              item.areaName = item.dept.topDept.name;
              item.dept.children = item.dept.topDept.children;
              item.dept.areaName = item.dept.topDept.name;
              item.selectOrgCode = item.dept.code;
              item.selectOrgName = item.dept.name;
            } else if (item.dept && item.dept !== null) {
              // 没有用户和组织的 补数据
              item.areaName =
                item.dept && item.dept.fullName ? item.dept.fullName : "";
            }
          });
          this.userTableData = resData
            .filter((item) => item.areaName && item.areaName !== "")
            .sort((a, b) => {
              return a.areaName.localeCompare(b.areaName, "zh");
            });
          this.newList = resData;
          this.catchList = JSON.parse(JSON.stringify(resData));
        })
        .catch((err) => {
          console.log(err);
          this.$message.error({
            message: "获取岗位组审批信息失败",
            duration: 2000,
          });
        });
    },
    sameAreaDiffOrg(userJobList) {
      const newItem = {};
      const newArr = [];
      userJobList.forEach((item) => {
        newItem[item.areaName] || (newItem[item.areaName] = []);
        newItem[item.areaName] && newItem[item.areaName].push(item);
      });
      let i = 0;
      for (const obj in newItem) {
        newArr[i] = {
          title: obj,
          subs: newItem[obj],
        };
        i++;
      }
      newArr.forEach((items) => {
        items.subs.forEach((subItem) => {
          if (subItem.newDept) {
            subItem.deptName = subItem.newDept.name;
          } else {
            subItem.deptName = subItem.dept.name;
          }
        });
      });
      for (let i = 0; i < newArr.length; i++) {
        if (newArr[i].subs.length > 1) {
          const areaList = newArr[i].subs.map((item) => {
            return item.deptName;
          });
          const uniqueList = Array.from(new Set(areaList));
          if (uniqueList.length > 1) {
            return newArr[i].title + "-" + uniqueList;
          }
        }
      }
    },
    // 调整人岗关系的列表
    saveEditJobDefList() {
      if (this.queryDefName() === false) {
        return;
      }
      let addList = []; // 新增加的数据
      let delList = []; // 删除的数据
      const changeList = []; // 改变的数据
      const oldChangeList = []; // 旧的改变的数据
      const catchList = this.catchList;
      const newList = this.userTableData;
      addList = newList.filter((newItem) => {
        return !newItem.key;
      });
      delList = catchList.filter((catchItem) => {
        return newList.every((newItem) => {
          return catchItem.key !== newItem.key;
        });
      });
      delList.forEach((item) => {
        item.status = "N";
      });
      console.log("删除的数据：", delList);
      for (let i = 0; i < catchList.length; i++) {
        for (let j = 0; j < newList.length; j++) {
          if (
            catchList[i].key === newList[j].key &&
            !lodash.isEqual(catchList[i], newList[j])
          ) {
            oldChangeList.push(JSON.parse(JSON.stringify(catchList[i])));
            changeList.push(JSON.parse(JSON.stringify(newList[j])));
            break;
          }
        }
      }
      const output = this.sameAreaDiffOrg(this.userTableData);
      if (output) {
        const outputList = output.split("-");
        this.$message.error({
          message: "同一区域下,不能新增不同组织",
          duration: 2000,
        });
        this.$notify({
          title:
            "区域:" + outputList[0] + "," + "存在不同的组织：" + outputList[1],
        });
        return false;
      }
      const postDataList = [...addList, ...delList, ...changeList];
      let usersJobsList = Array.from(new Set(postDataList));
      usersJobsList = usersJobsList.filter((items) => {
        return items.newDept || items.user !== null;
      });
      usersJobsList = [...usersJobsList, ...delList, ...addList];
      const formatJobsList = [];
      for (let i = 0; i < usersJobsList.length; i++) {
        const postData = {};
        if (usersJobsList[i].id !== null && usersJobsList[i].id !== undefined) {
          postData.id = usersJobsList[i].id;
        }
        if (usersJobsList[i].jobCode) {
          postData.jobCode = usersJobsList[i].jobCode;
        }

        if (
          usersJobsList[i].id !== null &&
          usersJobsList[i].id !== undefined &&
          usersJobsList[i].status
        ) {
          postData.status = usersJobsList[i].status;
        }

        // 只删除组织
        if (usersJobsList[i].status && usersJobsList[i].jobDef !== null) {
          postData.status = usersJobsList[i].status;
          postData.dept = usersJobsList[i].dept;
        }
        if (
          usersJobsList[i].user &&
          usersJobsList[i].dept &&
          usersJobsList[i].newDept
        ) {
          postData.user = usersJobsList[i].user;
          postData.dept = usersJobsList[i].newDept;
        } else if (usersJobsList[i].user && usersJobsList[i].dept) {
          postData.user = usersJobsList[i].user;
          postData.dept = usersJobsList[i].dept;
        }
        if (JSON.stringify(postData) !== "{}") {
          formatJobsList.push(postData);
        }
      }
      formatJobsList.forEach((item) => {
        delete item.dept.children;
        delete item.dept.topDept;
      });
      const params = {
        jobDef: this.jobDef,
        usersJobsList: formatJobsList,
      };
      console.log(1530, "编辑提交的数据：", params);
      /* 新增的时候 人员和组织 缺一不可 */
      const statusYesList = formatJobsList.filter((items) => {
        return items.status !== "N";
      });
      const filterStatus = statusYesList.every((newItems) => {
        return newItems.dept && newItems.user;
      });
      if (!filterStatus) {
        this.$message.error({
          message: "调整人岗关系, 组织和人员缺一不可!",
          duration: 2000,
        });
        return false;
      }
      // 原来有组织的数据
      const topDeptList = this.userTableData.filter((items) => {
        return items.dept.topDept !== null;
      });
      const topDeptStatus = topDeptList.every((item) => {
        return item.dept.topDept !== null && item.user !== null;
      });
      if (!topDeptStatus) {
        this.$message.error({
          message: "调整人岗关系, 组织和人员缺一不可!",
          duration: 2000,
        });
        return false;
      }
      const originList = this.userTableData.filter((newItem) => {
        return newItem.user;
      });
      if (formatJobsList.length === 0 && originList.length === 0) {
        this.$message.error({
          message: "请选择相关人员和组织",
          duration: 2000,
        });
        return false;
      }
      const employList = this.userTableData.filter((item) => {
        return item.user && item.user.employNum && item.user.employNum !== null;
      });
      for (let i = 0; i < employList.length; i++) {
        for (let j = i + 1; j < employList.length; j++) {
          if (employList[i].dept) {
            if (
              employList[i].user.employNum === employList[j].user.employNum &&
              employList[i].dept.code === employList[j].dept.code
            ) {
              this.$message.error({
                message: "请勿重复添加!",
                duration: 2000,
              });
              return false;
            }
          }
        }
      }
      // 修改人岗关系的接口
      editUsersJobs(JSON.stringify(params)).then((res) => {
        this.$message.success({
          message: "修改人岗关系成功",
          duration: 2000,
        });
        this.showEditUserListBtn = !this.showEditUserListBtn;
        this.editColOrgName = !this.editColOrgName;
        this.editNickName = !this.editNickName;
        this.showEditFooterBtn = !this.showEditFooterBtn;
        this.getJobDef();
      });
    },
    // 草稿态的关闭
    closeJobDef(index) {
      this.closeJobDefDialogVisible = true;
      this.currentIndex = index;
      this.saveStatus = "close";
      const recordData = {
        deptId:
          this.userTableData[index].dept && this.userTableData[index].dept.id,
        jobDefId: this.jobDef.id,
      };
      getJobDefsDeptRecord(recordData).then((res) => {
        this.records = res.content.filter((item) => {
          return item.remark !== "" || item.remark !== null;
        });
      });
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
        this.$set(this.$data.userTableData[index], "disabled", true);
        if (this.$data.userTableData[index].hasOwnProperty("dept")) {
          this.$set(
            this.$data.userTableData[index],
            "dept",
            this.$data.userTableData[index].dept
          );
        } else {
          const currentObj = JSON.parse(
            JSON.stringify(this.$data.userTableData[index])
          );
          delete currentObj.children;
          this.$set(this.$data.userTableData[index], "dept", currentObj);
        }
        this.$set(
          this.$data.userTableData[index],
          "remark",
          this.editAllRemark
        );
        const userJob = this.userTableData[index];
        console.log(userJob.topDept);
        if (userJob.dept.topDept !== null) {
          userJob.dept.topDept = null;
        }
        const sendData = {
          jobDef: this.jobDef,
          usersJobsList: [userJob],
        };
        console.log(2306, sendData);
        closeUsersJobs(JSON.stringify(sendData)).then((res) => {
          this.$message.success({
            message: "关闭岗位成功",
            duration: 2000,
          });
          this.cancelCloseJobDef();
          console.log(2135, res);
          this.getUsersJobs();
        });
      } else if (this.saveStatus === "open") {
        this.$set(this.$data.userTableData[index], "disabled", false);
        this.$set(
          this.$data.userTableData[index],
          "remark",
          this.editAllRemark
        );
        const userJob = {};
        userJob.user = this.userTableData[index].user
          ? this.userTableData[index].user
          : null;
        userJob.dept = this.userTableData[index].dept;
        userJob.remark = this.userTableData[index].remark;
        const sendData = {
          jobDef: this.jobDef,
          usersJobsList: [userJob],
        };
        console.log("启用传递的参数>>>", sendData);
        openUsersJobs(JSON.stringify(sendData)).then((res) => {
          this.$message.success({
            message: "启用岗位成功",
            duration: 2000,
          });
          console.log(2144, res);
          this.getUsersJobs();
          this.cancelCloseJobDef();
        });
      } else if (this.saveStatus === "closeToggleTable") {
        // 切换层级的数据
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
        this.cancelCloseJobDef();
      }
    },
    // 启用
    openJobDef(index) {
      this.closeJobDefDialogVisible = true;
      this.currentIndex = index;
      this.saveStatus = "open";
      const recordData = {
        deptId:
          this.userTableData[index].dept && this.userTableData[index].dept.id,
        jobDefId: this.jobDef.id,
      };
      getJobDefsDeptRecord(recordData).then((res) => {
        this.records = res.content.filter((item) => {
          return item.remark !== "" || item.remark !== null;
        });
      });
    },
    timestampToDate(argument) {
      const now = new Date(argument);
      const y = now.getFullYear();
      const m = now.getMonth() + 1;
      const d = now.getDate();
      return (
        y +
        "-" +
        (m < 10 ? "0" + m : m) +
        "-" +
        (d < 10 ? "0" + d : d) +
        " " +
        now.toTimeString().substr(0, 8)
      );
    },
    // 切换层级后的 关闭和开启
    closeTableJobDef(index) {
      this.closeJobDefDialogVisible = true;
      this.currentIndex = index;
      this.saveStatus = "closeToggleTable";
    },
    // 启用
    openTableJobDef(index) {
      this.$set(this.$data.tableData[index], "disabled", false);
      delete this.$data.tableData[index].remark;
    },
  },
};
</script>

<style scoped>
.view-container {
  margin: 10px;
}
.bottom-btn-groups {
  margin: 0px;
}
.btn-groups {
  margin-left: 40px;
}

.el-form-item_title {
  font-size: 16px;
  color: #333;
}
.query-container {
  position: relative;
  display: flex;
  padding-right: 70px;
}
.query-content {
  margin-right: 10px;
}
.query-container .reset-btn {
  position: absolute;
  right: 0;
  top: 0;
}
.remark-content {
  position: relative;
  padding-bottom: 10px;
  border-bottom: 1px solid #efefef;
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
/deep/ .tree-container,
/deep/ .user-list,
/deep/ .job-list .job-card,
/deep/ .user-list .el-table,
/deep/ .job-list .el-table,
/deep/ .user-list .el-table .cell,
/deep/ .job-list .el-table .cell,
/deep/ .user-list .el-table__body-wrapper,
/deep/ .job-list .el-table__body-wrapper {
  overflow: visible;
}
.user-list .el-table /deep/ .el-table__body-wrapper tr td:nth-child(2),
.user-list
  .el-table
  /deep/
  .el-table__body-wrapper
  tr
  td:nth-child(2)
  .el-tooltip {
  padding-right: 10px;
  overflow: hidden !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: left;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
.edit-base-container .el-form-item--mini.el-form-item {
  margin-bottom: 18px;
}
/*单行超过显示...*/
.more-text {
  width: 100px;
  overflow: hidden !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.line-text-more {
  width: calc(100% - 120px);
  overflow: hidden !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ellipsis-class {
  overflow: hidden !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/*伪类清除浮动*/
.clearfix::after {
  display: block;
  height: 0;
  clear: both;
  font-size: 0;
  visibility: hidden;
  content: " ";
}

/deep/ .el-table__row td:nth-child(1) .cell,
/deep/ .el-table__row td:nth-child(2) .cell {
  overflow: hidden !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/ .user-list .vue-treeselect__control,
/deep/ .query-container .vue-treeselect__control {
  height: 26px;
  line-height: 26px;
}
/deep/ .vue-treeselect__single-value,
/deep/ .vue-treeselect__placeholder {
  margin-top: -4px;
}
/deep/ .holder-value .vue-treeselect__placeholder {
  color: #333;
}
</style>
